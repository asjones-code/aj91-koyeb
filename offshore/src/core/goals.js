// src/core/goals.js

/**
 * Where a session stands against its goals.
 * `fraction` is progress toward `next`, measured from zero (90m of a 2h goal is 0.75).
 *
 * @param {number[]} goalsMs
 * @param {number} elapsed  ms
 * @returns {{ reached: number[], next: number | null, fraction: number }}
 */
export function goalProgress(goalsMs, elapsed) {
  const sorted = [...goalsMs].sort((a, b) => a - b);
  const reached = sorted.filter((g) => elapsed >= g);
  const next = sorted.find((g) => elapsed < g) ?? null;
  return { reached, next, fraction: next === null ? 1 : elapsed / next };
}
