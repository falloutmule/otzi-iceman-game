/* SECTION 09B: RENDER WORLD */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.renderWorld = {
  draw() {
    const ctx = OTZI.dom.ctx;
    const vp = OTZI.viewport;
    const cam = OTZI.camera;
    const cfg = OTZI.CFG;
    const map = OTZI.game.map;
    const pal = OTZI.assets.palette;
    ctx.fillStyle = "#0b0e0d";
    ctx.fillRect(0, 0, vp.cssW, vp.cssH);

    const startX = Math.max(0, Math.floor(cam.x / cfg.tileSize) - 1);
    const startY = Math.max(0, Math.floor(cam.y / cfg.tileSize) - 1);
    const endX = Math.min(map.w - 1, Math.ceil((cam.x + vp.cssW) / cfg.tileSize) + 1);
    const endY = Math.min(map.h - 1, Math.ceil((cam.y + vp.cssH) / cfg.tileSize) + 1);

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const t = map.getGround(x, y);
        ctx.fillStyle = t === OTZI.TILE.WATER ? pal.water :
          t === OTZI.TILE.SNOW ? pal.snow :
          t === OTZI.TILE.PATH ? pal.path :
          t === OTZI.TILE.TREE ? pal.tree :
          t === OTZI.TILE.ROCK ? pal.rock :
          t === OTZI.TILE.DEADWOOD ? "#6b4a2f" :
          t === OTZI.TILE.STONE ? "#545a55" :
          t === OTZI.TILE.BIRCH ? "#d8d3ba" :
          t === OTZI.TILE.GRASS_CLUMP ? "#6faa42" :
          t === OTZI.TILE.BERRY ? "#315b36" :
          t === OTZI.TILE.DEPLETED ? "#4d4b3d" :
          t === OTZI.TILE.DARK_GRASS ? pal.darkGrass : pal.grass;
        ctx.fillRect(x * cfg.tileSize - cam.x, y * cfg.tileSize - cam.y, cfg.tileSize, cfg.tileSize);
        if (t === OTZI.TILE.TREE) {
          ctx.fillStyle = "#102516";
          ctx.fillRect(x * cfg.tileSize - cam.x + 6, y * cfg.tileSize - cam.y + 4, 12, 17);
        }
        if (t === OTZI.TILE.ROCK) {
          ctx.fillStyle = "#8b8d83";
          ctx.fillRect(x * cfg.tileSize - cam.x + 5, y * cfg.tileSize - cam.y + 7, 14, 10);
        }
        if (t === OTZI.TILE.DEADWOOD) {
          ctx.fillStyle = "#9b6b3e";
          ctx.fillRect(x * cfg.tileSize - cam.x + 4, y * cfg.tileSize - cam.y + 13, 16, 5);
        }
        if (t === OTZI.TILE.STONE) {
          ctx.fillStyle = "#a5aaa0";
          ctx.fillRect(x * cfg.tileSize - cam.x + 7, y * cfg.tileSize - cam.y + 9, 10, 8);
        }
        if (t === OTZI.TILE.BIRCH) {
          ctx.fillStyle = "#f1ead0";
          ctx.fillRect(x * cfg.tileSize - cam.x + 9, y * cfg.tileSize - cam.y + 4, 7, 18);
          ctx.fillStyle = "#332d24";
          ctx.fillRect(x * cfg.tileSize - cam.x + 10, y * cfg.tileSize - cam.y + 8, 5, 2);
        }
        if (t === OTZI.TILE.GRASS_CLUMP) {
          ctx.fillStyle = "#9bd35e";
          ctx.fillRect(x * cfg.tileSize - cam.x + 5, y * cfg.tileSize - cam.y + 13, 3, 7);
          ctx.fillRect(x * cfg.tileSize - cam.x + 11, y * cfg.tileSize - cam.y + 9, 3, 11);
          ctx.fillRect(x * cfg.tileSize - cam.x + 17, y * cfg.tileSize - cam.y + 12, 3, 8);
        }
        if (t === OTZI.TILE.BERRY) {
          ctx.fillStyle = "#233a20";
          ctx.fillRect(x * cfg.tileSize - cam.x + 5, y * cfg.tileSize - cam.y + 7, 14, 12);
          ctx.fillStyle = "#c43d4b";
          ctx.fillRect(x * cfg.tileSize - cam.x + 9, y * cfg.tileSize - cam.y + 9, 3, 3);
          ctx.fillRect(x * cfg.tileSize - cam.x + 14, y * cfg.tileSize - cam.y + 13, 3, 3);
        }
        if (t === OTZI.TILE.DEPLETED) {
          ctx.fillStyle = "rgba(0,0,0,.22)";
          ctx.fillRect(x * cfg.tileSize - cam.x + 7, y * cfg.tileSize - cam.y + 9, 10, 6);
        }
      }
    }

    const nearest = OTZI.game.findNearestResource();
    for (const node of OTZI.game.resourceNodes) this.drawResourceNode(ctx, node, nearest?.id === node.id);
    for (const e of OTZI.game.entities) this.drawEntity(ctx, e, pal.deer);
    this.drawEntity(ctx, OTZI.game.player, pal.player);
    if (OTZI.game.debug) OTZI.debug.draw(ctx, startX, startY, endX, endY);
  },
  resourceColor(resource) {
    return {
      flint: "#d9e4d8",
      stick: "#c8894e",
      stone: "#b7bbb2",
      bark: "#f1ead0",
      grass: "#a8e36c",
      food: "#d94c5c"
    }[resource] || "#ffffff";
  },
  drawResourceNode(ctx, node, highlighted) {
    if (node.depleted) return;
    const p = OTZI.camera.worldToScreen(node.x, node.y);
    if (p.x < -16 || p.y < -16 || p.x > OTZI.viewport.cssW + 16 || p.y > OTZI.viewport.cssH + 16) return;
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.fillRect(x - 7, y + 7, 14, 3);
    if (highlighted) {
      ctx.strokeStyle = "#ffe08a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = this.resourceColor(node.resource);
    ctx.strokeStyle = "rgba(0,0,0,.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, highlighted ? 6 : 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  },
  drawEntity(ctx, e, color) {
    const p = OTZI.camera.worldToScreen(e.x, e.y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.fillRect(p.x - e.radius, p.y + e.radius + 2, e.radius * 2, 3);
  }
};
