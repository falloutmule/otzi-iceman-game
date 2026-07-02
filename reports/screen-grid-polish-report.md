# Screen Grid Polish Report

## Goal

Polish the screen-grid runtime with sliding transitions, clearer overworld and dungeon map modes, save/load cleanup, and an updated GitHub Pages workflow.

## What was done

- Added a real `transition` state for overworld screen travel.
- Added short screen-slide rendering with both source and destination screens drawn during movement.
- Froze and cleared input during transitions to avoid bounce loops and stale movement.
- Polished the MAP popup into two explicit modes:
  - `OVERWORLD MAP`
  - `FLINT SCAR MAP`
- Added overworld map symbols for:
  - current screen
  - village/home
  - Flint Scar entrance
  - undiscovered screens
- Added dungeon room-grid map symbols for:
  - current room
  - discovered rooms
  - exit room
- Removed stale top-level save payload resource deltas left over from the one-big-map era.
- Extended test hooks with transition state, grid dimensions, and transition-settle helpers.
- Updated `.github/workflows/pages.yml` to:
  - `actions/checkout@v7`
  - `actions/configure-pages@v6`
  - `actions/upload-pages-artifact@v5`
  - `actions/deploy-pages@v5`
- Regenerated `dist/index.html`.

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- Automated result: 4 tests passed.
- East, south, north, and west screen transitions activate a slide state and then settle.
- Transition state is visible in `window.__OTZI_TEST__.snapshot()`.
- Input does not remain stuck after transition.
- Discovered screen count increases after entering new screens.
- OVERWORLD MAP mode renders and remains separate from the old tile-radar behavior.
- FLINT SCAR MAP mode renders while inside the dungeon stub.
- Flint Scar enter and exit still work.
- Gather still works after screen transition.
- Save/load still restores:
  - overworld screen
  - dungeon room
  - discovered state
  - depleted screen-local resources
- Reset save clears inventory and screen-grid discovery state.
- GitHub Pages deploy run `28583428816` succeeded.
- The previous Node 20 deprecation warning did not appear on run `28583428816`.
- Live URL returns HTTP 200.

Inferred:

- Updating the Pages actions to the newer official major versions resolved the earlier Node 20 deprecation warning path for this workflow.

Untested:

- Manual Samsung Galaxy S21 Ultra retest after this polish deploy.
- Long-form repeated screen travel on physical hardware.

## What failed

- No build, Playwright, or Pages deployment failed in the final polish pass.
- No remaining Node 20 warning was observed on the final Pages run.

## Current exact state

- Branch: `fix/screen-grid-polish`
- Commit hash: `4935224`
- Main branch includes the polish commit.
- Live runtime includes:
  - sliding screen transitions
  - overworld discovered-screen map
  - Flint Scar room-grid map
  - screen-grid save/load state

## Remaining blockers

- Samsung Galaxy S21 Ultra retest is still required before calling the polish hardware-verified.

## Next actionable step

Begin Milestone 3A on top of this runtime:
Flint Scar resource-run objective, completion flag, and return-to-village progression.

## Evidence

- `reports/backups/index.before-screen-grid-polish.html`
- `artifacts/screenshots/screen-slide-north.png`
- `artifacts/screenshots/screen-slide-east.png`
- `artifacts/screenshots/overworld-discovered-minimap.png`
- `artifacts/screenshots/dungeon-room-minimap.png`
- `artifacts/screenshots/flint-scar-enter-exit.png`
- `artifacts/screenshots/post-transition-resource-gather.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game/
- Branch compare target: https://github.com/falloutmule/otzi-iceman-game/tree/fix/screen-grid-polish

## Samsung Galaxy S21 Ultra status

Untested after this screen-grid polish deploy. User retest is required.

## GitHub Pages workflow status

Verified:

- Workflow file now references current official major versions from the GitHub Actions repositories:
  - `actions/checkout@v7`
  - `actions/configure-pages@v6`
  - `actions/upload-pages-artifact@v5`
  - `actions/deploy-pages@v5`
- Deploy run id: `28583428816`
- Result: success
- Node 20 deprecation warning: not observed on this run
