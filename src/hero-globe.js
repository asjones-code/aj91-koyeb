import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

const flyShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(1, 1) },
    ommatidiaSize: { value: 6.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float ommatidiaSize;

    vec2 hex(vec2 uv, float s){
      vec2 r = resolution / s;
      uv *= r;
      float y = floor(uv.y);
      float x = floor(uv.x - mod(y,2.0)*0.5);
      return vec2(x + 0.5*mod(y,2.0), y) / r;
    }

    float mask(vec2 uv, float s){
      vec2 p = fract(uv * resolution / s) - 0.5;
      p.x *= 0.57735;
      p = abs(p);
      return step(max(p.x*2.0, p.y*0.866 + p.x),0.5);
    }

    void main(){
      vec2 huv = hex(vUv, ommatidiaSize);
      vec4 col = texture2D(tDiffuse, huv);
      gl_FragColor = col * mask(vUv, ommatidiaSize);
    }
  `
};

// Fallback data used when the API is unreachable
const CAREER_DOTS_FALLBACK = [
  { lat: 40.7128,  lng: -74.0060,  label: "New York, NY",   year: "2017–present", text: "Home base. Built products at Meta, Barrel, and Gotham Greens." },
  { lat: 37.4847,  lng: -122.1471, label: "Menlo Park, CA", year: "2021–2022",    text: "Meta — Implementation Manager, global ads infrastructure." },
  { lat: 37.3382,  lng: -121.8863, label: "San José, CA",   year: "2022–2023",    text: "Assembled — Implementation Manager, workforce management." },
  { lat: 42.3601,  lng: -71.0589,  label: "Boston, MA",     year: "2019–2021",    text: "Sendwave — Director of Growth, global fintech remittance." },
];

// Module-level interaction state
let scrollVelocity = 0;
let dragMomX = 0;
let dragMomY = 0;
let isDragging = false;
let _prevDragX = 0;
let _prevDragY = 0;
let _cleanup = null;

function initHeroGlobe() {
  if (_cleanup) { _cleanup(); _cleanup = null; }

  const container = document.querySelector(".hero-globe-wrap");
  if (!container) return;

  while (container.firstChild) container.removeChild(container.firstChild);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const texLoader = new THREE.TextureLoader();
  const earthMap  = texLoader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");
  const earthBump = texLoader.load("https://threejs.org/examples/textures/planets/earth_bump_2048.jpg");
  const earthSpec = texLoader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg");

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 128, 128),
    new THREE.MeshStandardMaterial({
      map: earthMap, bumpMap: earthBump, bumpScale: 0.08,
      specularMap: earthSpec, roughness: 1, metalness: 0
    })
  );
  scene.add(globe);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.65, 128, 128),
    new THREE.MeshBasicMaterial({ color: 0x3399ff, transparent: true, opacity: 0.06 })
  );
  scene.add(atmosphere);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function latLngToPosition(lat, lng, radius = 1.62) {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
       radius * Math.cos(phi),
       radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // ── Career dots — green, pulsing, loaded from API ─────────────────────────
  const hitMeshes   = [];  // invisible, 30% bigger — used for raycasting
  const pulseMeshes = [];
  let tooltipActive = false;

  function buildCareerDots(dotsData) {
    hitMeshes.forEach(m => globe.remove(m));   hitMeshes.length = 0;
    pulseMeshes.forEach(({ mesh }) => globe.remove(mesh)); pulseMeshes.length = 0;

    dotsData.forEach((data) => {
      const pos = latLngToPosition(data.lat, data.lng);

      // Visible core dot
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.010, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x22c55e })
      );
      dot.position.copy(pos);
      globe.add(dot);

      // Invisible hit sphere — 30% bigger so easier to hover
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 8, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      hit.position.copy(pos);
      hit.userData.careerData = data;
      globe.add(hit);
      hitMeshes.push(hit);

      // Pulse ring
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.010, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0 })
      );
      pulse.position.copy(pos);
      globe.add(pulse);
      pulseMeshes.push({ mesh: pulse, phase: Math.random() });
    });
  }

  // Load from API, fall back to hardcoded
  const apiBase = (typeof window !== "undefined" && window.API_ORIGIN) || "";
  fetch(`${apiBase}/api/career-dots`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => buildCareerDots(data.dots || []))
    .catch(() => buildCareerDots(CAREER_DOTS_FALLBACK));

  function updatePulseRings() {
    const t = Date.now() / 1000;
    pulseMeshes.forEach(({ mesh, phase }) => {
      const cycle = ((t * 0.38 + phase) % 1);
      mesh.scale.setScalar(1 + cycle * 6);
      mesh.material.opacity = Math.max(0, 0.55 * (1 - cycle));
    });
  }

  // ── Live visitor dots — cyan, fade over 60 s ──────────────────────────────
  const locationDots = new Map();
  const FADE_TTL_MS = 60000;

  function setLocationDots(locations) {
    const now = Date.now();
    const ids = new Set((locations || []).map(l => l.id));
    locationDots.forEach((mesh, id) => {
      if (!ids.has(id)) { globe.remove(mesh); locationDots.delete(id); }
    });
    (locations || []).forEach(({ id, lat, lng, last_seen_at }) => {
      if (typeof lat !== "number" || typeof lng !== "number") return;
      const lastSeen = typeof last_seen_at === "number" ? last_seen_at : now;
      if (locationDots.has(id)) {
        const dot = locationDots.get(id);
        dot.position.copy(latLngToPosition(lat, lng));
        dot.userData.lastSeenAt = lastSeen;
      } else {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.028, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xabf8fe, transparent: true, opacity: 1 })
        );
        dot.position.copy(latLngToPosition(lat, lng));
        dot.userData.lastSeenAt = lastSeen;
        globe.add(dot);
        locationDots.set(id, dot);
      }
    });
  }

  function updateDotOpacity() {
    const now = Date.now();
    const toRemove = [];
    locationDots.forEach((mesh, id) => {
      const age = now - (mesh.userData.lastSeenAt || 0);
      if (age >= FADE_TTL_MS) { toRemove.push(id); }
      else if (mesh.material) { mesh.material.opacity = Math.max(0, 1 - age / FADE_TTL_MS); }
    });
    toRemove.forEach(id => { const m = locationDots.get(id); if (m) globe.remove(m); locationDots.delete(id); });
  }

  // ── Tooltip ───────────────────────────────────────────────────────────────
  const tooltip = document.createElement("div");
  tooltip.className = "globe-dot-tooltip";
  document.body.appendChild(tooltip);

  function showTooltip(x, y, dotsData) {
    // dotsData is always an array; render stacked entries for clusters
    tooltip.innerHTML = dotsData.map((d, i) =>
      `<div class="${i > 0 ? "globe-dot-tooltip-entry" : ""}">` +
        `<div class="globe-dot-tooltip-label">${d.label}</div>` +
        `<div class="globe-dot-tooltip-year">${d.year || ""}</div>` +
        `<div class="globe-dot-tooltip-text">${d.text || ""}</div>` +
      `</div>`
    ).join('<div class="globe-dot-tooltip-divider"></div>');
    const pad = 16;
    const tw  = 230;
    const left = x + pad + tw > window.innerWidth ? x - tw - pad : x + pad;
    tooltip.style.left = `${left}px`;
    tooltip.style.top  = `${y + 8}px`;
    tooltip.classList.add("is-visible");
    tooltipActive = true;
  }

  function hideTooltip() {
    tooltip.classList.remove("is-visible");
    tooltipActive = false;
  }

  // ── Raycaster ─────────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points = { threshold: 0.04 };
  const mouse = new THREE.Vector2(-9999, -9999);

  // Returns all career dots hit (handles clusters of close dots)
  function pickCareerDots(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width)  *  2 - 1;
    mouse.y = ((clientY - rect.top)  / rect.height) * -2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(hitMeshes);
    // Deduplicate by careerData label in case the same dot is hit multiple times
    const seen = new Set();
    return hits
      .map(h => h.object.userData.careerData)
      .filter(d => d && !seen.has(d.label) && seen.add(d.label));
  }

  const heroEl    = container.closest(".hero-section");
  const isDesktop = window.matchMedia("(pointer: fine)").matches;

  const onGlobeMouseMove = (e) => {
    if (isDragging) { hideTooltip(); return; }
    const hits = pickCareerDots(e.clientX, e.clientY);
    if (hits.length) {
      showTooltip(e.clientX, e.clientY, hits);
      if (heroEl) heroEl.style.cursor = "pointer";
    } else {
      hideTooltip();
      if (heroEl) heroEl.style.cursor = "grab";
    }
  };

  let tapOpen = false;
  const onGlobeClick = (e) => {
    if (isDragging) return;
    const hits = pickCareerDots(e.clientX, e.clientY);
    if (hits.length) {
      showTooltip(e.clientX, e.clientY, hits);
      tapOpen = true;
    } else if (tapOpen) {
      hideTooltip();
      tapOpen = false;
    }
  };

  // ── Post-processing ───────────────────────────────────────────────────────
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const flyPass = new ShaderPass(new THREE.ShaderMaterial({
    uniforms: flyShader.uniforms,
    vertexShader: flyShader.vertexShader,
    fragmentShader: flyShader.fragmentShader
  }));
  composer.addPass(flyPass);

  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.2, 0.4, 0.0);
  composer.addPass(bloom);
  bloom.renderToScreen = true;

  function setSize() {
    const parent = container.parentElement;
    if (!parent) return;
    let w = parent.offsetWidth, h = parent.offsetHeight;
    if (h <= 0) {
      const hero = container.closest(".hero-section") || container.closest(".hero-zone");
      h = hero ? hero.offsetHeight : (window.visualViewport ? window.visualViewport.height : window.innerHeight);
    }
    if (w <= 0) w = window.innerWidth;
    if (w <= 0 || h <= 0) return;
    renderer.setSize(w, h);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    composer.setSize(w, h);
    composer.setPixelRatio(renderer.getPixelRatio());
    flyPass.uniforms.resolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    bloom.resolution.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
  }

  requestAnimationFrame(setSize);
  const ro = new ResizeObserver(setSize);
  ro.observe(container.parentElement);

  // ── Animate ───────────────────────────────────────────────────────────────
  let rafId;
  function animate() {
    rafId = requestAnimationFrame(animate);

    if (!tooltipActive) {
      if (isDragging) {
        globe.rotation.y += dragMomX;
        globe.rotation.x = Math.max(-0.45, Math.min(0.45, globe.rotation.x + dragMomY));
      } else {
        dragMomX *= 0.94;
        dragMomY *= 0.94;
        const scrollBoost = Math.sign(scrollVelocity) * Math.min(Math.abs(scrollVelocity) * 0.000035, 0.003);
        scrollVelocity *= 0.90;
        globe.rotation.y += 0.0007 + scrollBoost + dragMomX;
        globe.rotation.x = Math.max(-0.45, Math.min(0.45, globe.rotation.x + dragMomY));
      }
    }

    updatePulseRings();
    updateDotOpacity();
    composer.render();
  }
  animate();

  // ── Event listeners ───────────────────────────────────────────────────────
  const onScrollVelocity = (e) => { scrollVelocity = e.detail || 0; };
  window.addEventListener("globe-scroll-velocity", onScrollVelocity);
  window.addEventListener("globe-locations", (e) => {
    setLocationDots(e.detail?.locations ?? []);
  });
  window.addEventListener("resize", setSize);

  const onMouseDown = (e) => {
    if (e.target.closest("#terminal, button, a, input")) return;
    isDragging = true;
    dragMomX = 0;
    dragMomY = 0;
    _prevDragX = e.clientX;
    _prevDragY = e.clientY;
    if (heroEl) heroEl.style.cursor = "grabbing";
    hideTooltip();
    e.preventDefault();
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    dragMomX = (e.clientX - _prevDragX) * 0.0045;
    dragMomY = (e.clientY - _prevDragY) * 0.002;
    _prevDragX = e.clientX;
    _prevDragY = e.clientY;
  };
  const onMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;
    if (heroEl) heroEl.style.cursor = "grab";
  };

  // Touch rotation — works on all devices
  const onTouchStart = (e) => {
    if (e.target.closest("#terminal, button, a, input")) return;
    if (e.touches.length !== 1) return;
    isDragging = true;
    dragMomX = 0;
    dragMomY = 0;
    _prevDragX = e.touches[0].clientX;
    _prevDragY = e.touches[0].clientY;
    hideTooltip();
  };
  const onTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    dragMomX = (e.touches[0].clientX - _prevDragX) * 0.0045;
    dragMomY = (e.touches[0].clientY - _prevDragY) * 0.002;
    _prevDragX = e.touches[0].clientX;
    _prevDragY = e.touches[0].clientY;
  };
  const onTouchEnd = () => { isDragging = false; };

  if (heroEl) {
    heroEl.addEventListener("touchstart", onTouchStart, { passive: true });
    heroEl.addEventListener("touchmove",  onTouchMove,  { passive: true });
    heroEl.addEventListener("touchend",   onTouchEnd);
  }

  if (heroEl && isDesktop) {
    heroEl.style.cursor = "grab";
    heroEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    heroEl.addEventListener("mousemove", onGlobeMouseMove);
  }
  if (heroEl) heroEl.addEventListener("click", onGlobeClick);

  _cleanup = () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
    window.removeEventListener("globe-scroll-velocity", onScrollVelocity);
    window.removeEventListener("resize", setSize);
    if (heroEl) {
      heroEl.removeEventListener("touchstart", onTouchStart);
      heroEl.removeEventListener("touchmove",  onTouchMove);
      heroEl.removeEventListener("touchend",   onTouchEnd);
    }
    if (heroEl && isDesktop) {
      heroEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      heroEl.removeEventListener("mousemove", onGlobeMouseMove);
      heroEl.style.cursor = "";
    }
    if (heroEl) heroEl.removeEventListener("click", onGlobeClick);
  };
}

initHeroGlobe();
window.addEventListener("hero-globe-mount", initHeroGlobe);
