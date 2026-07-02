/* SECTION 09A: CAMERA */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.camera = {
  x: 0,
  y: 0,
  targetFor(map, player) {
    const vp = OTZI.viewport;
    const worldW = (map?.w || OTZI.CFG.screenTileW) * OTZI.CFG.tileSize;
    const worldH = (map?.h || OTZI.CFG.screenTileH) * OTZI.CFG.tileSize;
    return {
      x: Math.floor(Math.max(0, Math.min(worldW - vp.cssW, player.x - vp.cssW / 2))),
      y: Math.floor(Math.max(0, Math.min(worldH - vp.cssH, player.y - vp.cssH * 0.42)))
    };
  },
  update() {
    const map = OTZI.game.map;
    const p = OTZI.game.player;
    const target = this.targetFor(map, p);
    this.x = target.x;
    this.y = target.y;
  },
  worldToScreen(x, y) {
    return { x: x - this.x, y: y - this.y };
  }
};
