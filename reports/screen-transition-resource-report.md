# Screen Transition and Resource Report

## Goal

Make screen-edge travel move the player between overworld screens while keeping resources local to the active screen.

## What was done

- Added north, south, east, and west edge transitions for overworld screens.
- Moved resource ownership from one global list to per-screen `screen.resources`.
- Kept resource focus, labels, and depletion on the active screen only.
- Updated save/test-hook plumbing so depleted resources persist by area id instead of one global map id.

## What was verified

Verified:

- Playwright transitions across screen edges and confirms discovered count increases.
- Resource gathering occurs on the active screen after a screen transition.
- Depleted resources remain depleted after save/reload.

Inferred:

- Leaving and returning to a screen reuses the cached/generated screen state instead of rebuilding a fresh resource list.

Untested:

- Long-form manual travel across many screens on physical hardware.

## What failed

- No runtime regression remained after the test helper was corrected to hit the true transition threshold.

## Current exact state

- Village home screen starts without gatherable resources.
- Forest and scar screens generate local resource sets.
- Gather logic still requires an explicit focused resource.

## Remaining blockers

- None for the screen-local resource foundation.

## Next actionable step

Use the screen-local model for future cave objectives, return flags, and village unlock work.
