import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("menu row, village hearth, and crude spear progression work on mobile", async ({ page }) => {
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
  await page.getByRole("button", { name: /start/i }).tap();
  if (await page.locator("#welcomePanel").isVisible()) {
    await page.locator("#welcomeOkBtn").tap();
  }

  await expect(page.locator("#popupBar #mapTab")).toBeVisible();
  await expect(page.locator("#popupBar #menuBtn")).toBeVisible();
  await expect(page.locator("#popupBar #inventoryBtn")).toBeVisible();
  await expect(page.locator("#controls #menuBtn")).toHaveCount(0);

  await page.evaluate(() => {
    OTZI.game.dungeons.flint_scar.completed = true;
    OTZI.village.unlock("toolmaker");
    OTZI.inventory.add("stick", 1);
    OTZI.inventory.add("stone", 1);
    OTZI.inventory.add("bark", 1);
    OTZI.game.enterOverworldScreen(OTZI.game.world.homeX, OTZI.game.world.homeY);
    OTZI.game.updateFocusState();
  });

  await expect(page.locator("#objectiveTitle")).toContainText("Craft a Crude Spear");
  await expect(page.locator("#objectiveText")).toContainText("MENU");
  await page.locator("#menuBtn").tap();
  await expect(page.locator("#menuPanel")).toBeVisible();
  await expect(page.locator("#menuCrudeSpear")).toHaveText("0");
  await page.locator("#craftCrudeSpearBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Crafted Crude Spear");
  await expect(page.locator("#menuCrudeSpear")).toHaveText("1");
  await page.screenshot({ path: "artifacts/screenshots/fire-spear-menu-craft.png", fullPage: true });
  await page.locator("#menuCloseBtn").tap();

  await page.evaluate(() => window.__OTZI_TEST__.teleportToVillageHearth());
  await expect(page.locator("#statusLine")).toContainText("USE: harden spear tip");
  await expect(page.locator("#areaCardTitle")).toContainText("Village Camp");
  await page.screenshot({ path: "artifacts/screenshots/fire-spear-village-hearth.png", fullPage: true });
  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Hardened spear tip");

  const snap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(snap.inventory.crudeSpear).toBe(0);
  expect(snap.inventory.hardenedSpear).toBe(1);
  expect(snap.objective.title).toBe("Prepare for the Hunt");
  await page.screenshot({ path: "artifacts/screenshots/fire-spear-hardened-objective.png", fullPage: true });

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
