/* SECTION 12: MAIN LOOP */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.game = {
  running: false,
  scene: "field",
  seed: OTZI.CFG.defaultSeed,
  fps: 0,
  debug: false,
  minimap: false,
  menuOpen: false,
  setSeed(seed) {
    this.seed = seed || OTZI.CFG.defaultSeed;
    this.map = OTZI.worldgen.generate(this.seed);
    this.player = OTZI.entities.makePlayer();
    this.entities = OTZI.entities.spawnWorld(this.seed);
    this.resourceNodes = OTZI.resources.createFromMap(this.seed, this.map);
    this.inventory = OTZI.inventory.create();
    this.village = OTZI.village.create();
    this.facts = OTZI.facts.create();
    this.scene = "field";
  },
  update(dt, actions) {
    if (actions.debugPressed) OTZI.debug.toggle();
    if (actions.mapPressed) {
      this.minimap = !this.minimap;
      OTZI.dialogue.toast(this.minimap ? "Trail map open" : "Trail map closed");
    }
    if (actions.menuPressed) {
      this.menuOpen = !this.menuOpen;
      OTZI.input.clearAll();
      if (this.menuOpen) this.minimap = false;
      OTZI.dialogue.toast(this.menuOpen ? "Craft/Menu opened" : "Craft/Menu closed");
    }
    if (actions.usePressed) {
      this.tryGather();
    }
    if (actions.sprintPressed) {
      this.player.stamina = Math.max(0, this.player.stamina - 8);
      OTZI.dialogue.toast("Dodge/Sprint burst");
      OTZI.audio.blip(330, 0.035);
    }
    if (this.menuOpen) {
      actions.moveX = 0;
      actions.moveY = 0;
      actions.sprint = false;
    }
    const speed = actions.sprint ? OTZI.CFG.sprintSpeed : OTZI.CFG.playerSpeed;
    OTZI.collision.moveCircle(this.player, actions.moveX * speed * dt, actions.moveY * speed * dt);
    this.player.stamina = Math.max(0, Math.min(100, this.player.stamina + (actions.sprint ? -22 : 12) * dt));
    OTZI.entities.update(dt);
    OTZI.camera.update();
  },
  findNearestResource() {
    return OTZI.resources.findNearest(this.resourceNodes, this.player);
  },
  tryGather() {
    const found = this.findNearestResource();
    const node = found ? OTZI.resources.getById(this.resourceNodes, found.id) : null;
    if (!node) {
      OTZI.dialogue.toast("No resource nearby");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    OTZI.inventory.add(node.resource, node.amount);
    OTZI.resources.deplete(node, this.map);
    OTZI.dialogue.toast(`Gathered ${node.resource} +1`);
    OTZI.audio.blip(660, 0.04);
    return true;
  }
};

(function boot() {
  let accumulator = 0;
  let lastT = 0;
  let fpsTime = 0;
  let fpsFrames = 0;

  function frame(t) {
    if (!lastT) lastT = t;
    const dt = Math.min(0.1, (t - lastT) / 1000);
    lastT = t;
    accumulator += dt;
    let steps = 0;
    while (accumulator >= OTZI.CFG.fixedDt && steps < OTZI.CFG.maxStepsPerFrame) {
      OTZI.game.update(OTZI.CFG.fixedDt, OTZI.actionMap.sample());
      accumulator -= OTZI.CFG.fixedDt;
      steps++;
    }
    if (steps === OTZI.CFG.maxStepsPerFrame) accumulator = 0;
    OTZI.renderWorld.draw();
    OTZI.renderUi.sync();
    fpsTime += dt;
    fpsFrames++;
    if (fpsTime >= 0.5) {
      OTZI.game.fps = fpsFrames / fpsTime;
      fpsTime = 0;
      fpsFrames = 0;
    }
    requestAnimationFrame(frame);
  }

  function init() {
    OTZI.dom.init();
    OTZI.assets.init();
    OTZI.viewport.init();
    OTZI.game.setSeed(OTZI.CFG.defaultSeed);
    OTZI.input.init();
    OTZI.save.load();
    OTZI.installTestHooks();

    OTZI.dom.startBtn.addEventListener("click", async () => {
      await OTZI.audio.unlock();
      OTZI.dom.startPanel.hidden = true;
      OTZI.game.running = true;
    });
    OTZI.dom.menuCloseBtn.addEventListener("click", () => {
      OTZI.game.menuOpen = false;
      OTZI.input.clearAll();
      OTZI.dialogue.toast("Craft/Menu closed");
    });

    OTZI.game.running = true;
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
