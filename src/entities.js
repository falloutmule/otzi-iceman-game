/* SECTION 08A: ENTITIES */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.entities = {
  makePlayer() {
    const cfg = OTZI.CFG;
    return {
      id: "player",
      kind: "player",
      x: cfg.mapW * cfg.tileSize / 2,
      y: cfg.mapH * cfg.tileSize / 2,
      radius: 8,
      health: 100,
      stamina: 100,
      hunger: 0,
      warmth: 100,
      wetness: 0
    };
  },
  spawnWorld(seed) {
    const rng = OTZI.rng.make(seed + ":entities");
    const out = [];
    for (let i = 0; i < 12; i++) {
      out.push({
        id: "deer-" + i,
        kind: "deer",
        x: rng.range(8, OTZI.CFG.mapW - 8) * OTZI.CFG.tileSize,
        y: rng.range(8, OTZI.CFG.mapH - 8) * OTZI.CFG.tileSize,
        radius: 7,
        phase: rng.range(0, Math.PI * 2)
      });
    }
    return out;
  },
  update(dt) {
    const game = OTZI.game;
    for (const e of game.entities) {
      if (e.kind !== "deer") continue;
      e.phase += dt;
      const dx = Math.cos(e.phase * 0.7) * 8 * dt;
      const dy = Math.sin(e.phase * 0.9) * 8 * dt;
      const moved = OTZI.collision.moveCircle(e, dx, dy);
      e.x = moved.x;
      e.y = moved.y;
    }
  }
};
