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
        <div id="areaCard" class="area-card" hidden aria-live="polite">
          <div class="panel-title" id="areaCardTitle">Village Camp</div>
          <p id="areaCardText">Flint Scar lies one screen east.</p>
        </div>
        <div id="minimapPanel" class="minimap-panel" hidden aria-label="Trail map preview">
          <div class="panel-title" id="minimapTitle">TRAIL MAP</div>
          <canvas id="minimapCanvas" width="120" height="120" aria-hidden="true"></canvas>
          <div id="minimapLegend" class="map-legend" aria-label="Map legend">
            <div><span>V</span><span>Village</span></div>
            <div><span>C</span><span>Flint Scar</span></div>
            <div><span>A</span><span>Animal Clearing</span></div>
            <div><span>@</span><span>You</span></div>
            <div><span>?</span><span>Unknown</span></div>
          </div>
        </div>
        <div id="inventoryPanel" class="inventory-panel" hidden aria-label="Pack inventory">
          <div class="panel-title">PACK</div>
          <dl>
            <div><dt>Flint</dt><dd id="invFlint">0</dd></div>
            <div><dt>Sticks</dt><dd id="invStick">0</dd></div>
            <div><dt>Stones</dt><dd id="invStone">0</dd></div>
            <div><dt>Bark</dt><dd id="invBark">0</dd></div>
            <div><dt>Grass</dt><dd id="invGrass">0</dd></div>
            <div><dt>Food</dt><dd id="invFood">0</dd></div>
            <div><dt>Crude tools</dt><dd id="invCrudeTool">0</dd></div>
            <div><dt>Good flint core</dt><dd id="invGoodFlintCore">0</dd></div>
          </dl>
        </div>
        <div class="start-panel" id="startPanel">
          <h1>The Legend of &Ouml;tzi the Iceman</h1>
          <p>Canvas 2D survival adventure engine shell.</p>
          <button id="startBtn" type="button">Start / Audio Unlock</button>
        </div>
        <div id="welcomePanel" class="menu-panel welcome-panel" hidden role="dialog" aria-modal="false" aria-label="Welcome objective">
          <div class="panel-title">Village Camp</div>
          <p>&Ouml;tzi needs better stone tools.</p>
          <p>Travel east from the village to find Flint Scar.</p>
          <p>Gather food and supplies as you explore.</p>
          <button id="welcomeOkBtn" type="button">OK</button>
        </div>
      </section>
      <section id="objectiveBar" class="objective-bar" aria-label="Current objective">
        <div class="objective-tag">OBJECTIVE</div>
        <div class="objective-copy">
          <strong id="objectiveTitle">Find Flint Scar</strong>
          <span id="objectiveText">From the village, travel east to Flint Scar.</span>
        </div>
      </section>
      <section id="popupBar" class="popup-bar" aria-label="Map and inventory buttons">
        <button id="mapTab" type="button" aria-label="Trail map">MAP</button>
        <button id="inventoryBtn" type="button" aria-label="Open inventory">PACK</button>
      </section>
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
      <section id="statsStrip" class="stats-strip" aria-label="Stats and status">
        <div id="healthChip" class="stat-chip">HP 100</div>
        <div id="staminaChip" class="stat-chip">STAM 100</div>
        <div id="hungerChip" class="stat-chip">HUNGER 0</div>
        <div id="warmthChip" class="stat-chip">WARMTH 100</div>
        <div id="statusLine" class="status-line">Milestone 1 engine shell</div>
        <button id="debugBtn" type="button" aria-label="Toggle debug">D</button>
      </section>
      <div id="debugPanel" class="debug-panel" hidden></div>
      <div id="menuPanel" class="menu-panel" hidden role="dialog" aria-modal="false" aria-label="Craft and menu placeholder">
        <div class="panel-title">CRAFT / MENU</div>
        <p>Craft/Menu placeholder &mdash; control path works.</p>
        <dl>
          <div><dt>Seed</dt><dd id="menuSeed">-</dd></div>
          <div><dt>Flint</dt><dd id="menuFlint">0</dd></div>
          <div><dt>Sticks</dt><dd id="menuStick">0</dd></div>
          <div><dt>Stones</dt><dd id="menuStone">0</dd></div>
          <div><dt>Bark</dt><dd id="menuBark">0</dd></div>
          <div><dt>Grass</dt><dd id="menuGrass">0</dd></div>
          <div><dt>Food</dt><dd id="menuFood">0</dd></div>
          <div><dt>Crude cutting tools</dt><dd id="menuCrudeTool">0</dd></div>
          <div><dt>Good flint core</dt><dd id="menuGoodFlintCore">0</dd></div>
          <div><dt>Toolmaker</dt><dd id="menuToolmaker">Locked</dd></div>
          <div><dt>Latest fact</dt><dd id="menuLatestFact">None</dd></div>
          <div><dt>Stamina</dt><dd id="menuStamina">100</dd></div>
        </dl>
        <button id="craftCrudeToolBtn" type="button">Craft Crude Cutting Tool</button>
        <button id="viewFactBtn" type="button">View Latest Fact</button>
        <button id="fullscreenBtn" type="button">Fullscreen</button>
        <button id="resetSaveBtn" type="button">Reset Save</button>
        <button id="menuCloseBtn" type="button">Close</button>
      </div>
      <div id="factPanel" class="menu-panel" hidden role="dialog" aria-modal="false" aria-label="Fact log">
        <div class="panel-title">OTZI FACT</div>
        <h2 id="factTitle">-</h2>
        <p id="factMeta">-</p>
        <p id="factText">-</p>
        <button id="factCloseBtn" type="button">Close Fact</button>
      </div>
    `;
    this.startPanel = document.getElementById("startPanel");
    this.startBtn = document.getElementById("startBtn");
    this.welcomePanel = document.getElementById("welcomePanel");
    this.welcomeOkBtn = document.getElementById("welcomeOkBtn");
    this.debugBtn = document.getElementById("debugBtn");
    this.debugPanel = document.getElementById("debugPanel");
    this.objectiveBar = document.getElementById("objectiveBar");
    this.objectiveTitle = document.getElementById("objectiveTitle");
    this.objectiveText = document.getElementById("objectiveText");
    this.popupBar = document.getElementById("popupBar");
    this.statsStrip = document.getElementById("statsStrip");
    this.healthChip = document.getElementById("healthChip");
    this.staminaChip = document.getElementById("staminaChip");
    this.hungerChip = document.getElementById("hungerChip");
    this.warmthChip = document.getElementById("warmthChip");
    this.gameShell = document.getElementById("gameShell");
    this.gameShell.prepend(this.canvas);
    this.minimapPanel = document.getElementById("minimapPanel");
    this.minimapTitle = document.getElementById("minimapTitle");
    this.minimapLegend = document.getElementById("minimapLegend");
    this.minimapCanvas = document.getElementById("minimapCanvas");
    this.minimapCtx = this.minimapCanvas.getContext("2d", { alpha: false });
    this.areaCard = document.getElementById("areaCard");
    this.areaCardTitle = document.getElementById("areaCardTitle");
    this.areaCardText = document.getElementById("areaCardText");
    this.inventoryPanel = document.getElementById("inventoryPanel");
    this.invFlint = document.getElementById("invFlint");
    this.invStick = document.getElementById("invStick");
    this.invStone = document.getElementById("invStone");
    this.invBark = document.getElementById("invBark");
    this.invGrass = document.getElementById("invGrass");
    this.invFood = document.getElementById("invFood");
    this.invCrudeTool = document.getElementById("invCrudeTool");
    this.invGoodFlintCore = document.getElementById("invGoodFlintCore");
    this.menuPanel = document.getElementById("menuPanel");
    this.menuSeed = document.getElementById("menuSeed");
    this.menuFlint = document.getElementById("menuFlint");
    this.menuStick = document.getElementById("menuStick");
    this.menuStone = document.getElementById("menuStone");
    this.menuBark = document.getElementById("menuBark");
    this.menuGrass = document.getElementById("menuGrass");
    this.menuFood = document.getElementById("menuFood");
    this.menuCrudeTool = document.getElementById("menuCrudeTool");
    this.menuGoodFlintCore = document.getElementById("menuGoodFlintCore");
    this.menuToolmaker = document.getElementById("menuToolmaker");
    this.menuLatestFact = document.getElementById("menuLatestFact");
    this.menuStamina = document.getElementById("menuStamina");
    this.craftCrudeToolBtn = document.getElementById("craftCrudeToolBtn");
    this.viewFactBtn = document.getElementById("viewFactBtn");
    this.fullscreenBtn = document.getElementById("fullscreenBtn");
    this.resetSaveBtn = document.getElementById("resetSaveBtn");
    this.menuCloseBtn = document.getElementById("menuCloseBtn");
    this.factPanel = document.getElementById("factPanel");
    this.factTitle = document.getElementById("factTitle");
    this.factMeta = document.getElementById("factMeta");
    this.factText = document.getElementById("factText");
    this.factCloseBtn = document.getElementById("factCloseBtn");
    this.statusLine = document.getElementById("statusLine");
    this.moveZone = document.getElementById("moveZone");
    this.stickKnob = document.getElementById("stickKnob");
    this.useBtn = document.getElementById("useBtn");
    this.sprintBtn = document.getElementById("sprintBtn");
    this.menuBtn = document.getElementById("menuBtn");
    this.mapTab = document.getElementById("mapTab");
    this.inventoryBtn = document.getElementById("inventoryBtn");
  }
};
