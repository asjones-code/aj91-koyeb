// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/text.js":[function(require,module,exports) {
var canvas = document.querySelector("canvas");
var gl = canvas.getContext("webgl");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

// Configurable parameters
var config = {
  particleCount: 4000,
  textArray: ["About Me"],
  mouseRadius: 0.1,
  particleSize: 2,
  forceMultiplier: 0.001,
  returnSpeed: 0.005,
  velocityDamping: 0.95,
  colorMultiplier: 40000,
  saturationMultiplier: 1000,
  textChangeInterval: 10000,
  rotationForceMultiplier: 0.5
};
var currentTextIndex = 0;
var nextTextTimeout;
var textCoordinates = [];
var mouse = {
  x: -500,
  y: -500,
  radius: config.mouseRadius
};
var particles = [];
for (var i = 0; i < config.particleCount; i++) {
  particles.push({
    x: 0,
    y: 0,
    baseX: 0,
    baseY: 0,
    vx: 0,
    vy: 0
  });
}
var vertexShaderSource = "\n    attribute vec2 a_position;\n    attribute float a_hue;\n    attribute float a_saturation;\n    varying float v_hue;\n    varying float v_saturation;\n    void main() {\n        gl_PointSize = ".concat(config.particleSize.toFixed(1), ";\n        gl_Position = vec4(a_position, 0.0, 1.0);\n        v_hue = a_hue;\n        v_saturation = a_saturation;\n    }\n");
var fragmentShaderSource = "\n    precision mediump float;\n    varying float v_hue;\n    varying float v_saturation;\n    void main() {\n        float c = v_hue * 6.0;\n        float x = 1.0 - abs(mod(c, 2.0) - 1.0);\n        vec3 color;\n        if (c < 1.0) color = vec3(1.0, x, 0.0);\n        else if (c < 2.0) color = vec3(x, 1.0, 0.0);\n        else if (c < 3.0) color = vec3(0.0, 1.0, x);\n        else if (c < 4.0) color = vec3(0.0, x, 1.0);\n        else if (c < 5.0) color = vec3(x, 0.0, 1.0);\n        else color = vec3(1.0, 0.0, x);\n        vec3 finalColor = mix(vec3(1.0), color, v_saturation);\n        gl_FragColor = vec4(finalColor, 1.0);\n    }\n";
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
var program = createProgram(gl, vertexShader, fragmentShader);
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var hueAttributeLocation = gl.getAttribLocation(program, "a_hue");
var saturationAttributeLocation = gl.getAttribLocation(program, "a_saturation");
var positionBuffer = gl.createBuffer();
var hueBuffer = gl.createBuffer();
var saturationBuffer = gl.createBuffer();
var positions = new Float32Array(config.particleCount * 2);
var hues = new Float32Array(config.particleCount);
var saturations = new Float32Array(config.particleCount);
function getTextCoordinates(text) {
  var ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = canvas.width;
  ctx.canvas.height = canvas.height;
  var fontSize = Math.min(canvas.width / 6, canvas.height / 6);
  ctx.font = "900 ".concat(fontSize, "px Arial");
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  var coordinates = [];
  for (var y = 0; y < canvas.height; y += 4) {
    for (var x = 0; x < canvas.width; x += 4) {
      var index = (y * canvas.width + x) * 4;
      if (imageData[index + 3] > 128) {
        coordinates.push({
          x: x / canvas.width * 2 - 1,
          y: y / canvas.height * -2 + 1
        });
      }
    }
  }
  return coordinates;
}
function createParticles() {
  textCoordinates = getTextCoordinates(config.textArray[currentTextIndex]);
  for (var _i = 0; _i < config.particleCount; _i++) {
    var randomIndex = Math.floor(Math.random() * textCoordinates.length);
    var _textCoordinates$rand = textCoordinates[randomIndex],
      x = _textCoordinates$rand.x,
      y = _textCoordinates$rand.y;
    particles[_i].x = particles[_i].baseX = x;
    particles[_i].y = particles[_i].baseY = y;
  }
}
function updateParticles() {
  for (var _i2 = 0; _i2 < config.particleCount; _i2++) {
    var particle = particles[_i2];
    var dx = mouse.x - particle.x;
    var dy = mouse.y - particle.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var forceDirectionX = dx / distance;
    var forceDirectionY = dy / distance;
    var maxDistance = mouse.radius;
    var force = (maxDistance - distance) / maxDistance;
    var directionX = forceDirectionX * force * config.forceMultiplier;
    var directionY = forceDirectionY * force * config.forceMultiplier;
    var angle = Math.atan2(dy, dx);
    var rotationForceX = Math.sin(-Math.cos(angle * -1) * Math.sin(config.rotationForceMultiplier * Math.cos(force)) * Math.sin(distance * distance) * Math.sin(angle * distance));
    var rotationForceY = Math.sin(Math.cos(angle * 1) * Math.sin(config.rotationForceMultiplier * Math.sin(force)) * Math.sin(distance * distance) * Math.cos(angle * distance));
    if (distance < mouse.radius) {
      particle.vx -= directionX + rotationForceX;
      particle.vy -= directionY + rotationForceY;
    } else {
      particle.vx += (particle.baseX - particle.x) * config.returnSpeed;
      particle.vy += (particle.baseY - particle.y) * config.returnSpeed;
    }
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= config.velocityDamping;
    particle.vy *= config.velocityDamping;
    var speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    var hue = speed * config.colorMultiplier % 360;
    hues[_i2] = hue / 360;
    saturations[_i2] = Math.min(speed * config.saturationMultiplier, 1);
    positions[_i2 * 2] = particle.x;
    positions[_i2 * 2 + 1] = particle.y;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, hueBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, hues, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, saturationBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, saturations, gl.DYNAMIC_DRAW);
}
function animate() {
  updateParticles();
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, hueBuffer);
  gl.vertexAttribPointer(hueAttributeLocation, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(hueAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, saturationBuffer);
  gl.vertexAttribPointer(saturationAttributeLocation, 1, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(saturationAttributeLocation);
  gl.useProgram(program);
  gl.drawArrays(gl.POINTS, 0, config.particleCount);
  requestAnimationFrame(animate);
}
canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.clientX / canvas.width * 2 - 1;
  mouse.y = event.clientY / canvas.height * -2 + 1;
});
canvas.addEventListener("mouseleave", function () {
  mouse.x = -500;
  mouse.y = -500;
});
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  createParticles();
});
gl.clearColor(0, 0, 0, 0);
createParticles();
animate();
nextTextTimeout = setTimeout(config.textChangeInterval);
},{}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51265" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/text.js"], null)
//# sourceMappingURL=/text.14c67b78.js.map