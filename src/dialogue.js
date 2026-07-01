/* FUTURE MODULE: DIALOGUE */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.dialogue = {
  message: "",
  toastUntil: 0,
  say(text) {
    this.message = text;
    OTZI.dom.statusLine.textContent = text;
  },
  toast(text, seconds = 1.4) {
    this.say(text);
    this.toastUntil = performance.now() + seconds * 1000;
    OTZI.dom.toast.textContent = text;
    OTZI.dom.toast.hidden = false;
  }
};
