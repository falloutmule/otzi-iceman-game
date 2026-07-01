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
        if (t === OTZI.TILE.DEPLETED) {
          ctx.fillStyle = "rgba(0,0,0,.22)";
          ctx.fillRect(x * cfg.tileSize - cam.x + 7, y * cfg.tileSize - cam.y + 9, 10, 6);
        }
      }
    }

    for (const e of OTZI.game.entities) this.drawEntity(ctx, e, pal.deer);
    this.drawEntity(ctx, OTZI.game.player, pal.player);
    if (OTZI.game.debug) OTZI.debug.draw(ctx, startX, startY, endX, endY);
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
