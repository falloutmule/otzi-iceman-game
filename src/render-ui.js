/* SECTION 09C: RENDER UI */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.renderUi = {
  sync() {
    const game = OTZI.game;
    OTZI.dom.healthChip.textContent = `HP ${Math.round(game.player.health)}`;
    OTZI.dom.staminaChip.textContent = `STAM ${Math.round(game.player.stamina)}`;
    OTZI.dom.hungerChip.textContent = `HUNGER ${Math.round(game.player.hunger)}`;
    OTZI.dom.warmthChip.textContent = `WARMTH ${Math.round(game.player.warmth)}`;
    if (!OTZI.dialogue.hasActiveToast()) {
      OTZI.dialogue.message = game.focusedEntrance ? `USE: enter ${game.focusedEntrance.label}` :
        game.focusedResource ? `USE: gather ${game.focusedResource.resource}` : "No resource nearby";
      OTZI.dom.statusLine.textContent = OTZI.dialogue.message;
    }
    OTZI.dom.minimapPanel.hidden = !game.minimap;
    if (game.minimap) this.drawMinimap();
    OTZI.dom.inventoryPanel.hidden = !game.inventoryOpen;
    if (game.inventoryOpen) {
      OTZI.dom.invFlint.textContent = String(game.inventory.flint || 0);
      OTZI.dom.invStick.textContent = String(game.inventory.stick || 0);
      OTZI.dom.invStone.textContent = String(game.inventory.stone || 0);
      OTZI.dom.invBark.textContent = String(game.inventory.bark || 0);
      OTZI.dom.invGrass.textContent = String(game.inventory.grass || 0);
      OTZI.dom.invFood.textContent = String(game.inventory.food || 0);
      OTZI.dom.invCrudeTool.textContent = String(game.inventory.crudeTool || 0);
    }
    OTZI.dom.menuPanel.hidden = !game.menuOpen;
    if (game.menuOpen) {
      OTZI.dom.menuSeed.textContent = game.seed;
      OTZI.dom.menuFlint.textContent = String(game.inventory.flint || 0);
      OTZI.dom.menuStick.textContent = String(game.inventory.stick || 0);
      OTZI.dom.menuStone.textContent = String(game.inventory.stone || 0);
      OTZI.dom.menuBark.textContent = String(game.inventory.bark || 0);
      OTZI.dom.menuGrass.textContent = String(game.inventory.grass || 0);
      OTZI.dom.menuFood.textContent = String(game.inventory.food || 0);
      OTZI.dom.menuCrudeTool.textContent = String(game.inventory.crudeTool || 0);
      OTZI.dom.menuStamina.textContent = Math.round(game.player.stamina).toString();
      OTZI.dom.resetSaveBtn.textContent = game.resetConfirm ? "Confirm Reset Save" : "Reset Save";
    }
    if (!game.debug) {
      OTZI.dom.debugPanel.hidden = true;
      return;
    }
      OTZI.dom.debugPanel.hidden = false;
    const tileX = Math.floor(game.player.x / OTZI.CFG.tileSize);
    const tileY = Math.floor(game.player.y / OTZI.CFG.tileSize);
    const areaDebug = game.scene === "dungeon" && game.currentDungeon ?
      `dungeon ${game.currentDungeon.id} room ${game.currentDungeon.currentX},${game.currentDungeon.currentY}` :
      `screen ${game.world.currentX},${game.world.currentY} ${game.currentScreen ? game.currentScreen.kind : "none"}`;
    OTZI.dom.debugPanel.textContent = [
      `seed ${game.seed}`,
      areaDebug,
      `tile ${tileX},${tileY}`,
      `entry ${game.focusedEntrance ? `${game.focusedEntrance.label} ${game.focusedEntrance.id}` : "none"}`,
      `focus ${game.focusedResource ? `${game.focusedResource.resource} ${game.focusedResource.id} tile ${game.focusedResource.tileX},${game.focusedResource.tileY} dist ${game.focusedResource.dist.toFixed(1)}` : "none"}`,
      `fps ${game.fps.toFixed(1)}`,
      `entities ${game.entities.length}`,
      `resources ${game.resourceNodes ? OTZI.resources.count(game.resourceNodes).active : 0}`,
      `pointers ${OTZI.input.pointers.size}`,
      `canvas ${OTZI.viewport.internalW}x${OTZI.viewport.internalH}`,
      `flint ${game.inventory.flint || 0}`
    ].join(" | ");
  },
  drawMinimap() {
    const ctx = OTZI.dom.minimapCtx;
    const w = OTZI.dom.minimapCanvas.width;
    const h = OTZI.dom.minimapCanvas.height;
    ctx.fillStyle = "#07100c";
    ctx.fillRect(0, 0, w, h);
    const game = OTZI.game;
    if (game.scene === "dungeon" && game.currentDungeon) {
      OTZI.dom.minimapTitle.textContent = "FLINT SCAR";
      const dungeon = game.currentDungeon;
      const cellW = Math.floor(w / dungeon.gridW);
      const cellH = Math.floor(h / dungeon.gridH);
      for (let y = 0; y < dungeon.gridH; y++) {
        for (let x = 0; x < dungeon.gridW; x++) {
          const discovered = OTZI.worldGrid.isDiscovered(dungeon, x, y);
          ctx.fillStyle = discovered ? "#4d4b3d" : "#101611";
          ctx.fillRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
        }
      }
      ctx.fillStyle = "#f0c666";
      ctx.fillRect(dungeon.currentX * cellW + 4, dungeon.currentY * cellH + 4, cellW - 8, cellH - 8);
      return;
    }
    OTZI.dom.minimapTitle.textContent = "OVERWORLD MAP";
    const world = game.world;
    const cellW = Math.floor(w / world.gridW);
    const cellH = Math.floor(h / world.gridH);
    for (let y = 0; y < world.gridH; y++) {
      for (let x = 0; x < world.gridW; x++) {
        if (!OTZI.worldGrid.isDiscovered(world, x, y)) {
          ctx.fillStyle = "#0e140f";
          ctx.fillRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
          continue;
        }
        const screen = OTZI.worldGrid.getOverworldScreen(world, game.seed, x, y);
        ctx.fillStyle = screen.kind === "village_crossroads" ? "#9a784b" :
          screen.kind === "flint_scar" ? "#c9d0d4" : "#315b36";
        ctx.fillRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
        if (screen.kind === "flint_scar") {
          ctx.fillStyle = "#ffe3a5";
          ctx.fillRect(x * cellW + Math.floor(cellW / 2) - 2, y * cellH + Math.floor(cellH / 2) - 2, 4, 4);
        }
      }
    }
    ctx.fillStyle = "#f0c666";
    ctx.fillRect(world.currentX * cellW + 4, world.currentY * cellH + 4, cellW - 8, cellH - 8);
  }
};
