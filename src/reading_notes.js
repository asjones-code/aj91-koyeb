// /reading-notes: UI for the Kindle highlights RAG (backend: kindle/index.js).
const API = String(process.env.API_ORIGIN || "").trim().replace(/\/$/, "");
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

let mode = "advice";

// ——— Stats ———
async function loadStats() {
	try {
		const res = await fetch(`${API}/api/kindle/stats`);
		if (!res.ok) throw new Error(res.status);
		const s = await res.json();
		const span = s.firstYear && s.lastYear ? s.lastYear - s.firstYear + 1 : null;
		const set = (k, v) => document.querySelectorAll(`[data-stat="${k}"]`).forEach((el) => (el.textContent = v));
		set("highlights", (s.highlights + s.notes).toLocaleString());
		set("books", s.books.toLocaleString());
		set("authors", s.authors.toLocaleString());
		if (span) {
			set("span", span);
			set("years", `${span} years`);
			set("firstYear", s.firstYear);
		}

		const years = Object.keys(s.perYear).map(Number).sort((a, b) => a - b);
		const max = Math.max(...years.map((y) => s.perYear[y]));
		$("#rn-years").innerHTML = years
			.map((y) => `<div style="height:${Math.max(4, (s.perYear[y] / max) * 100)}%" data-tip="${y}: ${s.perYear[y]}"></div>`)
			.join("");
		$("#rn-years-axis").innerHTML = `<span>${years[0]}</span><span>${years[years.length - 1]}</span>`;

		$("#rn-top").innerHTML = s.topBooks
			.map((b) => `<li><span>${esc(b.title)}${b.author ? ` — ${esc(b.author)}` : ""}</span><span>${b.count}</span></li>`)
			.join("");
		$("#rn-engine").textContent = s.generative
			? "A language model is connected: answers are generated from the retrieved passages."
			: "Running in retrieval-only mode: you get the passages and books directly, no model in the loop.";
	} catch {
		$("#rn-engine").textContent = "The reading notes are offline right now.";
	}
}

// ——— Ask ———
function setMode(m) {
	mode = m;
	document.querySelectorAll(".rn-mode").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
	$("#rn-q").placeholder =
		m === "books"
			? "I want to understand why I can't focus anymore"
			: m === "surprise"
				? "No question needed: press Ask for a random passage"
				: "How do I stay focused when everything is pulling at my attention?";
	if (m === "surprise") ask();
}

function quoteCard(q) {
	const isNote = q.kind === "note";
	const meta = [q.location && `loc. ${q.location}`, q.year].filter(Boolean).join(" · ");
	return `<article class="rn-quote${isNote ? " note" : ""}">
		<blockquote>${isNote ? '<span class="rn-tag">my note</span>' : ""}${esc(q.text)}</blockquote>
		<div class="rn-cite">${esc(q.book)}${q.author ? ` — ${esc(q.author)}` : ""}${meta ? `<i>${esc(meta)}</i>` : ""}</div>
	</article>`;
}

function bookCard(b) {
	return `<article class="rn-book">
		<h3>${esc(b.title)}</h3>
		${b.author ? `<div class="by">${esc(b.author)}</div>` : ""}
		<div class="n">${b.highlights} highlight${b.highlights === 1 ? "" : "s"} · ${b.matches} on this topic</div>
		<p>“${esc(b.quote)}”</p>
	</article>`;
}

function render(data) {
	const parts = [];
	if (data.answer) parts.push(`<div class="rn-answer">${esc(data.answer)}</div>`);
	if (data.mode === "books" && data.books.length) {
		parts.push(`<div class="rn-h">Books to read</div><div class="rn-books">${data.books.map(bookCard).join("")}</div>`);
	}
	if (data.quotes.length) {
		parts.push(`<div class="rn-h">${data.mode === "surprise" ? "From the archive" : "Passages"}</div><div class="rn-quotes">${data.quotes.map(quoteCard).join("")}</div>`);
	}
	if (data.mode === "advice" && data.books.length) {
		parts.push(`<div class="rn-h">Go deeper</div><div class="rn-books">${data.books.map(bookCard).join("")}</div>`);
	}
	$("#rn-out").innerHTML = parts.join("") || `<p class="rn-status">Nothing in the notes matches that yet. Try different words.</p>`;
}

async function ask() {
	const question = $("#rn-q").value.trim();
	if (mode !== "surprise" && !question) {
		$("#rn-q").focus();
		return;
	}
	const btn = $("#rn-go");
	btn.disabled = true;
	$("#rn-out").innerHTML = `<p class="rn-status">Searching ${mode === "surprise" ? "the archive" : "the highlights"}…</p>`;
	try {
		const res = await fetch(`${API}/api/kindle/ask`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ question, mode }),
		});
		const data = await res.json().catch(() => ({}));
		if (!res.ok) throw new Error(data.error || "Something went wrong.");
		render(data);
	} catch (err) {
		$("#rn-out").innerHTML = `<p class="rn-status">${esc(err.message)}</p>`;
	} finally {
		btn.disabled = false;
	}
}

document.querySelectorAll(".rn-mode").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
$("#rn-form").addEventListener("submit", (e) => {
	e.preventDefault();
	ask();
});
$("#rn-suggest").addEventListener("click", (e) => {
	if (e.target.tagName !== "BUTTON") return;
	$("#rn-q").value = e.target.textContent;
	if (mode === "surprise") setMode("advice");
	ask();
});

loadStats();
