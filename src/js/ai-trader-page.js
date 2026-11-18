/**
 * Long/Flat (/ai-trader): public overview from /api/ai/kraken/public (percentages only),
 * plus "the desk" — private state, candles and decision log — when the signal token is valid.
 */
import { getSignalToken, peekSignalToken, clearSignalToken, authHeaders } from "./signal-token.js";

const $ = (id) => document.getElementById(id);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (n) => typeof n === "number" && Number.isFinite(n);
const pct = (n, d = 2) => (num(n) ? `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(d)}%` : "—");
const tone = (n) => (num(n) ? (n >= 0 ? "up" : "down") : "");
const usd = (n) => (num(n) ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—");
const px = (n) => (num(n) ? (n >= 100 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : n >= 1 ? n.toLocaleString("en-US", { maximumFractionDigits: 3 }) : n.toPrecision(4)) : "—");
const ago = (iso) => {
	const m = (Date.now() - new Date(iso).getTime()) / 60000;
	return m < 60 ? `${Math.max(1, Math.round(m))}m ago` : m < 2880 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};
const until = (iso) => {
	const m = Math.max(0, (new Date(iso).getTime() - Date.now()) / 60000);
	return m < 60 ? `${Math.round(m)}m` : `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, "0")}m`;
};
const EXIT = { take_profit: "hit target", stop_loss: "stopped out", time: "time limit", ai: "closed by AI", manual: "closed manually" };
const WORDS = ["none", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let pub = null; // public payload
let desk = null; // private state
let deskAsset = null;
let candleChart = null;
let growthChart = null;

// ── public ──────────────────────────────────────────────────────────────────
function renderWall(d) {
	const coins = (d.coins || []).length ? d.coins : (d.universe || []).map((asset) => ({ asset }));
	const line = (cls, text) => `<span class="${cls}">${esc(text)}</span><br>`;
	const sign = (n) => (num(n) ? (n >= 0 ? "u" : "d") : "");
	const col = (c) => {
		const rows = [
			line("h", `${c.asset}/USD`), line("", px(c.price)), line(sign(c.ret_24h_pct), `24h ${pct(c.ret_24h_pct)}`),
			line(sign(c.ret_7d_pct), `7d  ${pct(c.ret_7d_pct)}`), line(sign(c.ret_30d_pct), `30d ${pct(c.ret_30d_pct)}`),
			line("", `RSI ${num(c.rsi_14_4h) ? c.rsi_14_4h.toFixed(1) : "—"}`), line(sign(c.vs_sma20_4h_pct), `σ20 ${pct(c.vs_sma20_4h_pct)}`),
			line(sign(c.vs_sma50_4h_pct), `σ50 ${pct(c.vs_sma50_4h_pct)}`), line("", `VOL ${num(c.volume_vs_7d_avg) ? c.volume_vs_7d_avg.toFixed(2) + "x" : "—"}`),
			line(sign(c.rel_strength_vs_btc_7d_pct), `RS  ${pct(c.rel_strength_vs_btc_7d_pct)}`), line("", c.aligned ? "■ ALIGNED" : "□ WAIT"), "<br>",
		].join("");
		return `<div>${rows.repeat(3)}</div>`;
	};
	const wall = $("lf-wall");
	wall.innerHTML = coins.map(col).join("");
	if (!wall.dataset.io && "IntersectionObserver" in window) {
		wall.dataset.io = "1";
		new IntersectionObserver(([e]) => wall.classList.toggle("paused", !e.isIntersecting)).observe(wall);
	}
}

function renderTape(d) {
	const coins = (d.coins || []).filter((c) => num(c.price));
	if (!coins.length) { $("lf-tape").parentElement.hidden = true; return; }
	const items = coins.map((c) => `<span><b>${esc(c.asset)}</b>${px(c.price)} &nbsp;<em class="${tone(c.ret_24h_pct)}" style="font-style:normal">${pct(c.ret_24h_pct)}</em> &nbsp;<span class="dim" style="padding:0;border:0">7d ${pct(c.ret_7d_pct, 1)}</span></span>`).join("");
	$("lf-tape").innerHTML = items + items; // doubled for a seamless -50% loop
}

function renderHero(d) {
	const live = d.status === "trading" || d.status === "halted";
	$("lf-dot").className = `lf-dot ${live ? d.status : ""}`;
	$("lf-status").textContent = !live
		? d.status === "warming_up" ? "Warming up · the fund hasn't been seeded yet" : "Offline"
		: d.status === "halted" ? "Halted · drawdown limit or paused; open positions keep their stops"
		: `${d.mode === "live" ? "Live" : "Dry run"} · ${d.model} · updated ${ago(d.updated_at)}`;
	const edge = num(d.return_pct) && num(d.btc_pct) ? d.return_pct - d.btc_pct : null;
	const stat = (v, label, cls = "") => `<div class="lf-stat"><b class="${cls}">${v}</b><span>${label}</span></div>`;
	$("lf-stats").innerHTML = live ? [
		stat(pct(d.return_pct), "AI fund", tone(d.return_pct)),
		stat(pct(d.btc_pct), "Just hold BTC", tone(d.btc_pct)),
		stat(num(edge) ? `${edge >= 0 ? "+" : "−"}${Math.abs(edge).toFixed(1)}` : "—", "Edge, pts", tone(edge)),
		stat(Math.max(1, Math.ceil(d.days_running || 0)), "Days running"),
		stat(d.trades_closed ?? 0, "Trades closed"),
	].join("") : "";
	const flat = !(d.open_positions || []).length;
	$("lf-verdict").textContent = !live || !num(edge) ? ""
		: edge >= 0
			? flat && d.btc_pct < 0
				? `BTC is down ${Math.abs(d.btc_pct).toFixed(1)}% since the start. Staying in cash has kept the AI ${edge.toFixed(1)} points ahead.`
				: `The AI is ${edge.toFixed(1)} points ahead of holding BTC.`
			: `Holding BTC is ${Math.abs(edge).toFixed(1)} points ahead of the AI.`;
}

function renderNow(d) {
	const open = d.open_positions || [];
	$("lf-posture").textContent = d.status === "halted" ? "halted" : open.length ? `long ${open.map((p) => p.asset).join(", ")}` : "flat";
	const latest = (d.journal || [])[0];
	$("lf-journal").innerHTML = latest
		? `<p>${esc(latest.text)}</p><div class="meta">${esc(latest.kind)} · ${/^\d{4}-\d{2}-\d{2}$/.test(latest.at) ? esc(latest.at) : ago(latest.at)}</div>`
		: `<p>The AI hasn't written anything yet. Its first journal entry lands after its first decision.</p>`;
	const s = d.schedule || {};
	const aligned = (d.coins || []).filter((c) => c.aligned).length;
	const tradeable = d.sizing?.tradeable_convictions || [];
	const side = [];
	if (s.next_decision_at) side.push(`<div><span>Next decision</span><b>in ${until(s.next_decision_at)}</b><small>Scheduled at ${(s.decision_hours_utc || []).map((h) => `${String(h).padStart(2, "0")}:05`).join(" &amp; ")} UTC${s.last_decision_at ? `; last ran ${ago(s.last_decision_at)}` : ""}.</small></div>`);
	if ((d.coins || []).length) side.push(`<div><span>Screen</span><b>${aligned} of ${d.coins.length} aligned</b><small>${aligned ? "A fully aligned coin wakes the AI early (if it hasn't run in the last few hours)." : "Nothing passes all three checks, so no early wake-up."}</small></div>`);
	if (tradeable.length && tradeable.length < 3) side.push(`<div><span>Size gate</span><b>${tradeable.join(" / ")} only</b><small>At the fund's current size, a LOW-conviction position would fall under the exchange minimum, so only stronger setups can trade.</small></div>`);
	else if (!tradeable.length && d.status === "trading") side.push(`<div><span>Size gate</span><b>Too small</b><small>Even a HIGH-conviction position would fall under the exchange minimum.</small></div>`);
	if ((d.watching || []).length) side.push(`<div><span>Tripwires</span><b>${WORDS[d.watching.length] || d.watching.length} set</b><small>Price levels that call the AI back early. Listed below.</small></div>`);
	$("lf-side").innerHTML = side.join("");
}

function renderScreen(d) {
	const coins = d.coins || [];
	if (!coins.length) { $("lf-screen").innerHTML = `<div class="lf-coin"><span class="empty" style="padding:0">Market data is loading. Check back in a minute.</span></div>`; return; }
	const pip = (on, label) => `<span class="lf-pip ${on ? "on" : ""}">${label}</span>`;
	$("lf-screen").innerHTML = coins.map((c) => !c.checks ? `<div class="lf-coin"><header><h3>${esc(c.asset)}</h3></header><span class="dim">no data</span></div>` : `
		<div class="lf-coin ${c.aligned ? "aligned" : ""}">
			<header><h3>${esc(c.asset)}</h3><span class="chg ${tone(c.ret_24h_pct)}">${pct(c.ret_24h_pct)}</span></header>
			<div class="row"><span>7d</span><em class="${tone(c.ret_7d_pct)}">${pct(c.ret_7d_pct, 1)}</em></div>
			<div class="row"><span>vs 4h SMA 20/50</span><em>${pct(c.vs_sma20_4h_pct, 1)} / ${pct(c.vs_sma50_4h_pct, 1)}</em></div>
			<div class="row"><span>volume vs 7d</span><em>${num(c.volume_vs_7d_avg) ? c.volume_vs_7d_avg.toFixed(2) + "x" : "—"}</em></div>
			<div class="lf-pips">${pip(c.checks.trend, "Trend")}${pip(c.checks.volume, "Volume")}${pip(c.checks.momentum, "Mom.")}</div>
		</div>`).join("");
	const w = d.watching || [];
	$("lf-levels").innerHTML = !w.length ? "" : `
		<div class="lf-label" style="margin-top:3.5rem">Tripwires the AI set for itself</div>
		<div class="lf-levels" style="margin-top:1rem">${w.map((l) => `
			<div class="lf-level"><span class="a">${esc(l.asset)}</span><span class="p">${l.direction === "above" ? "↑ above" : "↓ below"} ${px(l.price)}</span>
			<span class="why">${esc(l.reason)}</span><span class="dist">${num(l.distance_pct) ? `${pct(l.distance_pct, 1)} away` : ""}</span></div>`).join("")}</div>`;
}

function renderRules(d) {
	const caps = d.sizing?.caps_pct || { LOW: 10, MEDIUM: 15, HIGH: 20 };
	const lim = d.limits || {};
	const rows = [
		["Leverage, margin, shorting", "None"],
		["Coins it may trade", `${(d.universe || []).length || 9} majors`],
		["Open positions", `≤ ${lim.max_positions ?? 3}`],
		["Largest position", `${caps.HIGH}% of fund`],
		["Stop-loss", "0.75–12%"],
		["Target", "≥ 1.5× stop"],
		["Longest hold", lim.max_hold_hours ? `${Math.round(lim.max_hold_hours / 24)} days` : "7 days"],
		["Halts all trading at", `−${lim.max_drawdown_pct ?? 15}%`],
		["Stops can move", "Up only"],
	];
	$("lf-rules").innerHTML = rows.map(([k, v]) => `<div class="lf-rule"><span>${k}</span><b>${v}</b></div>`).join("");
	$("lf-sizing").textContent = `LOW ≤ ${caps.LOW}% of the fund, MEDIUM ≤ ${caps.MEDIUM}%, HIGH ≤ ${caps.HIGH}%. Too little cash for a meaningful entry means “monitor only”.`;
	const s = d.schedule;
	if (s) {
		$("lf-loop-decide").textContent = (s.decision_hours_utc || []).map((h) => `${String(h).padStart(2, "0")}:05`).join(" & ") + " UTC";
		$("lf-loop-watch").textContent = `Every ${s.monitor_minutes} min`;
		$("lf-loop-early").textContent = s.max_early_runs_per_day ? `≤ ${s.max_early_runs_per_day} a day` : "Off";
	}
}

async function loadPublic() {
	try {
		const r = await fetch("/api/ai/kraken/public");
		pub = await r.json();
	} catch { pub = { status: "offline" }; }
	renderWall(pub); renderTape(pub); renderHero(pub); renderNow(pub); renderScreen(pub); renderRules(pub);
	if (desk) renderGrowth();
}

// ── the desk (signal token) ─────────────────────────────────────────────────
async function api(path) {
	const r = await fetch(path, { headers: authHeaders() });
	if (r.status === 401) { clearSignalToken(); throw Object.assign(new Error("That token didn't work."), { locked: true }); }
	const data = await r.json().catch(() => ({}));
	if (!r.ok || data.ok === false) throw new Error(data.error || `Request failed (${r.status})`);
	return data;
}

function showDesk(on) {
	$("lf-desk").hidden = !on;
	$("lf-lock").hidden = on;
}

async function loadDesk({ prompt = false } = {}) {
	if (prompt && !getSignalToken("Long/Flat desk.\nEnter your signal access token:")) return;
	if (!peekSignalToken()) { showDesk(false); return; }
	try { desk = await api("/api/ai/kraken/state"); }
	catch (e) {
		desk = null; showDesk(false);
		if (prompt) $("lf-lock").querySelector("p").textContent = e.locked ? "That token didn't unlock the desk. Try again?" : e.message;
		return;
	}
	showDesk(true);
	renderDesk();
}

function renderDesk() {
	const { fund: f, config: c } = desk;
	const cell = (k, v, cls = "") => `<div><span>${k}</span><b class="${cls}">${v}</b></div>`;
	$("lf-book").innerHTML = f.status !== "active"
		? cell("Fund", f.status === "seeding" ? "Seeding" : "Not funded") + cell("Mode", esc(c.mode)) + cell("Model", esc(c.model))
		: [cell("Equity", usd(f.equity_usd)), cell("Cash", usd(f.cash_usd)), cell("Return", pct(f.return_pct), tone(f.return_pct)),
			cell("BTC", pct(f.btc_pct), tone(f.btc_pct)), cell("Hold coins", pct(f.hold_pct), tone(f.hold_pct)),
			cell("Drawdown", `${(f.drawdown_pct ?? 0).toFixed(1)}%`), cell("Fees", usd(f.fees_paid)),
			cell("Mode", `${esc(c.mode)}${f.halted ? " · halted" : ""}`)].join("");

	const held = new Set(desk.positions.map((p) => p.asset));
	const watched = (f.watchlist || []).map((w) => w.asset);
	if (!deskAsset) deskAsset = desk.positions[0]?.asset || watched[0] || "BTC";
	$("lf-tabs").innerHTML = c.universe.map((a) => `<button class="lf-tab ${held.has(a) ? "held" : ""}" data-asset="${a}" aria-pressed="${a === deskAsset}">${a}${!held.has(a) && watched.includes(a) ? " ◦" : ""}</button>`).join("");
	$("lf-tabs").onclick = (e) => {
		const b = e.target.closest("[data-asset]");
		if (!b) return;
		deskAsset = b.dataset.asset;
		$("lf-tabs").querySelectorAll("[data-asset]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
		drawCandles();
	};
	drawCandles();
	renderGrowth();

	$("lf-positions").innerHTML = !desk.positions.length ? `<div class="empty">No open positions. The fund is in cash.</div>`
		: `<table class="lf-table"><thead><tr><th>Coin</th><th class="r">P&amp;L</th><th class="r">Entry → now</th><th class="r">Stop / target</th><th class="r">Left</th></tr></thead><tbody>${
			desk.positions.map((p) => `<tr><td><span class="sym">${esc(p.asset)}</span><br><span class="dim">${esc(p.conviction)} · ${usd(p.value_usd)}</span></td>
				<td class="r ${tone(p.unrealized_pct)}">${pct(p.unrealized_pct)}</td><td class="r">${px(p.entry_price)} → ${px(p.price)}</td>
				<td class="r">${px(p.stop_loss)} / ${px(p.take_profit)}</td><td class="r">${Math.max(0, p.hours_left).toFixed(0)}h</td></tr>
				<tr><td colspan="5" class="why" style="padding-top:0">${esc(p.thesis)}</td></tr>`).join("")}</tbody></table>`;

	const closed = desk.closed || [];
	const wins = closed.filter((t) => t.pnl_pct > 0).length;
	$("lf-winloss").textContent = closed.length ? `${wins}W · ${closed.length - wins}L` : "";
	$("lf-closed").innerHTML = !closed.length ? `<div class="empty">No closed trades yet.</div>`
		: `<table class="lf-table"><thead><tr><th>Coin</th><th class="r">Result</th><th>Exit</th><th class="r">Closed</th></tr></thead><tbody>${
			closed.slice(0, 12).map((t) => `<tr><td class="sym">${esc(t.asset)}</td><td class="r ${tone(t.pnl_pct)}">${pct(t.pnl_pct)}<br><span class="dim">${usd(t.pnl_usd)}</span></td>
				<td class="dim">${esc(EXIT[t.exit_reason] || t.exit_reason)}</td><td class="r dim">${ago(t.closed_at)}</td></tr>`).join("")}</tbody></table>`;

	const acts = (results) => !results?.length ? "No actions." : results.map((r) =>
		`${esc(String(r.action).toUpperCase())} ${esc(r.asset || "#" + r.trade_id)} → ${esc(r.status)}${r.size_pct != null ? ` · ${r.size_pct}% · stop ${r.stop_loss_pct}% · target ${r.take_profit_pct}%` : ""}${r.reason ? ` · ${esc(r.reason)}` : ""}`).join("<br>");
	$("lf-log").innerHTML = !desk.decisions.length ? `<div class="empty">No decisions yet.</div>` : desk.decisions.map((d) => `
		<article><div class="meta">${ago(d.at)} · ${esc(d.mode)}${d.error ? ` · <span class="down">${esc(d.error)}</span>` : ""}</div>
		${d.journal ? `<p>${esc(d.journal)}</p>` : ""}${d.market_note ? `<p class="dim" style="font-size:.95rem">${esc(d.market_note)}</p>` : ""}
		<div class="acts">${acts(d.results)}</div></article>`).join("");

	const e = f.last_email;
	$("lf-email").className = `lf-note ${e && !e.ok ? "warn" : ""}`;
	$("lf-email").textContent = !e ? "Email: nothing sent yet." : e.ok ? `Last email ${ago(e.at)}: sent (${e.subject}).` : `Last email ${ago(e.at)} FAILED: ${e.error}`;
}

const chartOpts = (el, height) => ({
	width: el.clientWidth, height,
	layout: { background: { color: "transparent" }, textColor: "rgba(243,236,224,0.45)", fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 11 },
	grid: { vertLines: { color: "rgba(243,236,224,0.04)" }, horzLines: { color: "rgba(243,236,224,0.04)" } },
	rightPriceScale: { borderColor: "rgba(243,236,224,0.1)" },
	timeScale: { borderColor: "rgba(243,236,224,0.1)", timeVisible: true },
	crosshair: { mode: 1 },
});
function sizeOnResize(chart, el) {
	new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth })).observe(el);
}
const sma = (rows, n) => rows.map((r, i) => (i < n - 1 ? null : { time: r.time, value: rows.slice(i - n + 1, i + 1).reduce((s, x) => s + x.close, 0) / n })).filter(Boolean);

async function drawCandles() {
	const el = $("lf-candles");
	const asset = deskAsset;
	if (!window.LightweightCharts) { el.innerHTML = `<div class="empty">Chart library didn't load.</div>`; return; }
	let data;
	try { data = await api(`/api/ai/kraken/candles?asset=${encodeURIComponent(asset)}`); }
	catch (e) { el.innerHTML = `<div class="empty">${esc(e.message)}</div>`; return; }
	if (asset !== deskAsset) return; // a newer tab was clicked
	if (candleChart) { candleChart.remove(); candleChart = null; }
	el.innerHTML = "";
	const rows = data.candles || [];
	if (!rows.length) { el.innerHTML = `<div class="empty">No candles for ${esc(asset)}.</div>`; return; }
	candleChart = LightweightCharts.createChart(el, chartOpts(el, el.clientHeight));
	const s = candleChart.addCandlestickSeries({
		upColor: "#7ee8b0", downColor: "#ff7a93", borderVisible: false, wickUpColor: "rgba(126,232,176,.7)", wickDownColor: "rgba(255,122,147,.7)",
		priceFormat: { type: "price", precision: rows.at(-1).close >= 100 ? 2 : 4, minMove: rows.at(-1).close >= 100 ? 0.01 : 0.0001 },
	});
	s.setData(rows.map(({ time, open, high, low, close }) => ({ time, open, high, low, close })));
	const line = (color, n) => candleChart.addLineSeries({ color, lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false }).setData(sma(rows, n));
	line("#abf8fe", 20);
	line("#ed6ff5", 50);
	const level = (price, color, title) => s.createPriceLine({ price, color, lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title });
	for (const w of desk.fund.watchlist || []) if (w.asset === asset) level(w.price, "#f2b84b", `watch ${w.direction === "above" ? "↑" : "↓"}`);
	for (const p of desk.positions) if (p.asset === asset) {
		level(p.entry_price, "rgba(243,236,224,.6)", "entry");
		level(p.stop_loss, "#ff7a93", "stop");
		level(p.take_profit, "#7ee8b0", "target");
	}
	candleChart.timeScale().fitContent();
	sizeOnResize(candleChart, el);
}

function renderGrowth() {
	const el = $("lf-growth");
	const curve = pub?.curve || [];
	if (!window.LightweightCharts || curve.length < 2) { el.innerHTML = `<div class="empty">The growth chart fills in after the first daily snapshot.</div>`; return; }
	if (growthChart) { growthChart.remove(); growthChart = null; }
	el.innerHTML = "";
	growthChart = LightweightCharts.createChart(el, { ...chartOpts(el, el.clientHeight), timeScale: { borderColor: "rgba(243,236,224,0.1)" } });
	const today = new Date().toISOString().slice(0, 10);
	const byDay = {};
	for (const c of curve) byDay[c.day === "now" ? today : c.day] = { ...c, day: c.day === "now" ? today : c.day };
	const rows = Object.values(byDay).sort((a, b) => a.day.localeCompare(b.day));
	const add = (key, color, width) => growthChart.addLineSeries({ color, lineWidth: width, priceLineVisible: false })
		.setData(rows.filter((r) => r[key] != null).map((r) => ({ time: r.day, value: r[key] })));
	add("hold", "rgba(243,236,224,0.36)", 1);
	add("btc", "#f2b84b", 2);
	add("ai", "#abf8fe", 3);
	growthChart.timeScale().fitContent();
	sizeOnResize(growthChart, el);
}

// ── boot ────────────────────────────────────────────────────────────────────
$("lf-unlock").addEventListener("click", () => loadDesk({ prompt: true }));
$("lf-lockout").addEventListener("click", () => {
	clearSignalToken(); desk = null;
	if (candleChart) { candleChart.remove(); candleChart = null; }
	if (growthChart) { growthChart.remove(); growthChart = null; }
	showDesk(false);
});
if (reduceMotion) $("lf-wall").classList.add("paused");

// The chart library loads with `defer`; module scripts also run after parsing, but order it explicitly.
const ready = window.LightweightCharts ? Promise.resolve() : new Promise((r) => window.addEventListener("load", r, { once: true }));
(async () => {
	await loadPublic();
	await ready;
	await loadDesk();
})();
setInterval(() => { loadPublic(); if (desk) loadDesk(); }, 5 * 60_000);
