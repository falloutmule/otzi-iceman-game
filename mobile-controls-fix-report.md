# Mobile Controls Fix Report

## Goal

Fix and verify Milestone 1 mobile controls on the existing Otzi GitHub Pages project without starting Milestone 2.

## What was done

- verified: Fixed mobile sprint input so a tap does not leave sprint stuck active.
- verified: Added release/cancel cleanup for sprint and joystick state.
- verified: Added input cleanup on blur, hidden visibility state, orientation change, menu open, and scene transition hooks.
- verified: Added visible USE/GATHER feedback with `Gathered flint +1`.
- verified: Added visible `FLINT: N` inventory chip.
- verified: Added visible MAP toggle with a simple trail map overlay.
- verified: Added visible CRAFT/MENU placeholder modal with seed, flint, stamina, and Close button.
- verified: Added visible DODGE/SPRINT feedback with stamina reduction and `Dodge/Sprint burst` toast.
- verified: Compact mobile topbar, separated toast/status, and moved debug panel below status.
- verified: Added stable test hook fields for minimap, menu, status, and sprint/move input state.
- verified: Added `tests/mobile-controls.spec.js` covering phone control paths.

## What was verified

- verified: `node tools/build-single-file.mjs` passes.
- verified: `npx.cmd playwright test` passes.
- verified: 3 Playwright tests pass: baseline starter, existing smoke, mobile controls.
- verified: `dist/index.html` was regenerated.
- verified: USE/GATHER tap increments flint and shows visible feedback.
- verified: MAP tap opens a visible minimap overlay.
- verified: CRAFT/MENU tap opens a visible placeholder modal and can close.
- verified: DODGE/SPRINT tap lowers stamina and does not leave sprint held.
- verified: MOVE joystick drag changes player position in automated test.
- verified: joystick release clears active pointer state.
- verified: no console errors were captured by Playwright.
- verified: no uncaught page errors were captured by Playwright.
- verified: no unexpected external requests were captured by Playwright.
- verified: screenshot evidence was generated.

## What failed

- verified: No local build or Playwright failures remained after the control fixes.
- untested: Real Samsung Galaxy S21 Ultra Chrome has not yet been retested against the fixed build.

## Current exact state

- verified: Fix branch `fix/mobile-controls-m1` was created and pushed.
- verified: `main` was fast-forwarded to the fix commit and pushed.
- verified: Runtime target remains `dist/index.html`.
- verified: Default local server port remains `8099`.
- verified: This remains Milestone 1 only; no crafting depth, dungeons, new progression, or new engine dependency was added.
- verified: GitHub Pages deployment succeeded for run `28548947556`.

## Remaining blockers

- untested: Samsung Galaxy S21 Ultra hardware confirmation is still required from the user.
- untested: Android Chrome real multitouch behavior is not proven by Playwright's emulated Pixel 7 profile.

## Next actionable step

- proposed: Open `https://falloutmule.github.io/otzi-iceman-game/` on Samsung Galaxy S21 Ultra Chrome and test USE, MAP, CRAFT/MENU, DODGE/SPRINT, and MOVE.

## Evidence

- verified: `artifacts/screenshots/mobile-controls-start.png`
- verified: `artifacts/screenshots/mobile-controls-use.png`
- verified: `artifacts/screenshots/mobile-controls-map.png`
- verified: `artifacts/screenshots/mobile-controls-menu.png`
- verified: `artifacts/screenshots/mobile-controls-joystick.png`
- verified: `tests/mobile-controls.spec.js`
- verified: `mobile-controls-fix-report.md`

## Live URLs

- verified: Repository: `https://github.com/falloutmule/otzi-iceman-game`
- verified: GitHub Pages: `https://falloutmule.github.io/otzi-iceman-game/`
- verified: Live GitHub Pages returned HTTP 200 with response length `38117`.
- verified: Live HTML contains the deployed mobile controls fix strings.

## Samsung Galaxy S21 Ultra status

- verified: User previously confirmed the old build loaded on Samsung Galaxy S21 Ultra Chrome.
- untested: The fixed build has not yet been confirmed on Samsung Galaxy S21 Ultra Chrome.

