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
    for (const node of area.resources) this.drawResourceNode(ctx, node, state.focusId === node.id, cam, state.offsetX, state.offsetY);
    for (const e of area.entities || []) this.drawEntity(ctx, e, pal.deer, cam, state.offsetX, state.offsetY);
    this.drawEntity(ctx, state.player, pal.player, cam, state.offsetX, state.offsetY);
    if (state.debug) OTZI.debug.draw(ctx, startX, startY, endX, endY);
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
    ctx.fillRect(x - 11, y + 11, 22, 4);
    ctx.fillStyle = "#2a2318";
    ctx.strokeStyle = "#d8ccb0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 10);
    ctx.lineTo(x - 10, y - 2);
    ctx.quadraticCurveTo(x, y - 15, x + 10, y - 2);
    ctx.lineTo(x + 10, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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
  drawEntity(ctx, e, color, camera, offsetX = 0, offsetY = 0) {
    const p = this.project(camera, e.x, e.y, offsetX, offsetY);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.fillRect(p.x - e.radius, p.y + e.radius + 2, e.radius * 2, 3);
  },
  project(camera, x, y, offsetX, offsetY) {
    return {
      x: x - camera.x + offsetX,
      y: y - camera.y + offsetY
    };
  }
};
