/* SECTION 09B: RENDER WORLD */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.renderWorld = {
  draw() {
    const ctx = OTZI.dom.ctx;
    const vp = OTZI.viewport;
    ctx.fillStyle = "#0b0e0d";
    ctx.fillRect(0, 0, vp.cssW, vp.cssH);
    const transition = OTZI.game.transition;
    if (transition.active) {
      this.drawScreenTransition(ctx, transition);
      return;
    }
    this.drawArea(ctx, {
      area: OTZI.game.currentArea,
      camera: { x: OTZI.camera.x, y: OTZI.camera.y },
      player: OTZI.game.player,
      focusId: OTZI.game.focusedTargetType === "resource" ? OTZI.game.focusedResourceId : null,
      entranceId: OTZI.game.focusedTargetType === "entrance" ? OTZI.game.focusedEntranceId : null,
      offsetX: 0,
      offsetY: 0,
      debug: OTZI.game.debug
    });
  },
  drawScreenTransition(ctx, transition) {
    const vp = OTZI.viewport;
    const p = Math.max(0, Math.min(1, transition.elapsed / transition.duration));
    let fromOffsetX = 0;
    let fromOffsetY = 0;
    let toOffsetX = 0;
    let toOffsetY = 0;
    if (transition.direction === "east") {
      fromOffsetX = -vp.cssW * p;
      toOffsetX = vp.cssW * (1 - p);
    } else if (transition.direction === "west") {
      fromOffsetX = vp.cssW * p;
      toOffsetX = -vp.cssW * (1 - p);
    } else if (transition.direction === "north") {
      fromOffsetY = vp.cssH * p;
      toOffsetY = -vp.cssH * (1 - p);
    } else if (transition.direction === "south") {
      fromOffsetY = -vp.cssH * p;
      toOffsetY = vp.cssH * (1 - p);
    }
    this.drawArea(ctx, {
      area: transition.fromArea,
      camera: transition.fromCamera,
      player: transition.fromPlayer,
      focusId: null,
      entranceId: null,
      offsetX: fromOffsetX,
      offsetY: fromOffsetY,
      debug: false
    });
    this.drawArea(ctx, {
      area: transition.toArea,
      camera: transition.toCamera,
      player: transition.toPlayer,
      focusId: null,
      entranceId: null,
      offsetX: toOffsetX,
      offsetY: toOffsetY,
      debug: false
    });
  },
  drawArea(ctx, state) {
    const area = state.area;
    const cam = state.camera;
    const cfg = OTZI.CFG;
    const pal = OTZI.assets.palette;
    const map = area.map;
    const startX = Math.max(0, Math.floor(cam.x / cfg.tileSize) - 1);
    const startY = Math.max(0, Math.floor(cam.y / cfg.tileSize) - 1);
    const endX = Math.min(map.w - 1, Math.ceil((cam.x + OTZI.viewport.cssW) / cfg.tileSize) + 1);
    const endY = Math.min(map.h - 1, Math.ceil((cam.y + OTZI.viewport.cssH) / cfg.tileSize) + 1);
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const t = map.getGround(x, y);
        ctx.fillStyle = t === OTZI.TILE.WATER ? pal.water :
          t === OTZI.TILE.SNOW ? pal.snow :
          t === OTZI.TILE.PATH ? pal.path :
          t === OTZI.TILE.TREE ? pal.tree :
          t === OTZI.TILE.ROCK ? pal.rock :
          t === OTZI.TILE.DEADWOOD ? "#6b4a2f" :
          t === OTZI.TILE.STONE ? "#545a55" :
          t === OTZI.TILE.BIRCH ? "#d8d3ba" :
          t === OTZI.TILE.GRASS_CLUMP ? "#6faa42" :
          t === OTZI.TILE.BERRY ? "#315b36" :
          t === OTZI.TILE.DEPLETED ? "#4d4b3d" :
          t === OTZI.TILE.DARK_GRASS ? pal.darkGrass : pal.grass;
        const dx = x * cfg.tileSize - cam.x + state.offsetX;
        const dy = y * cfg.tileSize - cam.y + state.offsetY;
        ctx.fillRect(dx, dy, cfg.tileSize, cfg.tileSize);
        if (t === OTZI.TILE.TREE) {
          ctx.fillStyle = "#102516";
          ctx.fillRect(dx + 6, dy + 4, 12, 17);
        }
        if (t === OTZI.TILE.ROCK) {
          ctx.fillStyle = "#8b8d83";
          ctx.fillRect(dx + 5, dy + 7, 14, 10);
        }
        if (t === OTZI.TILE.DEADWOOD) {
          ctx.fillStyle = "#9b6b3e";
          ctx.fillRect(dx + 4, dy + 13, 16, 5);
        }
        if (t === OTZI.TILE.STONE) {
          ctx.fillStyle = "#a5aaa0";
          ctx.fillRect(dx + 7, dy + 9, 10, 8);
        }
        if (t === OTZI.TILE.BIRCH) {
          ctx.fillStyle = "#f1ead0";
          ctx.fillRect(dx + 9, dy + 4, 7, 18);
          ctx.fillStyle = "#332d24";
          ctx.fillRect(dx + 10, dy + 8, 5, 2);
        }
        if (t === OTZI.TILE.GRASS_CLUMP) {
          ctx.fillStyle = "#9bd35e";
          ctx.fillRect(dx + 5, dy + 13, 3, 7);
          ctx.fillRect(dx + 11, dy + 9, 3, 11);
          ctx.fillRect(dx + 17, dy + 12, 3, 8);
        }
        if (t === OTZI.TILE.BERRY) {
          ctx.fillStyle = "#233a20";
          ctx.fillRect(dx + 5, dy + 7, 14, 12);
          ctx.fillStyle = "#c43d4b";
          ctx.fillRect(dx + 9, dy + 9, 3, 3);
          ctx.fillRect(dx + 14, dy + 13, 3, 3);
        }
        if (t === OTZI.TILE.DEPLETED) {
          ctx.fillStyle = "rgba(0,0,0,.22)";
          ctx.fillRect(dx + 7, dy + 9, 10, 6);
        }
      }
    }
    for (const entrance of area.entrances || []) this.drawEntranceNode(ctx, entrance, state.entranceId === entrance.id, cam, state.offsetX, state.offsetY);
    this.drawAreaLandmarks(ctx, area, cam, state.offsetX, state.offsetY);
    for (const node of area.resources) this.drawResourceNode(ctx, node, state.focusId === node.id, cam, state.offsetX, state.offsetY);
    for (const hazard of area.hazards || []) this.drawHazard(ctx, hazard, cam, state.offsetX, state.offsetY);
    for (const e of area.entities || []) this.drawEntity(ctx, e, pal.deer, cam, state.offsetX, state.offsetY, OTZI.game.focusedEntityId === e.id);
    this.drawEntity(ctx, state.player, pal.player, cam, state.offsetX, state.offsetY);
    if (state.debug) OTZI.debug.draw(ctx, area, startX, startY, endX, endY, cam, state.offsetX, state.offsetY);
  },
  drawAreaLandmarks(ctx, area, camera, offsetX = 0, offsetY = 0) {
    const ts = OTZI.CFG.tileSize;
    if (area.kind === "village_home") {
      const x = area.map.w * ts * 0.5;
      const y = area.map.h * ts * 0.5;
      const hut = this.project(camera, x - ts * 1.4, y - ts * 0.2, offsetX, offsetY);
      const fire = this.project(camera, x + ts * 2.2, y + ts * 0.6, offsetX, offsetY);
      const flamePulse = 1 + Math.sin(performance.now() * 0.01) * 0.08;
      ctx.save();
      ctx.fillStyle = "#5b3419";
      ctx.fillRect(hut.x - 26, hut.y - 2, 52, 30);
      ctx.fillStyle = "#8e6032";
      ctx.beginPath();
      ctx.moveTo(hut.x - 30, hut.y - 2);
      ctx.lineTo(hut.x, hut.y - 28);
      ctx.lineTo(hut.x + 30, hut.y - 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#2a160d";
      ctx.fillRect(hut.x - 6, hut.y + 7, 12, 21);
      ctx.fillStyle = "#b18b56";
      ctx.fillRect(hut.x - 20, hut.y + 7, 10, 12);
      ctx.fillRect(hut.x + 10, hut.y + 7, 10, 12);
      ctx.fillStyle = "#3f2411";
      ctx.fillRect(fire.x - 16, fire.y + 8, 32, 7);
      ctx.fillStyle = "#6a3c16";
      ctx.beginPath();
      ctx.arc(fire.x, fire.y + 4, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f0c666";
      ctx.beginPath();
      ctx.moveTo(fire.x, fire.y - 14 * flamePulse);
      ctx.quadraticCurveTo(fire.x + 10, fire.y - 2, fire.x, fire.y + 8);
      ctx.quadraticCurveTo(fire.x - 10, fire.y - 2, fire.x, fire.y - 14 * flamePulse);
      ctx.fill();
      ctx.fillStyle = "#ff7b3c";
      ctx.beginPath();
      ctx.moveTo(fire.x + 1, fire.y - 8 * flamePulse);
      ctx.quadraticCurveTo(fire.x + 5, fire.y, fire.x + 1, fire.y + 6);
      ctx.quadraticCurveTo(fire.x - 4, fire.y, fire.x + 1, fire.y - 8 * flamePulse);
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.72)";
      ctx.fillRect(fire.x - 24, fire.y - 32, 48, 14);
      ctx.fillStyle = "#f2ddb2";
      ctx.font = "800 10px ui-monospace,Consolas,monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("HEARTH", fire.x, fire.y - 21);
      ctx.restore();
      if (OTZI.village.has("toolmaker")) {
        const tp = this.project(camera, x + ts * 3.2, y - ts * 1.4, offsetX, offsetY);
        ctx.save();
        ctx.fillStyle = "#8e6c3d";
        ctx.fillRect(tp.x - 14, tp.y - 8, 28, 16);
        ctx.strokeStyle = "#f1ead0";
        ctx.lineWidth = 2;
        ctx.strokeRect(tp.x - 14, tp.y - 8, 28, 16);
        ctx.fillStyle = "#f0c666";
        ctx.fillRect(tp.x - 4, tp.y - 18, 8, 10);
        ctx.restore();
      }
    }
    if (area.kind === "flint_scar_entrance") {
      const x = (area.map.w - 4.5) * ts;
      const y = Math.floor(area.map.h / 2) * ts + ts * 0.5;
      const p = this.project(camera, x, y, offsetX, offsetY);
      ctx.save();
      ctx.fillStyle = "#474a4e";
      ctx.beginPath();
      ctx.moveTo(p.x - 20, p.y + 18);
      ctx.lineTo(p.x - 14, p.y - 8);
      ctx.lineTo(p.x + 16, p.y - 14);
      ctx.lineTo(p.x + 22, p.y + 18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#0c0f10";
      ctx.beginPath();
      ctx.moveTo(p.x - 10, p.y + 14);
      ctx.lineTo(p.x - 8, p.y - 2);
      ctx.quadraticCurveTo(p.x, p.y - 18, p.x + 10, p.y - 2);
      ctx.lineTo(p.x + 12, p.y + 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  },
  resourceColor(resource) {
    return {
      flint: "#d9e4d8",
      stick: "#c8894e",
      stone: "#b7bbb2",
      bark: "#f1ead0",
      grass: "#a8e36c",
      food: "#d94c5c"
    }[resource] || "#ffffff";
  },
  drawResourceNode(ctx, node, highlighted, camera, offsetX = 0, offsetY = 0) {
    if (node.depleted) return;
    const p = this.project(camera, node.x, node.y, offsetX, offsetY);
    if (p.x < -32 || p.y < -36 || p.x > OTZI.viewport.cssW + 32 || p.y > OTZI.viewport.cssH + 32) return;
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.fillRect(x - 10, y + 10, 20, 4);
    this.drawResourceIcon(ctx, node.resource, x, y);
    if (highlighted) {
      this.drawResourceFocus(ctx, node.resource, x, y);
    }
    ctx.restore();
  },
  drawEntranceNode(ctx, entrance, highlighted, camera, offsetX = 0, offsetY = 0) {
    const p = this.project(camera, entrance.x, entrance.y, offsetX, offsetY);
    if (p.x < -32 || p.y < -36 || p.x > OTZI.viewport.cssW + 32 || p.y > OTZI.viewport.cssH + 32) return;
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.4)";
    const isFlintScar = entrance.dungeonId === "flint_scar";
    const width = isFlintScar ? 34 : 22;
    const height = isFlintScar ? 18 : 12;
    ctx.fillRect(x - width / 2, y + 14, width, 5);
    ctx.fillStyle = isFlintScar ? "#3a3c41" : "#2a2318";
    ctx.strokeStyle = isFlintScar ? "#efe0ae" : "#d8ccb0";
    ctx.lineWidth = isFlintScar ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y + 12);
    ctx.lineTo(x - width / 2 + 2, y - 4);
    ctx.quadraticCurveTo(x, y - (isFlintScar ? 24 : 15), x + width / 2 - 2, y - 4);
    ctx.lineTo(x + width / 2, y + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (isFlintScar) {
      ctx.fillStyle = "rgba(0,0,0,.72)";
      ctx.fillRect(x - 28, y - 42, 56, 14);
      ctx.fillStyle = "#f2ddb2";
      ctx.font = "800 10px ui-monospace,Consolas,monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("FLINT SCAR", x, y - 31);
    }
    if (highlighted) this.drawResourceFocus(ctx, entrance.label.toUpperCase(), x, y);
    ctx.restore();
  },
  drawResourceIcon(ctx, resource, x, y) {
    const color = this.resourceColor(resource);
    ctx.strokeStyle = "rgba(0,0,0,.78)";
    ctx.lineWidth = 2;
    ctx.fillStyle = color;
    if (resource === "flint") {
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x + 8, y);
      ctx.lineTo(x, y + 9);
      ctx.lineTo(x - 8, y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      return;
    }
    if (resource === "stick") {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.45);
      ctx.fillRect(-10, -4, 20, 8);
      ctx.strokeRect(-10, -4, 20, 8);
      ctx.restore();
      return;
    }
    if (resource === "bark") {
      ctx.fillRect(x - 8, y - 10, 16, 20);
      ctx.strokeRect(x - 8, y - 10, 16, 20);
      ctx.strokeStyle = "rgba(70,54,35,.8)";
      ctx.beginPath();
      ctx.moveTo(x - 3, y - 8);
      ctx.lineTo(x - 3, y + 8);
      ctx.moveTo(x + 4, y - 7);
      ctx.lineTo(x + 4, y + 7);
      ctx.stroke();
      return;
    }
    if (resource === "grass") {
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 8);
      ctx.lineTo(x - 6, y - 8);
      ctx.lineTo(x - 1, y + 8);
      ctx.lineTo(x + 3, y - 10);
      ctx.lineTo(x + 8, y + 8);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      return;
    }
    if (resource === "food") {
      for (const [dx, dy] of [[-5, -3], [4, -4], [0, 5]]) {
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
      }
      return;
    }
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  },
  drawResourceFocus(ctx, resource, x, y) {
    const label = resource.toUpperCase();
    ctx.strokeStyle = "#ffe08a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = "800 10px ui-monospace,Consolas,monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const w = Math.max(44, label.length * 8 + 10);
    ctx.fillStyle = "rgba(0,0,0,.78)";
    ctx.fillRect(Math.floor(x - w / 2), y - 34, w, 16);
    ctx.strokeStyle = "rgba(255,224,138,.45)";
    ctx.strokeRect(Math.floor(x - w / 2), y - 34, w, 16);
    ctx.fillStyle = "#ffe8a8";
    ctx.fillText(label, x, y - 21);
  },
  drawEntity(ctx, e, color, camera, offsetX = 0, offsetY = 0, highlighted = false) {
    const p = this.project(camera, e.x, e.y, offsetX, offsetY);
    if (e.kind === "hare" || e.kind === "grouse") {
      if ((e.caught || e.escaped) && (e.resolveTimer || 0) <= 0) return;
      ctx.save();
      const outcome = e.outcome || null;
      const alpha = (e.caught || e.escaped) ? Math.max(0.2, Math.min(1, (e.resolveTimer || 0) / 0.9)) : 1;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(0,0,0,.28)";
      ctx.fillRect(p.x - 10, p.y + 8, 20, 4);
      if (e.kind === "hare") {
        ctx.fillStyle = outcome === "caught" ? "#c6d685" : outcome === "escaped" ? "#c98b72" : e.state === "alert" ? "#dfd3b7" : "#c9b58d";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 11, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#c9b58d";
        ctx.beginPath();
        ctx.arc(p.x + 8, p.y - 4, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(p.x + 9, p.y - 15, 2, 9);
        ctx.fillRect(p.x + 5, p.y - 15, 2, 9);
        ctx.fillStyle = "#473b30";
        ctx.fillRect(p.x - 4, p.y + 5, 2, 6);
        ctx.fillRect(p.x + 2, p.y + 5, 2, 6);
      } else {
        ctx.fillStyle = outcome === "caught" ? "#c7d283" : outcome === "escaped" ? "#8f7b66" : e.state === "alert" ? "#7d5840" : "#62442f";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 1, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x + 7, p.y - 5, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#d3c7ab";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x - 6, p.y - 9);
        ctx.lineTo(p.x - 12, p.y - 15);
        ctx.moveTo(p.x - 2, p.y - 10);
        ctx.lineTo(p.x - 8, p.y - 17);
        ctx.stroke();
        ctx.fillStyle = "#3a2415";
        ctx.fillRect(p.x - 2, p.y + 5, 2, 6);
        ctx.fillRect(p.x + 2, p.y + 5, 2, 6);
      }
      if (e.state === "alert" && !outcome) {
        ctx.fillStyle = "#ffe08a";
        ctx.fillRect(p.x - 2, p.y - 22, 4, 8);
      }
      if (outcome === "caught") this.drawResourceFocus(ctx, "CAUGHT", Math.floor(p.x), Math.floor(p.y - 2));
      else if (outcome === "escaped") this.drawResourceFocus(ctx, "ESCAPED", Math.floor(p.x), Math.floor(p.y - 2));
      else if (highlighted) this.drawResourceFocus(ctx, e.kind === "grouse" ? "GROUSE" : "HARE", Math.floor(p.x), Math.floor(p.y - 2));
      ctx.restore();
      return;
    }
    if (e.kind === "good_flint_core") {
      if (e.collected) return;
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.fillRect(p.x - 11, p.y + 10, 22, 4);
      ctx.strokeStyle = "#14181a";
      ctx.fillStyle = "#dfe9f2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 13);
      ctx.lineTo(p.x + 11, p.y - 3);
      ctx.lineTo(p.x + 5, p.y + 12);
      ctx.lineTo(p.x - 7, p.y + 11);
      ctx.lineTo(p.x - 12, p.y - 4);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      if (highlighted) this.drawResourceFocus(ctx, "CORE", Math.floor(p.x), Math.floor(p.y));
      ctx.restore();
      return;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.fillRect(p.x - e.radius, p.y + e.radius + 2, e.radius * 2, 3);
  },
  drawHazard(ctx, hazard, camera, offsetX = 0, offsetY = 0) {
    const p = this.project(camera, hazard.x, hazard.y, offsetX, offsetY);
    ctx.save();
    ctx.strokeStyle = "rgba(255,188,92,.55)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, hazard.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(120,100,70,.35)";
    ctx.fillRect(p.x - 10, p.y - 10, 20, 20);
    ctx.restore();
  },
  project(camera, x, y, offsetX, offsetY) {
    return {
      x: x - camera.x + offsetX,
      y: y - camera.y + offsetY
    };
  }
};
