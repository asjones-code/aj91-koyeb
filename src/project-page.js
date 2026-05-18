/**
 * Project detail page: fetch data, render, run GSAP animations.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const API = (window.API_ORIGIN || window.location.origin);

function escapeHtml(s) {
	const div = document.createElement("div");
	div.textContent = s || "";
	return div.innerHTML;
}

function renderStarText(el, text) {
	if (!text) { el.innerHTML = ""; return; }
	el.innerHTML = text.split(/\n\n+/).filter(Boolean)
		.map(p => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
		.join("");
}

// ── 5 focal Mali regions ──────────────────────────────────────────────────────
const MALI_REGIONS = [
	{
		name: "Bamako",     capital: "Bamako",     lat: 12.65, lng: -8.00,
		population: "2.5M", primaryLanguage: "Bambara / French",
		notes: "Federal capital. Highest media density in Mali.",
		risk: 35, globalImpact: 72, localImpact: 88,
	},
	{
		name: "Kayes",      capital: "Kayes",      lat: 14.45, lng: -11.44,
		population: "2.5M", primaryLanguage: "Bambara / Soninke",
		notes: "Border region — Senegal, Mauritania, Guinea. High remittance flows.",
		risk: 62, globalImpact: 48, localImpact: 41,
	},
	{
		name: "Mopti",      capital: "Mopti",      lat: 14.49, lng: -4.20,
		population: "2.6M", primaryLanguage: "Fulfulde / Dogon",
		notes: "Sahel gateway. Security tensions have reduced open-source signal access.",
		risk: 71, globalImpact: 55, localImpact: 47,
	},
	{
		name: "Tombouctou", capital: "Tombouctou", lat: 16.77, lng: -3.00,
		population: "0.7M", primaryLanguage: "Songhay / Tuareg",
		notes: "Historic Saharan crossroads. Limited infrastructure post-conflict.",
		risk: 84, globalImpact: 61, localImpact: 28,
	},
	{
		name: "Gao",        capital: "Gao",        lat: 16.27, lng:  0.00,
		population: "0.7M", primaryLanguage: "Songhay / Tuareg",
		notes: "Eastern Sahel corridor. Recovering from 2012 occupation.",
		risk: 79, globalImpact: 58, localImpact: 32,
	},
];

// ── AllAfrica RSS via rss2json ─────────────────────────────────────────────────
let _cachedStories = null;
let _fetchingStories = null;

function fmtDate(str) {
	if (!str) return "";
	const d = new Date(str);
	if (isNaN(d)) return str.split("T")[0];
	return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function parseRSS(xmlText) {
	const doc = new DOMParser().parseFromString(xmlText, "text/xml");
	const items = Array.from(doc.getElementsByTagName("item"));
	return items.slice(0, 5).map(el => {
		const get = tag => el.getElementsByTagName(tag)[0]?.textContent?.trim() || "";
		const dcDate = el.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", "date")[0]?.textContent?.trim() || "";
		return {
			title: get("title"),
			link:  get("link"),
			date:  fmtDate(get("pubDate") || dcDate),
		};
	}).filter(s => s.title);
}

async function fetchWithTimeout(url, ms = 7000) {
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, { signal: ctrl.signal });
		clearTimeout(t);
		return res;
	} catch (e) {
		clearTimeout(t);
		throw e;
	}
}

async function fetchWestAfricaStories() {
	if (_cachedStories) return _cachedStories;
	if (_fetchingStories) return _fetchingStories;

	const RSS_URL = "https://journaldumali.com/category/politique/securite-terrorisme/feed/";

	_fetchingStories = (async () => {
		// 1. rss2json
		try {
			const res  = await fetchWithTimeout(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`);
			const data = await res.json();
			if (data.status === "ok" && data.items?.length) {
				_cachedStories = data.items.slice(0, 5).map(item => ({
					title: item.title?.trim() || "",
					link:  item.link?.trim()  || "",
					date:  fmtDate(item.pubDate),
				})).filter(s => s.title);
				if (_cachedStories.length) return _cachedStories;
			}
		} catch { /* fall through */ }

		// 2. allorigins /raw (returns raw XML)
		try {
			const res  = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`);
			const xml  = await res.text();
			const items = parseRSS(xml);
			if (items.length) { _cachedStories = items; return _cachedStories; }
		} catch { /* fall through */ }

		// 3. allorigins /get (returns JSON wrapper with .contents)
		try {
			const res  = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`);
			const data = await res.json();
			if (data.contents) {
				const items = parseRSS(data.contents);
				if (items.length) { _cachedStories = items; return _cachedStories; }
			}
		} catch { /* fall through */ }

		return [];
	})();

	return _fetchingStories;
}

// ── Geostory modal ────────────────────────────────────────────────────────────
function createGeoModal() {
	const overlay = document.createElement("div");
	overlay.className = "geostory-modal-overlay";
	overlay.innerHTML = `
		<div class="geostory-modal" role="dialog" aria-modal="true">
			<button class="gsm-close" aria-label="Close">✕</button>

			<div class="gsm-header">
				<div class="gsm-num"></div>
				<div class="gsm-title-wrap">
					<div class="gsm-region-name"></div>
					<div class="gsm-region-meta"></div>
				</div>
			</div>

			<a class="gsm-lead-story" target="_blank" rel="noopener">
				<div class="gsm-lead-date"></div>
				<div class="gsm-lead-title"></div>
				<div class="gsm-lead-source">journaldumali.com →</div>
			</a>

			<div class="gsm-body">
				<div class="gsm-left">
					<div class="gsm-section-label">Signal Profile <span class="gsm-demo-tag">(demo)</span></div>
					<div class="gsm-metrics"></div>
					<div class="gsm-notes-text"></div>
				</div>
				<div class="gsm-right">
					<div class="gsm-section-label">More Stories <span class="gsm-source-tag">Mali</span></div>
					<div class="gsm-stories"></div>
				</div>
			</div>
		</div>
	`;
	document.body.appendChild(overlay);

	const closeBtn   = overlay.querySelector(".gsm-close");
	const leadStory  = overlay.querySelector(".gsm-lead-story");

	const close = () => {
		overlay.classList.remove("is-open");
		document.removeEventListener("keydown", onKey);
	};
	const onKey = (e) => { if (e.key === "Escape") close(); };
	overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
	closeBtn.addEventListener("click", close);

	function metricRow(label, pct, color) {
		return `
			<div class="gsm-metric">
				<div class="gsm-metric-header">
					<span class="gsm-metric-label">${escapeHtml(label)}</span>
					<span class="gsm-metric-val" style="color:${color}">${pct}%</span>
				</div>
				<div class="gsm-metric-track">
					<div class="gsm-metric-bar" style="width:${pct}%;background:${color}"></div>
				</div>
			</div>
		`;
	}

	function riskColor(v) {
		if (v >= 70) return "#ef4444";
		if (v >= 50) return "#f59e0b";
		return "#abf8fe";
	}

	function open(region) {
		const idx = MALI_REGIONS.indexOf(region);
		overlay.querySelector(".gsm-num").textContent = String(idx + 1).padStart(2, "0");
		overlay.querySelector(".gsm-region-name").textContent  = region.name;
		overlay.querySelector(".gsm-region-meta").textContent  = `${region.capital} · ${region.population} · ${region.primaryLanguage}`;
		overlay.querySelector(".gsm-notes-text").textContent   = region.notes;

		overlay.querySelector(".gsm-metrics").innerHTML =
			metricRow("Risk",          region.risk,         riskColor(region.risk)) +
			metricRow("Global Impact", region.globalImpact, "rgba(171,248,254,0.7)") +
			metricRow("Local Impact",  region.localImpact,  "rgba(255,255,255,0.45)");

		// Lead story placeholder
		overlay.querySelector(".gsm-lead-date").textContent  = "fetching…";
		overlay.querySelector(".gsm-lead-title").textContent = "";
		leadStory.removeAttribute("href");

		overlay.querySelector(".gsm-stories").innerHTML =
			`<div class="gsm-stories-loading">loading stories…</div>`;

		overlay.classList.add("is-open");
		document.addEventListener("keydown", onKey);

		fetchWestAfricaStories().then(stories => {
			if (!overlay.classList.contains("is-open")) return;
			if (!stories.length) {
				overlay.querySelector(".gsm-lead-date").textContent  = "—";
				overlay.querySelector(".gsm-lead-title").textContent = "Could not load stories.";
				overlay.querySelector(".gsm-stories").innerHTML      = "";
				return;
			}
			const [first, ...rest] = stories;
			overlay.querySelector(".gsm-lead-date").textContent  = first.date;
			overlay.querySelector(".gsm-lead-title").textContent = first.title;
			leadStory.href = first.link;

			overlay.querySelector(".gsm-stories").innerHTML = rest.map((s, i) => `
				<a class="gsm-story" href="${escapeHtml(s.link)}" target="_blank" rel="noopener">
					<span class="gsm-story-num">${String(i + 2).padStart(2, "0")}</span>
					<span class="gsm-story-body">
						<span class="gsm-story-title">${escapeHtml(s.title)}</span>
						<span class="gsm-story-date">${escapeHtml(s.date)}</span>
					</span>
				</a>
			`).join("");
		});
	}

	return { open, destroy: () => overlay.remove() };
}

// ── Topojson client ───────────────────────────────────────────────────────────
async function loadTopojsonClient() {
	if (window.topojson) return window.topojson;
	return new Promise((resolve, reject) => {
		const s = document.createElement("script");
		s.src     = "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js";
		s.onload  = () => resolve(window.topojson);
		s.onerror = reject;
		document.head.appendChild(s);
	});
}

function latLngToVec3(THREE, lat, lng, r) {
	const phi   = (90 - lat) * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);
	return new THREE.Vector3(
		-r * Math.sin(phi) * Math.cos(theta),
		 r * Math.cos(phi),
		 r * Math.sin(phi) * Math.sin(theta)
	);
}

function addGeoLines(THREE, parent, geojson, r, color, opacity) {
	const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
	const ring = (coords) => {
		if (!coords || coords.length < 2) return;
		parent.add(new THREE.Line(
			new THREE.BufferGeometry().setFromPoints(
				coords.map(([lng, lat]) => latLngToVec3(THREE, lat, lng, r))
			),
			mat.clone()
		));
	};
	const process = (geo) => {
		if (!geo) return;
		if      (geo.type === "LineString")     ring(geo.coordinates);
		else if (geo.type === "MultiLineString") geo.coordinates.forEach(ring);
		else if (geo.type === "Polygon")         geo.coordinates.forEach(ring);
		else if (geo.type === "MultiPolygon")    geo.coordinates.forEach(p => p.forEach(ring));
	};
	if      (geojson.type === "FeatureCollection") geojson.features.forEach(f => process(f.geometry));
	else if (geojson.type === "Feature")            process(geojson.geometry);
	else                                            process(geojson);
}

// ── Geostory Globe ────────────────────────────────────────────────────────────
async function mountDemoGlobe(container) {
	const [
		THREE,
		{ EffectComposer },
		{ RenderPass },
		{ UnrealBloomPass },
	] = await Promise.all([
		import("three"),
		import("three/examples/jsm/postprocessing/EffectComposer.js"),
		import("three/examples/jsm/postprocessing/RenderPass.js"),
		import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
	]);

	const [topojson, worldTopo] = await Promise.all([
		loadTopojsonClient(),
		fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(r => r.json()),
	]);

	// Pre-warm RSS so it's ready when user first clicks
	fetchWestAfricaStories();

	// ── Scaffold ──────────────────────────────────────────────────────────────
	container.innerHTML = "";
	container.style.position = "relative";
	container.style.cursor   = "grab";

	const modal = createGeoModal();

	// ── Scene — tighter FOV, camera closer, pointed at West Africa ───────────
	const scene  = new THREE.Scene();
	// FOV 44 + z 4.4 → zoomed-in view of West Africa without barrel distortion
	const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
	camera.position.set(0, 0, 5.0);

	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
	container.appendChild(renderer.domElement);

	// ── Globe ─────────────────────────────────────────────────────────────────
	const R      = 1.6;
	const loader = new THREE.TextureLoader();
	const colorMap = await new Promise(res =>
		loader.load(
			"https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
			res, undefined, () => res(null)
		)
	);

	const globe = new THREE.Mesh(
		new THREE.SphereGeometry(R, 48, 48),
		colorMap
			? new THREE.MeshStandardMaterial({ map: colorMap, roughness: 0.9, metalness: 0 })
			: new THREE.MeshStandardMaterial({ color: 0x0e2a4a, roughness: 0.9, metalness: 0 })
	);
	scene.add(globe);

	scene.add(new THREE.Mesh(
		new THREE.SphereGeometry(R * 1.03, 48, 48),
		new THREE.MeshBasicMaterial({ color: 0x3399ff, transparent: true, opacity: 0.06, side: THREE.BackSide })
	));

	const sun = new THREE.DirectionalLight(0xffffff, 1.2);
	sun.position.set(5, 5, 5);
	scene.add(sun);
	scene.add(new THREE.AmbientLight(0xffffff, 0.4));

	// ── Geography ─────────────────────────────────────────────────────────────
	// World country borders — faint
	addGeoLines(THREE, globe,
		topojson.mesh(worldTopo, worldTopo.objects.countries, (a, b) => a !== b),
		R + 0.002, 0xffffff, 0.055);
	// Coastlines
	addGeoLines(THREE, globe,
		topojson.feature(worldTopo, worldTopo.objects.land),
		R + 0.001, 0xffffff, 0.09);
	// Mali country outline — bright cyan (ID 466)
	addGeoLines(THREE, globe,
		topojson.feature(worldTopo, {
			type: "GeometryCollection",
			geometries: worldTopo.objects.countries.geometries.filter(g => +g.id === 466),
		}),
		R + 0.004, 0xabf8fe, 0.55);

	// ── 5 region dots ─────────────────────────────────────────────────────────
	const hitMeshes   = [];
	const pulseMeshes = [];

	MALI_REGIONS.forEach((region) => {
		const pos = latLngToVec3(THREE, region.lat, region.lng, R + 0.012);

		const dot = new THREE.Mesh(
			new THREE.SphereGeometry(0.014, 16, 16),
			new THREE.MeshBasicMaterial({ color: 0xabf8fe })
		);
		dot.position.copy(pos);
		globe.add(dot);

		const hit = new THREE.Mesh(
			new THREE.SphereGeometry(0.030, 8, 8),
			new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
		);
		hit.position.copy(pos);
		hit.userData.region = region;
		globe.add(hit);
		hitMeshes.push(hit);

		const pulse = new THREE.Mesh(
			new THREE.SphereGeometry(0.014, 16, 16),
			new THREE.MeshBasicMaterial({ color: 0xabf8fe, transparent: true, opacity: 0 })
		);
		pulse.position.copy(pos);
		globe.add(pulse);
		pulseMeshes.push({ mesh: pulse, phase: Math.random() });
	});

	function updatePulse() {
		const t = Date.now() / 1000;
		pulseMeshes.forEach(({ mesh, phase }) => {
			const cycle = (t * 0.4 + phase) % 1;
			mesh.scale.setScalar(1 + cycle * 5.5);
			mesh.material.opacity = Math.max(0, 0.5 * (1 - cycle));
		});
	}

	// ── Bloom — subtle, dots glow, earth stays clean ─────────────────────────
	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	composer.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), 0.28, 0.5, 0.12));

	// ── Resize ────────────────────────────────────────────────────────────────
	function resize() {
		const w = container.clientWidth || 480;
		const h = container.clientHeight || 480;
		if (w <= 0 || h <= 0) return;
		renderer.setSize(w, h);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		composer.setSize(w, h);
	}
	const ro = new ResizeObserver(resize);
	ro.observe(container);
	requestAnimationFrame(resize);

	// ── Hover tooltip ─────────────────────────────────────────────────────────
	const tooltip = document.createElement("div");
	tooltip.className = "geostory-tooltip";
	document.body.appendChild(tooltip);

	function showTooltip(cx, cy, region) {
		const riskColor = region.risk >= 70 ? "#ef4444" : region.risk >= 50 ? "#f59e0b" : "#abf8fe";
		tooltip.innerHTML = `
			<div class="gs-region">${escapeHtml(region.name)}</div>
			<div class="gs-capital">${escapeHtml(region.capital)}</div>
			<div class="gs-divider"></div>
			<div class="gs-row">
				<span class="gs-label">Risk</span>
				<span class="gs-val" style="color:${riskColor}">${region.risk}%</span>
			</div>
			<div class="gs-row">
				<span class="gs-label">Global Impact</span>
				<span class="gs-val">${region.globalImpact}%</span>
			</div>
			<div class="gs-hint">click for full datamap</div>
		`;
		const tw   = 175;
		const pad  = 14;
		const left = cx + pad + tw > window.innerWidth ? cx - tw - pad : cx + pad;
		tooltip.style.left = `${left}px`;
		tooltip.style.top  = `${cy + 8}px`;
		tooltip.classList.add("is-visible");
	}
	function hideTooltip() { tooltip.classList.remove("is-visible"); }

	// ── Raycaster ─────────────────────────────────────────────────────────────
	const raycaster = new THREE.Raycaster();
	const mouse     = new THREE.Vector2(-9999, -9999);

	function pickDot(clientX, clientY) {
		const rect = renderer.domElement.getBoundingClientRect();
		mouse.x =  ((clientX - rect.left) / rect.width)  * 2 - 1;
		mouse.y = -((clientY - rect.top)  / rect.height) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		const hits = raycaster.intersectObjects(hitMeshes);
		return hits.length ? hits[0].object.userData.region : null;
	}

	// ── Interaction state ─────────────────────────────────────────────────────
	let isDragging = false, prevX = 0, prevY = 0, momX = 0, momY = 0;
	let isHovering = false;  // true when mouse is over a dot → freeze globe
	let didDrag    = false;

	const onDown = (e) => {
		const cx = e.touches ? e.touches[0].clientX : e.clientX;
		const cy = e.touches ? e.touches[0].clientY : e.clientY;
		isDragging = true; didDrag = false;
		prevX = cx; prevY = cy; momX = 0; momY = 0;
		isHovering = false;
		hideTooltip();
		container.style.cursor = "grabbing";
		if (e.cancelable) e.preventDefault();
	};

	const onMove = (e) => {
		const cx = e.touches ? e.touches[0].clientX : e.clientX;
		const cy = e.touches ? e.touches[0].clientY : e.clientY;
		if (isDragging) {
			const dx = cx - prevX, dy = cy - prevY;
			if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag = true;
			momX = dx * 0.0045; momY = dy * 0.002;
			prevX = cx; prevY = cy;
			isHovering = false;
		} else {
			const hit = pickDot(cx, cy);
			if (hit) {
				showTooltip(cx, cy, hit);
				isHovering = true;
				container.style.cursor = "pointer";
			} else {
				hideTooltip();
				isHovering = false;
				container.style.cursor = "grab";
			}
		}
	};

	const onUp = () => { isDragging = false; container.style.cursor = "grab"; };

	// Mobile tap: e.preventDefault() in touchstart blocks synthetic click, so handle tap here
	const onTouchEnd = (e) => {
		isDragging = false;
		container.style.cursor = "grab";
		if (!didDrag && e.changedTouches.length) {
			const t = e.changedTouches[0];
			const hit = pickDot(t.clientX, t.clientY);
			if (hit) { hideTooltip(); modal.open(hit); }
		}
	};

	const onLeave = () => { hideTooltip(); isHovering = false; };

	const onClick = (e) => {
		if (didDrag) return;
		const hit = pickDot(e.clientX, e.clientY);
		if (hit) { hideTooltip(); modal.open(hit); }
	};

	container.addEventListener("mousedown",  onDown,      { passive: false });
	container.addEventListener("touchstart", onDown,      { passive: false });
	window.addEventListener("mousemove",     onMove);
	container.addEventListener("touchmove",  onMove,      { passive: true });
	window.addEventListener("mouseup",       onUp);
	container.addEventListener("touchend",   onTouchEnd);
	container.addEventListener("click",      onClick);
	container.addEventListener("mouseleave", onLeave);

	// ── Initial orientation — Mali centred, no auto-rotation ─────────────────
	// rotation.y = (targetLng + 90) * PI/180 puts that lng facing the camera
	globe.rotation.y = (-4 + 90) * (Math.PI / 180);   // West Africa centred
	globe.rotation.x =  12 * (Math.PI / 180);          // slight north tilt

	// ── Label ─────────────────────────────────────────────────────────────────
	const label = document.createElement("div");
	label.className = "demo-globe-label";
	label.innerHTML = `
		<span class="demo-globe-title">Geostory Globe — Mali</span>
		<span class="demo-globe-sub">West Africa · 5 regions · click a dot</span>
	`;
	container.appendChild(label);

	// ── Render loop — no auto-rotate, pauses on hover ─────────────────────────
	let raf;
	const animate = () => {
		raf = requestAnimationFrame(animate);
		if (!isHovering) {
			// Apply momentum decay only when not hovering
			if (isDragging) {
				globe.rotation.y += momX;
				globe.rotation.x  = Math.max(-0.45, Math.min(0.45, globe.rotation.x + momY));
			} else if (momX !== 0 || momY !== 0) {
				momX *= 0.92; momY *= 0.92;
				// Snap to zero below threshold to stop drift
				if (Math.abs(momX) < 0.0001) momX = 0;
				if (Math.abs(momY) < 0.0001) momY = 0;
				globe.rotation.y += momX;
				globe.rotation.x  = Math.max(-0.45, Math.min(0.45, globe.rotation.x + momY));
			}
			// No auto-rotate when idle
		}
		updatePulse();
		composer.render();
	};
	animate();

	return () => {
		cancelAnimationFrame(raf);
		ro.disconnect();
		tooltip.remove();
		modal.destroy();
		container.removeEventListener("mousedown",  onDown);
		container.removeEventListener("touchstart", onDown);
		window.removeEventListener("mousemove",     onMove);
		container.removeEventListener("touchmove",  onMove);
		window.removeEventListener("mouseup",       onUp);
		container.removeEventListener("touchend",   onTouchEnd);
		container.removeEventListener("click",      onClick);
		container.removeEventListener("mouseleave", onLeave);
		renderer.dispose();
	};
}

// ── Scroll-scrubbed video ─────────────────────────────────────────────────────
function setupScrollScrub(video, section) {
	video.removeAttribute("autoplay");
	video.pause();
	video.muted       = true;
	video.preload     = "auto";
	video.currentTime = 0;

	const hint = document.getElementById("lead-scroll-hint");

	video.addEventListener("loadedmetadata", () => {
		const dur = video.duration;
		if (!isFinite(dur) || dur <= 0) return;

		// Pin section for one viewport-height of extra scroll while video scrubs
		ScrollTrigger.create({
			trigger: section,
			start: "top top",
			end:   `+=${window.innerHeight}`,
			pin:   true,
			pinSpacing: true,
			onUpdate: self => {
				video.currentTime = self.progress * dur;
			},
		});

		// Show scroll hint for 2.5 s, then fade out
		if (hint) {
			hint.style.display = "block";
			setTimeout(() => hint.classList.add("is-gone"), 2500);
		}
	}, { once: true });

	// Load metadata without playing
	video.load();
}

// ── Demo module registry ──────────────────────────────────────────────────────
const DEMO_MODULES = {
	globe_geojson: { label: "Geostory Globe", mount: mountDemoGlobe },
};

// ── GSAP scroll animations ────────────────────────────────────────────────────
function runAnimations() {
	window.addEventListener("scroll", () => {
		const h   = document.documentElement.scrollHeight - window.innerHeight;
		const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
		const el  = document.getElementById("scroll-indicator");
		if (el) el.style.width = pct + "%";
	});
	gsap.to(".project-hero-media", {
		scrollTrigger: { trigger: ".project-hero", start: "top bottom", end: "center center", scrub: true },
		scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out"
	});
	gsap.to(".project-hero-text p", {
		scrollTrigger: { trigger: ".project-hero", start: "top bottom", end: "center center", scrub: true },
		y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out"
	});
	document.querySelectorAll(".project-gallery-item img, .project-gallery-item video").forEach((el, i) => {
		gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, {
			clipPath: "inset(0% 0 0 0)",
			scrollTrigger: { trigger: el.parentElement, start: "top bottom-=100", end: "bottom top+=100", scrub: true },
			duration: 1.2, delay: i * 0.1, ease: "power2.out"
		});
	});
	document.querySelectorAll(".project-star-item").forEach((el, i) => {
		gsap.fromTo(el,
			{ opacity: 0, y: 30, filter: "blur(4px)" },
			{
				opacity: 1, y: 0, filter: "blur(0px)",
				scrollTrigger: { trigger: el, start: "top bottom-=80", end: "top center", scrub: false },
				duration: 0.7, delay: i * 0.08, ease: "power2.out"
			}
		);
	});
	gsap.to(".project-gallery-caption", {
		scrollTrigger: { trigger: ".project-gallery", start: "top bottom", end: "center center", scrub: true },
		y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out"
	});
	gsap.to(".project-footer-cta", {
		scrollTrigger: { trigger: ".project-footer", start: "top bottom-=200", end: "center center", scrub: true },
		y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out"
	});
}

// ── Page init ─────────────────────────────────────────────────────────────────
export async function init(opts = {}) {
	const slug = opts.slug ?? new URL(opts.url || window.location.href, window.location.origin).searchParams.get("slug");

	if (!slug) {
		document.getElementById("project-loading").style.display = "none";
		const errEl = document.getElementById("project-error");
		errEl.textContent = "No project specified.";
		errEl.style.display = "block";
		return;
	}

	try {
		const r    = await fetch(API + "/api/projects/" + encodeURIComponent(slug));
		const data = await r.json();
		document.getElementById("project-loading").style.display = "none";

		if (data.error) {
			document.getElementById("project-error").textContent = data.error || "Project not found.";
			document.getElementById("project-error").style.display = "block";
			return;
		}

		const p = data.project;
		document.title = (p.title || "Project") + " — AJ91";
		document.getElementById("project-content").style.display = "block";
		document.getElementById("project-title").textContent = p.title || "Untitled";

		const heroMedia = document.getElementById("project-hero-media");
		const heroImg   = document.getElementById("project-hero-img");
		const heroVideo = document.getElementById("project-hero-video");
		if (p.hero_image) {
			heroVideo.style.display = "none";
			heroImg.src = p.hero_image; heroImg.alt = p.title;
			heroImg.style.display = "block";
		} else if (p.hero_video) {
			heroImg.style.display = "none";
			heroVideo.src = p.hero_video;
			heroVideo.style.display = "block";
			heroVideo.load(); heroVideo.play().catch(() => {});
		} else {
			heroMedia.style.display = "none";
		}

		document.getElementById("project-about").textContent = p.about_text || p.excerpt || "";

		const starSection = document.getElementById("project-star");
		const starFields  = [
			{ id: "project-star-s-text", value: p.star_situation },
			{ id: "project-star-t-text", value: p.star_task },
			{ id: "project-star-a-text", value: p.star_action },
			{ id: "project-star-r-text", value: p.star_result },
		];
		if (starFields.some(f => f.value)) {
			starFields.forEach(f => {
				const el   = document.getElementById(f.id);
				const item = el?.closest(".project-star-item");
				if (f.value) { renderStarText(el, f.value); if (item) item.style.display = ""; }
				else          { if (item) item.style.display = "none"; }
			});
			starSection.style.display = "block";
		}

		const isVideo = (url) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || "");
		const allMedia = (p.galleryImages || []);

		// ── First item → above Situation ──────────────────────────────────────
		const leadUrl     = allMedia[0] || null;
		const leadSection = document.getElementById("project-lead-media");
		const leadInner   = document.getElementById("project-lead-media-inner");

		if (leadUrl) {
			const safe = escapeHtml(leadUrl);
			if (isVideo(leadUrl)) {
				leadInner.innerHTML = `<video src="${safe}" playsinline muted></video>`;
				const vid = leadInner.querySelector("video");
				setupScrollScrub(vid, leadSection);
			} else {
				leadInner.innerHTML = `<img src="${safe}" alt="">`;
				// Hide hint — only relevant for videos
				const hint = document.getElementById("lead-scroll-hint");
				if (hint) hint.style.display = "none";
			}
			leadSection.style.display = "block";
		}

		// ── Remaining items 2–3 + demo slot → gallery grid ───────────────────
		const galleryGrid  = document.getElementById("project-gallery-grid");
		const galleryItems = allMedia.slice(1, 3);
		const demoConfig   = p.demo_config || {};
		const activeDemo   = Object.keys(DEMO_MODULES).find(k => demoConfig[k]);

		if (galleryItems.length > 0 || activeDemo) {
			if (galleryItems.length + (activeDemo ? 1 : 0) >= 2) {
				galleryGrid.classList.add("project-gallery-grid--2col");
			}
			if (galleryItems.length > 0) {
				galleryGrid.innerHTML = galleryItems.map(url => {
					const s = escapeHtml(url);
					return isVideo(url)
						? `<div class="project-gallery-item"><video src="${s}" playsinline muted loop autoplay></video></div>`
						: `<div class="project-gallery-item"><img src="${s}" alt=""></div>`;
				}).join("");
				galleryGrid.querySelectorAll("video").forEach(v => v.play().catch(() => {}));
			}
			if (activeDemo) {
				const demoItem = document.createElement("div");
				demoItem.className = "project-gallery-item project-gallery-item--demo";
				galleryGrid.appendChild(demoItem);
				DEMO_MODULES[activeDemo].mount(demoItem).catch(console.error);
			}
		} else {
			document.getElementById("project-gallery").style.display = "none";
		}

		document.getElementById("project-gallery-caption").textContent = p.gallery_caption || "";

		const footerCta = document.getElementById("project-footer-cta");
		if (p.footer_email || p.footer_cta) {
			const email = p.footer_email || "asjones91@gmail.com";
			footerCta.innerHTML = `<a href="mailto:${escapeHtml(email)}" class="cta-label">${escapeHtml(p.footer_cta || "Get in touch")}</a><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`;
		}

		runAnimations();
	} catch {
		document.getElementById("project-loading").style.display = "none";
		document.getElementById("project-error").textContent = "Failed to load project.";
		document.getElementById("project-error").style.display = "block";
	}
}
