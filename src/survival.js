/* SECTION 08C: SURVIVAL */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.survival = {
  clamp(v, min = 0, max = 100) {
    return Math.max(min, Math.min(max, v));
  },
  spendStamina(player, amount) {
    player.stamina = this.clamp(player.stamina - amount);
  },
  eat(player, amount) {
    player.hunger = this.clamp(player.hunger - amount);
  },
  update(player, dt, sprinting) {
    player.health = this.clamp(player.health);
    player.stamina = this.clamp(player.stamina + (sprinting ? -22 : 14) * dt);
    player.hunger = this.clamp(player.hunger + 0.08 * dt);
    player.warmth = this.clamp(player.warmth + (player.wetness > 50 ? -0.5 : 0.08) * dt);
    player.wetness = this.clamp(player.wetness);
  },
  snapshot(player) {
    return {
      health: player.health,
      stamina: player.stamina,
      hunger: player.hunger,
      warmth: player.warmth,
      wetness: player.wetness
    };
  },
  apply(player, meters = {}) {
    player.health = this.clamp(meters.health ?? player.health);
    player.stamina = this.clamp(meters.stamina ?? player.stamina);
    player.hunger = this.clamp(meters.hunger ?? player.hunger);
    player.warmth = this.clamp(meters.warmth ?? player.warmth);
    player.wetness = this.clamp(meters.wetness ?? player.wetness);
  }
};
