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
    if (kind === "village_home") this.placeVillageCenter(map, exits);
    if (kind === "flint_scar_entrance") this.placeFlintScarGround(map);
    this.placeOverworldResources(map, rng, kind, x, y, world.homeX, world.homeY);

    const area = {
      id: `overworld_${x}_${y}`,
      kind,
      biome: kind === "village_home" ? "village" : kind === "flint_scar_entrance" ? "scar" : kind === "high_pass_locked_placeholder" ? "snow" : "forest",
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
    if (kind === "flint_scar_entrance") {
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
    if (kind === "village_home") {
      area.entrances.push({
        id: `${area.id}_hearth`,
        kind: "hearth",
        label: "Village Hearth",
        x: (cx + 2.2) * cfg.tileSize,
        y: (cy + 0.6) * cfg.tileSize,
        tileX: cx + 2,
        tileY: cy + 1,
        radius: 20
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
    const roomKind = this.dungeonRoomKind(id, x, y);
    for (let ty = 0; ty < map.h; ty++) {
      for (let tx = 0; tx < map.w; tx++) {
        map.setGround(tx, ty, roomKind === "flint_chamber" ? OTZI.TILE.STONE : OTZI.TILE.DARK_GRASS);
      }
    }
    if (roomKind !== "side_room") {
      this.carveDungeonLane(map, "h", cy, 2, map.w - 2, 1);
      this.carveDungeonLane(map, "v", cx, 2, map.h - 2, 1);
    }
    for (let i = 0; i < (roomKind === "narrow_passage" ? 22 : 34); i++) {
      const tx = rng.int(2, map.w - 3);
      const ty = rng.int(2, map.h - 3);
      if (Math.abs(tx - cx) <= 2 || Math.abs(ty - cy) <= 2) continue;
      if (x === 0 && y === 1 && tx <= 5 && Math.abs(ty - cy) <= 2) continue;
      map.setGround(tx, ty, OTZI.TILE.STONE);
      map.addFlags(tx, ty, OTZI.FLAG.BLOCKED);
    }
    const exits = this.dungeonRoomExits(id, x, y);
    this.carveExitPaths(map, exits);
    this.placeDungeonResources(map, roomKind);
    const area = {
      id: `dungeon_${id}_${x}_${y}`,
      kind: roomKind,
      biome: "cave",
      gridX: x,
      gridY: y,
      exits,
      discovered: false,
      completed: false,
      map,
      resources: [],
      entities: [],
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
    if (roomKind === "flint_chamber") {
      area.entities.push(OTZI.entities.makeGoodFlintCore(area.id, (map.w - 4) * cfg.tileSize, (cy - 2) * cfg.tileSize));
    }
    if (roomKind === "loose_stone_hazard") {
      area.hazards.push({
        id: `${area.id}_loose_stones`,
        kind: "loose_stone",
        x: (cx + 0.5) * cfg.tileSize,
        y: (cy + 0.5) * cfg.tileSize,
        radius: cfg.tileSize * 0.9
      });
    }
    area.resources = OTZI.resources.createFromMap(area.id, map);
    return area;
  },
  dungeonRoomKind(id, x, y) {
    if (id !== "flint_scar") return "dungeon_room";
    if (x === 0 && y === 1) return "entrance_room";
    if (x === 1 && y === 1) return "narrow_passage";
    if (x === 1 && y === 0) return "loose_stone_hazard";
    if (x === 2 && y === 1) return "flint_chamber";
    return "side_room";
  },
  dungeonRoomExits(id, x, y) {
    if (id !== "flint_scar") return { n: false, s: false, e: false, w: false };
    const exits = {
      "0,1": { n: false, s: false, e: true, w: false },
      "1,1": { n: true, s: false, e: true, w: true },
      "1,0": { n: false, s: true, e: true, w: false },
      "2,1": { n: true, s: false, e: false, w: true },
      "2,0": { n: false, s: true, e: false, w: true }
    };
    return exits[`${x},${y}`] || { n: false, s: false, e: false, w: false };
  },
  overworldKind(world, x, y) {
    const rng = OTZI.rng.make(`${world.seed}:screen-kind:${x},${y}`);
    if (x === world.homeX && y === world.homeY) return "village_home";
    if (x === world.flintScarX && y === world.flintScarY) return "flint_scar_entrance";
    if (y === 0 && x >= world.gridW - 2) return "high_pass_locked_placeholder";
    if (x === 0 && y % 2 === 0) return "river_edge_placeholder";
    if ((x + y) % 7 === 0) return "rival_warning_placeholder";
    const roll = rng.next();
    if (roll < 0.2) return "easy_gather";
    if (roll < 0.36) return "forest_trail";
    if (roll < 0.52) return "dense_forest";
    if (roll < 0.66) return "animal_clearing";
    if (roll < 0.82) return "quiet_empty";
    return "forest_trail";
  },
  carveExitPaths(map, exits) {
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    map.setGround(cx, cy, OTZI.TILE.PATH);
    if (exits.n) this.carveDungeonLane(map, "v", cx, 0, cy, 1);
    if (exits.s) this.carveDungeonLane(map, "v", cx, cy, map.h - 1, 1);
    if (exits.w) this.carveDungeonLane(map, "h", cy, 0, cx, 1);
    if (exits.e) this.carveDungeonLane(map, "h", cy, cx, map.w - 1, 1);
  },
  carveDungeonLane(map, axis, fixed, start, end, halfWidth = 0) {
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    for (let primary = min; primary <= max; primary++) {
      for (let offset = -halfWidth; offset <= halfWidth; offset++) {
        const tx = axis === "h" ? primary : fixed + offset;
        const ty = axis === "h" ? fixed + offset : primary;
        if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) continue;
        map.setGround(tx, ty, OTZI.TILE.PATH);
        map.setFlags(tx, ty, map.getFlags(tx, ty) & ~OTZI.FLAG.BLOCKED);
      }
    }
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
    const count = kind === "village_home" ? 12 :
      kind === "easy_gather" ? 18 :
      kind === "forest_trail" ? 22 :
      kind === "dense_forest" ? 40 :
      kind === "animal_clearing" ? 16 :
      kind === "quiet_empty" ? 8 :
      kind === "river_edge_placeholder" ? 20 :
      kind === "flint_scar_entrance" ? 24 : 18;
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
    if (kind === "village_home" || kind === "quiet_empty") return;
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    const baseTiles = kind === "easy_gather" ? [OTZI.TILE.DEADWOOD, OTZI.TILE.STONE, OTZI.TILE.GRASS_CLUMP, OTZI.TILE.BERRY] :
      kind === "animal_clearing" ? [OTZI.TILE.DEADWOOD, OTZI.TILE.GRASS_CLUMP, OTZI.TILE.BERRY] :
      [OTZI.TILE.DEADWOOD, OTZI.TILE.STONE, OTZI.TILE.GRASS_CLUMP];
    if ((gridX + gridY) % 2 === 0 || kind === "flint_scar_entrance") baseTiles.push(OTZI.TILE.ROCK);
    if (gridX % 2 === 0 && kind !== "river_edge_placeholder") baseTiles.push(OTZI.TILE.BIRCH);
    if (gridY % 2 === 1 || kind === "animal_clearing") baseTiles.push(OTZI.TILE.BERRY);
    const count = kind === "flint_scar_entrance" ? 10 :
      kind === "easy_gather" ? 14 :
      kind === "animal_clearing" ? 6 :
      kind === "dense_forest" ? 8 :
      kind === "forest_trail" ? 5 :
      kind === "river_edge_placeholder" ? 4 : 3;
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
        map.setFlags(tx, ty, map.getFlags(tx, ty) & ~OTZI.FLAG.BLOCKED);
        break;
      }
    }
  },
  placeDungeonResources(map, roomKind) {
    const cx = Math.floor(map.w / 2);
    const cy = Math.floor(map.h / 2);
    const drops = roomKind === "entrance_room" ? [[cx - 3, cy - 2, OTZI.TILE.ROCK]] :
      roomKind === "narrow_passage" ? [[cx + 2, cy - 3, OTZI.TILE.STONE]] :
      roomKind === "flint_chamber" ? [[cx + 3, cy - 2, OTZI.TILE.ROCK], [cx - 3, cy + 2, OTZI.TILE.STONE]] :
      roomKind === "side_room" ? [[cx - 2, cy - 2, OTZI.TILE.ROCK]] :
      [];
    for (const [tx, ty, tile] of drops) {
      map.setGround(tx, ty, tile);
      map.addFlags(tx, ty, OTZI.FLAG.HARVEST);
      map.setFlags(tx, ty, map.getFlags(tx, ty) & ~OTZI.FLAG.BLOCKED);
    }
  }
};
