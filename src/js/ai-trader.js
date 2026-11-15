/**
 * AI Trader control panel (crypto page).
 * Talks to /api/ai/kraken/{state,run,approve}. All endpoints require the signal token.
 * Deliberately exposes only dry_run + approval runs; "live" runs stay API/scheduler-only.
 */
import { getSignalToken, clearSignalToken, peekSignalToken, authHeaders } from "./signal-token.js";

const $ = (id) => document.getElementById(id);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const usd = (n) => (typeof n === "number" && isFinite(n) ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—");
const qtyFmt = (n) => (typeof n === "number" && isFinite(n) ? n.toFixed(8).replace(/0+$/, "").replace(/\.$/, "") : "—");
const ago = (ms) => {
  const m = Math.round((Date.now() - ms) / 60000);
  return m < 1 ? "just now" : m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};

const STATUS_LABEL = {
  dry: "would trade", pending: "pending", executed: "executed", partial: "partial fill",
  executed_unverified: "sent · fill unverified", failed: "failed", skipped: "skipped",
};

let state = null;
let busy = false;
let wired = false;

async function api(path, opts = {}) {
  const r = await fetch(path, { ...opts, headers: authHeaders({ "Content-Type": "application/json", ...(opts.headers || {}) }) });
  if (r.status === 401) { clearSignalToken(); throw Object.assign(new Error("Locked — enter your signal token"), { locked: true }); }
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.ok === false) throw new Error(data.error || data.skipped || `Request failed (${r.status})`);
  return data;
}

function setMsg(text, kind = "") {
  const el = $("ai-msg");
  if (el) { el.textContent = text; el.className = "ai-msg " + kind; }
}

function isApprovable(plan) {
  return plan && plan.mode === "approval" && plan.status === "pending" && plan.trades?.length &&
    Date.now() < (plan.expiresAt || 0);
}

function render() {
  const body = $("ai-body");
  if (!body) return;
  if (!state) {
    body.innerHTML = `<div class="loading">${peekSignalToken() ? "Loading…" : "Locked — click Load to enter your signal token"}</div>`;
    return;
  }
  const { config: c, positions, lastPlan: plan, persisted, approving } = state;

  $("ai-summary").textContent =
    `${c.enabled ? "on" : "off"} · default ${c.mode} · ${(c.equityPct * 100).toFixed(0)}% equity · ≤${c.maxPositions} pos · daily ${c.scheduleUtc} UTC`;

  const sleeve = Object.entries(positions || {});
  const sleeveHtml = sleeve.length
    ? sleeve.map(([a, q]) => `<span class="ai-chip"><b>${esc(a)}</b> ${qtyFmt(q)}</span>`).join("")
    : `<span class="ai-dim">empty — the trader holds nothing yet</span>`;

  let planHtml = `<div class="ai-dim">No plan yet. Run a dry run or propose a plan.</div>`;
  if (plan) {
    const expired = plan.mode === "approval" && plan.status === "pending" && Date.now() >= (plan.expiresAt || 0);
    const statusText = expired ? "expired" : plan.status || plan.mode;
    const rows = (plan.trades || []).map((t) => `
      <tr>
        <td class="${t.side === "buy" ? "ai-buy" : "ai-sell"}">${esc(t.side).toUpperCase()} ${esc(t.asset)}</td>
        <td class="right">${usd(t.usd)}</td>
        <td class="right">${qtyFmt(t.filledQty ?? t.qty)}</td>
        <td>${esc(t.conviction || "—")}</td>
        <td class="ai-why">${esc(t.signal_basis)}${t.risk_note ? `<br><span class="ai-dim">risk: ${esc(t.risk_note)}</span>` : ""}</td>
        <td class="ai-st ai-st-${esc(t.status)}">${esc(STATUS_LABEL[t.status] || t.status || "")}${t.error ? `<br><span class="ai-dim">${esc(t.error)}</span>` : ""}</td>
      </tr>`).join("");
    planHtml = `
      <div class="ai-plan-meta">
        <span>Last plan: <b>${esc(plan.mode)}</b> · <b class="ai-status-${esc(statusText)}">${esc(statusText)}</b> · ${plan.createdAt ? ago(plan.createdAt) : ""}</span>
        <span>equity ${usd(plan.equity)} · sleeve budget ${usd(plan.budget)}</span>
        ${isApprovable(plan) ? `<span class="ai-dim">expires ${new Date(plan.expiresAt).toLocaleString()}</span>` : ""}
      </div>
      ${plan.market_note ? `<div class="ai-dim ai-note">${esc(plan.market_note)}</div>` : ""}
      ${rows ? `<table class="ai-table"><thead><tr><th>Trade</th><th class="right">USD</th><th class="right">Qty</th><th>Conv.</th><th>Rationale</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`
             : `<div class="ai-dim">No trades — sleeve already within target.</div>`}`;
  }

  body.innerHTML = `
    <div class="ai-row"><span class="panel-title">AI sleeve</span> ${sleeveHtml}</div>
    ${persisted ? "" : `<div class="ai-warn">No DATABASE_URL — sleeve and plan are in memory and reset on restart.</div>`}
    ${approving ? `<div class="ai-warn">An approval is executing right now…</div>` : ""}
    ${planHtml}`;

  const approveBtn = $("ai-approve");
  if (approveBtn) approveBtn.disabled = busy || !isApprovable(plan) || approving;
  ["ai-dry", "ai-propose", "ai-reload"].forEach((id) => { const b = $(id); if (b) b.disabled = busy; });
}

async function loadState({ prompt = false } = {}) {
  if (prompt && !getSignalToken("AI trader.\nEnter your signal access token:")) return;
  if (!peekSignalToken()) { state = null; render(); return; }
  try {
    state = await api("/api/ai/kraken/state");
    setMsg("");
  } catch (e) {
    state = null;
    setMsg(e.message, "err");
  }
  render();
}

async function run(mode) {
  if (busy) return;
  if (!getSignalToken("AI trader.\nEnter your signal access token:")) return;
  const d = $("ai-trader"); if (d) d.open = true;
  busy = true; render();
  setMsg(mode === "approval" ? "Building plan (asks the model, ~10–20s)…" : "Running dry run (asks the model, ~10–20s)…");
  try {
    const r = await api("/api/ai/kraken/run", { method: "POST", body: JSON.stringify({ mode }) });
    setMsg(`${mode === "approval" ? "Plan proposed" : "Dry run done"} — ${r.trades?.length || 0} trade(s). Email sent.`, "ok");
  } catch (e) {
    setMsg(e.message, "err");
  } finally {
    busy = false;
    await loadState();
  }
}

async function approve() {
  const plan = state?.lastPlan;
  if (busy || !isApprovable(plan)) return;
  const lines = plan.trades.map((t) => `  ${t.side.toUpperCase()} ${t.asset} ≈ ${usd(t.usd)}`).join("\n");
  const ok = confirm(
    `Place REAL market orders on Kraken?\n\n${lines}\n\n` +
    `Each trade is re-priced first and skipped if the price moved more than ` +
    `${((state.config.maxPriceDrift || 0) * 100).toFixed(0)}% since the plan.`
  );
  if (!ok) return;
  busy = true; render();
  setMsg("Executing approved plan…");
  try {
    const r = await api("/api/ai/kraken/approve", { method: "POST" });
    const t = r.plan?.trades || [];
    const done = t.filter((x) => ["executed", "partial", "executed_unverified"].includes(x.status)).length;
    const skipped = t.filter((x) => x.status === "skipped").length;
    const failed = t.filter((x) => x.status === "failed").length;
    setMsg(`Done — ${done} executed, ${skipped} skipped, ${failed} failed.`, failed ? "err" : "ok");
  } catch (e) {
    setMsg(e.message, "err");
  } finally {
    busy = false;
    await loadState();
  }
}

export function initAiTrader() {
  const details = $("ai-trader");
  if (!details) return;
  if (!wired) {
    wired = true;
    $("ai-dry")?.addEventListener("click", () => run("dry_run"));
    $("ai-propose")?.addEventListener("click", () => run("approval"));
    $("ai-approve")?.addEventListener("click", approve);
    $("ai-reload")?.addEventListener("click", () => loadState({ prompt: true }));
    details.addEventListener("toggle", () => { if (details.open) loadState(); });
  }
  render();
  if (details.open) loadState();
}
