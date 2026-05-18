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

// ── DRC province centroids for the geostory globe demo ─────────────────────
const DRC_PROVINCES = [
	{ name: "Kinshasa",       lat: -4.32,  lng: 15.32,  signal: 0.92 },
	{ name: "Kongo Central",  lat: -5.40,  lng: 14.20,  signal: 0.78 },
	{ name: "Kwango",         lat: -6.50,  lng: 16.90,  signal: 0.54 },
	{ name: "Kwilu",          lat: -4.50,  lng: 18.20,  signal: 0.67 },
	{ name: "Mai-Ndombe",     lat: -2.40,  lng: 18.30,  signal: 0.45 },
	{ name: "Équateur",       lat:  0.10,  lng: 19.50,  signal: 0.38 },
	{ name: "Tshuapa",        lat: -0.50,  lng: 22.50,  signal: 0.29 },
	{ name: "Mongala",        lat:  1.70,  lng: 21.50,  signal: 0.33 },
	{ name: "Nord-Ubangi",    lat:  3.80,  lng: 22.20,  signal: 0.41 },
	{ name: "Sud-Ubangi",     lat:  3.20,  lng: 19.90,  signal: 0.36 },
	{ name: "Maniema",        lat: -3.20,  lng: 27.00,  signal: 0.52 },
	{ name: "Nord-Kivu",      lat: -0.70,  lng: 29.00,  signal: 0.88 },
	{ name: "Sud-Kivu",       lat: -3.00,  lng: 28.20,  signal: 0.83 },
	{ name: "Ituri",          lat:  1.70,  lng: 29.00,  signal: 0.71 },
	{ name: "Haut-Uélé",      lat:  3.80,  lng: 28.00,  signal: 0.44 },
	{ name: "Bas-Uélé",       lat:  3.00,  lng: 25.00,  signal: 0.40 },
	{ name: "Tshopo",         lat:  1.00,  lng: 25.50,  signal: 0.48 },
	{ name: "Sankuru",        lat: -3.50,  lng: 24.50,  signal: 0.39 },
	{ name: "Kasaï",          lat: -5.20,  lng: 22.00,  signal: 0.61 },
	{ name: "Kasaï-Central",  lat: -5.90,  lng: 21.60,  signal: 0.58 },
	{ name: "Kasaï-Oriental", lat: -6.50,  lng: 24.00,  signal: 0.63 },
	{ name: "Lomami",         lat: -6.00,  lng: 25.00,  signal: 0.55 },
	{ name: "Haut-Lomami",    lat: -8.50,  lng: 27.00,  signal: 0.49 },
	{ name: "Tanganyika",     lat: -6.50,  lng: 28.50,  signal: 0.57 },
	{ name: "Haut-Katanga",   lat: -10.50, lng: 27.50,  signal: 0.74 },
	{ name: "Lualaba",        lat: -9.50,  lng: 25.00,  signal: 0.66 },
];

const GLOBE_R = 1.5;

function latLngToVec3(lat, lng, r = GLOBE_R) {
	const phi   = (90 - lat)  * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);
	return {
		x: -r * Math.sin(phi) * Math.cos(theta),
		y:  r * Math.cos(phi),
		z:  r * Math.sin(phi) * Math.sin(theta),
	};
}

/** Signal 0–1 → color between amber (low) and cyan (high) */
function signalColor(THREE, signal) {
	const low  = new THREE.Color(0xff8c00);
	const high = new THREE.Color(0x00d4ff);
	return low.lerp(high, signal);
}

async function mountDemoGlobe(container) {
	const THREE = await import("three");

	container.innerHTML = "";

	const label = container.querySelector(".demo-globe-label") || (() => {
		const d = document.createElement("div");
		d.className = "demo-globe-label";
		d.innerHTML = `
			<span class="demo-globe-title">Geostory Globe</span>
			<span class="demo-globe-sub">DRC Radio Broadcast Signals — 26 Provinces</span>
		`;
		container.appendChild(d);
		return d;
	})();

	const canvasWrap = document.createElement("div");
	canvasWrap.style.cssText = "position:absolute;inset:0;";
	container.insertBefore(canvasWrap, label);

	const tooltip = document.createElement("div");
	tooltip.className = "demo-globe-tooltip";
	tooltip.style.display = "none";
	container.appendChild(tooltip);

	const w = container.clientWidth  || 480;
	const h = container.clientHeight || 480;

	const scene    = new THREE.Scene();
	const camera   = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
	camera.position.set(0, 0.6, 5.2);
	camera.lookAt(0, 0, 0);

	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(w, h);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	canvasWrap.appendChild(renderer.domElement);

	// Globe
	const globeGeo = new THREE.SphereGeometry(GLOBE_R, 64, 64);
	const globeMat = new THREE.MeshPhongMaterial({
		color: 0x04040f,
		emissive: 0x020208,
		shininess: 15,
	});
	const globeMesh = new THREE.Mesh(globeGeo, globeMat);
	scene.add(globeMesh);

	// Latitude/longitude grid lines
	const gridMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.045 });
	for (let lat = -80; lat <= 80; lat += 20) {
		const pts = [];
		for (let lng = 0; lng <= 360; lng += 4) {
			const v = latLngToVec3(lat, lng - 180, GLOBE_R + 0.003);
			pts.push(new THREE.Vector3(v.x, v.y, v.z));
		}
		scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
	}
	for (let lng = 0; lng < 360; lng += 20) {
		const pts = [];
		for (let lat = -90; lat <= 90; lat += 4) {
			const v = latLngToVec3(lat, lng, GLOBE_R + 0.003);
			pts.push(new THREE.Vector3(v.x, v.y, v.z));
		}
		scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
	}

	// Atmosphere glow
	const atmGeo = new THREE.SphereGeometry(GLOBE_R * 1.1, 32, 32);
	const atmMat = new THREE.MeshPhongMaterial({ color: 0x1a3fff, transparent: true, opacity: 0.05, side: THREE.BackSide });
	scene.add(new THREE.Mesh(atmGeo, atmMat));

	// Lights
	scene.add(new THREE.AmbientLight(0xffffff, 0.18));
	const sun = new THREE.DirectionalLight(0x6699ff, 1.4);
	sun.position.set(6, 4, 5);
	scene.add(sun);

	// Province dots + pulse rings
	const dotMeshes = [];
	const rings     = [];

	DRC_PROVINCES.forEach((prov, i) => {
		const pos = latLngToVec3(prov.lat, prov.lng);
		const vec  = new THREE.Vector3(pos.x, pos.y, pos.z);
		const col  = signalColor(THREE, prov.signal);

		// Dot
		const dotGeo = new THREE.SphereGeometry(0.022, 8, 8);
		const dotMat = new THREE.MeshBasicMaterial({ color: col });
		const dot    = new THREE.Mesh(dotGeo, dotMat);
		dot.position.copy(vec);
		dot.userData  = { province: prov };
		scene.add(dot);
		dotMeshes.push(dot);

		// Pulse ring
		const ringGeo = new THREE.RingGeometry(0.028, 0.048, 16);
		const ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
		const ring    = new THREE.Mesh(ringGeo, ringMat);
		ring.position.copy(vec);
		ring.lookAt(0, 0, 0);
		ring.userData = { phase: (i / DRC_PROVINCES.length) * Math.PI * 2 };
		scene.add(ring);
		rings.push(ring);
	});

	// Rotate globe so DRC is facing front (center: ~lat 0, lng 24)
	const drcOffsetRad = -24 * (Math.PI / 180);
	globeMesh.rotation.y = drcOffsetRad;
	dotMeshes.forEach(d => { d.rotation.y = drcOffsetRad; });
	rings.forEach(r => { r.rotation.y = drcOffsetRad; });

	// Raycaster for hover
	const raycaster = new THREE.Raycaster();
	const mouse     = new THREE.Vector2();
	let hoveredDot  = null;

	canvasWrap.addEventListener("mousemove", (e) => {
		const rect = canvasWrap.getBoundingClientRect();
		mouse.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
		mouse.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const hits = raycaster.intersectObjects(dotMeshes);
		if (hits.length > 0) {
			const prov = hits[0].object.userData.province;
			if (hoveredDot !== prov) {
				hoveredDot = prov;
				const pct = Math.round(prov.signal * 100);
				tooltip.innerHTML = `
					<strong>${escapeHtml(prov.name)}</strong>
					<span class="tip-bar"><span class="tip-fill" style="width:${pct}%;background:${pct > 60 ? "#00d4ff" : "#ff8c00"}"></span></span>
					<span class="tip-val">Signal ${pct}%</span>
				`;
				tooltip.style.display = "block";
				tooltip.style.left = (e.clientX - container.getBoundingClientRect().left + 12) + "px";
				tooltip.style.top  = (e.clientY - container.getBoundingClientRect().top  - 24) + "px";
			}
		} else {
			hoveredDot = null;
			tooltip.style.display = "none";
		}
	});
	canvasWrap.addEventListener("mouseleave", () => {
		hoveredDot = null;
		tooltip.style.display = "none";
	});

	// Auto-rotate + pulse animation
	let raf;
	let rotY = drcOffsetRad;

	const animate = () => {
		raf = requestAnimationFrame(animate);
		const t = Date.now() * 0.001;

		rotY += 0.0015;
		globeMesh.rotation.y = rotY;
		dotMeshes.forEach(d => { d.rotation.y = rotY; });
		rings.forEach((ring, i) => {
			ring.rotation.y = rotY;
			const phase = ring.userData.phase;
			const cycle = ((t * 0.7 + phase) % (Math.PI * 2)) / (Math.PI * 2);
			const s     = 1 + cycle * 1.4;
			ring.scale.setScalar(s);
			ring.material.opacity = Math.max(0, 0.65 * (1 - cycle));
		});

		renderer.render(scene, camera);
	};
	animate();

	// Resize observer
	const ro = new ResizeObserver(() => {
		const nw = container.clientWidth;
		const nh = container.clientHeight;
		camera.aspect = nw / nh;
		camera.updateProjectionMatrix();
		renderer.setSize(nw, nh);
	});
	ro.observe(container);

	return () => {
		cancelAnimationFrame(raf);
		ro.disconnect();
		renderer.dispose();
	};
}

// ── Demo module registry ────────────────────────────────────────────────────
const DEMO_MODULES = {
	globe_geojson: {
		label: "Geostory Globe",
		mount: mountDemoGlobe,
	},
};

function runAnimations() {
	window.addEventListener("scroll", () => {
		const h = document.documentElement.scrollHeight - window.innerHeight;
		const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
		const el = document.getElementById("scroll-indicator");
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
		const r = await fetch(API + "/api/projects/" + encodeURIComponent(slug));
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
			heroImg.src = p.hero_image;
			heroImg.alt = p.title;
			heroImg.style.display = "block";
		} else if (p.hero_video) {
			heroImg.style.display = "none";
			heroVideo.src = p.hero_video;
			heroVideo.style.display = "block";
			heroVideo.load();
			heroVideo.play().catch(() => {});
		} else {
			heroMedia.style.display = "none";
		}

		document.getElementById("project-about").textContent = p.about_text || p.excerpt || "";

		// ── STAR sections ────────────────────────────────────────────────────
		const starSection = document.getElementById("project-star");
		const starFields = [
			{ id: "project-star-s-text", value: p.star_situation },
			{ id: "project-star-t-text", value: p.star_task },
			{ id: "project-star-a-text", value: p.star_action },
			{ id: "project-star-r-text", value: p.star_result },
		];
		const hasAnyStar = starFields.some(f => f.value);
		if (hasAnyStar) {
			starFields.forEach(f => {
				const el   = document.getElementById(f.id);
				const item = el?.closest(".project-star-item");
				if (f.value) {
					renderStarText(el, f.value);
					if (item) item.style.display = "";
				} else {
					if (item) item.style.display = "none";
				}
			});
			starSection.style.display = "block";
		}

		// ── Gallery: 3 media items + optional 4th demo slot ─────────────────
		const galleryGrid    = document.getElementById("project-gallery-grid");
		const mediaItems     = (p.galleryImages || []).slice(0, 3);
		const demoConfig     = p.demo_config || {};
		const activeDemo     = Object.keys(DEMO_MODULES).find(k => demoConfig[k]);
		const hasDemo        = !!activeDemo;
		const hasMedia       = mediaItems.length > 0;
		const isVideo        = (url) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || "");

		if (hasMedia || hasDemo) {
			// Use 2-column grid layout when we have 3+ media or a demo slot
			if (mediaItems.length + (hasDemo ? 1 : 0) >= 3) {
				galleryGrid.classList.add("project-gallery-grid--2col");
			}

			if (hasMedia) {
				galleryGrid.innerHTML = mediaItems.map((url) => {
					const safe = escapeHtml(url);
					if (isVideo(url)) {
						return `<div class="project-gallery-item"><video src="${safe}" playsinline muted loop autoplay></video></div>`;
					}
					return `<div class="project-gallery-item"><img src="${safe}" alt=""></div>`;
				}).join("");
				galleryGrid.querySelectorAll("video").forEach((v) => v.play().catch(() => {}));
			}

			if (hasDemo) {
				const demoItem = document.createElement("div");
				demoItem.className = "project-gallery-item project-gallery-item--demo";
				galleryGrid.appendChild(demoItem);
				// Mount asynchronously so we don't block the rest of the page
				DEMO_MODULES[activeDemo].mount(demoItem).catch(() => {});
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
