# Bug Pass: Resource Visibility, Reset, and Fullscreen Report

## Goal

Fix the reported invisible/unclear resource collection problem, tighten gather feedback, add a clear-save reset path, and add fullscreen as a menu utility before continuing gameplay tasks.

## What was done

- Tightened gather range:
  - `gatherRadius: 28`
  - `resourceNodeRadius: 24`
- Added a resource marker render pass in `src/render-world.js`.
- Added phone-visible active resource markers for:
  - flint
  - stick
  - stone
  - bark
  - grass
  - food
- Added nearest-resource highlight ring.
- Added passive nearby status text, such as `Nearby: flint`.
- Added two-step Reset Save button to CRAFT/MENU.
- Added `OTZI.save.clear()` to remove localStorage save data and reset game state.
- Added Fullscreen button to CRAFT/MENU.
- Added `src/fullscreen.js` with graceful fullscreen on/off/unavailable feedback.
- Updated tests for resource visibility, highlight, reset save, fullscreen button, and existing control paths.
- Regenerated `dist/index.html`.

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed using `OTZI_BASE_URL=file:///...` because the sandbox would not keep a local HTTP server alive.
- Playwright result: 4 tests passed.
- Far USE/GATHER fails with `No resource nearby`.
- Nearby resource appears in test hook.
- Nearby status appears before gather.
- Visible resource marker/highlight screenshots were produced.
- Gather succeeds near a visible resource.
- Gathered node depletes.
- Reset Save requires a second confirmation tap.
- Reset Save clears inventory and depleted resource state.
- Fullscreen button exists and gives fullscreen feedback without throwing.
- PACK popup still works.
- MAP popup still works.
- Controls still work.
- Stats remain below controls.
- AIM remains absent.
- No console errors, page errors, or unexpected external requests in Playwright.

Inferred:

- The reported invisible collection path should be addressed because active resource nodes are now drawn as explicit high-contrast markers, highlighted when gatherable, and require closer range.

Untested:

- Real Samsung Galaxy S21 Ultra retest after deployment.
- Manual fullscreen behavior on Android Chrome hardware.

## What failed

- `python -m http.server 8099` would not persist as a background server in this sandbox session, so HTTP-local Playwright baseline failed with `ERR_CONNECTION_REFUSED`.
- The same Playwright suite passed against `file:///` release artifact paths.

## Current exact state

- Branch: `fix/bug-pass-resource-visibility`
- Active resource markers are drawn from `OTZI.game.resourceNodes`.
- Depleted nodes no longer draw active collectible markers.
- Gather range is closer than before.
- Reset Save and Fullscreen are available from CRAFT/MENU.

## Remaining blockers

- Samsung Galaxy S21 Ultra retest is required.

## Next actionable step

Open https://falloutmule.github.io/otzi-iceman-game/ on Samsung Galaxy S21 Ultra Chrome and confirm resources are visibly collectible, no invisible gathering occurs, reset save works, fullscreen is in the menu, and the controls still behave.

## Evidence

- `artifacts/screenshots/bugpass-resource-markers.png`
- `artifacts/screenshots/bugpass-nearby-resource-highlight.png`
- `artifacts/screenshots/bugpass-gather-visible-resource.png`
- `artifacts/screenshots/bugpass-depleted-resource.png`
- `artifacts/screenshots/bugpass-pack-popup-after-reset.png`
- `artifacts/screenshots/bugpass-menu-fullscreen-reset.png`
- `artifacts/screenshots/mobile-ui-clear-game.png`
- `bugpass-resource-visibility-fullscreen-report.md`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Untested after this bug pass. User retest is required before claiming hardware verification.

