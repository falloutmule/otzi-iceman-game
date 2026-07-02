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
      if ("collected" in entity) entity.collected = !!state.collected;
    }
  },
  spawnScreen(seed, areaId, map, kind) {
    const rng = OTZI.rng.make(`${seed}:entities:${areaId}`);
    const out = [];
    if (kind === "animal_clearing") {
      for (let attempt = 0; attempt < 30; attempt++) {
        const tx = rng.int(4, map.w - 5);
        const ty = rng.int(4, map.h - 5);
        if (map.getFlags(tx, ty) & OTZI.FLAG.BLOCKED) continue;
        if (map.getGround(tx, ty) === OTZI.TILE.PATH) continue;
        out.push(this.makeHare(areaId, (tx + 0.5) * OTZI.CFG.tileSize, (ty + 0.5) * OTZI.CFG.tileSize));
        break;
      }
    }
    return out;
  },
  update(dt) {
    const game = OTZI.game;
    for (const e of game.entities) {
      if (e.kind === "hare") {
        this.updateHare(e, dt);
      }
    }
  },
  updateHare(e, dt) {
    if (e.caught || e.escaped) return;
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
      if (e.fleeTimer > 2.6) e.escaped = true;
      return;
    }
    if (dist < 18 || (OTZI.game.lastSprinting && dist < 70)) {
      e.state = "fleeing";
      e.fleeTimer = 0;
      if (e.noticeCooldown <= 0) {
        OTZI.dialogue.toast("Hare startled");
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
      if (entity.kind === "hare" && (entity.caught || entity.escaped || entity.state === "fleeing")) continue;
      if (entity.kind === "good_flint_core" && entity.collected) continue;
      if (entity.kind !== "hare" && entity.kind !== "good_flint_core") continue;
      const radius = entity.kind === "hare" ? OTZI.CFG.catchRadius : OTZI.CFG.interactRadius;
      const dist = Math.hypot(entity.x - player.x, entity.y - player.y);
      if (dist > radius) continue;
      if (!best || dist < best.dist) best = { ...entity, dist };
    }
    return best;
  }
};
