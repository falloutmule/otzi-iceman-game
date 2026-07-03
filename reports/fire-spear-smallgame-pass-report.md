# Fire Spear Small Game Pass Report

## Goal

Fix the Samsung-reported trust bugs in the current loop, clean up the control/menu split, give the village a stronger hearth identity, and start the next progression mission: crude spear into hardened spear.

## What was done

- Fixed Flint Scar room generation so the entrance lane and major dungeon cross-lanes are carved with real clearance instead of a one-tile path bordered by blockers.
- Removed `BLOCKED` flags from dungeon gather nodes so cave resources no longer behave like tiny hidden walls.
- Added a stronger debug collision overlay for blocked tiles, harvest tiles, entrances, and hazards.
- Made small-game outcome states explicit:
  - `caught`
  - `escaped`
  - brief visible linger with outcome label instead of silent vanish
- Added second small-game population via `grouse`, with sparse spawning in `animal_clearing`, `dense_forest`, and occasional `forest_trail` screens.
- Moved `MENU` into the top popup row, which is now `MAP | MENU | PACK`.
- Removed menu responsibility from the lower action cluster. Bottom gameplay controls are now movement plus immediate use/sprint actions.
- Strengthened the village landmark pass:
  - more recognizable hut silhouette
  - visible hearth/fire placed away from the default spawn
  - hearth interaction point added
- Added new progression inventory/items:
  - `crudeSpear`
  - `hardenedSpear`
- Added a new craft recipe:
  - `Crude Spear = stick + stone + bark`
- Added village hearth use behavior:
  - use near hearth with `crudeSpear` converts it to `hardenedSpear`
- Updated objective progression after Toolmaker unlock:
  - craft crude spear
  - harden spear tip
  - prepare for the hunt
- Added automated Playwright coverage for:
  - Flint Scar entrance lane walkability
  - explicit small-game escape feedback
  - top-row menu placement
  - crude spear crafting
  - hearth hardening flow

## What was verified

- Verified: `node tools/build-single-file.mjs` passes.
- Verified: `npx.cmd playwright test` passes.
- Verified: 7 Playwright tests passed after this pass.
- Verified: Flint Scar entrance lane check reports no blocked samples across the intended entrance corridor.
- Verified: small-game catch produces explicit reward feedback.
- Verified: small-game escape produces explicit escape feedback.
- Verified: `MENU` is in the popup row and absent from the bottom control cluster.
- Verified: village hearth can harden a crude spear into a hardened spear.
- Verified: objective text updates into the spear/fire progression.

## What failed

- Untested on real Samsung hardware in this pass.
- Not implemented yet: actual thrown-spear combat/hunting behavior.
- Not implemented yet: predator runtime AI/combat.

## Current exact state

- Flint Scar entrance room no longer relies on a narrow one-tile corridor with blocker-adjacent movement.
- Cave resource pickups no longer double as hidden collision blockers.
- Small game now resolves clearly as caught or escaped.
- The top utility row is `MAP | MENU | PACK`.
- The village now has a stronger hut/fire read.
- The next progression objective can move into spear crafting and hearth hardening without inventing a new UI flow.
- Sparse additional small game is present through `grouse`.

## Remaining blockers

- Samsung Galaxy S21 Ultra retest is still needed for:
  - Flint Scar entrance movement feel
  - top-row menu comfort
  - hearth readability
  - small-game catch/escape clarity
- Throw/use behavior for the new spear is still a follow-on task, not part of this pass.
- Predator danger remains roadmap-only.

## Next actionable step

Retest the live build on Samsung Galaxy S21 Ultra Chrome, then implement the next bounded gameplay step: first usable spear hunting/throw behavior against small game before introducing predators.

## Evidence

- `artifacts/screenshots/content-hare-caught.png`
- `artifacts/screenshots/fire-spear-menu-craft.png`
- `artifacts/screenshots/fire-spear-village-hearth.png`
- `artifacts/screenshots/fire-spear-hardened-objective.png`
- `artifacts/screenshots/content-toolmaker-fact.png`

## Samsung Galaxy S21 Ultra status

- Verified: previous content loop was playable enough to expose the bugs.
- Verified: this pass targets the exact user-reported blocker and animal-feedback failures.
- Untested: the new fixes on real hardware after this code pass.
