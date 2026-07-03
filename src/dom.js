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
        <div class="start-panel" id="startPanel">
          <h1>The Legend of &Ouml;tzi the Iceman</h1>
          <p>Explore the Alps, gather supplies, and find Flint Scar.</p>
          <button id="startBtn" type="button">Start Game</button>
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
          <span id="objectiveText">Travel east from the village.</span>
        </div>
      </section>
      <section id="popupBar" class="popup-bar" aria-label="Map craft and system buttons">
        <button id="mapTab" type="button" aria-label="Trail map">MAP</button>
        <button id="craftBtn" type="button" aria-label="Open craft">CRAFT</button>
        <button id="systemBtn" type="button" aria-label="Open system">SYSTEM</button>
      </section>
      <section class="controls" id="controls" aria-label="Touch controls">
        <div class="stick-zone" id="moveZone" aria-label="MOVE joystick">
          <div class="stick-label">MOVE</div>
          <div class="stick-base"><div class="stick-knob" id="stickKnob"></div></div>
        </div>
        <div class="action-cluster">
          <button id="useBtn" type="button">USE<br>GATHER</button>
          <button id="sprintBtn" type="button">DODGE<br>SPRINT</button>
          <button id="toolBtn" type="button">THROW<br>TOOL</button>
        </div>
      </section>
      <section id="statsStrip" class="stats-strip" aria-label="Stats and status">
        <div id="healthChip" class="stat-chip">HP 100</div>
        <div id="staminaChip" class="stat-chip">STAM 100</div>
        <div id="hungerChip" class="stat-chip">HUNGER 0</div>
        <div id="warmthChip" class="stat-chip">WARMTH 100</div>
        <div id="statusLine" class="status-line">Travel east from the village.</div>
        <button id="debugBtn" type="button" aria-label="Toggle debug">D</button>
      </section>
      <div id="debugPanel" class="debug-panel" hidden></div>
      <div id="craftPanel" class="menu-panel" hidden role="dialog" aria-modal="false" aria-label="Craft and inventory">
        <div class="panel-title">CRAFT</div>
        <p>Inventory, recipes, and hearth upgrades.</p>
        <div class="panel-title">INVENTORY</div>
        <dl>
          <div><dt>Flint</dt><dd id="craftFlint">0</dd></div>
          <div><dt>Sticks</dt><dd id="craftStick">0</dd></div>
          <div><dt>Stones</dt><dd id="craftStone">0</dd></div>
          <div><dt>Bark</dt><dd id="craftBark">0</dd></div>
          <div><dt>Grass</dt><dd id="craftGrass">0</dd></div>
          <div><dt>Food</dt><dd id="craftFood">0</dd></div>
          <div><dt>Crude cutting tools</dt><dd id="craftCrudeTool">0</dd></div>
          <div><dt>Crude spears</dt><dd id="craftCrudeSpear">0</dd></div>
          <div><dt>Hardened spears</dt><dd id="craftHardenedSpear">0</dd></div>
          <div><dt>Good flint core</dt><dd id="craftGoodFlintCore">0</dd></div>
        </dl>
        <div class="panel-title">RECIPES</div>
        <button id="craftCrudeToolBtn" type="button">Craft Crude Cutting Tool</button>
        <button id="craftCrudeSpearBtn" type="button">Craft Crude Spear</button>
        <button id="hardenSpearBtn" type="button">Harden Spear Tip</button>
        <div class="panel-title">EQUIP</div>
        <button id="equipCrudeSpearBtn" type="button">Equip Crude Spear</button>
        <button id="equipHardenedSpearBtn" type="button">Equip Hardened Spear</button>
        <p id="equipHint" class="panel-hint">No spear equipped.</p>
        <p id="craftHint" class="panel-hint">Return to the village hearth to harden wooden spear points.</p>
        <button id="craftCloseBtn" type="button">Close</button>
      </div>
      <div id="systemPanel" class="menu-panel" hidden role="dialog" aria-modal="false" aria-label="System">
        <div class="panel-title">SYSTEM</div>
        <p>Objective help, facts, save controls, and build information.</p>
        <div class="panel-title">HELP</div>
        <p class="panel-hint">MOVE with the left pad. USE handles gathering, entrances, and nearby interactions.</p>
        <button id="viewFactBtn" type="button">View Latest Fact</button>
        <button id="showHelpBtn" type="button">Show Objective Help</button>
        <button id="fullscreenBtn" type="button">Fullscreen</button>
        <button id="resetSaveBtn" type="button">Reset Save</button>
        <dl>
          <div><dt>Seed</dt><dd id="menuSeed">-</dd></div>
          <div><dt>Toolmaker</dt><dd id="menuToolmaker">Locked</dd></div>
          <div><dt>Latest fact</dt><dd id="menuLatestFact">None</dd></div>
          <div><dt>Stamina</dt><dd id="menuStamina">100</dd></div>
        </dl>
        <dl class="menu-build-meta">
          <div><dt>Build</dt><dd id="menuBuildVersion">-</dd></div>
          <div><dt>Save</dt><dd id="menuSaveVersion">-</dd></div>
          <div><dt>Worldgen</dt><dd id="menuWorldgenVersion">-</dd></div>
        </dl>
        <button id="systemCloseBtn" type="button">Close</button>
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
    this.craftPanel = document.getElementById("craftPanel");
    this.systemPanel = document.getElementById("systemPanel");
    this.menuSeed = document.getElementById("menuSeed");
    this.craftFlint = document.getElementById("craftFlint");
    this.craftStick = document.getElementById("craftStick");
    this.craftStone = document.getElementById("craftStone");
    this.craftBark = document.getElementById("craftBark");
    this.craftGrass = document.getElementById("craftGrass");
    this.craftFood = document.getElementById("craftFood");
    this.craftCrudeTool = document.getElementById("craftCrudeTool");
    this.craftCrudeSpear = document.getElementById("craftCrudeSpear");
    this.craftHardenedSpear = document.getElementById("craftHardenedSpear");
    this.craftGoodFlintCore = document.getElementById("craftGoodFlintCore");
    this.menuToolmaker = document.getElementById("menuToolmaker");
    this.menuLatestFact = document.getElementById("menuLatestFact");
    this.menuStamina = document.getElementById("menuStamina");
    this.craftCrudeToolBtn = document.getElementById("craftCrudeToolBtn");
    this.craftCrudeSpearBtn = document.getElementById("craftCrudeSpearBtn");
    this.hardenSpearBtn = document.getElementById("hardenSpearBtn");
    this.equipCrudeSpearBtn = document.getElementById("equipCrudeSpearBtn");
    this.equipHardenedSpearBtn = document.getElementById("equipHardenedSpearBtn");
    this.equipHint = document.getElementById("equipHint");
    this.craftHint = document.getElementById("craftHint");
    this.craftCloseBtn = document.getElementById("craftCloseBtn");
    this.viewFactBtn = document.getElementById("viewFactBtn");
    this.showHelpBtn = document.getElementById("showHelpBtn");
    this.fullscreenBtn = document.getElementById("fullscreenBtn");
    this.resetSaveBtn = document.getElementById("resetSaveBtn");
    this.menuBuildVersion = document.getElementById("menuBuildVersion");
    this.menuSaveVersion = document.getElementById("menuSaveVersion");
    this.menuWorldgenVersion = document.getElementById("menuWorldgenVersion");
    this.systemCloseBtn = document.getElementById("systemCloseBtn");
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
    this.toolBtn = document.getElementById("toolBtn");
    this.systemBtn = document.getElementById("systemBtn");
    this.mapTab = document.getElementById("mapTab");
    this.craftBtn = document.getElementById("craftBtn");
  }
};
