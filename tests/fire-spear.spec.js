import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("menu row, hearth mission, and spear throw loop work on mobile", async ({ page }) => {
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
  await expect(page.locator("#popupBar #craftBtn")).toBeVisible();
  await expect(page.locator("#popupBar #systemBtn")).toBeVisible();
  await expect(page.locator("#popupBar")).not.toContainText("PACK");
  await expect(page.locator("#controls #menuBtn")).toHaveCount(0);
  await expect(page.locator("#controls #toolBtn")).toBeVisible();

  await page.locator("#systemBtn").tap();
  await expect(page.locator("#systemPanel")).toBeVisible();
  await expect(page.locator("#giveSpearMaterialsBtn")).toBeVisible();
  await expect(page.locator("#goVillageHearthBtn")).toBeVisible();
  await expect(page.locator("#goAnimalClearingBtn")).toBeVisible();
  await expect(page.locator("#goFlintScarBtn")).toBeVisible();
  await expect(page.locator("#unlockToolmakerBtn")).toBeVisible();
  await page.screenshot({ path: "artifacts/screenshots/system-test-tools.png", fullPage: true });
  await page.locator("#unlockToolmakerBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Toolmaker unlocked for test");
  await page.locator("#systemCloseBtn").tap();

  await expect(page.locator("#objectiveTitle")).toContainText("Craft a Crude Spear");
  await expect(page.locator("#objectiveText")).toContainText("1 stick, 1 stone, and 1 bark");
  await page.locator("#craftBtn").tap();
  await expect(page.locator("#craftPanel")).toBeVisible();
  await expect(page.locator("#recipeCrudeSpearNeeds")).toContainText("1 Stick, 1 Stone, 1 Bark");
  await expect(page.locator("#recipeCrudeSpearHave")).toContainText("Stick 0 / 1");
  await expect(page.locator("#recipeCrudeSpearMissing")).toContainText("1 Stick, 1 Stone, 1 Bark");
  await expect(page.locator("#craftCrudeSpearBtn")).toBeEnabled();
  await page.locator("#craftCrudeSpearBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Need 1 Stick, 1 Stone, 1 Bark");
  await expect(page.locator("#recipeHardenSpearNeeds")).toContainText("1 Crude Spear + Village Hearth");
  await expect(page.locator("#hardenSpearBtn")).toBeEnabled();
  await page.locator("#hardenSpearBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Craft a crude spear first");
  await page.screenshot({ path: "artifacts/screenshots/recipe-cards-visible.png", fullPage: true });
  await page.locator("#craftCloseBtn").tap();

  await page.locator("#systemBtn").tap();
  await page.locator("#giveSpearMaterialsBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("spear materials added");
  await page.locator("#systemCloseBtn").tap();

  await page.locator("#craftBtn").tap();
  await expect(page.locator("#craftCrudeSpear")).toHaveText("0");
  await expect(page.locator("#craftCrudeSpearBtn")).toBeEnabled();
  await page.screenshot({ path: "artifacts/screenshots/crude-spear-craftable.png", fullPage: true });
  await page.locator("#craftCrudeSpearBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Crafted Crude Spear");
  await expect(page.locator("#craftCrudeSpear")).toHaveText("1");
  await page.locator("#equipCrudeSpearBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Equipped crude spear");
  await page.keyboard.press("KeyF");
  await expect(page.locator("#statusLine")).not.toContainText("spear lost");
  await expect(page.locator("#craftCrudeSpear")).toHaveText("1");
  await page.screenshot({ path: "artifacts/screenshots/fire-spear-menu-craft.png", fullPage: true });
  await page.locator("#craftCloseBtn").tap();

  await page.locator("#systemBtn").tap();
  await page.locator("#goVillageHearthBtn").tap();
  await page.locator("#systemCloseBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("USE: harden spear tip");
  await expect(page.locator("#areaCardTitle")).toContainText("Village Camp");
  await page.screenshot({ path: "artifacts/screenshots/fire-spear-village-hearth.png", fullPage: true });
  await page.locator("#craftBtn").tap();
  await expect(page.locator("#hardenSpearBtn")).toBeEnabled();
  await page.locator("#hardenSpearBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Hardened spear tip");
  await expect(page.locator("#equipHint")).toContainText("Hardened spear equipped");
  await page.screenshot({ path: "artifacts/screenshots/hardened-spear-equipped.png", fullPage: true });
  await page.locator("#craftCloseBtn").tap();
  await expect(page.locator("#craftPanel")).toBeHidden();

  const snap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(snap.inventory.crudeSpear).toBe(0);
  expect(snap.inventory.hardenedSpear).toBe(1);
  expect(snap.equipment.spear).toBe("hardenedSpear");
  expect(snap.objective.title).toBe("Hunt Small Game");
  await page.screenshot({ path: "artifacts/screenshots/fire-spear-hardened-objective.png", fullPage: true });

  await page.locator("#systemBtn").tap();
  await page.locator("#goAnimalClearingBtn").tap();
  await page.locator("#systemCloseBtn").tap();
  await page.evaluate(() => window.__OTZI_TEST__.teleportNearHare());
  await expect(page.locator("#statusLine")).toContainText("THROW: hunt");
  await page.locator("#systemBtn").tap();
  await expect(page.locator("#systemPanel")).toBeVisible();
  await page.keyboard.press("KeyE");
  await expect(page.locator("#statusLine")).not.toContainText("Returned to forest");
  await expect(page.locator("#statusLine")).not.toContainText("Gathered");
  await expect(page.locator("#saveNowBtn")).toBeVisible();
  await expect(page.locator("#exportSaveBtn")).toBeVisible();
  await expect(page.locator("#importSaveBtn")).toBeVisible();
  await page.locator("#saveNowBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Save written");
  await page.locator("#exportSaveBtn").tap();
  const exported = await page.locator("#saveDataBox").inputValue();
  expect(exported.length).toBeGreaterThan(10);
  await page.locator("#systemCloseBtn").tap();
  const beforeThrow = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.locator("#toolBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("downed");
  const afterThrow = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterThrow.inventory.rawMeat || 0).toBe(beforeThrow.inventory.rawMeat || 0);
  expect(afterThrow.progress.smallGameHunts).toBe(1);
  await page.screenshot({ path: "artifacts/screenshots/fire-spear-small-game-carcass.png", fullPage: true });
  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Harvested hare +1 raw meat");
  const afterHarvest = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterHarvest.inventory.rawMeat).toBe((beforeThrow.inventory.rawMeat || 0) + 1);
  expect(afterHarvest.objective.title).toBe("Cook Raw Meat");
  await expect(page.locator("#objectiveTitle")).toContainText("Cook Raw Meat");
  await page.evaluate(() => window.__OTZI_TEST__.teleportToVillageHearth());
  await expect(page.locator("#statusLine")).toContainText("USE: cook raw meat");
  await page.locator("#craftBtn").tap();
  await expect(page.locator("#recipeCookMeatNeeds")).toContainText("1 Raw Meat + Village Hearth");
  await expect(page.locator("#cookMeatBtn")).toBeEnabled();
  await page.locator("#cookMeatBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Cooked raw meat +1 food");
  await page.locator("#craftCloseBtn").tap();
  const afterCook = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterCook.inventory.rawMeat).toBe(0);
  expect(afterCook.inventory.food).toBeGreaterThan(beforeThrow.inventory.food || 0);
  expect(afterCook.objective.title).toBe("Explore");
  await page.screenshot({ path: "artifacts/screenshots/fire-spear-small-game-hunt.png", fullPage: true });

  const saved = await page.evaluate(() => window.__OTZI_TEST__.saveNow());
  expect(saved).toBe(true);
  await page.reload();
  await page.getByRole("button", { name: /start/i }).tap();
  if (await page.locator("#welcomePanel").isVisible()) {
    await page.locator("#welcomeOkBtn").tap();
  }
  const afterReload = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterReload.inventory.hardenedSpear).toBe(afterThrow.inventory.hardenedSpear);
  expect(afterReload.progress.smallGameHunts).toBe(1);
  expect(afterReload.equipment.spear).toBe("hardenedSpear");

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
