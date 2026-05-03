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

// Module-level interaction state — persists across RAF frames, reset on re-init
let scrollVelocity = 0;
let dragMomX = 0;
let dragMomY = 0;
let isDragging = false;
let _prevDragX = 0;
let _prevDragY = 0;
let _cleanup = null; // removes event listeners from previous init

function initHeroGlobe() {
  // Remove listeners from any previous initialisation (Barba re-mount)
  if (_cleanup) { _cleanup(); _cleanup = null; }

  const container = document.querySelector(".hero-globe-wrap");
  if (!container) return;

  // Clear any previous canvas left behind
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

  // ── Location dots ────────────────────────────────────────────────────────
  const locationDots = new Map();
  const FADE_TTL_MS = 60000;

  function latLngToPosition(lat, lng, radius = 1.62) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
       radius * Math.cos(phi),
       radius * Math.sin(phi) * Math.sin(theta)
    );
  }

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
          new THREE.SphereGeometry(0.035, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 1 })
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
    // On mobile hero-img may report 0 height before layout completes — fall back
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

  // Defer one frame so mobile layout has been computed before we read dimensions
  requestAnimationFrame(setSize);
  const ro = new ResizeObserver(setSize);
  ro.observe(container.parentElement);

  // ── Animate ───────────────────────────────────────────────────────────────
  let rafId;
  function animate() {
    rafId = requestAnimationFrame(animate);

    if (isDragging) {
      // While dragging: apply live delta, no base rotation
      globe.rotation.y += dragMomX;
      globe.rotation.x = Math.max(-0.45, Math.min(0.45, globe.rotation.x + dragMomY));
    } else {
      // After release: decay momentum, blend into base rotation
      dragMomX *= 0.94;
      dragMomY *= 0.94;
      // Scroll influence: faster scroll = faster spin, capped so it never looks wrong
      const scrollBoost = Math.sign(scrollVelocity) * Math.min(Math.abs(scrollVelocity) * 0.000035, 0.003);
      scrollVelocity *= 0.90;
      globe.rotation.y += 0.0007 + scrollBoost + dragMomX;
      globe.rotation.x = Math.max(-0.45, Math.min(0.45, globe.rotation.x + dragMomY));
    }

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

  // Mouse drag — desktop only, on the hero background (not over interactive children)
  const heroEl = container.closest(".hero-section");
  const isDesktop = window.matchMedia("(pointer: fine)").matches;

  const onMouseDown = (e) => {
    if (e.target.closest("#terminal, button, a, input")) return;
    isDragging = true;
    dragMomX = 0;
    dragMomY = 0;
    _prevDragX = e.clientX;
    _prevDragY = e.clientY;
    if (heroEl) heroEl.style.cursor = "grabbing";
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

  if (heroEl && isDesktop) {
    heroEl.style.cursor = "grab";
    heroEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  // Store cleanup for next re-init
  _cleanup = () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    window.removeEventListener("globe-scroll-velocity", onScrollVelocity);
    window.removeEventListener("resize", setSize);
    if (heroEl && isDesktop) {
      heroEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      heroEl.style.cursor = "";
    }
  };
}

initHeroGlobe();
window.addEventListener("hero-globe-mount", initHeroGlobe);
