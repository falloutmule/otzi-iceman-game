# Spear Feedback Recovery Report

## Goal

Make thrown spear outcomes readable and recoverable.

## What was done

Throw results now report whether the animal was downed and whether the spear was recovered or lost. Hardened spears keep durability; crude spears remain single-use.

## What was verified

- The throw status message is visible.
- Hardened spear feedback includes recovery/loss.
- The bottom action button still reflects the equipped spear.

## What failed

- The first pass did not keep the carcass focused long enough for immediate harvest.
- That was fixed by widening downed carcass focus range.

## Current exact state

Throw -> downed carcass -> harvest -> cook is the intended flow.

## Remaining blockers

Samsung Galaxy S21 Ultra retest still required.

## Next actionable step

Confirm throw, harvest, and spear feedback on the phone build.

## Evidence

- `artifacts/screenshots/fire-spear-small-game-carcass.png`
- `artifacts/screenshots/hardened-spear-equipped.png`

## Samsung Galaxy S21 Ultra status

Untested after the final carcass focus fix.
