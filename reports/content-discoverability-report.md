# Content Discoverability Report

## Goal

Fix the first playable content loop so players can discover where to go, what screen they are on, and what the current objective is without guessing.

## What was done

- Added a new objective module in [src/objectives.js](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/src/objectives.js).
- Added a persistent objective strip, first-run welcome popup, transient screen-entry card, and minimap legend in [src/dom.js](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/src/dom.js) and [tools/build-single-file.mjs](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/tools/build-single-file.mjs).
- Wired discoverability state into [src/main.js](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/src/main.js), [src/render-ui.js](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/src/render-ui.js), and [src/save.js](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/src/save.js).
- Made Flint Scar’s entrance marker more obvious in [src/render-world.js](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/src/render-world.js).
- Added test hooks and a dedicated discoverability Playwright test in [src/test-hooks.js](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/src/test-hooks.js) and [tests/discoverability.spec.js](C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game/tests/discoverability.spec.js).

## What was verified

- Verified: fresh start now shows a welcome popup that tells the player to go east to Flint Scar.
- Verified: the objective strip shows the current loop step and updates for Flint Scar, the core pickup, and the village return.
- Verified: screen-entry cards now identify village, Flint Scar entrance, animal clearing, and nearby animal-track hints.
- Verified: the minimap now shows a readable legend for `V`, `C`, `A`, `@`, and `?`.
- Verified: the Flint Scar entrance is visually labeled and still enters the dungeon.
- Verified: `npx.cmd playwright test` passed with 6/6 tests.

## What failed

- Untested: no new manual Samsung Galaxy S21 Ultra pass was run during this turn.

## Current exact state

- Verified: the first-run UX now explicitly guides the player east from the village.
- Verified: discoverability hints are implemented without adding new gameplay systems.
- Verified: the existing content loop, mobile controls, PACK/MAP, reset save, and fact popup still pass automation.
- Inferred: players should be able to find Flint Scar and animal content without blind wandering.

## Remaining blockers

- Samsung Galaxy S21 Ultra retest is still needed on the live build.
- No directional arrow is shown for undiscovered Flint Scar on the map; only the text guidance and discovered markers are present.

## Next actionable step

Open the live build on Samsung Galaxy S21 Ultra Chrome and confirm the welcome popup, objective strip, area cards, map legend, Flint Scar landmark, and animal-track hints are readable on real hardware.

## Evidence

- `artifacts/screenshots/discoverability-welcome-popup.png`
- `artifacts/screenshots/discoverability-objective-find-flint-scar.png`
- `artifacts/screenshots/discoverability-map-legend.png`
- `artifacts/screenshots/discoverability-flint-scar-marker.png`
- `artifacts/screenshots/discoverability-animal-clearing-hint.png`
- `artifacts/screenshots/discoverability-fact-popup.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/

## Samsung Galaxy S21 Ultra status

- Untested in this pass. Real-device retest still required.
