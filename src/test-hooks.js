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
        minimap: g.minimap,
        menuOpen: g.menuOpen,
        status: OTZI.dialogue.message,
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
    teleportToVillage() {
      OTZI.game.player.x = OTZI.CFG.mapW * OTZI.CFG.tileSize / 2;
      OTZI.game.player.y = OTZI.CFG.mapH * OTZI.CFG.tileSize / 2;
    },
    teleportToNearestResource(resourceType = null) {
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
        OTZI.game.player.x = best.x - ts * 0.9;
        OTZI.game.player.y = best.y;
        OTZI.camera.update();
      }
      return best;
    },
    teleportToResource(id) {
      const node = OTZI.resources.getById(OTZI.game.resourceNodes, id);
      if (!node) return null;
      OTZI.game.player.x = node.x - OTZI.CFG.tileSize * 0.9;
      OTZI.game.player.y = node.y;
      OTZI.camera.update();
      return { ...node };
    },
    resourceNode(id) {
      const node = OTZI.resources.getById(OTZI.game.resourceNodes, id);
      return node ? { ...node } : null;
    },
    give(item, n = 1) { OTZI.inventory.add(item, n); },
    completeDungeon(id = "flint_cave") {
      if (!OTZI.game.village.unlocked.includes(id)) OTZI.game.village.unlocked.push(id);
    },
    exportSave() { return OTZI.save.exportString(); },
    importSave(str) { OTZI.save.importString(str); },
    toggleDebug() { OTZI.debug.toggle(); }
  };
};
