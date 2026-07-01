/* SECTION 12: MAIN LOOP */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.game = {
  running: false,
  scene: "field",
  seed: OTZI.CFG.defaultSeed,
  fps: 0,
  debug: false,
  minimap: true,
  setSeed(seed) {
    this.seed = seed || OTZI.CFG.defaultSeed;
    this.map = OTZI.worldgen.generate(this.seed);
    this.player = OTZI.entities.makePlayer();
    this.entities = OTZI.entities.spawnWorld(this.seed);
    this.inventory = OTZI.inventory.create();
    this.village = OTZI.village.create();
    this.facts = OTZI.facts.create();
    this.scene = "field";
  },
  update(dt, actions) {
    if (actions.debugPressed) OTZI.debug.toggle();
    if (actions.mapPressed) this.minimap = !this.minimap;
    if (actions.usePressed) {
      OTZI.inventory.add("flint", 1);
      OTZI.dialogue.say("Gathered flint. Starter interaction path works.");
      OTZI.audio.blip(660, 0.04);
    }
    const speed = actions.sprint ? OTZI.CFG.sprintSpeed : OTZI.CFG.playerSpeed;
    OTZI.collision.moveCircle(this.player, actions.moveX * speed * dt, actions.moveY * speed * dt);
    this.player.stamina = Math.max(0, Math.min(100, this.player.stamina + (actions.sprint ? -22 : 12) * dt));
    OTZI.entities.update(dt);
    OTZI.camera.update();
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

    OTZI.game.running = true;
    requestAnimationFrame(frame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
