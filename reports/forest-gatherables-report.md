# Forest Gatherables Report

## Goal

Add all first-pass forest gatherable resources using the Task 3 resource node model.

## What was done

- Added distinct gatherable tile/node types:
  - flint from flint rock nodes
  - stick from deadwood nodes
  - stone from small stone nodes
  - bark from birch nodes
  - grass from grass clump nodes
  - food from berry/forage nodes
- Updated world generation to place all starter resource node types.
- Updated `OTZI.resources.resourceForTile()` so node resource type comes from tile type.
- Updated inventory defaults to include:
  - `flint`
  - `stick`
  - `stone`
  - `bark`
  - `grass`
  - `food`
- Updated world rendering so each resource node has a distinct visible placeholder.
- Updated the HUD inventory chip to show compact counts for all six starter resources.
- Updated Playwright mobile tests to gather each starter resource through the actual USE/GATHER control.
- Regenerated `dist/index.html`.

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- Playwright result: 3 tests passed.
- Fixed seed contains active nodes for all starter resources.
- Empty-space gather fails and does not change inventory.
- Each starter resource can be gathered:
  - flint
  - stick
  - stone
  - bark
  - grass
  - food
- Each gathered resource increments the correct inventory key.
- Each gathered node depletes.
- Active resource node count decreases after each successful gather.
- HUD shows all six starter resource counts.
- Existing Milestone 1 controls still pass automated checks.

Inferred:

- The forest gatherable layer is ready for Task 5 inventory panel work because counts now exist for the full starter resource set.

Untested:

- Save/load persistence of gathered resources and depleted nodes. That belongs to Task 8.
- Real Samsung Galaxy S21 Ultra retest after this Task 4 change.

## What failed

- Nothing failed in this pass.

## Current exact state

- Branch at implementation time: `main`
- Resource gathering is now multi-resource but still intentionally simple.
- No crafting recipes were added.
- No survival meter expansion was added.
- No cave/dungeon/village progression was added.

## Remaining blockers

- Task 5 should replace the placeholder menu with a readable inventory display.
- Task 8 must persist these resources and depleted nodes across reload.

## Next actionable step

Proceed to Task 5: inventory panel and quick resource display.

## Evidence

- `src/worldgen.js`
- `src/resources.js`
- `src/inventory.js`
- `src/render-world.js`
- `src/render-ui.js`
- `tests/mobile-controls.spec.js`
- `dist/index.html`
- `artifacts/screenshots/gather-fail-no-resource.png`
- `artifacts/screenshots/gather-success-flint.png`
- `artifacts/screenshots/no-aim-map-in-hud.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Not retested on physical Samsung hardware after this Task 4 resource expansion.

