// src/platform/store.js
// Everything Offshore remembers, under one versioned localStorage key.
// Bump the version (and write a migration) if the shape ever changes.

export const KEY = 'offshore.v1';

const MIN = 60_000;

/**
 * @typedef {object} Data
 * @property {import('../core/session.js').Session | null} current  running or just-ended session
 * @property {import('../core/session.js').Session[]} history         finished sessions, oldest first
 * @property {{ goalsMs: number[], sound: boolean, keepAwake: boolean }} settings
 */

/** @returns {Data} */
export function defaults() {
  return { current: null, history: [], settings: { goalsMs: [25 * MIN, 50 * MIN], sound: false, keepAwake: false } };
}

/** Missing or corrupt data gives defaults, never a crash. @param {Storage} storage @returns {Data} */
export function load(storage = localStorage) {
  const base = defaults();
  try {
    const d = JSON.parse(storage.getItem(KEY) ?? 'null');
    if (!d || typeof d !== 'object') return base;
    return {
      current: d.current ?? null,
      history: Array.isArray(d.history) ? d.history : [],
      settings: { ...base.settings, ...d.settings },
    };
  } catch {
    return base;
  }
}

/** @param {Data} data @param {Storage} storage */
export function save(data, storage = localStorage) {
  storage.setItem(KEY, JSON.stringify(data));
}
