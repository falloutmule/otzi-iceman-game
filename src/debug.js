/* SECTION DEBUG */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.debug = {
  toggle() {
    OTZI.game.debug = !OTZI.game.debug;
  },
  draw(ctx, startX, startY, endX, endY) {
    const cfg = OTZI.CFG;
    const cam = OTZI.camera;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.11)";
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        ctx.strokeRect(x * cfg.tileSize - cam.x, y * cfg.tileSize - cam.y, cfg.tileSize, cfg.tileSize);
      }
    }
    ctx.restore();
  }
};
