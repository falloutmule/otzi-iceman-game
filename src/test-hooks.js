/* SECTION 11: TEST_HOOKS */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.installTestHooks = function installTestHooks() {
  window.__OTZI_TEST__ = {
    snapshot() {
      const g = OTZI.game;
      const cfg = OTZI.CFG;
      return {
        engineVersion: cfg.engineVersion,
        saveVersion: cfg.saveVersion,
        scene: g.scene,
        seed: g.seed,
        player: {
          x: g.player.x,
          y: g.player.y,
          tileX: Math.floor(g.player.x / cfg.tileSize),
          tileY: Math.floor(g.player.y / cfg.tileSize),
          health: g.player.health,
          stamina: g.player.stamina,
          hunger: g.player.hunger,
          warmth: g.player.warmth,
          wetness: g.player.wetness
        },
        inventory: { ...g.inventory },
        village: JSON.parse(JSON.stringify(g.village)),
        facts: JSON.parse(JSON.stringify(g.facts)),
        entityCount: g.entities.length,
        particleCount: 0,
        debug: g.debug,
        currentAreaId: g.currentArea ? g.currentArea.id : null,
        minimap: g.minimap,
        inventoryOpen: g.inventoryOpen,
        menuOpen: g.menuOpen,
        status: OTZI.dialogue.message,
        world: {
          id: g.world.id,
          currentX: g.world.currentX,
          currentY: g.world.currentY,
          currentScreenId: g.currentScreen ? g.currentScreen.id : null,
          currentScreenKind: g.currentScreen ? g.currentScreen.kind : null,
          discoveredCount: Object.keys(g.world.discovered).length,
          gridW: g.world.gridW,
          gridH: g.world.gridH
        },
        dungeon: {
          active: !!g.currentDungeon && g.scene === "dungeon",
          id: g.currentDungeon ? g.currentDungeon.id : null,
          currentX: g.currentDungeon ? g.currentDungeon.currentX : null,
          currentY: g.currentDungeon ? g.currentDungeon.currentY : null,
          currentRoomId: g.currentRoom ? g.currentRoom.id : null,
          currentRoomKind: g.currentRoom ? g.currentRoom.kind : null,
          discoveredCount: g.currentDungeon ? Object.keys(g.currentDungeon.discovered).length : 0
        },
        dungeons: JSON.parse(JSON.stringify(g.dungeons || {})),
        transition: {
          active: g.transition.active,
          direction: g.transition.direction,
          elapsed: g.transition.elapsed,
          duration: g.transition.duration
        },
        nearestResource: (() => {
          const node = g.findNearestResource();
          return node ? {
            id: node.id,
            kind: node.kind,
            x: node.x,
            y: node.y,
            tileX: node.tileX,
            tileY: node.tileY,
            resource: node.resource,
            amount: node.amount,
            depleted: node.depleted,
            saveDeltaId: node.saveDeltaId,
            dist: node.dist
          } : null;
        })(),
        focusedResource: g.focusedResource ? {
          id: g.focusedResource.id,
          resource: g.focusedResource.resource,
          tileX: g.focusedResource.tileX,
          tileY: g.focusedResource.tileY,
          dist: g.focusedResource.dist
        } : null,
        focusedEntrance: g.focusedEntrance ? {
          id: g.focusedEntrance.id,
          label: g.focusedEntrance.label,
          tileX: g.focusedEntrance.tileX,
          tileY: g.focusedEntrance.tileY
        } : null,
        focusedEntity: g.focusedEntity ? {
          id: g.focusedEntity.id,
          kind: g.focusedEntity.kind,
          state: g.focusedEntity.state || null,
          dist: g.focusedEntity.dist
        } : null,
        resourceNodes: OTZI.resources.count(g.resourceNodes),
        viewport: {
          cssW: OTZI.viewport.cssW,
          cssH: OTZI.viewport.cssH,
          internalW: OTZI.viewport.internalW,
          internalH: OTZI.viewport.internalH,
          dpr: OTZI.viewport.dpr
        },
        input: {
          pointerCount: OTZI.input.pointers.size,
          movePointerActive: Array.from(OTZI.input.pointers.values()).includes("move"),
          sprintHeld: OTZI.input.sprintHeld
        }
      };
    },
    setSeed(seed) { OTZI.game.setSeed(seed); },
    stepFrames(n = 1) {
      for (let i = 0; i < n; i++) OTZI.game.update(OTZI.CFG.fixedDt, OTZI.actionMap.sample());
    },
    stepUntilTransitionSettles(maxFrames = 30) {
      for (let i = 0; i < maxFrames; i++) {
        if (!OTZI.game.transition.active) break;
        OTZI.game.update(OTZI.CFG.fixedDt, OTZI.actionMap.sample());
      }
      return this.snapshot();
    },
    teleportToVillage() {
      OTZI.game.enterOverworldScreen(OTZI.game.world.homeX, OTZI.game.world.homeY);
    },
    enterOverworldScreen(x, y) {
      OTZI.game.enterOverworldScreen(x, y);
      return this.snapshot();
    },
    teleportToScreenKind(kind) {
      const screen = OTZI.worldGrid.findScreenByKind(OTZI.game.world, OTZI.game.seed, kind);
      if (!screen) return null;
      OTZI.game.enterOverworldScreen(screen.gridX, screen.gridY);
      return this.snapshot();
    },
    screenKindCounts() {
      return OTZI.worldGrid.countScreenKinds(OTZI.game.world, OTZI.game.seed);
    },
    placeAndStepEdge(direction, frames = 2) {
      const ts = OTZI.CFG.tileSize;
      const pad = OTZI.CFG.transitionEdgePad;
      const maxX = OTZI.game.map.w * ts - pad;
      const maxY = OTZI.game.map.h * ts - pad;
      if (direction === "e") OTZI.game.player.x = maxX;
      if (direction === "w") OTZI.game.player.x = pad;
      if (direction === "s") OTZI.game.player.y = maxY;
      if (direction === "n") OTZI.game.player.y = pad;
      this.stepFrames(frames);
      return this.snapshot();
    },
    teleportAwayFromResources() {
      this.teleportToVillage();
      return this.snapshot().focusedResource || this.snapshot().focusedEntrance;
    },
    teleportToNearestResource(resourceType = null) {
      if (resourceType) {
        const foundScreen = OTZI.worldGrid.findScreenWithResource(OTZI.game.world, OTZI.game.seed, resourceType);
        if (foundScreen) OTZI.game.enterOverworldScreen(foundScreen.gridX, foundScreen.gridY);
      }
      let best = null;
      const ts = OTZI.CFG.tileSize;
      const px = OTZI.game.player.x;
      const py = OTZI.game.player.y;
      for (const node of OTZI.game.resourceNodes) {
        if (node.depleted) continue;
        if (resourceType && node.resource !== resourceType) continue;
        const dist = Math.hypot(node.x - px, node.y - py);
        if (!best || dist < best.dist) best = { ...node, dist };
      }
      if (best) {
        OTZI.game.player.x = best.x - ts * 0.8;
        OTZI.game.player.y = best.y;
        OTZI.camera.update();
        OTZI.game.updateFocusState();
      }
      return best;
    },
    teleportToResource(id) {
      const node = OTZI.resources.getById(OTZI.game.resourceNodes, id);
      if (!node) return null;
      OTZI.game.player.x = node.x - OTZI.CFG.tileSize * 0.8;
      OTZI.game.player.y = node.y;
      OTZI.camera.update();
      OTZI.game.updateFocusState();
      return { ...node };
    },
    teleportToFlintScarEntrance() {
      OTZI.game.enterOverworldScreen(OTZI.game.world.flintScarX, OTZI.game.world.flintScarY);
      const entry = OTZI.game.entrances[0];
      if (!entry) return null;
      OTZI.game.player.x = entry.x - OTZI.CFG.tileSize * 0.8;
      OTZI.game.player.y = entry.y;
      OTZI.camera.update();
      OTZI.game.updateFocusState();
      return { ...entry };
    },
    teleportToAnimalClearing() {
      const screen = OTZI.worldGrid.findScreenByKind(OTZI.game.world, OTZI.game.seed, "animal_clearing");
      if (!screen) return null;
      OTZI.game.enterOverworldScreen(screen.gridX, screen.gridY);
      OTZI.game.updateFocusState();
      return this.snapshot();
    },
    triggerHareFlee() {
      if (OTZI.game.currentScreen?.kind !== "animal_clearing") this.teleportToAnimalClearing();
      const hare = (OTZI.game.entities || []).find((entity) => entity.kind === "hare" && !entity.caught && !entity.escaped);
      if (!hare) return null;
      OTZI.game.player.x = hare.x - 10;
      OTZI.game.player.y = hare.y;
      OTZI.game.lastSprinting = true;
      this.stepFrames(2);
      OTZI.game.lastSprinting = false;
      return this.snapshot();
    },
    teleportNearHare() {
      if (OTZI.game.currentScreen?.kind !== "animal_clearing") this.teleportToAnimalClearing();
      const hare = (OTZI.game.entities || []).find((entity) => entity.kind === "hare" && !entity.caught && !entity.escaped);
      if (!hare) return null;
      OTZI.game.player.x = hare.x - OTZI.CFG.tileSize * 0.9;
      OTZI.game.player.y = hare.y;
      OTZI.camera.update();
      OTZI.game.updateFocusState();
      return { ...hare };
    },
    teleportNearCore() {
      OTZI.game.ensureDungeon("flint_scar");
      OTZI.game.enterDungeonRoom(2, 1);
      const core = (OTZI.game.entities || []).find((entity) => entity.kind === "good_flint_core" && !entity.collected);
      if (!core) return null;
      OTZI.game.player.x = core.x - OTZI.CFG.tileSize * 0.7;
      OTZI.game.player.y = core.y;
      OTZI.camera.update();
      OTZI.game.updateFocusState();
      return { ...core };
    },
    returnToVillage() {
      OTZI.game.enterOverworldScreen(OTZI.game.world.homeX, OTZI.game.world.homeY);
      return this.snapshot();
    },
    placePlayerAtEdge(direction) {
      OTZI.game.placePlayerForEntry(direction, { x: OTZI.game.player.x, y: OTZI.game.player.y });
      OTZI.game.updateFocusState();
      return this.snapshot();
    },
    focusedResource() {
      return OTZI.game.focusedResource ? { ...OTZI.game.focusedResource } : null;
    },
    focusedEntrance() {
      return OTZI.game.focusedEntrance ? { ...OTZI.game.focusedEntrance } : null;
    },
    teleportToFocusedEntrance() {
      const entry = OTZI.game.focusedEntrance || OTZI.game.entrances[0];
      if (!entry) return null;
      OTZI.game.player.x = entry.x - OTZI.CFG.tileSize * 0.8;
      OTZI.game.player.y = entry.y;
      OTZI.camera.update();
      OTZI.game.updateFocusState();
      return { ...entry };
    },
    screenSignature(x = OTZI.game.world.currentX, y = OTZI.game.world.currentY) {
      const screen = OTZI.worldGrid.getOverworldScreen(OTZI.game.world, OTZI.game.seed, x, y);
      return {
        id: screen.id,
        kind: screen.kind,
        exits: { ...screen.exits },
        resources: screen.resources.filter((node) => !node.depleted).map((node) => `${node.resource}:${node.tileX},${node.tileY}`).sort(),
        tiles: Array.from(screen.map.ground).join(",")
      };
    },
    spawnResourceDistanceMin() {
      const spawnX = OTZI.game.player.x;
      const spawnY = OTZI.game.player.y;
      let best = Infinity;
      for (const node of OTZI.game.resourceNodes) {
        if (node.depleted) continue;
        best = Math.min(best, Math.hypot(node.x - spawnX, node.y - spawnY));
      }
      return best;
    },
    resourceNode(id) {
      const node = OTZI.resources.getById(OTZI.game.resourceNodes, id);
      return node ? { ...node } : null;
    },
    give(item, n = 1) { OTZI.inventory.add(item, n); },
    setMeters(meters) { OTZI.survival.apply(OTZI.game.player, meters); },
    completeDungeon(id = "flint_cave") {
      if (!OTZI.game.village.unlocked.includes(id)) OTZI.game.village.unlocked.push(id);
    },
    exportSave() { return OTZI.save.exportString(); },
    importSave(str) { OTZI.save.importString(str); },
    saveNow() { return OTZI.save.save(); },
    resetSave() { return OTZI.save.clear(); },
    toggleDebug() { OTZI.debug.toggle(); }
  };
};
