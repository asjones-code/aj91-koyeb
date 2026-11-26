/**
 * AI Trader control panel (crypto page, private).
 * Talks to /api/ai/kraken/*; every call needs the signal token.
 */
import { getSignalToken, clearSignalToken, peekSignalToken, authHeaders } from "./signal-token.js";

const $ = (id) => document.getElementById(id);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const usd = (n) => (typeof n === "number" && isFinite(n) ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—");
const pct = (n) => (typeof n === "number" && isFinite(n) ? `${n >= 0 ? "+" : ""}${n.toFixed(2)}%` : "—");
const tone = (n) => (typeof n === "number" ? (n >= 0 ? "ai-up" : "ai-down") : "");
const px = (n) => (typeof n === "number" ? (n >= 1 ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : n.toPrecision(4)) : "—");
const ago = (iso) => {
  const m = (Date.now() - new Date(iso).getTime()) / 60000;
  return m < 60 ? `${Math.max(1, Math.round(m))}m ago` : m < 2880 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};
const STATUS_CLASS = { opened: "ai-up", added: "ai-up", would_add: "", closed: "ai-up", adjusted: "ai-up", would_open: "", would_close: "", would_adjust: "", rejected: "ai-dim", failed: "ai-down", partial: "ai-down" };

let state = null;
let seedPreview = null;
let busy = false;
let wired = false;

async function api(path, opts = {}) {
  const r = await fetch(path, { ...opts, headers: authHeaders({ "Content-Type": "application/json", ...(opts.headers || {}) }) });
  if (r.status === 401) { clearSignalToken(); throw Object.assign(new Error("Locked — enter your signal token"), { locked: true }); }
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.ok === false) throw new Error(data.error || data.skipped || `Request failed (${r.status})`);
  return data;
}
function setMsg(text, kind = "") { const el = $("ai-msg"); if (el) { el.textContent = text; el.className = "ai-msg " + kind; } }

function statsHtml(f, c) {
  const cell = (k, v, cls = "") => `<div class="ai-stat"><div class="k">${k}</div><div class="v ${cls}">${v}</div></div>`;
  if (f.status !== "active") {
    return `<div class="ai-stats">${cell("Fund", f.status === "seeding" ? "SEEDING — review" : "Not funded yet", f.status === "seeding" ? "ai-down" : "")}${cell("Mode", c.mode)}${cell("Model", esc(c.model))}${cell("Decisions", c.decisionHoursUtc.map((h) => `${h}:05`).join(", ") + " UTC")}</div>`;
  }
  return `<div class="ai-stats">
    ${cell("Equity", usd(f.equity_usd))}${cell("Return", pct(f.return_pct), tone(f.return_pct))}${cell("BTC", pct(f.btc_pct), tone(f.btc_pct))}
    ${cell("Hold coins", pct(f.hold_pct), tone(f.hold_pct))}${cell("Cash", usd(f.cash_usd))}${cell("Drawdown", `${(f.drawdown_pct ?? 0).toFixed(1)}%`)}
    ${cell("Win rate", f.win_rate_pct == null ? "—" : `${Math.round(f.win_rate_pct)}% · ${f.trades_closed}`)}${cell("Fees", usd(f.fees_paid))}
    ${f.deposits_usd ? cell("Added", usd(f.deposits_usd)) : ""}
  </div>`;
}

function seedHtml() {
  if (!seedPreview) return "";
  const rows = seedPreview.rows.map((r) => `<tr>
    <td>${esc(r.asset)}</td><td class="right">${px(r.balance)}</td><td class="right">${r.skip ? "—" : px(r.sell_qty)}</td>
    <td class="right">${r.skip ? "—" : usd(r.est_usd)}</td><td class="ai-dim">${r.skip ? esc(r.skip) : "sell"}</td></tr>`).join("");
  const canSeed = seedPreview.fund_status === "unseeded" && seedPreview.est_total_usd > 0;
  return `<div class="ai-h">Seed sale preview — sells ${Math.round(seedPreview.fraction * 100)}% of each coin once; proceeds become the AI fund</div>
    <table class="ai-table"><thead><tr><th>Coin</th><th class="right">Balance</th><th class="right">Sell</th><th class="right">≈ USD</th><th></th></tr></thead><tbody>${rows}</tbody></table>
    <div class="ai-row"><b>≈ ${usd(seedPreview.est_total_usd)}</b><span class="ai-dim">market sells, before fees · prices move until executed</span>
    ${canSeed ? `<button class="ai-btn danger" id="ai-seed-exec">Execute seed sale</button>` : `<span class="ai-dim">fund is ${esc(seedPreview.fund_status)}</span>`}</div>`;
}

function emailHtml(e) {
  if (!e) return `<div class="ai-dim">Email: nothing sent yet · use Test email to check delivery.</div>`;
  return e.ok
    ? `<div class="ai-dim">Last email ${ago(e.at)}: <span class="ai-up">sent</span> — ${esc(e.subject)}</div>`
    : `<div class="ai-warn">Last email ${ago(e.at)} FAILED — ${esc(e.subject)}: ${esc(e.error)}</div>`;
}

function watchHtml(list = []) {
  if (!list.length) return `<div class="ai-dim">No price levels set — the alignment screen still runs.</div>`;
  return `<table class="ai-table"><tbody>${list.map((w) => `<tr><td>${esc(w.asset)}</td><td>${esc(w.direction)} ${px(w.price)}</td><td class="ai-why">${esc(w.reason)}</td></tr>`).join("")}</tbody></table>`;
}

function positionsHtml(list) {
  if (!list.length) return `<div class="ai-dim">No open positions — in cash.</div>`;
  return `<table class="ai-table"><thead><tr><th>#</th><th>Asset</th><th class="right">Value</th><th class="right">P&amp;L</th><th class="right">Entry → now</th><th class="right">Stop / target</th><th class="right">Left</th><th>Thesis</th></tr></thead><tbody>${
    list.map((p) => `<tr><td class="ai-dim">${p.id}</td><td class="ai-buy">${esc(p.asset)}</td><td class="right">${usd(p.value_usd)}</td>
      <td class="right ${tone(p.unrealized_pct)}">${pct(p.unrealized_pct)}</td><td class="right">${px(p.entry_price)} → ${px(p.price)}</td>
      <td class="right">${px(p.stop_loss)} / ${px(p.take_profit)}</td><td class="right">${Math.max(0, p.hours_left).toFixed(0)}h</td>
      <td class="ai-why">${esc(p.thesis)}<br><span class="ai-dim">${esc(p.conviction)} · ${esc(p.horizon)}</span></td></tr>`).join("")}</tbody></table>`;
}

function closedHtml(list) {
  if (!list.length) return `<div class="ai-dim">No closed trades yet.</div>`;
  return `<table class="ai-table"><thead><tr><th>Asset</th><th class="right">P&amp;L</th><th>Exit</th><th class="right">Closed</th></tr></thead><tbody>${
    list.slice(0, 10).map((t) => `<tr><td>${esc(t.asset)}</td><td class="right ${tone(t.pnl_pct)}">${pct(t.pnl_pct)} (${usd(t.pnl_usd)})</td>
      <td class="ai-dim">${esc(t.exit_reason)}</td><td class="right ai-dim">${ago(t.closed_at)}</td></tr>`).join("")}</tbody></table>`;
}

function resultsHtml(results = []) {
  if (!results.length) return `<span class="ai-dim">No actions.</span>`;
  return `<table class="ai-table"><tbody>${results.map((r) => `<tr>
    <td>${esc(r.action)}</td><td>${esc(r.asset || "#" + r.trade_id)}</td>
    <td class="${STATUS_CLASS[r.status] ?? ""}">${esc(r.status)}</td>
    <td class="ai-dim">${r.usd != null ? usd(r.usd) + " " : ""}${r.size_pct != null ? `${r.size_pct}% · stop ${r.stop_loss_pct}% · target ${r.take_profit_pct}% · ${r.max_hold_hours}h ` : ""}${r.pnl_pct != null ? pct(r.pnl_pct) + " " : ""}${esc(r.reason || r.signal_basis || "")}</td></tr>`).join("")}</tbody></table>`;
}

const OUTCOME = { target: ["hit target", "ai-up"], stop: ["stopped", "ai-down"], expired: ["expired", ""] };
function paperRows(list) {
  return list.map((p) => {
    const [label, cls] = p.status === "open" ? [`open · best ${pct(p.max_up_pct)} · ${Math.max(0, (new Date(p.expires_at) - Date.now()) / 3600000).toFixed(0)}h left`, ""] : OUTCOME[p.status] || [p.status, ""];
    return `<tr><td class="ai-buy">${esc(p.asset)}</td><td class="ai-dim">${esc(p.confidence)}</td>
      <td class="right">${px(p.entry)}</td><td class="right">${pct((p.target / p.entry - 1) * 100)} / ${pct((p.stop / p.entry - 1) * 100)}</td>
      <td class="${cls}">${esc(label)}${p.status !== "open" ? ` ${pct(p.pnl_pct)}` : ""}</td><td class="ai-why">${esc(p.thesis)}</td></tr>`;
  }).join("");
}
function yoloHtml(y) {
  if (!y || (!y.last_run && !y.open.length && !y.stats.n)) return "";
  const s = y.stats, r = y.last_run;
  const head = `<thead><tr><th>Coin</th><th>Conf.</th><th class="right">Entry</th><th class="right">Target / stop</th><th>Status</th><th>Thesis</th></tr></thead>`;
  const shortlist = (r?.shortlist || []).map((c) => `<tr><td>${esc(c.asset)}</td><td class="right ${tone(c.ret_24h_pct)}">${pct(c.ret_24h_pct)}</td>
    <td class="right">${c.volume_vs_7d_avg ?? "—"}×</td><td class="right">${usd(c.volume_24h_usd)}</td><td class="ai-dim">${esc(c.structure_4h?.trend || "—")}</td><td class="right ai-dim">${c.screen_score}</td></tr>`).join("");
  return `<div class="ai-h">YOLO — paper day trades, no real orders · ${s.n ? `${s.wins}/${s.n} won · avg ${pct(s.avgPct)} after fees` : "nothing scored yet"}</div>
    ${r ? `<div class="ai-dim">Last scan ${ago(r.at)} · ${r.scanned ?? "?"} USD pairs${r.error ? ` · <span class="ai-down">${esc(r.error)}</span>` : ""}</div>${r.note ? `<div>${esc(r.note)}</div>` : ""}` : ""}
    ${y.open.length ? `<table class="ai-table">${head}<tbody>${paperRows(y.open)}</tbody></table>` : `<div class="ai-dim">No open paper calls.</div>`}
    ${shortlist ? `<details class="ai-dim"><summary>Shortlist from the last scan</summary><table class="ai-table"><thead><tr><th>Coin</th><th class="right">24h</th><th class="right">Vol vs 7d</th><th class="right">24h $vol</th><th>4h</th><th class="right">Score</th></tr></thead><tbody>${shortlist}</tbody></table></details>` : ""}
    ${y.closed.length ? `<details class="ai-dim"><summary>Scored calls</summary><table class="ai-table">${head}<tbody>${paperRows(y.closed)}</tbody></table></details>` : ""}`;
}

function decisionsHtml(list) {
  if (!list.length) return `<div class="ai-dim">No decisions yet.</div>`;
  return list.slice(0, 3).map((d) => `<div class="ai-decision">
    <div class="ai-dim">${ago(d.at)} · ${esc(d.mode)}${d.error ? ` · <span class="ai-down">${esc(d.error)}</span>` : ""}</div>
    ${d.journal ? `<div>${esc(d.journal)}</div>` : ""}${d.results ? resultsHtml(d.results) : ""}</div>`).join("");
}

function render() {
  const body = $("ai-body");
  if (!body) return;
  if (!state) {
    body.innerHTML = `<div class="loading">${peekSignalToken() ? "Loading…" : "Locked — click ↺ to enter your signal token"}</div>`;
    return;
  }
  const { config: c, fund: f } = state;
  $("ai-summary").textContent = `${c.mode === "live" ? "LIVE" : "dry run"} · ${f.status === "active" ? (f.halted ? "HALTED" : "trading") : "not funded"} · ${c.model} · ≤${c.maxPositions} pos`;
  const pauseBtn = $("ai-pause");
  if (pauseBtn) pauseBtn.textContent = f.halted ? "Resume" : "Pause";
  ["ai-pause", "ai-report", "ai-seed-preview", "ai-reload", "ai-test-email", "ai-yolo"].forEach((id) => { const b = $(id); if (b) b.disabled = busy; });
  if ($("ai-deposit")) $("ai-deposit").style.display = f.status === "active" ? "" : "none";
  if ($("ai-deposit")) $("ai-deposit").disabled = busy;
  if ($("ai-pause")) $("ai-pause").disabled = busy || f.status !== "active";
  if ($("ai-report")) $("ai-report").disabled = busy || f.status !== "active";
  if ($("ai-seed-preview")) $("ai-seed-preview").style.display = f.status === "active" ? "none" : "";

  body.innerHTML = `
    <div class="ai-h">Recent decisions</div>${decisionsHtml(state.decisions)}
    ${statsHtml(f, c)}
    ${f.halted ? `<div class="ai-warn">Halted: ${esc(f.halted_reason)} — no new trades; open positions keep their stops.</div>` : ""}
    ${state.busy ? `<div class="ai-warn">Busy: ${esc(state.busy)}…</div>` : ""}
    ${emailHtml(f.last_email)}
    ${seedHtml()}
    ${f.status === "active" ? `<div class="ai-h">Watching (free price check every ${c.monitorMinutes}m · early AI runs ≤${c.maxEarlyRunsPerDay}/day)</div>${watchHtml(f.watchlist)}` : ""}
    ${yoloHtml(state.yolo)}
    ${f.status === "active" ? `<div class="ai-h">Open positions</div>${positionsHtml(state.positions)}<div class="ai-h">Closed trades</div>${closedHtml(state.closed)}` : ""}`;
  $("ai-seed-exec")?.addEventListener("click", executeSeed);
}

async function loadState({ prompt = false } = {}) {
  if (prompt && !getSignalToken("AI trader.\nEnter your signal access token:")) return;
  if (!peekSignalToken()) { state = null; render(); return; }
  try { state = await api("/api/ai/kraken/state"); }
  catch (e) { state = null; setMsg(e.message, "err"); }
  render();
}

async function act(label, fn, { open = true } = {}) {
  if (busy) return;
  if (!getSignalToken("AI trader.\nEnter your signal access token:")) return;
  if (open && $("ai-trader")) $("ai-trader").open = true;
  busy = true; render(); setMsg(label + "…");
  try { await fn(); }
  catch (e) { setMsg(e.message, "err"); }
  finally { busy = false; await loadState(); }
}

const previewSeed = () => act("Pricing your holdings", async () => {
  seedPreview = await api("/api/ai/kraken/seed/preview", { method: "POST", body: "{}" });
  setMsg(`Seed preview ready — about ${usd(seedPreview.est_total_usd)} would fund the AI.`, "ok");
});

async function executeSeed() {
  if (!seedPreview) return;
  const sells = seedPreview.rows.filter((r) => !r.skip);
  const ok = confirm(`Sell these on Kraken now (market orders)? This runs once.\n\n${sells.map((r) => `  ${r.asset}: ${px(r.sell_qty)} ≈ ${usd(r.est_usd)}`).join("\n")}\n\n≈ ${usd(seedPreview.est_total_usd)} becomes the AI's fund.`);
  if (!ok) return;
  await act("Selling seed coins", async () => {
    const r = await api("/api/ai/kraken/seed/execute", { method: "POST", body: JSON.stringify({ confirm: true }) });
    seedPreview = null;
    const failed = r.results.filter((x) => !x.ok);
    setMsg(`Fund seeded with ${usd(r.fund.seed_usd)}.${failed.length ? ` ${failed.length} sell(s) failed: ${failed.map((x) => x.asset).join(", ")}.` : ""}`, failed.length ? "err" : "ok");
  });
}

/** YOLO: discovery over every Kraken USD pair + paper day-trade calls. Never trades. */
const runYolo = () => act("YOLO — scanning every Kraken USD pair (~15–40s)", async () => {
  const r = await api("/api/ai/kraken/yolo", { method: "POST", body: "{}" });
  const n = (r.picks || []).length;
  if (r.cached) setMsg(`Showing the scan from ${ago(r.run.created_at)} (one fresh scan per ${state?.config?.yoloCooldownMinutes ?? 10} min).`, "ok");
  else setMsg(`Scanned ${r.run.scanned} USD pairs → ${r.run.shortlist?.length || 0} on the shortlist → ${n ? `${n} paper call${n === 1 ? "" : "s"}: ${r.picks.map((p) => p.asset).join(", ")}` : "no calls (nothing clean)"}${r.rejected?.length ? ` · ${r.rejected.length} rejected by the guardrails` : ""}. Scored automatically; results go in the daily email.`, "ok");
});

/** Top-up: USD deposited on Kraken only becomes tradeable once it's added to the fund here. */
const addFunds = () => act("Checking Kraken for new USD", async () => {
  const p = await api("/api/ai/kraken/deposit/preview", { method: "POST", body: "{}" });
  if (p.fund_status !== "active") throw new Error("Seed the fund first — top-ups apply to an active fund.");
  if (!(p.available_usd >= 0.01)) {
    throw new Error(`No new USD on Kraken. Kraken holds ${usd(p.kraken_usd)} and the fund already accounts for ${usd(p.fund_cash_usd)}. Deposit USD on Kraken, wait for it to clear, then try again.`);
  }
  const raw = prompt(`Kraken has ${usd(p.available_usd)} that isn't in the AI's fund yet.\n` +
    `Fund equity now ${usd(p.equity_usd)}${p.deposits_usd ? ` (${usd(p.deposits_usd)} added so far)` : ""}.\n\n` +
    `How much should the AI be able to trade? It's added at today's unit price, so the fund's % return doesn't jump.`, p.available_usd.toFixed(2));
  if (raw == null) throw new Error("Cancelled");
  const amount = Number(String(raw).replace(/[$,\s]/g, ""));
  if (!(amount > 0)) throw new Error("Enter a dollar amount.");
  if (!confirm(`Add ${usd(amount)} to the AI's fund?`)) throw new Error("Cancelled");
  const r = await api("/api/ai/kraken/deposit", { method: "POST", body: JSON.stringify({ usd: amount, confirm: true }) });
  setMsg(`Added ${usd(r.deposit.usd)}. Fund cash is now ${usd(r.fund.cash_usd)}; the next decision run can use it.`, "ok");
});

const togglePause = () => act(state?.fund?.halted ? "Resuming" : "Pausing", async () => {
  const r = await api("/api/ai/kraken/pause", { method: "POST", body: JSON.stringify({ paused: !state?.fund?.halted }) });
  setMsg(r.halted ? "Paused — no new trades; exits keep running." : "Resumed.", "ok");
});

const sendReport = () => act("Building the daily report", async () => {
  await api("/api/ai/kraken/report", { method: "POST", body: "{}" });
  setMsg("Report emailed.", "ok");
});

const testEmail = () => act("Sending a test email", async () => {
  const r = await fetch("/api/ai/kraken/test-email", { method: "POST", headers: authHeaders({ "Content-Type": "application/json" }), body: "{}" });
  if (r.status === 401) { clearSignalToken(); throw new Error("Locked — enter your signal token"); }
  const d = await r.json().catch(() => ({}));
  if (d.ok) setMsg(`Test email sent to ${d.to} — check inbox and spam.`, "ok");
  else setMsg(`Email failed: ${d.error || r.status}`, "err");
});

export function initAiTrader() {
  const details = $("ai-trader");
  if (!details) return;
  if (!wired) {
    wired = true;
    $("ai-reload")?.addEventListener("click", () => loadState({ prompt: true }));
    $("ai-seed-preview")?.addEventListener("click", previewSeed);
    $("ai-deposit")?.addEventListener("click", addFunds);
    $("ai-yolo")?.addEventListener("click", runYolo);
    $("ai-pause")?.addEventListener("click", togglePause);
    $("ai-report")?.addEventListener("click", sendReport);
    $("ai-test-email")?.addEventListener("click", testEmail);
    details.addEventListener("toggle", () => { if (details.open) loadState(); });
  }
  render();
  if (details.open) loadState();
}
