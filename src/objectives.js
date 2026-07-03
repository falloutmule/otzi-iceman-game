/* FUTURE MODULE: OBJECTIVES */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.objectives = {
  current(game = OTZI.game) {
    if (!game.dungeons.flint_scar.completed && (game.inventory.goodFlintCore || 0) < 1) {
      if (game.scene === "dungeon") {
        return {
          id: "find_good_flint_core",
          title: "Find the Good Flint Core",
          text: "Explore Flint Scar and look for the marked good flint core."
        };
      }
      return {
        id: "find_flint_scar",
        title: "Find Flint Scar",
        text: "Travel east from the village."
      };
    }
    if ((game.inventory.goodFlintCore || 0) >= 1 && !OTZI.village.has("toolmaker")) {
      return {
        id: "return_to_village",
        title: "Return to Village",
        text: "Bring the good flint core back to the village."
      };
    }
    if (OTZI.village.has("toolmaker") && (game.inventory.crudeSpear || 0) < 1 && (game.inventory.hardenedSpear || 0) < 1) {
      return {
        id: "craft_crude_spear",
        title: "Craft a Crude Spear",
        text: "Open MENU and shape a spear from stick, stone, and bark."
      };
    }
    if ((game.inventory.crudeSpear || 0) > 0 && (game.inventory.hardenedSpear || 0) < 1) {
      return {
        id: "harden_spear_tip",
        title: "Harden the Spear Tip",
        text: "Return to the village hearth and use the fire."
      };
    }
    if ((game.inventory.hardenedSpear || 0) > 0) {
      return {
        id: "hunt_small_game",
        title: "Prepare for the Hunt",
        text: "Search animal clearings and test the hardened spear."
      };
    }
    return {
      id: "explore",
      title: "Explore",
      text: "Gather supplies, fill in the map, and look for animal clearings."
    };
  },
  screenCard(area, game = OTZI.game) {
    if (!area) return { title: "", text: "" };
    if (game.scene === "dungeon") {
      return area.kind === "flint_chamber" ? {
        title: "Flint Chamber",
        text: "The good flint core should be here."
      } : area.kind === "narrow_passage" ? {
        title: "Narrow Passage",
        text: "Press deeper into Flint Scar."
      } : area.kind === "loose_stone_hazard" ? {
        title: "Loose Stones",
        text: "Watch your footing. This patch drains stamina."
      } : area.kind === "entrance_room" ? {
        title: "Flint Scar",
        text: "Explore east and look for the marked core."
      } : {
        title: "Flint Scar Side Room",
        text: "Search the cave and keep moving."
      };
    }
    const animalHint = this.adjacentAnimalHint(game.world, area.gridX, area.gridY, game.seed);
    const cards = {
      village_home: {
        title: "Village Camp",
        text: OTZI.village.has("toolmaker") ? "Your hearth is ready. Harden spear tips here." : "Home base. Flint Scar lies one screen east."
      },
      easy_gather: {
        title: "Easy Gathering",
        text: animalHint || "Gather food and materials before heading farther out."
      },
      forest_trail: {
        title: "Forest Trail",
        text: animalHint || "Keep moving. The trail connects the nearby screens."
      },
      dense_forest: {
        title: "Dense Forest",
        text: animalHint || "Thick trees slow visibility. Watch for resources and tracks."
      },
      animal_clearing: {
        title: "Animal Clearing",
        text: "Small game lives here. Approach slowly and use to catch."
      },
      flint_scar_entrance: {
        title: "Flint Scar Entrance",
        text: "The cave mouth is here. Use near the scar to enter."
      },
      river_edge_placeholder: {
        title: "River Edge",
        text: "A cold edge of the world. Crossings are not ready yet."
      },
      rival_warning_placeholder: {
        title: "Rival Signs",
        text: "Strange signs mark this ground. That threat comes later."
      },
      high_pass_locked_placeholder: {
        title: "High Pass Locked",
        text: "Snow closes the high pass for now."
      },
      quiet_empty: {
        title: "Quiet Forest",
        text: animalHint || "A calm travel screen with little to gather."
      }
    };
    return cards[area.kind] || { title: "Forest", text: animalHint || "Explore and gather supplies." };
  },
  adjacentAnimalHint(world, x, y, seed) {
    const neighbors = [
      { dir: "north", x, y: y - 1 },
      { dir: "south", x, y: y + 1 },
      { dir: "west", x: x - 1, y },
      { dir: "east", x: x + 1, y }
    ];
    for (const next of neighbors) {
      if (next.x < 0 || next.y < 0 || next.x >= world.gridW || next.y >= world.gridH) continue;
      const screen = OTZI.worldGrid.getOverworldScreen(world, seed, next.x, next.y);
      if (screen.kind === "animal_clearing") return `Hare tracks lead ${next.dir}.`;
    }
    return "";
  }
};
