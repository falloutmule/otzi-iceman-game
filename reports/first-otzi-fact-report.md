# First Otzi Fact Report

## Goal

Reward the first dungeon progression loop with the first persistent Otzi fact and a reopenable fact log entry.

## What was done

- Replaced placeholder fact data in `src/facts.js` with a verified `retoucheur_tool` record.
- Added fact discovery helpers in `src/facts.js`.
- Added a fact modal and “View Latest Fact” menu path in `src/dom.js`.
- Added unlock-triggered fact presentation in `src/main.js`.
- Added fact rendering and menu sync in `src/render-ui.js`.
- Persisted fact state in `src/save.js`.

## What was verified

- Verified by Playwright: unlocking Toolmaker opens the fact panel.
- Verified by Playwright: the fact log entry appears in the menu and can be reopened.
- Verified by Playwright: discovered fact state persists through save/load.
- Verified by Playwright: reset save clears discovered facts.

## What failed

- No multi-fact browsing UI was added yet; this pass only supports the first fact reward cleanly.

## Current exact state

- Verified: the first content loop now ends with an educational reward rather than only inventory progression.
- Verified: the fact shown is data-driven, tagged `verified`, and saved.
- Inferred: the fact system is now structured for later village/dungeon rewards without another UI rewrite.

## Remaining blockers

- Samsung retest still needed.
- No dedicated multi-entry fact log screen yet.

## Next actionable step

Retest the live build and confirm the fact card opens automatically on Toolmaker unlock and can be reopened from the menu afterward.

## Evidence

- `artifacts/screenshots/content-toolmaker-fact.png`
- `tests/content-loop.spec.js`
