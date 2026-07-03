# Spear Equip Throw Report

## Goal

Turn crude and hardened spears into usable equipment with a real throw action.

## What was done

- Added equipped spear state under gameplay state.
- Added a third gameplay action button: `THROW / TOOL`.
- Added `Equip Crude Spear` and `Equip Hardened Spear` controls to `CRAFT`.
- Added spear persistence to save/load.
- Added crude/hardened spear outcome rules:
  - crude spear is lost after a throw
  - hardened spear tracks durability and survives limited throws

## What was verified

- Verified: player can craft a crude spear.
- Verified: player can equip a crude spear.
- Verified: player can harden a crude spear at the hearth.
- Verified: player can equip and throw a hardened spear.
- Verified: save/load preserves spear inventory, equipped state, and hunt progression.
- Verified: Playwright `tests/fire-spear.spec.js` passes.

## What failed

- Real phone throw feel was not manually verified in this session.

## Current exact state

- Bottom action cluster is now:
  - `USE / GATHER`
  - `DODGE / SPRINT`
  - `THROW / TOOL`
- `CRAFT` contains the equip controls and spear state hints.

## Remaining blockers

- Samsung throw usability retest is still needed.

## Next actionable step

Retest the deployed build on Samsung and confirm spear equip and throw feel readable with the new button.

## Evidence

- `artifacts/screenshots/fire-spear-menu-craft.png`
- `artifacts/screenshots/fire-spear-bottom-controls.png`
- `artifacts/screenshots/fire-spear-hardened-objective.png`

## Samsung Galaxy S21 Ultra status

- Untested in this pass.
