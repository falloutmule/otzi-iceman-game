/* SECTION 08B: RESOURCES */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.resources = {
  createFromMap(seed, map) {
    const nodes = [];
    const ts = OTZI.CFG.tileSize;
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        if (!(map.getFlags(x, y) & OTZI.FLAG.HARVEST)) continue;
        const resource = this.resourceForTile(map.getGround(x, y));
        if (!resource) continue;
        nodes.push({
          id: `node_${seed}_${x}_${y}_${resource}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
          kind: "resource",
          resource,
          x: (x + 0.5) * ts,
          y: (y + 0.5) * ts,
          tileX: x,
          tileY: y,
          radius: OTZI.CFG.resourceNodeRadius,
          amount: 1,
          depleted: false,
          respawn: "none",
          saveDeltaId: `${x},${y}:${resource}`,
          saveable: true
        });
      }
    }
    return nodes;
  },
  resourceForTile(tile) {
    if (tile === OTZI.TILE.ROCK) return "flint";
    if (tile === OTZI.TILE.DEADWOOD) return "stick";
    if (tile === OTZI.TILE.STONE) return "stone";
    if (tile === OTZI.TILE.BIRCH) return "bark";
    if (tile === OTZI.TILE.GRASS_CLUMP) return "grass";
    if (tile === OTZI.TILE.BERRY) return "food";
    return null;
  },
  findNearest(nodes, player, resourceType = null) {
    let best = null;
    for (const node of nodes) {
      if (node.depleted) continue;
      if (resourceType && node.resource !== resourceType) continue;
      const dist = Math.hypot(node.x - player.x, node.y - player.y);
      const range = Math.max(node.radius, OTZI.CFG.gatherRadius);
      if (dist <= range && (!best || dist < best.dist)) best = { ...node, dist };
    }
    return best;
  },
  getById(nodes, id) {
    return nodes.find((node) => node.id === id) || null;
  },
  deplete(node, map) {
    node.depleted = true;
    node.amount = 0;
    map.setGround(node.tileX, node.tileY, OTZI.TILE.DEPLETED);
    map.clearFlags(node.tileX, node.tileY, OTZI.FLAG.HARVEST | OTZI.FLAG.BLOCKED);
  },
  depletedDeltas(nodes) {
    return nodes
      .filter((node) => node.saveable && node.depleted)
      .map((node) => node.saveDeltaId);
  },
  applyDepletedDeltas(nodes, map, deltas = []) {
    const wanted = new Set(deltas);
    for (const node of nodes) {
      if (!wanted.has(node.saveDeltaId)) continue;
      this.deplete(node, map);
    }
  },
  count(nodes) {
    return nodes.reduce((acc, node) => {
      const bucket = node.depleted ? "depleted" : "active";
      acc.total++;
      acc[bucket]++;
      acc.byResource[node.resource] = acc.byResource[node.resource] || { total: 0, active: 0, depleted: 0 };
      acc.byResource[node.resource].total++;
      acc.byResource[node.resource][bucket]++;
      return acc;
    }, { total: 0, active: 0, depleted: 0, byResource: {} });
  }
};

