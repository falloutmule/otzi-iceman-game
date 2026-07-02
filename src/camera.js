/* SECTION 09A: CAMERA */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.camera = {
  x: 0,
  y: 0,
  update() {
    const vp = OTZI.viewport;
    const p = OTZI.game.player;
    const map = OTZI.game.map;
    const worldW = (map?.w || OTZI.CFG.screenTileW) * OTZI.CFG.tileSize;
    const worldH = (map?.h || OTZI.CFG.screenTileH) * OTZI.CFG.tileSize;
    this.x = Math.max(0, Math.min(worldW - vp.cssW, p.x - vp.cssW / 2));
    this.y = Math.max(0, Math.min(worldH - vp.cssH, p.y - vp.cssH * 0.42));
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  },
  worldToScreen(x, y) {
    return { x: x - this.x, y: y - this.y };
  }
};
