/* SECTION 09C: RENDER UI */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.renderUi = {
  sync() {
    const game = OTZI.game;
    if (!game.debug) {
      OTZI.dom.debugPanel.hidden = true;
      return;
    }
    OTZI.dom.debugPanel.hidden = false;
    const tileX = Math.floor(game.player.x / OTZI.CFG.tileSize);
    const tileY = Math.floor(game.player.y / OTZI.CFG.tileSize);
    OTZI.dom.debugPanel.textContent = [
      `seed ${game.seed}`,
      `tile ${tileX},${tileY}`,
      `fps ${game.fps.toFixed(1)}`,
      `entities ${game.entities.length}`,
      `pointers ${OTZI.input.pointers.size}`,
      `canvas ${OTZI.viewport.internalW}x${OTZI.viewport.internalH}`
    ].join(" | ");
  }
};
