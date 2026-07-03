# Fire Spear Small Game Integration Report

## Goal

Lock the post-Toolmaker gameplay loop:

- craft crude spear
- harden spear at the hearth
- hunt small game
- save/reload the resulting state

## What was done

- Added spear equip/throw gameplay state.
- Added the `THROW / TOOL` action button.
- Split catch vs throw interaction for small game.
- Improved hearth mission clarity and status messaging.
- Bumped build/save markers for the new state:
  - build `otzi-fire-spear-0.5.0`
  - save version `7`
- Rebuilt the single-file release artifact.

## What was verified

- Verified: `node tools/build-single-file.mjs` passes.
- Verified: `npx.cmd playwright test` passes.
- Verified: all 7 Playwright tests passed.
- Verified: crude spear can be crafted and equipped.
- Verified: hardened spear can be created at the hearth.
- Verified: hardened spear can hunt small game.
- Verified: hunt progression survives save/load.
- Verified: no console errors in Playwright runs.
- Verified: no unexpected external requests in Playwright runs.

## What failed

- Samsung Galaxy S21 Ultra confirmation is still pending.
- Public deployment verification is still pending for this exact build.

## Current exact state

- Local release artifact contains the fire/spear/small-game loop.
- Automated test coverage is green.
- The next remaining step is deployment proof and Samsung retest.

## Remaining blockers

- Push/deploy this build.
- Verify the public Pages HTML markers for the new build.
- Collect Samsung screenshot evidence.

## Next actionable step

Deploy the build, verify the public URL markers for `otzi-fire-spear-0.5.0`, then retest on Samsung Galaxy S21 Ultra Chrome.

## Evidence

- `artifacts/screenshots/fire-spear-menu-craft.png`
- `artifacts/screenshots/fire-spear-village-hearth.png`
- `artifacts/screenshots/fire-spear-hardened-objective.png`
- `artifacts/screenshots/fire-spear-small-game-hunt.png`
- `artifacts/screenshots/fire-spear-bottom-controls.png`

## Samsung Galaxy S21 Ultra status

- Untested in this pass.
