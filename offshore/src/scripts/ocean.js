// Canvas port of the Redesign "calm the tides" wave field (concept v1).
// Chop is the only input: 0 = glassy, 1 = rough. It eases toward the target
// so state changes settle the water instead of snapping it.

/** @param {HTMLCanvasElement} canvas */
export function ocean(canvas) {
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let chop = 0.95;
  let target = 0.95;
  let w = 0;
  let h = 0;

  // Fixed per-line wave parameters, same seeded generator as the concept.
  let seed = 7;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const LINES = 34;
  const params = Array.from({ length: LINES }, () => ({
    k1: 0.010 + r() * 0.006, k2: 0.031 + r() * 0.02, k3: 0.09 + r() * 0.05,
    f1: r() * 6.28, f2: r() * 6.28, f3: r() * 6.28,
  }));

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** @param {number} t seconds */
  function draw(t) {
    chop += (target - chop) * 0.02;
    ctx.clearRect(0, 0, w, h);

    const horizon = h * 0.42;
    const glow = ctx.createRadialGradient(w / 2, horizon, 0, w / 2, horizon, h * 0.6);
    glow.addColorStop(0, `rgba(159,232,255,${0.22 * (1 - chop)})`);
    glow.addColorStop(1, 'rgba(159,232,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#bfefff';
    ctx.globalAlpha = 0.15 + 0.35 * (1 - chop);
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(w, horizon);
    ctx.stroke();

    ctx.strokeStyle = '#7fd6ff';
    for (let i = 0; i < LINES; i++) {
      const { k1, k2, k3, f1, f2, f3 } = params[i];
      const p = Math.pow(i / (LINES - 1), 1.7);
      const base = horizon + p * (h - horizon + 40);
      const amp = (2 + 24 * p) * (0.12 + chop);
      ctx.globalAlpha = 0.1 + 0.45 * p;
      ctx.lineWidth = 0.6 + p * 1.1;
      ctx.beginPath();
      for (let x = -10; x <= w + 10; x += 6) {
        const y = base + amp * (
          Math.sin(x * k1 + f1 + t * 0.6) +
          chop * 0.8 * Math.sin(x * k2 + f2 - t * 1.1) +
          chop * chop * 0.6 * Math.sin(x * k3 + f3 + t * 1.9)
        );
        if (x === -10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  let id = 0;
  const t0 = performance.now();
  function tick(now) {
    draw(reduceMotion ? 0 : (now - t0) / 1000);
    id = requestAnimationFrame(tick);
  }

  resize();
  addEventListener('resize', resize);
  id = requestAnimationFrame(tick);

  return {
    /** @param {number} value 0..1 */
    setChop(value) { target = value; },
    stop() { cancelAnimationFrame(id); },
  };
}
