# Live Guidance and Flint Scar Entry Fix Report

## Goal

Fix the live guidance layer so the player-facing build visibly shows `Start Game`, the welcome popup, the objective bar, and map legends, while also correcting Flint Scar dungeon entry so the player starts in the entrance room instead of sliding into the east room immediately.

## What was done

- Updated the start panel copy in source and rebuilt `dist/index.html`.
- Added menu-visible build metadata for engine, save, and worldgen versions.
- Added a `Show Objective Help` path in the menu.
- Reworked welcome guidance persistence to use a versioned guide flag instead of the older boolean-only path.
- Tightened Flint Scar entry so dungeon entry starts in room `0,1` from the west side and applies a transition cooldown to prevent immediate accidental room transitions.
- Extended Playwright coverage for the player-facing copy, build marker, dungeon entry room, and dungeon legend.

## What was verified

- Verified locally: `node tools/build-single-file.mjs` passes.
- Verified locally: `npx.cmd playwright test` passes with 6/6 tests.
- Verified locally in `dist/index.html`: `Start Game`, `objective-bar`, `welcomePanel`, `minimapLegend`, and `otzi-discoverability-0.4.0` are present.
- Verified locally by Playwright: Flint Scar entry starts in dungeon room `0,1` and does not immediately transition east.

## What failed

- Live GitHub Pages verification is still pending for this pass until the push and Pages workflow complete.

## Current exact state

- Source is updated locally.
- `dist/index.html` is regenerated locally with the new guidance and entry-fix markers.
- Local test coverage now proves the user-facing guidance and the Flint Scar entrance-room behavior.

## Remaining blockers

- GitHub Pages may still be blocked by the previously observed deployment issue in `actions/deploy-pages`.
- Samsung Galaxy S21 Ultra retest is still required after the live build updates.

## Next actionable step

Push the current main branch, watch the GitHub Pages run, then verify the public cache-busted HTML contains the updated guidance markers before rechecking on Samsung hardware.

## Evidence

- `artifacts/screenshots/fix-start-game-label.png`
- `artifacts/screenshots/fix-welcome-popup-visible.png`
- `artifacts/screenshots/fix-objective-bar-visible.png`
- `artifacts/screenshots/fix-menu-build-marker.png`
- `artifacts/screenshots/fix-flint-scar-entry-room.png`
- `artifacts/screenshots/fix-flint-scar-area-card.png`
- `artifacts/screenshots/fix-overworld-map-legend.png`
- `artifacts/screenshots/fix-dungeon-map-legend.png`

## Live URL verification

- Pending push/deploy for this pass.

## Samsung Galaxy S21 Ultra status

- Untested on the updated live build.
