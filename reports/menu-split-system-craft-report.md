# Menu Split: System and Craft Report

## Goal

Split the overloaded top-level menu into two cleaner panels:

- `CRAFT` for inventory and recipes
- `SYSTEM` for help, fullscreen, reset, fact access, and build info

without adding new gameplay content.

## What was done

- Replaced the top utility row from `MAP | MENU | PACK` to `MAP | CRAFT | SYSTEM`.
- Removed the old separate top-level `PACK` button.
- Removed the old standalone pack popup.
- Converted the old inventory role into a modal `CRAFT` panel containing:
  - inventory counts
  - crude cutting tool recipe
  - crude spear recipe
  - hearth hardening action
  - contextual craft hint text
- Converted the old overloaded menu into a `SYSTEM` panel containing:
  - objective help
  - latest fact access
  - fullscreen
  - reset save
  - seed/toolmaker/stamina summary
  - build metadata
- Kept the bottom gameplay cluster action-only:
  - `USE / GATHER`
  - `DODGE / SPRINT`
- Updated objective text so spear progression points the player to `CRAFT`, not `MENU`.
- Added modal behavior so opening `MAP`, `CRAFT`, or `SYSTEM` closes the others and movement pauses while open.
- Added a craft-side harden button that only enables when the player is near the hearth with a crude spear.

## What was verified

- Verified: `node tools/build-single-file.mjs` passes.
- Verified: `npx.cmd playwright test` passes.
- Verified: 7 Playwright tests passed.
- Verified: top row contains `MAP`, `CRAFT`, and `SYSTEM`.
- Verified: top row no longer contains `PACK`.
- Verified: bottom controls do not contain menu controls.
- Verified: `CRAFT` contains inventory counts and recipe buttons.
- Verified: `SYSTEM` contains fullscreen, reset save, objective help, and build metadata.
- Verified: one panel opening closes the others.
- Verified: spear/hearth flow still works through the new `CRAFT` panel.

## What failed

- Real Samsung confirmation has not happened yet for this split.
- No new gameplay content was added in this pass by design.

## Current exact state

- Player-facing top utility row is now `MAP | CRAFT | SYSTEM`.
- Inventory is no longer its own top-level panel.
- Crafting and hearth hardening are grouped under `CRAFT`.
- Help/system/build/reset/fact access are grouped under `SYSTEM`.
- Bottom controls remain gameplay-only.

## Remaining blockers

- Samsung Galaxy S21 Ultra retest is still needed to confirm:
  - top row readability and spacing
  - CRAFT/SYSTEM tap comfort
  - panel stacking on real phone
  - no stray control overlap on Android Chrome

## Next actionable step

Deploy this split, confirm the public URL contains the `CRAFT` and `SYSTEM` markers, then retest on Samsung before starting the spear throwing / small-game hunting pass.

## Evidence

- `artifacts/screenshots/menu-split-top-row.png`
- `artifacts/screenshots/craft-panel-inventory-recipes.png`
- `artifacts/screenshots/system-panel-options-build.png`
- `artifacts/screenshots/map-panel-still-works.png`
- `artifacts/screenshots/bottom-controls-action-only.png`

## Samsung Galaxy S21 Ultra status

- Untested in this pass.
- Previous Samsung screenshots remain valid proof for earlier stale-build and menu-overload issues.
- New Samsung screenshot is still required to mark the split verified on device.
