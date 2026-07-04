# Carcass State Report

## Goal

Make hunted small game leave a visible downed carcass instead of disappearing.

## What was done

Hare and grouse now transition into a `downed` state on hit/catch and render as a carcass.

## What was verified

- Downed animals draw as a static body on the ground.
- The carcass can be focused after a throw.
- The status line shows a harvest prompt.

## What failed

- The carcass focus window was initially too narrow right after a throw.
- That was fixed by widening harvest focus range for downed animals.

## Current exact state

Carcasses are visible, static, and interactable with USE.

## Remaining blockers

Phone verification still needed.

## Next actionable step

Confirm the carcass is visible and harvestable on Samsung Galaxy S21 Ultra.

## Evidence

- `artifacts/screenshots/fire-spear-small-game-carcass.png`
- `artifacts/screenshots/content-hare-carcass.png`

## Samsung Galaxy S21 Ultra status

Untested after the final focus-range fix.
