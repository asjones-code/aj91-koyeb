// src/platform/wakelock.js
// Keeps the screen on while wanted. The browser drops the lock whenever the
// page is hidden, so it is re-requested each time the page becomes visible.

export function wakeLock() {
  const supported = 'wakeLock' in navigator;
  /** @type {WakeLockSentinel | null} */
  let sentinel = null;
  let wanted = false;
  let pending = false;

  async function acquire() {
    if (!supported || !wanted || sentinel || pending || document.visibilityState !== 'visible') return;
    pending = true;
    try {
      sentinel = await navigator.wakeLock.request('screen');
      sentinel.addEventListener('release', () => { sentinel = null; });
    } catch {
      // Denied (low battery, not visible). Try again next time the page is shown.
    } finally {
      pending = false;
    }
  }

  document.addEventListener('visibilitychange', acquire);

  return {
    supported,
    /** @param {boolean} on */
    set(on) {
      wanted = on;
      if (on) acquire();
      else if (sentinel) { sentinel.release(); sentinel = null; }
    },
  };
}
