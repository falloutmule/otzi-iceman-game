# Mobile UI Shell Slop Cleanup Report

## Goal

Clean the mobile UI shell so future gameplay systems do not build on a cramped forced frame, permanent inventory stack, or crowded mid-screen stats strip.

## What was done

- Removed the default forced narrow phone frame from `#app`.
- Restored default mobile layout to full viewport width.
- Replaced the old HUD strip with:
  - `#popupBar` below the game viewport
  - `#controls` below the popup bar
  - `#statsStrip` below controls
- Moved MAP into the popup bar.
- Added PACK button to the popup bar.
- Added `inventoryPressed` to the input/action-map path.
- Added an inventory popup panel inside the game shell.
- Removed permanent full-inventory display from the HUD/stats area.
- Split survival stats into compact bottom chips:
  - HP
  - STAM
  - HUNGER
  - WARMTH
- Kept CRAFT/MENU as the crafting/menu modal, not the inventory button.
- Made MAP and PACK mutually exclusive popups.
- Kept AIM absent.
- Regenerated `dist/index.html`.

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- Playwright result: 4 tests passed.
- App uses more than 90% of mobile viewport width.
- Game viewport exists and is clear of persistent controls.
- Popup bar exists below the game.
- MAP button is in popup bar.
- PACK button is in popup bar.
- MAP and PACK buttons are not inside game shell.
- Controls are below popup bar.
- Stats are below controls.
- Full inventory list is not permanently visible in stats strip.
- PACK opens inventory popup.
- MAP opens minimap and hides inventory popup.
- Inventory popup shows resource counts.
- Gather still works.
- Crafting still works.
- Save/load test still passes.
- Joystick movement still works.
- No console errors, page errors, or unexpected external requests.

Inferred:

- The cleaned shell is a better foundation for Task 9 and later mobile UI growth.

Untested:

- Real Samsung Galaxy S21 Ultra retest after this cleanup.

## What failed

- One initial test assertion was too exact for a stamina value that can tick between snapshot and export.
- The assertion was corrected to a close numeric comparison.

## Current exact state

- Branch: `fix/mobile-ui-shell-slop`
- Layout order:
  - game viewport
  - popup button row
  - controls
  - bottom stats strip
- Inventory is now a popup opened by PACK.
- MAP is now a popup opened by MAP.
- Controls remain below game and popup row.
- Stats are last in the layout.

## Remaining blockers

- Samsung Galaxy S21 Ultra retest is still needed.

## Next actionable step

Open https://falloutmule.github.io/otzi-iceman-game/ on Samsung Galaxy S21 Ultra Chrome and confirm the app uses full width, MAP/PACK are below the game, inventory is a popup, controls are above stats, and the game screen is clear.

## Evidence

- `artifacts/screenshots/mobile-ui-clear-game.png`
- `artifacts/screenshots/mobile-ui-popupbar-map-pack.png`
- `artifacts/screenshots/mobile-ui-inventory-popup.png`
- `artifacts/screenshots/mobile-ui-map-popup.png`
- `artifacts/screenshots/mobile-ui-stats-below-controls.png`
- `artifacts/screenshots/mobile-ui-gather-still-works.png`
- `mobile-ui-shell-slop-cleanup-report.md`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Untested after this cleanup. User retest is required before considering the shell confirmed on physical hardware.

