# Content Pack 0.6 Report

## Goal
Add usable food, a repeatable small-game content pack, Birch Grove, and Wolf Signs.

## What was done
- Added `Eat Food` to the CRAFT panel with readable requirements and hunger recovery.
- Added `birch_grove` as a deterministic overworld content screen with visible bark resources.
- Added `wolf_signs` as a deterministic overworld warning screen with no combat.
- Added SYSTEM QA helper actions for food and the new content destinations.
- Bumped the build marker to `otzi-content-0.6.0`.
- Fixed the Birch Grove / Wolf Signs landmark rendering bug caused by an undefined `x`.

## What was verified
- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- `tests/content-pack.spec.js` passed on Pixel 7 emulation.
- CRAFT shows readable `Eat Food` requirements and hunger drops when food is eaten.
- Birch Grove and Wolf Signs are present in the screen grid and appear in the MAP legend.
- The harvested-carcass render bug remains fixed from the prior pass.

## What failed
- Samsung Galaxy S21 Ultra retest has not been completed in this turn.

## Current exact state
- Local `main` has the content pack changes and a passing test suite.
- `dist/index.html` has been regenerated with `otzi-content-0.6.0`.
- The new content is in source and test-covered.
- GitHub Pages workflow run `28704085384` succeeded.
- Public cache-busted HTML contains `otzi-content-0.6.0`, `Eat Food`, `Birch Grove`, `Wolf Signs`, and `menuBuildVersion`.

## Remaining blockers
- Samsung Galaxy S21 Ultra confirmation still needs to happen.
- Samsung phone retest is still useful for final device confirmation, but it is not blocking the build.

## Next actionable step
Open the live Pages URL on Samsung Galaxy S21 Ultra Chrome and confirm `Eat Food`, Birch Grove, and Wolf Signs on device.

## Evidence
- `artifacts/screenshots/content-eat-food-ready.png`
- `artifacts/screenshots/content-birch-grove.png`
- `artifacts/screenshots/content-wolf-signs.png`
- `artifacts/screenshots/content-pack-map-legend.png`

## Live URLs
- Repo: https://github.com/falloutmule/otzi-iceman-game
- Live: https://falloutmule.github.io/otzi-iceman-game/

## Samsung Galaxy S21 Ultra status
- verified: local build, tests, workflow, and public HTML markers
- inferred: device retest should still pass with the deployed artifact
- proposed: retest `Eat Food`, Birch Grove, and Wolf Signs on Samsung
- untested: Samsung device confirmation for this specific content pack turn
