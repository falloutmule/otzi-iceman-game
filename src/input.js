/* SECTION 04A: INPUT */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.input = {
  keys: new Set(),
  pointers: new Map(),
  moveVector: { x: 0, y: 0 },
  aimVector: { x: 0, y: 0 },
  pressed: { use: false, sprint: false, menu: false, debug: false, map: false },
  init() {
    window.addEventListener("keydown", (ev) => {
      this.keys.add(ev.code);
      if (ev.code === "KeyD") this.pressed.debug = true;
      if (ev.code === "KeyE" || ev.code === "Space") this.pressed.use = true;
      if (ev.code === "KeyM") this.pressed.map = true;
      if (ev.code === "KeyR") OTZI.game.setSeed("otzi-" + Date.now().toString(36));
    });
    window.addEventListener("keyup", (ev) => this.keys.delete(ev.code));
    this.bindMoveZone();
    this.bindButton(OTZI.dom.useBtn, "use");
    this.bindButton(OTZI.dom.sprintBtn, "sprint");
    this.bindButton(OTZI.dom.menuBtn, "menu");
    this.bindButton(OTZI.dom.debugBtn, "debug");
    this.bindButton(OTZI.dom.mapTab, "map");
  },
  bindButton(el, name) {
    el.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      el.setPointerCapture?.(ev.pointerId);
      this.pressed[name] = true;
    });
    const clear = (ev) => {
      ev.preventDefault();
      el.releasePointerCapture?.(ev.pointerId);
    };
    el.addEventListener("pointerup", clear);
    el.addEventListener("pointercancel", clear);
  },
  bindMoveZone() {
    const zone = OTZI.dom.moveZone;
    const update = (ev) => {
      const rect = zone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ev.clientX - cx;
      const dy = ev.clientY - cy;
      const mag = Math.hypot(dx, dy);
      const max = Math.max(24, Math.min(rect.width, rect.height) * 0.32);
      const scale = mag > max ? max / mag : 1;
      this.moveVector.x = Math.max(-1, Math.min(1, dx / max));
      this.moveVector.y = Math.max(-1, Math.min(1, dy / max));
      OTZI.dom.stickKnob.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
    };
    const clear = () => {
      this.moveVector.x = 0;
      this.moveVector.y = 0;
      OTZI.dom.stickKnob.style.transform = "translate(0, 0)";
    };
    zone.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      zone.setPointerCapture?.(ev.pointerId);
      this.pointers.set(ev.pointerId, "move");
      update(ev);
    });
    zone.addEventListener("pointermove", (ev) => {
      if (this.pointers.get(ev.pointerId) === "move") update(ev);
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
      zone.addEventListener(type, (ev) => {
        this.pointers.delete(ev.pointerId);
        clear();
      });
    }
  },
  consumePressed() {
    const out = { ...this.pressed };
    this.pressed.use = false;
    this.pressed.menu = false;
    this.pressed.debug = false;
    this.pressed.map = false;
    return out;
  },
  clearAll() {
    this.pointers.clear();
    this.moveVector.x = 0;
    this.moveVector.y = 0;
    OTZI.dom.stickKnob.style.transform = "translate(0, 0)";
  }
};
