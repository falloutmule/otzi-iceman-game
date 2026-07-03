/* FUTURE MODULE: CRAFTING */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.crafting = {
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
  canCraft(id, inventory = OTZI.game.inventory) {
    const recipe = this.getRecipe(id);
    if (!recipe) return false;
    return Object.entries(recipe.inputs).every(([item, count]) => (inventory[item] || 0) >= count);
  },
  craft(id) {
    const recipe = this.getRecipe(id);
    if (!recipe) {
      OTZI.dialogue.toast("Unknown recipe");
      return false;
    }
    if (!this.canCraft(id)) {
      OTZI.dialogue.toast("Missing resources");
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
