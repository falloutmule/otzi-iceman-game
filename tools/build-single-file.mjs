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
html, body { margin:0; width:100%; height:100%; overflow:hidden; background:#080b0a; color:var(--ink); font:14px/1.4 system-ui,-apple-system,Segoe UI,sans-serif; }
body { overscroll-behavior:none; }
#app { position:fixed; inset:0; width:100vw; height:100dvh; padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); touch-action:none; user-select:none; -webkit-user-select:none; background:#080b0a; }
#worldCanvas { display:block; width:100%; height:100%; image-rendering:pixelated; background:#102016; }
#uiRoot { position:absolute; inset:0; pointer-events:none; }
button { pointer-events:auto; border:1px solid rgba(243,234,215,.24); border-radius:8px; background:#1d251f; color:var(--ink); font-weight:800; min-width:44px; min-height:44px; }
.topbar { position:absolute; left:10px; right:10px; top:10px; display:flex; justify-content:space-between; gap:10px; align-items:flex-start; pointer-events:none; text-shadow:0 2px 8px #000; }
.topbar span { display:block; color:var(--muted); font-size:12px; }
.topbar button { pointer-events:auto; width:46px; }
.start-panel { position:absolute; inset:0; display:grid; place-content:center; gap:12px; padding:24px; text-align:center; background:linear-gradient(180deg,rgba(8,11,10,.84),rgba(8,11,10,.54)); pointer-events:auto; }
.start-panel[hidden] { display:none; }
.start-panel h1 { margin:0; font-size:clamp(28px,8vw,52px); letter-spacing:0; }
.start-panel p { margin:0; color:var(--muted); }
#startBtn { padding:12px 18px; background:#513d1e; border-color:#a88345; }
.debug-panel { position:absolute; left:10px; right:10px; top:62px; padding:6px 8px; border:1px solid rgba(231,189,108,.35); background:rgba(0,0,0,.56); color:#ffe6a8; font:11px ui-monospace,Consolas,monospace; pointer-events:none; }
.controls { position:absolute; left:0; right:0; bottom:0; height:min(31dvh,230px); min-height:164px; pointer-events:none; }
.stick-zone { position:absolute; left:16px; bottom:16px; width:132px; height:132px; pointer-events:auto; touch-action:none; }
.stick-label { position:absolute; left:0; top:-20px; color:var(--muted); font-size:11px; font-weight:800; }
.stick-base { position:absolute; inset:10px; border:2px solid rgba(243,234,215,.25); border-radius:50%; background:rgba(11,16,13,.56); }
.stick-knob { position:absolute; left:50%; top:50%; width:46px; height:46px; margin:-23px 0 0 -23px; border-radius:50%; background:var(--accent); box-shadow:0 7px 20px rgba(0,0,0,.4); }
.aim-strip { position:absolute; right:8px; bottom:112px; width:48px; height:104px; display:grid; place-items:center; border:1px solid rgba(143,192,169,.45); color:var(--green); background:rgba(12,22,18,.58); writing-mode:vertical-rl; font-weight:900; pointer-events:auto; touch-action:none; }
.action-cluster { position:absolute; right:10px; bottom:14px; display:grid; grid-template-columns:80px 80px; gap:8px; pointer-events:auto; }
.action-cluster button { height:58px; font-size:12px; }
#useBtn { grid-column:span 2; background:#513d1e; border-color:#a88345; }
#mapTab { position:absolute; right:10px; top:92px; width:58px; height:44px; background:#142820; border-color:rgba(143,192,169,.5); }
@media (min-width: 720px) { .controls { max-width:520px; left:50%; transform:translateX(-50%); } }
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
