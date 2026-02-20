/**
 * Hero globe – source. Bundled with esbuild into public/hero-globe.js using three from node_modules.
 */
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

function initHeroGlobe() {
  const container = document.querySelector(".hero-globe-wrap");
  if (!container) return;

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

  const loader = new THREE.TextureLoader();
  const earthMap = loader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg");
  const earthBump = loader.load("https://threejs.org/examples/textures/planets/earth_bump_2048.jpg");
  const earthSpec = loader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg");

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 128, 128),
    new THREE.MeshStandardMaterial({
      map: earthMap,
      bumpMap: earthBump,
      bumpScale: 0.08,
      specularMap: earthSpec,
      roughness: 1,
      metalness: 0
    })
  );
  scene.add(globe);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.65, 128, 128),
    new THREE.MeshBasicMaterial({ color: 0x3399ff, transparent: true, opacity: 0.06 })
  );
  scene.add(atmosphere);

  // Location dots: driven by globe-locations event (from live WebSocket when users opt in)
  const locationDots = new Map(); // id -> THREE.Mesh
  function latLngToPosition(lat, lng, radius = 1.62) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }

  function setLocationDots(locations) {
    const ids = new Set((locations || []).map((l) => l.id));
    locationDots.forEach((mesh, id) => {
      if (!ids.has(id)) {
        globe.remove(mesh);
        locationDots.delete(id);
      }
    });
    (locations || []).forEach(({ id, lat, lng }) => {
      if (typeof lat !== "number" || typeof lng !== "number") return;
      if (locationDots.has(id)) {
        locationDots.get(id).position.copy(latLngToPosition(lat, lng));
      } else {
        const dotGeometry = new THREE.SphereGeometry(0.035, 16, 16);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b00 });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.copy(latLngToPosition(lat, lng));
        globe.add(dot);
        locationDots.set(id, dot);
      }
    });
  }

  window.addEventListener("globe-locations", (e) => {
    setLocationDots(e.detail && e.detail.locations ? e.detail.locations : []);
  });

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const flyPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: flyShader.uniforms,
      vertexShader: flyShader.vertexShader,
      fragmentShader: flyShader.fragmentShader
    })
  );
  composer.addPass(flyPass);

  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.2, 0.4, 0.0);
  composer.addPass(bloom);
  bloom.renderToScreen = true;

  function setSize() {
    const parent = container.parentElement;
    if (!parent) return;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
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

  setSize();
  const resizeObserver = new ResizeObserver(setSize);
  resizeObserver.observe(container.parentElement);
  window.addEventListener("resize", setSize);

  function animate() {
    globe.rotation.y += 0.0007;
    composer.render();
    requestAnimationFrame(animate);
  }
  animate();
}

initHeroGlobe();

// Re-run when returning to home via Barba (new .hero-globe-wrap is in the DOM)
window.addEventListener("hero-globe-mount", initHeroGlobe);
