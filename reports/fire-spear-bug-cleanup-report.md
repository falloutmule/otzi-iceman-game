# Fire Spear Bug Cleanup Report

## WHAT WAS DONE

- Added explicit panel gameplay gating so `CRAFT`, `SYSTEM`, welcome, and fact panels block gameplay actions.
- Added `SYSTEM` save controls:
  - `Save Now`
  - `Export Save`
  - `Import Save`
  - save data textarea
- Added `craftOpen` alias on game state while keeping current runtime compatibility.
- Fixed stale test hook default from `flint_cave` to `flint_scar`.
- Rebuilt the single-file release artifact from source.

## WHAT WAS VERIFIED

- Verified: `node tools/build-single-file.mjs` passes.
- Verified: `npx.cmd playwright test` passes.
- Verified: all 7 Playwright tests pass.
- Verified: `CRAFT` blocks keyboard `F` throw action.
- Verified: `SYSTEM` blocks keyboard `E` use action.
- Verified: `SYSTEM` exposes Save Now / Export Save / Import Save.
- Verified: exported save string is non-empty in tests.
- Verified: existing reset flow still passes in Playwright.

## WHAT FAILED

- Samsung Galaxy S21 Ultra screenshot proof was not collected in this pass.
- Public Pages verification for this cleanup commit still depends on the next deploy check.

## CURRENT EXACT STATE

- Local source and generated `dist/index.html` include the bug cleanup.
- Runtime now prevents gameplay action leakage through non-gameplay panels.
- Save/export/import is now exposed in the player-facing `SYSTEM` panel.

## REMAINING BLOCKERS

- Push the cleanup commit and verify the public Pages URL.
- Collect Samsung proof that the live build shows `MAP | CRAFT | SYSTEM` and `THROW / TOOL`.

## NEXT ACTIONABLE STEP

Push this cleanup pass, verify the public URL still contains `otzi-fire-spear-0.5.0`, then retest on Samsung Galaxy S21 Ultra Chrome.

## EVIDENCE

- `tests/fire-spear.spec.js`
- `tests/mobile-controls.spec.js`
- `reports/backups/index.before-panel-block-save-ui.html`

## GITHUB PAGES URL

- `https://falloutmule.github.io/otzi-iceman-game/`

FAIL
