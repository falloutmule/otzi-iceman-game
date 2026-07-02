# Milestone 1 Lock Report

## Goal

Freeze the stable Milestone 1 engine shell before beginning Milestone 2 resource and inventory work.

## What was done

- Confirmed the repository is on `main`.
- Rebuilt the single-file release artifact with `node tools/build-single-file.mjs`.
- Ran the Playwright suite with `npx.cmd playwright test`.
- Verified the live GitHub Pages URL returns HTTP 200.
- Confirmed the live build has no AIM runtime control.
- Confirmed the live build has MAP in the HUD/stats bar.
- Recorded the Samsung Galaxy S21 Ultra user pass in `reports/samsung-s21-m1-hardware-pass.md`.

## What was verified

Verified locally:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed.
- Playwright result: 3 tests passed.
- Generated `dist/index.html` exists.
- Runtime AIM search in `src`, `tools`, `tests`, and `dist` found no active AIM UI, only absence assertions in tests.

Verified live:

- URL: https://falloutmule.github.io/otzi-iceman-game/
- HTTP status: 200.
- AIM runtime markers: absent.
- HUD MAP markers: present.
- Old vertical MAP tab CSS marker: absent.

Verified by user report:

- Samsung Galaxy S21 Ultra Chrome phone checks passed.

## What failed

- Nothing failed during this lock pass.
- Physical phone screenshot evidence was not added to the repository.

## Current exact state

- Branch: `main`
- Baseline commit before this lock report: `46f2271`
- Latest deployed Milestone 1 behavior:
  - clear game viewport
  - stats/HUD bar below game
  - MAP button in HUD
  - bottom controls below HUD
  - AIM removed
  - gather works only near resource nodes
  - CRAFT/MENU placeholder opens
  - DODGE/SPRINT feedback works without sticking
  - joystick movement works

## Remaining blockers

- None for Milestone 1.
- Milestone 2 should begin with Task 3: resource node data model cleanup.

## Next actionable step

Tag this state as `m1-engine-shell`, push the tag, and then start Task 3 on a new branch.

## Evidence

- `reports/samsung-s21-m1-hardware-pass.md`
- `artifacts/screenshots/milestone1-smoke.png`
- `artifacts/screenshots/baseline-starter-running.png`
- `artifacts/screenshots/no-aim-map-in-hud.png`
- `artifacts/screenshots/clear-game-viewport-no-controls.png`
- `artifacts/screenshots/gather-fail-no-resource.png`
- `artifacts/screenshots/gather-success-flint.png`
- `artifacts/screenshots/hud-map-button-minimap-open.png`
- `artifacts/screenshots/joystick-bottom-panel.png`
- `artifacts/screenshots/menu-placeholder.png`
- `dist/index.html`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Verified by user report on the live GitHub Pages build. Codex did not independently operate the physical device.

