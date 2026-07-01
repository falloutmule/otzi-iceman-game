/* SECTION 00: DOM */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.dom = {
  init() {
    this.app = document.getElementById("app");
    this.canvas = document.getElementById("worldCanvas");
    this.uiRoot = document.getElementById("uiRoot");
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.uiRoot.innerHTML = `
      <div class="topbar">
        <div>
          <strong>The Legend of &Ouml;tzi the Iceman</strong>
          <span id="statusLine">Milestone 1 engine shell</span>
        </div>
        <button id="debugBtn" type="button" aria-label="Toggle debug">D</button>
      </div>
      <div id="debugPanel" class="debug-panel" hidden></div>
      <div class="start-panel" id="startPanel">
        <h1>The Legend of &Ouml;tzi the Iceman</h1>
        <p>Canvas 2D survival adventure engine shell.</p>
        <button id="startBtn" type="button">Start / Audio Unlock</button>
      </div>
      <div class="controls" id="controls">
        <div class="stick-zone" id="moveZone" aria-label="MOVE joystick">
          <div class="stick-label">MOVE</div>
          <div class="stick-base"><div class="stick-knob" id="stickKnob"></div></div>
        </div>
        <div class="aim-strip" id="aimStrip" aria-label="AIM strip">AIM</div>
        <div class="action-cluster">
          <button id="useBtn" type="button">USE<br>GATHER</button>
          <button id="sprintBtn" type="button">DODGE<br>SPRINT</button>
          <button id="menuBtn" type="button">CRAFT<br>MENU</button>
        </div>
      </div>
      <button id="mapTab" type="button" aria-label="Trail map">MAP</button>
    `;
    this.startPanel = document.getElementById("startPanel");
    this.startBtn = document.getElementById("startBtn");
    this.debugBtn = document.getElementById("debugBtn");
    this.debugPanel = document.getElementById("debugPanel");
    this.statusLine = document.getElementById("statusLine");
    this.moveZone = document.getElementById("moveZone");
    this.stickKnob = document.getElementById("stickKnob");
    this.aimStrip = document.getElementById("aimStrip");
    this.useBtn = document.getElementById("useBtn");
    this.sprintBtn = document.getElementById("sprintBtn");
    this.menuBtn = document.getElementById("menuBtn");
    this.mapTab = document.getElementById("mapTab");
  }
};
