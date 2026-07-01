/* SECTION 07A: TILEMAP */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.TILE = { GRASS: 0, DARK_GRASS: 1, PATH: 2, WATER: 3, SNOW: 4, TREE: 5, ROCK: 6, DEPLETED: 7 };
OTZI.FLAG = { BLOCKED: 1, HARVEST: 2, VILLAGE: 4 };

OTZI.tilemap = {
  create(w, h) {
    return {
      w,
      h,
      ground: new Uint8Array(w * h),
      flags: new Uint8Array(w * h),
      idx(x, y) { return y * this.w + x; },
      inside(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; },
      getGround(x, y) { return this.inside(x, y) ? this.ground[this.idx(x, y)] : OTZI.TILE.WATER; },
      setGround(x, y, v) { if (this.inside(x, y)) this.ground[this.idx(x, y)] = v; },
      getFlags(x, y) { return this.inside(x, y) ? this.flags[this.idx(x, y)] : OTZI.FLAG.BLOCKED; },
      setFlags(x, y, v) { if (this.inside(x, y)) this.flags[this.idx(x, y)] = v; },
      addFlags(x, y, v) { if (this.inside(x, y)) this.flags[this.idx(x, y)] |= v; },
      clearFlags(x, y, v) { if (this.inside(x, y)) this.flags[this.idx(x, y)] &= ~v; }
    };
  }
};
