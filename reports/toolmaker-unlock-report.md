# Toolmaker Unlock Report

## Goal

Make Flint Scar completion visibly matter by changing the village state on return.

## What was done

- Added dungeon progression state under `game.dungeons` in `src/main.js`.
- Added village unlock helpers in `src/village.js`.
- Added return-to-village unlock flow in `src/main.js`:
  - requires Flint Scar completion
  - requires one `goodFlintCore`
  - consumes the core
  - unlocks `toolmaker`
- Added village/toolmaker rendering cues in `src/render-world.js`.
- Persisted unlock state in `src/save.js`.

## What was verified

- Verified by Playwright: returning to `village_home` after collecting the good flint core unlocks Toolmaker.
- Verified by Playwright: the unlock survives save/load.
- Verified by Playwright: reset save clears the unlock.

## What failed

- No expanded Toolmaker gameplay tree was added in this pass by design.

## Current exact state

- Verified: Toolmaker is now the first visible village progression reward.
- Verified: the unlock consumes the Flint Scar objective item and persists.
- Inferred: this creates the first meaningful return-to-village loop for later upgrades and dialogue.

## Remaining blockers

- Samsung retest still needed.
- Toolmaker currently acts as an unlock/progression marker, not a full station.

## Next actionable step

Retest the village return flow on the live build and verify the Toolmaker marker appears clearly after Flint Scar completion.

## Evidence

- `artifacts/screenshots/content-toolmaker-fact.png`
- `tests/content-loop.spec.js`

