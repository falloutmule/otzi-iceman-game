/* FUTURE MODULE: DIALOGUE */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.dialogue = {
  message: "",
  say(text) {
    this.message = text;
    OTZI.dom.statusLine.textContent = text;
  }
};
