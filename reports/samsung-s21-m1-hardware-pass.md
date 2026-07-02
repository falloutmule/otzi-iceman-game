# Samsung S21 M1 Hardware Pass

## Goal

Confirm the current live Milestone 1 build is acceptable on Samsung Galaxy S21 Ultra Chrome before adding Milestone 2 systems.

## What was done

- Recorded the user-reported phone pass from July 1, 2026.
- Treated this as the final hardware confirmation for the current Milestone 1 layout/input shell.
- Kept this report separate from automated Playwright evidence because real-device evidence comes from the user's Samsung Galaxy S21 Ultra test.

## What was verified

Verified by user report:

- AIM is gone.
- MAP is in the stats/HUD bar.
- Game screen is clear.
- MOVE works.
- USE/GATHER works only near resources.
- DODGE/SPRINT does not stick.
- CRAFT/MENU opens.
- MAP opens minimap.
- Phone checks passed after the latest GitHub Pages deployment.

Verified by automation in this repo:

- Playwright mobile/control tests pass.
- Automated tests verify no AIM control exists in the runtime DOM.
- Automated tests verify MAP is inside the HUD strip.
- Automated tests verify bottom controls remain outside the game viewport.

## What failed

- No current failure was reported during the final phone check.
- A phone screenshot was not added to this repository during this pass.

## Current exact state

- Milestone 1 is accepted by user phone check on Samsung Galaxy S21 Ultra Chrome.
- Live URL: https://falloutmule.github.io/otzi-iceman-game/
- The current live build is suitable to lock as the Milestone 1 baseline before Milestone 2 resource-system work.

## Remaining blockers

- None for the Milestone 1 lock.
- Future Samsung checks should be repeated after substantial UI/input changes.

## Next actionable step

Create the Milestone 1 lock report, tag the baseline as `m1-engine-shell`, and then begin Task 3: resource node data model cleanup.

## Evidence

- User report in Codex thread: "Phone checks. Proceed with your tasks."
- Automated screenshots:
  - `artifacts/screenshots/no-aim-map-in-hud.png`
  - `artifacts/screenshots/clear-game-viewport-no-controls.png`
  - `artifacts/screenshots/gather-success-flint.png`
  - `artifacts/screenshots/hud-map-button-minimap-open.png`
  - `artifacts/screenshots/joystick-bottom-panel.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Verified by user report. Not independently reproduced by Codex on physical hardware.

