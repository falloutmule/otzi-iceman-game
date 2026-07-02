# Small Animal Content Report

## Goal

Add a first phone-usable small-animal encounter that proves non-resource interaction content in the overworld.

## What was done

- Added `hare` entity support in `src/entities.js`.
- Added `animal_clearing` screen spawning for a single deterministic hare on a walkable non-path tile.
- Implemented simple hare states: idle, alert, fleeing, caught, escaped.
- Added catch interaction through focused-entity use handling in `src/main.js`.
- Added distinct hare rendering and focus labeling in `src/render-world.js`.

## What was verified

- Verified by Playwright: at least one `animal_clearing` screen exists.
- Verified by Playwright: the hare can be startled into fleeing.
- Verified by Playwright: the hare can be caught and increases `food` by 1.
- Verified by source inspection: caught/escaped state is serialized for persistence.

## What failed

- No manual tuning pass was done for multi-animal encounters, because this task intentionally shipped only one simple animal type.

## Current exact state

- Verified: hare encounters work on mobile layout with clear focus text.
- Verified: sprinting or crowding the hare can trigger fleeing.
- Verified: careful approach within catch range allows a successful catch.
- Inferred: this is a stable base for later deer/hunting systems because it already uses focused interaction and saved entity state.

## Remaining blockers

- Samsung retest still needed.
- No hide/sinew drop yet.
- No second animal type yet.

## Next actionable step

Retest the hare encounter on the live mobile build and confirm the focus label remains readable during approach and catch.

## Evidence

- `artifacts/screenshots/content-animal-clearing.png`
- `artifacts/screenshots/content-hare-caught.png`
- `tests/content-loop.spec.js`

