/**
 * Crypto Dashboard — Kraken-backed terminal
 * Holdings table, candlestick chart, trade panel, order log.
 */

const POLL_MS = 30_000;

// ── Kraken pair → base asset mapping ─────────────────────────────────────────
const PAIR_TO_ASSET = {
  XXBTZUSD: "BTC", XBTUSD: "BTC",
  XETHZUSD: "ETH", ETHUSD: "ETH",
  SOLUSD:   "SOL",
  XXRPZUSD: "XRP", XRPUSD: "XRP",
  XDGUSD:   "DOGE", DOGEUSD: "DOGE",
  ADAUSD:   "ADA",
  DOTUSD:   "DOT",
  LINKUSD:  "LINK",
  AVAXUSD:  "AVAX",
  XLTCZUSD: "LTC", LTCUSD: "LTC",
  MATICUSD: "MATIC",
  XXMRZUSD: "XMR", XMRUSD: "XMR",
  NEARUSD:  "NEAR",
  UNIUSD:   "UNI",
};

// Asset → Kraken pair for chart lookups
const ASSET_TO_PAIR = {
  BTC: "XBTUSD", ETH: "ETHUSD", SOL: "SOLUSD", XRP: "XRPUSD",
  DOGE: "DOGEUSD", ADA: "ADAUSD", DOT: "DOTUSD", LINK: "LINKUSD",
  AVAX: "AVAXUSD", LTC: "LTCUSD", MATIC: "MATICUSD", XMR: "XMRUSD",
  NEAR: "NEARUSD", UNI: "UNIUSD",
};

// ── seed data (shown when Kraken keys aren't set) ─────────────────────────────
const SEED_HOLDINGS = [
  { asset: "BTC",   balance: 0.05,    last: 76926,   change_24h_pct:  2.3  },
  { asset: "ETH",   balance: 0.80,    last: 2099,    change_24h_pct: -1.2  },
  { asset: "SOL",   balance: 5.00,    last: 84.44,   change_24h_pct:  4.1  },
  { asset: "XRP",   balance: 100.0,   last: 1.34,    change_24h_pct:  0.8  },
  { asset: "DOGE",  balance: 500.0,   last: 0.1014,  change_24h_pct: -0.5  },
  { asset: "LINK",  balance: 10.0,    last: 9.45,    change_24h_pct:  1.4  },
];

// ── state ─────────────────────────────────────────────────────────────────────
let holdings    = [];
let tickers     = {};
let sortKey     = "value";
let sortDir     = -1;
let activePair  = null;
let chartInst   = null;
let chartSeries = null;
let tradeSide   = "buy";
let currentInterval = "1440";

// ── formatting ────────────────────────────────────────────────────────────────
const fmt  = (n, d = 2) => typeof n === "number" && isFinite(n)
  ? n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—";
const fmtPct = (n) => (isFinite(n) ? (n >= 0 ? "+" : "") + fmt(n) + "%" : "—");
const fmtUsd = (n) => "$" + fmt(n);
const set    = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
const setClass = (id, cls) => { const el = document.getElementById(id); if (el) el.className = cls; };

// ── API calls ─────────────────────────────────────────────────────────────────
async function fetchBalances() {
  try {
    const r = await fetch("/api/kraken/balances");
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch { return { demo: true }; }
}

async function fetchTicker(pairs) {
  try {
    const r = await fetch(`/api/kraken/ticker?pairs=${encodeURIComponent(pairs)}`);
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch { return { tickers: {} }; }
}

async function fetchOhlc(pair, interval) {
  try {
    const r = await fetch(`/api/kraken/ohlc/${encodeURIComponent(pair)}?interval=${interval}`);
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch { return null; }
}

async function fetchOrders() {
  try {
    const r = await fetch("/api/kraken/orders");
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch { return { demo: true }; }
}

async function placeOrder(payload) {
  const r = await fetch("/api/kraken/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}

// ── build enriched holdings ────────────────────────────────────────────────────
function mergeTickerIntoHoldings(rawBalances, rawTickers) {
  return rawBalances.map(b => {
    const pair   = ASSET_TO_PAIR[b.asset] || (b.asset + "USD");
    // Find ticker by trying multiple key formats Kraken returns
    const ticker = rawTickers[pair]
      || rawTickers["X" + b.raw_asset + "ZUSD"]
      || rawTickers[b.raw_asset + "USD"]
      || null;
    const last           = ticker?.last ?? 0;
    const change_24h_pct = ticker?.change_24h_pct ?? 0;
    const value          = b.balance * last;
    return { ...b, last, change_24h_pct, value, pair };
  });
}

// ── stats strip ───────────────────────────────────────────────────────────────
function renderStats(h) {
  const totalValue = h.reduce((s, p) => s + p.value, 0);
  const change24h  = h.reduce((s, p) => s + (p.value * (p.change_24h_pct / 100)), 0);

  set("stat-value",   fmtUsd(totalValue));
  set("stat-change",  (change24h >= 0 ? "+" : "") + fmtUsd(change24h));
  set("stat-assets",  h.length.toString());
  set("stat-refresh", new Date().toLocaleTimeString());

  const chEl = document.getElementById("stat-change");
  if (chEl) chEl.className = "stat-value " + (change24h >= 0 ? "up" : "down");
}

// ── holdings table ────────────────────────────────────────────────────────────
function renderTable(h) {
  const tbody = document.getElementById("holdings-tbody");
  if (!tbody) return;

  const rows = [...h].sort((a, b) => {
    const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
    return av > bv ? sortDir : av < bv ? -sortDir : 0;
  });

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="loading">No holdings found</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(r => {
    const pct = r.change_24h_pct;
    const cls = pct >= 0 ? "up" : "down";
    const isActive = (r.pair === activePair) ? " active" : "";
    // Format balance with appropriate decimals
    const balFmt = r.balance >= 1 ? fmt(r.balance, 4) : r.balance.toFixed(8).replace(/0+$/, "");
    return `<tr class="holding-row${isActive}" data-pair="${r.pair}" data-asset="${r.asset}">
      <td><span class="asset-sym">${r.asset}</span></td>
      <td class="right">${balFmt}</td>
      <td class="right">${r.last >= 1 ? fmtUsd(r.last) : "$" + r.last.toFixed(6)}</td>
      <td class="right ${cls}">${fmtPct(pct)}</td>
      <td class="right">${fmtUsd(r.value)}</td>
    </tr>`;
  }).join("");

  tbody.querySelectorAll("tr.holding-row").forEach(tr => {
    tr.addEventListener("click", () => openChart(tr.dataset.pair, tr.dataset.asset));
  });
}

// ── chart ─────────────────────────────────────────────────────────────────────
function initChart() {
  const container = document.getElementById("chart-container");
  if (!container || !window.LightweightCharts) return;
  chartInst = LightweightCharts.createChart(container, {
    layout: { background: { color: "#000000" }, textColor: "rgba(255,255,255,0.5)" },
    grid: {
      vertLines: { color: "rgba(255,255,255,0.04)" },
      horzLines: { color: "rgba(255,255,255,0.04)" },
    },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
    rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
    timeScale: { borderColor: "rgba(255,255,255,0.08)", timeVisible: true },
    width:  container.clientWidth,
    height: container.clientHeight || 280,
  });
  chartSeries = chartInst.addCandlestickSeries({
    upColor:       "#ABF8FE",
    downColor:     "#ED6FF5",
    borderVisible: false,
    wickUpColor:   "#ABF8FE",
    wickDownColor: "#ED6FF5",
  });
  window.addEventListener("resize", () => {
    chartInst.applyOptions({ width: container.clientWidth });
  });
}

async function openChart(pair, asset) {
  if (!pair) return;
  activePair = pair;

  document.querySelectorAll(".holding-row").forEach(r =>
    r.classList.toggle("active", r.dataset.pair === pair)
  );

  // sync trade pair select
  const tradePairSel = document.getElementById("trade-pair");
  if (tradePairSel) {
    const opt = [...tradePairSel.options].find(o => o.value === pair);
    if (opt) tradePairSel.value = pair;
  }

  const ticker = Object.entries(tickers).find(([k]) => k === pair)?.[1];
  set("chart-pair",         asset + "/USD");
  set("chart-price",        ticker ? fmtUsd(ticker.last) : "");
  set("chart-change-label", ticker ? fmtPct(ticker.change_24h_pct) : "");

  const changeEl = document.getElementById("chart-change-label");
  if (changeEl && ticker) changeEl.className = "chart-change " + (ticker.change_24h_pct >= 0 ? "up" : "down");

  const emptyEl = document.getElementById("chart-empty");
  if (emptyEl) emptyEl.textContent = "Loading chart…";

  if (!chartInst) initChart();
  else chartSeries.setData([]);

  const data = await fetchOhlc(pair, currentInterval);
  if (!data?.bars?.length) {
    if (emptyEl) emptyEl.textContent = "No chart data available";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";

  chartSeries.setData(data.bars);
  chartInst.timeScale().fitContent();
}

// ── orders log ────────────────────────────────────────────────────────────────
async function renderOrders() {
  const el = document.getElementById("orders-list");
  if (!el) return;
  const data = await fetchOrders();
  if (data.demo || !data.orders?.length) {
    el.innerHTML = `<div class="loading">No order history — add Kraken keys to see trades</div>`;
    return;
  }
  el.innerHTML = data.orders.map(o => {
    const dt = o.closed_at ? new Date(o.closed_at * 1000).toLocaleDateString() : "";
    return `<div class="order-row">
      <span class="order-side ${o.type}">${(o.type || "").toUpperCase()}</span>
      <span class="order-pair">${o.pair || "—"}</span>
      <span>${fmt(o.filled, 6)} @ $${fmt(o.price)}</span>
      <span class="order-meta">${dt} · ${o.order_type || ""}</span>
    </div>`;
  }).join("");
}

// ── trade panel ───────────────────────────────────────────────────────────────
function initTrade() {
  const tabs   = document.querySelectorAll(".trade-tab");
  const submit = document.getElementById("trade-submit");
  const otSel  = document.getElementById("trade-ordertype");
  const priceFl = document.getElementById("price-field");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tradeSide = tab.dataset.side;
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      if (submit) {
        submit.className = "trade-submit " + tradeSide;
        submit.textContent = tradeSide.charAt(0).toUpperCase() + tradeSide.slice(1);
      }
    });
  });

  if (otSel && priceFl) {
    otSel.addEventListener("change", () => {
      priceFl.style.display = otSel.value === "limit" ? "flex" : "none";
    });
  }

  if (submit) {
    submit.addEventListener("click", async () => {
      const msg     = document.getElementById("trade-msg");
      const pair    = document.getElementById("trade-pair")?.value;
      const ordertype = document.getElementById("trade-ordertype")?.value;
      const volume  = document.getElementById("trade-volume")?.value;
      const price   = document.getElementById("trade-price")?.value;

      if (!pair || !volume || parseFloat(volume) <= 0) {
        if (msg) { msg.textContent = "Enter a valid pair and volume."; msg.className = "trade-msg err"; }
        return;
      }

      submit.disabled = true;
      if (msg) { msg.textContent = "Placing order…"; msg.className = "trade-msg"; }

      const payload = { pair, type: tradeSide, ordertype, volume: parseFloat(volume) };
      if (ordertype === "limit" && price) payload.price = parseFloat(price);

      try {
        const result = await placeOrder(payload);
        if (result.error) {
          if (msg) { msg.textContent = result.error; msg.className = "trade-msg err"; }
        } else {
          const desc = result.result?.descr?.order || "Order placed";
          if (msg) { msg.textContent = desc; msg.className = "trade-msg ok"; }
          setTimeout(() => renderOrders(), 1500);
        }
      } catch (e) {
        if (msg) { msg.textContent = e.message || "Order failed."; msg.className = "trade-msg err"; }
      } finally {
        submit.disabled = false;
      }
    });
  }

  // interval buttons
  document.querySelectorAll(".interval-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".interval-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentInterval = btn.dataset.interval;
      if (activePair) {
        const holding = holdings.find(h => h.pair === activePair);
        openChart(activePair, holding?.asset || activePair.replace("USD", ""));
      }
    });
  });
}

// ── table sort headers ────────────────────────────────────────────────────────
function initSort() {
  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      sortDir = (sortKey === key) ? -sortDir : -1;
      sortKey = key;
      renderTable(holdings);
    });
  });
}

// ── status indicator ──────────────────────────────────────────────────────────
function setStatus(live) {
  const dot  = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  if (dot)  dot.className  = "status-dot" + (live ? " live" : "");
  if (text) text.textContent = live ? "Live" : "Demo mode";
}

// ── refresh loop ──────────────────────────────────────────────────────────────
async function refresh() {
  const balData = await fetchBalances();
  let rawBalances;

  if (balData.demo) {
    setStatus(false);
    rawBalances = SEED_HOLDINGS.map(h => ({
      asset: h.asset, raw_asset: h.asset,
      balance: h.balance,
      last: h.last, change_24h_pct: h.change_24h_pct,
      value: h.balance * h.last,
      pair: ASSET_TO_PAIR[h.asset] || h.asset + "USD",
    }));
    holdings = rawBalances;
  } else {
    setStatus(true);
    // Fetch tickers for all held assets
    const pairs = balData.balances
      .map(b => ASSET_TO_PAIR[b.asset] || "")
      .filter(Boolean)
      .join(",");

    if (pairs) {
      const tkData = await fetchTicker(pairs);
      tickers = tkData.tickers || {};
    }

    holdings = mergeTickerIntoHoldings(balData.balances, tickers);
  }

  renderStats(holdings);
  renderTable(holdings);

  // auto-open first row chart
  if (!activePair && holdings.length) {
    const first = holdings[0];
    openChart(first.pair, first.asset);
  }
}

// ── boot ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  initSort();
  initTrade();

  document.getElementById("btn-refresh")?.addEventListener("click", () => {
    refresh();
    renderOrders();
  });

  await refresh();
  await renderOrders();
  setInterval(refresh, POLL_MS);
});
