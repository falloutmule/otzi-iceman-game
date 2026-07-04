# Samsung Fire/Spear Phone Pass Report

## Goal

Record the current Samsung Galaxy S21 Ultra fire/spear state before changing hunting again.

## What was done

Verified the current loop with Playwright and the live build marker `otzi-fire-spear-0.5.3`.

## What was verified

- CRAFT recipe cards are readable.
- SYSTEM QA tools work.
- Crude spear can be crafted.
- Hunting resolves to a visible downed result.
- Raw meat can be harvested.
- Raw meat can be cooked at the hearth.

## What failed

- The first pass had a focus-loss gap after the animal was downed.
- That gap was closed by widening carcass harvest focus.

## Current exact state

The hunting loop now leaves a visible carcass state and supports harvest/cook flow.

## Remaining blockers

Samsung Galaxy S21 Ultra retest still required for phone confirmation.

## Next actionable step

Open the live build on Samsung Galaxy S21 Ultra and confirm carcass harvest works after a throw.

## Evidence

- `artifacts/screenshots/fire-spear-small-game-carcass.png`
- `artifacts/screenshots/fire-spear-small-game-hunt.png`
- `artifacts/screenshots/fire-spear-village-hearth.png`
- `artifacts/screenshots/hardened-spear-equipped.png`

## Samsung Galaxy S21 Ultra status

Untested after the carcass harvest fix.
