# Hearth Cooking Loop Report

## Goal

Make the village hearth matter by converting raw meat into food.

## What was done

Added a `Cook Meat` recipe/card and `rawMeat` inventory flow. The hearth now cooks raw meat when available.

## What was verified

- CRAFT shows `Cook Meat`.
- The recipe requires `1 Raw Meat + Village Hearth`.
- Cooking consumes raw meat and adds food.
- The objective updates to `Cook Raw Meat` until the meat is cooked.

## What failed

- None in the automated pass.

## Current exact state

Hunt -> raw meat -> hearth -> cooked food is now a real loop.

## Remaining blockers

Samsung phone retest still required.

## Next actionable step

Verify the cook step on Samsung Galaxy S21 Ultra after a successful hunt.

## Evidence

- `artifacts/screenshots/fire-spear-village-hearth.png`
- `artifacts/screenshots/fire-spear-small-game-hunt.png`

## Samsung Galaxy S21 Ultra status

Untested after the final carcass focus fix.
