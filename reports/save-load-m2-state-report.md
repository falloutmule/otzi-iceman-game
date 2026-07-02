# Save Load M2 State Report

## Goal

Make Milestone 2 state survive a save/load round trip before adding dungeon or village progression.

## What was done

- Bumped save version to `2`.
- Changed save key to `otzi_milestone2_save_v2`.
- Added save snapshot fields for:
  - player position
  - survival meters
  - inventory
  - crafted items
  - minimap state
  - depleted resource node deltas
- Added resource-node save delta helpers:
  - `depletedDeltas()`
  - `applyDepletedDeltas()`
- Updated load application so depleted nodes are restored and reflected in the tilemap.
- Added a test hook for explicit save calls.
- Updated Playwright to save after gathering/crafting, reload the page, and verify state survives.
- Regenerated `dist/index.html`.

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- Playwright result: 3 tests passed.
- Inventory survives reload.
- Crafted `crudeTool` survives reload.
- Depleted resource node count survives reload.
- Player position survives reload.
- Health and stamina meter values survive reload.
- Minimap state survives reload.
- Existing layout, gather, crafting, survival, menu, map, and joystick tests still pass.

Inferred:

- The save format is ready to carry additional Milestone 2 and Milestone 3 progression flags.

Untested:

- localStorage unavailable/failure fallback beyond the existing try/catch behavior.
- Manual export/import UX; the test verifies export snapshot structure but no UI exists for export/import.
- Physical Samsung Galaxy S21 Ultra retest after this Task 8 save/load update.

## What failed

- Nothing failed in this pass.

## Current exact state

- Save version: `2`.
- Save key: `otzi_milestone2_save_v2`.
- Save/load preserves the current Milestone 2 state needed for the next tasks.
- Old version 1 saves are intentionally ignored by the existing unsupported-version guard.

## Remaining blockers

- Task 9 procedural forest seed quality pass.
- Task 10 Flint Scar/Cave transition stub.

## Next actionable step

Proceed to Task 9: procedural forest seed quality pass.

## Evidence

- `src/config.js`
- `src/save.js`
- `src/resources.js`
- `src/test-hooks.js`
- `tests/mobile-controls.spec.js`
- `dist/index.html`
- `artifacts/screenshots/gather-success-flint.png`
- `artifacts/screenshots/menu-placeholder.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Not retested on physical Samsung hardware after this Task 8 save/load update.

