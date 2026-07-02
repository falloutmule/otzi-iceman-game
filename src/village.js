/* FUTURE MODULE: VILLAGE */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.village = {
  create() {
    return {
      unlocked: ["camp"],
      passive: {},
      visitedHome: false,
      toolmakerReady: false
    };
  },
  has(id, village = OTZI.game.village) {
    return village.unlocked.includes(id);
  },
  unlock(id) {
    if (!this.has(id)) OTZI.game.village.unlocked.push(id);
  }
};
