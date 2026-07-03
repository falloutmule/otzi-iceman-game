# Phone Test Tools Report

## Goal

Reduce repeated full-loop replay for phone QA.

## What was done

- Added a `TEST TOOLS` section to `SYSTEM`.
- Added buttons for:
  - Give Spear Materials
  - Go to Village Hearth
  - Go to Animal Clearing
  - Go to Flint Scar
  - Unlock Toolmaker

## What was verified

- Verified locally in Playwright:
  - test tools are visible in `SYSTEM`
  - material grant enables spear crafting
  - travel shortcuts move the player to the required validation areas

## What failed

- Samsung confirmation is still pending.

## Current exact state

- Phone QA can now reach spear/hearth/hunt checks directly from the current save.

## Remaining blockers

- Public phone verification.

## Next actionable step

Open SYSTEM on Samsung and confirm the test tools are present and usable.

## Evidence

- `artifacts/screenshots/system-test-tools.png`
