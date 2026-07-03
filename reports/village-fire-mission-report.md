# Village Fire Mission Report

## Goal

Make the village hearth read as a real mission station for the spear-hardening loop.

## What was done

- Strengthened the hearth landmark with a visible `HEARTH` label and animated flame pulse.
- Kept the village objective chain explicit:
  - craft crude spear
  - harden spear at hearth
  - hunt small game
- Updated status/help flow so the hearth focus reads `USE: harden spear tip`.
- Preserved hearth interaction inside the existing village screen identity pass.

## What was verified

- Verified: village hearth remains visible in the release artifact.
- Verified: harden action only enables in `CRAFT` when near the hearth with a crude spear.
- Verified: objective text updates across crude spear, harden, and hunt steps.
- Verified: Playwright fire-spear test passes.

## What failed

- Real Samsung clarity for the flame landmark is still unverified.

## Current exact state

- The village hearth is now both a visual landmark and an active mission step.

## Remaining blockers

- Phone screenshot proof is still needed for the hearth emphasis.

## Next actionable step

Open the deployed build on Samsung and confirm the hut/hearth area is obvious enough to teach the hardening loop without guessing.

## Evidence

- `artifacts/screenshots/fire-spear-village-hearth.png`
- `artifacts/screenshots/fire-spear-hardened-objective.png`

## Samsung Galaxy S21 Ultra status

- Untested in this pass.
