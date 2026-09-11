import { expect, test, type Locator, type Page } from '@playwright/test';

type Position = { left: number; right: number };
type ProbedElement = HTMLElement & {
  __harnessMotion?: { positions: Position[]; observer: MutationObserver };
};

const hero = (page: Page) => page.getByRole('button', { name: /^(Interactive bilingual title|互动双语标题)/ });

async function position(stage: Locator): Promise<Position> {
  return stage.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      left: Number.parseFloat(style.getPropertyValue('--hero-left')),
      right: Number.parseFloat(style.getPropertyValue('--hero-right'))
    };
  });
}

async function observePositions(stage: Locator) {
  await stage.evaluate((element) => {
    const node = element as ProbedElement;
    node.__harnessMotion?.observer.disconnect();
    const positions: Position[] = [];
    const record = () => {
      const style = getComputedStyle(node);
      positions.push({
        left: Number.parseFloat(style.getPropertyValue('--hero-left')),
        right: Number.parseFloat(style.getPropertyValue('--hero-right'))
      });
    };
    const observer = new MutationObserver(record);
    node.__harnessMotion = { positions, observer };
    observer.observe(node, { attributes: true, attributeFilter: ['style'] });
    record();
  });
}

async function recordedPositions(stage: Locator): Promise<Position[]> {
  return stage.evaluate((element) => (element as ProbedElement).__harnessMotion?.positions ?? []);
}

async function expectRestored(stage: Locator, rest: Position) {
  await expect.poll(async () => (await position(stage)).left).toBeCloseTo(rest.left, 0);
  await expect.poll(async () => (await position(stage)).right).toBeCloseTo(rest.right, 0);
}

async function expectFullScan(stage: Locator, rest: Position, touch: boolean) {
  const farEdge = touch ? 68 : 72;
  await expect.poll(async () => (await recordedPositions(stage)).some(({ left }) => Math.abs(left - farEdge) < 2), {
    message: 'The scanner should travel to the far edge before returning'
  }).toBe(true);
  await expect.poll(async () => (await recordedPositions(stage)).some(({ left }) => left < 2), {
    message: 'The scanner should also reach the beginning of the title'
  }).toBe(true);
  await expectRestored(stage, rest);
}

async function samplePositionWindow(stage: Locator, durationMs: number): Promise<Position[]> {
  return stage.evaluate((element, duration) => new Promise<Position[]>((resolve) => {
    const samples: Position[] = [];
    const started = performance.now();
    const sample = () => {
      const style = getComputedStyle(element);
      samples.push({
        left: Number.parseFloat(style.getPropertyValue('--hero-left')),
        right: Number.parseFloat(style.getPropertyValue('--hero-right'))
      });
      if (performance.now() - started >= duration) resolve(samples);
      else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }), durationMs);
}

function expectStationary(samples: Position[], rest: Position) {
  expect(samples.length).toBeGreaterThan(1);
  for (const sample of samples) {
    expect(sample.left).toBeCloseTo(rest.left, 1);
    expect(sample.right).toBeCloseTo(rest.right, 1);
  }
}

async function dismissAutomaticDemo(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('neobee-hero-demo-seen', 'true'));
}

async function expectSectionBelowIndex(page: Page, id: string) {
  await expect.poll(async () => page.locator(`#${id}`).evaluate((section) => {
    const index = document.querySelector('.home-index');
    if (!index) return false;
    const top = section.getBoundingClientRect().top;
    const bottom = index.getBoundingClientRect().bottom;
    return top >= bottom - 2 && top <= bottom + 48;
  })).toBe(true);
}

test('skip link semantics and locale navigation preserve the current page', async ({ page, isMobile }) => {
  await page.goto('/en/studio');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toHaveAttribute('href', '#main-content');
  await expect(page.locator('#main-content')).toHaveCount(1);
  if (!isMobile) {
    // Native first-Tab behavior belongs to the desktop keyboard project;
    // mobile WebKit does not model a desktop browser's full keyboard access.
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/en\/studio#main-content$/);
  }

  const language = page.locator('.language-link');
  await expect(language).toHaveAttribute('href', '/zh/studio');
  if (isMobile) await language.tap();
  else {
    await language.focus();
    await expect(language).toBeFocused();
    await language.press('Enter');
  }
  await expect(page).toHaveURL(/\/zh\/studio$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
  await expect(language).toHaveText('EN');
  await expect(language).toHaveAttribute('href', '/en/studio');
  if (isMobile) await language.tap();
  else {
    await language.focus();
    await expect(language).toBeFocused();
    await language.press('Enter');
  }
  await expect(page).toHaveURL(/\/en\/studio$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('mobile navigation and bilingual page index open, navigate and close', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile controls are intentionally absent from the desktop layout');
  for (const locale of ['en', 'zh']) {
    await page.goto(`/${locale}/studio`);
    const menu = page.locator('.menu-button');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.tap();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(navigation).toBeVisible();
    await navigation.locator(`a[href="/${locale}/archive"]`).tap();
    await expect(page).toHaveURL(new RegExp(`/${locale}/archive$`));
    await expect(navigation).toHaveCount(0);
    await expect(menu).toHaveAttribute('aria-expanded', 'false');

    await page.locator('.brand-lockup').tap();
    await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    const index = page.getByRole('navigation', { name: locale === 'en' ? 'On this page' : '本页目录' });
    const toggle = index.getByRole('button', { name: locale === 'en' ? 'Open page index' : '打开本页目录' });
    const panel = page.locator('#home-index-panel');
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
    await expect(panel.locator('a').first()).toHaveAttribute('tabindex', '-1');
    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toHaveAttribute('aria-hidden', 'false');
    const sessions = panel.locator('a[href="#sessions"]');
    await expect(sessions).toHaveAttribute('tabindex', '0');
    await expect(sessions).toBeVisible();
    await sessions.tap();
    await expect(page).toHaveURL(new RegExp(`/${locale}#sessions$`));
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
    await expect(sessions).toHaveAttribute('aria-current', 'location');
    await expectSectionBelowIndex(page, 'sessions');
  }
});

test('wide and compact page indexes are keyboard navigable without covering the section', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Use the desktop keyboard project; touch navigation is tested separately');
  await page.goto('/en');
  const sessions = page.locator('.home-index__desktop a[href="#sessions"]');
  await sessions.focus();
  await sessions.press('Enter');
  await expect(page).toHaveURL(/\/en#sessions$/);
  await expect(sessions).toHaveAttribute('aria-current', 'location');
  await expectSectionBelowIndex(page, 'sessions');

  // Keep keyboard coverage for the compact dropdown even though touch projects
  // exercise actual taps. Wait for the opened link to be visible and focused;
  // focus()/press() alone can activate the old toggle during its transition.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  const toggle = page.getByRole('button', { name: 'Open page index' });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.focus();
  await expect(toggle).toBeFocused();
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const compactSessions = page.locator('#home-index-panel a[href="#sessions"]');
  await expect(compactSessions).toBeVisible();
  await compactSessions.focus();
  await expect(compactSessions).toBeFocused();
  await compactSessions.press('Enter');
  await expect(page).toHaveURL(/\/en#sessions$/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(compactSessions).toHaveAttribute('aria-current', 'location');
  await expectSectionBelowIndex(page, 'sessions');
});

test('reduced motion keeps both title languages available and does not scan on activation', async ({ page, isMobile }) => {
  for (const locale of ['en', 'zh'] as const) {
    await page.goto(`/${locale}`);
    const stage = hero(page);
    await expect(stage).toBeVisible();
    const title = locale === 'en' ? 'Sound. Space. Culture.' : '声音。空间。文化。';
    await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toHaveCount(1);
    const layers = stage.locator(':scope > span').filter({ has: page.locator('b') });
    await expect(layers).toHaveCount(2);
    await expect(layers.first().locator('b')).toHaveText(locale === 'en'
      ? ['SOUND.', 'SPACE.', 'CULTURE.'] : ['声音。', '空间。', '文化。']);
    const translation = await layers.last().textContent();
    for (const word of locale === 'en' ? ['声音。', '空间。', '文化。'] : ['SOUND.', 'SPACE.', 'CULTURE.']) {
      expect(translation).toContain(word);
    }
    const rest = isMobile ? { left: 84, right: 100 } : locale === 'en' ? { left: 16, right: 44 } : { left: 34, right: 66 };
    await expectRestored(stage, rest);
    await stage.focus();
    await expect(stage).toBeFocused();
    await stage.press('Enter');
    await expectRestored(stage, rest);
    expectStationary(await samplePositionWindow(stage, 250), rest);
  }
});

test.describe('deliberate hero motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('keyboard activation scans both edges then restores the resting position', async ({ page, isMobile }) => {
    await dismissAutomaticDemo(page);
    await page.goto('/en');
    const stage = hero(page);
    const rest = isMobile ? { left: 84, right: 100 } : { left: 16, right: 44 };
    await expectRestored(stage, rest);
    await stage.focus();
    await expect(stage).toBeFocused();
    await observePositions(stage);
    await stage.press('Enter');
    await expectFullScan(stage, rest, isMobile);
  });

  test('desktop pointer and drag persist; clicking scans and returns to the pointer', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Fine-pointer behavior is a desktop contract');
    await dismissAutomaticDemo(page);
    await page.goto('/zh');
    const stage = hero(page);
    await stage.scrollIntoViewIfNeeded();
    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    const y = box.y + box.height / 2;
    const pointerX = box.x + box.width * 0.62;
    await page.mouse.move(pointerX, y);
    const pointed = { left: 48, right: 76 };
    await expectRestored(stage, pointed);
    await page.mouse.move(0, 0);
    expectStationary(await samplePositionWindow(stage, 650), pointed);

    await page.mouse.move(pointerX, y);
    await expectRestored(stage, pointed);
    await observePositions(stage);
    await page.mouse.click(pointerX, y);
    await expectFullScan(stage, pointed, false);

    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.4, y, { steps: 8 });
    await page.mouse.up();
    const dragged = { left: 26, right: 54 };
    await expectRestored(stage, dragged);
    await page.mouse.move(0, 0);
    expectStationary(await samplePositionWindow(stage, 650), dragged);
  });

  test('touch activation scans and returns to the readable mobile rest position', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Touch devices use the mobile scan path');
    await dismissAutomaticDemo(page);
    await page.goto('/zh');
    const stage = hero(page);
    const rest = { left: 84, right: 100 };
    await expectRestored(stage, rest);
    await observePositions(stage);
    await stage.tap();
    await expectFullScan(stage, rest, true);
  });

  test('the mobile handle follows a genuine Chromium touch drag without launching a scan', async ({ page, context, browserName, isMobile }) => {
    test.skip(!isMobile || browserName !== 'chromium', 'Continuous touch dispatch uses Chromium CDP; WebKit drag feel remains a real-device review');
    await dismissAutomaticDemo(page);
    await page.goto('/zh');
    const stage = hero(page);
    await expectRestored(stage, { left: 84, right: 100 });
    const handle = stage.locator('[data-hero-handle]');
    await handle.scrollIntoViewIfNeeded();
    await expect(handle).toBeVisible();
    const handleBox = await handle.boundingBox();
    const stageBox = await stage.boundingBox();
    expect(handleBox).not.toBeNull();
    expect(stageBox).not.toBeNull();
    if (!handleBox || !stageBox) return;
    const y = handleBox.y + handleBox.height / 2;
    const startX = handleBox.x + handleBox.width / 2;
    const endX = stageBox.x + stageBox.width * 0.4;
    const cdp = await context.newCDPSession(page);
    try {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y, id: 1 }] });
      for (let step = 1; step <= 6; step++) {
        await cdp.send('Input.dispatchTouchEvent', {
          type: 'touchMove', touchPoints: [{ x: startX + (endX - startX) * step / 6, y, id: 1 }]
        });
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      const dragged = { left: 24, right: 56 };
      await expectRestored(stage, dragged);
      expectStationary(await samplePositionWindow(stage, 650), dragged);
    } finally {
      await cdp.detach();
    }
  });

  test('the entrance demonstration runs once per browser session', async ({ page, isMobile }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    const stage = hero(page);
    await expect(stage).toBeVisible();
    await observePositions(stage);
    const rest = isMobile ? { left: 84, right: 100 } : { left: 16, right: 44 };
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('neobee-hero-demo-seen'))).toBe('true');
    await expectFullScan(stage, rest, isMobile);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expectRestored(stage, rest);
    expect(await page.evaluate(() => sessionStorage.getItem('neobee-hero-demo-seen'))).toBe('true');
    // A negative assertion must observe beyond the authored 900ms entrance trigger.
    // Sample actual frames instead of waiting an assumed animation completion time.
    expectStationary(await samplePositionWindow(stage, 1500), rest);
  });
});
