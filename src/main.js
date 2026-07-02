/* SECTION 12: MAIN LOOP */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.game = {
  running: false,
  scene: "overworld",
  seed: OTZI.CFG.defaultSeed,
  fps: 0,
  debug: false,
  minimap: false,
  inventoryOpen: false,
  menuOpen: false,
  resetConfirm: false,
  focusedTargetType: null,
  focusedResourceId: null,
  focusedResource: null,
  focusedEntranceId: null,
  focusedEntrance: null,
  currentArea: null,
  currentScreen: null,
  currentRoom: null,
  currentDungeon: null,
  returnScreen: null,
  setSeed(seed) {
    this.seed = seed || OTZI.CFG.defaultSeed;
    this.player = OTZI.entities.makePlayer();
    this.inventory = OTZI.inventory.create();
    this.village = OTZI.village.create();
    this.facts = OTZI.facts.create();
    this.world = OTZI.worldGrid.createOverworld(this.seed);
    this.currentDungeon = null;
    this.currentRoom = null;
    this.returnScreen = null;
    this.focusedTargetType = null;
    this.focusedResourceId = null;
    this.focusedResource = null;
    this.focusedEntranceId = null;
    this.focusedEntrance = null;
    this.enterOverworldScreen(this.world.homeX, this.world.homeY, { keepScene: true });
  },
  setActiveArea(area) {
    this.currentArea = area;
    this.map = area.map;
    this.resourceNodes = area.resources;
    this.entities = area.entities;
    this.entrances = area.entrances || [];
  },
  clampAreaPosition(pos) {
    const ts = OTZI.CFG.tileSize;
    const min = ts * 1.25;
    const maxX = this.map.w * ts - min;
    const maxY = this.map.h * ts - min;
    return {
      x: Math.max(min, Math.min(maxX, pos.x)),
      y: Math.max(min, Math.min(maxY, pos.y))
    };
  },
  placePlayerForEntry(edge, carry) {
    const ts = OTZI.CFG.tileSize;
    const min = ts * 1.25;
    const maxX = this.map.w * ts - min;
    const maxY = this.map.h * ts - min;
    const center = { x: this.map.w * ts / 2, y: this.map.h * ts / 2 };
    const next = { x: center.x, y: center.y };
    if (edge === "w") {
      next.x = min;
      next.y = Math.max(min, Math.min(maxY, carry?.y ?? center.y));
    } else if (edge === "e") {
      next.x = maxX;
      next.y = Math.max(min, Math.min(maxY, carry?.y ?? center.y));
    } else if (edge === "n") {
      next.x = Math.max(min, Math.min(maxX, carry?.x ?? center.x));
      next.y = min;
    } else if (edge === "s") {
      next.x = Math.max(min, Math.min(maxX, carry?.x ?? center.x));
      next.y = maxY;
    }
    this.player.x = next.x;
    this.player.y = next.y;
  },
  enterOverworldScreen(x, y, opts = {}) {
    const screen = OTZI.worldGrid.getOverworldScreen(this.world, this.seed, x, y);
    this.world.currentX = x;
    this.world.currentY = y;
    OTZI.worldGrid.markDiscovered(this.world, x, y);
    screen.discovered = true;
    this.currentScreen = screen;
    this.currentRoom = null;
    this.scene = "overworld";
    this.setActiveArea(screen);
    if (!opts.restorePlayer) this.placePlayerForEntry(opts.entrySide || null, opts.carry);
    if (!opts.keepScene) OTZI.scenes.goto("overworld");
    OTZI.input.clearAll();
    OTZI.camera.update();
    this.updateFocusState();
  },
  ensureDungeon(id) {
    if (!this.currentDungeon || this.currentDungeon.id !== id) {
      this.currentDungeon = OTZI.worldGrid.createDungeon(this.seed, id);
    }
    return this.currentDungeon;
  },
  enterDungeon(id) {
    this.returnScreen = {
      x: this.world.currentX,
      y: this.world.currentY
    };
    this.ensureDungeon(id);
    this.enterDungeonRoom(0, 1);
    OTZI.dialogue.toast("Entered Flint Scar");
  },
  enterDungeonRoom(x, y, opts = {}) {
    const dungeon = this.currentDungeon || this.ensureDungeon("flint_scar");
    const room = OTZI.worldGrid.getDungeonRoom(dungeon, this.seed, x, y);
    dungeon.currentX = x;
    dungeon.currentY = y;
    OTZI.worldGrid.markDiscovered(dungeon, x, y);
    room.discovered = true;
    this.currentRoom = room;
    this.scene = "dungeon";
    this.setActiveArea(room);
    if (!opts.restorePlayer) this.placePlayerForEntry(opts.entrySide || "e", opts.carry);
    if (!opts.keepScene) OTZI.scenes.goto("dungeon");
    OTZI.input.clearAll();
    OTZI.camera.update();
    this.updateFocusState();
  },
  exitDungeon() {
    const ret = this.returnScreen || { x: this.world.flintScarX, y: this.world.flintScarY };
    this.enterOverworldScreen(ret.x, ret.y, { keepScene: false });
    const entry = this.entrances.find((item) => item.dungeonId === "flint_scar");
    if (entry) {
      this.player.x = entry.x - OTZI.CFG.tileSize * 1.4;
      this.player.y = entry.y;
    }
    OTZI.camera.update();
    this.updateFocusState();
    OTZI.dialogue.toast("Returned to forest");
  },
  findNearestResource() {
    return OTZI.resources.findNearestVisibleTarget(this.resourceNodes, this.player, this.map);
  },
  findNearestEntrance() {
    let best = null;
    for (const entrance of this.entrances || []) {
      const dist = Math.hypot(entrance.x - this.player.x, entrance.y - this.player.y);
      if (dist > OTZI.CFG.interactRadius) continue;
      if (!best || dist < best.dist) best = { ...entrance, dist };
    }
    return best;
  },
  updateFocusState() {
    const entrance = this.findNearestEntrance();
    const resource = entrance ? null : OTZI.resources.findNearestVisibleTarget(this.resourceNodes, this.player, this.map);
    this.focusedEntranceId = entrance ? entrance.id : null;
    this.focusedEntrance = entrance || null;
    this.focusedResourceId = resource ? resource.id : null;
    this.focusedResource = resource || null;
    this.focusedTargetType = entrance ? "entrance" : resource ? "resource" : null;
  },
  tryUse() {
    if (this.focusedEntrance) {
      if (this.focusedEntrance.targetScene === "dungeon") {
        this.enterDungeon(this.focusedEntrance.dungeonId);
        return true;
      }
      if (this.focusedEntrance.targetScene === "overworld") {
        this.exitDungeon();
        return true;
      }
    }
    return this.tryGather();
  },
  tryGather() {
    const node = this.focusedResourceId ? OTZI.resources.getById(this.resourceNodes, this.focusedResourceId) : null;
    if (!node) {
      OTZI.dialogue.toast("No resource nearby");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    const stillFocused = OTZI.resources.findNearestVisibleTarget(this.resourceNodes, this.player, this.map);
    if (!stillFocused || stillFocused.id !== node.id || node.depleted) {
      OTZI.dialogue.toast("Move closer to gather");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    OTZI.inventory.add(node.resource, node.amount);
    OTZI.resources.deplete(node, this.map);
    this.updateFocusState();
    OTZI.dialogue.toast(`Gathered ${node.resource} +1`);
    OTZI.audio.blip(660, 0.04);
    return true;
  },
  maybeTransitionScreen() {
    if (this.scene !== "overworld" || !this.currentScreen) return false;
    const pad = OTZI.CFG.transitionEdgePad;
    const maxX = this.map.w * OTZI.CFG.tileSize - pad;
    const maxY = this.map.h * OTZI.CFG.tileSize - pad;
    if (this.player.x <= pad && this.currentScreen.exits.w) {
      this.enterOverworldScreen(this.world.currentX - 1, this.world.currentY, { entrySide: "e", carry: { y: this.player.y } });
      return true;
    }
    if (this.player.x >= maxX && this.currentScreen.exits.e) {
      this.enterOverworldScreen(this.world.currentX + 1, this.world.currentY, { entrySide: "w", carry: { y: this.player.y } });
      return true;
    }
    if (this.player.y <= pad && this.currentScreen.exits.n) {
      this.enterOverworldScreen(this.world.currentX, this.world.currentY - 1, { entrySide: "s", carry: { x: this.player.x } });
      return true;
    }
    if (this.player.y >= maxY && this.currentScreen.exits.s) {
      this.enterOverworldScreen(this.world.currentX, this.world.currentY + 1, { entrySide: "n", carry: { x: this.player.x } });
      return true;
    }
    return false;
  },
  update(dt, actions) {
    if (actions.debugPressed) OTZI.debug.toggle();
    if (actions.mapPressed) {
      this.minimap = !this.minimap;
      if (this.minimap) this.inventoryOpen = false;
      OTZI.dialogue.toast(this.minimap ? "Trail map open" : "Trail map closed");
    }
    if (actions.inventoryPressed) {
      this.inventoryOpen = !this.inventoryOpen;
      if (this.inventoryOpen) this.minimap = false;
      OTZI.dialogue.toast(this.inventoryOpen ? "Pack open" : "Pack closed");
    }
    if (actions.menuPressed) {
      this.menuOpen = !this.menuOpen;
      OTZI.input.clearAll();
      if (this.menuOpen) this.minimap = false;
      if (this.menuOpen) this.inventoryOpen = false;
      OTZI.dialogue.toast(this.menuOpen ? "Craft/Menu opened" : "Craft/Menu closed");
    }
    if (actions.usePressed) this.tryUse();
    if (actions.sprintPressed) {
      OTZI.survival.spendStamina(this.player, 8);
      OTZI.dialogue.toast("Dodge/Sprint burst");
      OTZI.audio.blip(330, 0.035);
    }
    if (this.menuOpen) {
      actions.moveX = 0;
      actions.moveY = 0;
      actions.sprint = false;
    }
    const sprinting = actions.sprint && this.player.stamina > 0;
    const speed = sprinting ? OTZI.CFG.sprintSpeed : OTZI.CFG.playerSpeed;
    OTZI.collision.moveCircle(this.player, actions.moveX * speed * dt, actions.moveY * speed * dt);
    OTZI.survival.update(this.player, dt, sprinting);
    OTZI.entities.update(dt);
    this.maybeTransitionScreen();
    OTZI.camera.update();
    this.updateFocusState();
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
    OTZI.dom.craftCrudeToolBtn.addEventListener("click", () => {
      OTZI.crafting.craft("crude_cutting_tool");
    });
    OTZI.dom.resetSaveBtn.addEventListener("click", () => {
      if (!OTZI.game.resetConfirm) {
        OTZI.game.resetConfirm = true;
        OTZI.dialogue.toast("Tap reset again to confirm");
        return;
      }
      OTZI.save.clear();
    });
    OTZI.dom.fullscreenBtn.addEventListener("click", () => {
      OTZI.fullscreen.toggle();
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
