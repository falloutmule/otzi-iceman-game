# Custom Canvas 2D Engine Field Manual for The Legend of Ötzi the Iceman

## Executive recommendation

Build a **custom Canvas 2D engine with DOM/CSS overlays**, not Phaser as the shipped runtime. Phaser is excellent as a reference because its Scene abstraction already bundles the exact categories that matter for a mid-sized 2D game—display list, update loop, cameras, input handling, loader, scale manager, sound, events, caches, and a shared registry—but those same systems also illustrate why it is oversized for a strict one-file, no-runtime-dependency release. Official Phaser materials describe Scenes as the fundamental unit, each with their own display list, update loop, cameras, input, and loader, while Phaser’s global Systems surface cameras, input, textures, cache, sound, plugins, scale, and renderer from every scene. The Phaser repository also states that the full minified build is hundreds of kilobytes gzipped, even before your game code and inlined assets are added; custom builds can shrink that, but they still push you toward a framework-shaped architecture rather than a game-shaped one. For a portrait mobile-first adventure/survival game that must later collapse to one `index.html`, a narrower custom engine gives you smaller release size, clearer ownership boundaries for AI edits, easier smoke testing, and fewer hidden interactions during save/load, scaling, and input refactors. citeturn14view0turn14view2turn14view1turn15search0turn15search5turn36search2turn36search4

The best architecture for this project is therefore a **hybrid**: Canvas 2D renders the world, particles, weather, minimap, and debug geometry; DOM/CSS handles start screens, settings, fact dialogue, inventory, crafting, save import/export, accessibility controls, and test panels. That split aligns with modern browser ergonomics. Canvas remains the most direct way to render a scrolling tile world, while DOM is better for readable text, focusable controls, assistive technology hooks, and mobile-safe menu layouts. MDN’s platform guidance also supports this direction: `requestAnimationFrame()` is the right frame clock, `visualViewport` exists precisely for visible-viewport changes on mobile, dynamic viewport units such as `dvh` track browser UI changes better than legacy `vh`, safe-area environment variables exist for cutouts, and `requestFullscreen()` remains limited enough across widely used browsers that fullscreen should be treated as an enhancement, not a core layout assumption. citeturn21view10turn22view5turn21view7turn21view8turn21view4

My final recommendation for this game is:

| Decision area | Recommendation | Why |
|---|---|---|
| Runtime | **Custom Canvas 2D engine** | Keeps the shipped artifact inspectable, lean, and easy to merge into one HTML file |
| UI | **DOM/CSS overlay** | Better dialogue, inventory, settings, accessibility, and debug controls |
| Development workflow | **Split source during development, merge for release** | Much safer for Hermes/Codex than editing a monolith during active iteration |
| Map model | **Chunked typed-array tile layers + sparse object/trigger lists** | Compact, cacheable, save-friendly, and procedural-generation-friendly |
| Asset strategy | **Procedural placeholders + tiny generated atlases + optional tiny embedded sheets** | Avoids runtime asset fetches and keeps the project legally and technically self-contained |
| Save strategy | **Versioned JSON + `localStorage` + export/import string fallback** | Needed because `file:` handling for `localStorage` is undefined and may throw `SecurityError` |
| Mobile layout | **Portrait-first shell using `100dvh`, safe-area padding, and `visualViewport` hooks** | Best fit for Android Chrome’s dynamic browser UI and modern cutout devices |


## Reference engines and extracted patterns

**Phaser** is worth mining for patterns, not shipping wholesale. The specific parts to recreate are its scene lifecycle, a scale manager that distinguishes CSS size from logical game size, unified input abstraction, per-scene cameras, and shared caches for reusable visual or audio resources. Phaser’s Scale Manager explicitly distinguishes the canvas element’s intrinsic dimensions from its CSS dimensions, which is precisely the distinction you need for a pixel-art portrait game that must avoid blur and broken collision after resize. Phaser’s camera deadzone concept is also worth reusing for a top-down adventure because it reduces perceived jitter in narrow portrait layouts by letting the player move within a region before the camera scrolls. Tilemap ideas worth borrowing are a separate non-display map data store and runtime-modifiable layers. What not to borrow is the loader-driven asset mindset, plugin sprawl, or framework-wide global managers you do not need. citeturn14view1turn15search1turn15search5turn15search10turn15search9

**BrowserQuest** still teaches one durable lesson: separate **terrain/render layers**, **collision cells**, and **semantic/entity spawn data**. Its map tooling generated distinct client and server files, and the exported map data explicitly included terrain tile layers, collision cells, doors, music areas, and spawn data. That is outdated for a single-player single-file game because the client/server split and WebSocket-heavy model are unnecessary, but the semantic split itself is still excellent. Also still useful is its admission that mobile support was more experimental than desktop in the original project; for your game, that is a reminder to design for mobile from the first prototype rather than treating it as a later compatibility pass. citeturn14view3turn18view0

**Solarus** is the best architecture reference for action-adventure semantics. Three ideas are especially valuable. First, the hero belongs more to the **game/session** than to a single map, which suggests your player object should survive scene and area transitions and be serialized from a single canonical save state. Second, maps can carry **multiple layers**, allowing bridges, canopies, or under/over relationships without moving to full 3D. Third, containers and interactables can bind directly to **savegame variables**, which is the simplest pattern for chests, harvested nodes, story gates, or opened dungeon exits in a single-player game. citeturn14view5turn14view6turn14view7

**ZQuest Classic / Zelda Classic** are useful as editor-thinking references, not as content references. The enduring ideas are screen and room semantics, boolean flag arrays, trigger conditions tied to specific locations, and scripts that operate on a current screen context. Its newer docs and release materials show a move toward more inspectable boolean screen flags, trigger/button conditions, and screen-based scripts that run with clear ownership rules. For your game, the lesson is not “copy room logic”; it is “make semantic flags visible, named, testable, and map-local where possible.” That is exactly what a top-down overworld/dungeon engine needs for harvest nodes, one-way exits, village unlocks, and triggered fact dialogues. citeturn14view8turn20search1turn20search3turn20search5

Two smaller modern references are also useful. **LittleJS** demonstrates that a compact engine can still expose a clean, AI-friendly API, support particles, touch input, tile collisions, and generated sounds, while **Litecanvas** shows a very small canvas-first API with string-defined sprites, generated images, basic touch hooks, and tests. Those projects are not the runtime base I would ship here, but they validate the idea that a custom engine can remain both readable and capable if the API surface is intentionally narrow. citeturn19view0turn34view0


## Engine architecture

The engine should be written as a **small set of named modules with explicit ownership rules**. Borrow the *category split* from Phaser, the *semantic layer split* from BrowserQuest, the *game-owned hero and save flags* from Solarus, and the *screen/trigger semantics* from ZQuest. Then compress all of that into a strict custom layout that AI agents can modify safely. citeturn14view0turn14view1turn14view2turn14view3turn14view5turn14view6turn20search5

The module map below is the right starting point for Ötzi. Each module owns a narrow slice of data and exposes a small public API. The most important rule is that **rendering code never mutates simulation state**, **input code never moves entities directly**, and **save code never serializes ephemeral caches**.

| Module | Responsibility | Public API | Owns | Must not mutate | Common AI-agent failure mode | Minimum tests |
|---|---|---|---|---|---|---|
| `BOOT` | DOM startup, event wiring, initial scene mount | `initApp()` | boot flags, startup timing | world state | boot side effects scattered into other modules | page loads, start button exists, no console errors |
| `CONFIG` | Tunables, constants, key names, version numbers | `CFG` object | static constants | runtime state | magic numbers reintroduced elsewhere | config snapshot checksum |
| `VIEWPORT` | canvas size, DPR, CSS sizing, portrait shell, safe areas | `resize()`, `getViewport()` | CSS size, backing size, DPR cap | scene data | CSS size/backing buffer drift | canvas CSS/backing match after resize |
| `INPUT` | raw Pointer/keyboard/gamepad collection | `beginFrame()`, `endFrame()`, `onPointer*()` | pointer registry, key state | player/entity state | direct player mutation in event handlers | pointercancel reset, multitouch, joystick drag-off |
| `ACTION_MAP` | map raw input to semantic actions | `sampleActions()` | action state | DOM, entities | desktop/mobile divergence | move, interact, craft, sprint actions fire correctly |
| `RNG` | deterministic seeded randomness | `seed()`, `next()`, `range()`, `pick()` | seed, stream counters | world/entities except through callers | hidden `Math.random()` use | same seed same world hash |
| `SAVE` | versioned save/load and migration | `save()`, `load()`, `exportString()`, `importString()` | schema version, migrations | caches, canvases, live DOM | serializing transient fields | load/save round-trip |
| `AUDIO` | one `AudioContext`, mixer, procedural SFX | `unlock()`, `play(id)`, `setVolume()` | context, buses, mute state | gameplay progression | autoplay assumptions, gain clicks | gesture unlock, mute persistence |
| `ASSET_GENERATION` | procedural sprites, atlases, icons, palettes | `buildAtlas(theme)` | generated canvases/images | world state | regeneration every frame | atlas exists, no network requests |
| `TILEMAP` | chunk data, tile layers, semantic flags | `getTile()`, `setTile()`, `queryCell()` | chunks, layers, flags | entity arrays except through API | mixing render and semantic layers | chunk lookup, walkability, object flags |
| `WORLDGEN` | seeded region generation and validation | `genRegion()`, `validateRegion()` | templates, region deltas | player inventory/save directly | nondeterministic generation | seed reproducibility, guaranteed path |
| `ENTITIES` | lifecycle and storage for live actors/props | `spawn()`, `updateAll()`, `forEachVisible()` | entity table, free lists | tilemap except through collision/interact APIs | giant switch doing everything | player/NPC/deer/projectile lifecycle |
| `COLLISION` | movement resolution and interaction checks | `moveEntity()`, `overlaps()`, `raycastTiles()` | scratch buffers | renderer | stale AABB/grid mismatch | tree/wall blocking, item pickup |
| `CAMERA` | world-to-screen transform and follow rules | `updateCamera()`, `worldToScreen()` | camera pos, zoom, shake | player physics | smoothing tied to draw rate | player centered, shake decay |
| `SCENES` | mode transitions and lifecycle | `goto(name)`, `updateScene()`, `renderScene()` | scene stack, fade state | subsystem internals | cross-scene leakage | title→game→dungeon→dialog transitions |
| `DIALOGUE` | fact dialogue, choices, pacing | `openFact(id)`, `advance()` | active dialogue state | save directly except via exposed completion hooks | direct DOM mutations from NPC code | open/advance/close, fact unlock |
| `INVENTORY` | item slots, counts, equip state | `add()`, `remove()`, `equip()` | item stacks, equip refs | worldgen/collision internals | duplicate item schemas | gather updates inventory |
| `CRAFTING` | recipes and outputs | `canCraft()`, `craft()` | recipe tables | renderer | recipe logic hardcoded in UI | craft valid/invalid recipe |
| `VILLAGE` | unlocks, passive yields, workstation states | `unlockBuilding()`, `tickVillage()` | building flags, passive timers | entity core | overbuilding into sim colony | dungeon unlock creates building |
| `QUEST_FACTS` | verified/plausible/fictional content registry | `getFact()`, `markDiscovered()` | fact DB, discovered set | renderer | mixing narrative text into code | schema validation, source presence |
| `RENDER_WORLD` | canvas drawing for world and FX | `renderWorld()` | render caches, layer order | simulation | mutating live entities during draw | draw order, fog, particles |
| `RENDER_UI` | DOM overlays + optional canvas HUD | `renderHUD()`, `syncPanels()` | UI state mirror | core data except via intent callbacks | widget state diverges from save | inventory/dialog/settings visible and stable |
| `DEBUG` | overlays, cheats, perf counters | `toggleDebug()`, `drawDebug()` | debug flags, frame stats | save unless explicitly commanded | debug paths leaking into release | overlay renders, benchmark mode |
| `TEST_HOOKS` | deterministic hooks for Playwright/Hermes | `window.__OTZI_TEST__` | stable façade only | internal implementation details | tests reaching through private internals | all smoke hooks callable |
| `BUILD_PACKAGE` | merge/inlining for release | `node tools/build-single-file.mjs` | build metadata | runtime | AI edits minified output | dist has no external requests |

A starter source skeleton should look like this:

```html
<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport"
        content="width=device-width,initial-scale=1,viewport-fit=cover,interactive-widget=resizes-content">
  <title>The Legend of Ötzi the Iceman</title>
  <style>
    html, body { margin:0; height:100%; overflow:hidden; background:#111; }
    body { overscroll-behavior:none; }
    #app {
      position:fixed; inset:0;
      width:100vw; height:100dvh;
      padding:
        env(safe-area-inset-top)
        env(safe-area-inset-right)
        env(safe-area-inset-bottom)
        env(safe-area-inset-left);
      box-sizing:border-box;
      touch-action:none;
      user-select:none;
      -webkit-user-select:none;
    }
    #gameCanvas {
      display:block;
      width:100%;
      height:100%;
      image-rendering:pixelated;
    }
    #uiRoot { position:absolute; inset:0; pointer-events:none; }
    .panel, button { pointer-events:auto; }
  </style>
</head>
<body>
  <div id="app">
    <canvas id="gameCanvas"></canvas>
    <div id="uiRoot"></div>
  </div>
  <script>
    /* ==== AI-SAFE CONSTITUTION ====
       1) Edit named modules only.
       2) RENDER_* never mutates simulation.
       3) INPUT collects raw state; ACTION_MAP decides intent.
       4) SAVE serializes schema version + durable data only.
       5) Every visual change needs screenshot proof.
       6) Every state/schema change needs smoke tests.
       7) Never introduce external runtime dependencies.
    ================================= */

    const CFG = { SAVE_VERSION: 1, DPR_CAP: 2, TILE: 16, FIXED_DT: 1000/60 };
    const APP = {};
    // MODULES: VIEWPORT, INPUT, ACTION_MAP, RNG, SAVE, AUDIO, ...
  </script>
</body>
</html>
```

This shell reflects current platform behavior: `dvh` tracks dynamic viewport height better than old `vh`, `viewport-fit=cover` should be paired with safe-area insets, `interactive-widget=resizes-content` tells mobile browsers how the layout should react to keyboards, `touch-action` controls browser gesture handling, and `requestFullscreen()` cannot be assumed to work uniformly enough to be your only “app-like” strategy. citeturn21view7turn21view8turn35view0turn21view1turn21view4


## Rendering, world model, and gameplay systems

For **Ötzi**, the right renderer is a **single visible world canvas plus offscreen caches**, not multiple visible world canvases. A single visible canvas keeps input hit testing, resize logic, and AI refactors simpler. Use offscreen canvases for **static chunk prerenders**, **generated sprite atlases**, **weather masks**, and **minimap snapshots**. MDN explicitly recommends prerendering repeated primitives to offscreen canvases, reducing unnecessary scaling, and turning off transparency with `{ alpha:false }` when an opaque backdrop is acceptable. Make that the default here. Only add a second visible canvas later if profiling proves that a dedicated FX layer materially helps. citeturn21view9turn28search14turn28search7turn28search5turn29search7

The world model should be **chunked, typed, semantic, and delta-saveable**. I recommend 32×32-tile chunks with four principal layers: `ground`, `objects`, `semantics`, and `discover`. Ground and object layers should be `Uint16Array`s for cache locality; semantics should be a bit-packed `Uint32Array` or compact flag array; dynamic objects such as NPCs, nodes, doors, fires, and triggers should live in sparse per-chunk lists. This is the BrowserQuest lesson, simplified: separate what is drawn from what blocks, triggers, or spawns. Solarus and ZQuest both reinforce this semantic separation with layered maps, save-bound container/open flags, and explicit screen-local logic. Your save file should therefore store **world seed + engine version + player/village progression + discovered chunks + mutated chunk deltas**, not a giant serialized copy of the full generated world. citeturn14view3turn14view6turn14view7turn20search1turn20search5

The final rendering recommendation for this specific game is:

| Area | Recommendation for Ötzi | Reason |
|---|---|---|
| Visible world | **One main Canvas 2D** | Simplest ownership and resize path |
| Static terrain | **Chunk prerender cache** | Forest/village ground does not need per-frame redraw cost beyond blitting |
| Dynamic entities | **Immediate draw every frame** | Easier for combat, hunting, pickups, and weather |
| Weather and vignettes | **Screen-space overlays** | Cheapest way to sell cold, wetness, and danger |
| Minimap | **Separate offscreen cache refreshed on discovery or scene mutation** | Avoids rebuilding the map every frame |
| Pixel style | **Low internal resolution + integer upscale** | Produces a clear handheld-adventure look and reduces phone fill rate |
| High-DPI | **DPR-aware backing buffer, capped around 2 on phones** | Avoids overpaying for ultra-dense screens with limited visual benefit |

If the art direction is hand-drawn low-color sprite work, set `ctx.imageSmoothingEnabled = false` for pixel layers and use CSS `image-rendering: pixelated` on the canvas; both are officially documented as the crisp-pixel path. Keep camera positions snapped to integers or half-tiles for pixel-art layers to avoid shimmer. Use `drawImage` from atlas cells into integer-aligned destination rectangles, and treat subpixel interpolation as a bug unless you deliberately enable non-pixelated effects. citeturn24search2turn24search4turn24search6

The procedural generation stack should stay intentionally modest. Use one seeded RNG module for all generation, expose the current world seed in the debug HUD, and ban direct `Math.random()` outside the RNG module. Then combine a few small algorithms instead of a large one: weighted biome patch growth for forest/alpine regions, masked random walks for rivers and trails, cellular automata only for cave interiors, simple path-guarantee checks between entry/objective/exit, and sparse “story pocket” placements for rival camps, birch groves, or fact NPCs. The key invariant is *same seed + same generation version = same world*. Whenever generation logic changes in a way that changes output, bump `WORLDGEN_VERSION`; do not silently reuse old deltas against a new generator. This is an engine-design recommendation, but it is strongly supported by the reference engines’ emphasis on explicit map data, hero persistence, and save-bound map semantics. citeturn14view3turn14view5turn14view7turn20search1

A small custom entity model is preferable to a full ECS. Use a shared base shape and specialized update functions:

```js
// canonical runtime entity shape
{
  id, kind, x, y, vx, vy, radius,
  hp, state, facing, anim, ttl,
  flags, data, dirty, saveable
}
```

Then keep per-kind handlers in lookup tables:

```js
const ENTITY_DEF = {
  player:    { update:updatePlayer, render:renderPlayer, collide:collideActor, save:savePlayer },
  deer:      { update:updateDeer,   render:renderDeer,   collide:collideActor, save:saveMob },
  resource:  { update:updateNode,   render:renderNode,   collide:collideNode,  save:saveNode },
  dropped:   { update:updateDrop,   render:renderDrop,   collide:collideDrop,  save:saveDrop },
  projectile:{ update:updateArrow,  render:renderArrow,  collide:collideProj,  save:null },
  trap:      { update:updateTrap,   render:renderTrap,   collide:collideTrap,  save:saveTrap },
  fire:      { update:updateFire,   render:renderFire,   collide:collideSoft,  save:saveFire },
  npc:       { update:updateNpc,    render:renderNpc,    collide:collideActor, save:saveNpc },
  building:  { update:updateBuild,  render:renderBuild,  collide:collideBuild, save:saveBuild },
  trigger:   { update:none,         render:debugTrigger, collide:collideTrig,  save:saveTrigger }
};
```

That model is simpler to test and patch than a generalized ECS, while still avoiding giant actor classes. It also matches the lesson from BrowserQuest and Solarus that different categories—player, mobs, map entities, and persistent world interactables—should not be flattened into a single undifferentiated blob. citeturn18view0turn14view5turn14view6

For systems, keep survival and village features lightweight. Health, stamina, hunger, warmth, wetness, injury, and weight should all be **rate-based meters with a small number of breakpoints**, not dozens of interacting hidden modifiers. Village should be **unlocks and passive outputs**, not colony simulation. Buildings should function as feature gates: smokehouse unlocks drying/preservation, workshop unlocks better tool recipes, shrine or memory hall unlocks more fact-dialogue branches, and completed resource-run dungeons can feed periodic village stock gains. This keeps the loop focused on explore → gather → survive → return → unlock → re-enter, which is the scale the references support well. BrowserQuest handled scope by keeping its object model simple, while Solarus and ZQuest both show the power of save-bound gates and map/object semantics over large background economies. citeturn18view0turn14view7turn20search5


## Mobile input, audio, and save architecture

The input stack should be **Pointer Events first**, not separate mouse and touch subsystems. MDN describes Pointer Events as a single event model for mouse, pen, and touch; `setPointerCapture()` keeps a drag bound to the chosen element; and `pointercancel` is exactly the event the browser fires when it decides the pointer has been converted into viewport panning, zooming, or scrolling. That means your virtual joystick and action zone logic should be written around pointer IDs, capture, and explicit cancellation. Do not drive movement directly from DOM events; collect raw pointer state first, then derive semantic actions in `ACTION_MAP` once per frame. citeturn23search1turn23search0turn23search4turn21view2turn22view4

For portrait mobile, the best default layout is:

- **Left lower movement zone** with joystick pad, generous radius, and drag-off tolerance.
- **Right lower action cluster** with large separated targets for interact/gather, tool/weapon, and menu/craft.
- **Sprint/dodge as burst or toggle**, not hold, because hold-sprint conflicts with aiming and gathering under multitouch on phones.
- **Optional right-side free-look/aim drag** only when a ranged weapon is equipped.
- **Minimap as a slide tab**, not a permanently open panel.
- **Top corners reserved for non-time-critical UI** due to safe areas, notches, and thumb reach.

Use `touch-action:none` on the game interaction surface to stop browser panning and pinch-zoom from stealing gestures, but do not apply it to every UI element in the app because MDN warns that `touch-action:none` can inhibit zooming needed by low-vision users. The pragmatic compromise is: gameplay surface uses `touch-action:none`; text-heavy overlays use ordinary browser behavior unless they need custom drag behavior. Pair that with `overscroll-behavior:none` on the shell to reduce unintended page bounce. citeturn21view1turn22view2turn22view3

The viewport and fullscreen policy should be conservative and mobile-realistic. Use `100dvh`, not `100vh`, because MDN documents `vh` as equivalent to the **large viewport** size while `dvh` tracks the **dynamic viewport**. Listen to `visualViewport.resize` and your ordinary resize path; recompute the CSS box, backing buffer, and safe-area padding together; and treat fullscreen as best-effort only because `requestFullscreen()` is still limited enough across major browsers that it is not Baseline. In practice, the “app-like” feel will come more from a fixed shell, hidden page scrolling, dynamic viewport handling, large touch targets, and good pause/resume behavior than from guaranteed fullscreen. citeturn21view7turn22view5turn21view4turn21view3

Audio should be **one `AudioContext`, unlocked from the Start button**, with procedural sound effects first and embedded samples only if a specific sound proves too hard to synthesize cleanly. The Web Audio spec allows browsers to prevent an `AudioContext` from starting until the page has sticky activation, and MDN documents the core graph model around `AudioContext`, oscillators, gains, and ramps. The safe pattern for tiny game sounds is: create nodes on demand, set a small initial nonzero gain, shape them with ramps, and stop them quickly. For click-free releases, use `exponentialRampToValueAtTime()` toward a small positive value, not zero; MDN explicitly notes that `exponentialRampToValueAtTime()` does not work if the current or target value is zero. citeturn10search20turn21view11turn10search2turn21view12turn10search9

A good Ötzi procedural-audio starter set is:

- **Footstep:** filtered noise + short low oscillator bump, randomized by biome.
- **Gather:** wood = short noisy scrape, flint = brighter click, grass = soft hiss.
- **Craft:** two- or three-step percussion blips with slight pitch variance.
- **Bow draw/release:** rising saw or triangle plus noise tail.
- **Arrow hit:** filtered click with optional body thump layer.
- **Deer flee:** short breathy noise/chirp, low level.
- **Rival alert:** narrowband tone burst + percussive onset.
- **Cold wind:** low filtered noise loop with gentle gain LFO.
- **Fire crackle:** sparse micro-noise bursts against a faint noise bed.
- **Village unlock:** short melodic dyad or triad.
- **Low health/stamina:** heartbeat-like double pulse with tempo tied to severity.

Save/load must be versioned and defensive. `localStorage` is widely available, but MDN also documents that it can throw `SecurityError` for invalid origins such as `file:` and that behavior for `file:` URLs is undefined and may vary between browsers. Therefore the correct design is: `try/catch` all storage access, autosave only on `visibilitychange` and safe checkpoints, include a visible “Save exported” text path, and support export/import of an encoded JSON string so that the game remains usable under `file:` or storage-restricted environments. MDN also recommends `visibilitychange` as a reliable end-of-session signal and cautions that `unload`/`pagehide` are unreliable on mobile. citeturn22view0turn22view1turn30search1turn30search9turn30search12

A save schema should look like this:

```js
{
  saveVersion: 3,
  worldgenVersion: 2,
  seed: "OTZI-2026-07-01-A",
  scene: "overworld",
  player: { x, y, hp, stamina, hunger, warmth, wetness, injury, weight, equipped },
  inventory: { items: { stick:12, bark:4, flint:6 }, slots:[...] },
  village: { buildings:{ hearth:1, workshop:0, smokehouse:1 }, passive:{ bark:3 } },
  dungeons: { cave_flintridge:{ complete:true, bestTime:123 } },
  facts: { discovered:["copper_axe","tattoos"] },
  map: { discoveredChunks:["2,1","2,2"], deltas:{ "2,2": { harvested:[...], opened:[...] } } },
  settings: { music:0.5, sfx:0.8, leftHanded:false, reducedFx:false },
  stats: { days:4, deerHunted:2, arrowsFired:11 }
}
```

Do not serialize caches, generated atlases, active pointer state, or temporary particles. Bump `saveVersion` whenever any durable meaning changes, and maintain explicit migration functions. That is the single biggest guardrail against AI-caused save corruption. citeturn22view1turn30search12


## Testing, build workflow, and AI-agent constitution

The test harness should expose a single stable façade such as `window.__OTZI_TEST__` with a tiny set of operations: `startGame()`, `setSeed()`, `teleport(tag)`, `give(item,count)`, `stepFrames(n)`, `readState()`, `exportSave()`, `importSave()`, and `toggleDebug(flag)`. Playwright can then monitor and block network activity, emulate mobile devices, capture screenshots, and perform built-in visual comparisons with `toHaveScreenshot()`. Chrome DevTools Device Mode is still helpful, but Chrome’s own documentation explicitly says there are aspects of mobile devices it can never simulate—especially CPU differences—and recommends remote debugging on a real Android device when in doubt. That is exactly the stance Hermes should adopt for Android Chrome. citeturn21view13turn21view14turn21view15turn21view16turn21view17

A minimal Playwright smoke spec should be shaped like this:

```js
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

test('otzi smoke', async ({ page }) => {
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push(String(e)));
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const requests = [];
  await page.route('**/*', route => {
    requests.push(route.request().url());
    route.continue();
  });

  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: /start/i }).click();

  await page.evaluate(() => window.__OTZI_TEST__.setSeed('SMOKE-SEED-01'));
  await page.evaluate(() => window.__OTZI_TEST__.teleport('forest_start'));
  await page.evaluate(() => window.__OTZI_TEST__.stepFrames(30));

  const state = await page.evaluate(() => window.__OTZI_TEST__.readState());
  expect(state.scene).toBe('overworld');
  expect(state.player).toBeTruthy();

  await expect(page).toHaveScreenshot('otzi-smoke-overworld.png');

  expect(consoleErrors).toEqual([]);

  const external = requests.filter(url =>
    !url.startsWith('http://localhost:8080/') &&
    !url.startsWith('data:') &&
    !url.startsWith('blob:')
  );
  expect(external).toEqual([]);
});
```

That design follows Playwright’s official network-monitoring and screenshot-comparison model. citeturn21view13turn21view15

The real-phone Android checklist should be treated as first-class evidence, not an optional manual afterthought:

| Test | Pass evidence |
|---|---|
| First load on Android Chrome | screenshot of title shell + debug footer |
| Start button unlocks audio | short screen capture + console note |
| Movement joystick + action multitouch | video clip with input overlay enabled |
| Drag finger off joystick zone | video clip showing zeroed movement after release/cancel |
| `pointercancel` recovery | debug overlay showing active pointer count returns to 0 |
| Browser UI show/hide while moving | before/after screenshots with CSS/backing sizes visible |
| Portrait↔landscape rotate | paired screenshots with scene and player tile unchanged |
| Background app / return | screenshot after return + save timestamp unchanged/correct |
| Save/reload on localhost | exported save string + successful re-import proof |
| `file:` fallback | screenshot of storage warning + export/import still working |

The build workflow should be **split source in `src/`, custom merge script in `tools/`, readable release in `dist/index.html`, optional minified release after stabilization**, exactly as you proposed. During development, use a simple local server and a human-readable source tree. For release, a Node merge script should concatenate the JS modules in a fixed order, inline the CSS, inject generated data tables, and write a single HTML file. Vite can still be useful as a dev server or optional production bundler—its docs explain that it uses Rollup for production builds in older architecture, and current Vite materials describe a unified bundling path—but for a Hermes-managed one-file artifact, a purpose-built merge script is more transparent and less brittle than letting a general-purpose bundler freely rewrite module boundaries. Terser and Closure Compiler are optional end-stage compression tools; Terser mangles names by default unless configured otherwise, and Closure rewrites code aggressively to optimize size and speed, so neither belongs in the active AI editing loop. Roadroller and js13k-style packers are for final size competitions, not for the maintainable reference build. citeturn31search0turn31search1turn31search13turn31search3turn31search9turn31search12turn32search0turn32search3

The **AI-safe constitution** that should sit at the top of the source file is:

```text
AI-SAFE ENGINE CONSTITUTION

This source is organized by named modules. Edit only the intended module.
Do not edit minified release files during development.
RENDER_* modules may read state but may not mutate simulation state.
INPUT collects raw state only; ACTION_MAP derives semantic intent.
WORLDGEN must be deterministic for the same seed and WORLDGEN_VERSION.
SAVE must serialize durable state only and bump SAVE_VERSION on schema changes.
Every code change must pass smoke tests before merging.
Every visual change must produce at least one screenshot artifact.
Every mobile control change must run the Android real-phone checklist.
Never add required external runtime dependencies, assets, fonts, or network calls.
Any uncertainty in archaeology text must be tagged VERIFIED, PLAUSIBLE, or FICTIONAL.
```

That is the minimal set of rules that keeps Hermes/Codex productive without bloating the file with commentary.


## Historical data integration, risks, and MVP plan

A strong Ötzi game gains identity from a **data-driven archaeology layer**, not from imitating Zelda-like iconography. The South Tyrol Museum of Archaeology documents the core equipment and clothing clearly enough to seed a verified fact registry: a nearly intact copper axe with a yew haft and a 99.7% pure copper blade; an unfinished yew bow stave; a deer-hide quiver containing twelve shafts and two finished arrows; a flint dagger with ash handle; a retoucheur for shaping flint; birch-bark containers likely used to carry charcoal embers; a backpack frame; a belt pouch containing tinder fungus, a scraper, a boring tool, a bone awl, and a flint flake; clothing made from hide, leather, and braided grass; goat-hide leggings; layered shoes insulated with grass; and a bearskin cap. The museum also states that Ötzi had 61 tattoos, was discovered in 1991, and died after an arrow severed the subclavian artery, likely within minutes, with a head injury occurring around the same time. citeturn27view4turn27view6turn27view5turn26view0turn27view3turn27view0turn27view1turn26view4turn26view2turn26view3

That suggests a fact system with three statuses:

| Status | Meaning | Example |
|---|---|---|
| `verified` | Directly supported by archaeology/museum/scientific literature | “Ötzi carried a copper axe with a yew haft.” |
| `plausible` | Gameplay interpretation that extrapolates from evidence | “The birch-bark container acts as a portable ember carrier.” |
| `fictional` | Mythic or dramatic framing added for game structure | “A spirit-memory ending where future discoverers remember him.” |

A starter record shape should be:

```js
{
  id: "copper_axe",
  label: "Copper Axe",
  status: "verified",
  category: "equipment",
  summary: "Copper axe with yew haft; rare, intact survival tool and weapon.",
  evidence: ["museum:equipment:copper_axe"],
  gameplayUse: ["tool", "weapon", "unlock:woodcutting_2"],
  notesForWriters: "Do not imply mass-produced metallurgy or late Iron Age tech."
}
```

This structure makes source-backed dialogue possible without hardcoding prose into scene scripts. It also helps AI agents keep verified facts separate from invented late-game myth content. citeturn27view4turn27view6turn27view3turn26view4

The highest technical risks are not mysterious. They are concrete:

| Risk | Symptom | Likely cause | Prevention | Test | Fallback |
|---|---|---|---|---|---|
| Procedural solvability | unwinnable seed | generation lacks guaranteed path/resources | validate every region after generation | fixed seed smoke pack | regenerate region with next sub-seed |
| Portrait mobile controls | missed actions, finger overlap | targets too small / gesture zones collide | large separated zones + burst sprint | real-phone multitouch checklist | offer simplified two-button mode |
| Resize/DPR bugs | blur, wrong collision, stretched UI | CSS size and backing size drift | centralize resize in `VIEWPORT` | rotate + UI hide/show screenshots | lower internal res and force reinit |
| Save migration | corrupted or unreadable saves | schema drift, transient state serialized | explicit `saveVersion` migrators | round-trip tests across versions | backup slot + import/export rescue |
| Phone performance | jank, heat, battery drain | full-res rendering, too many particles, overdraw | chunk caches, low-res buffer, particle caps | benchmark mode on Android | dynamic resolution scale |
| Historical drift | content becomes derivative or inaccurate | borrowed genre tropes replace evidence | fact DB with statuses and sources | content review against fact registry | cut or relabel content as fictional |
| AI regression | unrelated systems break after edit | hidden coupling, unnamed sections | constitution + test hooks + module ownership | smoke + screenshot diff every merge | revert to last green commit |

The MVP should stay disciplined:

**Milestone 1** builds the portrait shell, world canvas, player movement, camera, collision, and debug overlay.

**Milestone 2** adds procedural forest generation, gatherables such as sticks/stones/bark/grass/flint, inventory, and basic crafting.

**Milestone 3** adds cave/resource dungeon generation, deer behavior, a rival encounter, and a persistent dungeon-completion flag.

**Milestone 4** adds village auto-building/unlocks, NPC fact dialogue, save/load, and a slide-out minimap tab.

**Milestone 5** runs the Android Chrome torture pass, produces the single-file build, and deploys the static artifact to GitHub Pages.

That sequencing deliberately postpones narrative breadth and village complexity until the core exploration-return loop is already enjoyable and testable. The reference engines all support that judgment: BrowserQuest survived on clear scope, Solarus exposes action-adventure progression around map/object states, and ZQuest’s enduring strength is semantic clarity, not subsystem count. citeturn18view0turn14view7turn20search5

The required documentation set should be created exactly as follows:

- `docs/engine-field-manual.md`
- `docs/reference-survey.md`
- `docs/architecture-decision-record.md`
- `docs/testing-plan.md`
- `docs/workflow-for-hermes-codex.md`

Those files should be paired with the source tree you proposed, plus `tools/build-single-file.mjs`, a smoke spec in `tests/`, and screenshot artifacts in CI for every visual change.


## Final Hermes skill upgrade recommendations

**Must add**

Add a reusable **portrait Canvas shell reference** with `100dvh`, safe-area padding, `interactive-widget=resizes-content`, `visualViewport` resizing, and DPR-correct backing-buffer math. Those platform pieces are now mature enough to treat as default patterns, and they solve a large category of Android Chrome bugs before gameplay work even starts. citeturn21view7turn22view5turn21view8turn35view0

Add a **Pointer Events mobile-control reference** that is explicitly pointer-ID based, uses `setPointerCapture()`, handles `pointercancel`, and separates raw input from semantic action mapping. This should become a standard Hermes rule for single-file mobile-first games. citeturn23search1turn23search0turn21view2turn22view4

Add a **versioned save schema reference** with `localStorage` try/catch, `file:` warning behavior, and export/import rescue strings. That should be a default single-file rule, not a project-specific extra. citeturn22view0turn22view1turn30search12

Add a **Canvas 2D performance reference** covering `{ alpha:false }`, offscreen prerenders, image smoothing rules, and low-resolution upscale. citeturn28search14turn28search7turn24search2turn29search7

Add a **Hermes smoke-test contract**: no console errors, no uncaught page errors, no external requests, canvas exists, frame clock advances, screenshot captured, save round-trip passes, and a seeded deterministic test hook exists. citeturn21view13turn21view15

**Should add**

Add a **reference-engine extraction guide** summarizing what to borrow conceptually from Phaser, BrowserQuest, Solarus, and ZQuest, and what not to borrow. This is especially useful for agents so they imitate structure, not code or copyrighted content. citeturn14view0turn14view3turn14view5turn20search5

Add a **data-driven fact registry template** for historically grounded games, with `verified` / `plausible` / `fictional` status fields and citation slots.

Add an **AI-safe constitution template** for top-of-file governance of HTML game sources.

Add an **Android evidence template** that standardizes screenshot/video proof expectations for resize, controls, save/load, and performance.

**Optional reference**

Add an **optional build appendix** covering Vite/Rollup dev ergonomics, Terser/Closure end-stage minification, and Roadroller/js13k-style last-mile compression for size-constrained builds. citeturn31search0turn31search3turn31search12turn32search0turn32search3

Add an **optional OffscreenCanvas/Worker note** as an optimization path only. OffscreenCanvas support is broad enough to be useful, but it should remain a fallback-enhanced optimization rather than a baseline dependency for a maintainable single-file game. citeturn9search16turn29search7

**Do not add / too brittle**

Do not add Phaser-specific runtime patterns as mandatory Hermes rules. Phaser is the wrong level of abstraction for a strict single-file custom engine, even though it is a good teaching reference. citeturn14view0turn36search2

Do not add heavy packer steps such as Roadroller as default workflow advice. They are useful for extreme size contests, but they reduce inspectability and complicate AI maintenance. citeturn32search0turn32search3

Do not add `user-scalable=no` or blanket gesture suppression as default mobile advice. MDN explicitly warns those patterns can harm accessibility. citeturn35view0turn22view3


## Open questions and limitations

Some of the strongest recommendations above are **engine design inferences** rather than direct browser or engine documentation. In particular, the exact chunk size, internal render resolution, and the final number of village systems should be validated with a real Android Chrome prototype before being frozen.

I did not perform a deeper source-code audit of every candidate open-source top-down HTML5 prototype beyond the most reusable reference engines and lightweight engine examples. The architecture guidance is therefore strongest where it draws on official docs, official repos, and durable platform APIs, and more tentative where it proposes the exact content loop or generation parameters for Ötzi.

I also did not research every individual archaeological object in separate primary papers, because the South Tyrol Museum’s official interpretive materials already cover the core equipment, clothing, tattoo count, discovery, and death evidence well enough for a fact database seed. For any educational or museum-facing release, the in-game fact text should still undergo a final archaeology review before ship.