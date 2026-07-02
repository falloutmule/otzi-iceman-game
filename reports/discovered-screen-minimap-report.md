# Discovered Screen Minimap Report

## Goal

Convert the MAP popup from a live camera radar into a discovered overworld screen map.

## What was done

- Replaced tile-radar minimap rendering with discovered-screen grid rendering.
- Added current-screen highlighting for overworld.
- Hid undiscovered screens until visited.
- Added dungeon-room placeholder minimap mode for Flint Scar.

## What was verified

Verified:

- MAP opens the popup and renders the overworld discovered-screen grid.
- Entering new screens increases discovered count.
- Current-screen marker moves with screen transitions.
- Dungeon mode swaps the minimap title and grid mode.

Inferred:

- The MAP popup is now aligned with screen-grid progression instead of camera position.

Untested:

- Final art direction for biome colors and future completion markers.

## What failed

- No minimap-specific failure remained after the screen-grid render pass.

## Current exact state

- Overworld MAP shows discovered screens only.
- Dungeon MAP shows a simple room-grid placeholder for Flint Scar.

## Remaining blockers

- Add future icons for completed runs and special landmarks when those systems exist.

## Next actionable step

Use discovered-screen data for later village, dungeon, and completion markers instead of reviving the old radar map.
