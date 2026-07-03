import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");

const modules = [
  "config.js",
  "dom.js",
  "rng.js",
  "viewport.js",
  "input.js",
  "action-map.js",
  "audio.js",
  "assets.js",
  "tilemap.js",
  "world-grid.js",
  "worldgen.js",
  "entities.js",
  "resources.js",
  "survival.js",
  "fullscreen.js",
  "collision.js",
  "camera.js",
  "scenes.js",
  "dialogue.js",
  "inventory.js",
  "crafting.js",
  "village.js",
  "facts.js",
  "objectives.js",
  "render-world.js",
  "render-ui.js",
  "debug.js",
  "save.js",
  "test-hooks.js",
  "main.js"
];

const css = `
:root { color-scheme: dark; --ink:#f3ead7; --muted:#c1b69f; --line:#384338; --accent:#e7bd6c; --green:#8fc0a9; }
* { box-sizing: border-box; }
html, body { margin:0; width:100%; height:100%; overflow:hidden; background:#050706; color:var(--ink); font:14px/1.4 system-ui,-apple-system,Segoe UI,sans-serif; }
body { overscroll-behavior:none; }
#app { position:fixed; inset:0; width:100vw; height:100dvh; max-width:none; transform:none; padding:env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left); display:grid; grid-template-rows:minmax(0,1fr) auto auto auto auto; grid-template-areas:"game" "objective" "popupbar" "controls" "stats"; touch-action:none; user-select:none; -webkit-user-select:none; background:#080b0a; }
#worldCanvas { position:absolute; inset:0; display:block; width:100%; height:100%; min-height:0; image-rendering:pixelated; background:#102016; }
#uiRoot { display:contents; pointer-events:none; }
button { pointer-events:auto; border:1px solid rgba(243,234,215,.24); border-radius:8px; background:#1d251f; color:var(--ink); font-weight:800; min-width:44px; min-height:44px; }
.game-shell { grid-area:game; position:relative; width:100%; min-width:0; max-width:100%; min-height:0; overflow:hidden; pointer-events:none; }
.start-panel { position:absolute; inset:0; display:grid; place-content:center; gap:12px; padding:24px; text-align:center; background:linear-gradient(180deg,rgba(8,11,10,.84),rgba(8,11,10,.54)); pointer-events:auto; z-index:5; }
.start-panel[hidden] { display:none; }
.start-panel h1 { margin:0; font-size:clamp(28px,8vw,52px); letter-spacing:0; }
.start-panel p { margin:0; color:var(--muted); }
#startBtn { padding:12px 18px; background:#513d1e; border-color:#a88345; }
.objective-bar { grid-area:objective; width:100%; min-width:0; display:grid; grid-template-columns:auto minmax(0,1fr); gap:8px; padding:7px 10px; border-top:1px solid rgba(243,234,215,.12); border-bottom:1px solid rgba(0,0,0,.42); background:linear-gradient(180deg,#0e140f,#0a0f0c); pointer-events:none; }
.objective-tag { align-self:start; padding:4px 6px; border:1px solid rgba(231,189,108,.34); border-radius:8px; color:#f0c666; background:rgba(30,21,12,.45); font:900 10px ui-monospace,Consolas,monospace; white-space:nowrap; }
.objective-copy { min-width:0; display:grid; gap:1px; }
.objective-copy strong { color:#f4ebd8; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.objective-copy span { color:#d5c9b4; font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.popup-bar { grid-area:popupbar; width:100%; min-width:0; display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; padding:8px 10px; border-top:1px solid rgba(243,234,215,.16); border-bottom:1px solid rgba(0,0,0,.48); background:linear-gradient(180deg,#101711,#0b110d); pointer-events:auto; }
.popup-bar button { height:44px; background:#142820; border-color:rgba(143,192,169,.5); }
.stats-strip { grid-area:stats; width:100%; min-width:0; min-height:42px; display:grid; grid-template-columns:auto auto auto auto minmax(0,1fr) 44px; align-items:center; gap:6px; padding:6px 8px max(6px,env(safe-area-inset-bottom)); border-top:1px solid rgba(243,234,215,.14); background:#070a08; pointer-events:auto; }
.stat-chip { padding:4px 6px; border:1px solid rgba(143,192,169,.4); border-radius:8px; background:rgba(9,18,14,.72); color:#c7f0dc; font:800 11px ui-monospace,Consolas,monospace; white-space:nowrap; }
.status-line { min-width:0; color:#ffe3a5; font-weight:800; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
#debugBtn { width:46px; }
.debug-panel { grid-area:stats; align-self:start; justify-self:stretch; margin:3px 56px 0 8px; padding:5px 8px; border:1px solid rgba(231,189,108,.35); border-radius:8px; background:rgba(0,0,0,.78); color:#ffe6a8; font:10px ui-monospace,Consolas,monospace; pointer-events:none; z-index:6; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.area-card { position:absolute; left:8px; top:8px; width:min(220px,calc(100vw - 24px)); padding:8px 10px; border:1px solid rgba(231,189,108,.46); border-radius:8px; background:rgba(0,0,0,.68); box-shadow:0 10px 30px rgba(0,0,0,.25); z-index:4; }
.area-card[hidden] { display:none; }
.area-card p { margin:0; color:#f0e3c3; font-size:11px; }
.minimap-panel { position:absolute; right:8px; top:56px; width:136px; padding:8px; border:1px solid rgba(143,192,169,.45); border-radius:8px; background:rgba(5,12,9,.86); box-shadow:0 10px 30px rgba(0,0,0,.32); pointer-events:none; z-index:3; }
.minimap-panel[hidden] { display:none; }
.minimap-panel canvas { display:block; width:120px; height:120px; border:1px solid rgba(243,234,215,.16); image-rendering:pixelated; }
.map-legend { margin-top:6px; display:grid; gap:3px; color:#d9d1bd; font:700 10px ui-monospace,Consolas,monospace; }
.map-legend div { display:grid; grid-template-columns:16px minmax(0,1fr); gap:6px; }
.inventory-panel { position:absolute; left:8px; top:56px; width:min(180px,calc(100vw - 18px)); padding:8px; border:1px solid rgba(143,192,169,.45); border-radius:8px; background:rgba(5,12,9,.86); box-shadow:0 10px 30px rgba(0,0,0,.32); pointer-events:none; z-index:3; }
.inventory-panel[hidden] { display:none; }
.inventory-panel dl { margin:0; display:grid; gap:4px; }
.inventory-panel dl div { display:flex; justify-content:space-between; gap:12px; border-bottom:1px solid rgba(243,234,215,.1); padding-bottom:3px; }
.inventory-panel dt { color:var(--muted); }
.inventory-panel dd { margin:0; font-weight:900; }
.panel-title { margin:0 0 5px; color:#e7bd6c; font-size:11px; font-weight:900; letter-spacing:.06em; }
.menu-panel { position:fixed; left:50%; top:45%; transform:translate(-50%,-50%); width:min(340px,calc(100vw - 28px)); padding:14px; border:1px solid rgba(231,189,108,.5); border-radius:8px; background:rgba(12,15,13,.94); box-shadow:0 20px 70px rgba(0,0,0,.55); pointer-events:auto; z-index:10; }
.menu-panel[hidden] { display:none; }
.welcome-panel { top:40%; }
.menu-panel p { margin:4px 0 12px; color:var(--ink); }
.menu-panel dl { margin:0 0 12px; display:grid; gap:6px; }
.menu-panel dl div { display:flex; justify-content:space-between; gap:16px; border-bottom:1px solid rgba(243,234,215,.1); padding-bottom:4px; }
.menu-panel dt { color:var(--muted); }
.menu-panel dd { margin:0; font-weight:800; }
.menu-panel button { width:100%; background:#513d1e; border-color:#a88345; }
.menu-panel button + button { margin-top:8px; }
.controls { grid-area:controls; position:relative; width:100%; min-width:0; max-width:100%; min-height:172px; height:min(28dvh,224px); padding:12px 10px; border-top:1px solid rgba(243,234,215,.16); background:linear-gradient(180deg,#111812,#070a08); pointer-events:none; }
.stick-zone { position:absolute; left:16px; top:26px; width:132px; height:132px; pointer-events:auto; touch-action:none; }
.stick-label { position:absolute; left:0; top:-20px; color:var(--muted); font-size:11px; font-weight:800; }
.stick-base { position:absolute; inset:10px; border:2px solid rgba(243,234,215,.25); border-radius:50%; background:rgba(11,16,13,.56); }
.stick-knob { position:absolute; left:50%; top:50%; width:46px; height:46px; margin:-23px 0 0 -23px; border-radius:50%; background:var(--accent); box-shadow:0 7px 20px rgba(0,0,0,.4); }
.action-cluster { position:absolute; right:14px; top:22px; display:grid; grid-template-columns:86px 86px; gap:8px; pointer-events:auto; }
.action-cluster button { height:58px; font-size:12px; }
#useBtn { background:#513d1e; border-color:#a88345; }
#sprintBtn { background:#263228; border-color:rgba(243,234,215,.22); }
@media (min-width: 900px) and (pointer: fine) { #app { left:50%; right:auto; transform:translateX(-50%); width:min(100vw,520px); box-shadow:0 0 0 1px rgba(243,234,215,.08), 0 0 42px rgba(0,0,0,.55); } .controls { min-height:188px; } .stick-zone { left:calc(50% - 250px); } .action-cluster { right:calc(50% - 250px); } }
@media (orientation: landscape) {
  .objective-bar { padding:4px 8px; gap:6px; }
  .objective-tag { font-size:9px; padding:3px 4px; }
  .objective-copy strong { font-size:10px; }
  .objective-copy span { font-size:9px; }
  .stats-strip { min-height:38px; grid-template-columns:auto auto auto auto minmax(0,1fr) 40px; gap:4px; padding:4px 6px max(4px,env(safe-area-inset-bottom)); overflow:hidden; }
  .stat-chip { font-size:9px; padding:3px 4px; }
  .status-line { display:none; }
  .popup-bar { padding:5px 8px; gap:6px; }
  .popup-bar button { height:38px; min-height:38px; }
  .controls { min-height:118px; height:118px; padding:8px 8px; }
  .stick-zone { left:10px; top:20px; width:88px; height:88px; }
  .stick-label { top:-16px; font-size:10px; }
  .stick-knob { width:34px; height:34px; margin:-17px 0 0 -17px; }
  .action-cluster { right:8px; top:16px; grid-template-columns:68px 68px; gap:6px; }
  .action-cluster button { height:46px; font-size:10px; }
}
`;

const js = modules.map((file) => {
  const full = path.join(src, file);
  if (!fs.existsSync(full)) throw new Error(`Missing module: ${file}`);
  return `\n/* MODULE: ${file} */\n${fs.readFileSync(full, "utf8")}`;
}).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>The Legend of &Ouml;tzi the Iceman</title>
  <style>${css}</style>
</head>
<body>
  <div id="app">
    <canvas id="worldCanvas" aria-label="The Legend of &Ouml;tzi the Iceman game world"></canvas>
    <div id="uiRoot"></div>
  </div>
  <script>
/* AI-SAFE SINGLE-FILE CONSTITUTION
   Named section edits only in src modules.
   INPUT -> ACTIONS -> SIMULATION -> RENDER one-way flow.
   Render must not mutate gameplay state.
   No runtime external dependencies.
   SAVE_VERSION changes require migration.
   Test harness is exposed only as window.__OTZI_TEST__.
*/
${js}
  </script>
  <!-- build: ${new Date().toISOString()} modules:${modules.length} -->
</body>
</html>
`;

const externalPattern = /<(script|link|img|audio|video|source)\b[^>]*(src|href)=["']https?:\/\//i;
if (externalPattern.test(html)) throw new Error("External runtime URL detected");
if (/\beval\s*\(/.test(html)) throw new Error("eval detected");
if (/\son[a-z]+\s*=/.test(html)) throw new Error("inline event handler detected");

fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, "index.html"), html, "utf8");
console.log(`Built dist/index.html (${html.length} bytes)`);
