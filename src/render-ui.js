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
      const focus = game.focusedResource;
      OTZI.dialogue.message = focus ? `USE: gather ${focus.resource}` : "No resource nearby";
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
    OTZI.dom.debugPanel.textContent = [
      `seed ${game.seed}`,
      `tile ${tileX},${tileY}`,
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
    const map = OTZI.game.map;
    const w = OTZI.dom.minimapCanvas.width;
    const h = OTZI.dom.minimapCanvas.height;
    ctx.fillStyle = "#07100c";
    ctx.fillRect(0, 0, w, h);
    const sx = w / map.w;
    const sy = h / map.h;
    for (let y = 0; y < map.h; y += 3) {
      for (let x = 0; x < map.w; x += 3) {
        const flags = map.getFlags(x, y);
        const ground = map.getGround(x, y);
        ctx.fillStyle = flags & OTZI.FLAG.BLOCKED ? "#172a1d" :
          ground === OTZI.TILE.PATH ? "#9a784b" :
          ground === OTZI.TILE.WATER ? "#2d6f86" : "#315b36";
        ctx.fillRect(Math.floor(x * sx), Math.floor(y * sy), Math.ceil(sx * 3), Math.ceil(sy * 3));
      }
    }
    ctx.fillStyle = "#f0c666";
    ctx.beginPath();
    ctx.arc((OTZI.game.player.x / OTZI.CFG.tileSize) * sx, (OTZI.game.player.y / OTZI.CFG.tileSize) * sy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
};
