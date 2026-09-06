import { test, expect } from '@playwright/test';

// All requests that would submit contact details are intercepted.
test('project filters combine with search and provide an empty state', async ({ page }) => {
  await page.goto('/playground.html');
  await page.getByRole('button', { name: 'Hardware', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(1);
  await page.getByRole('searchbox').fill('missing project');
  await expect(page.locator('#no-projects')).toBeVisible();
  await page.getByRole('searchbox').fill('');
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(11);
});

test('certificate dialog supports keyboard access, navigation, and focus return', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('[data-certificate]').first();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#certificate-dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page.locator('#certificate-title')).toHaveText('Generative AI Specialization');
  await page.getByRole('button', { name: 'Zoom', exact: true }).click();
  await expect(page.locator('#certificate-zoom')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('contact validates input and distinguishes acknowledged success from failure', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#contact-input');
  const send = page.getByRole('button', { name: 'Send ↗' });
  await input.fill('invalid');
  await send.click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await page.route('**/api/contact', route => route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await input.fill('test@example.com');
  await send.click();
  await expect(page.locator('#contact-status')).toContainText('Couldn’t send');
  await expect(input).toHaveValue('test@example.com');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }));
  await send.click();
  await expect(page.locator('#contact-status')).toContainText('received');
  await expect(input).toHaveValue('');
});

test('appearance persists and mobile layout does not overflow', async ({ page }) => {
  await page.goto('/');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole('button', { name: 'Appearance and sharing settings' }).click();
  await page.getByRole('switch', { name: 'Dark appearance' }).check();
  await page.getByRole('switch', { name: 'High contrast' }).check();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-contrast', 'true');
});

test('all project and work pages load without script errors or mobile overflow', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  const pages = ['kit', 'rabbithole', 'foodbuddy', 'fileops', 'blinkit-tools', 'openupi', 'duomaxxing', 'dwaar', 'blindpay-esp32', 'pdf-proofreader', 'gg-eink', 'n8n-automations', 'work-product-launches', 'work-user-growth', 'work-compliance', 'work-ux-enhancement', 'work-upi-autopay', 'work-analytics'];
  for (const slug of pages) {
    const response = await page.goto(`/projects/${slug}.html`);
    expect(response.status()).toBe(200);
    await expect(page.locator('.article-header h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
