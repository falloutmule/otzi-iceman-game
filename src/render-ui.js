/* SECTION 09C: RENDER UI */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.renderUi = {
  syncRecipeCard(stateNode, needsNode, haveNode, missingNode, buttonNode, recipe) {
    stateNode.textContent = recipe.canCraft ? "Ready" : "Missing";
    needsNode.textContent = `Needs: ${recipe.parts.map((part) => OTZI.crafting.formatCount(part.item, part.need)).join(", ")}`;
    haveNode.textContent = `Have: ${recipe.parts.map((part) => `${OTZI.crafting.label(part.item)} ${part.have} / ${part.need}`).join(" | ")}`;
    const missing = recipe.parts.filter((part) => part.missing > 0);
    missingNode.textContent = missing.length
      ? `Missing: ${missing.map((part) => OTZI.crafting.formatCount(part.item, part.missing)).join(", ")}`
      : "Missing: none";
    buttonNode.disabled = false;
    buttonNode.setAttribute("data-craftable", recipe.canCraft ? "true" : "false");
  },
  sync() {
    const game = OTZI.game;
    OTZI.dom.healthChip.textContent = `HP ${Math.round(game.player.health)}`;
    OTZI.dom.staminaChip.textContent = `STAM ${Math.round(game.player.stamina)}`;
    OTZI.dom.hungerChip.textContent = `HUNGER ${Math.round(game.player.hunger)}`;
    OTZI.dom.warmthChip.textContent = `WARMTH ${Math.round(game.player.warmth)}`;
    const objective = OTZI.objectives.current(game);
    OTZI.dom.objectiveTitle.textContent = objective.title;
    OTZI.dom.objectiveText.textContent = objective.text;
    OTZI.dom.minimapLegend.innerHTML = game.scene === "dungeon" ? `
      <div><span>@</span><span>You</span></div>
      <div><span>E</span><span>Exit</span></div>
      <div><span>?</span><span>Unknown</span></div>
    ` : `
      <div><span>V</span><span>Village</span></div>
      <div><span>C</span><span>Flint Scar</span></div>
      <div><span>A</span><span>Animal Clearing</span></div>
      <div><span>B</span><span>Birch Grove</span></div>
      <div><span>W</span><span>Wolf Signs</span></div>
      <div><span>@</span><span>You</span></div>
      <div><span>?</span><span>Unknown</span></div>
    `;
    const spear = game.activeSpearStatus();
    OTZI.dom.toolBtn.innerHTML = spear.kind === "hardenedSpear" ? "THROW<br>HARDENED" :
      spear.kind === "crudeSpear" ? "THROW<br>CRUDE" :
      "THROW<br>TOOL";
    if (!OTZI.dialogue.hasActiveToast()) {
      OTZI.dialogue.message = game.transition.active ? `Traveling ${game.transition.direction}` :
      game.focusedEntity?.kind === "hare" && game.focusedEntity?.interactMode === "throw" ? `THROW: hunt hare with ${spear.label}` :
      game.focusedEntity?.kind === "grouse" && game.focusedEntity?.interactMode === "throw" ? `THROW: hunt grouse with ${spear.label}` :
      game.focusedEntity?.state === "downed" && game.focusedEntity?.kind === "hare" ? "Animal downed - USE to harvest hare" :
      game.focusedEntity?.state === "downed" && game.focusedEntity?.kind === "grouse" ? "Animal downed - USE to harvest grouse" :
      game.focusedEntity?.kind === "hare" ? "USE: catch hare" :
      game.focusedEntity?.kind === "grouse" ? "USE: catch grouse" :
      game.focusedEntity?.kind === "good_flint_core" ? "USE: take good flint core" :
      game.focusedEntrance?.kind === "hearth" && (game.inventory.rawMeat || 0) > 0 ? "USE: cook raw meat" :
      game.focusedEntrance?.kind === "hearth" ? "USE: harden spear tip" :
        game.focusedEntrance ? `USE: enter ${game.focusedEntrance.label}` :
        game.focusedResource ? `USE: gather ${game.focusedResource.resource}` :
        (game.inventory.food || 0) > 0 ? "CRAFT: eat food to lower hunger" :
        spear.kind ? `THROW: ${spear.label} ready` : "No resource nearby";
      OTZI.dom.statusLine.textContent = OTZI.dialogue.message;
    }
    OTZI.dom.welcomePanel.hidden = !game.welcomeOpen;
    OTZI.dom.areaCard.hidden = !game.isAreaCardVisible();
    if (game.isAreaCardVisible() && game.areaCard) {
      OTZI.dom.areaCardTitle.textContent = game.areaCard.title;
      OTZI.dom.areaCardText.textContent = game.areaCard.text;
    }
    OTZI.dom.minimapPanel.hidden = !game.minimap;
    if (game.minimap) this.drawMinimap();
    OTZI.dom.craftPanel.hidden = !game.inventoryOpen;
    if (game.inventoryOpen) {
      OTZI.dom.craftFlint.textContent = String(game.inventory.flint || 0);
      OTZI.dom.craftStick.textContent = String(game.inventory.stick || 0);
      OTZI.dom.craftStone.textContent = String(game.inventory.stone || 0);
      OTZI.dom.craftBark.textContent = String(game.inventory.bark || 0);
      OTZI.dom.craftGrass.textContent = String(game.inventory.grass || 0);
      OTZI.dom.craftFood.textContent = String(game.inventory.food || 0);
      OTZI.dom.craftRawMeat.textContent = String(game.inventory.rawMeat || 0);
      OTZI.dom.craftCrudeTool.textContent = String(game.inventory.crudeTool || 0);
      OTZI.dom.craftCrudeSpear.textContent = String(game.inventory.crudeSpear || 0);
      OTZI.dom.craftHardenedSpear.textContent = String(game.inventory.hardenedSpear || 0);
      OTZI.dom.craftGoodFlintCore.textContent = String(game.inventory.goodFlintCore || 0);
      const crudeToolRecipe = OTZI.crafting.describeRecipe("crude_cutting_tool", game.inventory);
      const crudeSpearRecipe = OTZI.crafting.describeRecipe("crude_spear", game.inventory);
      const harden = OTZI.crafting.describeHardening(game);
      const cook = OTZI.crafting.describeCooking(game);
      this.syncRecipeCard(
        OTZI.dom.recipeCrudeToolState,
        OTZI.dom.recipeCrudeToolNeeds,
        OTZI.dom.recipeCrudeToolHave,
        OTZI.dom.recipeCrudeToolMissing,
        OTZI.dom.craftCrudeToolBtn,
        crudeToolRecipe
      );
      this.syncRecipeCard(
        OTZI.dom.recipeCrudeSpearState,
        OTZI.dom.recipeCrudeSpearNeeds,
        OTZI.dom.recipeCrudeSpearHave,
        OTZI.dom.recipeCrudeSpearMissing,
        OTZI.dom.craftCrudeSpearBtn,
        crudeSpearRecipe
      );
      OTZI.dom.recipeHardenSpearState.textContent = harden.canHarden ? "Ready" : harden.haveSpear > 0 ? "Need Hearth" : "Need Spear";
      OTZI.dom.recipeHardenSpearNeeds.textContent = harden.needsText;
      OTZI.dom.recipeHardenSpearHave.textContent = harden.haveText;
      OTZI.dom.recipeHardenSpearMissing.textContent = harden.statusText;
      OTZI.dom.hardenSpearBtn.disabled = false;
      OTZI.dom.hardenSpearBtn.setAttribute("data-craftable", harden.canHarden ? "true" : "false");
      OTZI.dom.hardenSpearBtn.textContent = "Harden Spear Tip";
      OTZI.dom.recipeCookMeatState.textContent = cook.canCook ? "Ready" : "Need Hearth";
      OTZI.dom.recipeCookMeatNeeds.textContent = cook.needsText;
      OTZI.dom.recipeCookMeatHave.textContent = cook.haveText;
      OTZI.dom.recipeCookMeatMissing.textContent = cook.statusText;
      OTZI.dom.cookMeatBtn.disabled = false;
      OTZI.dom.cookMeatBtn.setAttribute("data-craftable", cook.canCook ? "true" : "false");
      OTZI.dom.cookMeatBtn.textContent = "Cook Meat";
      const eat = OTZI.crafting.describeEating(game);
      OTZI.dom.recipeEatFoodState.textContent = eat.canEat ? "Ready" : "Missing";
      OTZI.dom.recipeEatFoodNeeds.textContent = eat.needsText;
      OTZI.dom.recipeEatFoodHave.textContent = eat.haveText;
      OTZI.dom.recipeEatFoodMissing.textContent = eat.statusText;
      OTZI.dom.eatFoodBtn.disabled = false;
      OTZI.dom.eatFoodBtn.setAttribute("data-craftable", eat.canEat ? "true" : "false");
      OTZI.dom.eatFoodBtn.textContent = "Eat Food";
      OTZI.dom.equipCrudeSpearBtn.disabled = (game.inventory.crudeSpear || 0) < 1;
      OTZI.dom.equipHardenedSpearBtn.disabled = (game.inventory.hardenedSpear || 0) < 1;
      OTZI.dom.equipCrudeSpearBtn.textContent = game.equipment.spear === "crudeSpear" ? "Crude Spear Equipped" : "Equip Crude Spear";
      OTZI.dom.equipHardenedSpearBtn.textContent = game.equipment.spear === "hardenedSpear" ? `Hardened Spear Equipped (${Math.max(1, game.equipment.durability || 0)})` : "Equip Hardened Spear";
      OTZI.dom.equipHint.textContent = !spear.kind ? "No spear equipped." :
        spear.kind === "hardenedSpear" ? `Hardened spear equipped. Durability ${spear.durability}.` :
        "Crude spear equipped. The next throw will lose it.";
      OTZI.dom.craftHint.textContent = cook.canCook ? "The village hearth is ready for cooking." :
        eat.canEat ? "Eat food to lower hunger." :
        harden.canHarden ? "The village hearth is ready for hardening." :
        (game.inventory.rawMeat || 0) > 0 ? "Return to the village hearth to cook raw meat." :
        (game.inventory.crudeSpear || 0) > 0 ? "Return to the village hearth to harden the spear tip." :
        "Collect materials and craft tools or spears here.";
    }
    OTZI.dom.systemPanel.hidden = !game.menuOpen;
    if (game.menuOpen) {
      OTZI.dom.menuSeed.textContent = game.seed;
      OTZI.dom.menuToolmaker.textContent = OTZI.village.has("toolmaker") ? "Unlocked" : "Locked";
      OTZI.dom.menuLatestFact.textContent = OTZI.facts.latestDiscovered()?.title || "None";
      OTZI.dom.menuStamina.textContent = Math.round(game.player.stamina).toString();
      OTZI.dom.menuBuildVersion.textContent = OTZI.CFG.engineVersion;
      OTZI.dom.menuSaveVersion.textContent = String(OTZI.CFG.saveVersion);
      OTZI.dom.menuWorldgenVersion.textContent = String(OTZI.CFG.worldgenVersion);
      OTZI.dom.saveDataBox.placeholder = "Exported save data appears here. Paste save data here to import.";
      OTZI.dom.resetSaveBtn.textContent = game.resetConfirm ? "Confirm Reset Save" : "Reset Save";
      OTZI.dom.viewFactBtn.hidden = !OTZI.facts.latestDiscovered();
    }
    OTZI.dom.factPanel.hidden = !game.factOpen;
    if (game.factOpen) {
      const fact = OTZI.facts.get(game.activeFactId);
      OTZI.dom.factTitle.textContent = fact?.title || "-";
      OTZI.dom.factMeta.textContent = fact ? `${fact.status.toUpperCase()} | ${fact.category}` : "-";
      OTZI.dom.factText.textContent = fact?.shortText || "-";
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
      `kind ${game.currentArea?.kind || "none"}`,
      `transition ${game.transition.active ? `${game.transition.direction} ${game.transition.elapsed.toFixed(2)}/${game.transition.duration.toFixed(2)}` : "none"}`,
      `tile ${tileX},${tileY}`,
      `entry ${game.focusedEntrance ? `${game.focusedEntrance.label} ${game.focusedEntrance.id}` : "none"}`,
      `entity ${game.focusedEntity ? `${game.focusedEntity.kind} ${game.focusedEntity.id}` : "none"}`,
      `focus ${game.focusedResource ? `${game.focusedResource.resource} ${game.focusedResource.id} tile ${game.focusedResource.tileX},${game.focusedResource.tileY} dist ${game.focusedResource.dist.toFixed(1)}` : "none"}`,
      `fps ${game.fps.toFixed(1)}`,
      `entities ${game.entities.length}`,
      `resources ${game.resourceNodes ? OTZI.resources.count(game.resourceNodes).active : 0}`,
      `spear ${spear.kind || "none"}${spear.kind === "hardenedSpear" ? `:${spear.durability}` : ""}`,
      `hunt ${game.progress.smallGameHunts || 0}`,
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
      OTZI.dom.minimapTitle.textContent = "FLINT SCAR MAP";
      const dungeon = game.currentDungeon;
      const cellW = Math.floor(w / dungeon.gridW);
      const cellH = Math.floor(h / dungeon.gridH);
      ctx.font = "700 9px ui-monospace,Consolas,monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let y = 0; y < dungeon.gridH; y++) {
        for (let x = 0; x < dungeon.gridW; x++) {
          const discovered = OTZI.worldGrid.isDiscovered(dungeon, x, y);
          const room = discovered ? OTZI.worldGrid.getDungeonRoom(dungeon, game.seed, x, y) : null;
          ctx.fillStyle = discovered ? "#4d4b3d" : "#101611";
          ctx.fillRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
          ctx.strokeStyle = "rgba(243,234,215,.14)";
          ctx.strokeRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
          if (room && room.entrances.some((entry) => entry.kind === "exit")) {
            ctx.fillStyle = "#d9c79a";
            ctx.fillText("E", x * cellW + cellW / 2, y * cellH + cellH / 2);
          }
        }
      }
      ctx.fillStyle = "#f0c666";
      ctx.fillRect(dungeon.currentX * cellW + 4, dungeon.currentY * cellH + 4, cellW - 8, cellH - 8);
      ctx.fillStyle = "#09120d";
      ctx.fillText("@", dungeon.currentX * cellW + cellW / 2, dungeon.currentY * cellH + cellH / 2);
      return;
    }
    OTZI.dom.minimapTitle.textContent = "OVERWORLD MAP";
    const world = game.world;
    const cellW = Math.floor(w / world.gridW);
    const cellH = Math.floor(h / world.gridH);
    ctx.font = "700 8px ui-monospace,Consolas,monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let y = 0; y < world.gridH; y++) {
      for (let x = 0; x < world.gridW; x++) {
        if (!OTZI.worldGrid.isDiscovered(world, x, y)) {
          ctx.fillStyle = "#0e140f";
          ctx.fillRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
          ctx.strokeStyle = "rgba(243,234,215,.08)";
          ctx.strokeRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
          ctx.fillStyle = "#516255";
          ctx.fillText("?", x * cellW + cellW / 2, y * cellH + cellH / 2);
          continue;
        }
        const screen = OTZI.worldGrid.getOverworldScreen(world, game.seed, x, y);
        ctx.fillStyle = screen.kind === "village_home" ? "#9a784b" :
          screen.kind === "birch_grove" ? "#9bb57a" :
          screen.kind === "wolf_signs" ? "#5c5852" :
          screen.kind === "flint_scar_entrance" ? "#c9d0d4" :
          screen.kind === "animal_clearing" ? "#4f6b32" :
          screen.kind === "dense_forest" ? "#29422b" :
          screen.kind === "river_edge_placeholder" ? "#365f6e" :
          screen.kind === "high_pass_locked_placeholder" ? "#cad3da" : "#315b36";
        ctx.fillRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
        ctx.strokeStyle = "rgba(243,234,215,.14)";
        ctx.strokeRect(x * cellW + 1, y * cellH + 1, cellW - 2, cellH - 2);
        ctx.fillStyle = "#f6ead0";
        if (screen.kind === "village_home") ctx.fillText("V", x * cellW + cellW / 2, y * cellH + cellH / 2);
        else if (screen.kind === "flint_scar_entrance") ctx.fillText("C", x * cellW + cellW / 2, y * cellH + cellH / 2);
        else if (screen.kind === "animal_clearing") ctx.fillText("A", x * cellW + cellW / 2, y * cellH + cellH / 2);
        else if (screen.kind === "birch_grove") ctx.fillText("B", x * cellW + cellW / 2, y * cellH + cellH / 2);
        else if (screen.kind === "wolf_signs") ctx.fillText("W", x * cellW + cellW / 2, y * cellH + cellH / 2);
        else if (screen.kind === "quiet_empty") ctx.fillText(".", x * cellW + cellW / 2, y * cellH + cellH / 2);
      }
    }
    const markerX = game.transition.active && game.transition.targetX != null ? game.transition.targetX : world.currentX;
    const markerY = game.transition.active && game.transition.targetY != null ? game.transition.targetY : world.currentY;
    ctx.fillStyle = "#f0c666";
    ctx.fillRect(markerX * cellW + 4, markerY * cellH + 4, cellW - 8, cellH - 8);
    ctx.fillStyle = "#09120d";
    ctx.fillText("@", markerX * cellW + cellW / 2, markerY * cellH + cellH / 2);
  }
};
