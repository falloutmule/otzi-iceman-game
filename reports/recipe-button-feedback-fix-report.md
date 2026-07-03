# Recipe Button Feedback Fix Report

## Goal

Keep recipe action buttons tappable so missing-material feedback can come from the button press itself.

## What was done

- Removed disabled-state blocking from craft and harden action buttons.
- Preserved unavailable visual styling with a `data-craftable` state instead of native `disabled`.
- Kept craft and harden logic responsible for user feedback:
  - `Need 1 Stick, 1 Stone, 1 Bark`
  - `Craft a crude spear first`
  - `Return to the village hearth`

## What was verified

- `node tools/build-single-file.mjs` passed.
- `npx.cmd playwright test` passed: 7/7.
- Playwright now proves:
  - tapping `Craft Crude Spear` with no materials shows the exact missing requirement
  - tapping `Harden Spear Tip` without a crude spear shows the spear requirement

## What failed

- Samsung confirmation is still pending.

## Current exact state

- Recipe buttons remain visibly unavailable when requirements are missing.
- The player can still tap them to get specific guidance.

## Remaining blockers

- Public deploy verification.
- Samsung phone check for the exact missing-material tap flow.

## Next actionable step

Open CRAFT on Samsung, tap `Craft Crude Spear` with no materials, and confirm the game says exactly what is missing.

## Evidence

- `tests/fire-spear.spec.js`
- `reports/backups/index.before-recipe-button-feedback.html`
