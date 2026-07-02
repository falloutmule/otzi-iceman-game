/* SECTION 04B: ACTION MAP */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.actionMap = {
  sample() {
    const input = OTZI.input;
    let x = input.moveVector.x;
    let y = input.moveVector.y;
    if (input.keys.has("ArrowLeft") || input.keys.has("KeyA")) x -= 1;
    if (input.keys.has("ArrowRight") || input.keys.has("KeyD")) x += 1;
    if (input.keys.has("ArrowUp") || input.keys.has("KeyW")) y -= 1;
    if (input.keys.has("ArrowDown") || input.keys.has("KeyS")) y += 1;
    const mag = Math.hypot(x, y);
    if (mag > 1) {
      x /= mag;
      y /= mag;
    }
    const pressed = input.consumePressed();
    return {
      moveX: x,
      moveY: y,
      sprint: input.sprintHeld || input.keys.has("ShiftLeft") || input.keys.has("ShiftRight"),
      sprintPressed: pressed.sprint,
      usePressed: pressed.use,
      menuPressed: pressed.menu,
      debugPressed: pressed.debug,
      mapPressed: pressed.map,
      inventoryPressed: pressed.inventory
    };
  }
};
