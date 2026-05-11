import * as THREE from 'three';

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  varying vec2  vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x,289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1  = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy  -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x  = 2.0*fract(p*C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 a0 = x - floor(x+0.5);
    m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x *x0.x  + h.x *x0.y;
    g.yz = a0.yz*x12.xz + h.yz*x12.yw;
    return 130.0*dot(m,g);
  }

  float b2(float x, float y) {
    bool xo = mod(x,2.0) >= 1.0;
    bool yo = mod(y,2.0) >= 1.0;
    if (!xo && !yo) return 0.0;
    if ( xo && !yo) return 2.0;
    if (!xo &&  yo) return 3.0;
    return 1.0;
  }

  float bayer4(vec2 coord) {
    float inner = b2(coord.x, coord.y);
    float outer = b2(floor(coord.x/2.0), floor(coord.y/2.0));
    return (4.0*inner + outer) / 16.0;
  }

  void main() {
    vec2 uv    = vUv;
    vec2 coord = gl_FragCoord.xy;

    float noise    = snoise(uv * 1.5 + vec2(uTime*0.05, uTime*0.03)) * 0.25;
    float diagonal = (uv.x + uv.y) * 0.5;
    float gradient = clamp(diagonal * 1.2 + noise, 0.0, 1.0);

    vec3 c1    = uColor1;
    vec3 c2    = uColor2;
    vec3 soft  = mix(c1, c2, 0.33);
    vec3 light = mix(c1, c2, 0.66);

    vec3 color;
    if      (gradient < 0.30) color = c1;
    else if (gradient < 0.55) color = soft;
    else if (gradient < 0.80) color = light;
    else                      color = c2;

    float dither    = bayer4(coord);
    float threshold = fract(gradient * 4.0);
    if      (gradient < 0.30 && threshold > dither*0.5) color = soft;
    else if (gradient >= 0.30 && gradient < 0.55 && threshold > dither*0.5) color = light;
    else if (gradient >= 0.55 && gradient < 0.80 && threshold > dither*0.5) color = c2;

    float vig = smoothstep(0.8, 0.2, length(uv - 0.5));
    color *= (0.85 + 0.15*vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function initStudioShader() {
  const container = document.getElementById('heroShader');
  if (!container) return;

  // Remove existing canvas so re-init on Barba nav works cleanly
  const existing = container.querySelector('canvas');
  if (existing) existing.remove();

  const w = container.offsetWidth  || window.innerWidth;
  const h = container.offsetHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(1);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime:   { value: 0 },
    uColor1: { value: new THREE.Color('#0d1f14') },
    uColor2: { value: new THREE.Color('#1a5c38') },
  };

  const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

  const clock = new THREE.Clock();
  (function frame() {
    requestAnimationFrame(frame);
    uniforms.uTime.value = clock.getElapsedTime() * 0.5;
    renderer.render(scene, camera);
  })();

  new ResizeObserver(() => {
    const nw = container.offsetWidth;
    const nh = container.offsetHeight;
    if (nw && nh) renderer.setSize(nw, nh);
  }).observe(container);
}
