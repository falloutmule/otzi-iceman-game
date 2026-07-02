# Survival Meters Report

## Goal

Turn the single stamina chip into a readable survival meter group with predictable starter behavior.

## What was done

- Added `src/survival.js`.
- Added survival helpers for:
  - clamping meter values
  - spending stamina
  - per-frame survival updates
  - save snapshot meter extraction
  - meter application from saved data
- Updated player starter meters:
  - health: 100
  - stamina: 100
  - hunger: 0
  - warmth: 100
  - wetness: 0
- Updated the HUD survival chip to show:
  - HP
  - STAM
  - HUNGER
  - WARMTH
- Kept wetness as a placeholder meter in state and save snapshots.
- Updated sprint so stamina drains while sprinting and recovers while not sprinting.
- Added `meters` to save snapshots without changing save version.
- Updated Playwright tests for meter display, sprint drain/recovery, clamping, and save snapshot contents.
- Regenerated `dist/index.html`.

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- Playwright result: 3 tests passed.
- HUD shows HP/STAM/HUNGER/WARMTH.
- DODGE/SPRINT tap reduces stamina.
- Stamina recovers after sprint is released.
- Meter values clamp to 0-100.
- Exported save snapshot includes meter values.
- Existing layout, gathering, inventory, map, menu, and joystick tests still pass.

Inferred:

- The meters are ready for Task 8 save/load round-trip testing.

Untested:

- Long-duration hunger/warmth balancing on real gameplay sessions.
- Real Samsung Galaxy S21 Ultra retest after this Task 6 change.

## What failed

- Nothing failed in this pass.

## Current exact state

- Survival meters exist and update predictably.
- No death/failure loop was added.
- Hunger changes slowly.
- Warmth remains bounded.
- Wetness is saved as a placeholder state value but not shown in the HUD yet.

## Remaining blockers

- Task 7 basic crafting.
- Task 8 save/load round trip for inventory, meters, and depleted nodes.

## Next actionable step

Proceed to Task 7: basic crafting placeholder that actually consumes resources.

## Evidence

- `src/survival.js`
- `src/main.js`
- `src/render-ui.js`
- `src/save.js`
- `src/test-hooks.js`
- `tests/mobile-controls.spec.js`
- `dist/index.html`
- `artifacts/screenshots/gather-success-flint.png`
- `artifacts/screenshots/menu-placeholder.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Not retested on physical Samsung hardware after this Task 6 survival meter update.

