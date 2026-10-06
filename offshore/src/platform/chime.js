// src/platform/chime.js
// A soft synthesized bell, so no audio file is needed. Browsers only allow
// sound after a tap, so unlock() must be called from a tap handler first.
// Untested on iPhone: the ringer switch may silence Web Audio (task 2 spike).

export function chime() {
  /** @type {AudioContext | null} */
  let ctx = null;

  return {
    unlock() {
      ctx ??= new AudioContext();
      ctx.resume();
    },
    play() {
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 660;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.6);
    },
  };
}
