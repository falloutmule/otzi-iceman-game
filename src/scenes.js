/* FUTURE MODULE: SCENES */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.scenes = {
  current: "field",
  goto(name) {
    this.current = name;
    OTZI.game.scene = name;
    OTZI.input.clearAll();
  }
};
