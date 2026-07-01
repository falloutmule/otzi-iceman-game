# Remove AIM and Move MAP to HUD Report

## Goal

Finish the Milestone 1 layout cleanup by deploying the existing AIM removal and moving MAP from the game viewport into the stats/HUD bar.

## What was done

- verified: Continued from local branch `fix/remove-aim-clean-layout`.
- verified: Confirmed local AIM removal commit `87465ef` exists.
- verified: Moved `#mapTab` out of `#gameShell` and into `#hudStrip`.
- verified: Replaced edge-mounted MAP CSS with HUD-bar button styling.
- verified: Kept minimap panel compact and allowed it to overlay the game viewport only when opened.
- verified: Added Playwright assertions that AIM is absent.
- verified: Added Playwright assertions that MAP is visible inside HUD and absent from the game shell.
- verified: Added Playwright assertions that game shell has no MOVE, USE, SPRINT, or MENU controls.
- verified: Rebuilt `dist/index.html`.

## What was verified

- verified: `node tools/build-single-file.mjs` passes.
- verified: `npx.cmd playwright test` passes.
- verified: 3 Playwright tests passed.
- verified: Generated `dist/index.html` has no runtime `aimStrip`, `.aim-strip`, `aimVector`, or visible `>AIM<`.
- verified: `#hudStrip #mapTab` is visible in Playwright.
- verified: `#gameShell > #mapTab` is absent in Playwright.
- verified: `#gameShell` contains no joystick or action buttons.
- verified: bottom controls still contain MOVE, USE/GATHER, DODGE/SPRINT, and CRAFT/MENU.
- verified: MAP still toggles minimap.
- verified: empty-space gather still fails.
- verified: gather near a real flint node still succeeds.
- verified: joystick drag still moves the player.
- verified: CRAFT/MENU still opens the placeholder modal.
- verified: DODGE/SPRINT still gives feedback and does not stick.
- verified: no console errors were captured by Playwright.
- verified: no uncaught page errors were captured by Playwright.
- verified: no unexpected external requests were captured by Playwright.

## What failed

- verified: Initial test attempts failed only when the local server was not running on port `8099`.
- verified: After starting the local server, the suite passed.
- untested: Samsung Galaxy S21 Ultra Chrome has not yet been retested against this MAP-to-HUD build.

## Current exact state

- verified: Branch `fix/remove-aim-clean-layout` was pushed.
- verified: Latest local commit before this MAP move is `87465ef Remove unused AIM control from Milestone 1 layout`.
- verified: Runtime target remains `dist/index.html`.
- verified: Default local server port remains `8099`.
- verified: `main` was fast-forwarded to `45d9ce0` and pushed.
- verified: GitHub Pages deployment succeeded for run `28553999194`.

## Remaining blockers

- untested: Real Samsung Galaxy S21 Ultra Chrome confirmation is still required from the user after deployment.

## Next actionable step

- proposed: Open `https://falloutmule.github.io/otzi-iceman-game/` on Samsung Galaxy S21 Ultra Chrome and confirm AIM is gone, MAP is in the stats bar, and controls still work.

## Evidence

- verified: `artifacts/screenshots/no-aim-map-in-hud.png`
- verified: `artifacts/screenshots/clear-game-viewport-no-controls.png`
- verified: `artifacts/screenshots/hud-map-button-minimap-open.png`
- verified: `artifacts/screenshots/gather-success-flint.png`
- verified: `artifacts/screenshots/menu-placeholder.png`
- verified: `artifacts/screenshots/joystick-bottom-panel.png`
- verified: `tests/mobile-controls.spec.js`
- verified: `remove-aim-map-to-hud-report.md`

## Live URLs

- verified: Repository: `https://github.com/falloutmule/otzi-iceman-game`
- verified: GitHub Pages: `https://falloutmule.github.io/otzi-iceman-game/`
- verified: Live GitHub Pages returned HTTP 200 with response length `40743`.
- verified: Live HTML has no runtime AIM control strings.
- verified: Live HTML contains MAP in the HUD layout.
- verified: Live HTML no longer contains edge-mounted MAP `writing-mode:vertical-rl` CSS.

## Samsung Galaxy S21 Ultra status

- verified: User reported the pre-cleanup live build still showed AIM because the previous local branch was not deployed.
- untested: This AIM removal plus MAP-to-HUD build has not yet been confirmed on Samsung Galaxy S21 Ultra Chrome.
