# Overworld Screen-Grid Report

## Goal

Replace the single continuous overworld with a deterministic grid of fixed overworld screens.

## What was done

- Added [world-grid.js](/C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/src/world-grid.js) for overworld and dungeon grid state.
- Changed config from one large map to fixed screen dimensions and overworld grid dimensions.
- Reworked world generation so each overworld screen is generated from seed plus screen coordinate.
- Moved runtime area ownership to `currentArea`, `currentScreen`, and `currentDungeon`.
- Added test-hook screen signatures to prove deterministic generation for the same seed and screen coordinate.

## What was verified

Verified:

- The game now boots into an overworld screen instead of a global 72x72 map.
- Current screen id and grid coordinate exist in runtime state and debug output.
- The same seed and current screen regenerate the same tile signature and resource signature in Playwright.

Inferred:

- The screen-grid model is now the authoritative world structure for future forest and dungeon work.

Untested:

- Manual Samsung hardware review of the new screen-grid pacing.

## What failed

- No build or automated test failed after the final screen-grid runtime pass.

## Current exact state

- Overworld grid: `8 x 8`
- Home screen: `overworld_4_4`
- Flint Scar screen: `overworld_5_4`

## Remaining blockers

- Live Samsung retest after deployment.

## Next actionable step

Build screen-edge progression and dungeon objectives on top of the new screen-grid runtime rather than the retired one-big-map prototype.
