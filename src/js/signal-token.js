/**
 * Shared premium/signal token for the portfolio + crypto pages.
 * Gates Kraken account data, order placement, signal regenerate/email and the AI trader.
 */
const SIGNAL_TOKEN_KEY = "pf_signal_token";

/** Stored token, or "" — never prompts. */
export function peekSignalToken() {
  return localStorage.getItem(SIGNAL_TOKEN_KEY) || "";
}

/** Stored token, prompting once if missing. */
export function getSignalToken(reason = "Premium feature.\nEnter your signal access token:") {
  let t = peekSignalToken();
  if (!t) {
    t = (prompt(reason) || "").trim();
    if (t) localStorage.setItem(SIGNAL_TOKEN_KEY, t);
  }
  return t;
}

export function clearSignalToken() {
  localStorage.removeItem(SIGNAL_TOKEN_KEY);
}

/** Headers carrying the stored token (empty object if none). */
export function authHeaders(extra = {}) {
  const t = peekSignalToken();
  return t ? { ...extra, "X-Signal-Token": t } : { ...extra };
}
