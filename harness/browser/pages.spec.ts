import { test, expect } from '@playwright/test';
import contract from '../brand-contract.json';
import { locales, sessions, experiences, founders, getHomeSelection, getStudioSessions, socialLinks } from '../../src/data/site';
import { openPage, loadImages, screenshotEvidence, assertReadableBounds } from './helpers';

for (const locale of locales) {
  for (const route of contract.pages) {
    test(`${locale}${route || '/home'}: public page, content coverage, media and visual evidence`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await openPage(page, `/${locale}${route}`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/The NeoBee Club/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${contract.siteOrigin}/${locale}${route}`);
      for (const language of locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`))
          .toHaveAttribute('href', `${contract.siteOrigin}/${language}${route}`);
      }
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.trim().length).toBeGreaterThan(20);
      await expect(page.locator('video[autoplay], audio[autoplay], iframe[src*="youtube"]')).toHaveCount(0);
      // Parse every public JSON-LD block. Invalid SEO must not pass merely because the page paints.
      const graphs = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes =>
        nodes.flatMap(node => {
          const data = JSON.parse(node.textContent || '');
          return data['@graph'] || [data];
        }));
      expect(graphs.length).toBeGreaterThan(0);

      if (!route) {
        const { featuredSession, selectedSessions, featuredExperience } = getHomeSelection();
        const section = page.locator('#sessions');
        await expect(section.locator('.home-feature-heading h2')).toHaveText(featuredSession.homeFeature.title[locale]);
        await expect(section.getByText(featuredSession.homeFeature.body[locale], { exact: true })).toHaveCount(1);
        await expect(section.locator('.session-card--featured h3')).toHaveCount(0);
        await expect(section.locator('.session-card--featured .session-card__image')).toHaveAttribute('href', featuredSession.youtube);
        expect(await section.locator('.session-grid .session-card__image').evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))))
          .toEqual(selectedSessions.map(s => s.youtube));
        expect(await page.locator('main section[id]').evaluateAll(nodes => nodes.map(n => n.id))).toEqual(contract.homeSections);
        await expect(page.locator('#experiences h2')).toHaveText(featuredExperience.homeFeature.title[locale]);
        await expect(page.locator('.branch-card h3')).toHaveText(['NeoBee Club', 'NeoBee Studio']);
      }
      if (route === '/club' || route === '/archive') {
        await expect(page.locator('.session-card')).toHaveCount(sessions.length);
        for (const session of sessions) {
          const card = page.locator('.session-card').filter({ has: page.locator(`a[href="${session.youtube}"]`) });
          await expect(card.locator('h3')).toHaveText(session.title);
          await expect(card.locator('p')).toHaveText(session.description[locale]);
        }
      }
      if (route === '/archive') {
        await expect(page.locator('.experience-card')).toHaveCount(experiences.length);
        const videos = graphs.filter(item => item['@type'] === 'VideoObject');
        expect(videos.map(v => v.contentUrl)).toEqual(sessions.map(s => s.youtube));
        for (const session of sessions) {
          const video = videos.find(v => v.contentUrl === session.youtube);
          expect(video?.name).toBe(session.title);
          expect(video?.description).toBe(session.description[locale]);
          expect(video?.thumbnailUrl).toEqual([`${contract.siteOrigin}${session.image}`]);
        }
      }
      if (route === '/studio') {
        expect(await page.locator('.portfolio-grid a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))))
          .toEqual(getStudioSessions().map(s => s.youtube));
      }
      if (route === '/about') {
        for (const founder of founders) {
          await expect(page.getByRole('heading', { name: founder.name, exact: true })).toHaveCount(1);
          for (const social of founder.socials) await expect(page.locator(`main a[href="${social.href}"]`)).toHaveCount(1);
        }
      }
      await expect(page.locator(`footer a[href="${socialLinks.email}"]`)).toHaveCount(1);
      await loadImages(page);
      await assertReadableBounds(page);
      await screenshotEvidence(page, info, `${locale}-${route.slice(1) || 'home'}-${info.project.name}`);
      expect(errors, 'No uncaught browser errors').toEqual([]);
    });
  }
}

test('Published discovery endpoints include both languages and every session', async ({ request }, info) => {
  test.skip(info.project.name !== 'chromium-desktop', 'Endpoint contract is browser independent');
  for (const endpoint of ['/robots.txt', '/sitemap.xml', '/video-sitemap.xml', '/image-sitemap.xml']) {
    const response = await request.get(endpoint);
    expect(response.status(), endpoint).toBe(200);
    const content = await response.text();
    expect(content).not.toContain('localhost');
    expect(content).not.toContain('127.0.0.1');
    if (endpoint === '/sitemap.xml') {
      for (const locale of locales) for (const route of contract.pages) expect(content).toContain(`${contract.siteOrigin}/${locale}${route}`);
    }
    if (endpoint === '/video-sitemap.xml') for (const session of sessions) expect(content).toContain(new URL(session.youtube).searchParams.get('v')!);
    if (endpoint === '/image-sitemap.xml') for (const session of sessions) expect(content).toContain(session.image);
  }
});
