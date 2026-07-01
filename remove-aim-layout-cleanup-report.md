# Remove AIM Layout Cleanup Report

## Goal

Remove the unused AIM control from the Milestone 1 layout and keep the bottom controls clean before proceeding to Milestone 2.

## What was done

- verified: Created branch `fix/remove-aim-clean-layout`.
- verified: Removed the visible AIM strip from `src/dom.js`.
- verified: Removed the unused `aimStrip` DOM reference.
- verified: Removed unused `aimVector` input state and reset code.
- verified: Removed `.aim-strip` CSS from `tools/build-single-file.mjs`.
- verified: Rebalanced the bottom action cluster after removing the AIM column.
- verified: Rebuilt `dist/index.html`.
- verified: Updated Playwright mobile controls test to assert `#aimStrip` and `.aim-strip` are absent.

## What was verified

- verified: `node tools/build-single-file.mjs` passes.
- verified: `npx.cmd playwright test` passes.
- verified: 3 Playwright tests passed.
- verified: AIM control is absent from source and generated runtime except for test absence assertions.
- verified: `dist/index.html` was regenerated.
- verified: MOVE joystick still moves the player.
- verified: USE/GATHER still fails away from resources and succeeds near a flint node.
- verified: MAP tab still toggles minimap.
- verified: CRAFT/MENU still opens the placeholder modal.
- verified: DODGE/SPRINT still gives visible feedback and does not stick.
- verified: no console errors were captured by Playwright.
- verified: no uncaught page errors were captured by Playwright.
- verified: no unexpected external requests were captured by Playwright.

## What failed

- verified: Initial pre-edit Playwright run failed only because the local server was not running on port `8099`.
- verified: After starting the local server, the pre-edit suite passed.
- untested: Samsung Galaxy S21 Ultra Chrome has not yet been retested against this AIM cleanup build.

## Current exact state

- verified: Working branch is `fix/remove-aim-clean-layout`.
- verified: Runtime target remains `dist/index.html`.
- verified: Default local server port remains `8099`.
- verified: This is a Milestone 1 layout cleanup only; no aiming, bow, combat, customization editor, external assets, or Milestone 2 systems were added.
- proposed: Main branch and GitHub Pages deployment will be updated after this verified branch is pushed and merged/fast-forwarded.

## Remaining blockers

- untested: Real Samsung Galaxy S21 Ultra Chrome confirmation is still required from the user.

## Next actionable step

- proposed: Deploy to GitHub Pages, then open `https://falloutmule.github.io/otzi-iceman-game/` on Samsung Galaxy S21 Ultra Chrome and confirm AIM is gone and controls still work.

## Evidence

- verified: `artifacts/screenshots/no-aim-bottom-controls.png`
- verified: `artifacts/screenshots/clean-game-view-map-tab.png`
- verified: `artifacts/screenshots/gather-success-flint.png`
- verified: `artifacts/screenshots/menu-placeholder.png`
- verified: `artifacts/screenshots/joystick-bottom-panel.png`
- verified: `tests/mobile-controls.spec.js`
- verified: `remove-aim-layout-cleanup-report.md`
- verified: `artifacts/logs/playwright-smoke.txt`

## Live URLs

- verified: Repository: `https://github.com/falloutmule/otzi-iceman-game`
- proposed: GitHub Pages: `https://falloutmule.github.io/otzi-iceman-game/`

## Samsung Galaxy S21 Ultra status

- verified: User previously confirmed the field layout was much closer on Samsung Galaxy S21 Ultra Chrome.
- untested: This AIM removal build has not yet been confirmed on Samsung Galaxy S21 Ultra Chrome.

