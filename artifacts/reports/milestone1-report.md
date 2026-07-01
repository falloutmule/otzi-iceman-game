# Milestone 1 Report - Otzi Engine Shell

## Goal

Build the initial Canvas 2D engine shell from the supplied Otzi starter files.

## What was done

- verified: Copied the supplied source documents into `docs/`.
- verified: Created split source modules under `src/` using the requested ownership map.
- verified: Added future-safe stubs for scenes, dialogue, inventory, crafting, village, facts, and debug.
- verified: Added `tools/build-single-file.mjs` to generate the one-file runtime artifact.
- verified: Generated `dist/index.html`.
- verified: Added Playwright smoke coverage for the generated artifact.
- verified: Added baseline Playwright coverage for `docs/starter-reference.html`.
- verified: Added screenshot and log artifacts.

## What was verified

- verified: `node tools/build-single-file.mjs` builds `dist/index.html`.
- verified: `dist/index.html` has no external runtime script/link/image URLs.
- verified: `dist/index.html` contains no `eval`.
- verified: `dist/index.html` contains no inline event handlers.
- verified: Local server on port 8099 served `dist/index.html` with HTTP 200.
- verified: Playwright loaded `dist/index.html`.
- verified: Canvas was visible.
- verified: Start/audio unlock path did not throw.
- verified: Fixed-step loop advanced enough for keyboard movement.
- verified: Keyboard movement changed player position.
- verified: Test snapshot returned scene, seed, player, viewport, inventory, village, facts, entity count, particle count, debug, and input state.
- verified: Playwright captured `artifacts/screenshots/milestone1-smoke.png`.
- verified: Starter baseline loaded and produced `artifacts/screenshots/baseline-starter-running.png`.

## What failed

- blocked: Port 8080 was already occupied by another local service returning JSON 404 responses.
- verified: The test suite passed after switching verification to `OTZI_BASE_URL=http://127.0.0.1:8099`.
- blocked: In-app browser control failed because its helper hit a Windows permission error reading outside the workspace.
- verified: Playwright package install succeeded through `npm.cmd install`.

## Current exact state

- verified: Project root is `otzi-iceman-game/`.
- verified: Runtime artifact is `dist/index.html`.
- verified: Development source is split under `src/`.
- verified: Tests are in `tests/`.
- verified: Evidence is in `artifacts/`.
- verified: Full suite command passed with project defaults:

```text
npx.cmd playwright test
2 passed (4.1s)
```

## Remaining blockers

- verified: Project scripts now default to port 8099 because port 8080 was occupied.
- untested: Real Android Chrome hardware verification has not been performed from this environment.
- untested: Full touch multitouch/pointercancel matrix is not yet covered beyond preserving Pointer Events controls and Playwright mobile viewport.
- proposed: Next card should harden touch control tests and collision edge-case tests before adding Milestone 2 gameplay.

## Next actionable step

- proposed: Freeze the Milestone 1 shell, update the default serve/test port if desired, then add a focused touch-control guard that verifies joystick drag, `pointercancel`, use/gather, sprint toggle, and viewport resize.

## Evidence paths

- verified: `artifacts/screenshots/milestone1-smoke.png`
- verified: `artifacts/screenshots/baseline-starter-running.png`
- verified: `artifacts/logs/playwright-smoke.txt`
- verified: `artifacts/logs/browser-debug.log`
- verified: `dist/index.html`
- verified: `tests/smoke.spec.js`
- verified: `tests/baseline-starter.spec.js`

PASS
