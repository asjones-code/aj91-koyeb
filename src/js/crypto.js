/**
 * AI Trader (/crypto): public overview from /api/ai/kraken/public (percentages only).
 * Unlocking (signal token) opens the private terminal at /crypto/terminal.
 */
import { getSignalToken, peekSignalToken, clearSignalToken, authHeaders } from "./signal-token.js";

const TERMINAL = "/crypto/terminal";

const $ = (id) => document.getElementById(id);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (n) => typeof n === "number" && Number.isFinite(n);
const pct = (n, d = 2) => (num(n) ? `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(d)}%` : "—");
const tone = (n) => (num(n) ? (n >= 0 ? "up" : "down") : "");
const px = (n) => (num(n) ? (n >= 100 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : n >= 1 ? n.toLocaleString("en-US", { maximumFractionDigits: 3 }) : n.toPrecision(4)) : "—");
const ago = (iso) => {
	const m = (Date.now() - new Date(iso).getTime()) / 60000;
	return m < 60 ? `${Math.max(1, Math.round(m))}m ago` : m < 2880 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};
const until = (iso) => {
	const m = Math.max(0, (new Date(iso).getTime() - Date.now()) / 60000);
	return m < 60 ? `${Math.round(m)}m` : `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, "0")}m`;
};
const STRUCT = { up: "↑ HH / HL", down: "↓ LH / LL", range: "↔ range" };
const WORDS = ["none", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let pub = null; // public payload

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
			<div class="row"><span>4h SMA 20/50</span><em>${pct(c.vs_sma20_4h_pct, 1)} / ${pct(c.vs_sma50_4h_pct, 1)}</em></div>
			<div class="row"><span>volume vs 7d</span><em>${num(c.volume_vs_7d_avg) ? c.volume_vs_7d_avg.toFixed(2) + "x" : "—"}</em></div>
			${c.structure ? `<div class="row"><span>4h structure</span><em>${STRUCT[c.structure.trend] || esc(c.structure.trend)}</em></div>` : ""}
			${c.structure?.spring || c.structure?.upthrust ? `<div class="row"><span>false break</span><em class="${c.structure.spring ? "up" : "down"}">${[c.structure.spring && "spring", c.structure.upthrust && "upthrust"].filter(Boolean).join(" + ")}</em></div>` : ""}
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
	const sc = d.schedule || {};
	const hours = (sc.decision_hours_utc || [13, 21]).map((h) => `${String(h).padStart(2, "0")}:05`).join(" & ");
	const rows = [
		["Decides", `${hours} UTC`],
		["Checks stops & levels", `every ${sc.monitor_minutes ?? 15} min`],
		["Early wake-ups", sc.max_early_runs_per_day ? `≤ ${sc.max_early_runs_per_day} / day` : "off"],
		["Leverage / shorting", "none"],
		["Coins", `${(d.universe || []).length || 9} majors`],
		["Open positions", `≤ ${lim.max_positions ?? 3}`],
		["Largest position", `${caps.HIGH}%`],
		["Longest hold", lim.max_hold_hours ? `${Math.round(lim.max_hold_hours / 24)} days` : "7 days"],
		["Halts at drawdown", `−${lim.max_drawdown_pct ?? 15}%`],
	];
	$("lf-rules").innerHTML = rows.map(([k, v]) => `<div class="lf-rule"><span>${k}</span><b>${v}</b></div>`).join("");
	$("lf-sizing").textContent = `LOW ≤ ${caps.LOW}% of the fund, MEDIUM ≤ ${caps.MEDIUM}%, HIGH ≤ ${caps.HIGH}%. No meaningful size, no entry.`;
}

async function loadPublic() {
	try {
		const r = await fetch("/api/ai/kraken/public");
		pub = await r.json();
	} catch { pub = { status: "offline" }; }
	renderWall(pub); renderTape(pub); renderHero(pub); renderNow(pub); renderScreen(pub); renderRules(pub);
}

// ── unlock → the terminal (signal token) ──────────────────────────────────
// The token is checked against a private endpoint first, so a typo doesn't land on a locked terminal.
async function unlock() {
	const msg = $("lf-lock").querySelector("p");
	if (!getSignalToken("AI Trader terminal.\nEnter your signal access token:")) return;
	const r = await fetch("/api/ai/kraken/state", { headers: authHeaders() }).catch(() => null);
	if (r?.ok) { location.href = TERMINAL; return; }
	if (r?.status === 401) clearSignalToken();
	msg.textContent = r?.status === 401 ? "That token didn't work. Try again?" : "Couldn't reach the server. Try again in a moment.";
}

// ── boot ────────────────────────────────────────────────────────────────────
$("lf-unlock").addEventListener("click", unlock);
if (peekSignalToken()) $("lf-unlock").textContent = "Open terminal";
if (reduceMotion) $("lf-wall").classList.add("paused");
loadPublic();
setInterval(loadPublic, 5 * 60_000);
