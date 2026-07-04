/* FUTURE MODULE: CRAFTING */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.crafting = {
  itemLabels: {
    flint: "Flint",
    stick: "Stick",
    stone: "Stone",
    bark: "Bark",
    grass: "Grass",
    food: "Food",
    rawMeat: "Raw Meat",
    crudeTool: "Crude Cutting Tool",
    crudeSpear: "Crude Spear",
    hardenedSpear: "Hardened Spear",
    goodFlintCore: "Good Flint Core"
  },
  recipes: [
    {
      id: "crude_cutting_tool",
      name: "Crude Cutting Tool",
      inputs: { stick: 1, flint: 1, grass: 1 },
      output: { item: "crudeTool", count: 1 }
    },
    {
      id: "crude_spear",
      name: "Crude Spear",
      inputs: { stick: 1, stone: 1, bark: 1 },
      output: { item: "crudeSpear", count: 1 }
    }
  ],
  getRecipe(id) {
    return this.recipes.find((recipe) => recipe.id === id) || null;
  },
  label(item) {
    return this.itemLabels[item] || item;
  },
  formatCount(item, count) {
    const label = this.label(item);
    return `${count} ${label}${count === 1 ? "" : "s"}`;
  },
  joinParts(parts) {
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
    return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
  },
  describeRecipe(id, inventory = OTZI.game.inventory) {
    const recipe = this.getRecipe(id);
    if (!recipe) return null;
    const parts = Object.entries(recipe.inputs).map(([item, count]) => {
      const have = inventory[item] || 0;
      return {
        item,
        need: count,
        have,
        missing: Math.max(0, count - have)
      };
    });
    return {
      id: recipe.id,
      name: recipe.name,
      output: { ...recipe.output },
      parts,
      canCraft: parts.every((part) => part.missing === 0)
    };
  },
  missingInputs(id, inventory = OTZI.game.inventory) {
    const recipe = this.describeRecipe(id, inventory);
    if (!recipe) return [];
    return recipe.parts
      .filter((part) => part.missing > 0)
      .map((part) => this.formatCount(part.item, part.missing));
  },
  requirementText(id) {
    const recipe = this.describeRecipe(id, {});
    if (!recipe) return "";
    const parts = recipe.parts.map((part) => this.formatCount(part.item, part.need).toLowerCase());
    return `Need ${this.joinParts(parts)}.`;
  },
  canCraft(id, inventory = OTZI.game.inventory) {
    const recipe = this.describeRecipe(id, inventory);
    return !!recipe && recipe.canCraft;
  },
  canHardenAtHearth(game = OTZI.game) {
    return !!game.focusedEntrance && game.focusedEntrance.kind === "hearth" && (game.inventory.crudeSpear || 0) > 0;
  },
  canCookAtHearth(game = OTZI.game) {
    return !!game.focusedEntrance && game.focusedEntrance.kind === "hearth" && (game.inventory.rawMeat || 0) > 0;
  },
  canEatFood(game = OTZI.game) {
    return (game.inventory.food || 0) > 0;
  },
  describeHardening(game = OTZI.game) {
    const haveSpear = game.inventory.crudeSpear || 0;
    const atHearth = !!game.focusedEntrance && game.focusedEntrance.kind === "hearth";
    return {
      canHarden: !!(haveSpear > 0 && atHearth),
      haveSpear,
      atHearth,
      needsText: "Needs: 1 Crude Spear + Village Hearth",
      haveText: `Have: Crude Spear ${haveSpear} / 1`,
      statusText: haveSpear < 1 ? "Missing: 1 Crude Spear" : atHearth ? "Status: Hearth ready" : "Status: Return to the village hearth"
    };
  },
  describeCooking(game = OTZI.game) {
    const haveMeat = game.inventory.rawMeat || 0;
    const atHearth = !!game.focusedEntrance && game.focusedEntrance.kind === "hearth";
    return {
      canCook: !!(haveMeat > 0 && atHearth),
      haveMeat,
      atHearth,
      needsText: "Needs: 1 Raw Meat + Village Hearth",
      haveText: `Have: Raw Meat ${haveMeat} / 1`,
      statusText: haveMeat < 1 ? "Missing: 1 Raw Meat" : atHearth ? "Status: Hearth ready" : "Status: Return to the village hearth"
    };
  },
  describeEating(game = OTZI.game) {
    const haveFood = game.inventory.food || 0;
    const hunger = Math.round(game.player.hunger || 0);
    return {
      canEat: haveFood > 0,
      haveFood,
      hunger,
      needsText: "Needs: 1 Food",
      haveText: `Have: Food ${haveFood} / 1`,
      statusText: haveFood < 1 ? "Missing: 1 Food" : `Status: Hunger ${hunger} / 100`
    };
  },
  hardenSpearTip() {
    if ((OTZI.game.inventory.crudeSpear || 0) < 1) {
      OTZI.dialogue.toast("Craft a crude spear first");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    if (!this.canHardenAtHearth()) {
      OTZI.dialogue.toast("Return to the village hearth");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    return OTZI.game.useVillageHearth();
  },
  cookMeat() {
    if ((OTZI.game.inventory.rawMeat || 0) < 1) {
      OTZI.dialogue.toast("Harvest meat first");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    if (!this.canCookAtHearth()) {
      OTZI.dialogue.toast("Return to the village hearth");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    OTZI.inventory.add("rawMeat", -1);
    OTZI.inventory.add("food", 1);
    OTZI.dialogue.toast("Cooked raw meat +1 food");
    OTZI.audio.blip(700, 0.045);
    return true;
  },
  eatFood() {
    if ((OTZI.game.inventory.food || 0) < 1) {
      OTZI.dialogue.toast("Need food first");
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    OTZI.inventory.add("food", -1);
    OTZI.survival.eat(OTZI.game.player, 18);
    OTZI.dialogue.toast("Ate food - hunger lowered");
    OTZI.audio.blip(520, 0.04);
    return true;
  },
  craft(id) {
    const recipe = this.getRecipe(id);
    if (!recipe) {
      OTZI.dialogue.toast("Unknown recipe");
      return false;
    }
    if (!this.canCraft(id)) {
      const missing = this.missingInputs(id);
      OTZI.dialogue.toast(`Need ${missing.join(", ")}`);
      OTZI.audio.blip(220, 0.035);
      return false;
    }
    for (const [item, count] of Object.entries(recipe.inputs)) {
      OTZI.inventory.add(item, -count);
    }
    OTZI.inventory.add(recipe.output.item, recipe.output.count);
    OTZI.dialogue.toast(`Crafted ${recipe.name}`);
    OTZI.audio.blip(720, 0.045);
    return true;
  }
};
