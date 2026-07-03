/* SECTION 08A: ENTITIES */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.entities = {
  makePlayer() {
    const cfg = OTZI.CFG;
    return {
      id: "player",
      kind: "player",
      x: cfg.screenTileW * cfg.tileSize / 2,
      y: cfg.screenTileH * cfg.tileSize / 2,
      radius: 8,
      health: 100,
      stamina: 100,
      hunger: 0,
      warmth: 100,
      wetness: 0
    };
  },
  makeHare(areaId, x, y) {
    return {
      id: `${areaId}-hare`,
      kind: "hare",
      x,
      y,
      radius: 7,
      state: "idle",
      fleeTimer: 0,
      caught: false,
      escaped: false,
      resolveTimer: 0,
      outcome: null,
      phase: 0,
      noticeCooldown: 0
    };
  },
  makeGrouse(areaId, x, y) {
    return {
      id: `${areaId}-grouse`,
      kind: "grouse",
      x,
      y,
      radius: 7,
      state: "idle",
      fleeTimer: 0,
      caught: false,
      escaped: false,
      resolveTimer: 0,
      outcome: null,
      phase: 0,
      noticeCooldown: 0
    };
  },
  makeGoodFlintCore(areaId, x, y) {
    return {
      id: `${areaId}-good-flint-core`,
      kind: "good_flint_core",
      x,
      y,
      radius: 8,
      collected: false
    };
  },
  serialize(list) {
    return list.map((entity) => ({
      id: entity.id,
      kind: entity.kind,
      x: entity.x,
      y: entity.y,
      state: entity.state || null,
      fleeTimer: entity.fleeTimer || 0,
      caught: !!entity.caught,
      escaped: !!entity.escaped,
      resolveTimer: entity.resolveTimer || 0,
      outcome: entity.outcome || null,
      collected: !!entity.collected
    }));
  },
  applyState(list, states = []) {
    const byId = new Map(states.map((state) => [state.id, state]));
    for (const entity of list) {
      const state = byId.get(entity.id);
      if (!state) continue;
      entity.x = state.x;
      entity.y = state.y;
      if ("state" in entity) entity.state = state.state || entity.state;
      if ("fleeTimer" in entity) entity.fleeTimer = state.fleeTimer || 0;
      if ("caught" in entity) entity.caught = !!state.caught;
      if ("escaped" in entity) entity.escaped = !!state.escaped;
      if ("resolveTimer" in entity) entity.resolveTimer = state.resolveTimer || 0;
      if ("outcome" in entity) entity.outcome = state.outcome || null;
      if ("collected" in entity) entity.collected = !!state.collected;
    }
  },
  spawnScreen(seed, areaId, map, kind) {
    const rng = OTZI.rng.make(`${seed}:entities:${areaId}`);
    const out = [];
    const placements = kind === "animal_clearing" ? 1 + (rng.next() < 0.35 ? 1 : 0) :
      kind === "dense_forest" ? (rng.next() < 0.45 ? 1 : 0) :
      kind === "forest_trail" ? (rng.next() < 0.2 ? 1 : 0) : 0;
    for (let spawnIndex = 0; spawnIndex < placements; spawnIndex++) {
      for (let attempt = 0; attempt < 30; attempt++) {
        const tx = rng.int(4, map.w - 5);
        const ty = rng.int(4, map.h - 5);
        if (map.getFlags(tx, ty) & OTZI.FLAG.BLOCKED) continue;
        if (map.getGround(tx, ty) === OTZI.TILE.PATH) continue;
        if (out.some((entity) => Math.hypot(entity.x - (tx + 0.5) * OTZI.CFG.tileSize, entity.y - (ty + 0.5) * OTZI.CFG.tileSize) < OTZI.CFG.tileSize * 2)) continue;
        const speciesRoll = rng.next();
        const x = (tx + 0.5) * OTZI.CFG.tileSize;
        const y = (ty + 0.5) * OTZI.CFG.tileSize;
        out.push(speciesRoll < 0.6 ? this.makeHare(areaId, x, y) : this.makeGrouse(areaId, x, y));
        break;
      }
    }
    return out;
  },
  update(dt) {
    const game = OTZI.game;
    for (const e of game.entities) {
      if (e.kind === "hare" || e.kind === "grouse") {
        this.updateHare(e, dt);
      }
    }
  },
  updateHare(e, dt) {
    if (e.caught || e.escaped) {
      e.resolveTimer = Math.max(0, (e.resolveTimer || 0) - dt);
      return;
    }
    const player = OTZI.game.player;
    const dist = Math.hypot(e.x - player.x, e.y - player.y);
    e.noticeCooldown = Math.max(0, (e.noticeCooldown || 0) - dt);
    e.phase += dt;
    if (e.state === "fleeing") {
      e.fleeTimer += dt;
      const awayX = e.x - player.x;
      const awayY = e.y - player.y;
      const len = Math.max(1, Math.hypot(awayX, awayY));
      OTZI.collision.moveCircle(e, (awayX / len) * 54 * dt, (awayY / len) * 54 * dt);
      if (e.fleeTimer > 2.6) {
        e.escaped = true;
        e.state = "escaped";
        e.outcome = "escaped";
        e.resolveTimer = 0.9;
        OTZI.dialogue.toast(`The ${e.kind} escaped`);
      }
      return;
    }
    if (dist < 18 || (OTZI.game.lastSprinting && dist < 70)) {
      e.state = "fleeing";
      e.fleeTimer = 0;
      if (e.noticeCooldown <= 0) {
        OTZI.dialogue.toast(e.kind === "grouse" ? "Grouse startled" : "Hare startled");
        e.noticeCooldown = 1.1;
      }
      return;
    }
    e.state = dist < 86 ? "alert" : "idle";
    const wobble = e.state === "alert" ? 9 : 5;
    OTZI.collision.moveCircle(e, Math.cos(e.phase * 0.9) * wobble * dt, Math.sin(e.phase * 1.1) * wobble * dt);
  },
  nearestInteractable(list, player) {
    let best = null;
    for (const entity of list) {
      if ((entity.kind === "hare" || entity.kind === "grouse") && (entity.caught || entity.escaped || entity.state === "fleeing")) continue;
      if (entity.kind === "good_flint_core" && entity.collected) continue;
      if (entity.kind !== "hare" && entity.kind !== "grouse" && entity.kind !== "good_flint_core") continue;
      const radius = entity.kind === "hare" || entity.kind === "grouse" ? OTZI.CFG.catchRadius : OTZI.CFG.interactRadius;
      const dist = Math.hypot(entity.x - player.x, entity.y - player.y);
      if (dist > radius) continue;
      if (!best || dist < best.dist) best = { ...entity, dist };
    }
    return best;
  }
};
