// src/core/session.js

  /**
   * @typedef {object} Session
   * @property {string} id
   * @property {number} startedAt               epoch ms
   * @property {number} lastConfirmedOfflineAt  epoch ms
   * @property {number | null} endedAt          epoch ms; null while running
   * @property {boolean} endVerified            false if online was found on resume
   * @property {number[]} goalsMs
   */

  /**
   * @typedef {{ type: 'offlineConfirmed', at: number }
   *         | { type: 'onlineDetected', at: number, verified: boolean }} SessionEvent
   */

  export const MIN_SESSION_MS = 60_000;

  /**
   * @param {{ id: string, at: number, goalsMs: number[] }} input
   * @returns {Session}
   */
  export function start({ id, at, goalsMs }) {
    return {
      id,
      startedAt: at,
      lastConfirmedOfflineAt: at,
      endedAt: null,
      endVerified: false,
      goalsMs,
    };
  }

  /**
   * @param {Session} session
   * @param {SessionEvent} event
   * @returns {Session}
   */
  export function advance(session, event) {
    if (session.endedAt !== null) return session;

    switch (event.type) {
      case 'offlineConfirmed':
        return { ...session, lastConfirmedOfflineAt: event.at };
      case 'onlineDetected':
        return { ...session, endedAt: event.at, endVerified: event.verified };
      default:
        throw new Error(`Unknown event type: ${/** @type {any} */ (event).type}`);
    }
  }

  /**
   * @param {Session} session
   * @param {number} now  epoch ms; only used while the session is running
   * @returns {number}
   */
  export function elapsedMs(session, now) {
    return (session.endedAt ?? now) - session.startedAt;
  }

  /**
   * @param {Session} session
   * @returns {boolean}
   */
  export function isDiscardable(session) {
    return session.endedAt !== null && elapsedMs(session, session.endedAt) < MIN_SESSION_MS;
  }