# otzistarthere.md

## Plain summary

Start this project by turning the existing Ötzi starter HTML and design documents into a clean GitHub repo with a working Milestone 1 engine shell. Do not try to build the whole game yet. The first goal is a verified, testable, mobile-portrait Canvas 2D foundation that Codex can safely extend later.

The first deliverable is not a finished game. It is a working project skeleton with split source files, a generated single-file `dist/index.html`, smoke tests, screenshots, and a short evidence report.

---

## Goal

Create the starting repository for **The Legend of Ötzi the Iceman**, a portrait-first, top-down, Canvas 2D, single-file HTML survival adventure.

The project must start from these four files:

```text
otzi_iceman_single_file_game_complete_spec.md
canvas 2d engine.md
otzi-customizable-control-scheme.html
otzi-canvas2d-engine-starter.html
```

Use the starter HTML as the initial working prototype. Use the other three files as design authority.

Final runtime target:

```text
dist/index.html
```

Development target:

```text
split source files in src/
single-file build script in tools/
tests in tests/
docs copied into docs/
proof artifacts in artifacts/
```

---

## File roles

### 1. `otzi_iceman_single_file_game_complete_spec.md`

Use this as the product spec. It defines the game identity, hard constraints, engine choice, screen layout, core loop, village system, Ötzi equipment, survival systems, fact database, world generation, entity model, save/load, testing, milestones, and risk register.

Key decisions from this file:

- Custom Canvas 2D engine.
- DOM/CSS overlays for menus, facts, inventory, controls, and debug panels.
- Portrait mobile-first.
- Android Chrome first.
- Final playable artifact is one self-contained `dist/index.html`.
- No external runtime assets, fonts, CDNs, or network calls.
- Seeded procedural world.
- Versioned save schema.
- Fact system must separate `verified`, `plausible`, and `fictional`.

### 2. `canvas 2d engine.md`

Use this as the engine field manual. It defines the technical architecture and module ownership rules.

Key decisions from this file:

- Do not ship Phaser.
- Use Phaser, BrowserQuest, Solarus, and ZQuest only as conceptual references.
- Use `100dvh`, safe-area padding, `visualViewport`, DPR-aware canvas sizing, and Pointer Events.
- Use a fixed-step update loop.
- Keep input raw state separate from semantic actions.
- Keep render code read-only against simulation state.
- Save seed plus deltas, not generated render caches.
- Expose stable `window.__OTZI_TEST__` hooks for Playwright.

### 3. `otzi-customizable-control-scheme.html`

Use this as the controls spec.

Key decisions from this file:

- Bottom-left `MOVE` joystick.
- Right-side `AIM` strip.
- Large `USE/GATHER`, `DODGE/SPRINT`, and `CRAFT/MENU` buttons.
- Trail map tab in its own stable band.
- Dodge/sprint is burst/toggle by default, not hold-only.
- Controls must be declarative in one profile object.
- Pointer capture and `pointercancel` recovery are mandatory.
- Dialogue, pause, death, and scene changes must clear movement/aim state.

### 4. `otzi-canvas2d-engine-starter.html`

Use this as the first code source. It already contains a live starter demo and named sections:

```text
SECTION 00: DOM
SECTION 01: CONFIG
SECTION 02: RNG
SECTION 03: VIEWPORT
SECTION 04: INPUT + ACTION MAP
SECTION 05: AUDIO
SECTION 06: ASSETS
SECTION 07: WORLDGEN + TILEMAP
SECTION 08: ENTITIES + COLLISION
SECTION 09: CAMERA + RENDER
SECTION 10: SAVE
SECTION 11: TEST_HOOKS
SECTION 12: MAIN LOOP
```

First job: preserve this working behavior while extracting it into a maintainable repo structure.

---

## Non-negotiable rules

Do not broaden the task. Do not start building the full game before the shell is verified.

Do not:

- Use Phaser as a runtime dependency.
- Copy Zelda assets, UI framing, room layouts, enemy designs, music, or naming conventions.
- Add external runtime files to the final playable artifact.
- Add CDN links.
- Add external images, fonts, sounds, or JSON required at runtime.
- Edit minified output during development.
- Claim mobile proof without real or emulated evidence.
- Claim completion without running the verification commands.
- Add a heavy ECS before the simple entity model proves insufficient.
- Turn the village into a colony sim in Milestone 1.
- Build the full dungeon/village/fact system in the first pass.

Do:

- Keep source readable.
- Keep modules named.
- Keep the live starter playable.
- Build back to one `dist/index.html`.
- Test the generated output, not only the source.
- Keep evidence files.

---

## Repository structure to create

Create this structure:

```text
otzi-iceman-game/
  docs/
    complete-spec.md
    canvas-2d-engine-field-manual.md
    customizable-control-scheme.html
    starter-reference.html
    otzistarthere.md

  src/
    config.js
    dom.js
    rng.js
    viewport.js
    input.js
    action-map.js
    audio.js
    assets.js
    tilemap.js
    worldgen.js
    entities.js
    collision.js
    camera.js
    scenes.js
    dialogue.js
    inventory.js
    crafting.js
    village.js
    facts.js
    render-world.js
    render-ui.js
    debug.js
    save.js
    test-hooks.js
    main.js

  tools/
    build-single-file.mjs

  tests/
    smoke.spec.js

  dist/
    index.html

  artifacts/
    screenshots/
    logs/
    reports/

  package.json
  README.md
```

If a module is not fully implemented yet, create it with a clear stub and TODO, but do not leave broken imports.

---

## First implementation target: Milestone 1 only

### Milestone 1 goal

Prove the engine shell.

Required working features:

- `dist/index.html` exists.
- Page loads on localhost.
- Canvas world area exists.
- DOM UI root exists.
- Start button exists and unlocks audio without throwing.
- Fixed-step loop runs.
- Player can move with keyboard.
- Touch/pointer controls exist or are preserved from the starter.
- Camera follows player.
- Tile collision blocks obstacles.
- Debug overlay exists and can show seed/player tile/FPS/entity count/pointer count.
- Viewport resize updates canvas size safely.
- No external network requests.
- No console errors.
- Playwright smoke test exists.
- Screenshot artifact exists.

Milestone 1 should not require:

- Final art.
- Final village system.
- Full procedural dungeon.
- Full fact database.
- Full crafting system.
- Final save migration system.
- GitHub Pages deploy unless the shell is already green.

---

## Exact starting sequence for Codex

### Step 1 — Create and inspect project

Create the repo folder:

```bash
mkdir -p otzi-iceman-game
cd otzi-iceman-game
```

Copy the four supplied files into `docs/`:

```bash
mkdir -p docs
cp ../otzi_iceman_single_file_game_complete_spec.md docs/complete-spec.md
cp "../canvas 2d engine.md" docs/canvas-2d-engine-field-manual.md
cp ../otzi-customizable-control-scheme.html docs/customizable-control-scheme.html
cp ../otzi-canvas2d-engine-starter.html docs/starter-reference.html
cp ../otzistarthere.md docs/otzistarthere.md
```

Verify they exist:

```bash
ls -lah docs
```

Read the start file first:

```bash
sed -n '1,220p' docs/otzistarthere.md
```

Then inspect the starter source sections:

```bash
grep -n "SECTION" docs/starter-reference.html
```

Expected starter sections include:

```text
SECTION 00: DOM
SECTION 01: CONFIG
SECTION 02: RNG
SECTION 03: VIEWPORT
SECTION 04: INPUT + ACTION MAP
SECTION 05: AUDIO
SECTION 06: ASSETS
SECTION 07: WORLDGEN + TILEMAP
SECTION 08: ENTITIES + COLLISION
SECTION 09: CAMERA + RENDER
SECTION 10: SAVE
SECTION 11: TEST_HOOKS
SECTION 12: MAIN LOOP
```

### Step 2 — Baseline run before refactor

Before changing anything, run the starter reference as-is.

Use a local server:

```bash
python -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080/docs/starter-reference.html
```

Verify manually:

- Page loads.
- Canvas demo appears.
- Start button works.
- WASD/arrow movement works.
- `E` gathers/talks.
- `D` toggles debug.
- `M` toggles minimap.
- `R` reseeds.
- Save/export buttons do not throw.
- No console errors.

Capture baseline screenshots:

```text
artifacts/screenshots/baseline-starter-title.png
artifacts/screenshots/baseline-starter-running.png
artifacts/screenshots/baseline-starter-debug.png
```

If browser automation is available, use Playwright. If not, take manual screenshots and state that Playwright was not available.

### Step 3 — Extract source modules

Extract the live demo into split modules. Preserve behavior first. Do not improve gameplay during extraction.

Starter section mapping:

```text
SECTION 00: DOM                 -> src/dom.js
SECTION 01: CONFIG              -> src/config.js
SECTION 02: RNG                 -> src/rng.js
SECTION 03: VIEWPORT            -> src/viewport.js
SECTION 04: INPUT + ACTION MAP  -> src/input.js + src/action-map.js
SECTION 05: AUDIO               -> src/audio.js
SECTION 06: ASSETS              -> src/assets.js
SECTION 07: WORLDGEN + TILEMAP  -> src/tilemap.js + src/worldgen.js
SECTION 08: ENTITIES + COLLISION -> src/entities.js + src/collision.js
SECTION 09: CAMERA + RENDER     -> src/camera.js + src/render-world.js + src/render-ui.js
SECTION 10: SAVE                -> src/save.js
SECTION 11: TEST_HOOKS          -> src/test-hooks.js
SECTION 12: MAIN LOOP           -> src/main.js
```

Create stubs for these future modules if not needed yet:

```text
src/scenes.js
src/dialogue.js
src/inventory.js
src/crafting.js
src/village.js
src/facts.js
src/debug.js
```

Stubs must export plain APIs and must not break runtime.

### Step 4 — Create the HTML shell

Create `src/index.template.html` or equivalent inside the build script.

The output `dist/index.html` must include:

- `<!doctype html>`
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- A fixed `#app` shell.
- One world canvas.
- One DOM UI root.
- No external script tags.
- No external CSS links.
- No external fonts.

Required shell shape:

```html
<div id="app">
  <canvas id="worldCanvas" aria-label="The Legend of Ötzi the Iceman game world"></canvas>
  <div id="uiRoot"></div>
</div>
```

### Step 5 — Build script

Create:

```text
tools/build-single-file.mjs
```

The script must:

- Read the HTML template.
- Read JS modules in a fixed order.
- Inline CSS and JS.
- Write `dist/index.html`.
- Add a build metadata comment.
- Reject obvious external runtime URLs.

Suggested module order:

```js
const modules = [
  'config.js',
  'dom.js',
  'rng.js',
  'viewport.js',
  'input.js',
  'action-map.js',
  'audio.js',
  'assets.js',
  'tilemap.js',
  'worldgen.js',
  'entities.js',
  'collision.js',
  'camera.js',
  'scenes.js',
  'dialogue.js',
  'inventory.js',
  'crafting.js',
  'village.js',
  'facts.js',
  'render-world.js',
  'render-ui.js',
  'debug.js',
  'save.js',
  'test-hooks.js',
  'main.js'
];
```

Build command:

```bash
node tools/build-single-file.mjs
```

Output:

```text
dist/index.html
```

### Step 6 — Package and scripts

Create `package.json`:

```json
{
  "name": "otzi-iceman-game",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node tools/build-single-file.mjs",
    "serve": "python -m http.server 8080",
    "test": "npx playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.45.0"
  }
}
```

If Node package installation is not allowed in the runtime, still create the files and document that tests were not installed.

### Step 7 — Test hooks

Expose:

```js
window.__OTZI_TEST__ = {
  snapshot,
  setSeed,
  stepFrames,
  teleportToVillage,
  give,
  completeDungeon,
  exportSave,
  importSave,
  toggleDebug
};
```

Minimum `snapshot()` shape:

```js
{
  engineVersion,
  saveVersion,
  scene,
  seed,
  player: {
    x,
    y,
    tileX,
    tileY,
    health,
    stamina,
    hunger,
    warmth,
    wetness
  },
  inventory,
  village,
  facts,
  entityCount,
  particleCount,
  debug,
  viewport: {
    cssW,
    cssH,
    internalW,
    internalH,
    dpr
  },
  input: {
    pointerCount,
    movePointerActive
  }
}
```

### Step 8 — Playwright smoke test

Create:

```text
tests/smoke.spec.js
```

Minimum behavior:

```js
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

test('otzi milestone 1 smoke', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  const externalRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('pageerror', err => {
    pageErrors.push(String(err));
  });

  await page.route('**/*', route => {
    const url = route.request().url();
    if (
      url.startsWith('http://127.0.0.1:8080/') ||
      url.startsWith('http://localhost:8080/') ||
      url.startsWith('data:') ||
      url.startsWith('blob:')
    ) {
      route.continue();
    } else {
      externalRequests.push(url);
      route.abort();
    }
  });

  await page.goto('http://127.0.0.1:8080/dist/index.html');

  await expect(page.locator('canvas')).toBeVisible();

  const maybeStart = page.getByRole('button', { name: /start/i });
  if (await maybeStart.count()) {
    await maybeStart.first().click();
  }

  await page.keyboard.down('KeyD');
  await page.waitForTimeout(350);
  await page.keyboard.up('KeyD');

  const snap = await page.evaluate(() => window.__OTZI_TEST__.snapshot());
  expect(snap.player.x).toBeGreaterThan(0);
  expect(snap.scene).toBeTruthy();
  expect(snap.seed).toBeTruthy();

  await page.screenshot({ path: 'artifacts/screenshots/milestone1-smoke.png', fullPage: true });

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
```

If Playwright is unavailable, report the exact install/runtime blocker and perform manual browser verification.

---

## Milestone 1 acceptance criteria

Milestone 1 is complete only when all of this is true:

```text
[ ] docs copied into docs/
[ ] source extracted into src/
[ ] dist/index.html generated by build script
[ ] dist/index.html loads under localhost
[ ] canvas is visible
[ ] Start button/audio unlock path does not throw
[ ] fixed-step update loop advances
[ ] keyboard movement changes player position
[ ] touch controls still exist or have a documented implementation stub
[ ] collision blocks solid map objects
[ ] debug overlay/test snapshot reports seed/player tile/entity count
[ ] viewport resize does not break canvas backing size
[ ] no console errors
[ ] no external network requests
[ ] screenshot artifact saved
[ ] report written to artifacts/reports/milestone1-report.md
```

Do not mark complete if only the source files exist but `dist/index.html` was not generated and tested.

---

## Evidence report format

Write this file after the first pass:

```text
artifacts/reports/milestone1-report.md
```

Use this exact report structure:

```md
# Milestone 1 Report — Ötzi Engine Shell

## Goal

Build the initial Canvas 2D engine shell from the supplied Ötzi starter files.

## What was done

- ...

## What was verified

- ...

## What failed

- ...

## Current exact state

- ...

## Remaining blockers

- ...

## Next actionable step

- ...

## Evidence paths

- `artifacts/screenshots/...`
- `artifacts/logs/...`
- `dist/index.html`
- `tests/smoke.spec.js`
```

Clearly mark each item as:

```text
verified
inferred
proposed
untested
blocked
```

---

## Starting README content

Create `README.md` with this content at minimum:

```md
# The Legend of Ötzi the Iceman

A portrait-first, top-down, Canvas 2D, single-file HTML5 survival adventure prototype.

## Current milestone

Milestone 1 — Engine Shell.

## Runtime rule

The final playable artifact is:

\`\`\`text
dist/index.html
\`\`\`

No required external runtime assets, CDNs, fonts, sounds, or network calls.

## Development

\`\`\`bash
npm install
npm run build
python -m http.server 8080
\`\`\`

Open:

\`\`\`text
http://127.0.0.1:8080/dist/index.html
\`\`\`

## Tests

\`\`\`bash
npx playwright test
\`\`\`

## Source documents

See `docs/`.
```

---

## Implementation priority

Do work in this order:

1. Baseline run of `docs/starter-reference.html`.
2. Create repo structure.
3. Extract source without changing behavior.
4. Build `dist/index.html`.
5. Run generated file.
6. Add test hooks.
7. Add smoke test.
8. Capture screenshot.
9. Write milestone report.

Do not implement Milestone 2 until Milestone 1 is verified.

---

## First Codex task card

```text
TASK: Start The Legend of Ötzi the Iceman single-file HTML game project.

INPUT FILES:
- docs/complete-spec.md
- docs/canvas-2d-engine-field-manual.md
- docs/customizable-control-scheme.html
- docs/starter-reference.html
- docs/otzistarthere.md

GOAL:
Create a clean repo skeleton and extract the working starter HTML into split source modules, then build a verified single-file dist/index.html.

SCOPE:
Milestone 1 only.

REQUIREMENTS:
- Preserve the starter demo behavior.
- Use custom Canvas 2D, not Phaser.
- Use DOM/CSS overlays for UI.
- Keep the game portrait-first and mobile-aware.
- Use Pointer Events for touch controls.
- Use fixed-step simulation.
- Use seeded RNG.
- Use versioned save stubs.
- Expose window.__OTZI_TEST__.snapshot().
- Generate dist/index.html from source.
- Add Playwright smoke test or document why it cannot run.
- Capture screenshot evidence.
- Write artifacts/reports/milestone1-report.md.

DO NOT:
- Build the full game.
- Add external runtime dependencies.
- Copy copyrighted assets.
- Edit minified output.
- Claim mobile proof without evidence.

DONE WHEN:
dist/index.html loads on localhost, no console errors occur, no external requests occur, the player can move, collision works, snapshot() returns state, a screenshot exists, and the milestone report is written.
```

---

## Current exact state for Codex

Verified:

- The four input files exist.
- The starter reference is already a self-contained HTML field file with a runnable procedural Canvas 2D demo.
- The design/spec files agree on a custom Canvas 2D engine, DOM overlays, portrait mobile-first layout, seeded RNG, versioned saves, and AI-safe module boundaries.

Inferred:

- The fastest safe start is extracting the starter HTML sections into `src/` modules rather than writing a new engine from scratch.
- The starter behavior should become the baseline regression target.

Proposed:

- Repo name: `otzi-iceman-game`.
- First public release path: `dist/index.html`.
- First report path: `artifacts/reports/milestone1-report.md`.

Untested:

- No command has been run inside the Codex environment yet.
- No GitHub repo has been created yet.
- No Playwright run has happened yet.

Blocked until Codex starts:

- Runtime reality in Codex environment.
- Whether Node/npm/Playwright are available.
- Whether a real Android Chrome test can be performed from that environment.

---

## Next actionable step

Codex should start with the baseline run of `docs/starter-reference.html`, capture proof, then extract the starter into modules and build `dist/index.html`.
