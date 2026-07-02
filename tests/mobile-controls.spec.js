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
  await expect(page.locator("#aimStrip")).toHaveCount(0);
  await expect(page.locator(".aim-strip")).toHaveCount(0);
  await expect(page.locator("#hudStrip #mapTab")).toBeVisible();
  await expect(page.locator("#gameShell > #mapTab")).toHaveCount(0);
  await expect(page.locator("#gameShell #moveZone")).toHaveCount(0);
  await expect(page.locator("#gameShell #useBtn")).toHaveCount(0);
  await expect(page.locator("#gameShell #sprintBtn")).toHaveCount(0);
  await expect(page.locator("#gameShell #menuBtn")).toHaveCount(0);
  await expect(page.locator("#controls #moveZone")).toBeVisible();
  await expect(page.locator("#controls #useBtn")).toBeVisible();
  await expect(page.locator("#controls #sprintBtn")).toBeVisible();
  await expect(page.locator("#controls #menuBtn")).toBeVisible();
  const gameBox = await page.locator("#gameShell").boundingBox();
  const controlsBox = await page.locator("#controls").boundingBox();
  expect(gameBox).toBeTruthy();
  expect(controlsBox).toBeTruthy();
  expect(controlsBox.y).toBeGreaterThan(gameBox.y + gameBox.height - 2);
  await page.screenshot({ path: "artifacts/screenshots/no-aim-map-in-hud.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/clear-game-viewport-no-controls.png", fullPage: true });

  const initial = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(initial.resourceNodes.total).toBeGreaterThan(0);
  expect(initial.resourceNodes.active).toBeGreaterThan(0);
  for (const resource of ["flint", "stick", "stone", "bark", "grass", "food"]) {
    expect(initial.resourceNodes.byResource[resource].active).toBeGreaterThan(0);
  }
  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("No resource nearby");
  await expect(page.locator("#inventoryChip")).toContainText("FLINT 0");
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
    await page.locator("#useBtn").tap();
    await expect(page.locator("#statusLine")).toContainText(`Gathered ${resource} +1`);
    const afterUse = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
    expect(afterUse.inventory[resource]).toBe((previous.inventory[resource] || 0) + 1);
    expect(afterUse.resourceNodes.depleted).toBe(previous.resourceNodes.depleted + 1);
    expect(afterUse.resourceNodes.active).toBe(previous.resourceNodes.active - 1);
    const depletedNode = await page.evaluate((id) => window.__OTZI_TEST__.resourceNode(id), gatheredNodeId);
    expect(depletedNode.depleted).toBe(true);
    expect(depletedNode.amount).toBe(0);
    previous = afterUse;
  }
  await expect(page.locator("#inventoryChip")).toContainText("FLINT 1");
  await expect(page.locator("#inventoryChip")).toContainText("STICK 1");
  await expect(page.locator("#inventoryChip")).toContainText("STONE 1");
  await expect(page.locator("#inventoryChip")).toContainText("BARK 1");
  await expect(page.locator("#inventoryChip")).toContainText("GRASS 1");
  await expect(page.locator("#inventoryChip")).toContainText("FOOD 1");
  await expect(page.locator("#staminaChip")).toContainText("HP 100");
  await expect(page.locator("#staminaChip")).toContainText("STAM");
  await expect(page.locator("#staminaChip")).toContainText("HUNGER");
  await expect(page.locator("#staminaChip")).toContainText("WARMTH");
  await page.screenshot({ path: "artifacts/screenshots/gather-success-flint.png", fullPage: true });

  await page.locator("#hudStrip #mapTab").tap();
  await expect(page.locator("#minimapPanel")).toBeVisible();
  const afterMap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterMap.minimap).toBe(true);
  await page.screenshot({ path: "artifacts/screenshots/hud-map-button-minimap-open.png", fullPage: true });

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
  await expect(page.locator("#inventoryChip")).toContainText("STONE 1");
  await expect(page.locator("#inventoryChip")).toContainText("BARK 1");
  await expect(page.locator("#inventoryChip")).toContainText("FOOD 1");

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
  expect(saveSnapshot.meters.stamina).toBe(clampedMeters.player.stamina);

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
