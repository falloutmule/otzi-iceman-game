/* FUTURE MODULE: INVENTORY */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.inventory = {
  create() {
    return { flint: 0, bark: 0, grass: 0, sticks: 0 };
  },
  add(item, n) {
    OTZI.game.inventory[item] = (OTZI.game.inventory[item] || 0) + n;
  }
};
