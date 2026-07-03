/* SECTION DEBUG */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.debug = {
  toggle() {
    OTZI.game.debug = !OTZI.game.debug;
  },
  draw(ctx, area, startX, startY, endX, endY, camera, offsetX = 0, offsetY = 0) {
    const cfg = OTZI.CFG;
    const cam = camera || OTZI.camera;
    const map = area.map;
    ctx.save();
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const dx = x * cfg.tileSize - cam.x + offsetX;
        const dy = y * cfg.tileSize - cam.y + offsetY;
        const flags = map.getFlags(x, y);
        if (flags & OTZI.FLAG.BLOCKED) {
          ctx.fillStyle = "rgba(210,68,54,.24)";
          ctx.fillRect(dx, dy, cfg.tileSize, cfg.tileSize);
        }
        if (flags & OTZI.FLAG.HARVEST) {
          ctx.fillStyle = "rgba(130,220,120,.16)";
          ctx.fillRect(dx + 3, dy + 3, cfg.tileSize - 6, cfg.tileSize - 6);
        }
        ctx.strokeStyle = "rgba(255,255,255,.11)";
        ctx.strokeRect(dx, dy, cfg.tileSize, cfg.tileSize);
      }
    }
    for (const entrance of area.entrances || []) {
      const x = entrance.x - cam.x + offsetX;
      const y = entrance.y - cam.y + offsetY;
      ctx.strokeStyle = "rgba(245,230,144,.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, entrance.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const hazard of area.hazards || []) {
      const x = hazard.x - cam.x + offsetX;
      const y = hazard.y - cam.y + offsetY;
      ctx.strokeStyle = "rgba(255,154,74,.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, hazard.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
};
