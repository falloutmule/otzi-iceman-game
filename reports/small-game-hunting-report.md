# Small Game Hunting Report

## Goal

Make small-game interaction readable and useful with clearer catch, escape, and spear-hit outcomes.

## What was done

- Extended focused animal interaction to expose catch vs throw range.
- Added clearer status messaging:
  - `USE: catch hare`
  - `THROW: hunt hare with hardened spear`
- Kept escape feedback explicit.
- Added spear-hit food rewards and persistent hunt progression tracking.
- Preserved entity save/load state for caught and escaped animals.

## What was verified

- Verified: hare/grouse escape path still reports `escaped`.
- Verified: manual catch still awards food.
- Verified: spear hunting awards food and updates progression.
- Verified: the objective advances after the first successful spear hunt.
- Verified: Playwright content-loop and fire-spear tests pass.

## What failed

- Real Samsung readability for moving animal targets is still unverified.

## Current exact state

- Small game no longer depends on silent vanish behavior.
- Every tested outcome now reports a visible status message.

## Remaining blockers

- Device-level confirmation is still needed for moving target readability.

## Next actionable step

Retest a hare/grouse screen on Samsung and confirm the player can tell whether the animal was caught, escaped, or hit by the spear.

## Evidence

- `artifacts/screenshots/content-hare-caught.png`
- `artifacts/screenshots/fire-spear-small-game-hunt.png`
- `tests/content-loop.spec.js`

## Samsung Galaxy S21 Ultra status

- Untested in this pass.
