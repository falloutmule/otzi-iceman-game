/* SECTION 05: AUDIO */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.audio = {
  ctx: null,
  unlocked: false,
  async unlock() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state !== "running") await this.ctx.resume();
    this.unlocked = true;
    this.blip(440, 0.055);
  },
  blip(freq, seconds) {
    if (!this.ctx || !this.unlocked) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + seconds + 0.02);
  }
};
