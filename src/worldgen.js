/* SECTION 07B: WORLDGEN */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.worldgen = {
  generate(seed) {
    const cfg = OTZI.CFG;
    const map = OTZI.tilemap.create(cfg.mapW, cfg.mapH);
    const rng = OTZI.rng.make(seed + ":world:" + cfg.worldgenVersion);
    const cx = Math.floor(cfg.mapW / 2);
    const cy = Math.floor(cfg.mapH / 2);

    for (let y = 0; y < cfg.mapH; y++) {
      for (let x = 0; x < cfg.mapW; x++) {
        const edge = Math.min(x, y, cfg.mapW - 1 - x, cfg.mapH - 1 - y);
        const d = Math.hypot(x - cx, y - cy);
        let ground = OTZI.TILE.GRASS;
        if (edge < 2) ground = OTZI.TILE.WATER;
        else if (d > 30 && rng.next() < 0.55) ground = OTZI.TILE.SNOW;
        else if (rng.next() < 0.16) ground = OTZI.TILE.DARK_GRASS;
        map.setGround(x, y, ground);
        if (ground === OTZI.TILE.WATER) map.addFlags(x, y, OTZI.FLAG.BLOCKED);
      }
    }

    for (let x = 5; x < cfg.mapW - 5; x++) map.setGround(x, cy, OTZI.TILE.PATH);
    for (let y = 5; y < cfg.mapH - 5; y++) map.setGround(cx, y, OTZI.TILE.PATH);

    for (let i = 0; i < 380; i++) {
      const x = rng.int(3, cfg.mapW - 4);
      const y = rng.int(3, cfg.mapH - 4);
      if (Math.abs(x - cx) < 4 || Math.abs(y - cy) < 4) continue;
      if (rng.next() < 0.76) {
        map.setGround(x, y, OTZI.TILE.TREE);
      } else {
        map.setGround(x, y, OTZI.TILE.ROCK);
      }
      map.addFlags(x, y, OTZI.FLAG.BLOCKED | OTZI.FLAG.HARVEST);
    }

    for (let y = cy - 3; y <= cy + 3; y++) {
      for (let x = cx - 3; x <= cx + 3; x++) {
        map.setGround(x, y, OTZI.TILE.PATH);
        map.setFlags(x, y, OTZI.FLAG.VILLAGE);
      }
    }
    return map;
  }
};
