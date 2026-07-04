# Carcass Harvest Report

## Goal

Harvest a downed animal into raw meat.

## What was done

The USE action on a downed hare or grouse now adds `rawMeat +1` and marks the carcass harvested.

## What was verified

- Harvest toast appears.
- Raw meat is added to inventory.
- The harvested carcass becomes a faint remnant instead of a live animal.

## What failed

- None in Playwright after the focus-range fix.

## Current exact state

Harvest is a separate step after downing an animal.

## Remaining blockers

Samsung phone retest still required.

## Next actionable step

Verify harvest after downing on Samsung Galaxy S21 Ultra.

## Evidence

- `artifacts/screenshots/fire-spear-small-game-hunt.png`
- `artifacts/screenshots/content-hare-harvested.png`

## Samsung Galaxy S21 Ultra status

Untested after the final carcass focus fix.
