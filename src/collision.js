/* SECTION 08B: COLLISION */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.collision = {
  blockedAtWorld(x, y) {
    const ts = OTZI.CFG.tileSize;
    const tx = Math.floor(x / ts);
    const ty = Math.floor(y / ts);
    return !!(OTZI.game.map.getFlags(tx, ty) & OTZI.FLAG.BLOCKED);
  },
  moveCircle(entity, dx, dy) {
    let nx = entity.x + dx;
    let ny = entity.y;
    if (!this.circleBlocked(nx, ny, entity.radius)) entity.x = nx;
    nx = entity.x;
    ny = entity.y + dy;
    if (!this.circleBlocked(nx, ny, entity.radius)) entity.y = ny;
    return { x: entity.x, y: entity.y };
  },
  circleBlocked(x, y, r) {
    return this.blockedAtWorld(x - r, y - r) ||
      this.blockedAtWorld(x + r, y - r) ||
      this.blockedAtWorld(x - r, y + r) ||
      this.blockedAtWorld(x + r, y + r);
  }
};
