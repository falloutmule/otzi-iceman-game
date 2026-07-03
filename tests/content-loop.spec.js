import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("content loop adds screen kinds, small-game catch, Flint Scar core, toolmaker unlock, and first fact", async ({ page }) => {
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
  if (await page.locator("#welcomePanel").isVisible()) {
    await page.locator("#welcomeOkBtn").tap();
  }
  await expect(page.locator("#startPanel")).toBeHidden();

  const kindCounts = await page.evaluate(() => window.__OTZI_TEST__.screenKindCounts());
  expect(kindCounts.village_home).toBe(1);
  expect(kindCounts.flint_scar_entrance).toBe(1);
  expect(kindCounts.easy_gather).toBeGreaterThan(0);
  expect(kindCounts.animal_clearing).toBeGreaterThan(0);

  const animalScreen = await page.evaluate(() => window.__OTZI_TEST__.teleportToAnimalClearing());
  expect(animalScreen.world.currentScreenKind).toBe("animal_clearing");
  await page.screenshot({ path: "artifacts/screenshots/content-animal-clearing.png", fullPage: true });

  const hareFlee = await page.evaluate(() => window.__OTZI_TEST__.triggerHareFlee());
  const hareState = await page.evaluate(() => {
    const animal = OTZI.game.entities.find((entity) => entity.kind === "hare" || entity.kind === "grouse");
    return animal ? { kind: animal.kind, state: animal.state, escaped: animal.escaped } : null;
  });
  expect(hareFlee.world.currentScreenKind).toBe("animal_clearing");
  expect(hareState?.state).toBe("fleeing");
  const hareEscaped = await page.evaluate(() => window.__OTZI_TEST__.stepHareOutcome());
  expect(hareEscaped?.escaped).toBe(true);
  expect(hareEscaped?.outcome).toBe("escaped");
  await expect(page.locator("#statusLine")).toContainText("escaped");

  await page.evaluate(() => {
    const seed = OTZI.game.seed;
    OTZI.game.setSeed(seed);
    return window.__OTZI_TEST__.teleportNearHare();
  });
  await expect(page.locator("#statusLine")).toContainText("USE: catch");
  const beforeCatch = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Caught");
  const afterCatch = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterCatch.inventory.food).toBe((beforeCatch.inventory.food || 0) + 1);
  expect(afterCatch.focusedEntity).toBeNull();
  await page.screenshot({ path: "artifacts/screenshots/content-hare-caught.png", fullPage: true });

  await page.evaluate(() => window.__OTZI_TEST__.teleportToFlintScarEntrance());
  await expect(page.locator("#statusLine")).toContainText("USE: enter Flint Scar");
  const entranceState = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(entranceState.focusedEntrance?.label).toBe("Flint Scar");
  await page.evaluate(() => OTZI.game.tryUse());
  let dungeonState = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(dungeonState.scene).toBe("dungeon");
  expect(dungeonState.dungeon.id).toBe("flint_scar");

  await page.evaluate(() => window.__OTZI_TEST__.teleportNearCore());
  await expect(page.locator("#statusLine")).toContainText("USE: take good flint core");
  await page.screenshot({ path: "artifacts/screenshots/content-flint-core-focus.png", fullPage: true });
  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Collected good flint core");
  const afterCore = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterCore.inventory.goodFlintCore).toBe(1);
  expect(afterCore.dungeons.flint_scar.completed).toBe(true);
  await page.screenshot({ path: "artifacts/screenshots/content-flint-core-collected.png", fullPage: true });

  const villageReturn = await page.evaluate(() => window.__OTZI_TEST__.returnToVillage());
  expect(villageReturn.world.currentScreenKind).toBe("village_home");
  expect(villageReturn.village.unlocked).toContain("toolmaker");
  expect(villageReturn.inventory.goodFlintCore).toBe(0);
  expect(villageReturn.facts.discovered).toContain("retoucheur_tool");
  await expect(page.locator("#factPanel")).toBeVisible();
  await expect(page.locator("#factTitle")).toContainText("Retoucheur");
  await page.screenshot({ path: "artifacts/screenshots/content-toolmaker-fact.png", fullPage: true });
  await page.locator("#factCloseBtn").tap();
  await expect(page.locator("#factPanel")).toBeHidden();

  await page.locator("#systemBtn").tap();
  await expect(page.locator("#systemPanel")).toBeVisible();
  await expect(page.locator("#menuToolmaker")).toHaveText("Unlocked");
  await expect(page.locator("#menuLatestFact")).toContainText("Retoucheur");
  await expect(page.locator("#viewFactBtn")).toBeVisible();
  await page.locator("#viewFactBtn").tap();
  await expect(page.locator("#factPanel")).toBeVisible();
  await page.locator("#factCloseBtn").tap();
  await page.locator("#systemCloseBtn").tap();

  const saved = await page.evaluate(() => window.__OTZI_TEST__.saveNow());
  expect(saved).toBe(true);
  await page.reload();
  await expect(page.locator("#worldCanvas")).toBeVisible();
  await page.getByRole("button", { name: /start/i }).tap();
  if (await page.locator("#welcomePanel").isVisible()) {
    await page.locator("#welcomeOkBtn").tap();
  }
  const afterReload = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterReload.village.unlocked).toContain("toolmaker");
  expect(afterReload.facts.discovered).toContain("retoucheur_tool");
  expect(afterReload.dungeons.flint_scar.completed).toBe(true);
  expect(afterReload.world.currentScreenKind).toBe("village_home");

  await page.locator("#systemBtn").tap();
  await expect(page.locator("#systemPanel")).toBeVisible();
  await page.locator("#resetSaveBtn").tap();
  await page.locator("#resetSaveBtn").tap();
  const afterReset = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterReset.village.unlocked).not.toContain("toolmaker");
  expect(afterReset.facts.discovered).toEqual([]);
  expect(afterReset.dungeons.flint_scar.completed).toBe(false);
  await page.screenshot({ path: "artifacts/screenshots/content-reset-clears-progression.png", fullPage: true });

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
