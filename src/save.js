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
      resources: {
        depleted: OTZI.resources.depletedDeltas(g.resourceNodes)
      },
      village: g.village,
      facts: g.facts
    };
  },
  apply(data) {
    if (!data || data.version !== OTZI.CFG.saveVersion) throw new Error("Unsupported save version");
    OTZI.game.setSeed(data.seed || OTZI.CFG.defaultSeed);
    OTZI.game.player.x = data.player?.x || OTZI.game.player.x;
    OTZI.game.player.y = data.player?.y || OTZI.game.player.y;
    OTZI.survival.apply(OTZI.game.player, data.meters);
    OTZI.game.inventory = { ...OTZI.game.inventory, ...(data.inventory || {}) };
    OTZI.resources.applyDepletedDeltas(OTZI.game.resourceNodes, OTZI.game.map, data.resources?.depleted || []);
    OTZI.game.minimap = !!data.minimap;
    OTZI.game.village = { ...OTZI.game.village, ...(data.village || {}) };
    OTZI.game.facts = { ...OTZI.game.facts, ...(data.facts || {}) };
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
  exportString() {
    return btoa(unescape(encodeURIComponent(JSON.stringify(this.snapshot()))));
  },
  importString(str) {
    this.apply(JSON.parse(decodeURIComponent(escape(atob(str)))));
  }
};
