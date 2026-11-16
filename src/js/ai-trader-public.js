/**
 * Public AI-vs-BTC page. Reads /api/ai/kraken/public (percentages only).
 */
const $ = (id) => document.getElementById(id);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pct = (n) => (n == null ? "—" : `${n >= 0 ? "+" : ""}${Number(n).toFixed(2)}%`);
const cls = (n) => (n == null ? "" : n >= 0 ? "up" : "down");
const ago = (iso) => {
  const h = (Date.now() - new Date(iso).getTime()) / 3600_000;
  return h < 1 ? `${Math.max(1, Math.round(h * 60))}m ago` : h < 48 ? `${Math.round(h)}h ago` : `${Math.round(h / 24)}d ago`;
};
const EXIT = { take_profit: "hit target", stop_loss: "stopped out", time: "time limit", ai: "closed by AI", manual: "closed manually" };

function scores(d) {
  const lead = d.return_pct != null && d.btc_pct != null ? d.return_pct - d.btc_pct : null;
  const verdict = lead == null ? "" : lead >= 0
    ? `<span class="up">The AI is ahead of BTC by ${lead.toFixed(2)} points.</span>`
    : `<span class="down">BTC is ahead of the AI by ${Math.abs(lead).toFixed(2)} points.</span>`;
  return `
  <div class="scores">
    <div class="score"><div class="label">AI fund</div><div class="val ${cls(d.return_pct)}">${pct(d.return_pct)}</div><div class="sub">since start · ${Math.max(1, Math.ceil(d.days_running || 0))} day(s)</div></div>
    <div class="score"><div class="label">Just hold BTC</div><div class="val ${cls(d.btc_pct)}">${pct(d.btc_pct)}</div><div class="sub">same period</div></div>
    <div class="score"><div class="label">Hold seed coins</div><div class="val ${cls(d.hold_pct)}">${pct(d.hold_pct)}</div><div class="sub">never sold</div></div>
    <div class="score"><div class="label">Win rate</div><div class="val">${d.win_rate_pct == null ? "—" : Math.round(d.win_rate_pct) + "%"}</div><div class="sub">${d.trades_closed} closed · drawdown ${Number(d.drawdown_pct || 0).toFixed(1)}%</div></div>
  </div>
  <p class="verdict">${verdict}</p>`;
}

function positionsTable(d) {
  if (!d.open_positions.length) return `<div class="empty">No open positions — the AI is sitting in cash.</div>`;
  return `<table><thead><tr><th>Asset</th><th class="r">P&amp;L</th><th class="r">Stop / target</th><th>Why</th></tr></thead><tbody>${
    d.open_positions.map((p) => `<tr>
      <td><span class="sym">${esc(p.asset)}</span><div class="thesis">${esc(p.conviction)} · ${esc(p.horizon)} · ${ago(p.opened_at)}</div></td>
      <td class="r ${cls(p.unrealized_pct)}">${pct(p.unrealized_pct)}</td>
      <td class="r">${pct(p.stop_pct)} / ${pct(p.target_pct)}</td>
      <td class="thesis">${esc(p.thesis)}</td></tr>`).join("")}</tbody></table>`;
}

function tradesTable(d) {
  if (!d.recent_trades.length) return `<div class="empty">No closed trades yet.</div>`;
  return `<table><thead><tr><th>Asset</th><th class="r">Result</th><th>Exit</th><th class="r">Held</th></tr></thead><tbody>${
    d.recent_trades.slice(0, 12).map((t) => {
      const held = (new Date(t.closed_at) - new Date(t.opened_at)) / 3600_000;
      return `<tr><td><span class="sym">${esc(t.asset)}</span></td><td class="r ${cls(t.pnl_pct)}">${pct(t.pnl_pct)}</td>
        <td class="thesis">${esc(EXIT[t.exit_reason] || t.exit_reason)}</td><td class="r">${held < 48 ? held.toFixed(1) + "h" : (held / 24).toFixed(1) + "d"}</td></tr>`;
    }).join("")}</tbody></table>`;
}

function journal(d) {
  if (!d.journal.length) return `<div class="empty">The AI hasn't written anything yet.</div>`;
  return `<div class="journal">${d.journal.map((j) => `
    <div class="entry"><div class="meta">${esc(j.kind)} · ${/^\d{4}-\d{2}-\d{2}$/.test(j.at) ? esc(j.at) : ago(j.at)}</div><p>${esc(j.text)}</p></div>`).join("")}</div>`;
}

function drawChart(curve) {
  const el = $("chart");
  if (!el || !window.LightweightCharts || curve.length < 2) {
    if (el) el.innerHTML = `<div class="empty">The chart fills in after the first daily snapshot.</div>`;
    return;
  }
  const chart = LightweightCharts.createChart(el, {
    layout: { background: { color: "#0a0a0a" }, textColor: "rgba(255,255,255,0.45)" },
    grid: { vertLines: { color: "rgba(255,255,255,0.03)" }, horzLines: { color: "rgba(255,255,255,0.03)" } },
    rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
    timeScale: { borderColor: "rgba(255,255,255,0.08)" },
    width: el.clientWidth, height: 300,
  });
  const today = new Date().toISOString().slice(0, 10);
  const pts = curve.map((c) => ({ ...c, day: c.day === "now" ? today : c.day }))
    .reduce((acc, c) => { acc[c.day] = c; return acc; }, {});
  const rows = Object.values(pts).sort((a, b) => a.day.localeCompare(b.day));
  const line = (key, color, width) => {
    const s = chart.addLineSeries({ color, lineWidth: width, priceLineVisible: false, lastValueVisible: true });
    s.setData(rows.filter((r) => r[key] != null).map((r) => ({ time: r.day, value: r[key] })));
  };
  line("hold", "rgba(255,255,255,0.35)", 1);
  line("btc", "#fbbf24", 2);
  line("ai", "#ABF8FE", 3);
  chart.timeScale().fitContent();
  window.addEventListener("resize", () => chart.applyOptions({ width: el.clientWidth }));
}

async function load() {
  let d;
  try {
    const r = await fetch("/api/ai/kraken/public");
    d = await r.json();
  } catch { d = { status: "offline" }; }

  const dot = $("dot"), status = $("status"), content = $("content");
  if (d.status !== "trading" && d.status !== "halted") {
    dot.className = "dot";
    status.textContent = d.status === "warming_up" ? "Warming up — the fund hasn't been seeded yet" : "Offline";
    content.innerHTML = `<div class="warm">The experiment starts once the fund is seeded. Check back soon.</div>`;
    return;
  }
  dot.className = `dot ${d.status}`;
  status.textContent = d.status === "halted"
    ? "Trading halted (drawdown limit or paused) — open positions keep their stops"
    : `Trading${d.mode === "live" ? "" : " (dry run)"} · updated ${ago(d.updated_at)} · model ${d.model}`;

  content.innerHTML = `
    ${scores(d)}
    <div class="panel" style="border-top:1px solid var(--border);margin-top:1.5rem">
      <div class="panel-h"><span class="panel-t">Growth of 100</span>
        <span class="legend"><span><i style="background:#ABF8FE"></i>AI fund</span><span><i style="background:#fbbf24"></i>BTC</span><span><i style="background:rgba(255,255,255,0.35)"></i>Hold seed coins</span></span></div>
      <div id="chart"></div>
    </div>
    <div class="grid2">
      <div class="panel"><div class="panel-h"><span class="panel-t">Open positions</span></div>${positionsTable(d)}</div>
      <div class="panel"><div class="panel-h"><span class="panel-t">Recent trades</span><span class="panel-t">avg win ${pct(d.avg_win_pct)} · avg loss ${pct(d.avg_loss_pct)}</span></div>${tradesTable(d)}</div>
    </div>
    <div class="panel"><div class="panel-h"><span class="panel-t">The AI's journal</span></div>${journal(d)}</div>`;
  drawChart(d.curve || []);
}

load();
setInterval(load, 5 * 60_000);
