const { test, expect } = require('@playwright/test');

test('homepage has title and expenses list', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Expense Tracker/);

  // Check if the add expense button exists
  const addButton = page.getByRole('link', { name: 'เพิ่มรายจ่าย' }).first();
  await expect(addButton).toBeVisible();
});
