/* SECTION 07C: WORLD GRID */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.worldGrid = {
  createOverworld(seed) {
    const cfg = OTZI.CFG;
    const homeX = Math.floor(cfg.overworldGridW / 2);
    const homeY = Math.floor(cfg.overworldGridH / 2);
    return {
      id: "overworld",
      seed,
      gridW: cfg.overworldGridW,
      gridH: cfg.overworldGridH,
      homeX,
      homeY,
      flintScarX: Math.min(cfg.overworldGridW - 2, homeX + 1),
      flintScarY: homeY,
      currentX: homeX,
      currentY: homeY,
      discovered: {},
      screens: {}
    };
  },
  createDungeon(seed, id) {
    return {
      id,
      seed,
      gridW: OTZI.CFG.dungeonGridW,
      gridH: OTZI.CFG.dungeonGridH,
      currentX: 0,
      currentY: 1,
      discovered: {},
      rooms: {}
    };
  },
  key(x, y) {
    return `${x},${y}`;
  },
  isDiscovered(grid, x, y) {
    return !!grid.discovered[this.key(x, y)];
  },
  markDiscovered(grid, x, y) {
    grid.discovered[this.key(x, y)] = true;
  },
  getOverworldScreen(world, seed, x, y) {
    const key = this.key(x, y);
    if (!world.screens[key]) world.screens[key] = OTZI.worldgen.generateOverworldScreen(seed, x, y, world);
    return world.screens[key];
  },
  getDungeonRoom(dungeon, seed, x, y) {
    const key = this.key(x, y);
    if (!dungeon.rooms[key]) dungeon.rooms[key] = OTZI.worldgen.generateDungeonRoom(seed, dungeon.id, x, y, dungeon);
    return dungeon.rooms[key];
  },
  collectAreaStates(areas) {
    return Object.values(areas).map((area) => ({
      id: area.id,
      gridX: area.gridX,
      gridY: area.gridY,
      completed: !!area.completed,
      depleted: OTZI.resources.depletedDeltas(area.resources),
      entities: OTZI.entities.serialize(area.entities || [])
    }));
  },
  applyAreaState(grid, seed, state) {
    const area = grid.id === "overworld" ?
      this.getOverworldScreen(grid, seed, state.gridX, state.gridY) :
      this.getDungeonRoom(grid, seed, state.gridX, state.gridY);
    area.completed = !!state.completed;
    OTZI.resources.applyDepletedDeltas(area.resources, area.map, state.depleted || []);
    OTZI.entities.applyState(area.entities || [], state.entities || []);
    return area;
  },
  findScreenByKind(world, seed, kind) {
    for (let y = 0; y < world.gridH; y++) {
      for (let x = 0; x < world.gridW; x++) {
        const screen = this.getOverworldScreen(world, seed, x, y);
        if (screen.kind === kind) return screen;
      }
    }
    return null;
  },
  countScreenKinds(world, seed) {
    const out = {};
    for (let y = 0; y < world.gridH; y++) {
      for (let x = 0; x < world.gridW; x++) {
        const kind = this.getOverworldScreen(world, seed, x, y).kind;
        out[kind] = (out[kind] || 0) + 1;
      }
    }
    return out;
  },
  findScreenWithResource(world, seed, resource) {
    for (let y = 0; y < world.gridH; y++) {
      for (let x = 0; x < world.gridW; x++) {
        const screen = this.getOverworldScreen(world, seed, x, y);
        if (screen.resources.some((node) => !node.depleted && node.resource === resource)) return screen;
      }
    }
    return null;
  }
};
