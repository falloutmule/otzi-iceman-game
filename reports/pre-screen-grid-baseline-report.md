# Pre-Screen-Grid Baseline Report

## Goal

Lock the current phone-playable prototype before replacing the one-big-map overworld with a screen-grid world model.

## What was done

- Rebuilt the single-file release artifact.
- Reran the current Playwright suite against the generated artifact.
- Recorded the current live GitHub Pages URL as the baseline deployment target.
- Prepared a local git tag for the architecture pivot checkpoint:
  - `pre-screen-grid-prototype`

## What was verified

Verified:

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed using `OTZI_BASE_URL=file:///C:/Users/fallo/Documents/Codex/2026-07-01/we-are-going-to-start-a/otzi-iceman-game`.
- Current automated result: 4 tests passed.
- Existing prototype behaviors still covered by tests:
  - phone portrait shell
  - bottom controls ordering
  - PACK popup
  - MAP popup
  - focused resource labels
  - no invisible gather target regression
  - reset save
  - fullscreen menu path

Inferred:

- The current GitHub Pages build is still the working prototype that proved the mobile shell and gather loop before the screen-grid conversion.

Untested:

- Fresh Samsung Galaxy S21 Ultra screenshot for this exact baseline tag was not captured in this environment.

## What failed

- No product build or automated test failed during the baseline lock pass.
- Physical-device screenshot capture is still outside this environment.

## Current exact state

- Baseline commit: `5025e33`
- Planned tag: `pre-screen-grid-prototype`
- Working tree was clean before the report file was added.
- Live prototype URL:
  - https://falloutmule.github.io/otzi-iceman-game/

## Remaining blockers

- Push the baseline tag to GitHub after the screen-grid work is ready to publish.
- Samsung hardware retest remains a separate confirmation step.

## Next actionable step

Replace the current single overworld map with deterministic screen-grid generation while preserving the mobile shell, pack/map/menu flows, and Playwright protections.

## Evidence

- `dist/index.html`
- `artifacts/screenshots/mobile-ui-clear-game.png`
- `artifacts/screenshots/focused-resource-label.png`
- `artifacts/screenshots/gather-focused-resource-only.png`
- `artifacts/screenshots/fullscreen-menu-button.png`
- `reports/pre-screen-grid-baseline-report.md`

## Live URLs

- GitHub Pages: https://falloutmule.github.io/otzi-iceman-game/
- Repository: https://github.com/falloutmule/otzi-iceman-game

## Samsung Galaxy S21 Ultra status

Previously user-tested during the prototype phase, but not re-captured from this environment as a baseline artifact for the screen-grid pivot.
