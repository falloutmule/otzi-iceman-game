# No Invisible Gather Targets Report

## Goal

Fix invisible gather targets so USE/GATHER only works when a resource is explicitly focused, visibly highlighted, and labeled.

## What was done

- Added explicit focused resource state:
  - `focusedResourceId`
  - `focusedResource`
- Added `updateFocusedResource()` on `OTZI.game`.
- Added strict visible-target finder:
  - `OTZI.resources.findNearestVisibleTarget()`
- Changed `tryGather()` so it only gathers the current focused resource.
- Tightened interaction range:
  - `gatherRadius: 24`
  - `resourceNodeRadius: 10`
- Replaced tiny dot markers with larger resource-specific icons.
- Added a large focused target ring.
- Added focused target label text:
  - `FLINT`
  - `STICK`
  - `STONE`
  - `BARK`
  - `GRASS`
  - `FOOD`
- Changed idle status text to:
  - `USE: gather <resource>` when focused
  - `No resource nearby` when not focused
- Added debug focus details:
  - resource type
  - node id
  - tile
  - distance
- Extended test hooks with focused resource state and spawn resource distance.
- Added spawn-safe invariant test for no immediate resource target at player start.
- Regenerated `dist/index.html`.

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed using `OTZI_BASE_URL=file:///...`.
- Playwright result: 4 tests passed.
- No focused resource exists at spawn/open field.
- USE/GATHER with no focus does not change inventory.
- Focus appears near a known resource.
- Status says `USE: gather flint` before gathering.
- Gathered node id matches focused node id.
- Gather increments only the focused resource type.
- Gathered node becomes depleted.
- Depleted focused node is not focused again.
- Resource label screenshot was produced.
- Existing PACK, MAP, reset save, fullscreen, joystick, crafting, and save/load checks still pass.

Inferred:

- The reported invisible target class should be fixed because the gather action is now bound to the same resource that receives the visible ring and label.

Untested:

- Physical Samsung Galaxy S21 Ultra retest after deployment.
- Manual fullscreen behavior on Samsung hardware.

## What failed

- Local HTTP serving remains unreliable in this sandbox, so Playwright was run against the generated `file:///` artifact path.
- No application test failed after the focused-target implementation.

## Current exact state

- Branch: `fix/no-invisible-gather-targets`
- Implementation commit hash: `83424c0`
- Focused resource state exists.
- USE/GATHER only collects the current focused resource.
- No focused resource means no gather.
- Depleted resources do not draw collectible markers.

## Remaining blockers

- Samsung Galaxy S21 Ultra retest is required.

## Next actionable step

Open https://falloutmule.github.io/otzi-iceman-game/ on Samsung Galaxy S21 Ultra Chrome and confirm every gather target has a visible ring/label before USE works.

## Evidence

- `artifacts/screenshots/no-invisible-target-open-field.png`
- `artifacts/screenshots/focused-resource-label.png`
- `artifacts/screenshots/gather-focused-resource-only.png`
- `artifacts/screenshots/depleted-focused-resource.png`
- `artifacts/screenshots/no-focus-no-gather.png`
- `artifacts/screenshots/fullscreen-menu-button.png`
- `artifacts/screenshots/bugpass-resource-markers.png`
- `artifacts/screenshots/bugpass-nearby-resource-highlight.png`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Untested after this hard bug pass. User retest is required before claiming hardware verification.
