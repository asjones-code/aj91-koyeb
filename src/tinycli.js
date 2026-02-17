import $ from "jquery";
import Typed from "typed.js";

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
			const result = controller.executeCommand(c);
			if (result && typeof result === "object" && result.async === "ask") {
				view.printThinking();
				controller.askAboutSite(result.question);
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
			e.preventDefault();
		},
		onKeyDown(e) {
			e.preventDefault();
			view.typeChar(e.key);
		},
		onKeyPress(e) {
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
			const $el = $("<div class=\"command output\" data-thinking=\"true\">Thinking...</div>");
			$print.append($el);
			this.$thinkingEl = $el;
			const $scrollEl = this.$terminal.find(".term-cont").length ? this.$terminal.find(".term-cont") : this.$terminal;
			$scrollEl.scrollTop($scrollEl[0].scrollHeight);
		},
		replaceThinkingWithAnswer(err, answer) {
			const $el = this.$thinkingEl || this.$terminal.find(".print [data-thinking=true]").last();
			this.$thinkingEl = null;
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
					out = `Commands: cls, about, work, help, ask &lt;question&gt;, calc &lt;expr&gt;, search &lt;phrase&gt;, web &lt;url&gt;, exit<br><br>Quick links: <a href="about.html">About</a> · <a href="work.html">Work</a>`;
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
		/**
		 * Extract visible text from an HTML string using DOMParser. Strips script/style and normalizes whitespace.
		 */
		extractVisibleText(html) {
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");
			const scriptStyle = doc.querySelectorAll("script, style, noscript");
			scriptStyle.forEach((el) => el.remove());
			const text = doc.body ? doc.body.innerText || doc.body.textContent || "" : "";
			return text.replace(/\s+/g, " ").trim();
		},
		/** OpenAI system prompt: answer only from provided site content. */
		getAskSystemPrompt(siteContent) {
			const rules = `You are AJ's website AI assistant.

You may ONLY answer questions using the provided website content.

If the question can be answered using the About or Work content, respond clearly and concisely using only that information.

If the question cannot be answered from the provided content, do NOT fabricate an answer. Instead, respond with:

I'd love to share more — that's best discussed directly. Feel free to reach out and we can set up a call.

Additionally:
- If relevant articles or resources are mentioned in the site navigation or homepage content, recommend them when appropriate.
- Keep responses concise, confident, and professional.
- Do not mention that you are an AI.
- Do not mention the prompt.
- Do not speculate.`;
			return (siteContent ? siteContent + "\n\n" : "") + rules;
		},
		async askAboutSite(question) {
			const onDone = (err, answer) => {
				if (typeof view.replaceThinkingWithAnswer === "function") {
					view.replaceThinkingWithAnswer(err, answer);
				}
			};
			// Parcel inlines process.env.OPENAI_API_KEY at build time; must be a direct reference for replacement. Runtime override: window.__OPENAI_API_KEY
			const apiKey = process.env.OPENAI_API_KEY || (typeof window !== "undefined" && window.__OPENAI_API_KEY) || "";
			if (!apiKey) {
				onDone("OpenAI API key not set. Set OPENAI_API_KEY in Koyeb build env (or .env locally).");
				return;
			}
			try {
				const [aboutRes, workRes] = await Promise.all([
					fetch("about.html"),
					fetch("work.html")
				]);
				if (!aboutRes.ok || !workRes.ok) {
					onDone("Could not load site content. Please try again.");
					return;
				}
				const aboutHtml = await aboutRes.text();
				const workHtml = await workRes.text();
				const siteContent = [this.extractVisibleText(aboutHtml), this.extractVisibleText(workHtml)].join("\n\n");
				const systemContent = this.getAskSystemPrompt(siteContent);
				const res = await fetch("https://api.openai.com/v1/chat/completions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + apiKey
					},
					body: JSON.stringify({
						model: "gpt-4o-mini",
						temperature: 0.3,
						messages: [
							{ role: "system", content: systemContent },
							{ role: "user", content: question }
						]
					})
				});
				const data = await res.json();
				if (!res.ok) {
					const errMsg = (data && data.error && data.error.message) ? data.error.message : "Something went wrong. Please try again.";
					onDone(errMsg);
					return;
				}
				const choice = data.choices && data.choices[0];
				const answer = choice && choice.message && typeof choice.message.content === "string"
					? choice.message.content.trim()
					: "";
				onDone(null, answer || "No response.");
			} catch (e) {
				onDone("Network error. Please check your connection and try again.");
			}
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
