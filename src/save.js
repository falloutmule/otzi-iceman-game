/* SECTION 10: SAVE */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.save = {
  snapshot() {
    const g = OTZI.game;
    return {
      version: OTZI.CFG.saveVersion,
      engineVersion: OTZI.CFG.engineVersion,
      seed: g.seed,
      scene: g.scene,
      player: { x: g.player.x, y: g.player.y },
      meters: OTZI.survival.snapshot(g.player),
      minimap: g.minimap,
      inventory: g.inventory,
      overworld: {
        currentX: g.world.currentX,
        currentY: g.world.currentY,
        discovered: Object.keys(g.world.discovered),
        screens: OTZI.worldGrid.collectAreaStates(g.world.screens)
      },
      dungeon: g.currentDungeon ? {
        id: g.currentDungeon.id,
        currentX: g.currentDungeon.currentX,
        currentY: g.currentDungeon.currentY,
        discovered: Object.keys(g.currentDungeon.discovered),
        rooms: OTZI.worldGrid.collectAreaStates(g.currentDungeon.rooms),
        returnScreen: g.returnScreen
      } : null,
      village: g.village,
      facts: g.facts
    };
  },
  apply(data) {
    if (!data || data.version !== OTZI.CFG.saveVersion) throw new Error("Unsupported save version");
    const g = OTZI.game;
    g.setSeed(data.seed || OTZI.CFG.defaultSeed);
    if (data.overworld?.discovered) {
      g.world.discovered = Object.fromEntries(data.overworld.discovered.map((key) => [key, true]));
    }
    for (const state of data.overworld?.screens || []) OTZI.worldGrid.applyAreaState(g.world, g.seed, state);
    if (data.dungeon?.id) {
      g.currentDungeon = OTZI.worldGrid.createDungeon(g.seed, data.dungeon.id);
      g.currentDungeon.discovered = Object.fromEntries((data.dungeon.discovered || []).map((key) => [key, true]));
      for (const state of data.dungeon.rooms || []) OTZI.worldGrid.applyAreaState(g.currentDungeon, g.seed, state);
      g.returnScreen = data.dungeon.returnScreen || null;
    }
    if (data.scene === "dungeon" && data.dungeon?.id) {
      g.enterDungeonRoom(data.dungeon.currentX, data.dungeon.currentY, { keepScene: true, restorePlayer: true });
    } else {
      g.enterOverworldScreen(data.overworld?.currentX ?? g.world.homeX, data.overworld?.currentY ?? g.world.homeY, { keepScene: true, restorePlayer: true });
    }
    g.player.x = data.player?.x || g.player.x;
    g.player.y = data.player?.y || g.player.y;
    OTZI.survival.apply(OTZI.game.player, data.meters);
    g.inventory = { ...g.inventory, ...(data.inventory || {}) };
    g.minimap = !!data.minimap;
    g.village = { ...g.village, ...(data.village || {}) };
    g.facts = { ...g.facts, ...(data.facts || {}) };
    g.updateFocusState();
  },
  save() {
    try {
      localStorage.setItem(OTZI.CFG.saveKey, JSON.stringify(this.snapshot()));
      return true;
    } catch (_) {
      return false;
    }
  },
  load() {
    try {
      const raw = localStorage.getItem(OTZI.CFG.saveKey);
      if (!raw) return false;
      this.apply(JSON.parse(raw));
      return true;
    } catch (_) {
      return false;
    }
  },
  clear() {
    try {
      localStorage.removeItem(OTZI.CFG.saveKey);
    } catch (_) {}
    OTZI.game.setSeed(OTZI.CFG.defaultSeed);
    OTZI.game.minimap = false;
    OTZI.game.inventoryOpen = false;
    OTZI.game.menuOpen = false;
    OTZI.game.resetConfirm = false;
    OTZI.input?.clearAll?.();
    OTZI.dialogue.toast("Save reset");
    return true;
  },
  exportString() {
    return btoa(unescape(encodeURIComponent(JSON.stringify(this.snapshot()))));
  },
  importString(str) {
    this.apply(JSON.parse(decodeURIComponent(escape(atob(str)))));
  }
};
