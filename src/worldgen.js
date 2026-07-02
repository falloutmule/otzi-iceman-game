/* SECTION 07B: WORLDGEN */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.worldgen = {
  generateOverworldScreen(seed, x, y, world) {
    const cfg = OTZI.CFG;
    const map = OTZI.tilemap.create(cfg.screenTileW, cfg.screenTileH);
    const rng = OTZI.rng.make(`${seed}:overworld:${x},${y}:v${cfg.worldgenVersion}`);
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    const exits = { n: y > 0, s: y < world.gridH - 1, e: x < world.gridW - 1, w: x > 0 };
    const kind = this.overworldKind(world, x, y);

    for (let ty = 0; ty < map.h; ty++) {
      for (let tx = 0; tx < map.w; tx++) {
        const latitude = y / Math.max(1, world.gridH - 1);
        let ground = latitude < 0.3 && rng.next() < 0.2 ? OTZI.TILE.SNOW : OTZI.TILE.GRASS;
        if (rng.next() < 0.18) ground = OTZI.TILE.DARK_GRASS;
        map.setGround(tx, ty, ground);
      }
    }

    this.carveExitPaths(map, exits);
    this.placeObstacles(map, rng, kind);
    if (kind === "village_crossroads") this.placeVillageCenter(map, exits);
    if (kind === "flint_scar") this.placeFlintScarGround(map);
    this.placeOverworldResources(map, rng, kind, x, y, world.homeX, world.homeY);

    const area = {
      id: `overworld_${x}_${y}`,
      kind,
      biome: kind === "village_crossroads" ? "village" : kind === "flint_scar" ? "scar" : "forest",
      gridX: x,
      gridY: y,
      exits,
      discovered: false,
      completed: false,
      map,
      resources: [],
      animals: [],
      hazards: [],
      entrances: []
    };
    if (kind === "flint_scar") {
      area.entrances.push({
        id: `${area.id}_flint_scar_entry`,
        kind: "entrance",
        label: "Flint Scar",
        targetScene: "dungeon",
        dungeonId: "flint_scar",
        x: (map.w - 4.5) * cfg.tileSize,
        y: (cy + 0.5) * cfg.tileSize,
        tileX: map.w - 5,
        tileY: cy,
        radius: cfg.interactRadius
      });
    }
    area.resources = OTZI.resources.createFromMap(area.id, map);
    area.entities = OTZI.entities.spawnScreen(seed, area.id, map, kind);
    return area;
  },
  generateDungeonRoom(seed, id, x, y, dungeon) {
    const cfg = OTZI.CFG;
    const map = OTZI.tilemap.create(cfg.screenTileW, cfg.screenTileH);
    const rng = OTZI.rng.make(`${seed}:dungeon:${id}:${x},${y}:v${cfg.worldgenVersion}`);
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    for (let ty = 0; ty < map.h; ty++) {
      for (let tx = 0; tx < map.w; tx++) {
        map.setGround(tx, ty, OTZI.TILE.DARK_GRASS);
      }
    }
    for (let tx = 2; tx < map.w - 2; tx++) map.setGround(tx, cy, OTZI.TILE.PATH);
    for (let ty = 2; ty < map.h - 2; ty++) map.setGround(cx, ty, OTZI.TILE.PATH);
    for (let i = 0; i < 40; i++) {
      const tx = rng.int(2, map.w - 3);
      const ty = rng.int(2, map.h - 3);
      if (Math.abs(tx - cx) < 3 && Math.abs(ty - cy) < 3) continue;
      map.setGround(tx, ty, OTZI.TILE.STONE);
      map.addFlags(tx, ty, OTZI.FLAG.BLOCKED);
    }
    if (x === 0 && y === 1) {
      for (const tx of [cx - 3, cx + 2]) {
        map.setGround(tx, cy - 2, OTZI.TILE.ROCK);
        map.addFlags(tx, cy - 2, OTZI.FLAG.HARVEST | OTZI.FLAG.BLOCKED);
      }
    }
    const area = {
      id: `dungeon_${id}_${x}_${y}`,
      kind: "dungeon_room",
      biome: "cave",
      gridX: x,
      gridY: y,
      exits: { n: false, s: false, e: false, w: false },
      discovered: false,
      completed: false,
      map,
      resources: [],
      animals: [],
      hazards: [],
      entrances: []
    };
    if (x === 0 && y === 1) {
      area.entrances.push({
        id: `${area.id}_exit`,
        kind: "exit",
        label: "Forest Exit",
        targetScene: "overworld",
        x: (2.5) * cfg.tileSize,
        y: (cy + 0.5) * cfg.tileSize,
        tileX: 2,
        tileY: cy,
        radius: cfg.interactRadius
      });
    }
    area.resources = OTZI.resources.createFromMap(area.id, map);
    area.entities = [];
    return area;
  },
  overworldKind(world, x, y) {
    if (x === world.homeX && y === world.homeY) return "village_crossroads";
    if (x === world.flintScarX && y === world.flintScarY) return "flint_scar";
    return (x + y) % 3 === 0 ? "trail_forest" : "forest";
  },
  carveExitPaths(map, exits) {
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    map.setGround(cx, cy, OTZI.TILE.PATH);
    if (exits.n) for (let ty = 0; ty <= cy; ty++) map.setGround(cx, ty, OTZI.TILE.PATH);
    if (exits.s) for (let ty = cy; ty < map.h; ty++) map.setGround(cx, ty, OTZI.TILE.PATH);
    if (exits.w) for (let tx = 0; tx <= cx; tx++) map.setGround(tx, cy, OTZI.TILE.PATH);
    if (exits.e) for (let tx = cx; tx < map.w; tx++) map.setGround(tx, cy, OTZI.TILE.PATH);
  },
  placeVillageCenter(map) {
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    for (let ty = cy - 2; ty <= cy + 2; ty++) {
      for (let tx = cx - 2; tx <= cx + 2; tx++) {
        map.setGround(tx, ty, OTZI.TILE.PATH);
        map.setFlags(tx, ty, OTZI.FLAG.VILLAGE);
      }
    }
  },
  placeFlintScarGround(map) {
    const scarX = map.w - 5;
    const scarY = Math.floor(map.h / 2);
    for (let tx = scarX - 1; tx <= scarX + 1; tx++) {
      for (let ty = scarY - 1; ty <= scarY + 1; ty++) {
        map.setGround(tx, ty, OTZI.TILE.STONE);
      }
    }
  },
  placeObstacles(map, rng, kind) {
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    const count = kind === "village_crossroads" ? 18 : 32;
    for (let i = 0; i < count; i++) {
      const tx = rng.int(1, map.w - 2);
      const ty = rng.int(1, map.h - 2);
      if (Math.abs(tx - cx) < 2 || Math.abs(ty - cy) < 2) continue;
      if (map.getGround(tx, ty) === OTZI.TILE.PATH) continue;
      map.setGround(tx, ty, rng.next() < 0.7 ? OTZI.TILE.TREE : OTZI.TILE.ROCK);
      map.addFlags(tx, ty, OTZI.FLAG.BLOCKED);
    }
  },
  placeOverworldResources(map, rng, kind, gridX, gridY, homeX, homeY) {
    if (kind === "village_crossroads") return;
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    const baseTiles = [OTZI.TILE.DEADWOOD, OTZI.TILE.STONE, OTZI.TILE.GRASS_CLUMP];
    if ((gridX + gridY) % 2 === 0 || kind === "flint_scar") baseTiles.push(OTZI.TILE.ROCK);
    if (gridX % 2 === 0) baseTiles.push(OTZI.TILE.BIRCH);
    if (gridY % 2 === 1) baseTiles.push(OTZI.TILE.BERRY);
    const count = kind === "flint_scar" ? 16 : 10;
    for (let i = 0; i < count; i++) {
      for (let attempt = 0; attempt < 30; attempt++) {
        const tx = rng.int(1, map.w - 2);
        const ty = rng.int(1, map.h - 2);
        if (Math.abs(tx - cx) < 3 && Math.abs(ty - cy) < 3) continue;
        if (gridX === homeX && gridY === homeY) continue;
        if (map.getGround(tx, ty) === OTZI.TILE.PATH) continue;
        if (map.getFlags(tx, ty) & OTZI.FLAG.BLOCKED) continue;
        const tile = baseTiles[rng.int(0, baseTiles.length)];
        map.setGround(tx, ty, tile);
        map.addFlags(tx, ty, OTZI.FLAG.HARVEST);
        if (tile !== OTZI.TILE.GRASS_CLUMP && tile !== OTZI.TILE.BERRY) map.addFlags(tx, ty, OTZI.FLAG.BLOCKED);
        break;
      }
    }
  }
};
