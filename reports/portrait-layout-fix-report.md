# Portrait Layout Fix Report

## Goal

Fix the live layout so the game presents as portrait instead of stretching into a landscape perspective.

## What was done

- Constrained the app to a portrait phone frame.
- Moved the canvas into `#gameShell` at runtime so it fills only the game viewport.
- Made `#gameShell`, HUD, and controls respect the same portrait frame width.
- Added compact landscape CSS so if the browser viewport is wide, the app still renders as a portrait-framed game.
- Added Playwright assertions that:
  - the app frame is taller than wide
  - the game viewport is taller than wide
  - controls remain below the game viewport
  - the portrait frame still holds inside a landscape browser viewport
- Added screenshot evidence for landscape browser viewport:
  - `artifacts/screenshots/portrait-frame-landscape-viewport.png`

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- Playwright result: 4 tests passed.
- Game viewport and canvas now share the same portrait box.
- AIM remains absent.
- Existing controls, gather, inventory, crafting, survival, save/load, and minimap tests still pass.

## What failed

- Initial test attempts failed because the overlay grid was wider than the app frame.
- Fixed by moving the canvas into `#gameShell` and constraining grid children.

## Current exact state

- Portrait framing is enforced in CSS.
- Landscape browser viewports now show a portrait-framed game instead of stretching the game into landscape.

## Remaining blockers

- Samsung Galaxy S21 Ultra retest is needed to confirm the live phone now reads as portrait.

## Next actionable step

Open the live GitHub Pages URL on Samsung Galaxy S21 Ultra Chrome and confirm the game is portrait-framed.

## Evidence

- `tools/build-single-file.mjs`
- `src/dom.js`
- `tests/mobile-controls.spec.js`
- `artifacts/screenshots/portrait-frame-landscape-viewport.png`
- `artifacts/screenshots/clear-game-viewport-no-controls.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Not yet retested after this portrait layout fix.

