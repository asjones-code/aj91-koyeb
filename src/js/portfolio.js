/**
 * Portfolio Dashboard — Alpaca-backed trading terminal
 * Loads positions, renders charts via lightweight-charts, polls for live prices.
 */

const POLL_INTERVAL_MS = 15_000;

// ── seed data (shown while API loads or keys aren't set) ──────────────────────
const SEED_POSITIONS = [
  { symbol:"SGAPY", qty:5,  avg_entry_price:22.71, current_price:38.79, sector:"Communication Services" },
  { symbol:"SFTBY", qty:10, avg_entry_price:42.56, current_price:17.26, sector:"Communication Services" },
  { symbol:"CCU",   qty:10, avg_entry_price:22.48, current_price:11.47, sector:"Consumer Defensive" },
  { symbol:"SVNDY", qty:10, avg_entry_price:18.42, current_price:12.16, sector:"Consumer Defensive" },
  { symbol:"DBA",   qty:10, avg_entry_price:16.54, current_price:28.28, sector:"ETFs – Agriculture" },
  { symbol:"HYEM",  qty:10, avg_entry_price:23.83, current_price:19.98, sector:"ETFs – Bonds" },
  { symbol:"VYM",   qty:2,  avg_entry_price:76.00, current_price:155.91,sector:"ETFs – Income" },
  { symbol:"SCHD",  qty:3,  avg_entry_price:53.73, current_price:32.10, sector:"ETFs – Income" },
  { symbol:"PFF",   qty:5,  avg_entry_price:37.46, current_price:30.97, sector:"ETFs – Income" },
  { symbol:"SDEM",  qty:10, avg_entry_price:12.58, current_price:31.85, sector:"ETFs – Income" },
  { symbol:"EWQ",   qty:5,  avg_entry_price:31.83, current_price:44.42, sector:"ETFs – International" },
  { symbol:"EWS",   qty:5,  avg_entry_price:23.72, current_price:29.22, sector:"ETFs – International" },
  { symbol:"SPYG",  qty:5,  avg_entry_price:39.97, current_price:116.39,sector:"ETFs – Large Cap" },
  { symbol:"FAAR",  qty:10, avg_entry_price:26.59, current_price:34.25, sector:"ETFs – Large Cap" },
  { symbol:"DEF",   qty:5,  avg_entry_price:51.66, current_price:0.21,  sector:"ETFs – Large Cap" },
  { symbol:"GAMR",  qty:5,  avg_entry_price:42.64, current_price:87.21, sector:"ETFs – Technology" },
  { symbol:"BLX",   qty:15, avg_entry_price:21.38, current_price:53.28, sector:"Financial Services" },
  { symbol:"BACHY", qty:5,  avg_entry_price:10.29, current_price:16.74, sector:"Financial Services" },
  { symbol:"CS",    qty:10, avg_entry_price:13.30, current_price:12.43, sector:"Financial Services" },
  { symbol:"BCS",   qty:10, avg_entry_price:9.44,  current_price:22.63, sector:"Financial Services" },
  { symbol:"LYG",   qty:31, avg_entry_price:3.16,  current_price:5.16,  sector:"Financial Services" },
  { symbol:"BX",    qty:5,  avg_entry_price:56.10, current_price:114.26,sector:"Financial Services" },
  { symbol:"BCSF",  qty:10, avg_entry_price:18.42, current_price:13.11, sector:"Financial Services" },
  { symbol:"ACB",   qty:70, avg_entry_price:0.70,  current_price:3.30,  sector:"Healthcare" },
  { symbol:"CGC",   qty:10, avg_entry_price:20.44, current_price:0.99,  sector:"Healthcare" },
  { symbol:"AVH",   qty:70, avg_entry_price:1.96,  current_price:1.17,  sector:"Industrials" },
  { symbol:"JBLU",  qty:10, avg_entry_price:19.16, current_price:4.38,  sector:"Industrials" },
  { symbol:"DAL",   qty:5,  avg_entry_price:56.96, current_price:67.76, sector:"Industrials" },
  { symbol:"GOGL",  qty:10, avg_entry_price:5.51,  current_price:1472,  sector:"Industrials" },
  { symbol:"GPRO",  qty:9,  avg_entry_price:4.38,  current_price:1.00,  sector:"Technology" },
  { symbol:"LYFT",  qty:10, avg_entry_price:55.23, current_price:13.18, sector:"Technology" },
  { symbol:"UBER",  qty:10, avg_entry_price:16.28, current_price:74.09, sector:"Technology" },
  { symbol:"SPWR",  qty:10, avg_entry_price:64.92, current_price:1.02,  sector:"Technology" },
  { symbol:"NRG",   qty:4,  avg_entry_price:37.82, current_price:123.71,sector:"Utilities" },
];

// ── state ─────────────────────────────────────────────────────────────────────
let positions = [];
let returnsCache = {};
let activeChart = null;
let activeSeries = null;
let activeSymbol = null;
let chartInstance = null;

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (n, decimals = 2) =>
  typeof n === "number" && isFinite(n)
    ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : "—";

const fmtPct = (n) => (typeof n === "number" && isFinite(n) ? (n >= 0 ? "+" : "") + fmt(n) + "%" : "—");
const fmtDollar = (n) => (n >= 0 ? "+$" : "-$") + fmt(Math.abs(n));

function pnl(pos) {
  const cost  = pos.avg_entry_price * pos.qty;
  const equity = pos.current_price * pos.qty;
  const dollarReturn = equity - cost;
  const pctReturn = cost > 0 ? (dollarReturn / cost) * 100 : 0;
  return { cost, equity, dollarReturn, pctReturn };
}

// ── fetch from backend ────────────────────────────────────────────────────────
async function fetchPositions() {
  try {
    const res = await fetch("/api/alpaca/positions");
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (data.demo) return SEED_POSITIONS;
    return data.positions ?? SEED_POSITIONS;
  } catch {
    return SEED_POSITIONS;
  }
}

async function fetchBars(symbol) {
  // Try Alpaca first, fall back to Yahoo Finance (no keys needed)
  try {
    const res = await fetch(`/api/alpaca/bars/${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (!data.demo) return data;
  } catch { /* fall through */ }
  try {
    const res = await fetch(`/api/yahoo/bars/${encodeURIComponent(symbol)}`);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchDailyRec() {
  try {
    const res = await fetch("/api/ai/daily-recs");
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchMultiReturns(symbols) {
  try {
    const res = await fetch(`/api/alpaca/multi-returns?symbols=${symbols.join(",")}`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (data.demo) return {};
    return data.returns ?? {};
  } catch {
    return {};
  }
}

// ── summary stats ─────────────────────────────────────────────────────────────
function computeSummary(pos) {
  let totalCost = 0, totalEquity = 0;
  for (const p of pos) {
    const { cost, equity } = pnl(p);
    totalCost += cost;
    totalEquity += equity;
  }
  const totalReturn = totalEquity - totalCost;
  const totalPct = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
  return { totalCost, totalEquity, totalReturn, totalPct };
}

// ── sparkline ─────────────────────────────────────────────────────────────────
function sparkline(closes, w = 80, h = 28) {
  if (!closes?.length) return '<span style="color:var(--c-tertiary)">—</span>';
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const pts = closes.map((c, i) => {
    const x = (i / Math.max(closes.length - 1, 1)) * w;
    const y = h - ((c - min) / range) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const color = closes.at(-1) >= closes[0] ? "#ABF8FE" : "#ED6FF5";
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:visible">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ── table rendering ───────────────────────────────────────────────────────────
let sortKey = "current_price";
let sortDir = -1;

function renderTable(pos) {
  const tbody = document.getElementById("portfolio-tbody");
  if (!tbody) return;

  const rows = pos.map((p) => {
    const r = returnsCache[p.symbol] ?? {};
    return {
      ...p,
      pct_1d:   r.pct_1d   ?? null,
      pct_7d:   r.pct_7d   ?? null,
      pct_30d:  r.pct_30d  ?? null,
      pct_365d: r.pct_365d ?? null,
      sparkline: r.sparkline ?? null,
    };
  });

  rows.sort((a, b) => {
    const av = a[sortKey] ?? (sortDir > 0 ? -Infinity : Infinity);
    const bv = b[sortKey] ?? (sortDir > 0 ? -Infinity : Infinity);
    return av > bv ? sortDir : -sortDir;
  });

  const pctCell = (v) => {
    if (v === null) return `<td style="color:var(--c-tertiary)">—</td>`;
    const cls = v >= 0 ? "up" : "down";
    return `<td class="${cls}">${v >= 0 ? "+" : ""}${fmt(v)}%</td>`;
  };

  tbody.innerHTML = rows.map((r) => `<tr data-symbol="${r.symbol}" class="portfolio-row">
    <td class="ticker">${r.symbol}</td>
    <td>$${fmt(r.current_price)}</td>
    ${pctCell(r.pct_1d)}
    ${pctCell(r.pct_7d)}
    ${pctCell(r.pct_30d)}
    ${pctCell(r.pct_365d)}
    <td class="trend">${sparkline(r.sparkline)}</td>
    <td><button class="preview-btn" data-sym="${r.symbol}">Preview</button></td>
  </tr>`).join("");

  tbody.querySelectorAll(".preview-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => { e.stopPropagation(); openChartModal(btn.dataset.sym); });
  });
}

// ── summary bar ───────────────────────────────────────────────────────────────
function renderSummary(pos) {
  const { totalCost, totalEquity, totalReturn, totalPct } = computeSummary(pos);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("stat-invested", "$" + fmt(totalCost));
  set("stat-equity",   "$" + fmt(totalEquity));
  set("stat-return",   fmtDollar(totalReturn));
  set("stat-pct",      fmtPct(totalPct));

  const retEl = document.getElementById("stat-return");
  const pctEl = document.getElementById("stat-pct");
  const cls = totalReturn >= 0 ? "up" : "down";
  if (retEl) retEl.className = cls;
  if (pctEl) pctEl.className = cls;
}

// ── chart modal ───────────────────────────────────────────────────────────────
async function openChartModal(symbol) {
  const modal = document.getElementById("chart-modal");
  const labelEl = document.getElementById("modal-chart-label");
  if (!modal) return;

  if (labelEl) labelEl.textContent = symbol;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  const container = document.getElementById("modal-chart-container");
  if (!container) return;

  if (!chartInstance) {
    activeChart = LightweightCharts.createChart(container, {
      layout: { background: { color: "#000000" }, textColor: "rgba(255,255,255,0.58)" },
      grid: { vertLines: { color: "rgba(255,255,255,0.05)" }, horzLines: { color: "rgba(255,255,255,0.05)" } },
      crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.1)" },
      timeScale: { borderColor: "rgba(255,255,255,0.1)", timeVisible: true },
      width: container.clientWidth,
      height: container.clientHeight || 420,
    });
    activeSeries = activeChart.addCandlestickSeries({
      upColor: "#ABF8FE", downColor: "#ED6FF5",
      borderVisible: false, wickUpColor: "#ABF8FE", wickDownColor: "#ED6FF5",
    });
    chartInstance = true;
    window.addEventListener("resize", () => {
      if (activeChart) activeChart.applyOptions({ width: container.clientWidth });
    });
  } else {
    activeSeries.setData([]);
  }

  const data = await fetchBars(symbol);
  if (!data || !data.bars || data.bars.length === 0) return;

  const candles = data.bars.map((b) => ({
    time: b.t.slice(0, 10),
    open: b.o, high: b.h, low: b.l, close: b.c,
  }));
  activeSeries.setData(candles);
  if (activeChart) activeChart.timeScale().fitContent();
}

function closeChartModal() {
  const modal = document.getElementById("chart-modal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

// ── Kraken fund panel ────────────────────────────────────────────────────────
const ASSET_TO_PAIR = {
  BTC:"XBTUSD",  ETH:"ETHUSD",   SOL:"SOLUSD",   XRP:"XRPUSD",
  DOGE:"DOGEUSD",ADA:"ADAUSD",   DOT:"DOTUSD",   LINK:"LINKUSD",
  AVAX:"AVAXUSD",LTC:"LTCUSD",   MATIC:"MATICUSD",XMR:"XMRUSD",
  NEAR:"NEARUSD",UNI:"UNIUSD",   ALGO:"ALGOUSD",  BCH:"BCHUSD",
  PAXG:"PAXGUSD",TRAC:"TRACUSD", SGB:"SGBUSD",    ATOM:"ATOMUSD",
  FIL:"FILUSD",  AAVE:"AAVEUSD", COMP:"COMPUSD",  MKR:"MKRUSD",
};
// Fiat assets that are cash balances, not crypto
const FIAT_ASSETS = new Set(["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]);

async function renderKraken() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  try {
    const balRes = await fetch("/api/kraken/balances");
    const balData = await balRes.json();

    if (balData.demo) {
      set("kraken-value",   "Add keys");
      set("kraken-change",  "—");
      set("kraken-assets",  "0");
      const el = document.getElementById("kraken-holdings");
      if (el) el.innerHTML = `<div style="font-family:monospace;font-size:0.7rem;color:var(--c-tertiary);margin-top:0.5rem">Set KRAKEN_API_KEY + KRAKEN_API_SECRET to see live holdings</div>`;
      return;
    }

    // Separate fiat cash from crypto
    const fiatBalances = balData.balances.filter(b => FIAT_ASSETS.has(b.asset));
    const cryptoBalances = balData.balances.filter(b => !FIAT_ASSETS.has(b.asset));

    const pairs = cryptoBalances
      .map(b => ASSET_TO_PAIR[b.asset]).filter(Boolean).join(",");

    let tickers = {};
    if (pairs) {
      const tkRes  = await fetch(`/api/kraken/ticker?pairs=${encodeURIComponent(pairs)}`);
      const tkData = await tkRes.json();
      tickers = tkData.tickers || {};
    }

    // Find ticker by pair or by scanning for asset prefix
    function findTicker(asset) {
      const pair = ASSET_TO_PAIR[asset];
      if (!pair) return null;
      return tickers[pair]
        || Object.entries(tickers).find(([k]) => k.replace(/[XZ]?USD$/, "") === asset || k.startsWith(asset))?.[1]
        || null;
    }

    // Enrich crypto balances with price data
    const holdings = cryptoBalances.map(b => {
      const ticker = findTicker(b.asset);
      const last   = ticker?.last ?? 0;
      return { ...b, last, value: b.balance * last, change_24h_pct: ticker?.change_24h_pct ?? 0 };
    }).filter(h => h.value > 0.01 || h.balance > 0.0001).sort((a, b) => b.value - a.value);

    // Add fiat cash as a single line item
    const cashUsd = fiatBalances.reduce((s, b) => {
      if (b.asset === "USD") return s + b.balance;
      if (b.asset === "EUR") return s + b.balance * 1.08; // rough conversion
      return s;
    }, 0);

    const cryptoValue = holdings.reduce((s, h) => s + h.value, 0);
    const totalValue  = cryptoValue + cashUsd;
    const change24h   = holdings.reduce((s, h) => s + h.value * (h.change_24h_pct / 100), 0);
    const changePct   = cryptoValue > 0 ? (change24h / cryptoValue) * 100 : 0;

    set("kraken-value",  "$" + fmt(totalValue));
    set("kraken-assets", holdings.length.toString());

    // Populate stats bar with crypto data
    set("stat-invested", "$" + fmt(cryptoValue));
    const change24hDollar = holdings.reduce((s, h) => s + h.value * (h.change_24h_pct / 100), 0);
    const statRetEl = document.getElementById("stat-equity");
    if (statRetEl) {
      statRetEl.textContent = (change24hDollar >= 0 ? "+$" : "-$") + fmt(Math.abs(change24hDollar));
      statRetEl.className = "pf-stat-value " + (change24hDollar >= 0 ? "up" : "down");
    }
    const statPctEl = document.getElementById("stat-return");
    if (statPctEl) {
      const sign = changePct >= 0 ? "+" : "";
      statPctEl.textContent = sign + fmt(changePct) + "%";
      statPctEl.className = "pf-stat-value " + (changePct >= 0 ? "up" : "down");
    }
    set("stat-pct", holdings.length.toString());

    const chEl = document.getElementById("kraken-change");
    if (chEl) {
      const sign = changePct >= 0 ? "+" : "";
      chEl.textContent = `${sign}${fmt(changePct)}%`;
      chEl.style.color = changePct >= 0 ? "#4ade80" : "#ED6FF5";
    }

    const holdEl = document.getElementById("kraken-holdings");
    if (holdEl) {
      const rows = holdings.slice(0, 5).map(h => {
        const cls  = h.change_24h_pct >= 0 ? "up" : "down";
        const sign = h.change_24h_pct >= 0 ? "+" : "";
        const val  = h.value > 0 ? `$${fmt(h.value)}` : `${h.balance.toFixed(4)} (no price)`;
        const chg  = h.last > 0 ? `<span class="kraken-chg ${cls}">${sign}${fmt(h.change_24h_pct)}%</span>` : "";
        return `<div class="kraken-holding">
          <span class="kraken-sym">${h.asset}</span>
          <span class="kraken-val">${val}</span>
          ${chg}
        </div>`;
      });
      if (cashUsd > 0.01) {
        rows.push(`<div class="kraken-holding">
          <span class="kraken-sym" style="color:var(--c-secondary)">Cash</span>
          <span class="kraken-val">$${fmt(cashUsd)}</span>
          <span></span>
        </div>`);
      }
      holdEl.innerHTML = rows.join("");
    }
  } catch (e) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("kraken-value", "Error");
  }
}

// ── Daily Claude signal ───────────────────────────────────────────────────────
async function renderDailyRec() {
  const el = document.getElementById("daily-rec-content");
  if (!el) return;

  const data = await fetchDailyRec();
  const footerEl = document.getElementById("daily-rec-footer");
  const cachedLabelEl = document.getElementById("daily-rec-cached-label");

  if (!data || data.demo) {
    el.innerHTML = `<div class="rec-empty" style="padding:0.5rem 0">Add <code style="font-size:0.65rem">ANTHROPIC_API_KEY</code> to enable live signals</div>`;
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  if (data.error) {
    el.innerHTML = `<div class="rec-empty" style="padding:0.5rem 0;color:rgba(237,111,245,0.7)">Signal error — retry later</div>`;
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  const actionCls = data.action === "BUY" ? "up" : data.action === "SELL" ? "down" : "hold";

  const tfVal = (v) => {
    if (v == null) return `<span class="daily-sig-tf-val" style="color:var(--c-tertiary)">—</span>`;
    const cls = v >= 0 ? "up" : "down";
    return `<span class="daily-sig-tf-val ${cls}">${v >= 0 ? "+" : ""}${fmt(v)}%</span>`;
  };

  el.innerHTML = `
    <div class="daily-sig-header">
      <span class="daily-sig-action ${actionCls}">${data.action} ${data.asset}</span>
      <span class="daily-sig-conviction">${(data.conviction || "").toUpperCase()} conviction</span>
    </div>
    <div class="daily-sig-timeframes">
      <div class="daily-sig-tf">
        <span class="daily-sig-tf-label">24H</span>
        ${tfVal(data.projected_24h_pct)}
      </div>
      <div class="daily-sig-tf">
        <span class="daily-sig-tf-label">7D</span>
        ${tfVal(data.projected_7d_pct)}
      </div>
      <div class="daily-sig-tf">
        <span class="daily-sig-tf-label">30D</span>
        ${tfVal(data.projected_30d_pct)}
      </div>
    </div>
    ${data.signal_basis ? `<div class="daily-sig-rationale">${data.signal_basis}</div>` : ""}
    ${data.risk_note    ? `<div class="daily-sig-risk">⚠ ${data.risk_note}</div>` : ""}
    ${data.market_note  ? `<div class="daily-sig-market">${data.market_note}</div>` : ""}
  `;

  // Refresh footer
  if (footerEl) footerEl.style.display = "flex";
  if (cachedLabelEl && data.cachedAt) {
    const hoursAgo = Math.round((Date.now() - data.cachedAt) / 3_600_000);
    cachedLabelEl.textContent = hoursAgo < 1 ? "Refreshed just now" : `Refreshed ${hoursAgo}h ago`;
  }
}

// ── AI trade recommendations ──────────────────────────────────────────────────
function renderRecs(pos) {
  const el = document.getElementById("recs-container");
  if (!el) return;

  const periods = [
    { label: "24-Hour Signal",  moKey: "pct_1d",   refKey: "pct_7d"   },
    { label: "7-Day Signal",    moKey: "pct_7d",   refKey: "pct_30d"  },
    { label: "30-Day Signal",   moKey: "pct_30d",  refKey: "pct_365d" },
  ];

  el.innerHTML = periods.map(p => {
    const ranked = pos
      .map(q => ({ ...q, mo: returnsCache[q.symbol]?.[p.moKey] ?? null }))
      .filter(q => q.mo !== null)
      .sort((a, b) => b.mo - a.mo);

    if (!ranked.length) {
      return `<div class="rec-card">
        <div class="rec-label">${p.label}</div>
        <div class="rec-empty">Add Alpaca API keys for live signals</div>
      </div>`;
    }

    const top = ranked[0];
    const mo = top.mo;
    const refMo = returnsCache[top.symbol]?.[p.refKey] ?? null;
    const dir = mo >= 0 ? "up" : "down";
    const action = mo > 3 ? "BUY" : mo > 0 ? "HOLD" : "TRIM";
    const color = action === "BUY" ? "rgba(171,248,254,1)" : action === "HOLD" ? "rgba(255,255,255,0.7)" : "rgba(237,111,245,1)";
    const dd = action === "BUY"
      ? `${top.symbol} leading portfolio with +${fmt(mo)}% momentum. Volume and sector trend support continuation.`
      : action === "HOLD"
      ? `${top.symbol} modest positive trend (+${fmt(mo)}%). Hold and monitor for breakout confirmation.`
      : `${top.symbol} in drawdown (${fmt(mo)}%). Consider partial exit or wait for reversal signal before adding.`;
    const refLine = refMo !== null
      ? `<div class="rec-ref">Longer-term: ${refMo >= 0 ? "+" : ""}${fmt(refMo)}%</div>` : "";

    return `<div class="rec-card">
      <div class="rec-label">${p.label}</div>
      <div class="rec-action" style="color:${color}">${action}</div>
      <div class="rec-ticker">${top.symbol}</div>
      <div class="rec-momentum ${dir}">${mo >= 0 ? "+" : ""}${fmt(mo)}%</div>
      <div class="rec-dd">${dd}</div>
      ${refLine}
      <div class="rec-note">→ Email / SMS approval flow coming soon</div>
    </div>`;
  }).join("");
}

// ── table sort ────────────────────────────────────────────────────────────────
function initSortHeaders() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (sortKey === key) { sortDir *= -1; } else { sortKey = key; sortDir = -1; }
      renderTable(positions);
    });
  });
}

// ── poll loop ─────────────────────────────────────────────────────────────────
async function refresh() {
  positions = await fetchPositions();
  renderTable(positions); // immediate render with seed/live prices

  const symbols = positions.map(p => p.symbol);
  if (symbols.length) {
    returnsCache = await fetchMultiReturns(symbols);
    renderTable(positions); // re-render with period returns + sparklines
  }
}

// ── boot ──────────────────────────────────────────────────────────────────────
// ── tabs ────────────────────────────────────────────────────────────────────
function initTabs() {
  const btns = document.querySelectorAll(".pf-tab");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const tab = btn.dataset.tab;
      btns.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      document.querySelectorAll(".pf-tabpanel").forEach((p) => {
        p.hidden = p.id !== `tab-${tab}`;
      });
    });
  });
}

// ── premium signal controls (regenerate / email) ──────────────────────────────
const SIGNAL_TOKEN_KEY = "pf_signal_token";
function getSignalToken() {
  let t = localStorage.getItem(SIGNAL_TOKEN_KEY);
  if (!t) {
    t = (prompt("Premium feature.\nEnter your signal access token to regenerate / email signals:") || "").trim();
    if (t) localStorage.setItem(SIGNAL_TOKEN_KEY, t);
  }
  return t;
}
function clearSignalToken() { localStorage.removeItem(SIGNAL_TOKEN_KEY); }

async function regenerateSignal() {
  const btn = document.getElementById("signal-star-btn");
  const token = getSignalToken();
  if (!token) return;
  if (btn) { btn.disabled = true; btn.textContent = "★ …"; }
  try {
    const res = await fetch("/api/ai/regenerate", { method: "POST", headers: { "X-Signal-Token": token } });
    if (res.status === 401) { clearSignalToken(); alert("Invalid token — try again."); return; }
    if (!res.ok) throw new Error("Regenerate failed");
    await renderDailyRec();
  } catch (e) {
    alert("Could not regenerate signal. " + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "★ Regenerate"; }
  }
}

async function emailSignal() {
  const btn = document.getElementById("signal-email-btn");
  const token = getSignalToken();
  if (!token) return;
  if (btn) { btn.disabled = true; btn.textContent = "✉ …"; }
  try {
    const res = await fetch("/api/ai/email-signal", { method: "POST", headers: { "X-Signal-Token": token } });
    if (res.status === 401) { clearSignalToken(); alert("Invalid token — try again."); return; }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Email failed");
    alert(`Signal emailed${data.to ? " to " + data.to : ""}.`);
  } catch (e) {
    alert("Could not email signal. " + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "✉ Email"; }
  }
}

function initSignalControls() {
  document.getElementById("signal-star-btn")?.addEventListener("click", regenerateSignal);
  document.getElementById("signal-email-btn")?.addEventListener("click", emailSignal);
}

document.addEventListener("DOMContentLoaded", async () => {
  initSortHeaders();
  initTabs();
  initSignalControls();

  // Modal close handlers
  document.getElementById("modal-close")?.addEventListener("click", closeChartModal);
  document.getElementById("chart-modal")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeChartModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeChartModal();
  });

  await refresh();
  await renderKraken();
  await renderDailyRec();
  setInterval(refresh, POLL_INTERVAL_MS);
  setInterval(renderKraken, 60_000);
  setInterval(renderDailyRec, 3_600_000);
});
