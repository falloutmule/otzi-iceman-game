import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("otzi milestone 1 smoke", async ({ page }) => {
  const baseUrl = process.env.OTZI_BASE_URL || "http://127.0.0.1:8099";
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (
      url.startsWith(baseUrl + "/") ||
      url.startsWith(baseUrl.replace("127.0.0.1", "localhost") + "/") ||
      url.startsWith("data:") ||
      url.startsWith("blob:")
    ) {
      route.continue();
    } else {
      externalRequests.push(url);
      route.abort();
    }
  });

  await page.goto(`${baseUrl}/dist/index.html`);
  await expect(page.locator("#worldCanvas")).toBeVisible();
  await page.getByRole("button", { name: /start/i }).click();
  if (await page.locator("#welcomePanel").isVisible()) {
    await page.locator("#welcomeOkBtn").click();
  }

  const before = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(350);
  await page.keyboard.up("ArrowRight");
  const after = await page.evaluate(() => window.__OTZI_TEST__.snapshot());

  expect(after.player.x).toBeGreaterThan(before.player.x);
  expect(after.scene).toBeTruthy();
  expect(after.seed).toBeTruthy();
  expect(after.viewport.internalW).toBeGreaterThan(0);
  expect(after.viewport.internalH).toBeGreaterThan(0);

  await page.screenshot({ path: "artifacts/screenshots/milestone1-smoke.png", fullPage: true });

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
