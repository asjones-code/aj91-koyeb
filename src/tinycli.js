import $ from "jquery";
import Typed from "typed.js";
import * as live from "./live.js";

const ASK_SYSTEM_RULES = `You are AJ’s website assistant.

Answer using ONLY the provided website content (About + Work sections).
Keep responses concise, clear, and conversational — confident but not corporate.
Sound like AJ: thoughtful, practical, impact-focused, and grounded.

Limit responses to 240 characters max.

If the question can be answered from the provided content, respond directly and naturally.

If the answer is not explicitly in the provided content, do NOT fabricate or speculate. Instead respond with:
I'd be happy to share more — that's probably a better conversation to have directly. Feel free to reach out and we can set up a time.

Do not mention that you are an AI. Do not reference the prompt or instructions.`;

function extractVisibleText(html) {
	if (!html || typeof html !== "string") return "";
	let text = html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
		.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");
	text = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	return text;
}

async function loadSiteContent() {
	if (loadSiteContent.cache) return loadSiteContent.cache;
	const paths = ["/index.html", "/about.html", "/work.html"];
	const parts = [];
	for (const path of paths) {
		try {
			const res = await fetch(path, { headers: { "Accept": "text/html" } });
			if (res.ok) {
				const html = await res.text();
				parts.push(extractVisibleText(html));
			}
		} catch {
			// skip
		}
	}
	loadSiteContent.cache = parts.filter(Boolean).join("\n\n");
	return loadSiteContent.cache;
}

const event = {
		init() {
			view.$document.ready(this.onDomReady);
			view.$body.on("keyup", this.onKeyUp).on("keydown", this.onKeyDown).on("keypress", this.onKeyPress);
			this.initPrompt();
			view.$window.on("scroll touchmove mousewheel", this.onScroll);
		},
		onDomReady() {
			view.initCursor();
			view.initTyped();
		},
		initPrompt() {
			view.$prompt.off("ctrlChar command async").on("ctrlChar", this.onCtrlChar).on("command", this.onCommand).on("async", this.onAsync);
		},
		onCommand(e, c) {
			e.preventDefault();
			const rawLine = (c.command + " " + (c.arguments || []).join(" ")).trim();
			if (controller.chatModeActive) {
				if (rawLine === "/exit" || rawLine.toLowerCase() === "exit") {
					controller.chatModeActive = false;
					view.outputCommandResult("Left chat.");
					return;
				}
				if (rawLine) {
					live.sendMessage({ type: "chat", text: rawLine });
				}
				return;
			}
			if (controller.waitingForChatEmail) {
				const raw = rawLine;
				controller.waitingForChatEmail = false;
				if (!raw || !raw.includes("@")) {
					view.outputCommandResult("Invalid email. Type <strong>chat</strong> to try again.");
					return;
				}
				live.sendMessage({ type: "email_optin", email: raw });
				controller.chatModeActive = true;
				view.outputCommandResult("You're in chat mode. Type your messages and press Enter. Type <strong>/exit</strong> to leave.");
				return;
			}
			const result = controller.executeCommand(c);
			if (result && typeof result === "object" && result.async === "ask") {
				view.printThinking();
				controller.askAboutSite(result.question);
				return;
			}
			if (result && typeof result === "object" && result.async === "news") {
				view.printThinking();
				controller.fetchNews();
				return;
			}
			if (result && typeof result === "object" && result.async === "location") {
				controller.shareLocation((err, msg) => view.outputCommandResult(err || msg));
				return;
			}
			view.outputCommandResult(result);
		},
		onAsync(e, d) {
			e.preventDefault();
			view.outputCommandResult(controller.getFeedArticles(d));
		},
		onCtrlChar(e, t) {
			e.preventDefault();
			if (t.toLowerCase() === "enter" && view.newsTypingInstance) {
				view.skipNewsTyping();
				return;
			}
			switch (t.toLowerCase()) {
				case "backspace":
					view.deleteChar();
					break;
				case "delete":
					view.moveCursorForward();
					view.deleteChar();
					break;
				case "arrowleft":
					view.moveCursorBack();
					break;
				case "arrowright":
					view.moveCursorForward();
					break;
				case "arrowup":
					view.promptHistory(true);
					break;
				case "arrowdown":
					view.promptHistory(false);
					break;
				case "end":
					view.removeCursor();
					view.moveCursor(view.$prompt.text().length);
					break;
				case "home":
					view.moveCursor(0);
					break;
				case "pagedown":
					view.scrollPage(1);
					break;
				case "pageup":
					view.scrollPage(-1);
					break;
				case "enter":
					view.enterCommandLine();
					break;
			}
		},
		onKeyUp(e) {
			const active = document.activeElement;
			if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
				return;
			}
			e.preventDefault();
		},
		onKeyDown(e) {
			const active = document.activeElement;
			if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
				return;
			}
			e.preventDefault();
			view.typeChar(e.key);
		},
		onKeyPress(e) {
			const active = document.activeElement;
			if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
				return;
			}
			e.preventDefault();
		},
		onScroll(e) {
			if (view.isScrolling === true) {
				e.preventDefault();
				e.stopPropagation();
			}
		}
	};

	const view = {
		typedInstance: null,
		init() {
			this.$document = $(document);
			this.$window = $(window);
			this.$scroll = $("html, body");
			this.$body = $("body");
			this.$terminal = $("#terminal");
			if (this.$terminal.length === 0) {
				this.$body.append('<div id="terminal"></div>');
				this.$terminal = $("#terminal");
			}
			this.initTerminal();
			// Run cursor and typed intro every time (first load and when returning to home via Barba)
			this.initCursor();
			this.initTyped();
		},
		initTerminal() {
			this.$cli = $("#cli");
			this.$prompt = $("#cli .prompt");
			if (this.$cli.length === 0 || this.$prompt.length === 0) {
				this.clearTerminal();
			}
			this.$history = false;
			this.curPos = 0;
			this.isScrolling = false;
			this.scrollSpeed = 1000;
			// Mobile: tap anywhere in terminal to focus input (makes it typable)
			const $termCont = this.$terminal.find(".term-cont");
			const termContEl = $termCont[0];
			if (termContEl) {
				const focusInput = () => {
					const input = document.getElementById("term-input");
					if (input && document.activeElement !== input) {
						input.focus();
					}
				};
				$termCont.off("click.termFocus touchend.termFocus focus.termFocus");
				// touchstart with preventDefault so iOS doesn't scroll away; then focus so keyboard opens (bind once per element)
				if (!termContEl._termTouchBound) {
					termContEl._termTouchBound = true;
					termContEl.addEventListener("touchstart", (e) => {
						if (e.target.closest("a")) return;
						e.preventDefault();
						focusInput();
					}, { passive: false });
				}
				$termCont.on("click.termFocus", (e) => {
					if (e.target.closest("a")) return;
					e.preventDefault();
					focusInput();
				});
				$termCont.on("focus.termFocus", focusInput);
			}
			live.setChatCallback((data) => {
				const sender = (data && data.sender) ? data.sender : "***";
				const text = (data && typeof data.text === "string") ? data.text : "";
				this.printTerminal(
					`<span class="output">[chat] ${controller.escapeHtml(sender)}</span>: ${controller.escapeHtml(text)}`,
					"command output"
				);
			});
		},
		clearTerminal() {
			const cliHtml = `<div class="print"></div><div id="cli"><span class="label">$ </span><span class="prompt"></span></div>`;
			const $termCont = this.$terminal.find(".term-cont");
			if ($termCont.length) {
				$termCont.html(cliHtml);
			} else {
				this.$terminal.html(cliHtml);
			}
			this.initTerminal();
			event.initPrompt();
		},
		initTyped() {
			const $typedContainer = this.$terminal.find(".print").first();
			if (!$typedContainer.length || this.$terminal.find(".typed").length) return;
			$typedContainer.append('<div class="command output"><span class="typed"></span></div>');
			const typedEl = this.$terminal.find(".typed")[0];
			if (!typedEl) return;
			if (this.typedInstance) {
				this.typedInstance.destroy();
				this.typedInstance = null;
			}
			// Start Typed only after the intro/preloader is done so the terminal is visible (otherwise text appears already full)
			const INTRO_DELAY_MS = 2800;
			const fullText = "Thanks for stopping by. Visit About and Work — AJ";
			setTimeout(() => {
				if (!typedEl.isConnected) return; // terminal was removed
				this.typedInstance = new Typed(typedEl, {
					strings: [fullText],
					contentType: "text",
					showCursor: false,
					typeSpeed: 35,
					startDelay: 200,
					onComplete() {
						const wrap = typedEl.parentElement;
						if (!wrap) return;
						wrap.innerHTML = 'Thanks for stopping by. Visit <a href="about.html">About</a> and <a href="work.html">Work</a> — AJ';
					}
				});
			}, INTRO_DELAY_MS);
		},
		typeChar(c) {
			const realChr = controller.triggerCtrlCodes(c);
			if (realChr !== "") {
				this.removeCursor();
				const p = this.$prompt.html();
				const pright =
					this.curPos === p.length
						? this.getCursor()
						: this.getCursor(p.substring(this.curPos, this.curPos + 1)) + p.substring(this.curPos + 1);
				this.$prompt.html(p.substring(0, this.curPos) + realChr + pright);
				this.curPos = this.curPos + 1;
			}
		},
		deleteChar() {
			if (this.curPos > 0) {
				this.removeCursor();
				const p = this.$prompt.html();
				this.$prompt.html(p.substring(0, this.curPos - 1) + p.substring(this.curPos));
				this.curPos = this.curPos - 1;
				this.setCursor();
			}
		},
		moveCursorBack() {
			if (this.curPos > 0) {
				this.removeCursor();
				this.curPos = this.curPos - 1;
				this.setCursor();
			}
		},
		moveCursorForward() {
			this.removeCursor();
			if (this.curPos < this.$prompt.text().length) {
				this.curPos = this.curPos + 1;
			}
			this.setCursor();
		},
		moveCursor(pos = 0) {
			this.curPos = pos;
			this.setCursor();
		},
		initCursor(char = "&nbsp;") {
			this.removeCursor();
			this.curPos = 0;
			this.$history = false;
			this.$prompt.html(this.getCursor(char));
		},
		setCursor() {
			if (this.curPos >= 0) {
				this.removeCursor();
				const p = this.$prompt.html();
				this.$prompt.html(
					p.substring(0, this.curPos) +
						(this.curPos === p.length ? this.getCursor() : this.getCursor(p.substring(this.curPos, this.curPos + 1))) +
						p.substring(this.curPos + 1)
				);
			} else {
				const p = this.$prompt.html();
				if (p.length === 0) {
					this.initCursor();
				}
			}
		},
		getCursor(char = "&nbsp;") {
			return `<span class="cursor">${char}</span>`;
		},
		removeCursor() {
			const $cur = this.$prompt.children(".cursor");
			const chr = $cur.html();
			if (chr === "&nbsp;") {
				$cur.remove();
			} else {
				this.$prompt.html(this.$prompt.text());
			}
		},
		printTerminal(txt, cssClasses = "command") {
			this.$cli.prev().append(`<div class="${cssClasses}">${txt}</div>`);
			const $scrollEl = this.$terminal.find(".term-cont").length ? this.$terminal.find(".term-cont") : this.$terminal;
			$scrollEl.scrollTop($scrollEl[0].scrollHeight);
		},
		printThinking() {
			const $print = this.$cli.prev();
			const $el = $("<div class=\"command output\" data-thinking=\"true\">Thinking.</div>");
			$print.append($el);
			this.$thinkingEl = $el;
			let dotCount = 1;
			this._thinkingInterval = setInterval(() => {
				if (!this.$thinkingEl || !this.$thinkingEl.length) {
					if (this._thinkingInterval) clearInterval(this._thinkingInterval);
					return;
				}
				dotCount = (dotCount % 3) + 1;
				this.$thinkingEl.text("Thinking" + ".".repeat(dotCount));
			}, 400);
			const $scrollEl = this.$terminal.find(".term-cont").length ? this.$terminal.find(".term-cont") : this.$terminal;
			$scrollEl.scrollTop($scrollEl[0].scrollHeight);
		},
		replaceThinkingWithAnswer(err, answer) {
			const $el = this.$thinkingEl || this.$terminal.find(".print [data-thinking=true]").last();
			this.$thinkingEl = null;
			if (this._thinkingInterval) {
				clearInterval(this._thinkingInterval);
				this._thinkingInterval = null;
			}
			if (!$el.length) return;
			$el.removeAttr("data-thinking");
			if (err) {
				$el.text(err);
				return;
			}
			const safe = controller.escapeHtml(answer);
			const span = document.createElement("span");
			span.className = "typed-answer";
			$el.empty().append(span);
			if (typeof Typed !== "undefined") {
				try {
					const typed = new Typed(span, {
						strings: [safe],
						typeSpeed: 25,
						showCursor: false,
						contentType: "html"
					});
				} catch (e) {
					span.textContent = answer;
				}
			} else {
				span.textContent = answer;
			}
			const $scrollEl = this.$terminal.find(".term-cont").length ? this.$terminal.find(".term-cont") : this.$terminal;
			$scrollEl.scrollTop($scrollEl[0].scrollHeight);
		},
		replaceThinkingWithHtml(err, html) {
			const $el = this.$thinkingEl || this.$terminal.find(".print [data-thinking=true]").last();
			this.$thinkingEl = null;
			if (this._thinkingInterval) {
				clearInterval(this._thinkingInterval);
				this._thinkingInterval = null;
			}
			if (!$el.length) return;
			$el.removeAttr("data-thinking");
			if (err) {
				$el.text(err);
				return;
			}
			$el.addClass("command output").empty();
			const span = document.createElement("span");
			span.className = "news-typed";
			$el.append(span);
			$el.append('<div class="output news-typed-hint">Press Enter to show all</div>');
			this.newsTypingHtml = html;
			this.newsTypingEl = $el;
			const self = this;
			try {
				this.newsTypingInstance = new Typed(span, {
					strings: [html],
					typeSpeed: 8,
					showCursor: false,
					contentType: "html",
					onComplete: () => {
						if (self.newsTypingEl) self.newsTypingEl.find(".news-typed-hint").remove();
						self.newsTypingInstance = null;
						self.newsTypingHtml = null;
						self.newsTypingEl = null;
					}
				});
			} catch (e) {
				span.innerHTML = html;
				$el.find(".news-typed-hint").remove();
			}
			const $scrollEl = this.$terminal.find(".term-cont").length ? this.$terminal.find(".term-cont") : this.$terminal;
			$scrollEl.scrollTop($scrollEl[0].scrollHeight);
		},
		skipNewsTyping() {
			if (!this.newsTypingInstance || !this.newsTypingHtml || !this.newsTypingEl) return;
			this.newsTypingInstance.destroy();
			this.newsTypingInstance = null;
			this.newsTypingEl.find(".news-typed-hint").remove();
			this.newsTypingEl.find("span.news-typed").html(this.newsTypingHtml);
			this.newsTypingHtml = null;
			this.newsTypingEl = null;
			const $scrollEl = this.$terminal.find(".term-cont").length ? this.$terminal.find(".term-cont") : this.$terminal;
			$scrollEl.scrollTop($scrollEl[0].scrollHeight);
		},
		enterCommandLine() {
			const p = $.trim(this.$prompt.text());
			this.printTerminal(p, "command label");
			controller.triggerCommand(p);
			this.initCursor();
		},
		outputCommandResult(out) {
			this.printTerminal(out, "command output");
		},
		promptHistory(prev = true) {
			if (this.$history === false) {
				this.$history = prev
					? $("#terminal .print .command.label").last()
					: $("#terminal .print .command.label").first();
			} else {
				this.$history = prev
					? this.$history.prevAll(".command.label").first()
					: this.$history.nextAll(".command.label").first();
			}
			if (this.$history.length) {
				const h = this.$history.text();
				this.$prompt.html(h);
				this.moveCursor(h.length);
			} else {
				this.initCursor();
			}
		},
		scrollPage(direction) {
			if (this.isScrolling === false) {
				this.isScrolling = true;
				direction = $.isNumeric(direction) && Math.abs(direction) === 1 ? direction : 1;
				const dh = this.$document.height();
				const wh = this.$window.height();
				const offset = this.$window.scrollTop() + wh * direction;
				const adjusted = offset < 0 ? 0 : offset + wh > dh ? dh - wh : offset;
				view.$scroll.animate(
					{ scrollTop: adjusted },
					offset !== adjusted ? Math.floor(this.scrollSpeed / 6.6666) : this.scrollSpeed,
					() => {
						this.isScrolling = false;
					}
				);
			}
		}
	};

	const controller = {
		waitingForChatEmail: false,
		chatModeActive: false,
		triggerCtrlCodes(codename) {
			let r = "";
			if (codename.length > 1) {
				view.$prompt.trigger("ctrlChar", [codename]);
			} else {
				r = codename;
			}
			return r;
		},
		triggerCommand(prompt = "") {
			view.$prompt.trigger("command", this.getCommand(prompt));
		},
		executeCommand(cmd = {}) {
			let out = "";
			switch (cmd.command) {
				case "":
					break;
				case "cls":
					view.clearTerminal();
					break;
				case "exit":
					view.$terminal.remove();
					break;
				case "about":
					out = `About this site: <a href="about.html">About</a>`;
					break;
				case "work":
					out = `Selected work: <a href="work.html">Work</a>`;
					break;
				case "?":
				case "h":
				case "help":
					out = `Commands: cls, about, work, help, news, ask &lt;question&gt;, calc &lt;expr&gt;, search &lt;phrase&gt;, web &lt;url&gt;, location, chat, exit<br><br>Quick links: <a href="about.html">About</a> · <a href="work.html">Work</a>`;
					break;
				case "eval":
				case "calc":
					out = `${eval(cmd.arguments.join(" "))}`;
					break;
				case "ask":
					{
						const question = cmd.arguments.join(" ").trim();
						if (!question) {
							out = "Usage: ask &lt;question&gt;";
							break;
						}
						return { async: "ask", question };
					}
				case "search":
				case "google":
					window.location.href = encodeURI(`https://www.google.com/search?q=${cmd.arguments.join(" ")}`);
					break;
				case "goto":
				case "web":
					window.location.href = encodeURI(`${cmd.arguments[0]}`);
					break;
				case "loadwb":
					window.location.href = "https://pnacl-amiga-emulator.appspot.com/";
					break;
				case "rss":
					this.getFeedYQL(cmd.arguments[0]);
					break;
				case "news":
					return { async: "news" };
				case "location":
				case "share":
					return { async: "location" };
				case "chat":
					{
						const state = live.getState();
						if (!state.connected) {
							out = "Open the live session first: click <strong>Connect with the world</strong> above, or type <strong>location</strong> in the terminal.";
							break;
						}
						if (!state.emailOptedIn) {
							this.waitingForChatEmail = true;
							out = "Enter your email to send messages (anti-spam). Type it and press Enter:";
							break;
						}
						// Already in chat mode from previous opt-in; "chat" with no args just enters chat mode
						this.chatModeActive = true;
						out = "You're in chat mode. Type your messages and press Enter. Type <strong>/exit</strong> to leave.";
						break;
					}
				default:
					out = `'${cmd.command}' command not found. Type <strong>help</strong> for commands.`;
					break;
			}
			return out;
		},
		getCommand(prompt = "") {
			const arrPrompt = prompt.split(" ");
			return {
				command: arrPrompt.shift().toLowerCase(),
				arguments: arrPrompt.filter((arg) => arg.length > 0)
			};
		},
		getFeedArticles(json) {
			let out = "";
			try {
				if ($.isArray(json.query.results.item)) {
					$.each(json.query.results.item, (i, item) => {
						out = `${out}<a href="${item.link}" title="${this.encodeHtmlEntity(item.description)}">${item.title}</a><br>`;
					});
				} else {
					out = "Error: No feed articles found.";
				}
			} catch (e) {
				out = `Error: Invalid feed. Please use a valid url.<br><i>(${e})</i>`;
			}
			return out;
		},
		getFeedYQL(url) {
			const yql = `https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22${encodeURI(url)}%3Fformat%3Dxml%22&format=json&diagnostics=true&callback=`;
			$.getJSON(yql, (data) => {
				view.$prompt.trigger("async", data);
			}, "jsonp");
		},
		async askAboutSite(question) {
			const onDone = (err, answer) => {
				if (typeof view.replaceThinkingWithAnswer === "function") {
					view.replaceThinkingWithAnswer(err, answer);
				}
			};
			try {
				const siteContent = await loadSiteContent();
				const instructions = (siteContent ? siteContent + "\n\n" : "") + ASK_SYSTEM_RULES;
				const apiOrigin = String(process.env.API_ORIGIN || "").trim();
				const res = await fetch(`${apiOrigin}/api/ask`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ instructions, input: question })
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					const errMsg =
						(data && typeof data.error === "string")
							? data.error
							: "Something went wrong. Please try again.";
					onDone(errMsg);
					return;
				}
				const answer = (data && typeof data.answer === "string") ? data.answer.trim() : "";
				onDone(null, answer || "No response.");
			} catch (e) {
				onDone("Network error. Please check your connection and try again.");
			}
		},
		formatNewsHtml(articles) {
			if (!Array.isArray(articles) || articles.length === 0) {
				return "No articles could be loaded. Try again later.";
			}
			const parts = articles.map((a) => {
				const titleEsc = this.escapeHtml(a.title || "—");
				const articleUrl = a.link || "";
				const readUrl = articleUrl ? "https://removepaywalls.com/" + articleUrl : "";
				const readUrlEsc = readUrl ? this.escapeHtml(readUrl) : "";
				const linkHtml = readUrlEsc
					? `<a href="${readUrlEsc}" target="_blank" rel="noopener">${titleEsc}</a>`
					: titleEsc;
				const summaryEsc = a.summary ? this.escapeHtml(a.summary).replace(/\n/g, "<br>") : (a.error || "—");
				return `<strong>${this.escapeHtml(a.source)}</strong> · ${linkHtml}<br><span class="news-summary">${summaryEsc}</span>`;
			});
			return parts.join("<br><br>");
		},
		async fetchNews() {
			const onDone = (err, html) => {
				if (typeof view.replaceThinkingWithHtml === "function") {
					view.replaceThinkingWithHtml(err, html);
				}
			};
			try {
				const apiOrigin = String(process.env.API_ORIGIN || "").trim();
				const res = await fetch(`${apiOrigin}/api/news`, { method: "GET" });
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					onDone(data.error || "News digest failed. Try again later.");
					return;
				}
				const html = this.formatNewsHtml(data.articles || []);
				onDone(null, html);
			} catch (e) {
				onDone("Network error. Please check your connection and try again.");
			}
		},
		shareLocation(cb) {
			if (!navigator.geolocation) {
				cb("Geolocation not supported.");
				return;
			}
			view.printTerminal("Getting location...", "command output");
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					live.openLiveSession({
						onOpen: () => {
							live.sendMessage({ type: "location", lat: pos.coords.latitude, lng: pos.coords.longitude });
							cb(null, "Location shared. You're on the globe.");
						},
						onError: () => cb("Connection failed. Try again.")
					});
				},
				() => cb("Location denied or unavailable."),
				{ enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 }
			);
		},
		extractResponsesAnswer(data) {
			if (!data || typeof data !== "object") return "";
			if (typeof data.output === "string") return data.output.trim();
			if (typeof data.text === "string") return data.text.trim();
			const output = data.output;
			if (!Array.isArray(output) || output.length === 0) return "";
			const parts = [];
			for (const item of output) {
				if (item && item.content && Array.isArray(item.content)) {
					for (const block of item.content) {
						if (block && block.type === "output_text" && typeof block.text === "string") {
							parts.push(block.text);
						}
					}
				}
			}
			return parts.join("").trim();
		},
		decodeHtmlEntity(str) {
			return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
		},
		encodeHtmlEntity(str) {
			const buf = [];
			for (let i = str.length - 1; i >= 0; i--) {
				buf.unshift(["&#", str[i].charCodeAt(), ";"].join(""));
			}
			return buf.join("");
		},
		escapeHtml(str) {
			if (typeof str !== "string") return "";
			return str
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
		}
	};

export function initTinycli() {
	view.init();
	if (!window.__tinycliEventsBound) {
		window.__tinycliEventsBound = true;
		event.init();
	}
}
