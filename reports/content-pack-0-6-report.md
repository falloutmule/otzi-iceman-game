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
- Public Pages verification was not re-checked in this turn after the new build.

## Current exact state
- Local `main` has the content pack changes and a passing test suite.
- `dist/index.html` has been regenerated with `otzi-content-0.6.0`.
- The new content is in source and test-covered.

## Remaining blockers
- Samsung Galaxy S21 Ultra confirmation still needs to happen.
- Public GitHub Pages verification still needs a fresh cache-busted check.

## Next actionable step
Commit and push the content pack changes, then verify the live Pages URL on Samsung Galaxy S21 Ultra Chrome.

## Evidence
- `artifacts/screenshots/content-eat-food-ready.png`
- `artifacts/screenshots/content-birch-grove.png`
- `artifacts/screenshots/content-wolf-signs.png`
- `artifacts/screenshots/content-pack-map-legend.png`

## Live URLs
- Repo: https://github.com/falloutmule/otzi-iceman-game
- Live: https://falloutmule.github.io/otzi-iceman-game/

## Samsung Galaxy S21 Ultra status
- verified: not yet for this content pack turn
- inferred: the local build is ready for the next phone check
- proposed: retest `Eat Food`, Birch Grove, and Wolf Signs on device
- untested: live public Pages marker after this build
