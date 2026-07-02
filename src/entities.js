/* SECTION 08A: ENTITIES */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.entities = {
  makePlayer() {
    const cfg = OTZI.CFG;
    return {
      id: "player",
      kind: "player",
      x: cfg.screenTileW * cfg.tileSize / 2,
      y: cfg.screenTileH * cfg.tileSize / 2,
      radius: 8,
      health: 100,
      stamina: 100,
      hunger: 0,
      warmth: 100,
      wetness: 0
    };
  },
  spawnScreen(seed, areaId, map, kind) {
    const rng = OTZI.rng.make(`${seed}:entities:${areaId}`);
    const out = [];
    const count = kind === "village_crossroads" || kind === "flint_scar" || areaId.indexOf("dungeon") === 0 ? 0 : 2;
    for (let i = 0; i < count; i++) {
      let x = 0;
      let y = 0;
      for (let attempt = 0; attempt < 24; attempt++) {
        x = rng.range(3, map.w - 3) * OTZI.CFG.tileSize;
        y = rng.range(3, map.h - 3) * OTZI.CFG.tileSize;
        if (!(map.getFlags(Math.floor(x / OTZI.CFG.tileSize), Math.floor(y / OTZI.CFG.tileSize)) & OTZI.FLAG.BLOCKED)) break;
      }
      out.push({
        id: `${areaId}-deer-${i}`,
        kind: "deer",
        x,
        y,
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
