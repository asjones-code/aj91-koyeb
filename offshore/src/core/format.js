// src/core/format.js

/** 2_832_000 → "00:47:12" @param {number} ms */
export function clock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** 5_520_000 → "1h 32m", 1_500_000 → "25m" @param {number} ms */
export function short(ms) {
  const m = Math.max(0, Math.floor(ms / 60_000));
  const h = Math.floor(m / 60);
  if (h === 0) return `${m}m`;
  return m % 60 === 0 ? `${h}h` : `${h}h ${m % 60}m`;
}
