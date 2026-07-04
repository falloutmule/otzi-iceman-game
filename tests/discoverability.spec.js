import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("discoverability guidance exposes the first playable loop", async ({ page }) => {
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
  await expect(page.locator("#startBtn")).toHaveText("Start Game");
  await expect(page.locator("#startPanel")).not.toContainText("Audio Unlock");
  await expect(page.locator("#startPanel")).not.toContainText("engine shell");
  await page.screenshot({ path: "artifacts/screenshots/fix-start-game-label.png", fullPage: true });
  await page.getByRole("button", { name: /start/i }).tap();
  await expect(page.locator("#welcomePanel")).toBeVisible();
  await expect(page.locator("#welcomePanel")).toContainText("Travel east from the village to find Flint Scar");
  await page.screenshot({ path: "artifacts/screenshots/fix-welcome-popup-visible.png", fullPage: true });
  await page.locator("#welcomeOkBtn").tap();
  await expect(page.locator("#welcomePanel")).toBeHidden();

  await expect(page.locator("#objectiveBar")).toBeVisible();
  await expect(page.locator("#objectiveTitle")).toContainText("Find Flint Scar");
  await expect(page.locator("#objectiveText")).toContainText("Travel east from the village");
  await page.screenshot({ path: "artifacts/screenshots/fix-objective-bar-visible.png", fullPage: true });

  const startSnap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(startSnap.world.currentScreenKind).toBe("village_home");
  expect(startSnap.objective.id).toBe("find_flint_scar");
  expect(startSnap.areaCard?.title).toBe("Village Camp");

  await page.locator("#mapTab").tap();
  await expect(page.locator("#minimapPanel")).toBeVisible();
  await expect(page.locator("#minimapLegend")).toContainText("Village");
  await expect(page.locator("#minimapLegend")).toContainText("Flint Scar");
  await expect(page.locator("#minimapLegend")).toContainText("Animal Clearing");
  await page.screenshot({ path: "artifacts/screenshots/fix-overworld-map-legend.png", fullPage: true });
  await page.locator("#mapTab").tap();

  await page.locator("#systemBtn").tap();
  await expect(page.locator("#systemPanel")).toBeVisible();
  await expect(page.locator("#menuBuildVersion")).toHaveText("otzi-fire-spear-0.5.3");
  await expect(page.locator("#menuSaveVersion")).toHaveText("7");
  await expect(page.locator("#menuWorldgenVersion")).toHaveText("3");
  await page.screenshot({ path: "artifacts/screenshots/fix-menu-build-marker.png", fullPage: true });
  await page.locator("#showHelpBtn").tap();
  await expect(page.locator("#welcomePanel")).toBeVisible();
  await page.locator("#welcomeOkBtn").tap();

  await page.evaluate(() => window.__OTZI_TEST__.teleportToFlintScarEntrance());
  const flintSnap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(flintSnap.world.currentScreenKind).toBe("flint_scar_entrance");
  await expect(page.locator("#areaCard")).toBeVisible();
  await expect(page.locator("#areaCardTitle")).toContainText("Flint Scar Entrance");
  await expect(page.locator("#areaCardText")).toContainText("Use near the scar");
  await expect(page.locator("#statusLine")).toContainText("USE: enter Flint Scar");
  await page.screenshot({ path: "artifacts/screenshots/discoverability-flint-scar-marker.png", fullPage: true });

  await page.evaluate(() => OTZI.game.tryUse());
  const dungeonSnap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(dungeonSnap.scene).toBe("dungeon");
  expect(dungeonSnap.dungeon.currentX).toBe(0);
  expect(dungeonSnap.dungeon.currentY).toBe(1);
  expect(dungeonSnap.transition.active).toBe(false);
  expect(dungeonSnap.objective.id).toBe("find_good_flint_core");
  await expect(page.locator("#objectiveTitle")).toContainText("Find the Good Flint Core");
  await expect(page.locator("#areaCard")).toBeVisible();
  await expect(page.locator("#areaCardTitle")).toContainText("Flint Scar");
  await page.screenshot({ path: "artifacts/screenshots/fix-flint-scar-entry-room.png", fullPage: true });

  await page.evaluate(() => window.__OTZI_TEST__.stepFrames(8));
  const dungeonStillSnap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(dungeonStillSnap.dungeon.currentX).toBe(0);
  expect(dungeonStillSnap.dungeon.currentY).toBe(1);

  await page.locator("#mapTab").tap();
  await expect(page.locator("#minimapLegend")).toContainText("Exit");
  await expect(page.locator("#minimapLegend")).not.toContainText("Village");
  await page.screenshot({ path: "artifacts/screenshots/fix-dungeon-map-legend.png", fullPage: true });
  await page.locator("#mapTab").tap();
  await page.screenshot({ path: "artifacts/screenshots/fix-flint-scar-area-card.png", fullPage: true });

  const animalHint = await page.evaluate(() => window.__OTZI_TEST__.teleportToAnimalHintScreen());
  expect(animalHint.hint).toContain("Hare tracks lead");
  await expect(page.locator("#areaCard")).toBeVisible();
  await expect(page.locator("#areaCardText")).toContainText(/Hare tracks lead|Small game/);
  await page.screenshot({ path: "artifacts/screenshots/discoverability-animal-clearing-hint.png", fullPage: true });

  const animalScreen = await page.evaluate(() => window.__OTZI_TEST__.teleportToAnimalClearing());
  expect(animalScreen.world.currentScreenKind).toBe("animal_clearing");
  await expect(page.locator("#areaCardTitle")).toContainText("Animal Clearing");
  const hare = await page.evaluate(() => {
    const active = OTZI.game.entities.find((entity) => (entity.kind === "hare" || entity.kind === "grouse") && !entity.caught && !entity.escaped);
    return active ? { id: active.id, kind: active.kind } : null;
  });
  expect(hare?.id).toBeTruthy();

  await page.evaluate(() => window.__OTZI_TEST__.teleportNearCore());
  await expect(page.locator("#statusLine")).toContainText("USE: take good flint core");
  await page.evaluate(() => OTZI.game.tryUse());
  const postCore = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(postCore.inventory.goodFlintCore).toBe(1);
  expect(postCore.objective.id).toBe("return_to_village");
  await expect(page.locator("#objectiveTitle")).toContainText("Return to Village");

  await page.evaluate(() => window.__OTZI_TEST__.returnToVillage());
  await expect(page.locator("#factPanel")).toBeVisible();
  await expect(page.locator("#factTitle")).toContainText("Retoucheur");
  await page.screenshot({ path: "artifacts/screenshots/discoverability-fact-popup.png", fullPage: true });

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
