import { expect, test } from '@playwright/test';

test.describe('Landing (vista pública)', () => {
  test('carga con el título y la marca', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /organize your life/i }).first()).toBeVisible();
    await expect(page.getByText('Life&Tasks').first()).toBeVisible();
  });

  test('navega al registro desde el CTA principal', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^get started$/i }).first().click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('navega al login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^log in$/i }).first().click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('el toggle de idioma cambia el texto', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^get started$/i }).first()).toBeVisible();
    await page.locator('app-lang-toggle .toggle-pill').click();
    await expect(page.getByRole('link', { name: /^empezar$/i }).first()).toBeVisible();
  });

  test('el toggle de tema cambia el atributo data-theme en html', async ({ page }) => {
    await page.goto('/');
    const initial = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.locator('app-theme-toggle .toggle-pill').click();
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(after).not.toBe(initial);
  });
});
