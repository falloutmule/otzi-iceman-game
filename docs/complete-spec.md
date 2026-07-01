# The Legend of Ötzi the Iceman — Complete Single-File HTML Game Spec

**Spec version:** 0.1  
**Date:** 2026-07-01  
**Target deliverable:** A portrait-mode, top-down, Canvas 2D, single-file HTML5 survival adventure released as `dist/index.html`.  
**Working title:** `The Legend of Ötzi the Iceman`  
**Runtime target:** Browser, mobile-first, Android Chrome first, desktop supported.  
**Development target:** GitHub repo using split source files, tests, docs, and a build script that produces one playable HTML file.

---

## 1. Plain summary

This game is a portrait-mode, top-down survival adventure where Ötzi starts alone with a historically grounded version of his real kit. He explores procedural Copper Age environments, completes dangerous resource runs, hunts or avoids animals, faces rival villagers, unlocks automatic village functions, and slowly turns survival into a simple Copper Age settlement. Villagers reward progress by teaching facts about Ötzi, his tools, his clothing, his wounds, and the mystery of his death.

The best technical path is a **custom Canvas 2D tile engine**, not WebGL first and not Phaser as the shipped runtime. Phaser, BrowserQuest, Solarus, and ZQuest are reference material for architecture and design patterns only. The final game must not copy Zelda assets, music, UI framing, enemies, room layouts, title treatment, or copyrighted content.

The ending should use **5,300 years later**, not 60,000 years later, unless the game intentionally shifts into myth. Ötzi is a Copper Age mummy from roughly 5,300 years ago, discovered in 1991, and official museum material describes his equipment, clothing, death evidence, and body details.

---

## 2. Project goal

Build a serious but scope-controlled single-file HTML5 adventure game that proves this complete loop:

1. Start in a small camp or early village.
2. Leave into a procedural wilderness region.
3. Gather historically plausible resources.
4. Hunt, avoid, or fight threats.
5. Enter a resource-run dungeon or survival site.
6. Complete the site objective.
7. Return to the village.
8. Unlock a village function.
9. Hear an Ötzi fact from an NPC.
10. Save progress.
11. Continue toward the final high-pass ending.

The game should feel like an early console top-down adventure translated into a Copper Age survival setting, but it should have its own identity: **Copper Age survival adventure, not a Zelda clone**.

---

## 3. Source basis and evidence levels

### 3.1 Uploaded project references used

This spec is shaped from the uploaded single-file game research and Canvas 2D engine materials:

- `canvas 2d engine.md`
- `Single-File HTML5 Game Research Guide.pdf`
- `# Single-File HTML5 Game Field Manual.pdf`
- `html raycasting.md`
- `1000015476.jpg` as the rough portrait layout reference image

The main reusable technical conclusions from those files are:

- Canvas 2D is the correct baseline for a single-file top-down action/survival game.
- DOM/CSS should handle text-heavy UI, dialogue, menus, inventory, settings, and debugging overlays.
- The development source should be split into modules, then merged into a single release file.
- Fixed-step simulation, seeded RNG, versioned saves, explicit input abstraction, debug overlays, and smoke tests are required.
- Mobile failures usually happen at seams: canvas backing size vs CSS size, touch gestures vs browser behavior, fullscreen assumptions, `file://` save behavior, and AI edits that couple unrelated systems.

### 3.2 External factual references to use in implementation

Use these as the initial fact-source list inside the game database:

- South Tyrol Museum — Equipment: <https://www.iceman.it/en/oetzi/equipment>
- South Tyrol Museum — Clothing: <https://www.iceman.it/en/oetzi/clothing>
- South Tyrol Museum — Body / death / tattoos: <https://www.iceman.it/en/oetzi/the-body>
- South Tyrol Museum — Discovery: <https://www.iceman.it/en/oetzi/the-discovery>
- Wierer et al. 2018, lithic toolkit paper: <https://pmc.ncbi.nlm.nih.gov/articles/PMC6010222/>
- Smithsonian tattoo summary: <https://www.si.edu/stories/ancient-ink-iceman-otzi-has-worlds-oldest-tattoos>

### 3.3 Evidence labels used in game content

Every historical record in `facts.js` must carry one of these labels:

| Label | Meaning | Example |
|---|---|---|
| `verified` | Directly supported by museum or peer-reviewed source | Ötzi carried a copper axe. |
| `plausible` | Gameplay interpretation based on evidence | Birch-bark containers preserve embers as a game mechanic. |
| `fictional` | Narrative or mythic game invention | Ötzi dies defending the village in the final scene. |

### 3.4 Current exact state

| State type | Current state |
|---|---|
| Verified | The single-file Canvas 2D direction is feasible. The main Ötzi equipment, clothing, tattoo, discovery, and death facts are source-backed enough to seed the game database. |
| Proposed | The game loop, village unlock model, resource-run dungeon model, procedural world structure, art direction, and engine architecture. |
| Untested | No code has been written or run for this specific game in this thread. |
| Main blocker | Choose the first art target: procedural placeholder, clean pixel art, or hand-drawn low-color tile art. |

---

## 4. Hard constraints

### 4.1 Runtime constraints

- Final playable artifact must be one self-contained `index.html`.
- No required runtime network calls.
- No required CDN imports.
- No required external images, fonts, sounds, JSON files, or modules.
- No `eval`.
- No inline HTML event-handler strings such as `onclick="..."`.
- No copied Zelda, Phaser, BrowserQuest, Solarus, ZQuest, or other copyrighted assets.
- No copied music, sound effects, maps, room layouts, enemy designs, title treatment, or UI framing from copyrighted games.
- Game must run under `http://localhost` during development.
- Game should degrade safely under `file://` with save export/import fallback.

### 4.2 Development constraints

- Development source should be split into `src/` modules.
- Release artifact should be generated by `tools/build-single-file.mjs`.
- Do not edit minified output during development.
- Every engine change should run the smoke test.
- Every visual change should produce screenshot evidence.
- Every save schema change must bump `SAVE_VERSION` and add migration logic.
- Every world generation change that changes deterministic output must bump `WORLDGEN_VERSION`.

### 4.3 Platform priorities

1. Android Chrome portrait mobile.
2. Desktop Chrome/Edge/Firefox keyboard and mouse.
3. iOS Safari fallback layout.
4. Optional gamepad support later.
5. Optional PWA package later, not part of strict one-file baseline.

---

## 5. Engine decision

### 5.1 Final engine choice

Use a **custom Canvas 2D tile/chunk engine**.

| Area | Decision |
|---|---|
| Renderer | Canvas 2D, tile/chunk based. |
| UI | DOM/CSS overlay for text, menus, inventory, facts, save import/export, and debug panels. |
| Camera | Top-down following camera with deadzone and integer snapping. |
| Simulation | Fixed-step accumulator at 60 Hz. |
| RNG | Seeded deterministic RNG only; no direct `Math.random()` in game logic. |
| Map | Procedural overworld + procedural dungeon/resource-run maps + simple village map. |
| Save | Versioned JSON via `localStorage`, plus export/import string fallback. |
| Audio | Procedural Web Audio first, one `AudioContext`, unlock on Start. |
| Release | One generated `dist/index.html`. |

### 5.2 Why not Phaser as runtime

Phaser is a strong reference but too framework-shaped for this exact deliverable. It brings useful concepts such as scenes, cameras, input, scale handling, asset caches, and tilemaps, but the strict single-file goal rewards a narrower custom engine with fewer hidden interactions.

Use Phaser as a reference for:

- Scene lifecycle.
- Scale manager ideas.
- Camera deadzones.
- Tilemap separation.
- Input abstraction.
- Asset cache organization.

Do not use Phaser as a shipped dependency unless a later build proves the custom engine cannot meet the requirements.

### 5.3 Reference-engine extraction rules

| Reference | Use conceptually | Do not copy |
|---|---|---|
| Phaser | Scenes, cameras, scale manager, tilemaps, input abstraction. | Runtime dependency by default, loader-heavy asset workflow, plugin sprawl. |
| BrowserQuest | Terrain/collision/semantic layer separation, entity tables, top-down browser adventure structure. | Server-heavy multiplayer model, art, names, deprecated code assumptions. |
| Solarus | Hero/session persistence, maps, layers, interactable/save variable patterns. | Runtime, Lua API, Zelda-like content conventions. |
| ZQuest Classic | Screen flags, room semantics, triggers, editor thinking. | Zelda room layouts, Zelda item logic, assets, names, sounds, UI. |

---

## 6. Visual identity and title rules

### 6.1 Working title

`The Legend of Ötzi the Iceman`

This is acceptable as a working title. Before public release, consider whether the word `Legend` creates too much Zelda association. Safer alternatives:

- `Ötzi: High Pass`
- `Ötzi: The Last Fire`
- `Ötzi and the Copper Axe`
- `Iceman: Copper Age Survival`
- `The Last Ember of Ötzi`

### 6.2 Identity statement

The game should be:

> A Copper Age survival adventure inspired by early top-down adventure games, built around Ötzi’s equipment, survival pressures, and archaeological mystery.

The game should not be:

> A Zelda clone with Ötzi pasted over it.

### 6.3 Tone

- Grounded survival.
- Simple mythic framing.
- Educational without becoming a quiz app.
- Dangerous but not arcade gore.
- Respectful of uncertainty around Ötzi’s actual life and death.

---

## 7. Screen layout

### 7.1 Orientation

Portrait mode first. Landscape may exist as a fallback, but the main game should be designed for phone portrait.

### 7.2 Layout zones

| Zone | Approximate size | Content |
|---|---:|---|
| World view | Top 65–72% | Top-down world, player, entities, particles, weather, minimap tab, debug overlay. |
| Controls and status | Bottom 22–30% | Movement zone, action cluster, stats, quick inventory, menu button. |
| Sliding minimap | Right edge or top-right tab | Collapsed by default; slides out when tapped or dragged. |
| Dialogue/fact panel | Bottom-middle or modal card | NPC facts, item explanations, quest text. |
| Inventory/crafting | Full or half overlay | DOM UI, accessible buttons, no canvas-only text dependency. |

### 7.3 Status line

The bottom strip should show:

- Time / day.
- Warmth.
- Hunger.
- Stamina.
- Health.
- Carried weight.
- Active tool/weapon.
- Village state summary.
- Optional seed/debug info when debug is enabled.

### 7.4 Touch controls

Left side:

- Large movement thumb zone.
- Visual joystick appears where touch begins.
- Drag-off tolerance.
- Pointer capture.
- Pointercancel reset.

Right side:

- `Use / Gather`
- `Tool / Weapon`
- `Craft`
- `Dodge / Sprint`
- `Look / Aim`
- `Menu`

Sprint/dodge should be a burst/toggle, not a long hold.

---

## 8. Core game loop

The primary loop:

1. Wake or start at camp/village.
2. Check needs, inventory, and current village objective.
3. Leave into procedural region.
4. Gather resources: sticks, stones, bark, grass, flint, herbs, reeds, food.
5. Track survival meters: hunger, warmth, wetness, stamina, injury.
6. Hunt or avoid deer and other animals.
7. Evade or fight rival villagers.
8. Find a resource-run dungeon or survival site.
9. Complete objective.
10. Return to village.
11. Auto-build or upgrade one function.
12. Unlock fact dialogue.
13. Save.
14. Repeat until high pass opens.
15. Final defense/high-pass sequence.
16. Arrow death scene.
17. Epilogue: glacier preservation and discovery thousands of years later.

---

## 9. Progression structure

### 9.1 Dungeons are resource runs

The “dungeons” are not temples. They are survival spaces, resource hazards, and contested sites.

| Resource-run site | Primary resource | Hazards | Completion result | Village unlock |
|---|---|---|---|---|
| Birch Grove | Bark, sap, container craft | Dense trees, rival scout, cold shade | Recover bark bundle and ember vessel knowledge | Firekeeper hut |
| Flint Scar / Cave | Flint, chert, sharp flakes | Darkness, falling stones, rival claim marker | Recover good flint core | Toolmaker |
| River Bend | Fish, reeds, water plants | Current, wetness, cold drain | Secure fishing route | Fishing station |
| Alpine Meadow | Herbs, grass, fibers | Weather shift, exposure | Gather medicinal herbs and dry grass | Healer / clothing repair |
| Deer Woods | Hide, sinew, antler, meat | Deer flee AI, wolves/rivals if added | Complete hunt and preserve hide | Hunter lodge |
| Copper Ravine | Rare copper, trade/status | Rival hunter, difficult terrain | Recover copper memory/resource | Axe shrine / trade shelter |
| Rival Trail Camp | Arrows, defense knowledge | Human threat | Break camp pressure / recover arrows | Watch post |
| High Pass | Final route | Snow, cold, ambush | Endgame access | Final sequence |

### 9.2 Conquer/completion definition

“Conquer” means:

- The site is completed once.
- Village gains an automatic passive function.
- Resource trickle begins.
- Related fact dialogue unlocks.
- New recipes or tools become available.
- The site can still be revisited for manual gathering or optional challenges.

---

## 10. Village system

### 10.1 Design rule

Village is not RimWorld. It is a small functional hub with static or lightly animated villagers, simple unlocks, and passive production.

### 10.2 Buildings

| Building | Unlock source | Function | Fact theme |
|---|---|---|---|
| Firekeeper Hut | Birch Grove | Ember safety, faster cooking, reduced cold penalty when resting. | Birch-bark containers and fire carrying. |
| Toolmaker | Flint Scar | Repairs flint dagger, scraper, borer, arrowheads. | Retoucheur and lithic toolkit. |
| Hunter Lodge | Deer Woods | Passive meat/hide/sinew, bow tutorial. | Quiver, unfinished shafts, finished arrows. |
| Healer Shelter | Alpine Meadow | Restores health/injury, warmth recovery. | Tattoos and possible therapeutic placement. |
| Fishing Station | River Bend | Passive fish, reeds, water resources. | Copper Age food gathering. |
| Drying Rack | Deer Woods or River Bend | Preserves fish/meat, reduces spoilage. | Food preservation as plausible gameplay. |
| Storage Frame | Early village upgrade | Increases resource cap and inventory transfer. | Backpack frame and carried kit. |
| Trade Shelter | Copper Ravine | Turns surplus into rare goods or upgrades. | Copper axe as status/value item. |
| Clothing Shelter | Alpine Meadow | Repairs shoes, leggings, coat, grass padding. | Hide/leather/grass clothing. |
| Watch Post | Rival Trail Camp | Warns of raids, reduces surprise attacks. | Human conflict and death mystery. |
| Story Fire | Tutorial or first unlock | Fact hub; villagers summarize discovered knowledge. | All verified fact categories. |

### 10.3 Passive production

Passive output should be low and capped:

```js
village.passive = {
  bark: { ratePerDay: 1, cap: 12, source: 'firekeeper' },
  flint: { ratePerDay: 1, cap: 8, source: 'toolmaker' },
  fish: { ratePerDay: 2, cap: 10, source: 'fishing_station' },
  herbs: { ratePerDay: 1, cap: 6, source: 'healer' },
  meat: { ratePerDay: 1, cap: 8, source: 'hunter_lodge' }
};
```

---

## 11. Ötzi-authentic inventory and mechanics

### 11.1 Equipment table

| Item | Evidence status | Game role | Mechanics |
|---|---|---|---|
| Copper axe | verified | Rare high-value tool and weapon | Chops trees, opens wood barriers, strong melee, stamina-heavy, village status object. |
| Unfinished yew longbow | verified | Delayed ranged weapon | Starts unusable; repaired through bowstring/shaft/fletching quests. |
| Quiver | verified | Arrow storage/crafting | Holds finished and unfinished arrows; upgrade UI for ammunition. |
| 12 unfinished arrow shafts | verified | Ammo crafting progression | Require arrowheads, fletching, time, and toolmaker. |
| 2 finished arrows | verified | Emergency early ammo | Limited early ranged attacks or hunting attempts. |
| Bowstring | verified/plausible implementation | Required bow component | Quest item used to complete bow function. |
| Flint dagger | verified | Close weapon and cutting tool | Fast short-range attack, skinning, fiber cutting, durability. |
| Dagger sheath | verified | Quick-slot explanation | Enables quick equip of dagger. |
| Retoucheur | verified | Tool maintenance | Repairs/sharpens flint tools, improves crafting. |
| Birch-bark containers | verified/plausible function | Ember/dry storage | Carry embers, preserve fire, store dry materials. |
| Backpack frame | verified | Inventory expansion | Increases carry capacity with weight penalty. |
| Stone disc / bird belt | verified/plausible function | Bird trapping/hunting | Unlocks small-game trap mechanic. |
| Belt pouch | verified | Small-tool inventory | Fast access to tinder, flint, scraper, awl, borer. |
| Tinder fungus | verified | Fire-starting | Fire/ember recovery; crafting ingredient. |
| Scraper | verified | Hide processing | Converts hide to usable leather. |
| Boring tool | verified | Crafting holes | Required for containers, straps, arrow components. |
| Bone awl | verified | Sewing/repair | Repairs clothing and shoes. |
| Flint flake | verified | Emergency blade/crafting part | Backup cutting, recipe component. |

### 11.2 Equipment progression rule

Ötzi starts with most iconic objects, but not every object starts fully usable in game terms. The bow can be unfinished, arrows limited, tools fragile, and fire vulnerable. This creates progression without inventing an ahistorical fantasy gear ladder.

---

## 12. Clothing and survival

### 12.1 Clothing table

| Clothing/item | Evidence status | Game function |
|---|---|---|
| Hide coat | verified | Base warmth and wetness protection. |
| Grass mat/cape interpretation | verified/plausible role | Rain shelter, camp rest bonus, emergency insulation. |
| Leggings | verified | Cold protection for lower body. |
| Loincloth | verified | Clothing completeness; no major mechanic needed. |
| Belt pouch | verified | Tool quick-access. |
| Layered shoes | verified | Terrain traversal, foot protection. |
| Grass shoe padding | verified/plausible mechanic | Degrades after wet terrain; replace with dry grass. |
| Bearskin cap | verified | Strong cold-resistance modifier. |

### 12.2 Survival meters

| Meter | Range | Main effects | Recovery |
|---|---:|---|---|
| Health | 0–100 | Death/fail state at 0. Injuries reduce max stamina. | Healer, rest, food, warmth. |
| Stamina | 0–100 | Sprint, attacks, chopping, swimming, cold resistance. | Rest, food, warmth. |
| Hunger | 0–100 | Low hunger drains stamina and eventually health. | Eat cooked/preserved food. |
| Warmth | 0–100 | Low warmth drains stamina and health. | Fire, shelter, clothing repair. |
| Wetness | 0–100 | Increases cold drain and shoe degradation. | Fire, shelter, time, dry clothing. |
| Injury | 0–100 | Reduces efficiency and max stamina. | Healer shelter, herbs, rest. |
| Weight | 0+ | Slows movement and increases stamina drain. | Storage frame, inventory choices. |

### 12.3 Simple survival formulas

The first implementation should use clear rate-based systems, not hidden simulation complexity.

```js
coldDrain = max(0, weatherCold + wetnessPenalty - clothingWarmth - fireBonus);
stamina -= sprintCost + attackCost + coldDrain * dt;
hunger -= hungerRate * dt;
if (hunger <= 0 || warmth <= 0) health -= exposureDamage * dt;
```

---

## 13. Ötzi appearance direction

Sprite direction:

- Middle-aged, wiry build.
- Medium-to-dark brown skin.
- Dark eyes.
- Dark hair but not fantasy-thick hair; newer interpretation suggests advanced hair loss or baldness.
- Hide coat, leggings, belt, layered shoes, bearskin cap.
- Copper axe visually distinct on belt/back.
- Bow/quiver visible when equipped or repaired.
- Dagger quick-draw animation should be compact and readable.

Important: do not use old pop-culture reconstructions as the only visual guide. Use current museum interpretation for body/appearance facts.

---

## 14. Fact system

### 14.1 Facts as rewards

Facts unlock through play, not as quiz interruptions. Each new village function unlocks a fact dialogue.

Examples:

| Trigger | Speaker/function | Example fact |
|---|---|---|
| Toolmaker unlock | Toolmaker | “The retoucheur reshapes flint edges.” |
| Firekeeper unlock | Firekeeper | “Birch-bark containers could carry embers.” |
| Hunter lodge unlock | Hunter | “Most arrows in the quiver were unfinished.” |
| Healer shelter unlock | Healer | “Ötzi had 61 tattoos, likely therapeutic rather than decorative.” |
| Watch post unlock | Elder | “The attacker did not take the valuable copper axe.” |
| Final route unlock | Story fire | “His death remains a murder mystery.” |

### 14.2 Fact record schema

```js
{
  id: 'retoucheur_tool',
  title: 'The Retoucheur',
  status: 'verified',
  category: 'equipment',
  shortText: 'A retoucheur was part of Ötzi’s toolkit and was used to work or refresh stone-tool edges.',
  gameplayText: 'Toolmaker repairs flint items faster.',
  sourceRefs: ['wierer_2018_lithic_toolkit', 'museum_equipment'],
  unlock: { building: 'toolmaker' },
  tags: ['tool', 'flint', 'crafting']
}
```

### 14.3 Fact categories

- Equipment.
- Clothing.
- Body.
- Tattoos.
- Death evidence.
- Discovery.
- Copper Age survival.
- Plausible gameplay interpretation.
- Fictional ending material.

---

## 15. Combat, hunting, and danger

### 15.1 Combat principle

Combat is survival-weighted. Fighting is costly, dangerous, and practical. The game should not become a slaughter arcade.

### 15.2 Weapons

| Weapon/tool | Role | Cost | Notes |
|---|---|---|---|
| Copper axe | Powerful melee/tool | High stamina | Also status item; should feel special. |
| Flint dagger | Fast close tool/weapon | Low/medium stamina | Cutting, skinning, emergency combat. |
| Bow | Ranged hunting/combat | Arrow scarcity | Starts unfinished; limited arrows. |
| Thrown stones | Early weak ranged | Low resource cost | Good for distraction/hunting. |
| Traps | Prepared survival tool | Resource/time cost | Snares, bird belt, pits/deadfalls if kept simple. |

### 15.3 Enemies and hazards

| Threat | Behavior | Design notes |
|---|---|---|
| Deer | Flee, graze, respond to wind/noise | Hunting challenge, not enemy. |
| Rival scout | Patrol, warn, flee or attack | Human conflict without overdoing combat. |
| Rival hunter | Ranged threat, guards camps | Use sparingly. |
| Wolf/hazard animal | Stalk/avoid/flee pattern | Only add if biome and scope justify it. |
| Cold exposure | Constant pressure | Final high pass danger. |
| Hunger | Planning pressure | Drives food loop. |
| Wetness | Cold multiplier | Makes rivers/rain meaningful. |
| Injury | Persistent penalty | Makes healing matter. |
| Falling rocks | Timed hazard | Cave/high pass. |
| River crossings | Wetness/stamina risk | Simple current push. |
| Snowstorm zones | Visibility/warmth hazard | Endgame pressure. |

### 15.4 AI states

Use small state machines:

```js
DEER: idle -> graze -> alert -> flee -> recover
RIVAL: patrol -> suspicious -> warn -> attack -> retreat
WOLF: prowl -> stalk -> lunge -> retreat
NPC: idle -> talk -> fact_unlock -> idle
```

---

## 16. Procedural world and map model

### 16.1 Map types

| Map type | Purpose | Generation style |
|---|---|---|
| Village | Hub and progression | Semi-fixed layout with auto-build slots. |
| Forest | Early gathering/hunting | Weighted biome patches, trees, clearings, trails. |
| Birch Grove | Resource site | Dense tree masks, bark nodes, cave/tree hollow. |
| Flint Cave / Scar | Dungeon | Cellular cave + guaranteed path. |
| River Bend | Resource site | River path, reeds, fish nodes, crossing hazards. |
| Alpine Meadow | Healer/clothing resources | Open patch generator, weather events. |
| Deer Woods | Hunting | Clearings, scent/wind zones, deer spawns. |
| Rival Trail Camp | Human hazard site | Path network, patrol zones, camp objects. |
| Copper Ravine | Late-game resource site | Narrow paths, rocks, rival conflict. |
| High Pass | Endgame route | Linear but tense, snow/cold/ambush. |

### 16.2 Tile/chunk model

Recommended chunk size: `32 x 32 tiles`.

Tile size first target: `16 px` internal, rendered as 24/32-style art if final assets are larger.

Layers:

```js
chunk = {
  cx, cy,
  ground: Uint16Array(32 * 32),
  object: Uint16Array(32 * 32),
  semantic: Uint32Array(32 * 32),
  discovered: Uint8Array(32 * 32),
  objects: [],
  triggers: [],
  dirty: true
};
```

Semantic bit flags:

```js
SOLID        = 1 << 0
WATER        = 1 << 1
HARVESTABLE  = 1 << 2
TRIGGER      = 1 << 3
DUNGEON_EXIT = 1 << 4
VILLAGE_SLOT = 1 << 5
COLD_ZONE    = 1 << 6
WET_ZONE     = 1 << 7
HIDE_CANOPY  = 1 << 8
```

### 16.3 Procedural generation rules

Required invariants:

- Same seed + same `WORLDGEN_VERSION` = same generated map.
- Every region must have guaranteed path from entry to objective to exit.
- Required resources must spawn before they are required by progression.
- Debug HUD must display current seed and region ID.
- Save deltas, not full generated maps unless necessary.

Algorithms to use:

| Need | Algorithm |
|---|---|
| Forest regions | Weighted biome patches + random walk clearings. |
| Trails | Biased random walk with path validation. |
| Caves | Cellular automata + flood fill + guaranteed tunnel correction. |
| Rivers | Meandering path from edge to edge + bridge/ford placement. |
| Resource placement | Weighted spawn tables by biome and distance from path. |
| Rival camps | Template pocket placed near but not on main path. |
| Village expansion | Fixed slots unlocked by building flags. |
| Solvability | Flood fill from entry; required objective and exit must be reachable. |

---

## 17. Entity model

### 17.1 Runtime entity shape

```js
{
  id: 'e123',
  kind: 'deer',
  x: 120,
  y: 96,
  vx: 0,
  vy: 0,
  radius: 6,
  hp: 20,
  state: 'graze',
  facing: 0,
  anim: 'idle',
  ttl: null,
  flags: 0,
  data: {},
  dirty: false,
  saveable: true
}
```

### 17.2 Entity types

| Entity | Save? | Collision | Behavior |
|---|---|---|---|
| Player | yes | actor circle vs tiles/entities | Input-driven movement, survival meters, tools. |
| Deer | optional | actor circle | Graze, alert, flee, can be hunted. |
| Rival villager | yes/region | actor circle/projectile | Patrol, suspicion, attack, retreat. |
| Wolf/hazard animal | optional | actor circle | Stalk/lunge/retreat if added. |
| NPC villager | yes | soft/blocking depending placement | Static dialogue/fact provider. |
| Resource node | yes if harvested | node collision | Interact/gather; marks harvested. |
| Dropped item | yes short-term | pickup radius | Adds to inventory. |
| Projectile/arrow | no or short save | ray/circle | Moves, collides, expires. |
| Trap | yes | trigger | Catches animal or damages enemy. |
| Fire/camp | yes | soft | Warmth, cooking, ember management. |
| Building/workstation | yes | blocking/interact | Unlocks functions. |
| Trigger/door/exit | yes if changed | trigger | Scene transition or event. |

---

## 18. Rendering and art direction

### 18.1 Final art target

Best style:

> High-resolution low-color hand-drawn tile art.

Not raw NES. The look should be more artistic while staying readable and compact.

Characteristics:

- 24×24 or 32×32 visual tiles.
- Limited Copper Age palette.
- Hand-drawn outlines.
- Rough bark, hide, grass, stone, snow, river textures.
- Smooth phone scaling.
- Small animations: grass sway, fire flicker, snow drift, footstep dust.
- Painterly but not muddy.

### 18.2 Art pipeline

1. Start with procedural placeholder sprites.
2. Build gameplay with simple generated tiles and silhouettes.
3. Replace only stable assets with tiny hand-drawn sprite sheets.
4. Keep source assets in GitHub.
5. Embed final tiny sheets into `dist/index.html` as compressed data URLs or compact generated atlas data.
6. Never make the final release file the only editable art source.

### 18.3 Renderer layers

Draw order:

1. Clear canvas.
2. Ground chunk cache.
3. Low objects under player.
4. Resource nodes and pickups.
5. Actors sorted by Y coordinate.
6. High objects/canopy.
7. Particles.
8. Weather overlays.
9. Cold/wetness/damage vignette.
10. Canvas HUD/minimap if active.
11. Debug overlay.
12. DOM panels above canvas.

### 18.4 Performance rules

- Use one visible world canvas at first.
- Use offscreen canvas caches for chunks, minimap, generated sprites, and static UI icons.
- Cap DPR around 2.
- Snap pixel-art drawing to integer coordinates.
- Pool particles and projectiles.
- Avoid per-frame image decoding.
- Avoid layout reads in the render loop.
- Avoid heavy blur/shadow effects on mobile.

---

## 19. Audio spec

### 19.1 Audio rules

- Use one `AudioContext`.
- Unlock audio from the Start button or first intentional gesture.
- Use procedural SFX first.
- Use gain envelopes to avoid clicks.
- Provide mute and volume settings.
- Do not autoplay persistent sound before user gesture.
- Do not embed long base64 music tracks in the first versions.

### 19.2 SFX set

| Sound | Implementation idea |
|---|---|
| UI click | Short triangle/square blip. |
| Gather wood | Noisy scrape + low click. |
| Gather flint | Bright click. |
| Gather grass | Soft hiss. |
| Craft | Two or three percussive pitch steps. |
| Bow draw | Rising tone with noise. |
| Arrow release | Short snap + air tail. |
| Arrow hit | Click or thump depending target. |
| Deer flee | Quiet breath/noise burst. |
| Rival alert | Narrow tone burst. |
| Footstep | Short filtered noise randomized by biome. |
| Fire crackle | Sparse micro-noise bursts. |
| Cold wind | Low filtered noise loop. |
| Village unlock | Small melodic dyad/triad. |
| Low health/stamina | Soft heartbeat pulse. |

---

## 20. Save/load spec

### 20.1 Save schema

```js
{
  saveVersion: 1,
  worldgenVersion: 1,
  seed: 'OTZI-SEED-001',
  scene: 'overworld',
  region: 'forest_start',
  player: {
    x: 0, y: 0,
    hp: 100,
    stamina: 100,
    hunger: 100,
    warmth: 100,
    wetness: 0,
    injury: 0,
    weight: 0,
    equipped: 'flint_dagger'
  },
  inventory: {
    items: {},
    quickSlots: []
  },
  village: {
    buildings: {},
    passive: {},
    day: 1
  },
  dungeons: {},
  facts: {
    discovered: []
  },
  map: {
    discoveredChunks: [],
    deltas: {}
  },
  settings: {
    music: 0.5,
    sfx: 0.8,
    leftHanded: false,
    reducedFx: false
  },
  stats: {
    days: 0,
    deerHunted: 0,
    arrowsFired: 0,
    dungeonsCompleted: 0
  }
}
```

### 20.2 Save rules

- Wrap all `localStorage` access in `try/catch`.
- Store compact JSON only.
- No canvas, cache, pointer, live audio, DOM, or particle state in save files.
- Include export/import string fallback.
- Autosave at safe checkpoints and on `visibilitychange`.
- Include backup slot if possible.
- On save migration failure, show recovery UI instead of crashing.

---

## 21. Source architecture

### 21.1 Repo structure

```text
otzi-iceman-game/
  src/
    main.js
    config.js
    viewport.js
    rng.js
    input.js
    action-map.js
    save.js
    audio.js
    assets.js
    tilemap.js
    worldgen.js
    entities.js
    collision.js
    camera.js
    scenes.js
    dialogue.js
    inventory.js
    crafting.js
    village.js
    facts.js
    render-world.js
    render-ui.js
    debug.js
    test-hooks.js
  tools/
    build-single-file.mjs
  dist/
    index.html
  tests/
    smoke.spec.js
  docs/
    complete-spec.md
    engine-field-manual.md
    reference-survey.md
    architecture-decision-record.md
    testing-plan.md
    workflow-for-hermes-codex.md
  artifacts/
    screenshots/
    logs/
  README.md
  package.json
```

### 21.2 AI-safe constitution

This should live at the top of the readable source and be carried into the readable release.

```text
AI-SAFE ENGINE CONSTITUTION

This source is organized by named modules. Edit only the intended module.
Do not edit minified release files during development.
RENDER_* modules may read state but may not mutate simulation state.
INPUT collects raw state only; ACTION_MAP derives semantic intent.
WORLDGEN must be deterministic for the same seed and WORLDGEN_VERSION.
SAVE must serialize durable state only and bump SAVE_VERSION on schema changes.
Every code change must pass smoke tests before merging.
Every visual change must produce at least one screenshot artifact.
Every mobile control change must run the Android real-phone checklist.
Never add required external runtime dependencies, assets, fonts, or network calls.
Any uncertainty in archaeology text must be tagged VERIFIED, PLAUSIBLE, or FICTIONAL.
```

---

## 22. Testing harness

### 22.1 Automated smoke checks

Minimum automated tests:

- Page loads.
- Canvas exists.
- Start button works.
- Audio unlock path does not throw.
- `requestAnimationFrame` advances.
- No console errors.
- No uncaught page errors.
- No external network requests.
- Player can move.
- Collision blocks trees/walls.
- Gather action works.
- Inventory updates.
- Dungeon transition works.
- Dungeon completion unlocks village building.
- NPC fact dialogue appears.
- Save/load round-trip works.
- Export/import save works.
- Resize updates canvas backing buffer.
- Portrait layout remains stable.
- Screenshot captured on reference seed.

### 22.2 Test hook API

Expose only a stable testing facade:

```js
window.__OTZI_TEST__ = {
  startGame,
  setSeed,
  teleport,
  give,
  stepFrames,
  readState,
  exportSave,
  importSave,
  completeDungeon,
  toggleDebug
};
```

### 22.3 Playwright pseudocode

```js
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

test('otzi smoke', async ({ page }) => {
  const errors = [];
  const external = [];

  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.route('**/*', route => {
    const url = route.request().url();
    if (!url.startsWith('http://localhost:8080/') &&
        !url.startsWith('data:') &&
        !url.startsWith('blob:')) {
      external.push(url);
      route.abort();
    } else {
      route.continue();
    }
  });

  await page.goto('http://localhost:8080/');
  await page.getByRole('button', { name: /start/i }).click();
  await page.evaluate(() => window.__OTZI_TEST__.setSeed('SMOKE-SEED-01'));
  await page.evaluate(() => window.__OTZI_TEST__.teleport('forest_start'));
  await page.evaluate(() => window.__OTZI_TEST__.stepFrames(30));

  const state = await page.evaluate(() => window.__OTZI_TEST__.readState());
  expect(state.scene).toBe('overworld');
  expect(state.player).toBeTruthy();
  await expect(page).toHaveScreenshot('otzi-smoke-overworld.png');
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
```

### 22.4 Manual Android Chrome checklist

| Test | Evidence required |
|---|---|
| First load | Screenshot of title shell. |
| Start/audio unlock | Console note or screen capture. |
| Movement joystick + action multitouch | Short video with debug input overlay. |
| Drag off joystick | Video showing release/cancel state resets. |
| Pointercancel recovery | Debug overlay shows active pointer count returns to 0. |
| Browser UI show/hide | Before/after screenshots with viewport values. |
| Portrait/landscape rotate | Paired screenshots with stable player tile. |
| Fullscreen request/fallback | Screenshot and console outcome. |
| Background app/return | Game resumes without teleport or giant delta. |
| Save/reload localhost | Save restored. |
| File fallback | Storage warning/export/import path works. |

---

## 23. Build and release workflow

### 23.1 Development workflow

1. Edit split source in `src/`.
2. Run local dev server.
3. Run smoke tests.
4. Capture screenshots for visual changes.
5. Build readable single-file release.
6. Verify no external requests.
7. Test under `localhost`.
8. Test `file://` save fallback.
9. Commit source and generated release separately.
10. Deploy `dist/index.html` to GitHub Pages.

### 23.2 Build script responsibilities

`tools/build-single-file.mjs` must:

- Read source modules in fixed order.
- Inline CSS.
- Inline JS.
- Inline tiny generated data tables.
- Reject external URLs unless allowlisted for documentation only.
- Write `dist/index.html`.
- Write build metadata comment with date, git hash if available, `SAVE_VERSION`, `WORLDGEN_VERSION`.
- Optionally write `dist/index.min.html` only after readable build passes tests.

### 23.3 Definition of done for a release

A release is not done until:

- `dist/index.html` exists.
- It loads under localhost.
- It has no console errors.
- It makes no external requests.
- Smoke test passes.
- A screenshot artifact exists.
- Save/load works.
- Export/import fallback works.
- Mobile layout is manually checked or marked unverified.

---

## 24. MVP milestone plan

### Milestone 1 — Engine shell

Goal: prove the engine skeleton.

Required:

- Portrait shell.
- Canvas world area.
- DOM UI root.
- Start screen.
- Fixed-step loop.
- Viewport/DPR resize.
- Player movement.
- Camera follow.
- Tile collision.
- Debug overlay.
- Playwright smoke test.

### Milestone 2 — Forest and gathering

Goal: prove the survival resource loop.

Required:

- Seeded procedural forest.
- Gather sticks, stones, bark, grass, flint.
- Inventory UI.
- Basic crafting: fire, simple repair, rough arrow part.
- Stamina/hunger/warmth meters.
- One resource node save delta.

### Milestone 3 — Resource dungeon and threats

Goal: prove adventure progression.

Required:

- One cave/flint resource-run dungeon.
- Transition into/out of dungeon.
- Deer behavior.
- One rival villager encounter.
- Dungeon completion flag.
- Return-to-village trigger.

### Milestone 4 — Village and facts

Goal: prove village unlock and educational reward.

Required:

- Auto-building unlock.
- One NPC fact dialogue.
- Story fire or fact log.
- Local save/load.
- Export/import save string.
- Sliding minimap tab.

### Milestone 5 — Single-file release

Goal: prove deployable artifact.

Required:

- Build script creates `dist/index.html`.
- No external requests.
- GitHub Pages deploy.
- Android Chrome manual pass.
- Evidence report with screenshots/logs.

---

## 25. Technical hurdles and risk register

| Rank | Risk | Symptom | Prevention | Test | Fallback |
|---:|---|---|---|---|---|
| 1 | Scope creep | Systems multiply before loop is fun. | MVP gates, no colony sim, no large quest tree early. | Milestone review. | Cut to one forest + one dungeon + one village unlock. |
| 2 | Procedural solvability | Unwinnable seed. | Validate path and required resources. | Seed pack tests. | Regenerate with sub-seed. |
| 3 | Mobile controls | Missed inputs, thumb overlap. | Pointer capture, big zones, burst sprint. | Android multitouch checklist. | Simplified two-button mode. |
| 4 | Art bloat | Single file becomes huge and hard to edit. | Procedural placeholders, tiny atlas only after loop. | Build size check. | Keep procedural style longer. |
| 5 | Save corruption | Old saves fail. | Versioned schema and migrations. | Round-trip and migration tests. | Backup slot and import/export rescue. |
| 6 | NPC/pathfinding complexity | Village becomes too expensive. | Static NPCs, simple dialogue. | Entity count/perf overlay. | Remove NPC movement. |
| 7 | Combat readability | Touch combat feels unfair. | Forgiving arcs, clear telegraphs. | Real-phone combat test. | Reduce enemy aggression. |
| 8 | Historical drift | Facts become invented or wrong. | Fact registry labels. | Content review. | Relabel as fictional or cut. |
| 9 | Phone performance | Jank, heat, long frames. | Chunk caches, low-res upscale, particle caps. | Benchmark scene. | Dynamic resolution scale. |
| 10 | Ending tone | Overclaims real death motive. | Mark final defense as fictional/mythic. | Narrative review. | Use ambiguous symbolic ending. |

---

## 26. Open decisions before coding

These are the only decisions needed before Milestone 1:

1. **Art target for prototype:** procedural placeholder, clean pixel art, or hand-drawn low-color.
2. **Initial internal resolution:** likely `360 x 640`, `390 x 720`, or dynamic low-res buffer.
3. **Tile visual size:** 16 internal pixels with 24/32 visual style, or true 24/32 tiles.
4. **First resource-run site:** Flint Cave is the strongest MVP dungeon.
5. **First village unlock:** Toolmaker is the strongest because it proves equipment/crafting/fact loop.
6. **Public title:** keep working title for now or switch before repo creation.

Recommended defaults:

- Art target: **procedural placeholder now, hand-drawn low-color later**.
- Internal resolution: **360 x 640 portrait logical target**, DPR-capped.
- Tile size: **16 px internal tile, integer scaled**.
- First dungeon: **Flint Scar / Cave**.
- First building: **Toolmaker**.
- Title: **keep working title until first playable exists**.

---

## 27. Codex-ready implementation instruction

Use this as the basis for the next handoff:

```text
Build a portrait-mode single-file HTML5 Canvas 2D top-down survival adventure prototype called “The Legend of Ötzi the Iceman.”

Do not use external runtime dependencies, external art, external audio, CDN files, eval, inline event handlers, or copied game assets.

Use split source files during development and generate one final dist/index.html.

Core prototype:
- Portrait mobile layout.
- Canvas world area above.
- DOM/canvas HUD and touch controls below.
- Sliding minimap tab.
- Fixed-step simulation.
- Seeded procedural forest map.
- Player movement, stamina, hunger, warmth.
- Gather sticks, stones, bark, grass, flint.
- Craft simple tools.
- One cave/resource dungeon.
- One deer/hunting behavior.
- One rival villager enemy.
- Completing the dungeon unlocks one automatic village building.
- Village NPC gives one Ötzi fact.
- Save/load with localStorage and export/import fallback.
- Debug overlay showing seed, FPS, player tile, entity count, viewport, DPR, active pointers.
- No console errors.
- No uncaught page errors.
- No external network requests.
- Playwright smoke test must pass.
- Produce screenshot evidence.
```

---

## 28. Final implementation goal

The first playable target is not the whole game. It is a **vertical slice** proving:

> Explore forest → gather resources → enter flint cave → survive threat → complete dungeon → return to village → unlock toolmaker → hear one Ötzi fact → save progress → reload correctly.

Once that loop is verified operational, expansion becomes safe.

---

## 29. Current exact state and next action

### What was done

- Converted the concept notes, uploaded Canvas 2D engine guidance, single-file HTML game guidance, and Ötzi gameplay material into a complete build spec.
- Defined the engine choice, game loop, village system, item/fact database, rendering approach, mobile input design, save schema, testing plan, repo layout, MVP milestones, and risk register.

### What was verified

- The spec is internally consistent with the single-file Canvas 2D approach.
- The main Ötzi equipment/clothing/death facts have clear source categories to seed a fact database.
- The proposed engine is technically feasible as a browser-based single-file game.

### What failed

- No code has been built or run yet.
- No engine prototype has been tested.
- No Android Chrome pass has been performed.

### Current exact state

- Deliverable: this complete spec.
- Implementation: not started.
- Art target: undecided, with recommended default of procedural placeholders first.

### Remaining blockers

- Choose whether Milestone 1 starts with procedural placeholder art or a small hand-drawn placeholder sheet.
- Choose public repo name.

### Next actionable step

Create the starting Hermes/Codex handoff for **Milestone 1: Engine Shell**.
