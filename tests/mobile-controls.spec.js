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
  await expect(page.locator("#popupBar")).toBeVisible();
  await expect(page.locator("#controls")).toBeVisible();
  await expect(page.locator("#statsStrip")).toBeVisible();
  await expect(page.locator("#aimStrip")).toHaveCount(0);
  await expect(page.locator(".aim-strip")).toHaveCount(0);
  await expect(page.locator("#popupBar #mapTab")).toBeVisible();
  await expect(page.locator("#popupBar #inventoryBtn")).toBeVisible();
  await expect(page.locator("#gameShell > #mapTab")).toHaveCount(0);
  await expect(page.locator("#gameShell #inventoryBtn")).toHaveCount(0);
  await expect(page.locator("#gameShell #moveZone")).toHaveCount(0);
  await expect(page.locator("#gameShell #useBtn")).toHaveCount(0);
  await expect(page.locator("#gameShell #sprintBtn")).toHaveCount(0);
  await expect(page.locator("#gameShell #menuBtn")).toHaveCount(0);
  await expect(page.locator("#controls #moveZone")).toBeVisible();
  await expect(page.locator("#controls #useBtn")).toBeVisible();
  await expect(page.locator("#controls #sprintBtn")).toBeVisible();
  await expect(page.locator("#controls #menuBtn")).toBeVisible();
  const gameBox = await page.locator("#gameShell").boundingBox();
  const popupBox = await page.locator("#popupBar").boundingBox();
  const controlsBox = await page.locator("#controls").boundingBox();
  const statsBox = await page.locator("#statsStrip").boundingBox();
  const appBox = await page.locator("#app").boundingBox();
  const viewport = page.viewportSize();
  expect(gameBox).toBeTruthy();
  expect(popupBox).toBeTruthy();
  expect(controlsBox).toBeTruthy();
  expect(statsBox).toBeTruthy();
  expect(appBox).toBeTruthy();
  expect(appBox.width).toBeGreaterThan(viewport.width * 0.9);
  expect(popupBox.y).toBeGreaterThan(gameBox.y + gameBox.height - 2);
  expect(controlsBox.y).toBeGreaterThan(popupBox.y + popupBox.height - 2);
  expect(statsBox.y).toBeGreaterThan(controlsBox.y);
  await page.screenshot({ path: "artifacts/screenshots/mobile-ui-popupbar-map-pack.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/mobile-ui-clear-game.png", fullPage: true });

  const initial = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(initial.resourceNodes.total).toBeGreaterThan(0);
  expect(initial.resourceNodes.active).toBeGreaterThan(0);
  for (const resource of ["flint", "stick", "stone", "bark", "grass", "food"]) {
    expect(initial.resourceNodes.byResource[resource].active).toBeGreaterThan(0);
  }
  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("No resource nearby");
  await expect(page.locator("#statsStrip")).not.toContainText("FLINT");
  const afterFailedUse = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterFailedUse.inventory.flint || 0).toBe(initial.inventory.flint || 0);
  expect(afterFailedUse.resourceNodes.depleted).toBe(initial.resourceNodes.depleted);
  await page.screenshot({ path: "artifacts/screenshots/gather-fail-no-resource.png", fullPage: true });

  await page.locator("#menuBtn").tap();
  await expect(page.locator("#menuPanel")).toBeVisible();
  await page.locator("#craftCrudeToolBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Missing resources");
  let failedCraft = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(failedCraft.inventory.crudeTool || 0).toBe(0);
  await page.locator("#menuCloseBtn").tap();
  await expect(page.locator("#menuPanel")).toBeHidden();

  let previous = afterFailedUse;
  for (const resource of ["flint", "stick", "stone", "bark", "grass", "food"]) {
    await page.evaluate((kind) => window.__OTZI_TEST__.teleportToNearestResource(kind), resource);
    const nearResource = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
    expect(nearResource.nearestResource?.resource).toBe(resource);
    expect(nearResource.nearestResource?.kind).toBe("resource");
    expect(nearResource.nearestResource?.saveDeltaId).toBeTruthy();
    const gatheredNodeId = nearResource.nearestResource.id;
    if (resource === "flint") {
      await page.waitForTimeout(1500);
      await expect(page.locator("#statusLine")).toContainText("Nearby: flint");
      await page.screenshot({ path: "artifacts/screenshots/bugpass-resource-markers.png", fullPage: true });
      await page.screenshot({ path: "artifacts/screenshots/bugpass-nearby-resource-highlight.png", fullPage: true });
    }
    await page.locator("#useBtn").tap();
    await expect(page.locator("#statusLine")).toContainText(`Gathered ${resource} +1`);
    const afterUse = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
    expect(afterUse.inventory[resource]).toBe((previous.inventory[resource] || 0) + 1);
    expect(afterUse.resourceNodes.depleted).toBe(previous.resourceNodes.depleted + 1);
    expect(afterUse.resourceNodes.active).toBe(previous.resourceNodes.active - 1);
    const depletedNode = await page.evaluate((id) => window.__OTZI_TEST__.resourceNode(id), gatheredNodeId);
    expect(depletedNode.depleted).toBe(true);
    expect(depletedNode.amount).toBe(0);
    if (resource === "flint") {
      await page.screenshot({ path: "artifacts/screenshots/bugpass-gather-visible-resource.png", fullPage: true });
      await page.screenshot({ path: "artifacts/screenshots/bugpass-depleted-resource.png", fullPage: true });
    }
    previous = afterUse;
  }
  await page.locator("#inventoryBtn").tap();
  await expect(page.locator("#inventoryPanel")).toBeVisible();
  await expect(page.locator("#minimapPanel")).toBeHidden();
  const afterPack = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterPack.inventoryOpen).toBe(true);
  await expect(page.locator("#invFlint")).toHaveText("1");
  await expect(page.locator("#invStick")).toHaveText("1");
  await expect(page.locator("#invStone")).toHaveText("1");
  await expect(page.locator("#invBark")).toHaveText("1");
  await expect(page.locator("#invGrass")).toHaveText("1");
  await expect(page.locator("#invFood")).toHaveText("1");
  await page.screenshot({ path: "artifacts/screenshots/mobile-ui-inventory-popup.png", fullPage: true });
  await expect(page.locator("#healthChip")).toContainText("HP 100");
  await expect(page.locator("#staminaChip")).toContainText("STAM");
  await expect(page.locator("#hungerChip")).toContainText("HUNGER");
  await expect(page.locator("#warmthChip")).toContainText("WARMTH");
  await page.screenshot({ path: "artifacts/screenshots/mobile-ui-gather-still-works.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/mobile-ui-stats-below-controls.png", fullPage: true });

  await page.locator("#popupBar #mapTab").tap();
  await expect(page.locator("#minimapPanel")).toBeVisible();
  await expect(page.locator("#inventoryPanel")).toBeHidden();
  const afterMap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterMap.minimap).toBe(true);
  expect(afterMap.inventoryOpen).toBe(false);
  await page.screenshot({ path: "artifacts/screenshots/mobile-ui-map-popup.png", fullPage: true });

  await page.locator("#menuBtn").tap();
  await expect(page.locator("#menuPanel")).toBeVisible();
  await expect(page.locator("#menuPanel")).toContainText("control path works");
  await expect(page.locator("#menuFlint")).toHaveText("1");
  await expect(page.locator("#menuStick")).toHaveText("1");
  await expect(page.locator("#menuStone")).toHaveText("1");
  await expect(page.locator("#menuBark")).toHaveText("1");
  await expect(page.locator("#menuGrass")).toHaveText("1");
  await expect(page.locator("#menuFood")).toHaveText("1");
  await expect(page.locator("#menuCrudeTool")).toHaveText("0");
  await page.locator("#craftCrudeToolBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Crafted Crude Cutting Tool");
  await expect(page.locator("#menuFlint")).toHaveText("0");
  await expect(page.locator("#menuStick")).toHaveText("0");
  await expect(page.locator("#menuGrass")).toHaveText("0");
  await expect(page.locator("#menuCrudeTool")).toHaveText("1");
  const afterCraft = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterCraft.inventory.flint).toBe(0);
  expect(afterCraft.inventory.stick).toBe(0);
  expect(afterCraft.inventory.grass).toBe(0);
  expect(afterCraft.inventory.stone).toBe(1);
  expect(afterCraft.inventory.bark).toBe(1);
  expect(afterCraft.inventory.food).toBe(1);
  expect(afterCraft.inventory.crudeTool).toBe(1);
  const afterMenuOpen = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterMenuOpen.menuOpen).toBe(true);
  expect(afterMenuOpen.input.sprintHeld).toBe(false);
  await page.screenshot({ path: "artifacts/screenshots/menu-placeholder.png", fullPage: true });
  await page.locator("#menuCloseBtn").tap();
  await expect(page.locator("#menuPanel")).toBeHidden();

  const beforeSave = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  const saved = await page.evaluate(() => window.__OTZI_TEST__.saveNow());
  expect(saved).toBe(true);
  await page.reload();
  await expect(page.locator("#worldCanvas")).toBeVisible();
  await page.getByRole("button", { name: /start/i }).tap();
  await expect(page.locator("#startPanel")).toBeHidden();
  const afterReload = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterReload.inventory).toMatchObject(beforeSave.inventory);
  expect(afterReload.resourceNodes.depleted).toBe(beforeSave.resourceNodes.depleted);
  expect(afterReload.player.x).toBeCloseTo(beforeSave.player.x, 4);
  expect(afterReload.player.y).toBeCloseTo(beforeSave.player.y, 4);
  expect(afterReload.player.health).toBeCloseTo(beforeSave.player.health, 4);
  expect(afterReload.player.stamina).toBeCloseTo(beforeSave.player.stamina, 4);
  expect(afterReload.minimap).toBe(beforeSave.minimap);
  await page.locator("#inventoryBtn").tap();
  await expect(page.locator("#inventoryPanel")).toBeVisible();
  await expect(page.locator("#invStone")).toHaveText("1");
  await expect(page.locator("#invBark")).toHaveText("1");
  await expect(page.locator("#invFood")).toHaveText("1");
  await page.locator("#menuBtn").tap();
  await expect(page.locator("#menuPanel")).toBeVisible();
  await expect(page.locator("#fullscreenBtn")).toBeVisible();
  await page.locator("#fullscreenBtn").tap();
  await expect(page.locator("#statusLine")).toContainText(/Fullscreen/);
  await expect(page.locator("#resetSaveBtn")).toBeVisible();
  await page.locator("#resetSaveBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Tap reset again to confirm");
  await expect(page.locator("#resetSaveBtn")).toHaveText("Confirm Reset Save");
  await page.locator("#resetSaveBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Save reset");
  const afterReset = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterReset.inventory.flint).toBe(0);
  expect(afterReset.inventory.stick).toBe(0);
  expect(afterReset.inventory.stone).toBe(0);
  expect(afterReset.inventory.bark).toBe(0);
  expect(afterReset.inventory.grass).toBe(0);
  expect(afterReset.inventory.food).toBe(0);
  expect(afterReset.inventory.crudeTool).toBe(0);
  expect(afterReset.resourceNodes.depleted).toBe(0);
  await page.locator("#inventoryBtn").tap();
  await expect(page.locator("#inventoryPanel")).toBeVisible();
  await expect(page.locator("#invFlint")).toHaveText("0");
  await page.screenshot({ path: "artifacts/screenshots/bugpass-pack-popup-after-reset.png", fullPage: true });
  await page.locator("#menuBtn").tap();
  await expect(page.locator("#menuPanel")).toBeVisible();
  await page.screenshot({ path: "artifacts/screenshots/bugpass-menu-fullscreen-reset.png", fullPage: true });
  await page.locator("#menuCloseBtn").tap();
  await expect(page.locator("#menuPanel")).toBeHidden();

  const beforeSprint = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  await page.locator("#sprintBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Dodge/Sprint burst");
  const afterSprint = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterSprint.player.stamina).toBeLessThan(beforeSprint.player.stamina);
  expect(afterSprint.input.sprintHeld).toBe(false);
  await page.waitForTimeout(700);
  const afterSprintRecovery = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterSprintRecovery.player.stamina).toBeGreaterThan(afterSprint.player.stamina);

  await page.evaluate(() => window.__OTZI_TEST__.setMeters({
    health: 140,
    stamina: -12,
    hunger: 130,
    warmth: -5,
    wetness: 160
  }));
  await page.evaluate(() => window.__OTZI_TEST__.stepFrames(1));
  const clampedMeters = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(clampedMeters.player.health).toBe(100);
  expect(clampedMeters.player.stamina).toBeGreaterThanOrEqual(0);
  expect(clampedMeters.player.hunger).toBeLessThanOrEqual(100);
  expect(clampedMeters.player.warmth).toBeGreaterThanOrEqual(0);
  expect(clampedMeters.player.wetness).toBe(100);
  const saveSnapshot = await page.evaluate(() => JSON.parse(decodeURIComponent(escape(atob(window.__OTZI_TEST__.exportSave())))));
  expect(saveSnapshot.meters.health).toBe(clampedMeters.player.health);
  expect(saveSnapshot.meters.stamina).toBeCloseTo(clampedMeters.player.stamina, 0);

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

test("mobile shell uses full width and keeps ordered controls", async ({ page }) => {
  const baseUrl = process.env.OTZI_BASE_URL || "http://127.0.0.1:8099";
  await page.setViewportSize({ width: 412, height: 839 });
  await page.goto(`${baseUrl}/dist/index.html`);
  await expect(page.locator("#worldCanvas")).toBeVisible();
  const appBox = await page.locator("#app").boundingBox();
  const gameBox = await page.locator("#gameShell").boundingBox();
  const popupBox = await page.locator("#popupBar").boundingBox();
  const controlsBox = await page.locator("#controls").boundingBox();
  const statsBox = await page.locator("#statsStrip").boundingBox();
  expect(appBox).toBeTruthy();
  expect(gameBox).toBeTruthy();
  expect(popupBox).toBeTruthy();
  expect(controlsBox).toBeTruthy();
  expect(statsBox).toBeTruthy();
  expect(appBox.width).toBeGreaterThan(390);
  expect(popupBox.y).toBeGreaterThan(gameBox.y + gameBox.height - 2);
  expect(controlsBox.y).toBeGreaterThan(popupBox.y + popupBox.height - 2);
  expect(statsBox.y).toBeGreaterThan(controlsBox.y);
  await expect(page.locator("#statsStrip")).not.toContainText("FLINT");
  await page.screenshot({ path: "artifacts/screenshots/mobile-ui-stats-below-controls.png", fullPage: true });
});
