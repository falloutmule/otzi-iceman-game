import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("starter reference baseline loads", async ({ page }) => {
  const baseUrl = process.env.OTZI_BASE_URL || "http://127.0.0.1:8099";
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(`${baseUrl}/docs/starter-reference.html`);
  await expect(page.locator("#worldCanvas")).toBeVisible();
  await page.getByRole("button", { name: /start/i }).click();
  await page.keyboard.press("KeyD");

  const snap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(snap.seed).toBeTruthy();
  expect(snap.scene).toBeTruthy();
  expect(snap.player.x).toBeGreaterThan(0);

  await page.screenshot({ path: "artifacts/screenshots/baseline-starter-running.png", fullPage: true });

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
