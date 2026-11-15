import { test, expect, type Locator } from '@playwright/test';

const image = (width: number, height: number) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#e2e8f0"/><rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="#dc2626" stroke-width="4"/><text x="50%" y="50%" text-anchor="middle" fill="#0f172a" font-size="24">${width} x ${height}</text></svg>`)}`;
const portrait = image(400, 1000);
const landscape = image(1200, 400);
const square = image(600, 600);
const product = {
  id: 'image-regression', name: 'Rasm testi', model: 'TEST-IMAGE', sizes: 'S–XL',
  material: 'Paxta', price: '100 000 UZS', category: 'fashion', desc: 'Rasm testi',
  imageUrl: portrait, images: [portrait, landscape, square],
};

test.beforeEach(async ({ page }) => {
  // Never read or modify production data. All backend calls stay mocked.
  await page.route('https://*.supabase.co/**', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"message":"offline test"}' }));
  await page.route('https://images.unsplash.com/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"/>' }));
  await page.addInitScript(value => {
    localStorage.setItem('sanam_products_v3', JSON.stringify([value]));
    localStorage.setItem('sanam_theme', 'light');
  }, product);
});

async function expectUncropped(img: Locator) {
  await expect(img).toBeVisible();
  await expect(img).toHaveCSS('object-fit', 'contain');
  await expect(img).toHaveCSS('transform', 'none');
  const geometry = await img.evaluate((node: HTMLImageElement) => {
    const rect = node.getBoundingClientRect();
    const parent = node.parentElement!.getBoundingClientRect();
    return { loaded: node.complete && node.naturalWidth > 0, inside: rect.left >= parent.left - 2 && rect.right <= parent.right + 2 && rect.top >= parent.top - 2 && rect.bottom <= parent.bottom + 2 };
  });
  expect(geometry).toEqual({ loaded: true, inside: true });
}

test('cards and opened carousel show the full image, including after hover/navigation', async ({ page }) => {
  await page.goto('/');
  const cardImage = page.locator('#products img[alt="Rasm testi"]');
  await cardImage.scrollIntoViewIfNeeded();
  await cardImage.hover();
  await page.waitForTimeout(600);
  await expectUncropped(cardImage);
  const card = cardImage.locator('..');
  await card.getByRole('button', { name: '›', exact: true }).click({ force: true });
  await expect(cardImage).toHaveAttribute('src', landscape);
  await card.locator('button').first().click();
  const dialog = page.getByRole('dialog');
  const fullImage = dialog.locator('img');
  await expect(fullImage).toHaveAttribute('src', landscape);
  await expectUncropped(fullImage);
  await dialog.getByRole('button', { name: '›', exact: true }).click();
  await expect(fullImage).toHaveAttribute('src', square);
  await expectUncropped(fullImage);
  await dialog.getByRole('button', { name: '›', exact: true }).click();
  await expect(fullImage).toHaveAttribute('src', portrait);
  await expectUncropped(fullImage);
  const dialogBox = await dialog.boundingBox();
  expect(dialogBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(dialogBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('single-image modal uses the same uncropped viewer', async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('sanam_products_v3', JSON.stringify([{ ...value, images: [] }])), product);
  await page.goto('/');
  const card = page.locator('#products img[alt="Rasm testi"]').locator('..');
  await card.locator('button').first().click();
  await expectUncropped(page.getByRole('dialog').locator('img'));
});

test('detail page and thumbnails preserve all image ratios', async ({ page }) => {
  await page.goto('/product?id=image-regression');
  const mainImage = page.locator('main img[alt="Rasm testi"]');
  await mainImage.hover();
  await page.waitForTimeout(600);
  await expectUncropped(mainImage);
  for (const [index, src] of [portrait, landscape, square].entries()) {
    const thumb = page.locator(`main img[alt="Rasm testi - ${index + 1}"]`);
    await thumb.click();
    await expect(mainImage).toHaveAttribute('src', src);
    await expectUncropped(mainImage);
    await expect(thumb).toHaveCSS('object-fit', 'contain');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('detail page supports products with only an images array', async ({ page }) => {
  await page.addInitScript(value => localStorage.setItem('sanam_products_v3', JSON.stringify([{ ...value, imageUrl: '', images: ['', value.images[0], value.images[1]] } ])), product);
  await page.goto('/product?id=image-regression');
  const mainImage = page.locator('main img[alt="Rasm testi"]');
  await expect(mainImage).toHaveAttribute('src', portrait);
  await expectUncropped(mainImage);
});
