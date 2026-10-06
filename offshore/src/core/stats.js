// src/core/stats.js

import { elapsedMs } from './session.js';

/**
 * Total offline time across finished sessions. A running session counts as zero.
 * @param {import('./session.js').Session[]} sessions
 */
export function totalMs(sessions) {
  return sessions.reduce((sum, s) => sum + (s.endedAt === null ? 0 : elapsedMs(s, s.endedAt)), 0);
}
