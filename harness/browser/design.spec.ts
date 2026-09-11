import { test, expect } from '@playwright/test';
import contract from '../brand-contract.json';
import { locales } from '../../src/data/site';
import { openPage, loadImages, screenshotEvidence, assertReadableBounds } from './helpers';

for (const locale of locales) for (const width of contract.responsiveWidths) {
  test(`${locale} ${width}px: type roles, palette, spacing and editorial composition`, async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium-desktop', 'Width matrix runs once; touch/WebKit have separate full-page coverage');
    await page.setViewportSize({ width, height: 1000 });
    await openPage(page, `/${locale}`);
    await loadImages(page);
    await assertReadableBounds(page);
    const metrics = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const heading = document.querySelector('.home-feature-heading h2')!;
      const body = document.querySelector('.home-feature-heading > p:last-child')!;
      const image = document.querySelector('.session-card--featured .session-card__image')!;
      const meta = document.querySelector('.session-card--featured .session-card__meta')!;
      const feature = document.querySelector('.home-feature-layout')!;
      const selected = document.querySelector('.home-session-archive__intro')!;
      const h = heading.getBoundingClientRect();
      const p = body.getBoundingClientRect();
      const m = image.getBoundingClientRect();
      const type = getComputedStyle(heading);
      const loadedFonts: string[] = [];
      document.fonts.forEach(font => { if (font.status === 'loaded') loadedFonts.push(font.family); });
      return {
        loadedFonts,
        colours: Object.fromEntries(['--ink', '--paper', '--paper-deep', '--white', '--accent', '--signal'].map(key => [key, root.getPropertyValue(key).trim()])),
        renderedColours: {
          paper: getComputedStyle(document.body).backgroundColor,
          ink: getComputedStyle(document.body).color,
          darkSection: getComputedStyle(document.querySelector('.branches-section')!).backgroundColor,
          darkText: getComputedStyle(document.querySelector('.branches-section')!).color,
          play: getComputedStyle(document.querySelector('.play-mark')!).backgroundColor
        },
        headingFont: type.fontFamily,
        bodyFont: getComputedStyle(body).fontFamily,
        headingWeight: Number(type.fontWeight),
        lineHeightRatio: parseFloat(type.lineHeight) / parseFloat(type.fontSize),
        titleToBody: p.top - h.bottom,
        imageToMetadata: meta.getBoundingClientRect().top - m.bottom,
        featureToSelected: selected.getBoundingClientRect().top - feature.getBoundingClientRect().bottom,
        sideBySide: m.right <= h.left,
        stackedInOrder: p.bottom <= m.top,
        phraseBounds: Array.from(heading.querySelectorAll('span')).map(span => {
          const r = document.createRange();
          r.selectNodeContents(span);
          const rects = Array.from(r.getClientRects()).filter(rect => rect.width > 0);
          return { lines: new Set(rects.map(rect => Math.round(rect.top))).size, withinColumn: rects.every(rect => rect.right <= h.right + 1) };
        })
      };
    });
    await info.attach('design-metrics', { body: JSON.stringify(metrics, null, 2), contentType: 'application/json' });
    // Capture the relevant region before asserting, so failures show the affected layout too.
    await screenshotEvidence(page, info, `${locale}-${width}-featured`, '.home-feature-layout');
    await screenshotEvidence(page, info, `${locale}-${width}-experience`, '#experiences');
    await screenshotEvidence(page, info, `${locale}-${width}-hero`, '.home-hero');
    expect(metrics.colours).toEqual(contract.colours);
    const rgb = (hex: string) => `rgb(${[1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16)).join(', ')})`;
    expect(metrics.renderedColours).toEqual({
      paper: rgb(contract.colours['--paper']), ink: rgb(contract.colours['--ink']),
      darkSection: rgb(contract.colours['--ink']), darkText: rgb(contract.colours['--white']),
      play: rgb(contract.colours['--signal'])
    });
    expect(metrics.headingFont.split(',')[0]).toContain(contract.fonts.display);
    expect(metrics.bodyFont.split(',')[0]).toContain(locale === 'zh' ? contract.fonts.chinese : contract.fonts.body);
    for (const font of [contract.fonts.display, locale === 'zh' ? contract.fonts.chinese : contract.fonts.body]) {
      expect(metrics.loadedFonts.some(family => family.includes(font)), `${font} must actually load, not silently fall back`).toBe(true);
    }
    expect(metrics.headingWeight).toBe(locale === 'zh' || width > 760 ? 700 : 600);
    expect(metrics.lineHeightRatio).toBeGreaterThanOrEqual(locale === 'zh' ? 1.1 : 1.0);
    expect(metrics.lineHeightRatio).toBeLessThanOrEqual(1.25);
    const within = (value: number, bounds: number[], label: string) => {
      expect(value, label).toBeGreaterThanOrEqual(bounds[0]);
      expect(value, label).toBeLessThanOrEqual(bounds[1]);
    };
    within(metrics.titleToBody, contract.featuredSpacing.titleToBody, 'Title and supporting copy form a readable group');
    within(metrics.imageToMetadata, contract.featuredSpacing.imageToMetadata, 'Media metadata belongs to its image');
    within(metrics.featureToSelected, width <= 760 ? contract.featuredSpacing.featureToSelectedMobile : contract.featuredSpacing.featureToSelectedDesktop, 'Related groups have a deliberate pause');
    expect(width > 1040 ? metrics.sideBySide : metrics.stackedInOrder, 'Editorial layout switches without losing reading order').toBe(true);
    for (const phrase of metrics.phraseBounds) {
      expect(phrase.lines, 'Chinese short phrases should remain intact').toBe(1);
      expect(phrase.withinColumn, 'Intact phrases must also fit their text column').toBe(true);
    }
  });
}
