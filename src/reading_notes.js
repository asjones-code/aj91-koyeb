// Marginalia (/marginalia, /reading-notes): UI for the Kindle highlights RAG (backend: kindle/index.js).
const API = String(process.env.API_ORIGIN || "").trim().replace(/\/$/, "");
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Escape first, then allow only **bold**, *italic*, and [n] citations that jump to the passage.
const inlineMd = (s) =>
	esc(s)
		.replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
		.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
		.replace(/\[(\d{1,2}(?:\s*[,–-]\s*\d{1,2})*)\]/g, (_, list) =>
			list
				.split(/\s*[,–-]\s*/)
				.map((n) => `<a class="cp-cite" href="#cp-q${n}" data-q="${n}">${n}</a>`)
				.join(""),
		);

const NUM_WORDS = ["", "", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"];

// Deterministic, muted colour per title for books without a cover image.
function hue(str) {
	let h = 0;
	for (const c of str) h = (h * 31 + c.charCodeAt(0)) % 360;
	return h;
}
function cover(book) {
	const h = hue(book.title || "");
	const fallback = `<div class="cover-fallback" style="background:linear-gradient(160deg,hsl(${h} 32% 26%),hsl(${(h + 40) % 360} 38% 12%))"><b>${esc(book.title)}</b><span>${esc(book.author || "")}</span></div>`;
	if (!book.cover) return `<div class="cover">${fallback}</div>`;
	// Open Library returns a 1x1 image when it has nothing; treat tiny images as missing.
	return `<div class="cover">${fallback}<img src="${esc(book.cover)}" alt="" loading="lazy" onload="if(this.naturalWidth<10)this.remove()" onerror="this.remove()"></div>`;
}

// Suggested questions: a fixed pool, each pre-checked to return strong matches from the
// highlights (BM25 only, no model). Shuffled client-side, so rotating them costs nothing.
const SUGGESTIONS = [
	"How do I deal with fear of failure?", "What makes a good leader?", "Building something from nothing",
	"Solitude at sea", "How do I get my attention back?", "What does it mean to live a good life?",
	"How should I think about money?", "How do I make better decisions?", "How do I start a company?",
	"Finding product–market fit", "How do I handle uncertainty?", "Learning to sail across an ocean",
	"How do I build discipline?", "How do communities govern themselves?", "Imagining a better society",
	"What did colonialism take from Africa?", "Black identity and the diaspora", "Yoruba spirituality and Ifá",
	"Growing your own food", "How to live closer to the land", "The internet and our minds",
	"What makes work meaningful?", "Plant medicine and consciousness", "Healing from trauma",
	"Raising children well", "How to be alone without being lonely", "Meaning in suffering",
	"How do I change my habits?", "On death and dying", "What does it mean to be free of distraction?",
	"How do I talk to people better?", "Designing products people love", "Revolution and change",
	"Utopian communities that worked", "Order and chaos", "What is the value of boredom?",
];
let shown = [];
function shuffleSuggestions() {
	const fresh = SUGGESTIONS.filter((q) => !shown.includes(q));
	for (let i = fresh.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[fresh[i], fresh[j]] = [fresh[j], fresh[i]];
	}
	shown = fresh.slice(0, 5);
	$("#cp-suggest").innerHTML =
		shown.map((q, i) => `<button type="button" style="animation-delay:${i * 60}ms">${esc(q)}</button>`).join("") +
		'<button type="button" class="cp-more" data-more aria-label="Show other questions">↻ more</button>';
}

let mode = "advice";

// ——— Stats, cover wall, shelf ———
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
			set("span-words", `across ${NUM_WORDS[span] || span} years`);
			set("firstYear", s.firstYear);
		}

		const years = Object.keys(s.perYear).map(Number).sort((a, b) => a - b);
		const max = Math.max(...years.map((y) => s.perYear[y]));
		$("#cp-years").innerHTML = years
			.map((y) => `<div style="height:${Math.max(4, (s.perYear[y] / max) * 100)}%" data-tip="${y} · ${s.perYear[y]}"></div>`)
			.join("");
		$("#cp-years-axis").innerHTML = `<span>${years[0]}</span><span>${years[years.length - 1]}</span>`;

		const wall = s.coverWall || [];
		if (wall.length) {
			const tiles = Array.from({ length: 48 }, (_, i) => wall[i % wall.length]);
			$("#cp-wall").innerHTML = tiles
				.map((b, i) => `<img src="${esc(b.cover)}" alt="" loading="lazy" style="transition-delay:${(i % 12) * 40}ms" onload="if(this.naturalWidth>10)this.classList.add('on')">`)
				.join("");
		}

		$("#cp-top").innerHTML = s.topBooks
			.map(
				(b) => `<article class="cp-book">${cover(b)}<div><h3>${esc(b.title)}</h3>${b.author ? `<div class="by">${esc(b.author)}</div>` : ""}</div><div class="n">${b.count} lines</div></article>`,
			)
			.join("");
		$("#cp-engine").textContent = s.generative
			? "A language model is connected: replies are written from the retrieved passages, and every claim cites one."
			: "Running retrieval-only: you get the passages and the books directly, no model in the loop.";
	} catch {
		$("#cp-engine").textContent = "The library is closed right now.";
	}
}

// ——— Ask ———
function setMode(m) {
	mode = m;
	document.querySelectorAll(".cp-mode").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
	$("#cp-q").placeholder =
		m === "books"
			? "I want to understand why I can't focus anymore"
			: m === "surprise"
				? "No question needed. Press Ask."
				: "How do I stay focused when everything pulls at me?";
	if (m === "surprise") ask();
}

function quoteCard(q, i) {
	const isNote = q.kind === "note";
	const meta = [q.year, q.location && `loc. ${q.location}`].filter(Boolean).join(" · ");
	return `<article class="cp-quote" id="cp-q${i + 1}">
		${cover({ title: q.book, author: q.author, cover: q.cover })}
		<div>
			<blockquote><span class="n">${i + 1}</span>${isNote ? '<span class="cp-note-tag">my note</span>' : ""}${esc(q.text)}</blockquote>
			<div class="cp-by">${esc(q.book)}${q.author ? `, ${esc(q.author)}` : ""}${meta ? `<small>${esc(meta)}</small>` : ""}</div>
		</div>
	</article>`;
}

function bookCard(b) {
	return `<article class="cp-book">
		${cover(b)}
		<div><h3>${esc(b.title)}</h3>${b.author ? `<div class="by">${esc(b.author)}</div>` : ""}</div>
		<div class="n">${b.matches} of ${b.highlights} lines on this</div>
		<p>“${esc(b.quote)}”</p>
	</article>`;
}

function render(data) {
	const parts = [];
	if (data.answer) {
		const paras = data.answer.split(/\n{2,}|\n(?=\S)/).filter((p) => p.trim());
		parts.push(`<div class="cp-answer"><div class="cp-label"><b>Reply</b> &nbsp;·&nbsp; built from the passages below</div>${paras.map((p) => `<p>${inlineMd(p.trim())}</p>`).join("")}</div>`);
	}
	if (data.mode === "books" && data.books.length) {
		parts.push(`<div class="cp-section"><span class="cp-label">On the shelf</span><div class="cp-shelf">${data.books.map(bookCard).join("")}</div></div>`);
	}
	if (data.quotes.length) {
		parts.push(`<div class="cp-section"><span class="cp-label">${data.mode === "surprise" ? "Opened at random" : "Passages"}</span><div class="cp-quotes">${data.quotes.map(quoteCard).join("")}</div></div>`);
	}
	if (data.mode === "advice" && data.books.length) {
		parts.push(`<div class="cp-section"><span class="cp-label">Go deeper</span><div class="cp-shelf">${data.books.map(bookCard).join("")}</div></div>`);
	}
	$("#cp-out").innerHTML = parts.join("") || `<p class="cp-status err">Nothing in the library speaks to that yet. Try other words.</p>`;
}

async function ask() {
	const question = $("#cp-q").value.trim();
	if (mode !== "surprise" && !question) {
		$("#cp-q").focus();
		return;
	}
	const btn = $("#cp-go");
	btn.disabled = true;
	$("#cp-out").innerHTML = `<p class="cp-status">${mode === "surprise" ? "Pulling a book off the shelf…" : "Reading through the margins…"}</p>`;
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
		$("#cp-out").innerHTML = `<p class="cp-status err">${esc(err.message)}</p>`;
	} finally {
		btn.disabled = false;
	}
}

document.querySelectorAll(".cp-mode").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
$("#cp-form").addEventListener("submit", (e) => {
	e.preventDefault();
	ask();
});
$("#cp-suggest").addEventListener("click", (e) => {
	if (e.target.tagName !== "BUTTON") return;
	if (e.target.dataset.more !== undefined) return shuffleSuggestions();
	$("#cp-q").value = e.target.textContent;
	if (mode === "surprise") setMode("advice");
	ask();
});
// Citation chips: smooth-scroll to the passage and flash it.
$("#cp-out").addEventListener("click", (e) => {
	const a = e.target.closest(".cp-cite");
	if (!a) return;
	e.preventDefault();
	const el = document.getElementById(`cp-q${a.dataset.q}`);
	if (!el) return;
	el.scrollIntoView({ behavior: "smooth", block: "center" });
	el.classList.add("flash");
	setTimeout(() => el.classList.remove("flash"), 1400);
});

// Pause the cover-wall animation while the hero is off-screen.
const wall = $("#cp-wall");
if (wall && "IntersectionObserver" in window) {
	new IntersectionObserver(([entry]) => wall.classList.toggle("paused", !entry.isIntersecting)).observe(wall);
}

shuffleSuggestions();
loadStats();
