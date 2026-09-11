import { expect, type Page, type TestInfo } from '@playwright/test';

export async function openPage(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status(), path).toBe(200);
  await page.evaluate(() => document.fonts.ready);
}

export async function loadImages(page: Page) {
  for (const img of await page.locator('img').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(node => node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0), {
      message: `Image must decode: ${await img.getAttribute('alt')}`
    }).toBe(true);
    expect(await img.getAttribute('alt')).not.toBeNull();
  }
}

export async function screenshotEvidence(page: Page, info: TestInfo, name: string, selector?: string) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const path = info.outputPath(`${name}.png`);
  if (selector) {
    // Crop the document at its natural scroll position. Element screenshots scroll
    // tall regions under sticky navigation and can produce misleading overlays.
    const clip = await page.locator(selector).evaluate(element => {
      const box = element.getBoundingClientRect();
      return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
    });
    await page.screenshot({ path, fullPage: true, clip, animations: 'disabled' });
  } else {
    await page.screenshot({ path, fullPage: true, animations: 'disabled' });
  }
  await info.attach(name, { path, contentType: 'image/png' });
}

export async function assertReadableBounds(page: Page) {
  const errors = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const failures: string[] = [];
    if (document.documentElement.scrollWidth > width + 1) failures.push('Page has horizontal overflow');
    // Text ranges also catch overflow hidden by an ancestor; decorative/translated animation layers are excluded.
    for (const element of document.querySelectorAll('main h1, main h2, main h3, main p')) {
      if (element.closest('[aria-hidden="true"]') || !element.getClientRects().length) continue;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent?.trim() || node.parentElement?.closest('[aria-hidden="true"]')) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (rect.width > 0 && (rect.left < -2 || rect.right > width + 2)) {
            failures.push(`${element.tagName}: ${node.textContent.trim().slice(0, 65)} [${Math.round(rect.left)}, ${Math.round(rect.right)}] at ${width}px`);
          }
        }
      }
    }
    return failures;
  });
  expect(errors, 'Readable text must stay in the viewport, not just be clipped').toEqual([]);
}
