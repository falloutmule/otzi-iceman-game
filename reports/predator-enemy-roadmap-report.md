# Predator Enemy Roadmap Report

## Goal

Define a staged predator/enemy rollout that fits the Otzi project’s current scope and world structure without destabilizing the new loop.

## What was done

- Chose a staged rollout instead of adding predators directly into this pass.
- Matched priority to readability on phone, survival theme, and implementation risk.

## What was verified

- Verified by codebase constraints: current loop supports small gatherables, small game, dungeon traversal, village return, objective updates, and menu-based progression.
- Verified by scope review: the project is not ready for multi-threat combat systems yet.

## What failed

- No predator runtime behavior was implemented in this pass.
- No combat balancing was attempted.

## Current exact state

- Small game now exists as the safe ecological layer.
- Spear crafting and hearth hardening now define the natural bridge into first danger systems.

## Remaining blockers

- Need a first real spear-use model before predators are added.
- Need clear damage, recovery, and encounter-exit rules before large threats arrive.

## Next actionable step

Implement first spear use against small game, then add a single readable predator archetype instead of a broad fauna dump.

## Evidence

- Code pass evidence is recorded in `reports/fire-spear-smallgame-pass-report.md`.

## Samsung Galaxy S21 Ultra status

- Untested for predator systems because none were added.

## Rollout plan

### Tier 1 — first real predator candidates

1. Gray Wolf
   - Best first predator target.
   - Readable movement and pursuit logic.
   - Can start as lone-wolf pressure before pack logic.

2. Brown Bear
   - Strong environmental threat.
   - Better as a zone denial encounter than a constant roaming enemy.

3. Eurasian Lynx
   - Good later ambush predator once line-of-sight and surprise rules are stronger.

### Tier 2 — prey animals that can also become danger events

1. Red Deer
2. Ibex
3. Aurochs

These should arrive after the first spear-use loop, as hunt targets with occasional charge/stampede danger.

### Tier 3 — optional or late specialized threats

1. European Leopard
2. Large raptor encounter

These are better reserved for later biome/event content, not the current MVP path.

## Recommended implementation order

1. Spear use against small game
2. Lone wolf encounter
3. Bear danger zone
4. Deer/ibex hunt-and-hazard layer
5. Lynx ambush behavior
