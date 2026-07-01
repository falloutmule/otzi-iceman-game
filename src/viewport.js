/* SECTION 03: VIEWPORT */
var OTZI = window.OTZI || (window.OTZI = {});

OTZI.viewport = {
  cssW: 0,
  cssH: 0,
  dpr: 1,
  internalW: 0,
  internalH: 0,
  init() {
    const resize = () => this.resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", () => setTimeout(resize, 80));
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resize);
      window.visualViewport.addEventListener("scroll", resize);
    }
    this.resize();
  },
  resize() {
    const canvas = OTZI.dom.canvas;
    const rect = canvas.getBoundingClientRect();
    this.cssW = Math.max(1, Math.floor(rect.width));
    this.cssH = Math.max(1, Math.floor(rect.height));
    this.dpr = Math.min(OTZI.CFG.dprCap, window.devicePixelRatio || 1);
    this.internalW = Math.max(1, Math.floor(this.cssW * this.dpr));
    this.internalH = Math.max(1, Math.floor(this.cssH * this.dpr));
    if (canvas.width !== this.internalW || canvas.height !== this.internalH) {
      canvas.width = this.internalW;
      canvas.height = this.internalH;
    }
    const ctx = OTZI.dom.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }
};
