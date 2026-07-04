# Harvested Carcass Cleanup Report

## Goal

Make harvested carcasses visibly change after harvesting instead of rendering as full downed carcasses.

## What was done

Cleared the `downed` flag on harvest and switched the renderer to prefer harvested state before downed state.

## What was verified

- `node tools/build-single-file.mjs` passes.
- `npx.cmd playwright test` passes.
- Harvested animals now have a distinct harvested state in test hooks.

## What failed

Nothing in the automated pass.

## Current exact state

Hunted animals now become a visible carcass, then a visibly harvested remnant after USE.

## Remaining blockers

Samsung Galaxy S21 Ultra retest still required.

## Next actionable step

Move into the next content pass after the harvesting loop.

## Evidence

- `artifacts/screenshots/fire-spear-small-game-carcass.png`
- `artifacts/screenshots/fire-spear-small-game-hunt.png`
- `artifacts/screenshots/content-hare-carcass.png`
- `artifacts/screenshots/content-hare-harvested.png`

## Samsung Galaxy S21 Ultra status

Untested after the cleanup fix.
