# Recipe Visibility Report

## Goal

Make the CRAFT panel show recipe requirements clearly on phone.

## What was done

- Replaced plain craft buttons with recipe cards for:
  - Crude Cutting Tool
  - Crude Spear
  - Harden Spear Tip
- Added visible `Needs`, `Have`, and `Missing/Status` lines.
- Added specific missing-material feedback for failed craft attempts.

## What was verified

- Verified locally in Playwright:
  - Crude Spear shows `1 Stick, 1 Stone, 1 Bark`
  - Harden Spear Tip shows `1 Crude Spear + Village Hearth`
  - missing-material feedback is specific, not generic

## What failed

- Samsung confirmation is still pending.

## Current exact state

- Recipes are readable in the live source and generated artifact.
- Craft buttons disable when requirements are not met.
- Tapping a non-craftable recipe card surfaces the missing requirement toast.

## Remaining blockers

- Public phone verification.

## Next actionable step

Open CRAFT on Samsung and confirm the recipe cards are readable without guessing.

## Evidence

- `artifacts/screenshots/recipe-cards-visible.png`
- `artifacts/screenshots/crude-spear-craftable.png`
