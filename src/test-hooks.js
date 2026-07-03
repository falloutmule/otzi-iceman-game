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
        equipment: JSON.parse(JSON.stringify(g.equipment || {})),
        progress: JSON.parse(JSON.stringify(g.progress || {})),
        village: JSON.parse(JSON.stringify(g.village)),
        facts: JSON.parse(JSON.stringify(g.facts)),
        entityCount: g.entities.length,
        particleCount: 0,
        debug: g.debug,
        currentAreaId: g.currentArea ? g.currentArea.id : null,
        minimap: g.minimap,
        inventoryOpen: g.inventoryOpen,
        menuOpen: g.menuOpen,
        welcomeOpen: g.welcomeOpen,
        status: OTZI.dialogue.message,
        objective: OTZI.objectives.current(g),
        areaCard: g.areaCard,
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
          outcome: g.focusedEntity.outcome || null,
          dist: g.focusedEntity.dist,
          interactMode: g.focusedEntity.interactMode || null
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
      const hare = (OTZI.game.entities || []).find((entity) => (entity.kind === "hare" || entity.kind === "grouse") && !entity.caught && !entity.escaped);
      if (!hare) return null;
      OTZI.game.player.x = hare.x - 10;
      OTZI.game.player.y = hare.y;
      OTZI.game.lastSprinting = true;
      this.stepFrames(2);
      OTZI.game.lastSprinting = false;
      return this.snapshot();
    },
    stepHareOutcome(frames = 180) {
      this.stepFrames(frames);
      const animal = (OTZI.game.entities || []).find((entity) => entity.kind === "hare" || entity.kind === "grouse");
      return animal ? {
        kind: animal.kind,
        state: animal.state,
        caught: !!animal.caught,
        escaped: !!animal.escaped,
        outcome: animal.outcome || null,
        resolveTimer: animal.resolveTimer || 0
      } : null;
    },
    teleportNearHare() {
      if (OTZI.game.currentScreen?.kind !== "animal_clearing") this.teleportToAnimalClearing();
      const animal = (OTZI.game.entities || []).find((entity) => (entity.kind === "hare" || entity.kind === "grouse") && !entity.caught && !entity.escaped);
      if (!animal) return null;
      OTZI.game.player.x = animal.x - OTZI.CFG.tileSize * 0.9;
      OTZI.game.player.y = animal.y;
      OTZI.camera.update();
      OTZI.game.updateFocusState();
      return { ...animal };
    },
    teleportToVillageHearth() {
      this.teleportToVillage();
      const hearth = (OTZI.game.entrances || []).find((entry) => entry.kind === "hearth");
      if (!hearth) return null;
      OTZI.game.player.x = hearth.x - OTZI.CFG.tileSize * 0.75;
      OTZI.game.player.y = hearth.y;
      OTZI.camera.update();
      OTZI.game.updateFocusState();
      return { ...hearth };
    },
    inspectFlintScarEntranceLane() {
      OTZI.game.ensureDungeon("flint_scar");
      OTZI.game.enterDungeonRoom(0, 1, { entrySide: "w" });
      const ts = OTZI.CFG.tileSize;
      const cy = Math.floor(OTZI.game.map.h / 2) + 0.5;
      const samples = [
        { label: "entry", x: 2.4, y: cy },
        { label: "entryMid", x: 4.2, y: cy },
        { label: "cross", x: Math.floor(OTZI.game.map.w / 2) - 0.5, y: cy },
        { label: "eastLane", x: OTZI.game.map.w - 3.3, y: cy }
      ].map((sample) => {
        const worldX = sample.x * ts;
        const worldY = sample.y * ts;
        return {
          label: sample.label,
          worldX,
          worldY,
          blocked: OTZI.collision.circleBlocked(worldX, worldY, OTZI.game.player.radius)
        };
      });
      return {
        roomId: OTZI.game.currentRoom?.id || null,
        samples
      };
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
    blockedHarvestTiles() {
      const out = [];
      for (let y = 0; y < OTZI.game.map.h; y++) {
        for (let x = 0; x < OTZI.game.map.w; x++) {
          const flags = OTZI.game.map.getFlags(x, y);
          if ((flags & OTZI.FLAG.HARVEST) && (flags & OTZI.FLAG.BLOCKED)) {
            out.push({
              tileX: x,
              tileY: y,
              ground: OTZI.game.map.getGround(x, y)
            });
          }
        }
      }
      return out;
    },
    give(item, n = 1) { OTZI.inventory.add(item, n); },
    equipSpear(kind) { return OTZI.game.equipSpear(kind); },
    throwTool() { return OTZI.game.tryToolUse(); },
    setMeters(meters) { OTZI.survival.apply(OTZI.game.player, meters); },
    completeDungeon(id = "flint_cave") {
      if (!OTZI.game.village.unlocked.includes(id)) OTZI.game.village.unlocked.push(id);
    },
    exportSave() { return OTZI.save.exportString(); },
    importSave(str) { OTZI.save.importString(str); },
    saveNow() { return OTZI.save.save(); },
    resetSave() { return OTZI.save.clear(); },
    dismissWelcome() { return OTZI.game.dismissWelcome(true); },
    readObjective() { return OTZI.objectives.current(OTZI.game); },
    teleportToAnimalHintScreen() {
      const world = OTZI.game.world;
      for (let y = 0; y < world.gridH; y++) {
        for (let x = 0; x < world.gridW; x++) {
          const hint = OTZI.objectives.adjacentAnimalHint(world, x, y, OTZI.game.seed);
          if (!hint) continue;
          OTZI.game.enterOverworldScreen(x, y);
          return { snapshot: this.snapshot(), hint };
        }
      }
      return null;
    },
    toggleDebug() { OTZI.debug.toggle(); }
  };
};
