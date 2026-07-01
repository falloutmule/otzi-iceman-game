import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("milestone 1 mobile controls are visible and responsive", async ({ page }) => {
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
  await page.getByRole("button", { name: /start/i }).tap();
  await expect(page.locator("#startPanel")).toBeHidden();
  await expect(page.locator("#gameShell")).toBeVisible();
  await expect(page.locator("#hudStrip")).toBeVisible();
  await expect(page.locator("#controls")).toBeVisible();
  const gameBox = await page.locator("#gameShell").boundingBox();
  const controlsBox = await page.locator("#controls").boundingBox();
  expect(gameBox).toBeTruthy();
  expect(controlsBox).toBeTruthy();
  expect(controlsBox.y).toBeGreaterThan(gameBox.y + gameBox.height - 2);
  await page.screenshot({ path: "artifacts/screenshots/layout-bottom-controls.png", fullPage: true });

  const initial = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("No resource nearby");
  await expect(page.locator("#inventoryChip")).toContainText("FLINT: 0");
  const afterFailedUse = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterFailedUse.inventory.flint || 0).toBe(initial.inventory.flint || 0);
  await page.screenshot({ path: "artifacts/screenshots/gather-fail-no-resource.png", fullPage: true });

  await page.evaluate(() => window.__OTZI_TEST__.teleportToNearestResource());
  const nearResource = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(nearResource.nearestResource?.resource).toBe("flint");
  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Gathered flint +1");
  await expect(page.locator("#inventoryChip")).toContainText("FLINT: 1");
  const afterUse = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterUse.inventory.flint).toBe((initial.inventory.flint || 0) + 1);
  expect(afterUse.nearestResource).toBeNull();
  await page.screenshot({ path: "artifacts/screenshots/gather-success-flint.png", fullPage: true });

  await page.locator("#mapTab").tap();
  await expect(page.locator("#minimapPanel")).toBeVisible();
  const afterMap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterMap.minimap).toBe(true);
  await page.screenshot({ path: "artifacts/screenshots/map-tab-open.png", fullPage: true });

  await page.locator("#menuBtn").tap();
  await expect(page.locator("#menuPanel")).toBeVisible();
  await expect(page.locator("#menuPanel")).toContainText("control path works");
  const afterMenuOpen = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterMenuOpen.menuOpen).toBe(true);
  expect(afterMenuOpen.input.sprintHeld).toBe(false);
  await page.screenshot({ path: "artifacts/screenshots/menu-placeholder.png", fullPage: true });
  await page.locator("#menuCloseBtn").tap();
  await expect(page.locator("#menuPanel")).toBeHidden();

  const beforeSprint = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.locator("#sprintBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Dodge/Sprint burst");
  const afterSprint = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterSprint.player.stamina).toBeLessThan(beforeSprint.player.stamina);
  expect(afterSprint.input.sprintHeld).toBe(false);

  const beforeMove = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  const zone = await page.locator("#moveZone").boundingBox();
  expect(zone).toBeTruthy();
  const cx = zone.x + zone.width / 2;
  const cy = zone.y + zone.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 52, cy + 28, { steps: 8 });
  await page.waitForTimeout(420);
  const duringMove = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.screenshot({ path: "artifacts/screenshots/joystick-bottom-panel.png", fullPage: true });
  await page.mouse.up();
  await page.waitForTimeout(80);
  const afterMoveRelease = await page.evaluate(() => window.__OTZI_TEST__.snapshot());

  expect(duringMove.player.x).toBeGreaterThan(beforeMove.player.x);
  expect(duringMove.input.movePointerActive).toBe(true);
  expect(afterMoveRelease.input.pointerCount).toBe(0);
  expect(afterMoveRelease.input.movePointerActive).toBe(false);

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
