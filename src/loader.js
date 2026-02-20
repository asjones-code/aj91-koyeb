import barba from "@barba/core";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Splitting from "splitting";

gsap.registerPlugin(CustomEase, ScrollTrigger);

// iOS Safari: set --vh from visual viewport so full-height fills when toolbar hides/shows
function setViewportHeightVar() {
	const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
}
setViewportHeightVar();
if (typeof window.visualViewport !== "undefined") {
	window.visualViewport.addEventListener("resize", setViewportHeightVar);
	window.visualViewport.addEventListener("scroll", setViewportHeightVar);
}
window.addEventListener("resize", setViewportHeightVar);

// Lenis smooth scroll – keeps scroll-linked effects (e.g. work header pinch) from jittering
const lenis = new Lenis({
	lerp: 0.08,
	smoothWheel: true,
	anchors: true
});
// Work header pinch: smoothed progress (module-level so Lenis callback can update it)
let workHeaderSmoothedP = 0;

// Ease progress so resize velocity → 0 at start/end (no jump at min/max width)
function smoothstep(t) {
	const x = Math.max(0, Math.min(1, t));
	return x * x * (3 - 2 * x);
}

lenis.on("scroll", (e) => {
	ScrollTrigger.update(e);
	// Work page: drive header pinch and is-scrolled from smoothed progress (no instant toggle)
	if (!document.body.classList.contains("page-is-work")) return;
	const header = document.querySelector(".header");
	if (!header) return;
	const raw = Math.max(0, Math.min(1, e.scroll / WORK_HEADER_SCROLL_END_PX));
	const lerp = raw > workHeaderSmoothedP ? 0.2 : 0.07; // responsive down, heavy damp up
	workHeaderSmoothedP += (raw - workHeaderSmoothedP) * lerp;
	const p = smoothstep(workHeaderSmoothedP);
	header.style.setProperty("--work-header-pinch", String(p));
	header.classList.toggle("is-scrolled", p > 0.02);
});
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);



CustomEase.create(
	"stutterEase",
	"M0,0 C0,0 0.052,0.1 0.152,0.1 0.242,0.1 0.299,0.349 0.399,0.349 0.586,0.349 0.569,0.596 0.67,0.624 0.842,0.671 0.95,0.95 1,1"
);
// Sine wave shadow effect for logo text based on loading progress
let logoProgress = 0;

function initLogoMouseEffect() {
	const word = document.querySelector(".logo-text");
	if (!word) return;

	const updateTransform = () => {
		// Create sine wave effect based on loading progress
		// Use different frequencies for x and y to create interesting patterns
		const time = logoProgress * Math.PI * 2;
		const x = Math.sin(time) * 2.5;
		const y = Math.cos(time * 1.3) * 2.5;
		
		word.style.textShadow = `${x}px ${-y}px 0px rgba(102, 249, 255, 0.7),
		                         ${-x}px ${y}px 0px rgba(255, 35, 251, 0.7),
		                         ${y}px ${-x}px 0px rgba(255, 255, 73, 0.7),
		                         ${-y}px ${x}px 0px rgba(102, 249, 255, 0.7)`;
	};

	// Continuously update transform based on progress
	const updateLoop = () => {
		updateTransform();
		requestAnimationFrame(updateLoop);
	};
	updateLoop();
}

function updateLogoProgress(progress) {
	logoProgress = progress;
}

const textAnimations = {
	logoAnimation: (el) => {
		// Just make the text visible, no SplitText effect
		gsap.set(el, { visibility: "visible" });
	},
	headerAnimation: (el) => {
		const [ctx] = Splitting({ target: el, by: "chars" });
		if (!ctx?.chars?.length) {
			gsap.set(el, { visibility: "visible" });
			return;
		}
		gsap.from(ctx.chars, {
			xPercent: -100,
			ease: "power2.inOut",
			stagger: {
				each: 0.02,
				from: "random"
			},
			duration: 0.5
		});
	},
	bodyAnimation: (el) => {
		const [ctx] = Splitting({ target: el, by: "lines" });
		if (!ctx?.lines?.length) {
			gsap.set(el, { visibility: "visible" });
			return;
		}
		gsap.from(ctx.lines, {
			opacity: 0,
			yPercent: -100,
			duration: 0.9,
			stagger: 0.1,
			ease: "power3.inOut",
			scrollTrigger: {
				trigger: el,
				start: "top 90%"
			}
		});
	}
};

function animateText(el) {
	document.fonts.ready.then(() => {
		gsap.set(el, { visibility: "visible" });
		const animType = document.querySelector(el).dataset.textAnim;
		const animFunc = textAnimations[animType];
		console.log(animFunc);
		if (animFunc) animFunc(el);
	});
}

function preloaderAnimation() {
	let tl = gsap.timeline({
		onUpdate: function() {
			// Update logo progress based on timeline progress
			updateLogoProgress(this.progress());
		}
	});
	tl
		.call(animateText, [".logo-text"])
		.to(".preloader-bg", {
			scaleX: 1,
			ease: "stutterEase",
			duration: 2.8
		})
		.to(".preloader-mask", {
			"--preloader-mask-size": "600%",
			duration: 1.4,
			ease: "expoScale(0.5,7,power1.in)"
		})
		.to(
			".preloader-bg, .preloader-logo, .preloader-progress-bar",
			{
				opacity: 0,
				duration: 0.85,
				ease: "power2.inOut"
			},
			"<"
		)
		.to(
			".hero-globe-wrap",
			{
				scale: 1,
				duration: 2.85,
				ease: "expoScale(0.5,7,power1.out)"
			},
			"<"
		);

	return tl;
}

function heroAnimation() {
	let tl = gsap.timeline();
	tl
		.fromTo(
			"[data-fade-in]",
			{
				filter: "blur(30px)",
				opacity: 0,

				yPercent: (index, element) => {
					return element.getAttribute("data-fade-in") === "down" ? -100 : 0;
				},

				xPercent: (index, element) => {
					return element.getAttribute("data-fade-in") === "left" ? 100 : 0;
				}
			},

			{
				yPercent: 0,
				xPercent: 0,

				filter: "blur(0px)",
				opacity: 1,
				duration: 1.25,
				ease: "power4.inOut",
				stagger: 0.08
			},
			"<-.25"
		)
		.call(animateText, ["h1"], "<.55")
		.call(animateText, [".sub-title"], "-=.75");

	return tl;
}

// Initialize mouse effect as soon as DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initLogoMouseEffect);
} else {
	initLogoMouseEffect();
}

function initTerminal() {
	// Load tinycli (terminal with commands; about/work are clickable links)
	import("./tinycli.js").then((m) => m.initTinycli());
}

function initGlobeOptIn() {
	const btn = document.getElementById("globe-opt-in");
	if (!btn) return;
	btn.addEventListener("click", () => {
		btn.disabled = true;
		btn.textContent = "…";
		import("./live.js").then((live) => {
			live.optInGlobeLocation()
				.then(() => {
					btn.textContent = "You're connected";
				})
				.catch((err) => {
					btn.disabled = false;
					btn.textContent = "Connect with the world";
					console.warn("[globe] Opt-in failed:", err.message);
				});
		});
	});
}

// Resize in real time: progress 0→1 over this scroll distance (driven by Lenis in scroll callback)
const WORK_HEADER_SCROLL_END_PX = 120;

function initStickyHeader() {
	// is-scrolled driven by smoothed progress only (navTick non-work, Lenis callback work)
}

/**
 * Work page: sync header pinch state to current scroll when entering; pinch is driven in Lenis scroll callback.
 */
function initWorkHeaderPinch() {
	const header = document.querySelector(".header");
	if (!header || !document.body.classList.contains("page-is-work")) return;
	const raw = Math.max(0, Math.min(1, lenis.scroll / WORK_HEADER_SCROLL_END_PX));
	workHeaderSmoothedP = raw;
	header.style.setProperty("--work-header-pinch", String(smoothstep(raw)));
	// Clear nav pill var and any inline styles so work page CSS (pinch/::before) controls the header
	header.style.removeProperty("--nav-pill-p");
	header.style.removeProperty("opacity");
	header.style.removeProperty("margin-top");
	header.style.removeProperty("background");
	header.style.removeProperty("backdrop-filter");
	header.style.removeProperty("-webkit-backdrop-filter");
	header.style.removeProperty("box-shadow");
	header.style.removeProperty("border-radius");
}

function killWorkHeaderPinch() {
	workHeaderSmoothedP = 0;
	const header = document.querySelector(".header");
	if (header) header.style.removeProperty("--work-header-pinch");
}

function initMenuToggle() {
	const toggle = document.getElementById("menu-toggle");
	const layout = document.getElementById("layout-morph");
	const navRail = document.querySelector(".nav-rail");
	const menuCardsWrap = document.querySelector(".menu-cards");
	const heroSection = document.querySelector(".hero-section");
	const heroContent = document.querySelector(".hero-content");
	const heroImg = document.querySelector(".hero-img");
	const contentMain = document.querySelector(".hero-content .content-main");
	const terminalWrap = document.querySelector(".content-cta.term");
	if (!toggle || !layout || !heroSection) return;

	const menuBreakpoint = window.matchMedia("(max-width: 768px)");
	const isMobile = () => menuBreakpoint.matches;
	const menuEase = "power2.inOut";
	const menuDuration = { open: 0.5, close: 0.5 };

	let isOpen = false;
	let lastMobile = isMobile();
	/** @type {{ top: number; left: number; width: number; height: number } | null} */
	let savedTerminalRect = null;

	function openMenu() {
		if (isOpen) return;
		isOpen = true;
		toggle.classList.add("active");
		document.body.classList.add("menu-open");
		layout.classList.add("menu-open");
		toggle.setAttribute("aria-expanded", "true");
		navRail?.setAttribute("aria-hidden", "false");
		menuCardsWrap?.setAttribute("aria-hidden", "false");
		document.body.style.overflow = "hidden";

		const tl = gsap.timeline({
			defaults: { ease: "power2.inOut" },
			onComplete: () => {
				document.body.style.overflow = "auto";
			}
		});

		if (isMobile() && contentMain && terminalWrap) {
			const terminalEl = terminalWrap.querySelector("#terminal");
			const dc = menuDuration.close;
			// Freeze hero-content height so when terminal goes fixed, text doesn't drop
			if (heroContent) {
				heroContent.style.minHeight = `${heroContent.offsetHeight}px`;
			}
			// Capture terminal position/size (same slide+resize on open and close)
			const rect = terminalWrap.getBoundingClientRect();
			savedTerminalRect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
			// Menu-open target in pixels so open = slide+resize like close (no %/vh scale feel)
			const openTop = window.innerHeight * 0.1;
			const openHeight = Math.min(window.innerHeight * 0.32, 320);
			const openWidth = Math.min(320, window.innerWidth * 0.9);
			const openLeft = (window.innerWidth - openWidth) / 2;

			// Open = exact reverse of close: (1) text swipes out first, (2) then terminal + cards + nav + globe animate together
			// 1) Text: swipe out (reverse of close’s “swipe back in”) — same duration/ease as close’s text
			tl.to(contentMain, {
				y: -140,
				opacity: 0,
				pointerEvents: "none",
				duration: dc * 0.75,
				ease: "power2.in"
			}, 0);
			// 2) At same delay as close’s text (dc*0.2): terminal repositions, cards/nav slide in, globe scales — mirror of close
			const repositionStart = dc * 0.2;
			const terminalDur = dc * 0.85;
			const cardsNavDur = dc * 0.8;
			if (heroImg) tl.to(heroImg, { scale: 0.8, duration: dc, ease: menuEase }, repositionStart);
			tl.fromTo(terminalWrap, {
				position: "fixed",
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
				borderRadius: 8,
				overflow: "hidden",
				boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
				zIndex: 15,
				xPercent: 0,
				maxWidth: "none",
				maxHeight: "none"
			}, {
				top: openTop,
				left: openLeft,
				width: openWidth,
				height: openHeight,
				maxWidth: "none",
				maxHeight: "none",
				borderRadius: 16,
				boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
				duration: terminalDur,
				ease: menuEase
			}, repositionStart)
				.to(terminalEl, { height: openHeight, duration: terminalDur, ease: menuEase }, repositionStart)
				.fromTo(menuCardsWrap, { x: "100%", opacity: 0 }, { x: 0, opacity: 1, duration: cardsNavDur, ease: menuEase }, repositionStart)
				.fromTo(navRail, { x: "-100%", opacity: 0 }, { x: 0, opacity: 1, duration: cardsNavDur, ease: menuEase }, repositionStart + 0.05);
		} else {
			tl.to(heroSection, { scale: 0.3, duration: 0.6 }, 0)
				.fromTo(navRail, { x: "-100%", opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.1)
				.fromTo(menuCardsWrap, { x: "100%", opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.15);
		}
	}

	function closeMenu() {
		if (!isOpen) return;
		isOpen = false;
		document.body.style.overflow = "hidden";

		const onComplete = () => {
			toggle.classList.remove("active");
			document.body.classList.remove("menu-open");
			layout.classList.remove("menu-open");
			toggle.setAttribute("aria-expanded", "false");
			navRail?.setAttribute("aria-hidden", "true");
			menuCardsWrap?.setAttribute("aria-hidden", "true");
			document.body.style.overflow = "auto";
			gsap.set([heroSection, navRail, menuCardsWrap], { clearProps: "transform,opacity" });
			if (heroImg) gsap.set(heroImg, { clearProps: "transform" });
			if (heroContent) heroContent.style.minHeight = "";
			if (terminalWrap) {
				gsap.set(terminalWrap, { clearProps: "all" });
				const inner = terminalWrap.querySelector("#terminal");
				if (inner) gsap.set(inner, { clearProps: "height" });
			}
			if (contentMain) gsap.set(contentMain, { clearProps: "opacity,pointerEvents,y" });
		};

		const tl = gsap.timeline({ defaults: { ease: menuEase }, onComplete });
		const dc = menuDuration.close;

		if (isMobile() && contentMain && terminalWrap) {
			// Globe: scale back to 1
			if (heroImg) tl.to(heroImg, { scale: 1, duration: dc, ease: menuEase }, 0);
			// Terminal: reverse of open – animate position and size back to saved rect (inner height in px so resize interpolates)
			if (savedTerminalRect) {
				const terminalEl = terminalWrap.querySelector("#terminal");
				const dur = dc * 0.85;
				tl.to(terminalEl, { height: savedTerminalRect.height, duration: dur, ease: menuEase }, 0);
				tl.to(terminalWrap, {
					top: savedTerminalRect.top,
					left: savedTerminalRect.left,
					width: savedTerminalRect.width,
					height: savedTerminalRect.height,
					borderRadius: 8,
					maxWidth: "none",
					maxHeight: "none",
					xPercent: 0,
					overflow: "hidden",
					boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
					duration: dur,
					ease: menuEase
				}, 0);
				savedTerminalRect = null;
			}
			tl.to(menuCardsWrap, { x: "100%", opacity: 0, duration: dc * 0.8, ease: menuEase }, 0)
				.to(navRail, { x: "-100%", opacity: 0, duration: dc * 0.8, ease: menuEase }, 0.05);
			// Text: swipe back in from above
			tl.fromTo(contentMain, { y: -140, opacity: 0 }, { y: 0, opacity: 1, pointerEvents: "auto", duration: dc * 0.75, ease: "power2.out" }, dc * 0.2);
		} else {
			tl.to(menuCardsWrap, { x: "100%", opacity: 0, duration: 0.35 })
				.to(navRail, { x: "-100%", opacity: 0, duration: 0.35 }, "-=0.2")
				.to(heroSection, { scale: 1, duration: 0.5 }, "-=0.4");
		}
	}

	toggle.addEventListener("click", () => {
		if (isOpen) closeMenu();
		else openMenu();
	});

	// Close menu when clicking the header logo ("aj91") so it doesn’t stay open on home
	const headerLogo = document.querySelector(".header-logo");
	if (headerLogo) {
		headerLogo.addEventListener("click", () => {
			if (isOpen) closeMenu();
		});
	}

	// When viewport crosses the mobile/desktop breakpoint (e.g. device emulation, resize),
	// close the menu so we never end up with desktop open state + mobile CSS or vice versa
	function onBreakpointChange() {
		const nowMobile = isMobile();
		if (nowMobile !== lastMobile && isOpen) {
			closeMenu();
		}
		lastMobile = nowMobile;
	}
	menuBreakpoint.addEventListener("change", onBreakpointChange);
	let resizeTicking = false;
	window.addEventListener("resize", () => {
		if (resizeTicking) return;
		resizeTicking = true;
		requestAnimationFrame(() => {
			onBreakpointChange();
			resizeTicking = false;
		});
	});
}

// ——— Nav: Lenis RAF only (no scroll listeners). Position = baseline, velocity = transient. ———
const NAV_SCROLL_END_PX = 180; // more scroll distance = slower, smoother progression
const NAV_POS_LERP_DOWN = 0.055; // baseline follows scroll down (slower = smoother)
const NAV_POS_LERP_UP = 0.14; // baseline follows scroll up (base rate)
const NAV_POS_LERP_UP_NEAR_TOP = 0.22; // when scrolling up near top, slightly faster catch-up (was 0.52 – caused snap at threshold)
const NAV_NEAR_TOP_PX = 90; // blend toward UP_NEAR_TOP lerp when scrollY < this and going up
const NAV_VEL_DECAY = 0.11; // velocity decays more slowly = transient feels smoother
const NAV_VEL_DECAY_FLIP = 0.38; // gentler decay on direction flip
const NAV_BASELINE_SCALE = 0.08; // at full scroll progress: baseline scaleX = 1 - this
const NAV_BASELINE_Y_PX = 2; // at full scroll progress: baseline y (px) — subtle
const NAV_VEL_SCALE_IMPACT = 0.000012; // slightly gentler velocity squeeze
const NAV_VEL_Y_IMPACT = 0.0005; // slightly gentler velocity y
const NAV_TRANSIENT_SCALE_CAP = 0.035; // transient squeeze cap
const NAV_TRANSIENT_Y_CAP = 1.2; // transient y cap
const NAV_VEL_EPSILON = 8; // px/s – transient hard zero below this
const NAV_SCALE_MIN = 0.92; // defensive clamp so GPU never sees overshoot
// Velocity calculation guards: avoid spikes from tiny dt or stale dt (tab background)
const NAV_DT_MIN_SEC = 1 / 90; // don't use dt smaller than this (avoids huge vel from frame jitter)
const NAV_DT_MAX_SEC = 0.15; // if dt larger, treat as pause and use rawVel = 0
const NAV_RAW_VELOCITY_CAP = 2500; // clamp raw velocity (px/s) so one bad frame doesn't blow transient
// At-rest-at-top: when scroll is near top and velocity is low, blend output to exact rest (avoids jump when
// transient drops to 0 while baseline hasn't caught up). Zone must be wide enough to catch "scroll up from anywhere".
const REST_SCROLL_PX = 55;   // start easing to rest when within this many px of top
const REST_VEL_PX_S = 70;    // consider "low velocity" so we enter zone while still coasting up
const REST_BLEND_SPEED = 0.14; // blend speed so we ease over many frames as we approach top

let navPrevScroll = 0;
let navPrevTime = 0;
let navSmoothedP = 0;
let navSmoothedVel = 0;
let navSetScaleX = null;
let navSetY = null;
let navSetX = null;
let navLastHeader = null;
let navLastHeaderEl = null;
let navSetHeaderOpacity = null;
let navSetHeaderMargin = null;
let navRestBlend = 0;
const HEADER_SLIDE_Y = -8; // header starts at -8px, goes to 0 when scrolled (we drive this with the same transform)

/**
 * How scroll position maps to baseline nav state (continuous, no toggles).
 * When scrolling up near top, lerp blends smoothly from UP to UP_NEAR_TOP so no snap at threshold.
 */
function navBaselineFromPosition(scrollY) {
	const rawP = Math.max(0, Math.min(1, scrollY / NAV_SCROLL_END_PX));
	const scrollingUp = rawP < navSmoothedP;
	const nearTop = scrollY < NAV_NEAR_TOP_PX;
	const t = nearTop ? 1 - scrollY / NAV_NEAR_TOP_PX : 0; // 0 at 90px, 1 at 0
	const lerp = scrollingUp && nearTop
		? NAV_POS_LERP_UP + (NAV_POS_LERP_UP_NEAR_TOP - NAV_POS_LERP_UP) * t
		: scrollingUp
			? NAV_POS_LERP_UP
			: NAV_POS_LERP_DOWN;
	navSmoothedP += (rawP - navSmoothedP) * lerp;
	const p = smoothstep(navSmoothedP);
	return {
		scaleX: 1 - p * NAV_BASELINE_SCALE,
		y: -p * NAV_BASELINE_Y_PX
	};
}

/**
 * How velocity adds transient energy (decays when scroll stops; never drives baseline).
 * Below NAV_VEL_EPSILON transient is cut to 0 (no smoothstep fade – avoids visible pop at boundary).
 */
function navTransientFromVelocity(velocityPxPerSec) {
	const directionFlip = velocityPxPerSec * navSmoothedVel < 0;
	if (directionFlip) navSmoothedVel *= 1 - NAV_VEL_DECAY_FLIP;
	else navSmoothedVel += (velocityPxPerSec - navSmoothedVel) * NAV_VEL_DECAY;

	const absVel = Math.abs(navSmoothedVel);
	if (absVel < NAV_VEL_EPSILON) {
		navSmoothedVel = 0;
		return { scaleX: 0, y: 0 };
	}
	const v = navSmoothedVel * smoothstep(Math.min(1, absVel / 120));
	const scaleDelta = -Math.min(NAV_TRANSIENT_SCALE_CAP, Math.abs(v) * NAV_VEL_SCALE_IMPACT);
	const yDelta = Math.max(-NAV_TRANSIENT_Y_CAP, Math.min(NAV_TRANSIENT_Y_CAP, v * NAV_VEL_Y_IMPACT));
	return { scaleX: scaleDelta, y: yDelta };
}

/**
 * Run inside Lenis RAF loop (GSAP ticker). Transforms the header (the bar), not the inner nav.
 * Header y = slide (-8 → 0 when scrolled) + baseline.y + transient.y. quickSetter = no double smoothing.
 */
function navTick() {
	if (document.body.classList.contains("page-is-work")) return; // work page uses its own header transform (pinch)
	const inner = document.querySelector(".header-inner");
	if (!inner) return;

	if (inner !== navLastHeader) {
		navLastHeader = inner;
		navSetX = gsap.quickSetter(inner, "x");
		navSetScaleX = gsap.quickSetter(inner, "scaleX");
		navSetY = gsap.quickSetter(inner, "y");
		gsap.set(inner, { transformOrigin: "50% 0" });
	}
	if (!navSetScaleX || !navSetY) return;

	const scrollY = lenis.scroll;
	const now = performance.now();
	let dtSec = navPrevTime > 0 ? (now - navPrevTime) / 1000 : 0;
	navPrevTime = now;
	// Clamp dt so velocity isn't spiky (tiny dt) or stale (tab background)
	if (dtSec > 0) {
		if (dtSec < NAV_DT_MIN_SEC) dtSec = NAV_DT_MIN_SEC;
		else if (dtSec > NAV_DT_MAX_SEC) dtSec = 0; // treat as pause
	}
	let velocityPxPerSec = dtSec > 0 ? (scrollY - navPrevScroll) / dtSec : 0;
	velocityPxPerSec = Math.max(-NAV_RAW_VELOCITY_CAP, Math.min(NAV_RAW_VELOCITY_CAP, velocityPxPerSec));
	navPrevScroll = scrollY;

	const baseline = navBaselineFromPosition(scrollY);
	const transient = navTransientFromVelocity(velocityPxPerSec);

	const scaleX = Math.min(1, Math.max(NAV_SCALE_MIN, baseline.scaleX + transient.scaleX));
	// Drive slide from smoothed progress so no one-frame snap when scroll hits 0 (was: scrollY > 0 ? 0 : -8)
	const slideY = HEADER_SLIDE_Y * (1 - smoothstep(navSmoothedP));
	const yRaw = slideY + baseline.y + transient.y;
	const y = Math.round(yRaw * (window.devicePixelRatio || 1)) / (window.devicePixelRatio || 1);

	// Approaching rest: ease state toward rest; only blend scaleX to 1. Do not blend y – slideY is already
	// from navSmoothedP, so blending finalY toward HEADER_SLIDE_Y would fight it and cause jump.
	const nearTop = scrollY <= REST_SCROLL_PX;
	const lowVel = Math.abs(navSmoothedVel) < REST_VEL_PX_S;
	const atRestAtTop = nearTop && lowVel;
	if (atRestAtTop) {
		const restReadiness = (1 - scrollY / REST_SCROLL_PX) * (1 - Math.min(1, Math.abs(navSmoothedVel) / REST_VEL_PX_S));
		navRestBlend = Math.min(1, navRestBlend + REST_BLEND_SPEED * (0.4 + 0.6 * restReadiness));
		navSmoothedP += (0 - navSmoothedP) * 0.35;
		navSmoothedVel *= 0.6;
	} else {
		navRestBlend = 0;
	}
	const finalScaleX = navRestBlend * 1 + (1 - navRestBlend) * scaleX;
	const finalY = y; // no rest blend for y – slideY already follows navSmoothedP

	navSetX(0);
	navSetScaleX(finalScaleX);
	navSetY(finalY);

	// Drive header margin from same progress so removing is-scrolled at top doesn’t jump (margin was 12px → 0)
	const effectiveP = (1 - navRestBlend) * navSmoothedP;
	const headerScrollP = smoothstep(effectiveP);
	const header = inner.closest(".header");
	if (header) {
		header.style.setProperty("--nav-pill-p", String(headerScrollP));
		if (effectiveP > 0.02) header.classList.add("is-scrolled");
		else header.classList.remove("is-scrolled");
	}
}

function initNavIndicator() {
	const inner = document.querySelector(".header-inner");
	if (!inner) return;
	if (document.body.classList.contains("page-is-work")) return; // work page header transform is separate

	navPrevScroll = lenis.scroll;
	navPrevTime = performance.now();
	navSmoothedP = Math.max(0, Math.min(1, lenis.scroll / NAV_SCROLL_END_PX));
	navSmoothedVel = 0;
	navRestBlend = 0;
	navLastHeader = null;

	const rawP = Math.max(0, Math.min(1, lenis.scroll / NAV_SCROLL_END_PX));
	navSmoothedP = rawP;
	const p = smoothstep(rawP);
	const slideY = HEADER_SLIDE_Y * (1 - p);
	gsap.set(inner, {
		x: 0,
		scaleX: 1 - p * NAV_BASELINE_SCALE,
		y: slideY - p * NAV_BASELINE_Y_PX,
		transformOrigin: "50% 0"
	});
	const header = inner.closest(".header");
	if (header) {
		header.style.setProperty("--nav-pill-p", String(p));
		if (p > 0.02) header.classList.add("is-scrolled");
		else header.classList.remove("is-scrolled");
	}

	if (!window.__navTickBound) {
		window.__navTickBound = true;
		gsap.ticker.add(navTick);
	}
}

let hasRunIntro = false;

function initEmailCaptureCard() {
	const card = document.getElementById("email-capture-card");
	const backdrop = document.getElementById("email-capture-backdrop");
	const contactLink = document.querySelector('a.nav-badge[href="#contact"]');
	const closeBtn = document.getElementById("email-capture-close");
	const menuBreakpoint = window.matchMedia("(max-width: 768px)");
	if (!card || !backdrop) return;

	function openEmailCard() {
		document.activeElement?.blur();
		card.classList.add("is-open");
		backdrop.classList.add("is-open");
		card.setAttribute("aria-hidden", "false");
		backdrop.setAttribute("aria-hidden", "false");
		const input = document.getElementById("email-capture-input");
		requestAnimationFrame(() => {
			input?.focus({ preventScroll: true });
		});
	}
	function closeEmailCard() {
		card.classList.remove("is-open");
		backdrop.classList.remove("is-open");
		card.setAttribute("aria-hidden", "true");
		backdrop.setAttribute("aria-hidden", "true");
	}

	if (contactLink) {
		contactLink.addEventListener("click", (e) => {
			if (menuBreakpoint.matches) {
				e.preventDefault();
				openEmailCard();
			}
		});
	}
	closeBtn?.addEventListener("click", closeEmailCard);
	backdrop.addEventListener("click", closeEmailCard);

	const form = document.getElementById("email-capture-form");
	const input = document.getElementById("email-capture-input");
	if (form && input) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			const email = input.value.trim();
			if (!email) return;
			const submitBtn = form.querySelector(".email-capture-submit");
			const originalText = submitBtn?.textContent;
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = "Subscribing...";
			}
			try {
				const res = await fetch("/api/subscribe", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email })
				});
				const data = await res.json().catch(() => ({}));
				if (res.ok && data.success) {
					if (submitBtn) submitBtn.textContent = "Subscribed!";
					input.value = "";
					setTimeout(() => {
						if (menuBreakpoint.matches) closeEmailCard();
						if (submitBtn) {
							submitBtn.disabled = false;
							submitBtn.textContent = originalText;
						}
					}, 1500);
				} else {
					alert(data.error || "Something went wrong. Please try again.");
					if (submitBtn) {
						submitBtn.disabled = false;
						submitBtn.textContent = originalText;
					}
				}
			} catch (err) {
				alert("Network error. Please check your connection and try again.");
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = originalText;
				}
			}
		});
	}
}

function runPageInit() {
	initStickyHeader();
	initMenuToggle();
	initNavIndicator();
	initEmailCaptureCard();
}

barba.init({
	transitions: [
		{
			name: "default",
			leave({ current }) {
				document.body.classList.remove("menu-open");
				const layout = document.getElementById("layout-morph");
				if (layout) layout.classList.remove("menu-open");
				if (current.container.getAttribute("data-barba-namespace") === "work") {
					killWorkHeaderPinch();
				}
				return gsap.to(current.container, { opacity: 0, duration: 0.25, ease: "power2.inOut" });
			},
			enter({ next }) {
				return gsap.fromTo(next.container, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.inOut" });
			}
		}
	],
	views: []
});

barba.hooks.after((data) => {
	lenis.resize();
	runPageInit();

	// Body class for work page (header max-width 50% when scrolled)
	document.body.classList.remove("page-is-work");
	if (data.next.namespace === "work") {
		document.body.classList.add("page-is-work");
		// TOC is only in work.html; when we arrive via Barba the script didn’t run, so generate it
		requestAnimationFrame(() => {
			import("./work-toc.js").then((m) => m.generateTableOfContents?.());
		});
		// Ensure the work container is visible (transition can leave it hidden)
		data.next.container.style.opacity = "1";
		// Smooth scroll-linked header pinch (100% → 50% by scroll %)
		requestAnimationFrame(() => initWorkHeaderPinch());
	}

	// When navigating back to home (e.g. from About), run the same intro as initial load
	if (data.next.namespace === "home") {
		const introTimeline = gsap.timeline();
		const preloaderTl = preloaderAnimation();
		const heroTl = heroAnimation();
		introTimeline.add(preloaderTl).add(heroTl, "-=2.4");
		initTerminal();
		initGlobeOptIn();
		// Re-mount the globe into the new .hero-globe-wrap (script only runs once on load)
		window.dispatchEvent(new CustomEvent("hero-globe-mount"));
		// Re-populate writing feed (container was replaced by Barba)
		import("./js/writing.js").then((m) => m.init?.());
	}
});

window.addEventListener("load", () => {
	if (!hasRunIntro && document.querySelector("[data-barba-namespace='home']")) {
		const introTimeline = gsap.timeline();
		const preloaderTl = preloaderAnimation();
		const heroTl = heroAnimation();
		introTimeline.add(preloaderTl).add(heroTl, "-=2.4");
		initTerminal();
		initGlobeOptIn();
		hasRunIntro = true;
	}
	runPageInit();
	if (document.querySelector("[data-barba-namespace='work']")) {
		document.body.classList.add("page-is-work");
		initWorkHeaderPinch();
	}
});
