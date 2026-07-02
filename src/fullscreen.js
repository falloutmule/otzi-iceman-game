/* SECTION 08D: FULLSCREEN */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.fullscreen = {
  async toggle() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        OTZI.dialogue.toast("Fullscreen off");
        return true;
      }
      const target = OTZI.dom.app || document.documentElement;
      if (!target.requestFullscreen) {
        OTZI.dialogue.toast("Fullscreen unavailable");
        return false;
      }
      await target.requestFullscreen();
      OTZI.dialogue.toast("Fullscreen on");
      return true;
    } catch (_) {
      OTZI.dialogue.toast("Fullscreen unavailable");
      return false;
    }
  }
};

