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
  "worldgen.js",
  "entities.js",
  "resources.js",
  "survival.js",
  "collision.js",
  "camera.js",
  "scenes.js",
  "dialogue.js",
  "inventory.js",
  "crafting.js",
  "village.js",
  "facts.js",
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
#app { position:fixed; top:0; bottom:0; left:50%; transform:translateX(-50%); width:min(100vw, calc(100dvh * .48), 420px); height:100dvh; padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); display:grid; grid-template-rows:minmax(0,1fr) auto auto; grid-template-areas:"game" "hud" "controls"; touch-action:none; user-select:none; -webkit-user-select:none; background:#080b0a; box-shadow:0 0 0 1px rgba(243,234,215,.08), 0 0 42px rgba(0,0,0,.55); }
#worldCanvas { position:absolute; inset:0; display:block; width:100%; height:100%; min-height:0; image-rendering:pixelated; background:#102016; }
#uiRoot { display:contents; pointer-events:none; }
button { pointer-events:auto; border:1px solid rgba(243,234,215,.24); border-radius:8px; background:#1d251f; color:var(--ink); font-weight:800; min-width:44px; min-height:44px; }
.game-shell { grid-area:game; position:relative; width:100%; min-width:0; max-width:100%; min-height:0; overflow:hidden; pointer-events:none; }
.start-panel { position:absolute; inset:0; display:grid; place-content:center; gap:12px; padding:24px; text-align:center; background:linear-gradient(180deg,rgba(8,11,10,.84),rgba(8,11,10,.54)); pointer-events:auto; z-index:5; }
.start-panel[hidden] { display:none; }
.start-panel h1 { margin:0; font-size:clamp(28px,8vw,52px); letter-spacing:0; }
.start-panel p { margin:0; color:var(--muted); }
#startBtn { padding:12px 18px; background:#513d1e; border-color:#a88345; }
.hud-strip { grid-area:hud; width:100%; min-width:0; max-width:100%; min-height:54px; display:grid; grid-template-columns:auto auto minmax(0,1fr) 52px 48px; align-items:center; gap:8px; padding:8px 10px; border-top:1px solid rgba(243,234,215,.18); border-bottom:1px solid rgba(0,0,0,.45); background:linear-gradient(180deg,#111812,#0b110d); pointer-events:auto; }
.stat-chip { padding:5px 8px; border:1px solid rgba(143,192,169,.4); border-radius:8px; background:rgba(9,18,14,.72); color:#c7f0dc; font:800 12px ui-monospace,Consolas,monospace; white-space:nowrap; }
#inventoryChip { white-space:normal; line-height:1.12; max-width:260px; }
.status-line { min-width:0; color:#ffe3a5; font-weight:800; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
#mapTab { width:52px; min-width:52px; height:42px; min-height:42px; background:#142820; border-color:rgba(143,192,169,.5); }
#debugBtn { width:46px; }
.debug-panel { grid-area:hud; align-self:end; justify-self:stretch; margin:0 10px 3px; padding:5px 8px; border:1px solid rgba(231,189,108,.35); border-radius:8px; background:rgba(0,0,0,.74); color:#ffe6a8; font:10px ui-monospace,Consolas,monospace; pointer-events:none; z-index:6; }
.minimap-panel { position:absolute; right:8px; top:56px; width:120px; padding:6px; border:1px solid rgba(143,192,169,.45); border-radius:8px; background:rgba(5,12,9,.82); box-shadow:0 10px 30px rgba(0,0,0,.32); pointer-events:none; z-index:3; }
.minimap-panel[hidden] { display:none; }
.minimap-panel canvas { display:block; width:104px; height:104px; border:1px solid rgba(243,234,215,.16); image-rendering:pixelated; }
.panel-title { margin:0 0 5px; color:#e7bd6c; font-size:11px; font-weight:900; letter-spacing:.06em; }
.menu-panel { position:fixed; left:50%; top:45%; transform:translate(-50%,-50%); width:min(340px,calc(100vw - 28px)); padding:14px; border:1px solid rgba(231,189,108,.5); border-radius:8px; background:rgba(12,15,13,.94); box-shadow:0 20px 70px rgba(0,0,0,.55); pointer-events:auto; z-index:10; }
.menu-panel[hidden] { display:none; }
.menu-panel p { margin:4px 0 12px; color:var(--ink); }
.menu-panel dl { margin:0 0 12px; display:grid; gap:6px; }
.menu-panel dl div { display:flex; justify-content:space-between; gap:16px; border-bottom:1px solid rgba(243,234,215,.1); padding-bottom:4px; }
.menu-panel dt { color:var(--muted); }
.menu-panel dd { margin:0; font-weight:800; }
.menu-panel button { width:100%; background:#513d1e; border-color:#a88345; }
.menu-panel button + button { margin-top:8px; }
.controls { grid-area:controls; position:relative; width:100%; min-width:0; max-width:100%; min-height:180px; height:min(29dvh,232px); padding:12px 10px max(12px,env(safe-area-inset-bottom)); border-top:1px solid rgba(243,234,215,.16); background:linear-gradient(180deg,#111812,#070a08); pointer-events:none; }
.stick-zone { position:absolute; left:16px; top:26px; width:132px; height:132px; pointer-events:auto; touch-action:none; }
.stick-label { position:absolute; left:0; top:-20px; color:var(--muted); font-size:11px; font-weight:800; }
.stick-base { position:absolute; inset:10px; border:2px solid rgba(243,234,215,.25); border-radius:50%; background:rgba(11,16,13,.56); }
.stick-knob { position:absolute; left:50%; top:50%; width:46px; height:46px; margin:-23px 0 0 -23px; border-radius:50%; background:var(--accent); box-shadow:0 7px 20px rgba(0,0,0,.4); }
.action-cluster { position:absolute; right:14px; top:22px; display:grid; grid-template-columns:86px 86px; gap:8px; pointer-events:auto; }
.action-cluster button { height:58px; font-size:12px; }
#useBtn { grid-column:span 2; background:#513d1e; border-color:#a88345; }
@media (min-width: 720px) { .controls { min-height:188px; } .stick-zone { left:calc(50% - 250px); } .action-cluster { right:calc(50% - 250px); } }
@media (orientation: landscape) {
  #app { width:min(100vw, calc(100dvh * .46), 360px); }
  #inventoryChip, #staminaChip { max-height:38px; overflow:hidden; font-size:8px; line-height:1.05; padding:4px 5px; }
  #inventoryChip { max-width:82px; }
  .hud-strip { min-height:46px; max-height:50px; grid-template-columns:minmax(0,1fr) minmax(0,1fr) 0 48px 44px; gap:5px; padding:4px 7px; overflow:hidden; }
  .status-line { display:none; }
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
