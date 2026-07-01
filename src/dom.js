/* SECTION 00: DOM */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.dom = {
  init() {
    this.app = document.getElementById("app");
    this.canvas = document.getElementById("worldCanvas");
    this.uiRoot = document.getElementById("uiRoot");
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.uiRoot.innerHTML = `
      <section id="gameShell" class="game-shell" aria-label="Game viewport">
        <div id="minimapPanel" class="minimap-panel" hidden aria-label="Trail map preview">
          <div class="panel-title">TRAIL MAP</div>
          <canvas id="minimapCanvas" width="104" height="104" aria-hidden="true"></canvas>
        </div>
        <div class="start-panel" id="startPanel">
          <h1>The Legend of &Ouml;tzi the Iceman</h1>
          <p>Canvas 2D survival adventure engine shell.</p>
          <button id="startBtn" type="button">Start / Audio Unlock</button>
        </div>
      </section>
      <section id="hudStrip" class="hud-strip" aria-label="Stats and status">
        <div id="inventoryChip" class="stat-chip">FLINT: 0</div>
        <div id="staminaChip" class="stat-chip">STAM: 100</div>
        <div id="statusLine" class="status-line">Milestone 1 engine shell</div>
        <button id="mapTab" type="button" aria-label="Trail map">MAP</button>
        <button id="debugBtn" type="button" aria-label="Toggle debug">D</button>
      </section>
      <div id="debugPanel" class="debug-panel" hidden></div>
      <section class="controls" id="controls" aria-label="Touch controls">
        <div class="stick-zone" id="moveZone" aria-label="MOVE joystick">
          <div class="stick-label">MOVE</div>
          <div class="stick-base"><div class="stick-knob" id="stickKnob"></div></div>
        </div>
        <div class="action-cluster">
          <button id="useBtn" type="button">USE<br>GATHER</button>
          <button id="sprintBtn" type="button">DODGE<br>SPRINT</button>
          <button id="menuBtn" type="button">CRAFT<br>MENU</button>
        </div>
      </section>
      <div id="menuPanel" class="menu-panel" hidden role="dialog" aria-modal="false" aria-label="Craft and menu placeholder">
        <div class="panel-title">CRAFT / MENU</div>
        <p>Craft/Menu placeholder &mdash; control path works.</p>
        <dl>
          <div><dt>Seed</dt><dd id="menuSeed">-</dd></div>
          <div><dt>Flint</dt><dd id="menuFlint">0</dd></div>
          <div><dt>Stamina</dt><dd id="menuStamina">100</dd></div>
        </dl>
        <button id="menuCloseBtn" type="button">Close</button>
      </div>
    `;
    this.startPanel = document.getElementById("startPanel");
    this.startBtn = document.getElementById("startBtn");
    this.debugBtn = document.getElementById("debugBtn");
    this.debugPanel = document.getElementById("debugPanel");
    this.inventoryChip = document.getElementById("inventoryChip");
    this.staminaChip = document.getElementById("staminaChip");
    this.hudStrip = document.getElementById("hudStrip");
    this.gameShell = document.getElementById("gameShell");
    this.minimapPanel = document.getElementById("minimapPanel");
    this.minimapCanvas = document.getElementById("minimapCanvas");
    this.minimapCtx = this.minimapCanvas.getContext("2d", { alpha: false });
    this.menuPanel = document.getElementById("menuPanel");
    this.menuSeed = document.getElementById("menuSeed");
    this.menuFlint = document.getElementById("menuFlint");
    this.menuStamina = document.getElementById("menuStamina");
    this.menuCloseBtn = document.getElementById("menuCloseBtn");
    this.statusLine = document.getElementById("statusLine");
    this.moveZone = document.getElementById("moveZone");
    this.stickKnob = document.getElementById("stickKnob");
    this.useBtn = document.getElementById("useBtn");
    this.sprintBtn = document.getElementById("sprintBtn");
    this.menuBtn = document.getElementById("menuBtn");
    this.mapTab = document.getElementById("mapTab");
  }
};
