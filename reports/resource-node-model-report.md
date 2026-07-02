# Resource Node Model Report

## Goal

Make Milestone 2 gathering depend on stable resource node data objects instead of loose tile-scanning behavior.

## What was done

- Added `src/resources.js`.
- Added explicit resource node objects generated from current harvestable map tiles.
- Added stable node fields:
  - `id`
  - `kind`
  - `resource`
  - `x`
  - `y`
  - `tileX`
  - `tileY`
  - `radius`
  - `amount`
  - `depleted`
  - `respawn`
  - `saveDeltaId`
  - `saveable`
- Updated `OTZI.game.setSeed()` to create `game.resourceNodes`.
- Updated `OTZI.game.findNearestResource()` to use node objects instead of scanning tile flags directly.
- Updated `OTZI.game.tryGather()` so gathering:
  - succeeds only near an active resource node
  - increments inventory by node resource type
  - depletes the node
  - mirrors depletion to the tilemap for visible feedback
- Added `resourceNodeRadius` config.
- Added resource-node counts and node lookup to `window.__OTZI_TEST__`.
- Updated mobile Playwright coverage to verify node counts, failed far gather, successful near gather, and depletion state.
- Regenerated `dist/index.html`.

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- Playwright result: 3 tests passed.
- Far USE/GATHER does not increment flint.
- Near flint resource USE/GATHER increments flint.
- Successful gather increases depleted node count by 1.
- Successful gather decreases active node count by 1.
- Gathered node has `depleted: true`.
- Gathered node has `amount: 0`.
- Existing layout controls still pass:
  - AIM absent
  - MAP in HUD
  - bottom controls outside game viewport
  - MAP toggles minimap
  - CRAFT/MENU opens
  - DODGE/SPRINT feedback works
  - MOVE joystick moves player

Inferred:

- The model is ready for Task 4 resource expansion because `resource` is data-driven and no longer hardcoded to the gather action.

Untested:

- Save/load persistence of depleted nodes. That belongs to Task 8.
- Non-flint resource types. Those belong to Task 4.
- Respawn behavior. Current placeholder is `respawn: "none"`.

## What failed

- Nothing failed in this pass.

## Current exact state

- Branch: `task3-resource-node-model`
- Current resource behavior remains flint-only at runtime.
- Resource nodes are now real data objects.
- Flint nodes deplete after gathering and become visibly depleted on the map.
- The shipped single-file artifact has been rebuilt.

## Remaining blockers

- Task 4 must add visible starter resource types:
  - stick
  - stone
  - bark
  - grass
  - food
- Task 8 must persist inventory and depleted-node deltas through save/load.

## Next actionable step

Proceed to Task 4: expand forest gatherables using the new resource node model.

## Evidence

- `src/resources.js`
- `src/main.js`
- `src/test-hooks.js`
- `tests/mobile-controls.spec.js`
- `dist/index.html`
- `artifacts/screenshots/gather-fail-no-resource.png`
- `artifacts/screenshots/gather-success-flint.png`
- `artifacts/screenshots/no-aim-map-in-hud.png`
- `artifacts/screenshots/joystick-bottom-panel.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Not retested on physical Samsung hardware after this Task 3 code change. Existing Milestone 1 phone pass remains the last confirmed real-device result.

