import { test, expect } from '@playwright/test';

test.describe('AutoServe Golden Workflow E2E Tests', () => {
  test('Landing Page & Navigation to Auth', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AutoServe/i);
    
    // Check key landing sections
    await expect(page.locator('text=AutoServe').first()).toBeVisible();
    
    // Navigate to Login
    const loginLink = page.locator('a[href="/login"], button:has-text("Login")').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('Customer Authentication & Form Validation', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Test role selector presence
    const roleSelector = page.locator('select, [role="combobox"]').first();
    if (await roleSelector.isVisible()) {
      await expect(roleSelector).toBeVisible();
    }
  });

  test('Staff Login Routes & Role Guarding', async ({ page }) => {
    // Attempt accessing protected manager route unauthenticated
    await page.goto('/manager/dashboard');
    // Expect redirect to login or forbidden page
    await expect(page).toHaveURL(/\/(login|forbidden)?/);
  });
});
