/* SECTION 09A: CAMERA */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.camera = {
  x: 0,
  y: 0,
  update() {
    const vp = OTZI.viewport;
    const p = OTZI.game.player;
    this.x = Math.max(0, Math.min(OTZI.CFG.mapW * OTZI.CFG.tileSize - vp.cssW, p.x - vp.cssW / 2));
    this.y = Math.max(0, Math.min(OTZI.CFG.mapH * OTZI.CFG.tileSize - vp.cssH, p.y - vp.cssH * 0.42));
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  },
  worldToScreen(x, y) {
    return { x: x - this.x, y: y - this.y };
  }
};
