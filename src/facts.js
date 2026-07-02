/* FUTURE MODULE: FACTS */
var OTZI = window.OTZI || (window.OTZI = {});
OTZI.facts = {
  create() {
    return {
      discovered: [],
      records: [
        {
          id: "retoucheur_tool",
          title: "The Retoucheur",
          status: "verified",
          category: "equipment",
          shortText: "A retoucheur was part of Otzi's toolkit and was used to work or refresh stone-tool edges.",
          unlock: { building: "toolmaker" }
        }
      ]
    };
  },
  get(id, facts = OTZI.game.facts) {
    return facts.records.find((record) => record.id === id) || null;
  },
  isDiscovered(id, facts = OTZI.game.facts) {
    return facts.discovered.includes(id);
  },
  discover(id) {
    if (!this.isDiscovered(id)) OTZI.game.facts.discovered.push(id);
    return this.get(id);
  },
  latestDiscovered(facts = OTZI.game.facts) {
    const id = facts.discovered[facts.discovered.length - 1];
    return id ? this.get(id, facts) : null;
  }
};
