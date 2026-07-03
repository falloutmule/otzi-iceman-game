# Spear Objective Guidance Report

## Goal

Make the spear mission readable after Toolmaker unlock.

## What was done

- Updated the spear objective path to show concrete requirements:
  - Craft a Crude Spear
  - Need 1 stick, 1 stone, and 1 bark
  - Harden the Spear Tip at the village hearth
  - Hunt Small Game with the hardened spear

## What was verified

- Verified locally in Playwright:
  - objective updates after Toolmaker unlock
  - objective updates after spear crafting
  - objective updates after spear hardening

## What failed

- Samsung confirmation is still pending.

## Current exact state

- The objective bar now points directly into the spear/hearth loop instead of relying on implicit recipe knowledge.

## Remaining blockers

- Public phone verification.

## Next actionable step

Confirm the Samsung objective bar shows the spear requirements and hearth step clearly.

## Evidence

- `artifacts/screenshots/hardened-spear-equipped.png`
