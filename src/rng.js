/* SECTION 02: RNG */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.rng = {
  hashSeed(seed) {
    let h = 2166136261;
    const s = String(seed || "seed");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  },
  make(seed) {
    let state = this.hashSeed(seed) || 1;
    return {
      next() {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      },
      range(min, max) {
        return min + this.next() * (max - min);
      },
      int(min, max) {
        return Math.floor(this.range(min, max + 1));
      }
    };
  }
};
