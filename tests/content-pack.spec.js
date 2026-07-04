import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("content pack adds eat food, Birch Grove, and Wolf Signs", async ({ page }) => {
  const baseUrl = process.env.OTZI_BASE_URL || "http://127.0.0.1:8099";
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.stack || String(err)));

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

  const kindCounts = await page.evaluate(() => window.__OTZI_TEST__.screenKindCounts());
  expect(kindCounts.birch_grove).toBe(1);
  expect(kindCounts.wolf_signs).toBe(1);
  expect(kindCounts.animal_clearing).toBeGreaterThan(0);

  await page.locator("#systemBtn").tap();
  await page.evaluate(() => {
    OTZI.inventory.add("food", 1);
    OTZI.game.updateFocusState();
  });
  await page.locator("#goBirchGroveBtn").tap();
  await page.locator("#systemCloseBtn").tap();
  await page.waitForFunction(() => window.__OTZI_TEST__.snapshot().world.currentScreenKind === "birch_grove");
  await page.evaluate(() => window.__OTZI_TEST__.stepFrames(2));
  const birchIntro = await page.evaluate(() => window.__OTZI_TEST__.snapshot().areaCard);
  expect(birchIntro?.title).toBe("Birch Grove");
  expect(birchIntro?.text).toContain("Good bark for tools and fire");
  await page.evaluate(() => { OTZI.game.menuOpen = false; });
  await page.waitForFunction(() => !window.__OTZI_TEST__.snapshot().menuOpen);

  await page.evaluate(() => window.__OTZI_TEST__.setMeters({ hunger: 36 }));
  const foodGrant = await page.evaluate(() => window.__OTZI_TEST__.snapshot().inventory.food);
  expect(foodGrant).toBeGreaterThan(0);
  await page.evaluate(() => {
    OTZI.game.inventoryOpen = true;
    OTZI.game.menuOpen = false;
    OTZI.renderUi.sync();
  });
  await expect(page.locator("#recipeEatFoodState")).toContainText("Ready");
  await expect(page.locator("#recipeEatFoodNeeds")).toContainText("1 Food");
  await expect(page.locator("#recipeEatFoodHave")).toContainText("Food 1 / 1");
  await page.screenshot({ path: "artifacts/screenshots/content-eat-food-ready.png", fullPage: true });
  const beforeEat = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.locator("#eatFoodBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Ate food - hunger lowered");
  const afterEat = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterEat.inventory.food).toBe((beforeEat.inventory.food || 0) - 1);
  expect(afterEat.player.hunger).toBeLessThan(beforeEat.player.hunger);
  await page.locator("#craftCloseBtn").tap();

  const birchScreen = await page.evaluate(() => window.__OTZI_TEST__.teleportToBirchGrove());
  expect(birchScreen.world.currentScreenKind).toBe("birch_grove");
  await page.waitForFunction(() => window.__OTZI_TEST__.snapshot().world.currentScreenKind === "birch_grove");
  await page.evaluate(() => window.__OTZI_TEST__.stepFrames(2));
  const birchState = await page.evaluate(() => window.__OTZI_TEST__.snapshot().areaCard);
  expect(birchState?.title).toBe("Birch Grove");
  expect(birchState?.text).toContain("Good bark for tools and fire");
  await page.evaluate(() => window.__OTZI_TEST__.teleportToNearestResource("bark"));
  const barkFocus = await page.evaluate(() => window.__OTZI_TEST__.snapshot().focusedResource);
  expect(barkFocus?.resource).toBe("bark");
  const beforeBark = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.evaluate(() => OTZI.game.tryUse());
  const afterBark = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterBark.inventory.bark).toBe((beforeBark.inventory.bark || 0) + 1);
  await page.screenshot({ path: "artifacts/screenshots/content-birch-grove.png", fullPage: true });

  const wolfScreen = await page.evaluate(() => window.__OTZI_TEST__.teleportToWolfSigns());
  expect(wolfScreen.world.currentScreenKind).toBe("wolf_signs");
  await page.waitForFunction(() => window.__OTZI_TEST__.snapshot().world.currentScreenKind === "wolf_signs");
  await page.evaluate(() => window.__OTZI_TEST__.stepFrames(2));
  const wolfState = await page.evaluate(() => window.__OTZI_TEST__.snapshot().areaCard);
  expect(wolfState?.title).toBe("Wolf Signs");
  expect(wolfState?.text).toContain("Wolf tracks cross the path");
  await page.screenshot({ path: "artifacts/screenshots/content-wolf-signs.png", fullPage: true });
  const wolfSnap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(wolfSnap.player.health).toBeGreaterThan(0);
  await page.evaluate(() => {
    OTZI.game.inventoryOpen = false;
    OTZI.game.menuOpen = false;
    OTZI.renderUi.sync();
  });
  await page.locator("#mapTab").tap();
  await expect(page.locator("#minimapLegend")).toContainText("Birch Grove");
  await expect(page.locator("#minimapLegend")).toContainText("Wolf Signs");
  await page.screenshot({ path: "artifacts/screenshots/content-pack-map-legend.png", fullPage: true });
  await page.locator("#mapTab").tap();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
