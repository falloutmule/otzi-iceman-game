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
    const ts = OTZI.CFG.tileSize;
    const px = this.player.x;
    const py = this.player.y;
    const centerX = Math.floor(px / ts);
    const centerY = Math.floor(py / ts);
    let best = null;
    const maxTiles = Math.ceil(OTZI.CFG.gatherRadius / ts) + 1;
    for (let y = centerY - maxTiles; y <= centerY + maxTiles; y++) {
      for (let x = centerX - maxTiles; x <= centerX + maxTiles; x++) {
        if (!(this.map.getFlags(x, y) & OTZI.FLAG.HARVEST)) continue;
        const tile = this.map.getGround(x, y);
        const resource = tile === OTZI.TILE.ROCK ? "flint" : null;
        if (!resource) continue;
        const wx = (x + 0.5) * ts;
        const wy = (y + 0.5) * ts;
        const dist = Math.hypot(wx - px, wy - py);
        if (dist <= OTZI.CFG.gatherRadius && (!best || dist < best.dist)) {
          best = { x, y, tile, resource, dist };
        }
      }
    }
    return best;
  },
  tryGather() {
    const node = this.findNearestResource();
    if (!node) {
      OTZI.dialogue.toast("No resource nearby");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    OTZI.inventory.add(node.resource, 1);
    this.map.setGround(node.x, node.y, OTZI.TILE.DEPLETED);
    this.map.clearFlags(node.x, node.y, OTZI.FLAG.HARVEST | OTZI.FLAG.BLOCKED);
    OTZI.dialogue.toast("Gathered flint +1");
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
