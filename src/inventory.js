/* FUTURE MODULE: INVENTORY */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.inventory = {
  create() {
    return { flint: 0, stick: 0, stone: 0, bark: 0, grass: 0, food: 0, crudeTool: 0, goodFlintCore: 0 };
  },
  add(item, n) {
    OTZI.game.inventory[item] = Math.max(0, (OTZI.game.inventory[item] || 0) + n);
  }
};
