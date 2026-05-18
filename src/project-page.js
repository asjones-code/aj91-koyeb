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

/** Render text with paragraph breaks (double newline) and line breaks (single newline). */
function renderStarText(el, text) {
	if (!text) { el.innerHTML = ""; return; }
	const paragraphs = text.split(/\n\n+/).filter(Boolean);
	el.innerHTML = paragraphs
		.map(p => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
		.join("");
}

// ── Mali region data ──────────────────────────────────────────────────────────
const MALI_REGIONS = [
	{
		name: "Bamako",         capital: "Bamako",
		lat:  12.65, lng: -8.00,
		population: "2.5M",    radioStations: 35, broadcastCoverage: 94,
		electionTurnout: 27,   primaryLanguage: "Bambara / French",
		notes: "Federal capital district. Highest media density in Mali.",
	},
	{
		name: "Kayes",          capital: "Kayes",
		lat:  14.45, lng: -11.44,
		population: "2.5M",    radioStations: 18, broadcastCoverage: 42,
		electionTurnout: 34,   primaryLanguage: "Bambara / Soninke",
		notes: "Border region — Senegal, Mauritania, Guinea. High remittance dependence.",
	},
	{
		name: "Koulikoro",      capital: "Koulikoro",
		lat:  13.80, lng: -7.56,
		population: "2.7M",    radioStations: 22, broadcastCoverage: 61,
		electionTurnout: 38,   primaryLanguage: "Bambara",
		notes: "Surrounds Bamako. Strong agricultural broadcast coverage.",
	},
	{
		name: "Sikasso",        capital: "Sikasso",
		lat:  11.32, lng: -5.67,
		population: "3.0M",    radioStations: 25, broadcastCoverage: 54,
		electionTurnout: 41,   primaryLanguage: "Bambara / Minianka",
		notes: "Most fertile region. Borders Côte d'Ivoire & Burkina Faso.",
	},
	{
		name: "Ségou",          capital: "Ségou",
		lat:  13.45, lng: -6.27,
		population: "2.7M",    radioStations: 20, broadcastCoverage: 59,
		electionTurnout: 36,   primaryLanguage: "Bambara / Bozo",
		notes: "Niger River delta agriculture. Strong community radio network.",
	},
	{
		name: "Mopti",          capital: "Mopti",
		lat:  14.49, lng: -4.20,
		population: "2.6M",    radioStations: 19, broadcastCoverage: 48,
		electionTurnout: 29,   primaryLanguage: "Fulfulde / Dogon",
		notes: "Gateway to the Sahel. Security tensions reduced broadcast access.",
	},
	{
		name: "Tombouctou",     capital: "Tombouctou",
		lat:  16.77, lng: -3.00,
		population: "0.7M",    radioStations: 8,  broadcastCoverage: 29,
		electionTurnout: 22,   primaryLanguage: "Songhay / Tuareg",
		notes: "Historic Saharan crossroads. Limited infrastructure post-conflict.",
	},
	{
		name: "Gao",            capital: "Gao",
		lat:  16.27, lng:  0.00,
		population: "0.7M",    radioStations: 10, broadcastCoverage: 33,
		electionTurnout: 25,   primaryLanguage: "Songhay / Tuareg",
		notes: "Eastern Sahel. Recovering from 2012 occupation.",
	},
	{
		name: "Kidal",          capital: "Kidal",
		lat:  18.44, lng:  1.41,
		population: "0.07M",   radioStations: 4,  broadcastCoverage: 18,
		electionTurnout: 11,   primaryLanguage: "Tamashek (Tuareg)",
		notes: "Remote northern region. Contested governance since 2012.",
	},
	{
		name: "Ménaka",         capital: "Ménaka",
		lat:  15.92, lng:  2.40,
		population: "0.08M",   radioStations: 3,  broadcastCoverage: 15,
		electionTurnout: 14,   primaryLanguage: "Songhay / Tuareg",
		notes: "Newly created region (2016). Minimal broadcast infrastructure.",
	},
	{
		name: "Taoudénit",      capital: "Taoudénit",
		lat:  22.67, lng: -3.98,
		population: "0.04M",   radioStations: 2,  broadcastCoverage: 10,
		electionTurnout: 8,    primaryLanguage: "Tamashek / Hassaniya",
		notes: "Vast Saharan region. Near-zero terrestrial broadcast coverage.",
	},
];

// ── Topojson client (UMD via script tag) ──────────────────────────────────────
async function loadTopojsonClient() {
	if (window.topojson) return window.topojson;
	return new Promise((resolve, reject) => {
		const s    = document.createElement("script");
		s.src      = "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js";
		s.onload   = () => resolve(window.topojson);
		s.onerror  = reject;
		document.head.appendChild(s);
	});
}

// ── Lat/lng → Three.js Vector3 on a sphere ────────────────────────────────────
function latLngToVec3(THREE, lat, lng, r) {
	const phi   = (90 - lat) * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);
	return new THREE.Vector3(
		-r * Math.sin(phi) * Math.cos(theta),
		 r * Math.cos(phi),
		 r * Math.sin(phi) * Math.sin(theta)
	);
}

// ── Draw any GeoJSON geometry as THREE.Lines on `parent` ─────────────────────
function addGeoLines(THREE, parent, geojson, r, color, opacity) {
	const mat = new THREE.LineBasicMaterial({
		color, transparent: opacity < 1, opacity, depthWrite: false,
	});

	const ring = (coords) => {
		if (!coords || coords.length < 2) return;
		const pts = coords.map(([lng, lat]) => latLngToVec3(THREE, lat, lng, r));
		parent.add(
			new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat.clone())
		);
	};

	const process = (geo) => {
		if (!geo) return;
		switch (geo.type) {
			case "LineString":      ring(geo.coordinates); break;
			case "MultiLineString": geo.coordinates.forEach(ring); break;
			case "Polygon":         geo.coordinates.forEach(ring); break;
			case "MultiPolygon":    geo.coordinates.forEach(p => p.forEach(ring)); break;
		}
	};

	if      (geojson.type === "FeatureCollection") geojson.features.forEach(f => process(f.geometry));
	else if (geojson.type === "Feature")            process(geojson.geometry);
	else                                            process(geojson);
}

// ── Geostory Globe Demo ───────────────────────────────────────────────────────
async function mountDemoGlobe(container) {
	// Three.js + post-processing (dynamic imports, only loaded when demo is on)
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

	// Geographic data — load in parallel, Mali ADM1 is best-effort
	const [topojson, worldTopo, maliADM1] = await Promise.all([
		loadTopojsonClient(),
		fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(r => r.json()),
		fetch("https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/CGAZ/ADM1/geoBoundaries-MLI-ADM1_simplified.geojson")
			.then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
			.catch(() => null),
	]);

	// ── Scaffold ──────────────────────────────────────────────────────────────
	container.innerHTML = "";
	container.style.position = "relative";
	container.style.cursor   = "grab";

	// ── Scene / camera / renderer ─────────────────────────────────────────────
	const scene  = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
	camera.position.z = 5;

	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	Object.assign(renderer.domElement.style, {
		position: "absolute", inset: "0", width: "100%", height: "100%",
	});
	container.appendChild(renderer.domElement);

	// ── Globe — earth colour texture only (bump 404s on some hosts) ───────────
	const R       = 1.6;
	const loader  = new THREE.TextureLoader();
	// Load colour map; treat errors as non-fatal so globe still renders
	const colorMap = await new Promise(res => {
		loader.load(
			"https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
			res,
			undefined,
			() => res(null)   // 404 fallback — globe will render with flat colour
		);
	});

	const globeMat = colorMap
		? new THREE.MeshStandardMaterial({ map: colorMap, roughness: 0.9, metalness: 0 })
		: new THREE.MeshStandardMaterial({ color: 0x0e2a4a, roughness: 0.9, metalness: 0 });

	const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 48, 48), globeMat);
	scene.add(globe);

	// Atmosphere halo
	scene.add(new THREE.Mesh(
		new THREE.SphereGeometry(R * 1.03, 48, 48),
		new THREE.MeshBasicMaterial({
			color: 0x3399ff, transparent: true, opacity: 0.07, side: THREE.BackSide,
		})
	));

	// Lights
	const sun = new THREE.DirectionalLight(0xffffff, 1.2);
	sun.position.set(5, 5, 5);
	scene.add(sun);
	scene.add(new THREE.AmbientLight(0xffffff, 0.4));

	// ── World borders (topojson → GeoJSON lines) ──────────────────────────────
	// Country-to-country borders, faint
	const countryBorders = topojson.mesh(
		worldTopo, worldTopo.objects.countries, (a, b) => a !== b
	);
	addGeoLines(THREE, globe, countryBorders, R + 0.002, 0xffffff, 0.055);

	// Land outlines (coastlines) slightly brighter
	const land = topojson.feature(worldTopo, worldTopo.objects.land);
	addGeoLines(THREE, globe, land, R + 0.001, 0xffffff, 0.09);

	// ── Mali country highlight (ID 466 in world atlas) ────────────────────────
	const maliCountryGeo = topojson.feature(worldTopo, {
		type: "GeometryCollection",
		geometries: worldTopo.objects.countries.geometries.filter(g => +g.id === 466),
	});
	addGeoLines(THREE, globe, maliCountryGeo, R + 0.004, 0xabf8fe, 0.5);

	// ── Mali ADM1 region lines (best-effort) ──────────────────────────────────
	if (maliADM1) {
		addGeoLines(THREE, globe, maliADM1, R + 0.006, 0xabf8fe, 0.8);
	}

	// ── Region dots ───────────────────────────────────────────────────────────
	const hitMeshes   = [];
	const pulseMeshes = [];

	MALI_REGIONS.forEach((region) => {
		const pos = latLngToVec3(THREE, region.lat, region.lng, R + 0.012);

		// Visible core dot
		const dot = new THREE.Mesh(
			new THREE.SphereGeometry(0.013, 16, 16),
			new THREE.MeshBasicMaterial({ color: 0xabf8fe })
		);
		dot.position.copy(pos);
		globe.add(dot);

		// Invisible hit sphere (wider target)
		const hit = new THREE.Mesh(
			new THREE.SphereGeometry(0.026, 8, 8),
			new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
		);
		hit.position.copy(pos);
		hit.userData.region = region;
		globe.add(hit);
		hitMeshes.push(hit);

		// Pulse shell
		const pulse = new THREE.Mesh(
			new THREE.SphereGeometry(0.013, 16, 16),
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

	// ── Post-processing: bloom only (no ShaderPass — avoids readonly error) ───
	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 1.1, 0.4, 0.0);
	composer.addPass(bloom);

	// ── Resize ────────────────────────────────────────────────────────────────
	function resize() {
		const w = container.clientWidth  || 480;
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

	// ── Tooltip ───────────────────────────────────────────────────────────────
	const tooltip = document.createElement("div");
	tooltip.className = "geostory-tooltip";
	document.body.appendChild(tooltip);

	function showTooltip(cx, cy, region) {
		const cov = region.broadcastCoverage;
		const trn = region.electionTurnout;
		const covColor = cov > 55 ? "#abf8fe" : cov > 30 ? "#f59e0b" : "#ef4444";
		tooltip.innerHTML = `
			<div class="gs-region">${escapeHtml(region.name)}</div>
			<div class="gs-capital">${escapeHtml(region.capital)}</div>
			<div class="gs-divider"></div>
			<div class="gs-row">
				<span class="gs-label">Population</span>
				<span class="gs-val">${escapeHtml(region.population)}</span>
			</div>
			<div class="gs-row">
				<span class="gs-label">Radio Stations</span>
				<span class="gs-val">${region.radioStations}</span>
			</div>
			<div class="gs-row gs-row--bar">
				<span class="gs-label">Broadcast Coverage</span>
				<span class="gs-val">${cov}%</span>
			</div>
			<div class="gs-bar-wrap">
				<div class="gs-bar-fill" style="width:${cov}%;background:${covColor}"></div>
			</div>
			<div class="gs-row gs-row--bar">
				<span class="gs-label">Election Turnout</span>
				<span class="gs-val">${trn}%</span>
			</div>
			<div class="gs-bar-wrap">
				<div class="gs-bar-fill" style="width:${trn}%;background:rgba(171,248,254,0.45)"></div>
			</div>
			<div class="gs-notes">${escapeHtml(region.notes)}</div>
		`;
		const tw   = 230;
		const pad  = 14;
		const left = cx + pad + tw > window.innerWidth ? cx - tw - pad : cx + pad;
		tooltip.style.left = `${left}px`;
		tooltip.style.top  = `${cy + 8}px`;
		tooltip.classList.add("is-visible");
	}

	function hideTooltip() {
		tooltip.classList.remove("is-visible");
	}

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

	// ── Drag (same momentum model as hero globe) ──────────────────────────────
	let isDragging = false, prevX = 0, prevY = 0, momX = 0, momY = 0;
	let tooltipActive = false;

	const onDown = (e) => {
		const cx = e.touches ? e.touches[0].clientX : e.clientX;
		const cy = e.touches ? e.touches[0].clientY : e.clientY;
		isDragging = true;
		prevX = cx; prevY = cy;
		momX = 0;   momY = 0;
		hideTooltip();
		tooltipActive = false;
		container.style.cursor = "grabbing";
		if (e.cancelable) e.preventDefault();
	};
	const onMove = (e) => {
		const cx = e.touches ? e.touches[0].clientX : e.clientX;
		const cy = e.touches ? e.touches[0].clientY : e.clientY;
		if (isDragging) {
			momX = (cx - prevX) * 0.0045;
			momY = (cy - prevY) * 0.002;
			prevX = cx; prevY = cy;
		} else {
			const hit = pickDot(cx, cy);
			if (hit) {
				showTooltip(cx, cy, hit);
				tooltipActive = true;
				container.style.cursor = "pointer";
			} else {
				hideTooltip();
				tooltipActive = false;
				container.style.cursor = "grab";
			}
		}
	};
	const onUp = () => {
		isDragging = false;
		container.style.cursor = "grab";
	};
	const onClick = (e) => {
		if (isDragging) return;
		const hit = pickDot(e.clientX, e.clientY);
		if (hit) { showTooltip(e.clientX, e.clientY, hit); tooltipActive = true; }
		else      { hideTooltip(); tooltipActive = false; }
	};

	container.addEventListener("mousedown",  onDown,  { passive: false });
	container.addEventListener("touchstart", onDown,  { passive: false });
	window.addEventListener("mousemove",     onMove);
	container.addEventListener("touchmove",  onMove,  { passive: true });
	window.addEventListener("mouseup",       onUp);
	container.addEventListener("touchend",   onUp);
	container.addEventListener("click",      onClick);
	container.addEventListener("mouseleave", hideTooltip);

	// ── Initial rotation — face Mali (lng ≈ −2 → rotation.y ≈ 88°) ───────────
	// Formula: rotation.y = (targetLng + 90) * PI/180
	globe.rotation.y = (-2 + 90) * (Math.PI / 180);
	globe.rotation.x =  14 * (Math.PI / 180);  // slight northward tilt

	// ── Label ─────────────────────────────────────────────────────────────────
	const label = document.createElement("div");
	label.className = "demo-globe-label";
	label.innerHTML = `
		<span class="demo-globe-title">Geostory Globe — Mali</span>
		<span class="demo-globe-sub">Radio broadcast signals · 11 regions · hover a dot</span>
	`;
	container.appendChild(label);

	// ── Render loop ───────────────────────────────────────────────────────────
	let raf;
	const animate = () => {
		raf = requestAnimationFrame(animate);
		if (!tooltipActive) {
			if (isDragging) {
				globe.rotation.y += momX;
				globe.rotation.x  = Math.max(-0.45, Math.min(0.45, globe.rotation.x + momY));
			} else {
				momX *= 0.94; momY *= 0.94;
				globe.rotation.y += 0.0007 + momX;
				globe.rotation.x  = Math.max(-0.45, Math.min(0.45, globe.rotation.x + momY));
			}
		}
		updatePulse();
		composer.render();
	};
	animate();

	return () => {
		cancelAnimationFrame(raf);
		ro.disconnect();
		tooltip.remove();
		container.removeEventListener("mousedown",  onDown);
		container.removeEventListener("touchstart", onDown);
		window.removeEventListener("mousemove",     onMove);
		container.removeEventListener("touchmove",  onMove);
		window.removeEventListener("mouseup",       onUp);
		container.removeEventListener("touchend",   onUp);
		container.removeEventListener("click",      onClick);
		container.removeEventListener("mouseleave", hideTooltip);
		renderer.dispose();
	};
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

		// ── STAR sections ─────────────────────────────────────────────────────
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

		// ── Gallery: up to 3 media + optional demo slot ───────────────────────
		const galleryGrid = document.getElementById("project-gallery-grid");
		const mediaItems  = (p.galleryImages || []).slice(0, 3);
		const demoConfig  = p.demo_config || {};
		const activeDemo  = Object.keys(DEMO_MODULES).find(k => demoConfig[k]);
		const isVideo     = (url) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || "");

		if (mediaItems.length > 0 || activeDemo) {
			if (mediaItems.length + (activeDemo ? 1 : 0) >= 3) {
				galleryGrid.classList.add("project-gallery-grid--2col");
			}
			if (mediaItems.length > 0) {
				galleryGrid.innerHTML = mediaItems.map(url => {
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
