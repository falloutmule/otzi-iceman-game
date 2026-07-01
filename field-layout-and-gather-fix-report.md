# Field Layout and Gather Fix Report

## Goal

Fix the Milestone 1 field layout and gather behavior on the existing Otzi GitHub Pages project without starting Milestone 2.

## What was done

- verified: Created branch `fix/field-layout-and-gather`.
- verified: Refactored the generated layout into three zones: game viewport, bottom HUD strip, and bottom controls panel.
- verified: Moved persistent stats and status out of the game viewport into the HUD strip.
- verified: Kept only a compact edge-mounted MAP tab on the game viewport.
- verified: Kept MOVE, USE/GATHER, DODGE/SPRINT, CRAFT/MENU, and AIM in the bottom controls panel.
- verified: Added real gather gating using nearest harvestable resource lookup.
- verified: USE/GATHER in empty space now shows `No resource nearby` and does not change inventory.
- verified: Flint gathering now requires a nearby rock/flint node.
- verified: Successful flint gather increments the visible flint count and depletes the node.
- verified: Depleted nodes change visual state and clear blocked/harvest flags.
- verified: Extended test hooks with nearest resource lookup and a stable resource teleport helper for automation.
- verified: Updated Playwright mobile controls coverage for layout and real gather behavior.

## What was verified

- verified: `node tools/build-single-file.mjs` passes.
- verified: `npx.cmd playwright test` passes.
- verified: `dist/index.html` was regenerated.
- verified: 3 Playwright tests passed.
- verified: Canvas game viewport is visually separate from the HUD strip and controls panel.
- verified: controls are below the game screen in screenshot evidence.
- verified: stats are below the game screen in screenshot evidence.
- verified: game viewport is clear except for the compact MAP tab.
- verified: USE/GATHER in empty space does not increase flint.
- verified: USE/GATHER near a real flint node increases flint.
- verified: gathered node depletes and is no longer reported as nearest resource.
- verified: MAP tab toggles the minimap.
- verified: CRAFT/MENU opens the placeholder modal.
- verified: DODGE/SPRINT gives visible feedback and does not leave sprint held.
- verified: joystick drag moves the player and release clears pointer state.
- verified: Playwright captured no console errors.
- verified: Playwright captured no uncaught page errors.
- verified: Playwright captured no unexpected external requests.

## What failed

- verified: Initial pre-edit Playwright run failed only because the local server was not running on port `8099`.
- verified: After starting the local server, the pre-edit suite passed.
- verified: During implementation, one test assertion still referenced removed `#toast`; it was updated to use the HUD `#statusLine`.
- untested: Samsung Galaxy S21 Ultra Chrome has not yet been retested against this fixed build.

## Current exact state

- verified: Fix branch `fix/field-layout-and-gather` was created and pushed.
- verified: `main` was fast-forwarded to the fix commit and pushed.
- verified: Runtime target remains `dist/index.html`.
- verified: Default local server port remains `8099`.
- verified: This remains Milestone 1 only; no Phaser, external assets, dungeons, crafting depth, or new progression systems were added.
- verified: GitHub Pages deployment succeeded for run `28550716668`.

## Remaining blockers

- untested: Real Samsung Galaxy S21 Ultra Chrome confirmation is still required from the user.
- untested: Real Android Chrome multitouch behavior is not proven by Playwright's emulated Pixel 7 profile.

## Next actionable step

- proposed: Open `https://falloutmule.github.io/otzi-iceman-game/` on Samsung Galaxy S21 Ultra Chrome and retest the new layout, MAP tab, and gather behavior near actual resource nodes.

## Evidence

- verified: `artifacts/screenshots/layout-bottom-controls.png`
- verified: `artifacts/screenshots/gather-fail-no-resource.png`
- verified: `artifacts/screenshots/gather-success-flint.png`
- verified: `artifacts/screenshots/map-tab-open.png`
- verified: `artifacts/screenshots/menu-placeholder.png`
- verified: `artifacts/screenshots/joystick-bottom-panel.png`
- verified: `tests/mobile-controls.spec.js`
- verified: `field-layout-and-gather-fix-report.md`
- verified: `artifacts/logs/playwright-smoke.txt`

## Live URLs

- verified: Repository: `https://github.com/falloutmule/otzi-iceman-game`
- verified: GitHub Pages: `https://falloutmule.github.io/otzi-iceman-game/`
- verified: Live GitHub Pages returned HTTP 200 with response length `41388`.
- verified: Live HTML contains the deployed field-layout and gather fix strings.

## Samsung Galaxy S21 Ultra status

- verified: User previously confirmed the earlier build loaded on Samsung Galaxy S21 Ultra Chrome.
- untested: This field-layout and gather fix has not yet been confirmed on Samsung Galaxy S21 Ultra Chrome.

