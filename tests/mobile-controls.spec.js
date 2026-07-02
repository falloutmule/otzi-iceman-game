import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test("screen-grid mobile shell supports transitions, screen-local gather, and Flint Scar stub", async ({ page }) => {
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
  await expect(page.locator("#gameShell")).toBeVisible();
  await expect(page.locator("#popupBar")).toBeVisible();
  await expect(page.locator("#controls")).toBeVisible();
  await expect(page.locator("#statsStrip")).toBeVisible();
  await expect(page.locator("#aimStrip")).toHaveCount(0);
  await expect(page.locator(".aim-strip")).toHaveCount(0);
  await expect(page.locator("#popupBar #mapTab")).toBeVisible();
  await expect(page.locator("#popupBar #inventoryBtn")).toBeVisible();
  await expect(page.locator("#controls #moveZone")).toBeVisible();
  await expect(page.locator("#controls #useBtn")).toBeVisible();
  await expect(page.locator("#controls #sprintBtn")).toBeVisible();
  await expect(page.locator("#controls #menuBtn")).toBeVisible();

  const initial = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(initial.scene).toBe("overworld");
  expect(initial.world.currentScreenId).toBeTruthy();
  expect(initial.world.discoveredCount).toBe(1);
  expect(initial.resourceNodes.total).toBe(0);
  expect(initial.focusedResource).toBeNull();
  expect(initial.focusedEntrance).toBeNull();
  expect(initial.status).toBe("No resource nearby");

  const signatureA = await page.evaluate(() => window.__OTZI_TEST__.screenSignature());
  await page.evaluate((seed) => window.__OTZI_TEST__.setSeed(seed), initial.seed);
  const signatureB = await page.evaluate(() => window.__OTZI_TEST__.screenSignature());
  expect(signatureB.id).toBe(signatureA.id);
  expect(signatureB.kind).toBe(signatureA.kind);
  expect(signatureB.tiles).toBe(signatureA.tiles);
  expect(signatureB.resources).toEqual(signatureA.resources);

  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("No resource nearby");

  const eastActive = await page.evaluate(() => window.__OTZI_TEST__.placeAndStepEdge("e", 1));
  expect(eastActive.transition.active).toBe(true);
  expect(eastActive.transition.direction).toBe("east");
  await page.screenshot({ path: "artifacts/screenshots/screen-slide-east.png", fullPage: true });
  const afterEast = await page.evaluate(() => window.__OTZI_TEST__.stepUntilTransitionSettles());
  expect(afterEast.world.currentX).toBe(initial.world.currentX + 1);
  expect(afterEast.world.discoveredCount).toBe(2);
  expect(afterEast.transition.active).toBe(false);
  expect(afterEast.input.pointerCount).toBe(0);
  const southActive = await page.evaluate(() => window.__OTZI_TEST__.placeAndStepEdge("s", 1));
  expect(southActive.transition.active).toBe(true);
  expect(southActive.transition.direction).toBe("south");
  const afterSouth = await page.evaluate(() => window.__OTZI_TEST__.stepUntilTransitionSettles());
  expect(afterSouth.world.currentY).toBe(initial.world.currentY + 1);
  expect(afterSouth.world.discoveredCount).toBe(3);
  const northActive = await page.evaluate(() => window.__OTZI_TEST__.placeAndStepEdge("n", 1));
  expect(northActive.transition.active).toBe(true);
  expect(northActive.transition.direction).toBe("north");
  await page.screenshot({ path: "artifacts/screenshots/screen-slide-north.png", fullPage: true });
  const backNorth = await page.evaluate(() => window.__OTZI_TEST__.stepUntilTransitionSettles());
  expect(backNorth.world.currentY).toBe(initial.world.currentY);
  const westActive = await page.evaluate(() => window.__OTZI_TEST__.placeAndStepEdge("w", 1));
  expect(westActive.transition.active).toBe(true);
  expect(westActive.transition.direction).toBe("west");
  const backWest = await page.evaluate(() => window.__OTZI_TEST__.stepUntilTransitionSettles());
  expect(backWest.world.currentX).toBe(initial.world.currentX);
  expect(backWest.transition.active).toBe(false);

  await page.locator("#mapTab").tap();
  await expect(page.locator("#minimapPanel")).toBeVisible();
  await expect(page.locator("#minimapTitle")).toContainText("OVERWORLD MAP");
  await page.screenshot({ path: "artifacts/screenshots/hud-map-button-minimap-open.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/overworld-discovered-minimap.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/clear-game-viewport-no-controls.png", fullPage: true });
  await page.locator("#inventoryBtn").tap();
  await expect(page.locator("#inventoryPanel")).toBeVisible();
  await expect(page.locator("#minimapPanel")).toBeHidden();

  await page.evaluate(() => window.__OTZI_TEST__.teleportToNearestResource("flint"));
  await page.waitForTimeout(1200);
  await expect(page.locator("#statusLine")).toContainText("USE: gather flint");
  const nearFlint = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(nearFlint.focusedResource?.resource).toBe("flint");
  expect(nearFlint.world.currentScreenId).not.toBe(initial.world.currentScreenId);
  await page.screenshot({ path: "artifacts/screenshots/no-aim-map-in-hud.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/bottom-controls-no-aim.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/focused-resource-label.png", fullPage: true });

  await page.locator("#useBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Gathered flint +1");
  const afterGather = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterGather.inventory.flint).toBe((nearFlint.inventory.flint || 0) + 1);
  expect(afterGather.resourceNodes.depleted).toBe(1);
  await page.screenshot({ path: "artifacts/screenshots/gather-success-flint.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/gather-focused-resource-only.png", fullPage: true });
  await page.screenshot({ path: "artifacts/screenshots/post-transition-resource-gather.png", fullPage: true });

  await page.locator("#inventoryBtn").tap();
  await expect(page.locator("#inventoryPanel")).toBeVisible();
  await expect(page.locator("#minimapPanel")).toBeHidden();
  await expect(page.locator("#invFlint")).toHaveText("1");
  await page.screenshot({ path: "artifacts/screenshots/mobile-ui-inventory-popup.png", fullPage: true });

  await page.locator("#menuBtn").tap();
  await expect(page.locator("#menuPanel")).toBeVisible();
  await expect(page.locator("#fullscreenBtn")).toBeVisible();
  await page.locator("#fullscreenBtn").tap();
  await expect(page.locator("#statusLine")).toContainText(/Fullscreen/);
  await page.locator("#resetSaveBtn").tap();
  await expect(page.locator("#resetSaveBtn")).toHaveText("Confirm Reset Save");
  await page.locator("#menuCloseBtn").tap();
  await expect(page.locator("#menuPanel")).toBeHidden();

  const saved = await page.evaluate(() => window.__OTZI_TEST__.saveNow());
  expect(saved).toBe(true);
  await page.reload();
  await expect(page.locator("#worldCanvas")).toBeVisible();
  await page.getByRole("button", { name: /start/i }).tap();
  const afterReload = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterReload.inventory.flint).toBe(1);
  expect(afterReload.resourceNodes.depleted).toBe(1);
  expect(afterReload.world.currentScreenId).toBe(afterGather.world.currentScreenId);

  await page.evaluate(() => window.__OTZI_TEST__.teleportToFlintScarEntrance());
  await page.waitForTimeout(1200);
  await expect(page.locator("#statusLine")).toContainText("USE: enter Flint Scar");
  const entranceFocus = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(entranceFocus.focusedEntrance?.label).toBe("Flint Scar");
  await page.screenshot({ path: "artifacts/screenshots/clean-game-view-map-tab.png", fullPage: true });
  await page.locator("#useBtn").tap();
  await page.waitForTimeout(200);
  const inDungeon = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(inDungeon.scene).toBe("dungeon");
  expect(inDungeon.dungeon?.id).toBe("flint_scar");
  expect(inDungeon.dungeon?.currentRoomId).toBeTruthy();
  await page.locator("#mapTab").tap();
  await expect(page.locator("#minimapPanel")).toBeVisible();
  await expect(page.locator("#minimapTitle")).toContainText("FLINT SCAR MAP");
  await page.screenshot({ path: "artifacts/screenshots/dungeon-room-minimap.png", fullPage: true });
  const dungeonSaved = await page.evaluate(() => window.__OTZI_TEST__.saveNow());
  expect(dungeonSaved).toBe(true);
  await page.reload();
  await expect(page.locator("#worldCanvas")).toBeVisible();
  await page.getByRole("button", { name: /start/i }).tap();
  const dungeonReload = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(dungeonReload.scene).toBe("dungeon");
  expect(dungeonReload.dungeon.active).toBe(true);
  expect(dungeonReload.dungeon.id).toBe("flint_scar");
  await page.evaluate(() => window.__OTZI_TEST__.teleportToFocusedEntrance());
  await page.waitForTimeout(1200);
  await expect(page.locator("#statusLine")).toContainText("USE: enter Forest Exit");
  await page.locator("#useBtn").tap();
  await page.waitForTimeout(200);
  const backOutside = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(backOutside.scene).toBe("overworld");
  expect(backOutside.world.currentScreenId).toBe("overworld_5_4");
  await page.locator("#mapTab").tap();
  await expect(page.locator("#minimapTitle")).toContainText("OVERWORLD MAP");
  await page.screenshot({ path: "artifacts/screenshots/flint-scar-enter-exit.png", fullPage: true });

  await page.locator("#menuBtn").tap();
  await expect(page.locator("#menuPanel")).toBeVisible();
  await page.locator("#resetSaveBtn").tap();
  await expect(page.locator("#resetSaveBtn")).toHaveText("Confirm Reset Save");
  await page.locator("#resetSaveBtn").tap();
  await expect(page.locator("#statusLine")).toContainText("Save reset");
  const afterReset = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(afterReset.inventory.flint).toBe(0);
  expect(afterReset.scene).toBe("overworld");
  expect(afterReset.world.currentScreenId).toBe("overworld_4_4");
  expect(afterReset.world.discoveredCount).toBe(1);
  expect(afterReset.dungeon.discoveredCount).toBe(0);
  if (await page.locator("#welcomePanel").isVisible()) {
    await page.locator("#welcomeOkBtn").tap();
  }

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
  if (await page.locator("#welcomePanel").isVisible()) {
    await page.locator("#welcomeOkBtn").tap();
  }
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
