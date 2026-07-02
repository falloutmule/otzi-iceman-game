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
  focusedEntityId: null,
  focusedEntity: null,
  transition: {
    active: false,
    kind: "screen_slide",
    direction: null,
    fromScreenId: null,
    toScreenId: null,
    elapsed: 0,
    duration: OTZI.CFG.screenTransitionDuration,
    fromArea: null,
    toArea: null,
    fromPlayer: null,
    toPlayer: null,
    fromCamera: null,
    toCamera: null,
    targetX: null,
    targetY: null,
    scope: "overworld"
  },
  currentArea: null,
  currentScreen: null,
  currentRoom: null,
  currentDungeon: null,
  returnScreen: null,
  factOpen: false,
  activeFactId: null,
  welcomeSeen: false,
  welcomeOpen: false,
  areaCard: null,
  areaCardUntil: 0,
  setSeed(seed) {
    this.seed = seed || OTZI.CFG.defaultSeed;
    this.player = OTZI.entities.makePlayer();
    this.inventory = OTZI.inventory.create();
    this.village = OTZI.village.create();
    this.facts = OTZI.facts.create();
    this.dungeons = {
      flint_scar: { completed: false, coreCollected: false }
    };
    this.world = OTZI.worldGrid.createOverworld(this.seed);
    this.currentDungeon = null;
    this.currentRoom = null;
    this.returnScreen = null;
    this.focusedTargetType = null;
    this.focusedResourceId = null;
    this.focusedResource = null;
    this.focusedEntranceId = null;
    this.focusedEntrance = null;
    this.focusedEntityId = null;
    this.focusedEntity = null;
    this.factOpen = false;
    this.activeFactId = null;
    this.welcomeSeen = false;
    this.welcomeOpen = false;
    this.areaCard = null;
    this.areaCardUntil = 0;
    this.transition = {
      active: false,
      kind: "screen_slide",
      direction: null,
      fromScreenId: null,
      toScreenId: null,
      elapsed: 0,
      duration: OTZI.CFG.screenTransitionDuration,
      fromArea: null,
      toArea: null,
      fromPlayer: null,
      toPlayer: null,
      fromCamera: null,
      toCamera: null,
      targetX: null,
      targetY: null,
      scope: "overworld"
    };
    this.enterOverworldScreen(this.world.homeX, this.world.homeY, { keepScene: true });
  },
  setActiveArea(area) {
    this.currentArea = area;
    this.map = area.map;
    this.resourceNodes = area.resources;
    this.entities = area.entities;
    this.entrances = area.entrances || [];
    this.hazards = area.hazards || [];
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
  computeEntryPosition(map, edge, carry) {
    const ts = OTZI.CFG.tileSize;
    const min = Math.max(ts * 1.25, OTZI.CFG.transitionEdgePad + ts * 0.45);
    const maxX = map.w * ts - min;
    const maxY = map.h * ts - min;
    const center = { x: map.w * ts / 2, y: map.h * ts / 2 };
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
    return next;
  },
  placePlayerForEntry(edge, carry) {
    const next = this.computeEntryPosition(this.map, edge, carry);
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
    this.onAreaEntered();
    OTZI.input.clearAll();
    OTZI.camera.update();
    this.updateFocusState();
  },
  beginScreenTransition(direction, x, y, entrySide, carry) {
    const toArea = OTZI.worldGrid.getOverworldScreen(this.world, this.seed, x, y);
    OTZI.worldGrid.markDiscovered(this.world, x, y);
    toArea.discovered = true;
    const toPlayer = this.computeEntryPosition(toArea.map, entrySide, carry);
    const toCamera = OTZI.camera.targetFor(toArea.map, toPlayer);
    this.transition = {
      active: true,
      kind: "screen_slide",
      direction,
      fromScreenId: this.currentScreen.id,
      toScreenId: toArea.id,
      elapsed: 0,
      duration: OTZI.CFG.screenTransitionDuration,
      fromArea: this.currentScreen,
      toArea,
      fromPlayer: { x: this.player.x, y: this.player.y, radius: this.player.radius },
      toPlayer: { x: toPlayer.x, y: toPlayer.y, radius: this.player.radius },
      fromCamera: { x: OTZI.camera.x, y: OTZI.camera.y },
      toCamera,
      targetX: x,
      targetY: y,
      scope: "overworld"
    };
    OTZI.input.clearAll();
    this.focusedTargetType = null;
    this.focusedResourceId = null;
    this.focusedResource = null;
    this.focusedEntranceId = null;
    this.focusedEntrance = null;
    this.focusedEntityId = null;
    this.focusedEntity = null;
  },
  finishScreenTransition() {
    const t = this.transition;
    this.transition.active = false;
    if (t.scope === "dungeon") this.enterDungeonRoom(t.targetX, t.targetY, { keepScene: true, restorePlayer: true });
    else this.enterOverworldScreen(t.targetX, t.targetY, { keepScene: true, restorePlayer: true });
    this.player.x = t.toPlayer.x;
    this.player.y = t.toPlayer.y;
    OTZI.camera.update();
    OTZI.input.clearAll();
    this.updateFocusState();
  },
  updateTransition(dt) {
    if (!this.transition.active) return;
    this.transition.elapsed = Math.min(this.transition.duration, this.transition.elapsed + dt);
    if (this.transition.elapsed >= this.transition.duration) this.finishScreenTransition();
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
    this.onAreaEntered();
    OTZI.input.clearAll();
    OTZI.camera.update();
    this.updateFocusState();
  },
  onAreaEntered() {
    this.showAreaCard();
    if (this.scene === "overworld" && this.currentScreen?.kind === "village_home") {
      this.village.visitedHome = true;
      this.tryUnlockToolmaker();
    }
  },
  currentObjective() {
    return OTZI.objectives.current(this);
  },
  showAreaCard(seconds = 2) {
    const card = OTZI.objectives.screenCard(this.currentArea, this);
    this.areaCard = card;
    this.areaCardUntil = performance.now() + seconds * 1000;
  },
  dismissAreaCard() {
    this.areaCardUntil = 0;
  },
  isAreaCardVisible() {
    return !!this.areaCard && performance.now() <= this.areaCardUntil;
  },
  openWelcome() {
    this.welcomeOpen = true;
    OTZI.input.clearAll();
    return true;
  },
  dismissWelcome(markSeen = true) {
    this.welcomeOpen = false;
    if (markSeen) this.welcomeSeen = true;
    return true;
  },
  tryUnlockToolmaker() {
    if (!this.dungeons.flint_scar.completed) return false;
    if (OTZI.village.has("toolmaker")) return false;
    if ((this.inventory.goodFlintCore || 0) < 1) return false;
    OTZI.inventory.add("goodFlintCore", -1);
    OTZI.village.unlock("toolmaker");
    this.village.toolmakerReady = true;
    const fact = OTZI.facts.discover("retoucheur_tool");
    this.openFact(fact?.id || null);
    OTZI.dialogue.toast("Toolmaker unlocked");
    return true;
  },
  openFact(id) {
    if (!id) return false;
    this.activeFactId = id;
    this.factOpen = true;
    const fact = OTZI.facts.get(id);
    if (fact) OTZI.dialogue.toast(`Fact unlocked: ${fact.title}`);
    OTZI.input.clearAll();
    return true;
  },
  closeFact() {
    this.factOpen = false;
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
  findNearestEntity() {
    return OTZI.entities.nearestInteractable(this.entities || [], this.player);
  },
  updateFocusState() {
    const entity = this.findNearestEntity();
    const entrance = this.findNearestEntrance();
    const resource = entity || entrance ? null : OTZI.resources.findNearestVisibleTarget(this.resourceNodes, this.player, this.map);
    this.focusedEntityId = entity ? entity.id : null;
    this.focusedEntity = entity || null;
    this.focusedEntranceId = entrance ? entrance.id : null;
    this.focusedEntrance = entrance || null;
    this.focusedResourceId = resource ? resource.id : null;
    this.focusedResource = resource || null;
    this.focusedTargetType = entity ? "entity" : entrance ? "entrance" : resource ? "resource" : null;
  },
  tryUse() {
    if (this.transition.active) return false;
    if (this.focusedEntity) {
      return this.tryEntityUse();
    }
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
  tryEntityUse() {
    const entity = (this.entities || []).find((item) => item.id === this.focusedEntityId);
    if (!entity) return false;
    if (entity.kind === "hare") {
      if (entity.state === "fleeing" || entity.escaped) {
        OTZI.dialogue.toast("Too startled to catch");
        return false;
      }
      entity.caught = true;
      OTZI.inventory.add("food", 1);
      OTZI.dialogue.toast("Caught hare +1 food");
      OTZI.audio.blip(600, 0.05);
      this.updateFocusState();
      return true;
    }
    if (entity.kind === "good_flint_core" && !entity.collected) {
      entity.collected = true;
      OTZI.inventory.add("goodFlintCore", 1);
      this.dungeons.flint_scar.completed = true;
      this.dungeons.flint_scar.coreCollected = true;
      if (this.currentRoom) this.currentRoom.completed = true;
      OTZI.dialogue.toast("Collected good flint core");
      OTZI.audio.blip(780, 0.05);
      this.updateFocusState();
      return true;
    }
    return false;
  },
  tryGather() {
    if (this.transition.active) return false;
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
    if (this.transition.active || this.scene !== "overworld" || !this.currentScreen) return false;
    const pad = OTZI.CFG.transitionEdgePad;
    const maxX = this.map.w * OTZI.CFG.tileSize - pad;
    const maxY = this.map.h * OTZI.CFG.tileSize - pad;
    if (this.player.x <= pad && this.currentScreen.exits.w) {
      this.beginScreenTransition("west", this.world.currentX - 1, this.world.currentY, "e", { y: this.player.y });
      return true;
    }
    if (this.player.x >= maxX && this.currentScreen.exits.e) {
      this.beginScreenTransition("east", this.world.currentX + 1, this.world.currentY, "w", { y: this.player.y });
      return true;
    }
    if (this.player.y <= pad && this.currentScreen.exits.n) {
      this.beginScreenTransition("north", this.world.currentX, this.world.currentY - 1, "s", { x: this.player.x });
      return true;
    }
    if (this.player.y >= maxY && this.currentScreen.exits.s) {
      this.beginScreenTransition("south", this.world.currentX, this.world.currentY + 1, "n", { x: this.player.x });
      return true;
    }
    return false;
  },
  maybeTransitionDungeonRoom() {
    if (this.transition.active || this.scene !== "dungeon" || !this.currentRoom) return false;
    const pad = OTZI.CFG.transitionEdgePad;
    const maxX = this.map.w * OTZI.CFG.tileSize - pad;
    const maxY = this.map.h * OTZI.CFG.tileSize - pad;
    if (this.player.x <= pad && this.currentRoom.exits.w) {
      this.beginDungeonRoomTransition("west", this.currentDungeon.currentX - 1, this.currentDungeon.currentY, "e", { y: this.player.y });
      return true;
    }
    if (this.player.x >= maxX && this.currentRoom.exits.e) {
      this.beginDungeonRoomTransition("east", this.currentDungeon.currentX + 1, this.currentDungeon.currentY, "w", { y: this.player.y });
      return true;
    }
    if (this.player.y <= pad && this.currentRoom.exits.n) {
      this.beginDungeonRoomTransition("north", this.currentDungeon.currentX, this.currentDungeon.currentY - 1, "s", { x: this.player.x });
      return true;
    }
    if (this.player.y >= maxY && this.currentRoom.exits.s) {
      this.beginDungeonRoomTransition("south", this.currentDungeon.currentX, this.currentDungeon.currentY + 1, "n", { x: this.player.x });
      return true;
    }
    return false;
  },
  beginDungeonRoomTransition(direction, x, y, entrySide, carry) {
    const toArea = OTZI.worldGrid.getDungeonRoom(this.currentDungeon, this.seed, x, y);
    OTZI.worldGrid.markDiscovered(this.currentDungeon, x, y);
    toArea.discovered = true;
    const toPlayer = this.computeEntryPosition(toArea.map, entrySide, carry);
    const toCamera = OTZI.camera.targetFor(toArea.map, toPlayer);
    this.transition = {
      active: true,
      kind: "screen_slide",
      direction,
      fromScreenId: this.currentRoom.id,
      toScreenId: toArea.id,
      elapsed: 0,
      duration: OTZI.CFG.screenTransitionDuration,
      fromArea: this.currentRoom,
      toArea,
      fromPlayer: { x: this.player.x, y: this.player.y, radius: this.player.radius },
      toPlayer: { x: toPlayer.x, y: toPlayer.y, radius: this.player.radius },
      fromCamera: { x: OTZI.camera.x, y: OTZI.camera.y },
      toCamera,
      targetX: x,
      targetY: y,
      scope: "dungeon"
    };
    OTZI.input.clearAll();
    this.focusedTargetType = null;
    this.focusedResourceId = null;
    this.focusedResource = null;
    this.focusedEntranceId = null;
    this.focusedEntrance = null;
    this.focusedEntityId = null;
    this.focusedEntity = null;
  },
  applyHazards(dt) {
    if (!this.hazards || this.scene !== "dungeon") return;
    this.player.hazardCooldown = Math.max(0, (this.player.hazardCooldown || 0) - dt);
    for (const hazard of this.hazards) {
      const dist = Math.hypot(hazard.x - this.player.x, hazard.y - this.player.y);
      if (dist > hazard.radius) continue;
      if ((this.player.hazardCooldown || 0) > 0) continue;
      OTZI.survival.spendStamina(this.player, 6);
      this.player.hazardCooldown = 0.8;
      OTZI.dialogue.toast("Loose stones drain stamina");
      break;
    }
  },
  update(dt, actions) {
    if (this.transition.active) {
      OTZI.input.clearAll();
      this.updateTransition(dt);
      return;
    }
    if (this.factOpen || this.welcomeOpen) {
      actions.moveX = 0;
      actions.moveY = 0;
      actions.sprint = false;
    }
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
    if (this.menuOpen || this.welcomeOpen) {
      actions.moveX = 0;
      actions.moveY = 0;
      actions.sprint = false;
    }
    const sprinting = actions.sprint && this.player.stamina > 0;
    this.lastSprinting = sprinting;
    const speed = sprinting ? OTZI.CFG.sprintSpeed : OTZI.CFG.playerSpeed;
    OTZI.collision.moveCircle(this.player, actions.moveX * speed * dt, actions.moveY * speed * dt);
    OTZI.survival.update(this.player, dt, sprinting);
    OTZI.entities.update(dt);
    this.applyHazards(dt);
    if (this.scene === "dungeon") this.maybeTransitionDungeonRoom();
    else this.maybeTransitionScreen();
    OTZI.camera.update();
    this.updateFocusState();
    if (!this.isAreaCardVisible()) this.areaCard = null;
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
      if (!OTZI.game.welcomeSeen) OTZI.game.openWelcome();
    });
    OTZI.dom.welcomeOkBtn.addEventListener("click", () => {
      OTZI.game.dismissWelcome(true);
    });
    OTZI.dom.menuCloseBtn.addEventListener("click", () => {
      OTZI.game.menuOpen = false;
      OTZI.input.clearAll();
      OTZI.dialogue.toast("Craft/Menu closed");
    });
    OTZI.dom.craftCrudeToolBtn.addEventListener("click", () => {
      OTZI.crafting.craft("crude_cutting_tool");
    });
    OTZI.dom.factCloseBtn.addEventListener("click", () => {
      OTZI.game.closeFact();
    });
    OTZI.dom.viewFactBtn.addEventListener("click", () => {
      const fact = OTZI.facts.latestDiscovered();
      if (fact) OTZI.game.openFact(fact.id);
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
