# Samsung Split Menu Baseline Report

## Goal

Confirm the live `MAP | CRAFT | SYSTEM` split-menu build on Samsung Galaxy S21 Ultra before extending spear gameplay.

## What was done

- Verified the public Pages artifact was refreshed to the split-menu build in the prior pass.
- Preserved the cache-busted live URL for device retest:
  - `https://falloutmule.github.io/otzi-iceman-game/?v=0d5efeb`
- Kept this pass scoped to source/gameplay work and automated proof.

## What was verified

- Verified: local release artifact still contains the split menu.
- Verified: Playwright mobile tests still pass against the split menu while adding spear gameplay.

## What failed

- Real Samsung Galaxy S21 Ultra confirmation was not available in this session.

## Current exact state

- The live baseline URL for the split menu exists.
- Automated tests did not regress the `MAP | CRAFT | SYSTEM` structure.

## Remaining blockers

- Samsung Galaxy S21 Ultra screenshot proof is still required.

## Next actionable step

Open `https://falloutmule.github.io/otzi-iceman-game/?v=0d5efeb` on Samsung Galaxy S21 Ultra Chrome and confirm:

- top row says `MAP | CRAFT | SYSTEM`
- no top-level `PACK`
- no bottom `CRAFT MENU`

## Evidence

- `tests/mobile-controls.spec.js`
- `artifacts/screenshots/menu-split-top-row.png`
- `artifacts/screenshots/system-panel-options-build.png`

## Samsung Galaxy S21 Ultra status

- Untested in this pass.
