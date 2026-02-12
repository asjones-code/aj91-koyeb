// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
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

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
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
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"9tETL":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "c8d2f1188109ac08";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    if (HMR_USE_SSE) ws = new EventSource("/__parcel_hmr");
    else try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"h05Z6":[function(require,module,exports) {
// Import statements
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _gsap = require("gsap");
var _scrollTrigger = require("gsap/ScrollTrigger");
var _scrollmagic = require("scrollmagic");
var _scrollmagicDefault = parcelHelpers.interopDefault(_scrollmagic);
var _splitting = require("splitting");
var _splittingDefault = parcelHelpers.interopDefault(_splitting);
(0, _gsap.gsap).registerPlugin((0, _scrollTrigger.ScrollTrigger));
(0, _gsap.gsap).set("section.footer-container", {
    yPercent: -50
});
const uncover = (0, _gsap.gsap).timeline({
    paused: true
});
uncover.to("section.footer-container", {
    yPercent: 0,
    ease: "none"
});
(0, _scrollTrigger.ScrollTrigger).create({
    trigger: "section.conclusion",
    start: "top top",
    end: "+=75%",
    animation: uncover,
    scrub: true
});

},{"gsap":"fPSuC","gsap/ScrollTrigger":"7wnFk","scrollmagic":"1y1Qx","splitting":"77jB6","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7wnFk":[function(require,module,exports) {
/*!
 * ScrollTrigger 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/ /* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ScrollTrigger", ()=>ScrollTrigger);
parcelHelpers.export(exports, "default", ()=>ScrollTrigger);
var _observerJs = require("./Observer.js");
var gsap, _coreInitted, _win, _doc, _docEl, _body, _root, _resizeDelay, _toArray, _clamp, _time2, _syncInterval, _refreshing, _pointerIsDown, _transformProp, _i, _prevWidth, _prevHeight, _autoRefresh, _sort, _suppressOverwrites, _ignoreResize, _normalizer, _ignoreMobileResize, _baseScreenHeight, _baseScreenWidth, _fixIOSBug, _context, _scrollRestoration, _div100vh, _100vh, _isReverted, _clampingMax, _limitCallbacks, // if true, we'll only trigger callbacks if the active state toggles, so if you scroll immediately past both the start and end positions of a ScrollTrigger (thus inactive to inactive), neither its onEnter nor onLeave will be called. This is useful during startup.
_startup = 1, _getTime = Date.now, _time1 = _getTime(), _lastScrollTime = 0, _enabled = 0, _parseClamp = function _parseClamp(value, type, self) {
    var clamp = _isString(value) && (value.substr(0, 6) === "clamp(" || value.indexOf("max") > -1);
    self["_" + type + "Clamp"] = clamp;
    return clamp ? value.substr(6, value.length - 7) : value;
}, _keepClamp = function _keepClamp(value, clamp) {
    return clamp && (!_isString(value) || value.substr(0, 6) !== "clamp(") ? "clamp(" + value + ")" : value;
}, _rafBugFix = function _rafBugFix() {
    return _enabled && requestAnimationFrame(_rafBugFix);
}, // in some browsers (like Firefox), screen repaints weren't consistent unless we had SOMETHING queued up in requestAnimationFrame()! So this just creates a super simple loop to keep it alive and smooth out repaints.
_pointerDownHandler = function _pointerDownHandler() {
    return _pointerIsDown = 1;
}, _pointerUpHandler = function _pointerUpHandler() {
    return _pointerIsDown = 0;
}, _passThrough = function _passThrough(v) {
    return v;
}, _round = function _round(value) {
    return Math.round(value * 100000) / 100000 || 0;
}, _windowExists = function _windowExists() {
    return typeof window !== "undefined";
}, _getGSAP = function _getGSAP() {
    return gsap || _windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap;
}, _isViewport = function _isViewport(e) {
    return !!~_root.indexOf(e);
}, _getViewportDimension = function _getViewportDimension(dimensionProperty) {
    return (dimensionProperty === "Height" ? _100vh : _win["inner" + dimensionProperty]) || _docEl["client" + dimensionProperty] || _body["client" + dimensionProperty];
}, _getBoundsFunc = function _getBoundsFunc(element) {
    return (0, _observerJs._getProxyProp)(element, "getBoundingClientRect") || (_isViewport(element) ? function() {
        _winOffsets.width = _win.innerWidth;
        _winOffsets.height = _100vh;
        return _winOffsets;
    } : function() {
        return _getBounds(element);
    });
}, _getSizeFunc = function _getSizeFunc(scroller, isViewport, _ref) {
    var d = _ref.d, d2 = _ref.d2, a = _ref.a;
    return (a = (0, _observerJs._getProxyProp)(scroller, "getBoundingClientRect")) ? function() {
        return a()[d];
    } : function() {
        return (isViewport ? _getViewportDimension(d2) : scroller["client" + d2]) || 0;
    };
}, _getOffsetsFunc = function _getOffsetsFunc(element, isViewport) {
    return !isViewport || ~(0, _observerJs._proxies).indexOf(element) ? _getBoundsFunc(element) : function() {
        return _winOffsets;
    };
}, _maxScroll = function _maxScroll(element, _ref2) {
    var s = _ref2.s, d2 = _ref2.d2, d = _ref2.d, a = _ref2.a;
    return Math.max(0, (s = "scroll" + d2, a = (0, _observerJs._getProxyProp)(element, s)) ? a() - _getBoundsFunc(element)()[d] : _isViewport(element) ? (_docEl[s] || _body[s]) - _getViewportDimension(d2) : element[s] - element["offset" + d2]);
}, _iterateAutoRefresh = function _iterateAutoRefresh(func, events) {
    for(var i = 0; i < _autoRefresh.length; i += 3)(!events || ~events.indexOf(_autoRefresh[i + 1])) && func(_autoRefresh[i], _autoRefresh[i + 1], _autoRefresh[i + 2]);
}, _isString = function _isString(value) {
    return typeof value === "string";
}, _isFunction = function _isFunction(value) {
    return typeof value === "function";
}, _isNumber = function _isNumber(value) {
    return typeof value === "number";
}, _isObject = function _isObject(value) {
    return typeof value === "object";
}, _endAnimation = function _endAnimation(animation, reversed, pause) {
    return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
}, _callback = function _callback(self, func) {
    if (self.enabled) {
        var result = self._ctx ? self._ctx.add(function() {
            return func(self);
        }) : func(self);
        result && result.totalTime && (self.callbackAnimation = result);
    }
}, _abs = Math.abs, _left = "left", _top = "top", _right = "right", _bottom = "bottom", _width = "width", _height = "height", _Right = "Right", _Left = "Left", _Top = "Top", _Bottom = "Bottom", _padding = "padding", _margin = "margin", _Width = "Width", _Height = "Height", _px = "px", _getComputedStyle = function _getComputedStyle(element) {
    return _win.getComputedStyle(element);
}, _makePositionable = function _makePositionable(element) {
    // if the element already has position: absolute or fixed, leave that, otherwise make it position: relative
    var position = _getComputedStyle(element).position;
    element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
}, _setDefaults = function _setDefaults(obj, defaults) {
    for(var p in defaults)p in obj || (obj[p] = defaults[p]);
    return obj;
}, _getBounds = function _getBounds(element, withoutTransforms) {
    var tween = withoutTransforms && _getComputedStyle(element)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap.to(element, {
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        skewX: 0,
        skewY: 0
    }).progress(1), bounds = element.getBoundingClientRect();
    tween && tween.progress(0).kill();
    return bounds;
}, _getSize = function _getSize(element, _ref3) {
    var d2 = _ref3.d2;
    return element["offset" + d2] || element["client" + d2] || 0;
}, _getLabelRatioArray = function _getLabelRatioArray(timeline) {
    var a = [], labels = timeline.labels, duration = timeline.duration(), p;
    for(p in labels)a.push(labels[p] / duration);
    return a;
}, _getClosestLabel = function _getClosestLabel(animation) {
    return function(value) {
        return gsap.utils.snap(_getLabelRatioArray(animation), value);
    };
}, _snapDirectional = function _snapDirectional(snapIncrementOrArray) {
    var snap = gsap.utils.snap(snapIncrementOrArray), a = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function(a, b) {
        return a - b;
    });
    return a ? function(value, direction, threshold) {
        if (threshold === void 0) threshold = 1e-3;
        var i;
        if (!direction) return snap(value);
        if (direction > 0) {
            value -= threshold; // to avoid rounding errors. If we're too strict, it might snap forward, then immediately again, and again.
            for(i = 0; i < a.length; i++){
                if (a[i] >= value) return a[i];
            }
            return a[i - 1];
        } else {
            i = a.length;
            value += threshold;
            while(i--){
                if (a[i] <= value) return a[i];
            }
        }
        return a[0];
    } : function(value, direction, threshold) {
        if (threshold === void 0) threshold = 1e-3;
        var snapped = snap(value);
        return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
    };
}, _getLabelAtDirection = function _getLabelAtDirection(timeline) {
    return function(value, st) {
        return _snapDirectional(_getLabelRatioArray(timeline))(value, st.direction);
    };
}, _multiListener = function _multiListener(func, element, types, callback) {
    return types.split(",").forEach(function(type) {
        return func(element, type, callback);
    });
}, _addListener = function _addListener(element, type, func, nonPassive, capture) {
    return element.addEventListener(type, func, {
        passive: !nonPassive,
        capture: !!capture
    });
}, _removeListener = function _removeListener(element, type, func, capture) {
    return element.removeEventListener(type, func, !!capture);
}, _wheelListener = function _wheelListener(func, el, scrollFunc) {
    scrollFunc = scrollFunc && scrollFunc.wheelHandler;
    if (scrollFunc) {
        func(el, "wheel", scrollFunc);
        func(el, "touchmove", scrollFunc);
    }
}, _markerDefaults = {
    startColor: "green",
    endColor: "red",
    indent: 0,
    fontSize: "16px",
    fontWeight: "normal"
}, _defaults = {
    toggleActions: "play",
    anticipatePin: 0
}, _keywords = {
    top: 0,
    left: 0,
    center: 0.5,
    bottom: 1,
    right: 1
}, _offsetToPx = function _offsetToPx(value, size) {
    if (_isString(value)) {
        var eqIndex = value.indexOf("="), relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;
        if (~eqIndex) {
            value.indexOf("%") > eqIndex && (relative *= size / 100);
            value = value.substr(0, eqIndex - 1);
        }
        value = relative + (value in _keywords ? _keywords[value] * size : ~value.indexOf("%") ? parseFloat(value) * size / 100 : parseFloat(value) || 0);
    }
    return value;
}, _createMarker = function _createMarker(type, name, container, direction, _ref4, offset, matchWidthEl, containerAnimation) {
    var startColor = _ref4.startColor, endColor = _ref4.endColor, fontSize = _ref4.fontSize, indent = _ref4.indent, fontWeight = _ref4.fontWeight;
    var e = _doc.createElement("div"), useFixedPosition = _isViewport(container) || (0, _observerJs._getProxyProp)(container, "pinType") === "fixed", isScroller = type.indexOf("scroller") !== -1, parent = useFixedPosition ? _body : container, isStart = type.indexOf("start") !== -1, color = isStart ? startColor : endColor, css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
    css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
    (isScroller || containerAnimation || !useFixedPosition) && (css += (direction === (0, _observerJs._vertical) ? _right : _bottom) + ":" + (offset + parseFloat(indent)) + "px;");
    matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
    e._isStart = isStart;
    e.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
    e.style.cssText = css;
    e.innerText = name || name === 0 ? type + "-" + name : type;
    parent.children[0] ? parent.insertBefore(e, parent.children[0]) : parent.appendChild(e);
    e._offset = e["offset" + direction.op.d2];
    _positionMarker(e, 0, direction, isStart);
    return e;
}, _positionMarker = function _positionMarker(marker, start, direction, flipped) {
    var vars = {
        display: "block"
    }, side = direction[flipped ? "os2" : "p2"], oppositeSide = direction[flipped ? "p2" : "os2"];
    marker._isFlipped = flipped;
    vars[direction.a + "Percent"] = flipped ? -100 : 0;
    vars[direction.a] = flipped ? "1px" : 0;
    vars["border" + side + _Width] = 1;
    vars["border" + oppositeSide + _Width] = 0;
    vars[direction.p] = start + "px";
    gsap.set(marker, vars);
}, _triggers = [], _ids = {}, _rafID, _sync = function _sync() {
    return _getTime() - _lastScrollTime > 34 && (_rafID || (_rafID = requestAnimationFrame(_updateAll)));
}, _onScroll = function _onScroll() {
    // previously, we tried to optimize performance by batching/deferring to the next requestAnimationFrame(), but discovered that Safari has a few bugs that make this unworkable (especially on iOS). See https://codepen.io/GreenSock/pen/16c435b12ef09c38125204818e7b45fc?editors=0010 and https://codepen.io/GreenSock/pen/JjOxYpQ/3dd65ccec5a60f1d862c355d84d14562?editors=0010 and https://codepen.io/GreenSock/pen/ExbrPNa/087cef197dc35445a0951e8935c41503?editors=0010
    if (!_normalizer || !_normalizer.isPressed || _normalizer.startX > _body.clientWidth) {
        // if the user is dragging the scrollbar, allow it.
        (0, _observerJs._scrollers).cache++;
        if (_normalizer) _rafID || (_rafID = requestAnimationFrame(_updateAll));
        else _updateAll(); // Safari in particular (on desktop) NEEDS the immediate update rather than waiting for a requestAnimationFrame() whereas iOS seems to benefit from waiting for the requestAnimationFrame() tick, at least when normalizing. See https://codepen.io/GreenSock/pen/qBYozqO?editors=0110
        _lastScrollTime || _dispatch("scrollStart");
        _lastScrollTime = _getTime();
    }
}, _setBaseDimensions = function _setBaseDimensions() {
    _baseScreenWidth = _win.innerWidth;
    _baseScreenHeight = _win.innerHeight;
}, _onResize = function _onResize() {
    (0, _observerJs._scrollers).cache++;
    !_refreshing && !_ignoreResize && !_doc.fullscreenElement && !_doc.webkitFullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win.innerWidth || Math.abs(_win.innerHeight - _baseScreenHeight) > _win.innerHeight * 0.25) && _resizeDelay.restart(true);
}, // ignore resizes triggered by refresh()
_listeners = {}, _emptyArray = [], _softRefresh = function _softRefresh() {
    return _removeListener(ScrollTrigger, "scrollEnd", _softRefresh) || _refreshAll(true);
}, _dispatch = function _dispatch(type) {
    return _listeners[type] && _listeners[type].map(function(f) {
        return f();
    }) || _emptyArray;
}, _savedStyles = [], // when ScrollTrigger.saveStyles() is called, the inline styles are recorded in this Array in a sequential format like [element, cssText, gsCache, media]. This keeps it very memory-efficient and fast to iterate through.
_revertRecorded = function _revertRecorded(media) {
    for(var i = 0; i < _savedStyles.length; i += 5)if (!media || _savedStyles[i + 4] && _savedStyles[i + 4].query === media) {
        _savedStyles[i].style.cssText = _savedStyles[i + 1];
        _savedStyles[i].getBBox && _savedStyles[i].setAttribute("transform", _savedStyles[i + 2] || "");
        _savedStyles[i + 3].uncache = 1;
    }
}, _revertAll = function _revertAll(kill, media) {
    var trigger;
    for(_i = 0; _i < _triggers.length; _i++){
        trigger = _triggers[_i];
        if (trigger && (!media || trigger._ctx === media)) {
            if (kill) trigger.kill(1);
            else trigger.revert(true, true);
        }
    }
    _isReverted = true;
    media && _revertRecorded(media);
    media || _dispatch("revert");
}, _clearScrollMemory = function _clearScrollMemory(scrollRestoration, force) {
    // zero-out all the recorded scroll positions. Don't use _triggers because if, for example, .matchMedia() is used to create some ScrollTriggers and then the user resizes and it removes ALL ScrollTriggers, and then go back to a size where there are ScrollTriggers, it would have kept the position(s) saved from the initial state.
    (0, _observerJs._scrollers).cache++;
    (force || !_refreshingAll) && (0, _observerJs._scrollers).forEach(function(obj) {
        return _isFunction(obj) && obj.cacheID++ && (obj.rec = 0);
    });
    _isString(scrollRestoration) && (_win.history.scrollRestoration = _scrollRestoration = scrollRestoration);
}, _refreshingAll, _refreshID = 0, _queueRefreshID, _queueRefreshAll = function _queueRefreshAll() {
    // we don't want to call _refreshAll() every time we create a new ScrollTrigger (for performance reasons) - it's better to batch them. Some frameworks dynamically load content and we can't rely on the window's "load" or "DOMContentLoaded" events to trigger it.
    if (_queueRefreshID !== _refreshID) {
        var id = _queueRefreshID = _refreshID;
        requestAnimationFrame(function() {
            return id === _refreshID && _refreshAll(true);
        });
    }
}, _refresh100vh = function _refresh100vh() {
    _body.appendChild(_div100vh);
    _100vh = !_normalizer && _div100vh.offsetHeight || _win.innerHeight;
    _body.removeChild(_div100vh);
}, _hideAllMarkers = function _hideAllMarkers(hide) {
    return _toArray(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(el) {
        return el.style.display = hide ? "none" : "block";
    });
}, _refreshAll = function _refreshAll(force, skipRevert) {
    if (_lastScrollTime && !force && !_isReverted) {
        _addListener(ScrollTrigger, "scrollEnd", _softRefresh);
        return;
    }
    _refresh100vh();
    _refreshingAll = ScrollTrigger.isRefreshing = true;
    (0, _observerJs._scrollers).forEach(function(obj) {
        return _isFunction(obj) && ++obj.cacheID && (obj.rec = obj());
    }); // force the clearing of the cache because some browsers take a little while to dispatch the "scroll" event and the user may have changed the scroll position and then called ScrollTrigger.refresh() right away
    var refreshInits = _dispatch("refreshInit");
    _sort && ScrollTrigger.sort();
    skipRevert || _revertAll();
    (0, _observerJs._scrollers).forEach(function(obj) {
        if (_isFunction(obj)) {
            obj.smooth && (obj.target.style.scrollBehavior = "auto"); // smooth scrolling interferes
            obj(0);
        }
    });
    _triggers.slice(0).forEach(function(t) {
        return t.refresh();
    }); // don't loop with _i because during a refresh() someone could call ScrollTrigger.update() which would iterate through _i resulting in a skip.
    _isReverted = false;
    _triggers.forEach(function(t) {
        // nested pins (pinnedContainer) with pinSpacing may expand the container, so we must accommodate that here.
        if (t._subPinOffset && t.pin) {
            var prop = t.vars.horizontal ? "offsetWidth" : "offsetHeight", original = t.pin[prop];
            t.revert(true, 1);
            t.adjustPinSpacing(t.pin[prop] - original);
            t.refresh();
        }
    });
    _clampingMax = 1; // pinSpacing might be propping a page open, thus when we .setPositions() to clamp a ScrollTrigger's end we should leave the pinSpacing alone. That's what this flag is for.
    _hideAllMarkers(true);
    _triggers.forEach(function(t) {
        // the scroller's max scroll position may change after all the ScrollTriggers refreshed (like pinning could push it down), so we need to loop back and correct any with end: "max". Same for anything with a clamped end
        var max = _maxScroll(t.scroller, t._dir), endClamp = t.vars.end === "max" || t._endClamp && t.end > max, startClamp = t._startClamp && t.start >= max;
        (endClamp || startClamp) && t.setPositions(startClamp ? max - 1 : t.start, endClamp ? Math.max(startClamp ? max : t.start + 1, max) : t.end, true);
    });
    _hideAllMarkers(false);
    _clampingMax = 0;
    refreshInits.forEach(function(result) {
        return result && result.render && result.render(-1);
    }); // if the onRefreshInit() returns an animation (typically a gsap.set()), revert it. This makes it easy to put things in a certain spot before refreshing for measurement purposes, and then put things back.
    (0, _observerJs._scrollers).forEach(function(obj) {
        if (_isFunction(obj)) {
            obj.smooth && requestAnimationFrame(function() {
                return obj.target.style.scrollBehavior = "smooth";
            });
            obj.rec && obj(obj.rec);
        }
    });
    _clearScrollMemory(_scrollRestoration, 1);
    _resizeDelay.pause();
    _refreshID++;
    _refreshingAll = 2;
    _updateAll(2);
    _triggers.forEach(function(t) {
        return _isFunction(t.vars.onRefresh) && t.vars.onRefresh(t);
    });
    _refreshingAll = ScrollTrigger.isRefreshing = false;
    _dispatch("refresh");
}, _lastScroll = 0, _direction = 1, _primary, _updateAll = function _updateAll(force) {
    if (force === 2 || !_refreshingAll && !_isReverted) {
        // _isReverted could be true if, for example, a matchMedia() is in the process of executing. We don't want to update during the time everything is reverted.
        ScrollTrigger.isUpdating = true;
        _primary && _primary.update(0); // ScrollSmoother uses refreshPriority -9999 to become the primary that gets updated before all others because it affects the scroll position.
        var l = _triggers.length, time = _getTime(), recordVelocity = time - _time1 >= 50, scroll = l && _triggers[0].scroll();
        _direction = _lastScroll > scroll ? -1 : 1;
        _refreshingAll || (_lastScroll = scroll);
        if (recordVelocity) {
            if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
                _lastScrollTime = 0;
                _dispatch("scrollEnd");
            }
            _time2 = _time1;
            _time1 = time;
        }
        if (_direction < 0) {
            _i = l;
            while(_i-- > 0)_triggers[_i] && _triggers[_i].update(0, recordVelocity);
            _direction = 1;
        } else for(_i = 0; _i < l; _i++)_triggers[_i] && _triggers[_i].update(0, recordVelocity);
        ScrollTrigger.isUpdating = false;
    }
    _rafID = 0;
}, _propNamesToCopy = [
    _left,
    _top,
    _bottom,
    _right,
    _margin + _Bottom,
    _margin + _Right,
    _margin + _Top,
    _margin + _Left,
    "display",
    "flexShrink",
    "float",
    "zIndex",
    "gridColumnStart",
    "gridColumnEnd",
    "gridRowStart",
    "gridRowEnd",
    "gridArea",
    "justifySelf",
    "alignSelf",
    "placeSelf",
    "order"
], _stateProps = _propNamesToCopy.concat([
    _width,
    _height,
    "boxSizing",
    "max" + _Width,
    "max" + _Height,
    "position",
    _margin,
    _padding,
    _padding + _Top,
    _padding + _Right,
    _padding + _Bottom,
    _padding + _Left
]), _swapPinOut = function _swapPinOut(pin, spacer, state) {
    _setState(state);
    var cache = pin._gsap;
    if (cache.spacerIsNative) _setState(cache.spacerState);
    else if (pin._gsap.swappedIn) {
        var parent = spacer.parentNode;
        if (parent) {
            parent.insertBefore(pin, spacer);
            parent.removeChild(spacer);
        }
    }
    pin._gsap.swappedIn = false;
}, _swapPinIn = function _swapPinIn(pin, spacer, cs, spacerState) {
    if (!pin._gsap.swappedIn) {
        var i = _propNamesToCopy.length, spacerStyle = spacer.style, pinStyle = pin.style, p;
        while(i--){
            p = _propNamesToCopy[i];
            spacerStyle[p] = cs[p];
        }
        spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
        cs.display === "inline" && (spacerStyle.display = "inline-block");
        pinStyle[_bottom] = pinStyle[_right] = "auto";
        spacerStyle.flexBasis = cs.flexBasis || "auto";
        spacerStyle.overflow = "visible";
        spacerStyle.boxSizing = "border-box";
        spacerStyle[_width] = _getSize(pin, (0, _observerJs._horizontal)) + _px;
        spacerStyle[_height] = _getSize(pin, (0, _observerJs._vertical)) + _px;
        spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";
        _setState(spacerState);
        pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
        pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
        pinStyle[_padding] = cs[_padding];
        if (pin.parentNode !== spacer) {
            pin.parentNode.insertBefore(spacer, pin);
            spacer.appendChild(pin);
        }
        pin._gsap.swappedIn = true;
    }
}, _capsExp = /([A-Z])/g, _setState = function _setState(state) {
    if (state) {
        var style = state.t.style, l = state.length, i = 0, p, value;
        (state.t._gsap || gsap.core.getCache(state.t)).uncache = 1; // otherwise transforms may be off
        for(; i < l; i += 2){
            value = state[i + 1];
            p = state[i];
            if (value) style[p] = value;
            else if (style[p]) style.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
        }
    }
}, _getState = function _getState(element) {
    // returns an Array with alternating values like [property, value, property, value] and a "t" property pointing to the target (element). Makes it fast and cheap.
    var l = _stateProps.length, style = element.style, state = [], i = 0;
    for(; i < l; i++)state.push(_stateProps[i], style[_stateProps[i]]);
    state.t = element;
    return state;
}, _copyState = function _copyState(state, override, omitOffsets) {
    var result = [], l = state.length, i = omitOffsets ? 8 : 0, // skip top, left, right, bottom if omitOffsets is true
    p;
    for(; i < l; i += 2){
        p = state[i];
        result.push(p, p in override ? override[p] : state[i + 1]);
    }
    result.t = state.t;
    return result;
}, _winOffsets = {
    left: 0,
    top: 0
}, // // potential future feature (?) Allow users to calculate where a trigger hits (scroll position) like getScrollPosition("#id", "top bottom")
// _getScrollPosition = (trigger, position, {scroller, containerAnimation, horizontal}) => {
// 	scroller = _getTarget(scroller || _win);
// 	let direction = horizontal ? _horizontal : _vertical,
// 		isViewport = _isViewport(scroller);
// 	_getSizeFunc(scroller, isViewport, direction);
// 	return _parsePosition(position, _getTarget(trigger), _getSizeFunc(scroller, isViewport, direction)(), direction, _getScrollFunc(scroller, direction)(), 0, 0, 0, _getOffsetsFunc(scroller, isViewport)(), isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, 0, containerAnimation ? containerAnimation.duration() : _maxScroll(scroller), containerAnimation);
// },
_parsePosition = function _parsePosition(value, trigger, scrollerSize, direction, scroll, marker, markerScroller, self, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation, clampZeroProp) {
    _isFunction(value) && (value = value(self));
    if (_isString(value) && value.substr(0, 3) === "max") value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
    var time = containerAnimation ? containerAnimation.time() : 0, p1, p2, element;
    containerAnimation && containerAnimation.seek(0);
    isNaN(value) || (value = +value); // convert a string number like "45" to an actual number
    if (!_isNumber(value)) {
        _isFunction(trigger) && (trigger = trigger(self));
        var offsets = (value || "0").split(" "), bounds, localOffset, globalOffset, display;
        element = (0, _observerJs._getTarget)(trigger, self) || _body;
        bounds = _getBounds(element) || {};
        if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle(element).display === "none") {
            // if display is "none", it won't report getBoundingClientRect() properly
            display = element.style.display;
            element.style.display = "block";
            bounds = _getBounds(element);
            display ? element.style.display = display : element.style.removeProperty("display");
        }
        localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
        globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
        value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
        markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
        scrollerSize -= scrollerSize - globalOffset; // adjust for the marker
    } else {
        containerAnimation && (value = gsap.utils.mapRange(containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, 0, scrollerMax, value));
        markerScroller && _positionMarker(markerScroller, scrollerSize, direction, true);
    }
    if (clampZeroProp) {
        self[clampZeroProp] = value || -0.001;
        value < 0 && (value = 0);
    }
    if (marker) {
        var position = value + scrollerSize, isStart = marker._isStart;
        p1 = "scroll" + direction.d2;
        _positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body[p1], _docEl[p1]) : marker.parentNode[p1]) <= position + 1);
        if (useFixedPosition) {
            scrollerBounds = _getBounds(markerScroller);
            useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
        }
    }
    if (containerAnimation && element) {
        p1 = _getBounds(element);
        containerAnimation.seek(scrollerMax);
        p2 = _getBounds(element);
        containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
        value = value / containerAnimation._caScrollDist * scrollerMax;
    }
    containerAnimation && containerAnimation.seek(time);
    return containerAnimation ? value : Math.round(value);
}, _prefixExp = /(webkit|moz|length|cssText|inset)/i, _reparent = function _reparent(element, parent, top, left) {
    if (element.parentNode !== parent) {
        var style = element.style, p, cs;
        if (parent === _body) {
            element._stOrig = style.cssText; // record original inline styles so we can revert them later
            cs = _getComputedStyle(element);
            for(p in cs)// must copy all relevant styles to ensure that nothing changes visually when we reparent to the <body>. Skip the vendor prefixed ones.
            if (!+p && !_prefixExp.test(p) && cs[p] && typeof style[p] === "string" && p !== "0") style[p] = cs[p];
            style.top = top;
            style.left = left;
        } else style.cssText = element._stOrig;
        gsap.core.getCache(element).uncache = 1;
        parent.appendChild(element);
    }
}, _interruptionTracker = function _interruptionTracker(getValueFunc, initialValue, onInterrupt) {
    var last1 = initialValue, last2 = last1;
    return function(value) {
        var current = Math.round(getValueFunc()); // round because in some [very uncommon] Windows environments, scroll can get reported with decimals even though it was set without.
        if (current !== last1 && current !== last2 && Math.abs(current - last1) > 3 && Math.abs(current - last2) > 3) {
            // if the user scrolls, kill the tween. iOS Safari intermittently misreports the scroll position, it may be the most recently-set one or the one before that! When Safari is zoomed (CMD-+), it often misreports as 1 pixel off too! So if we set the scroll position to 125, for example, it'll actually report it as 124.
            value = current;
            onInterrupt && onInterrupt();
        }
        last2 = last1;
        last1 = value;
        return value;
    };
}, _shiftMarker = function _shiftMarker(marker, direction, value) {
    var vars = {};
    vars[direction.p] = "+=" + value;
    gsap.set(marker, vars);
}, // _mergeAnimations = animations => {
// 	let tl = gsap.timeline({smoothChildTiming: true}).startTime(Math.min(...animations.map(a => a.globalTime(0))));
// 	animations.forEach(a => {let time = a.totalTime(); tl.add(a); a.totalTime(time); });
// 	tl.smoothChildTiming = false;
// 	return tl;
// },
// returns a function that can be used to tween the scroll position in the direction provided, and when doing so it'll add a .tween property to the FUNCTION itself, and remove it when the tween completes or gets killed. This gives us a way to have multiple ScrollTriggers use a central function for any given scroller and see if there's a scroll tween running (which would affect if/how things get updated)
_getTweenCreator = function _getTweenCreator(scroller, direction) {
    var getScroll = (0, _observerJs._getScrollFunc)(scroller, direction), prop = "_scroll" + direction.p2, // add a tweenable property to the scroller that's a getter/setter function, like _scrollTop or _scrollLeft. This way, if someone does gsap.killTweensOf(scroller) it'll kill the scroll tween.
    getTween = function getTween(scrollTo, vars, initialValue, change1, change2) {
        var tween = getTween.tween, onComplete = vars.onComplete, modifiers = {};
        initialValue = initialValue || getScroll();
        var checkForInterruption = _interruptionTracker(getScroll, initialValue, function() {
            tween.kill();
            getTween.tween = 0;
        });
        change2 = change1 && change2 || 0; // if change1 is 0, we set that to the difference and ignore change2. Otherwise, there would be a compound effect.
        change1 = change1 || scrollTo - initialValue;
        tween && tween.kill();
        vars[prop] = scrollTo;
        vars.inherit = false;
        vars.modifiers = modifiers;
        modifiers[prop] = function() {
            return checkForInterruption(initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio);
        };
        vars.onUpdate = function() {
            (0, _observerJs._scrollers).cache++;
            getTween.tween && _updateAll(); // if it was interrupted/killed, like in a context.revert(), don't force an updateAll()
        };
        vars.onComplete = function() {
            getTween.tween = 0;
            onComplete && onComplete.call(tween);
        };
        tween = getTween.tween = gsap.to(scroller, vars);
        return tween;
    };
    scroller[prop] = getScroll;
    getScroll.wheelHandler = function() {
        return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
    };
    _addListener(scroller, "wheel", getScroll.wheelHandler); // Windows machines handle mousewheel scrolling in chunks (like "3 lines per scroll") meaning the typical strategy for cancelling the scroll isn't as sensitive. It's much more likely to match one of the previous 2 scroll event positions. So we kill any snapping as soon as there's a wheel event.
    ScrollTrigger.isTouch && _addListener(scroller, "touchmove", getScroll.wheelHandler);
    return getTween;
};
var ScrollTrigger = /*#__PURE__*/ function() {
    function ScrollTrigger(vars, animation) {
        _coreInitted || ScrollTrigger.register(gsap) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");
        _context(this);
        this.init(vars, animation);
    }
    var _proto = ScrollTrigger.prototype;
    _proto.init = function init(vars, animation) {
        this.progress = this.start = 0;
        this.vars && this.kill(true, true); // in case it's being initted again
        if (!_enabled) {
            this.update = this.refresh = this.kill = _passThrough;
            return;
        }
        vars = _setDefaults(_isString(vars) || _isNumber(vars) || vars.nodeType ? {
            trigger: vars
        } : vars, _defaults);
        var _vars = vars, onUpdate = _vars.onUpdate, toggleClass = _vars.toggleClass, id = _vars.id, onToggle = _vars.onToggle, onRefresh = _vars.onRefresh, scrub = _vars.scrub, trigger = _vars.trigger, pin = _vars.pin, pinSpacing = _vars.pinSpacing, invalidateOnRefresh = _vars.invalidateOnRefresh, anticipatePin = _vars.anticipatePin, onScrubComplete = _vars.onScrubComplete, onSnapComplete = _vars.onSnapComplete, once = _vars.once, snap = _vars.snap, pinReparent = _vars.pinReparent, pinSpacer = _vars.pinSpacer, containerAnimation = _vars.containerAnimation, fastScrollEnd = _vars.fastScrollEnd, preventOverlaps = _vars.preventOverlaps, direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? (0, _observerJs._horizontal) : (0, _observerJs._vertical), isToggle = !scrub && scrub !== 0, scroller = (0, _observerJs._getTarget)(vars.scroller || _win), scrollerCache = gsap.core.getCache(scroller), isViewport = _isViewport(scroller), useFixedPosition = ("pinType" in vars ? vars.pinType : (0, _observerJs._getProxyProp)(scroller, "pinType") || isViewport && "fixed") === "fixed", callbacks = [
            vars.onEnter,
            vars.onLeave,
            vars.onEnterBack,
            vars.onLeaveBack
        ], toggleActions = isToggle && vars.toggleActions.split(" "), markers = "markers" in vars ? vars.markers : _defaults.markers, borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, self = this, onRefreshInit = vars.onRefreshInit && function() {
            return vars.onRefreshInit(self);
        }, getScrollerSize = _getSizeFunc(scroller, isViewport, direction), getScrollerOffsets = _getOffsetsFunc(scroller, isViewport), lastSnap = 0, lastRefresh = 0, prevProgress = 0, scrollFunc = (0, _observerJs._getScrollFunc)(scroller, direction), tweenTo, pinCache, snapFunc, scroll1, scroll2, start, end, markerStart, markerEnd, markerStartTrigger, markerEndTrigger, markerVars, executingOnRefresh, change, pinOriginalState, pinActiveState, pinState, spacer, offset, pinGetter, pinSetter, pinStart, pinChange, spacingStart, spacerState, markerStartSetter, pinMoves, markerEndSetter, cs, snap1, snap2, scrubTween, scrubSmooth, snapDurClamp, snapDelayedCall, prevScroll, prevAnimProgress, caMarkerSetter, customRevertReturn; // for the sake of efficiency, _startClamp/_endClamp serve like a truthy value indicating that clamping was enabled on the start/end, and ALSO store the actual pre-clamped numeric value. We tap into that in ScrollSmoother for speed effects. So for example, if start="clamp(top bottom)" results in a start of -100 naturally, it would get clamped to 0 but -100 would be stored in _startClamp.
        self._startClamp = self._endClamp = false;
        self._dir = direction;
        anticipatePin *= 45;
        self.scroller = scroller;
        self.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
        scroll1 = scrollFunc();
        self.vars = vars;
        animation = animation || vars.animation;
        if ("refreshPriority" in vars) {
            _sort = 1;
            vars.refreshPriority === -9999 && (_primary = self); // used by ScrollSmoother
        }
        scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
            top: _getTweenCreator(scroller, (0, _observerJs._vertical)),
            left: _getTweenCreator(scroller, (0, _observerJs._horizontal))
        };
        self.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];
        self.scrubDuration = function(value) {
            scrubSmooth = _isNumber(value) && value;
            if (!scrubSmooth) {
                scrubTween && scrubTween.progress(1).kill();
                scrubTween = 0;
            } else scrubTween ? scrubTween.duration(value) : scrubTween = gsap.to(animation, {
                ease: "expo",
                totalProgress: "+=0",
                inherit: false,
                duration: scrubSmooth,
                paused: true,
                onComplete: function onComplete() {
                    return onScrubComplete && onScrubComplete(self);
                }
            });
        };
        if (animation) {
            animation.vars.lazy = false;
            animation._initted && !self.isReverted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.duration() && animation.render(0, true, true); // special case: if this ScrollTrigger gets re-initted, a from() tween with a stagger could get initted initially and then reverted on the re-init which means it'll need to get rendered again here to properly display things. Otherwise, See https://gsap.com/forums/topic/36777-scrollsmoother-splittext-nextjs/ and https://codepen.io/GreenSock/pen/eYPyPpd?editors=0010
            self.animation = animation.pause();
            animation.scrollTrigger = self;
            self.scrubDuration(scrub);
            snap1 = 0;
            id || (id = animation.vars.id);
        }
        if (snap) {
            // TODO: potential idea: use legitimate CSS scroll snapping by pushing invisible elements into the DOM that serve as snap positions, and toggle the document.scrollingElement.style.scrollSnapType onToggle. See https://codepen.io/GreenSock/pen/JjLrgWM for a quick proof of concept.
            if (!_isObject(snap) || snap.push) snap = {
                snapTo: snap
            };
            "scrollBehavior" in _body.style && gsap.set(isViewport ? [
                _body,
                _docEl
            ] : scroller, {
                scrollBehavior: "auto"
            }); // smooth scrolling doesn't work with snap.
            (0, _observerJs._scrollers).forEach(function(o) {
                return _isFunction(o) && o.target === (isViewport ? _doc.scrollingElement || _docEl : scroller) && (o.smooth = false);
            }); // note: set smooth to false on both the vertical and horizontal scroll getters/setters
            snapFunc = _isFunction(snap.snapTo) ? snap.snapTo : snap.snapTo === "labels" ? _getClosestLabel(animation) : snap.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap.directional !== false ? function(value, st) {
                return _snapDirectional(snap.snapTo)(value, _getTime() - lastRefresh < 500 ? 0 : st.direction);
            } : gsap.utils.snap(snap.snapTo);
            snapDurClamp = snap.duration || {
                min: 0.1,
                max: 2
            };
            snapDurClamp = _isObject(snapDurClamp) ? _clamp(snapDurClamp.min, snapDurClamp.max) : _clamp(snapDurClamp, snapDurClamp);
            snapDelayedCall = gsap.delayedCall(snap.delay || scrubSmooth / 2 || 0.1, function() {
                var scroll = scrollFunc(), refreshedRecently = _getTime() - lastRefresh < 500, tween = tweenTo.tween;
                if ((refreshedRecently || Math.abs(self.getVelocity()) < 10) && !tween && !_pointerIsDown && lastSnap !== scroll) {
                    var progress = (scroll - start) / change, totalProgress = animation && !isToggle ? animation.totalProgress() : progress, velocity = refreshedRecently ? 0 : (totalProgress - snap2) / (_getTime() - _time2) * 1000 || 0, change1 = gsap.utils.clamp(-progress, 1 - progress, _abs(velocity / 2) * velocity / 0.185), naturalEnd = progress + (snap.inertia === false ? 0 : change1), endValue, endScroll, _snap = snap, onStart = _snap.onStart, _onInterrupt = _snap.onInterrupt, _onComplete = _snap.onComplete;
                    endValue = snapFunc(naturalEnd, self);
                    _isNumber(endValue) || (endValue = naturalEnd); // in case the function didn't return a number, fall back to using the naturalEnd
                    endScroll = Math.round(start + endValue * change);
                    if (scroll <= end && scroll >= start && endScroll !== scroll) {
                        if (tween && !tween._initted && tween.data <= _abs(endScroll - scroll)) // there's an overlapping snap! So we must figure out which one is closer and let that tween live.
                        return;
                        if (snap.inertia === false) change1 = endValue - progress;
                        tweenTo(endScroll, {
                            duration: snapDurClamp(_abs(Math.max(_abs(naturalEnd - totalProgress), _abs(endValue - totalProgress)) * 0.185 / velocity / 0.05 || 0)),
                            ease: snap.ease || "power3",
                            data: _abs(endScroll - scroll),
                            // record the distance so that if another snap tween occurs (conflict) we can prioritize the closest snap.
                            onInterrupt: function onInterrupt() {
                                return snapDelayedCall.restart(true) && _onInterrupt && _onInterrupt(self);
                            },
                            onComplete: function onComplete() {
                                self.update();
                                lastSnap = scrollFunc();
                                if (animation) // the resolution of the scrollbar is limited, so we should correct the scrubbed animation's playhead at the end to match EXACTLY where it was supposed to snap
                                scrubTween ? scrubTween.resetTo("totalProgress", endValue, animation._tTime / animation._tDur) : animation.progress(endValue);
                                snap1 = snap2 = animation && !isToggle ? animation.totalProgress() : self.progress;
                                onSnapComplete && onSnapComplete(self);
                                _onComplete && _onComplete(self);
                            }
                        }, scroll, change1 * change, endScroll - scroll - change1 * change);
                        onStart && onStart(self, tweenTo.tween);
                    }
                } else if (self.isActive && lastSnap !== scroll) snapDelayedCall.restart(true);
            }).pause();
        }
        id && (_ids[id] = self);
        trigger = self.trigger = (0, _observerJs._getTarget)(trigger || pin !== true && pin); // if a trigger has some kind of scroll-related effect applied that could contaminate the "y" or "x" position (like a ScrollSmoother effect), we needed a way to temporarily revert it, so we use the stRevert property of the gsCache. It can return another function that we'll call at the end so it can return to its normal state.
        customRevertReturn = trigger && trigger._gsap && trigger._gsap.stRevert;
        customRevertReturn && (customRevertReturn = customRevertReturn(self));
        pin = pin === true ? trigger : (0, _observerJs._getTarget)(pin);
        _isString(toggleClass) && (toggleClass = {
            targets: trigger,
            className: toggleClass
        });
        if (pin) {
            pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && pin.parentNode && pin.parentNode.style && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding); // if the parent is display: flex, don't apply pinSpacing by default. We should check that pin.parentNode is an element (not shadow dom window)
            self.pin = pin;
            pinCache = gsap.core.getCache(pin);
            if (!pinCache.spacer) {
                // record the spacer and pinOriginalState on the cache in case someone tries pinning the same element with MULTIPLE ScrollTriggers - we don't want to have multiple spacers or record the "original" pin state after it has already been affected by another ScrollTrigger.
                if (pinSpacer) {
                    pinSpacer = (0, _observerJs._getTarget)(pinSpacer);
                    pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement); // for React & Angular
                    pinCache.spacerIsNative = !!pinSpacer;
                    pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
                }
                pinCache.spacer = spacer = pinSpacer || _doc.createElement("div");
                spacer.classList.add("pin-spacer");
                id && spacer.classList.add("pin-spacer-" + id);
                pinCache.pinState = pinOriginalState = _getState(pin);
            } else pinOriginalState = pinCache.pinState;
            vars.force3D !== false && gsap.set(pin, {
                force3D: true
            });
            self.spacer = spacer = pinCache.spacer;
            cs = _getComputedStyle(pin);
            spacingStart = cs[pinSpacing + direction.os2];
            pinGetter = gsap.getProperty(pin);
            pinSetter = gsap.quickSetter(pin, direction.a, _px); // pin.firstChild && !_maxScroll(pin, direction) && (pin.style.overflow = "hidden"); // protects from collapsing margins, but can have unintended consequences as demonstrated here: https://codepen.io/GreenSock/pen/1e42c7a73bfa409d2cf1e184e7a4248d so it was removed in favor of just telling people to set up their CSS to avoid the collapsing margins (overflow: hidden | auto is just one option. Another is border-top: 1px solid transparent).
            _swapPinIn(pin, spacer, cs);
            pinState = _getState(pin);
        }
        if (markers) {
            markerVars = _isObject(markers) ? _setDefaults(markers, _markerDefaults) : _markerDefaults;
            markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
            markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
            offset = markerStartTrigger["offset" + direction.op.d2];
            var content = (0, _observerJs._getTarget)((0, _observerJs._getProxyProp)(scroller, "content") || scroller);
            markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset, 0, containerAnimation);
            markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset, 0, containerAnimation);
            containerAnimation && (caMarkerSetter = gsap.quickSetter([
                markerStart,
                markerEnd
            ], direction.a, _px));
            if (!useFixedPosition && !((0, _observerJs._proxies).length && (0, _observerJs._getProxyProp)(scroller, "fixedMarkers") === true)) {
                _makePositionable(isViewport ? _body : scroller);
                gsap.set([
                    markerStartTrigger,
                    markerEndTrigger
                ], {
                    force3D: true
                });
                markerStartSetter = gsap.quickSetter(markerStartTrigger, direction.a, _px);
                markerEndSetter = gsap.quickSetter(markerEndTrigger, direction.a, _px);
            }
        }
        if (containerAnimation) {
            var oldOnUpdate = containerAnimation.vars.onUpdate, oldParams = containerAnimation.vars.onUpdateParams;
            containerAnimation.eventCallback("onUpdate", function() {
                self.update(0, 0, 1);
                oldOnUpdate && oldOnUpdate.apply(containerAnimation, oldParams || []);
            });
        }
        self.previous = function() {
            return _triggers[_triggers.indexOf(self) - 1];
        };
        self.next = function() {
            return _triggers[_triggers.indexOf(self) + 1];
        };
        self.revert = function(revert, temp) {
            if (!temp) return self.kill(true);
             // for compatibility with gsap.context() and gsap.matchMedia() which call revert()
            var r = revert !== false || !self.enabled, prevRefreshing = _refreshing;
            if (r !== self.isReverted) {
                if (r) {
                    prevScroll = Math.max(scrollFunc(), self.scroll.rec || 0); // record the scroll so we can revert later (repositioning/pinning things can affect scroll position). In the static refresh() method, we first record all the scroll positions as a reference.
                    prevProgress = self.progress;
                    prevAnimProgress = animation && animation.progress();
                }
                markerStart && [
                    markerStart,
                    markerEnd,
                    markerStartTrigger,
                    markerEndTrigger
                ].forEach(function(m) {
                    return m.style.display = r ? "none" : "block";
                });
                if (r) {
                    _refreshing = self;
                    self.update(r); // make sure the pin is back in its original position so that all the measurements are correct. do this BEFORE swapping the pin out
                }
                if (pin && (!pinReparent || !self.isActive)) {
                    if (r) _swapPinOut(pin, spacer, pinOriginalState);
                    else _swapPinIn(pin, spacer, _getComputedStyle(pin), spacerState);
                }
                r || self.update(r); // when we're restoring, the update should run AFTER swapping the pin into its pin-spacer.
                _refreshing = prevRefreshing; // restore. We set it to true during the update() so that things fire properly in there.
                self.isReverted = r;
            }
        };
        self.refresh = function(soft, force, position, pinOffset) {
            // position is typically only defined if it's coming from setPositions() - it's a way to skip the normal parsing. pinOffset is also only from setPositions() and is mostly related to fancy stuff we need to do in ScrollSmoother with effects
            if ((_refreshing || !self.enabled) && !force) return;
            if (pin && soft && _lastScrollTime) {
                _addListener(ScrollTrigger, "scrollEnd", _softRefresh);
                return;
            }
            !_refreshingAll && onRefreshInit && onRefreshInit(self);
            _refreshing = self;
            if (tweenTo.tween && !position) {
                // we skip this if a position is passed in because typically that's from .setPositions() and it's best to allow in-progress snapping to continue.
                tweenTo.tween.kill();
                tweenTo.tween = 0;
            }
            scrubTween && scrubTween.pause();
            invalidateOnRefresh && animation && animation.revert({
                kill: false
            }).invalidate();
            self.isReverted || self.revert(true, true);
            self._subPinOffset = false; // we'll set this to true in the sub-pins if we find any
            var size = getScrollerSize(), scrollerBounds = getScrollerOffsets(), max = containerAnimation ? containerAnimation.duration() : _maxScroll(scroller, direction), isFirstRefresh = change <= 0.01, offset = 0, otherPinOffset = pinOffset || 0, parsedEnd = _isObject(position) ? position.end : vars.end, parsedEndTrigger = vars.endTrigger || trigger, parsedStart = _isObject(position) ? position.start : vars.start || (vars.start === 0 || !trigger ? 0 : pin ? "0 0" : "0 100%"), pinnedContainer = self.pinnedContainer = vars.pinnedContainer && (0, _observerJs._getTarget)(vars.pinnedContainer, self), triggerIndex = trigger && Math.max(0, _triggers.indexOf(self)) || 0, i = triggerIndex, cs, bounds, scroll, isVertical, override, curTrigger, curPin, oppositeScroll, initted, revertedPins, forcedOverflow, markerStartOffset, markerEndOffset;
            if (markers && _isObject(position)) {
                // if we alter the start/end positions with .setPositions(), it generally feeds in absolute NUMBERS which don't convey information about where to line up the markers, so to keep it intuitive, we record how far the trigger positions shift after applying the new numbers and then offset by that much in the opposite direction. We do the same to the associated trigger markers too of course.
                markerStartOffset = gsap.getProperty(markerStartTrigger, direction.p);
                markerEndOffset = gsap.getProperty(markerEndTrigger, direction.p);
            }
            while(i--){
                // user might try to pin the same element more than once, so we must find any prior triggers with the same pin, revert them, and determine how long they're pinning so that we can offset things appropriately. Make sure we revert from last to first so that things "rewind" properly.
                curTrigger = _triggers[i];
                curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = self); // if it's a timeline-based trigger that hasn't been fully initialized yet because it's waiting for 1 tick, just force the refresh() here, otherwise if it contains a pin that's supposed to affect other ScrollTriggers further down the page, they won't be adjusted properly.
                curPin = curTrigger.pin;
                if (curPin && (curPin === trigger || curPin === pin || curPin === pinnedContainer) && !curTrigger.isReverted) {
                    revertedPins || (revertedPins = []);
                    revertedPins.unshift(curTrigger); // we'll revert from first to last to make sure things reach their end state properly
                    curTrigger.revert(true, true);
                }
                if (curTrigger !== _triggers[i]) {
                    // in case it got removed.
                    triggerIndex--;
                    i--;
                }
            }
            _isFunction(parsedStart) && (parsedStart = parsedStart(self));
            parsedStart = _parseClamp(parsedStart, "start", self);
            start = _parsePosition(parsedStart, trigger, size, direction, scrollFunc(), markerStart, markerStartTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self._startClamp && "_startClamp") || (pin ? -0.001 : 0);
            _isFunction(parsedEnd) && (parsedEnd = parsedEnd(self));
            if (_isString(parsedEnd) && !parsedEnd.indexOf("+=")) {
                if (~parsedEnd.indexOf(" ")) parsedEnd = (_isString(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
                else {
                    offset = _offsetToPx(parsedEnd.substr(2), size);
                    parsedEnd = _isString(parsedStart) ? parsedStart : (containerAnimation ? gsap.utils.mapRange(0, containerAnimation.duration(), containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, start) : start) + offset; // _parsePosition won't factor in the offset if the start is a number, so do it here.
                    parsedEndTrigger = trigger;
                }
            }
            parsedEnd = _parseClamp(parsedEnd, "end", self);
            end = Math.max(start, _parsePosition(parsedEnd || (parsedEndTrigger ? "100% 0" : max), parsedEndTrigger, size, direction, scrollFunc() + offset, markerEnd, markerEndTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation, self._endClamp && "_endClamp")) || -0.001;
            offset = 0;
            i = triggerIndex;
            while(i--){
                curTrigger = _triggers[i];
                curPin = curTrigger.pin;
                if (curPin && curTrigger.start - curTrigger._pinPush <= start && !containerAnimation && curTrigger.end > 0) {
                    cs = curTrigger.end - (self._startClamp ? Math.max(0, curTrigger.start) : curTrigger.start);
                    if ((curPin === trigger && curTrigger.start - curTrigger._pinPush < start || curPin === pinnedContainer) && isNaN(parsedStart)) // numeric start values shouldn't be offset at all - treat them as absolute
                    offset += cs * (1 - curTrigger.progress);
                    curPin === pin && (otherPinOffset += cs);
                }
            }
            start += offset;
            end += offset;
            self._startClamp && (self._startClamp += offset);
            if (self._endClamp && !_refreshingAll) {
                self._endClamp = end || -0.001;
                end = Math.min(end, _maxScroll(scroller, direction));
            }
            change = end - start || (start -= 0.01) && 0.001;
            if (isFirstRefresh) // on the very first refresh(), the prevProgress couldn't have been accurate yet because the start/end were never calculated, so we set it here. Before 3.11.5, it could lead to an inaccurate scroll position restoration with snapping.
            prevProgress = gsap.utils.clamp(0, 1, gsap.utils.normalize(start, end, prevScroll));
            self._pinPush = otherPinOffset;
            if (markerStart && offset) {
                // offset the markers if necessary
                cs = {};
                cs[direction.a] = "+=" + offset;
                pinnedContainer && (cs[direction.p] = "-=" + scrollFunc());
                gsap.set([
                    markerStart,
                    markerEnd
                ], cs);
            }
            if (pin && !(_clampingMax && self.end >= _maxScroll(scroller, direction))) {
                cs = _getComputedStyle(pin);
                isVertical = direction === (0, _observerJs._vertical);
                scroll = scrollFunc(); // recalculate because the triggers can affect the scroll
                pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;
                if (!max && end > 1) {
                    // makes sure the scroller has a scrollbar, otherwise if something has width: 100%, for example, it would be too big (exclude the scrollbar). See https://gsap.com/forums/topic/25182-scrolltrigger-width-of-page-increase-where-markers-are-set-to-false/
                    forcedOverflow = (isViewport ? _doc.scrollingElement || _docEl : scroller).style;
                    forcedOverflow = {
                        style: forcedOverflow,
                        value: forcedOverflow["overflow" + direction.a.toUpperCase()]
                    };
                    if (isViewport && _getComputedStyle(_body)["overflow" + direction.a.toUpperCase()] !== "scroll") // avoid an extra scrollbar if BOTH <html> and <body> have overflow set to "scroll"
                    forcedOverflow.style["overflow" + direction.a.toUpperCase()] = "scroll";
                }
                _swapPinIn(pin, spacer, cs);
                pinState = _getState(pin); // transforms will interfere with the top/left/right/bottom placement, so remove them temporarily. getBoundingClientRect() factors in transforms.
                bounds = _getBounds(pin, true);
                oppositeScroll = useFixedPosition && (0, _observerJs._getScrollFunc)(scroller, isVertical ? (0, _observerJs._horizontal) : (0, _observerJs._vertical))();
                if (pinSpacing) {
                    spacerState = [
                        pinSpacing + direction.os2,
                        change + otherPinOffset + _px
                    ];
                    spacerState.t = spacer;
                    i = pinSpacing === _padding ? _getSize(pin, direction) + change + otherPinOffset : 0;
                    if (i) {
                        spacerState.push(direction.d, i + _px); // for box-sizing: border-box (must include padding).
                        spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
                    }
                    _setState(spacerState);
                    if (pinnedContainer) // in ScrollTrigger.refresh(), we need to re-evaluate the pinContainer's size because this pinSpacing may stretch it out, but we can't just add the exact distance because depending on layout, it may not push things down or it may only do so partially.
                    _triggers.forEach(function(t) {
                        if (t.pin === pinnedContainer && t.vars.pinSpacing !== false) t._subPinOffset = true;
                    });
                    useFixedPosition && scrollFunc(prevScroll);
                } else {
                    i = _getSize(pin, direction);
                    i && spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
                }
                if (useFixedPosition) {
                    override = {
                        top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
                        left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
                        boxSizing: "border-box",
                        position: "fixed"
                    };
                    override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
                    override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
                    override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
                    override[_padding] = cs[_padding];
                    override[_padding + _Top] = cs[_padding + _Top];
                    override[_padding + _Right] = cs[_padding + _Right];
                    override[_padding + _Bottom] = cs[_padding + _Bottom];
                    override[_padding + _Left] = cs[_padding + _Left];
                    pinActiveState = _copyState(pinOriginalState, override, pinReparent);
                    _refreshingAll && scrollFunc(0);
                }
                if (animation) {
                    // the animation might be affecting the transform, so we must jump to the end, check the value, and compensate accordingly. Otherwise, when it becomes unpinned, the pinSetter() will get set to a value that doesn't include whatever the animation did.
                    initted = animation._initted; // if not, we must invalidate() after this step, otherwise it could lock in starting values prematurely.
                    _suppressOverwrites(1);
                    animation.render(animation.duration(), true, true);
                    pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
                    pinMoves = Math.abs(change - pinChange) > 1;
                    useFixedPosition && pinMoves && pinActiveState.splice(pinActiveState.length - 2, 2); // transform is the last property/value set in the state Array. Since the animation is controlling that, we should omit it.
                    animation.render(0, true, true);
                    initted || animation.invalidate(true);
                    animation.parent || animation.totalTime(animation.totalTime()); // if, for example, a toggleAction called play() and then refresh() happens and when we render(1) above, it would cause the animation to complete and get removed from its parent, so this makes sure it gets put back in.
                    _suppressOverwrites(0);
                } else pinChange = change;
                forcedOverflow && (forcedOverflow.value ? forcedOverflow.style["overflow" + direction.a.toUpperCase()] = forcedOverflow.value : forcedOverflow.style.removeProperty("overflow-" + direction.a));
            } else if (trigger && scrollFunc() && !containerAnimation) {
                // it may be INSIDE a pinned element, so walk up the tree and look for any elements with _pinOffset to compensate because anything with pinSpacing that's already scrolled would throw off the measurements in getBoundingClientRect()
                bounds = trigger.parentNode;
                while(bounds && bounds !== _body){
                    if (bounds._pinOffset) {
                        start -= bounds._pinOffset;
                        end -= bounds._pinOffset;
                    }
                    bounds = bounds.parentNode;
                }
            }
            revertedPins && revertedPins.forEach(function(t) {
                return t.revert(false, true);
            });
            self.start = start;
            self.end = end;
            scroll1 = scroll2 = _refreshingAll ? prevScroll : scrollFunc(); // reset velocity
            if (!containerAnimation && !_refreshingAll) {
                scroll1 < prevScroll && scrollFunc(prevScroll);
                self.scroll.rec = 0;
            }
            self.revert(false, true);
            lastRefresh = _getTime();
            if (snapDelayedCall) {
                lastSnap = -1; // just so snapping gets re-enabled, clear out any recorded last value
                // self.isActive && scrollFunc(start + change * prevProgress); // previously this line was here to ensure that when snapping kicks in, it's from the previous progress but in some cases that's not desirable, like an all-page ScrollTrigger when new content gets added to the page, that'd totally change the progress.
                snapDelayedCall.restart(true);
            }
            _refreshing = 0;
            animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress || 0, true).render(animation.time(), true, true); // must force a re-render because if saveStyles() was used on the target(s), the styles could have been wiped out during the refresh().
            if (isFirstRefresh || prevProgress !== self.progress || containerAnimation || invalidateOnRefresh) {
                // ensures that the direction is set properly (when refreshing, progress is set back to 0 initially, then back again to wherever it needs to be) and that callbacks are triggered.
                animation && !isToggle && animation.totalProgress(containerAnimation && start < -0.001 && !prevProgress ? gsap.utils.normalize(start, end, 0) : prevProgress, true); // to avoid issues where animation callbacks like onStart aren't triggered.
                self.progress = isFirstRefresh || (scroll1 - start) / change === prevProgress ? 0 : prevProgress;
            }
            pin && pinSpacing && (spacer._pinOffset = Math.round(self.progress * pinChange));
            scrubTween && scrubTween.invalidate();
            if (!isNaN(markerStartOffset)) {
                // numbers were passed in for the position which are absolute, so instead of just putting the markers at the very bottom of the viewport, we figure out how far they shifted down (it's safe to assume they were originally positioned in closer relation to the trigger element with values like "top", "center", a percentage or whatever, so we offset that much in the opposite direction to basically revert them to the relative position thy were at previously.
                markerStartOffset -= gsap.getProperty(markerStartTrigger, direction.p);
                markerEndOffset -= gsap.getProperty(markerEndTrigger, direction.p);
                _shiftMarker(markerStartTrigger, direction, markerStartOffset);
                _shiftMarker(markerStart, direction, markerStartOffset - (pinOffset || 0));
                _shiftMarker(markerEndTrigger, direction, markerEndOffset);
                _shiftMarker(markerEnd, direction, markerEndOffset - (pinOffset || 0));
            }
            isFirstRefresh && !_refreshingAll && self.update(); // edge case - when you reload a page when it's already scrolled down, some browsers fire a "scroll" event before DOMContentLoaded, triggering an updateAll(). If we don't update the self.progress as part of refresh(), then when it happens next, it may record prevProgress as 0 when it really shouldn't, potentially causing a callback in an animation to fire again.
            if (onRefresh && !_refreshingAll && !executingOnRefresh) {
                // when refreshing all, we do extra work to correct pinnedContainer sizes and ensure things don't exceed the maxScroll, so we should do all the refreshes at the end after all that work so that the start/end values are corrected.
                executingOnRefresh = true;
                onRefresh(self);
                executingOnRefresh = false;
            }
        };
        self.getVelocity = function() {
            return (scrollFunc() - scroll2) / (_getTime() - _time2) * 1000 || 0;
        };
        self.endAnimation = function() {
            _endAnimation(self.callbackAnimation);
            if (animation) scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self.direction < 0, 1);
        };
        self.labelToScroll = function(label) {
            return animation && animation.labels && (start || self.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
        };
        self.getTrailing = function(name) {
            var i = _triggers.indexOf(self), a = self.direction > 0 ? _triggers.slice(0, i).reverse() : _triggers.slice(i + 1);
            return (_isString(name) ? a.filter(function(t) {
                return t.vars.preventOverlaps === name;
            }) : a).filter(function(t) {
                return self.direction > 0 ? t.end <= start : t.start >= end;
            });
        };
        self.update = function(reset, recordVelocity, forceFake) {
            if (containerAnimation && !forceFake && !reset) return;
            var scroll = _refreshingAll === true ? prevScroll : self.scroll(), p = reset ? 0 : (scroll - start) / change, clipped = p < 0 ? 0 : p > 1 ? 1 : p || 0, prevProgress = self.progress, isActive, wasActive, toggleState, action, stateChanged, toggled, isAtMax, isTakingAction;
            if (recordVelocity) {
                scroll2 = scroll1;
                scroll1 = containerAnimation ? scrollFunc() : scroll;
                if (snap) {
                    snap2 = snap1;
                    snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
                }
            } // anticipate the pinning a few ticks ahead of time based on velocity to avoid a visual glitch due to the fact that most browsers do scrolling on a separate thread (not synced with requestAnimationFrame).
            if (anticipatePin && pin && !_refreshing && !_startup && _lastScrollTime) {
                if (!clipped && start < scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) clipped = 0.0001;
                else if (clipped === 1 && end > scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) clipped = 0.9999;
            }
            if (clipped !== prevProgress && self.enabled) {
                isActive = self.isActive = !!clipped && clipped < 1;
                wasActive = !!prevProgress && prevProgress < 1;
                toggled = isActive !== wasActive;
                stateChanged = toggled || !!clipped !== !!prevProgress; // could go from start all the way to end, thus it didn't toggle but it did change state in a sense (may need to fire a callback)
                self.direction = clipped > prevProgress ? 1 : -1;
                self.progress = clipped;
                if (stateChanged && !_refreshing) {
                    toggleState = clipped && !prevProgress ? 0 : clipped === 1 ? 1 : prevProgress === 1 ? 2 : 3; // 0 = enter, 1 = leave, 2 = enterBack, 3 = leaveBack (we prioritize the FIRST encounter, thus if you scroll really fast past the onEnter and onLeave in one tick, it'd prioritize onEnter.
                    if (isToggle) {
                        action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState]; // if it didn't toggle, that means it shot right past and since we prioritize the "enter" action, we should switch to the "leave" in this case (but only if one is defined)
                        isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
                    }
                }
                preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction(preventOverlaps) ? preventOverlaps(self) : self.getTrailing(preventOverlaps).forEach(function(t) {
                    return t.endAnimation();
                }));
                if (!isToggle) {
                    if (scrubTween && !_refreshing && !_startup) {
                        scrubTween._dp._time - scrubTween._start !== scrubTween._time && scrubTween.render(scrubTween._dp._time - scrubTween._start); // if there's a scrub on both the container animation and this one (or a ScrollSmoother), the update order would cause this one not to have rendered yet, so it wouldn't make any progress before we .restart() it heading toward the new progress so it'd appear stuck thus we force a render here.
                        if (scrubTween.resetTo) scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
                        else {
                            // legacy support (courtesy), before 3.10.0
                            scrubTween.vars.totalProgress = clipped;
                            scrubTween.invalidate().restart();
                        }
                    } else if (animation) animation.totalProgress(clipped, !!(_refreshing && (lastRefresh || reset)));
                }
                if (pin) {
                    reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);
                    if (!useFixedPosition) pinSetter(_round(pinStart + pinChange * clipped));
                    else if (stateChanged) {
                        isAtMax = !reset && clipped > prevProgress && end + 1 > scroll && scroll + 1 >= _maxScroll(scroller, direction); // if it's at the VERY end of the page, don't switch away from position: fixed because it's pointless and it could cause a brief flash when the user scrolls back up (when it gets pinned again)
                        if (pinReparent) {
                            if (!reset && (isActive || isAtMax)) {
                                var bounds = _getBounds(pin, true), _offset = scroll - start;
                                _reparent(pin, _body, bounds.top + (direction === (0, _observerJs._vertical) ? _offset : 0) + _px, bounds.left + (direction === (0, _observerJs._vertical) ? 0 : _offset) + _px);
                            } else _reparent(pin, spacer);
                        }
                        _setState(isActive || isAtMax ? pinActiveState : pinState);
                        pinMoves && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
                    }
                }
                snap && !tweenTo.tween && !_refreshing && !_startup && snapDelayedCall.restart(true);
                toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray(toggleClass.targets).forEach(function(el) {
                    return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
                }); // classes could affect positioning, so do it even if reset or refreshing is true.
                onUpdate && !isToggle && !reset && onUpdate(self);
                if (stateChanged && !_refreshing) {
                    if (isToggle) {
                        if (isTakingAction) {
                            if (action === "complete") animation.pause().totalProgress(1);
                            else if (action === "reset") animation.restart(true).pause();
                            else if (action === "restart") animation.restart(true);
                            else animation[action]();
                        }
                        onUpdate && onUpdate(self);
                    }
                    if (toggled || !_limitCallbacks) {
                        // on startup, the page could be scrolled and we don't want to fire callbacks that didn't toggle. For example onEnter shouldn't fire if the ScrollTrigger isn't actually entered.
                        onToggle && toggled && _callback(self, onToggle);
                        callbacks[toggleState] && _callback(self, callbacks[toggleState]);
                        once && (clipped === 1 ? self.kill(false, 1) : callbacks[toggleState] = 0); // a callback shouldn't be called again if once is true.
                        if (!toggled) {
                            // it's possible to go completely past, like from before the start to after the end (or vice-versa) in which case BOTH callbacks should be fired in that order
                            toggleState = clipped === 1 ? 1 : 3;
                            callbacks[toggleState] && _callback(self, callbacks[toggleState]);
                        }
                    }
                    if (fastScrollEnd && !isActive && Math.abs(self.getVelocity()) > (_isNumber(fastScrollEnd) ? fastScrollEnd : 2500)) {
                        _endAnimation(self.callbackAnimation);
                        scrubTween ? scrubTween.progress(1) : _endAnimation(animation, action === "reverse" ? 1 : !clipped, 1);
                    }
                } else if (isToggle && onUpdate && !_refreshing) onUpdate(self);
            } // update absolutely-positioned markers (only if the scroller isn't the viewport)
            if (markerEndSetter) {
                var n = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
                markerStartSetter(n + (markerStartTrigger._isFlipped ? 1 : 0));
                markerEndSetter(n);
            }
            caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
        };
        self.enable = function(reset, refresh) {
            if (!self.enabled) {
                self.enabled = true;
                _addListener(scroller, "resize", _onResize);
                isViewport || _addListener(scroller, "scroll", _onScroll);
                onRefreshInit && _addListener(ScrollTrigger, "refreshInit", onRefreshInit);
                if (reset !== false) {
                    self.progress = prevProgress = 0;
                    scroll1 = scroll2 = lastSnap = scrollFunc();
                }
                refresh !== false && self.refresh();
            }
        };
        self.getTween = function(snap) {
            return snap && tweenTo ? tweenTo.tween : scrubTween;
        };
        self.setPositions = function(newStart, newEnd, keepClamp, pinOffset) {
            // doesn't persist after refresh()! Intended to be a way to override values that were set during refresh(), like you could set it in onRefresh()
            if (containerAnimation) {
                // convert ratios into scroll positions. Remember, start/end values on ScrollTriggers that have a containerAnimation refer to the time (in seconds), NOT scroll positions.
                var st = containerAnimation.scrollTrigger, duration = containerAnimation.duration(), _change = st.end - st.start;
                newStart = st.start + _change * newStart / duration;
                newEnd = st.start + _change * newEnd / duration;
            }
            self.refresh(false, false, {
                start: _keepClamp(newStart, keepClamp && !!self._startClamp),
                end: _keepClamp(newEnd, keepClamp && !!self._endClamp)
            }, pinOffset);
            self.update();
        };
        self.adjustPinSpacing = function(amount) {
            if (spacerState && amount) {
                var i = spacerState.indexOf(direction.d) + 1;
                spacerState[i] = parseFloat(spacerState[i]) + amount + _px;
                spacerState[1] = parseFloat(spacerState[1]) + amount + _px;
                _setState(spacerState);
            }
        };
        self.disable = function(reset, allowAnimation) {
            if (self.enabled) {
                reset !== false && self.revert(true, true);
                self.enabled = self.isActive = false;
                allowAnimation || scrubTween && scrubTween.pause();
                prevScroll = 0;
                pinCache && (pinCache.uncache = 1);
                onRefreshInit && _removeListener(ScrollTrigger, "refreshInit", onRefreshInit);
                if (snapDelayedCall) {
                    snapDelayedCall.pause();
                    tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
                }
                if (!isViewport) {
                    var i = _triggers.length;
                    while(i--){
                        if (_triggers[i].scroller === scroller && _triggers[i] !== self) return; //don't remove the listeners if there are still other triggers referencing it.
                    }
                    _removeListener(scroller, "resize", _onResize);
                    isViewport || _removeListener(scroller, "scroll", _onScroll);
                }
            }
        };
        self.kill = function(revert, allowAnimation) {
            self.disable(revert, allowAnimation);
            scrubTween && !allowAnimation && scrubTween.kill();
            id && delete _ids[id];
            var i = _triggers.indexOf(self);
            i >= 0 && _triggers.splice(i, 1);
            i === _i && _direction > 0 && _i--; // if we're in the middle of a refresh() or update(), splicing would cause skips in the index, so adjust...
            // if no other ScrollTrigger instances of the same scroller are found, wipe out any recorded scroll position. Otherwise, in a single page application, for example, it could maintain scroll position when it really shouldn't.
            i = 0;
            _triggers.forEach(function(t) {
                return t.scroller === self.scroller && (i = 1);
            });
            i || _refreshingAll || (self.scroll.rec = 0);
            if (animation) {
                animation.scrollTrigger = null;
                revert && animation.revert({
                    kill: false
                });
                allowAnimation || animation.kill();
            }
            markerStart && [
                markerStart,
                markerEnd,
                markerStartTrigger,
                markerEndTrigger
            ].forEach(function(m) {
                return m.parentNode && m.parentNode.removeChild(m);
            });
            _primary === self && (_primary = 0);
            if (pin) {
                pinCache && (pinCache.uncache = 1);
                i = 0;
                _triggers.forEach(function(t) {
                    return t.pin === pin && i++;
                });
                i || (pinCache.spacer = 0); // if there aren't any more ScrollTriggers with the same pin, remove the spacer, otherwise it could be contaminated with old/stale values if the user re-creates a ScrollTrigger for the same element.
            }
            vars.onKill && vars.onKill(self);
        };
        _triggers.push(self);
        self.enable(false, false);
        customRevertReturn && customRevertReturn(self);
        if (animation && animation.add && !change) {
            // if the animation is a timeline, it may not have been populated yet, so it wouldn't render at the proper place on the first refresh(), thus we should schedule one for the next tick. If "change" is defined, we know it must be re-enabling, thus we can refresh() right away.
            var updateFunc = self.update; // some browsers may fire a scroll event BEFORE a tick elapses and/or the DOMContentLoaded fires. So there's a chance update() will be called BEFORE a refresh() has happened on a Timeline-attached ScrollTrigger which means the start/end won't be calculated yet. We don't want to add conditional logic inside the update() method (like check to see if end is defined and if not, force a refresh()) because that's a function that gets hit a LOT (performance). So we swap out the real update() method for this one that'll re-attach it the first time it gets called and of course forces a refresh().
            self.update = function() {
                self.update = updateFunc;
                start || end || self.refresh();
            };
            gsap.delayedCall(0.01, self.update);
            change = 0.01;
            start = end = 0;
        } else self.refresh();
        pin && _queueRefreshAll(); // pinning could affect the positions of other things, so make sure we queue a full refresh()
    };
    ScrollTrigger.register = function register(core) {
        if (!_coreInitted) {
            gsap = core || _getGSAP();
            _windowExists() && window.document && ScrollTrigger.enable();
            _coreInitted = _enabled;
        }
        return _coreInitted;
    };
    ScrollTrigger.defaults = function defaults(config) {
        if (config) for(var p in config)_defaults[p] = config[p];
        return _defaults;
    };
    ScrollTrigger.disable = function disable(reset, kill) {
        _enabled = 0;
        _triggers.forEach(function(trigger) {
            return trigger[kill ? "kill" : "disable"](reset);
        });
        _removeListener(_win, "wheel", _onScroll);
        _removeListener(_doc, "scroll", _onScroll);
        clearInterval(_syncInterval);
        _removeListener(_doc, "touchcancel", _passThrough);
        _removeListener(_body, "touchstart", _passThrough);
        _multiListener(_removeListener, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);
        _multiListener(_removeListener, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);
        _resizeDelay.kill();
        _iterateAutoRefresh(_removeListener);
        for(var i = 0; i < (0, _observerJs._scrollers).length; i += 3){
            _wheelListener(_removeListener, (0, _observerJs._scrollers)[i], (0, _observerJs._scrollers)[i + 1]);
            _wheelListener(_removeListener, (0, _observerJs._scrollers)[i], (0, _observerJs._scrollers)[i + 2]);
        }
    };
    ScrollTrigger.enable = function enable() {
        _win = window;
        _doc = document;
        _docEl = _doc.documentElement;
        _body = _doc.body;
        if (gsap) {
            _toArray = gsap.utils.toArray;
            _clamp = gsap.utils.clamp;
            _context = gsap.core.context || _passThrough;
            _suppressOverwrites = gsap.core.suppressOverwrites || _passThrough;
            _scrollRestoration = _win.history.scrollRestoration || "auto";
            _lastScroll = _win.pageYOffset;
            gsap.core.globals("ScrollTrigger", ScrollTrigger); // must register the global manually because in Internet Explorer, functions (classes) don't have a "name" property.
            if (_body) {
                _enabled = 1;
                _div100vh = document.createElement("div"); // to solve mobile browser address bar show/hide resizing, we shouldn't rely on window.innerHeight. Instead, use a <div> with its height set to 100vh and measure that since that's what the scrolling is based on anyway and it's not affected by address bar showing/hiding.
                _div100vh.style.height = "100vh";
                _div100vh.style.position = "absolute";
                _refresh100vh();
                _rafBugFix();
                (0, _observerJs.Observer).register(gsap); // isTouch is 0 if no touch, 1 if ONLY touch, and 2 if it can accommodate touch but also other types like mouse/pointer.
                ScrollTrigger.isTouch = (0, _observerJs.Observer).isTouch;
                _fixIOSBug = (0, _observerJs.Observer).isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent); // since 2017, iOS has had a bug that causes event.clientX/Y to be inaccurate when a scroll occurs, thus we must alternate ignoring every other touchmove event to work around it. See https://bugs.webkit.org/show_bug.cgi?id=181954 and https://codepen.io/GreenSock/pen/ExbrPNa/087cef197dc35445a0951e8935c41503
                _ignoreMobileResize = (0, _observerJs.Observer).isTouch === 1;
                _addListener(_win, "wheel", _onScroll); // mostly for 3rd party smooth scrolling libraries.
                _root = [
                    _win,
                    _doc,
                    _docEl,
                    _body
                ];
                if (gsap.matchMedia) {
                    ScrollTrigger.matchMedia = function(vars) {
                        var mm = gsap.matchMedia(), p;
                        for(p in vars)mm.add(p, vars[p]);
                        return mm;
                    };
                    gsap.addEventListener("matchMediaInit", function() {
                        return _revertAll();
                    });
                    gsap.addEventListener("matchMediaRevert", function() {
                        return _revertRecorded();
                    });
                    gsap.addEventListener("matchMedia", function() {
                        _refreshAll(0, 1);
                        _dispatch("matchMedia");
                    });
                    gsap.matchMedia("(orientation: portrait)", function() {
                        // when orientation changes, we should take new base measurements for the ignoreMobileResize feature.
                        _setBaseDimensions();
                        return _setBaseDimensions;
                    });
                } else console.warn("Requires GSAP 3.11.0 or later");
                _setBaseDimensions();
                _addListener(_doc, "scroll", _onScroll); // some browsers (like Chrome), the window stops dispatching scroll events on the window if you scroll really fast, but it's consistent on the document!
                var bodyStyle = _body.style, border = bodyStyle.borderTopStyle, AnimationProto = gsap.core.Animation.prototype, bounds, i;
                AnimationProto.revert || Object.defineProperty(AnimationProto, "revert", {
                    value: function value() {
                        return this.time(-0.01, true);
                    }
                }); // only for backwards compatibility (Animation.revert() was added after 3.10.4)
                bodyStyle.borderTopStyle = "solid"; // works around an issue where a margin of a child element could throw off the bounds of the _body, making it seem like there's a margin when there actually isn't. The border ensures that the bounds are accurate.
                bounds = _getBounds(_body);
                (0, _observerJs._vertical).m = Math.round(bounds.top + (0, _observerJs._vertical).sc()) || 0; // accommodate the offset of the <body> caused by margins and/or padding
                (0, _observerJs._horizontal).m = Math.round(bounds.left + (0, _observerJs._horizontal).sc()) || 0;
                border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style"); // TODO: (?) maybe move to leveraging the velocity mechanism in Observer and skip intervals.
                _syncInterval = setInterval(_sync, 250);
                gsap.delayedCall(0.5, function() {
                    return _startup = 0;
                });
                _addListener(_doc, "touchcancel", _passThrough); // some older Android devices intermittently stop dispatching "touchmove" events if we don't listen for "touchcancel" on the document.
                _addListener(_body, "touchstart", _passThrough); //works around Safari bug: https://gsap.com/forums/topic/21450-draggable-in-iframe-on-mobile-is-buggy/
                _multiListener(_addListener, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);
                _multiListener(_addListener, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);
                _transformProp = gsap.utils.checkPrefix("transform");
                _stateProps.push(_transformProp);
                _coreInitted = _getTime();
                _resizeDelay = gsap.delayedCall(0.2, _refreshAll).pause();
                _autoRefresh = [
                    _doc,
                    "visibilitychange",
                    function() {
                        var w = _win.innerWidth, h = _win.innerHeight;
                        if (_doc.hidden) {
                            _prevWidth = w;
                            _prevHeight = h;
                        } else if (_prevWidth !== w || _prevHeight !== h) _onResize();
                    },
                    _doc,
                    "DOMContentLoaded",
                    _refreshAll,
                    _win,
                    "load",
                    _refreshAll,
                    _win,
                    "resize",
                    _onResize
                ];
                _iterateAutoRefresh(_addListener);
                _triggers.forEach(function(trigger) {
                    return trigger.enable(0, 1);
                });
                for(i = 0; i < (0, _observerJs._scrollers).length; i += 3){
                    _wheelListener(_removeListener, (0, _observerJs._scrollers)[i], (0, _observerJs._scrollers)[i + 1]);
                    _wheelListener(_removeListener, (0, _observerJs._scrollers)[i], (0, _observerJs._scrollers)[i + 2]);
                }
            }
        }
    };
    ScrollTrigger.config = function config(vars) {
        "limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
        var ms = vars.syncInterval;
        ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
        "ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger.isTouch === 1 && vars.ignoreMobileResize);
        if ("autoRefreshEvents" in vars) {
            _iterateAutoRefresh(_removeListener) || _iterateAutoRefresh(_addListener, vars.autoRefreshEvents || "none");
            _ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
        }
    };
    ScrollTrigger.scrollerProxy = function scrollerProxy(target, vars) {
        var t = (0, _observerJs._getTarget)(target), i = (0, _observerJs._scrollers).indexOf(t), isViewport = _isViewport(t);
        if (~i) (0, _observerJs._scrollers).splice(i, isViewport ? 6 : 2);
        if (vars) isViewport ? (0, _observerJs._proxies).unshift(_win, vars, _body, vars, _docEl, vars) : (0, _observerJs._proxies).unshift(t, vars);
    };
    ScrollTrigger.clearMatchMedia = function clearMatchMedia(query) {
        _triggers.forEach(function(t) {
            return t._ctx && t._ctx.query === query && t._ctx.kill(true, true);
        });
    };
    ScrollTrigger.isInViewport = function isInViewport(element, ratio, horizontal) {
        var bounds = (_isString(element) ? (0, _observerJs._getTarget)(element) : element).getBoundingClientRect(), offset = bounds[horizontal ? _width : _height] * ratio || 0;
        return horizontal ? bounds.right - offset > 0 && bounds.left + offset < _win.innerWidth : bounds.bottom - offset > 0 && bounds.top + offset < _win.innerHeight;
    };
    ScrollTrigger.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
        _isString(element) && (element = (0, _observerJs._getTarget)(element));
        var bounds = element.getBoundingClientRect(), size = bounds[horizontal ? _width : _height], offset = referencePoint == null ? size / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size / 100 : parseFloat(referencePoint) || 0;
        return horizontal ? (bounds.left + offset) / _win.innerWidth : (bounds.top + offset) / _win.innerHeight;
    };
    ScrollTrigger.killAll = function killAll(allowListeners) {
        _triggers.slice(0).forEach(function(t) {
            return t.vars.id !== "ScrollSmoother" && t.kill();
        });
        if (allowListeners !== true) {
            var listeners = _listeners.killAll || [];
            _listeners = {};
            listeners.forEach(function(f) {
                return f();
            });
        }
    };
    return ScrollTrigger;
}();
ScrollTrigger.version = "3.12.5";
ScrollTrigger.saveStyles = function(targets) {
    return targets ? _toArray(targets).forEach(function(target) {
        // saved styles are recorded in a consecutive alternating Array, like [element, cssText, transform attribute, cache, matchMedia, ...]
        if (target && target.style) {
            var i = _savedStyles.indexOf(target);
            i >= 0 && _savedStyles.splice(i, 5);
            _savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap.core.getCache(target), _context());
        }
    }) : _savedStyles;
};
ScrollTrigger.revert = function(soft, media) {
    return _revertAll(!soft, media);
};
ScrollTrigger.create = function(vars, animation) {
    return new ScrollTrigger(vars, animation);
};
ScrollTrigger.refresh = function(safe) {
    return safe ? _onResize() : (_coreInitted || ScrollTrigger.register()) && _refreshAll(true);
};
ScrollTrigger.update = function(force) {
    return ++(0, _observerJs._scrollers).cache && _updateAll(force === true ? 2 : 0);
};
ScrollTrigger.clearScrollMemory = _clearScrollMemory;
ScrollTrigger.maxScroll = function(element, horizontal) {
    return _maxScroll(element, horizontal ? (0, _observerJs._horizontal) : (0, _observerJs._vertical));
};
ScrollTrigger.getScrollFunc = function(element, horizontal) {
    return (0, _observerJs._getScrollFunc)((0, _observerJs._getTarget)(element), horizontal ? (0, _observerJs._horizontal) : (0, _observerJs._vertical));
};
ScrollTrigger.getById = function(id) {
    return _ids[id];
};
ScrollTrigger.getAll = function() {
    return _triggers.filter(function(t) {
        return t.vars.id !== "ScrollSmoother";
    });
}; // it's common for people to ScrollTrigger.getAll(t => t.kill()) on page routes, for example, and we don't want it to ruin smooth scrolling by killing the main ScrollSmoother one.
ScrollTrigger.isScrolling = function() {
    return !!_lastScrollTime;
};
ScrollTrigger.snapDirectional = _snapDirectional;
ScrollTrigger.addEventListener = function(type, callback) {
    var a = _listeners[type] || (_listeners[type] = []);
    ~a.indexOf(callback) || a.push(callback);
};
ScrollTrigger.removeEventListener = function(type, callback) {
    var a = _listeners[type], i = a && a.indexOf(callback);
    i >= 0 && a.splice(i, 1);
};
ScrollTrigger.batch = function(targets, vars) {
    var result = [], varsCopy = {}, interval = vars.interval || 0.016, batchMax = vars.batchMax || 1e9, proxyCallback = function proxyCallback(type, callback) {
        var elements = [], triggers = [], delay = gsap.delayedCall(interval, function() {
            callback(elements, triggers);
            elements = [];
            triggers = [];
        }).pause();
        return function(self) {
            elements.length || delay.restart(true);
            elements.push(self.trigger);
            triggers.push(self);
            batchMax <= elements.length && delay.progress(1);
        };
    }, p;
    for(p in vars)varsCopy[p] = p.substr(0, 2) === "on" && _isFunction(vars[p]) && p !== "onRefreshInit" ? proxyCallback(p, vars[p]) : vars[p];
    if (_isFunction(batchMax)) {
        batchMax = batchMax();
        _addListener(ScrollTrigger, "refresh", function() {
            return batchMax = vars.batchMax();
        });
    }
    _toArray(targets).forEach(function(target) {
        var config = {};
        for(p in varsCopy)config[p] = varsCopy[p];
        config.trigger = target;
        result.push(ScrollTrigger.create(config));
    });
    return result;
}; // to reduce file size. clamps the scroll and also returns a duration multiplier so that if the scroll gets chopped shorter, the duration gets curtailed as well (otherwise if you're very close to the top of the page, for example, and swipe up really fast, it'll suddenly slow down and take a long time to reach the top).
var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier(scrollFunc, current, end, max) {
    current > max ? scrollFunc(max) : current < 0 && scrollFunc(0);
    return end > max ? (max - current) / (end - current) : end < 0 ? current / (current - end) : 1;
}, _allowNativePanning = function _allowNativePanning(target, direction) {
    if (direction === true) target.style.removeProperty("touch-action");
    else target.style.touchAction = direction === true ? "auto" : direction ? "pan-" + direction + ((0, _observerJs.Observer).isTouch ? " pinch-zoom" : "") : "none"; // note: Firefox doesn't support it pinch-zoom properly, at least in addition to a pan-x or pan-y.
    target === _docEl && _allowNativePanning(_body, direction);
}, _overflow = {
    auto: 1,
    scroll: 1
}, _nestedScroll = function _nestedScroll(_ref5) {
    var event = _ref5.event, target = _ref5.target, axis = _ref5.axis;
    var node = (event.changedTouches ? event.changedTouches[0] : event).target, cache = node._gsap || gsap.core.getCache(node), time = _getTime(), cs;
    if (!cache._isScrollT || time - cache._isScrollT > 2000) {
        // cache for 2 seconds to improve performance.
        while(node && node !== _body && (node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth || !(_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX])))node = node.parentNode;
        cache._isScroll = node && node !== target && !_isViewport(node) && (_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]);
        cache._isScrollT = time;
    }
    if (cache._isScroll || axis === "x") {
        event.stopPropagation();
        event._gsapAllow = true;
    }
}, // capture events on scrollable elements INSIDE the <body> and allow those by calling stopPropagation() when we find a scrollable ancestor
_inputObserver = function _inputObserver(target, type, inputs, nested) {
    return (0, _observerJs.Observer).create({
        target: target,
        capture: true,
        debounce: false,
        lockAxis: true,
        type: type,
        onWheel: nested = nested && _nestedScroll,
        onPress: nested,
        onDrag: nested,
        onScroll: nested,
        onEnable: function onEnable() {
            return inputs && _addListener(_doc, (0, _observerJs.Observer).eventTypes[0], _captureInputs, false, true);
        },
        onDisable: function onDisable() {
            return _removeListener(_doc, (0, _observerJs.Observer).eventTypes[0], _captureInputs, true);
        }
    });
}, _inputExp = /(input|label|select|textarea)/i, _inputIsFocused, _captureInputs = function _captureInputs(e) {
    var isInput = _inputExp.test(e.target.tagName);
    if (isInput || _inputIsFocused) {
        e._gsapAllow = true;
        _inputIsFocused = isInput;
    }
}, _getScrollNormalizer = function _getScrollNormalizer(vars) {
    _isObject(vars) || (vars = {});
    vars.preventDefault = vars.isNormalizer = vars.allowClicks = true;
    vars.type || (vars.type = "wheel,touch");
    vars.debounce = !!vars.debounce;
    vars.id = vars.id || "normalizer";
    var _vars2 = vars, normalizeScrollX = _vars2.normalizeScrollX, momentum = _vars2.momentum, allowNestedScroll = _vars2.allowNestedScroll, onRelease = _vars2.onRelease, self, maxY, target = (0, _observerJs._getTarget)(vars.target) || _docEl, smoother = gsap.core.globals().ScrollSmoother, smootherInstance = smoother && smoother.get(), content = _fixIOSBug && (vars.content && (0, _observerJs._getTarget)(vars.content) || smootherInstance && vars.content !== false && !smootherInstance.smooth() && smootherInstance.content()), scrollFuncY = (0, _observerJs._getScrollFunc)(target, (0, _observerJs._vertical)), scrollFuncX = (0, _observerJs._getScrollFunc)(target, (0, _observerJs._horizontal)), scale = 1, initialScale = ((0, _observerJs.Observer).isTouch && _win.visualViewport ? _win.visualViewport.scale * _win.visualViewport.width : _win.outerWidth) / _win.innerWidth, wheelRefresh = 0, resolveMomentumDuration = _isFunction(momentum) ? function() {
        return momentum(self);
    } : function() {
        return momentum || 2.8;
    }, lastRefreshID, skipTouchMove, inputObserver = _inputObserver(target, vars.type, true, allowNestedScroll), resumeTouchMove = function resumeTouchMove() {
        return skipTouchMove = false;
    }, scrollClampX = _passThrough, scrollClampY = _passThrough, updateClamps = function updateClamps() {
        maxY = _maxScroll(target, (0, _observerJs._vertical));
        scrollClampY = _clamp(_fixIOSBug ? 1 : 0, maxY);
        normalizeScrollX && (scrollClampX = _clamp(0, _maxScroll(target, (0, _observerJs._horizontal))));
        lastRefreshID = _refreshID;
    }, removeContentOffset = function removeContentOffset() {
        content._gsap.y = _round(parseFloat(content._gsap.y) + scrollFuncY.offset) + "px";
        content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(content._gsap.y) + ", 0, 1)";
        scrollFuncY.offset = scrollFuncY.cacheID = 0;
    }, ignoreDrag = function ignoreDrag() {
        if (skipTouchMove) {
            requestAnimationFrame(resumeTouchMove);
            var offset = _round(self.deltaY / 2), scroll = scrollClampY(scrollFuncY.v - offset);
            if (content && scroll !== scrollFuncY.v + scrollFuncY.offset) {
                scrollFuncY.offset = scroll - scrollFuncY.v;
                var y = _round((parseFloat(content && content._gsap.y) || 0) - scrollFuncY.offset);
                content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)";
                content._gsap.y = y + "px";
                scrollFuncY.cacheID = (0, _observerJs._scrollers).cache;
                _updateAll();
            }
            return true;
        }
        scrollFuncY.offset && removeContentOffset();
        skipTouchMove = true;
    }, tween, startScrollX, startScrollY, onStopDelayedCall, onResize = function onResize() {
        // if the window resizes, like on an iPhone which Apple FORCES the address bar to show/hide even if we event.preventDefault(), it may be scrolling too far now that the address bar is showing, so we must dynamically adjust the momentum tween.
        updateClamps();
        if (tween.isActive() && tween.vars.scrollY > maxY) scrollFuncY() > maxY ? tween.progress(1) && scrollFuncY(maxY) : tween.resetTo("scrollY", maxY);
    };
    content && gsap.set(content, {
        y: "+=0"
    }); // to ensure there's a cache (element._gsap)
    vars.ignoreCheck = function(e) {
        return _fixIOSBug && e.type === "touchmove" && ignoreDrag(e) || scale > 1.05 && e.type !== "touchstart" || self.isGesturing || e.touches && e.touches.length > 1;
    };
    vars.onPress = function() {
        skipTouchMove = false;
        var prevScale = scale;
        scale = _round((_win.visualViewport && _win.visualViewport.scale || 1) / initialScale);
        tween.pause();
        prevScale !== scale && _allowNativePanning(target, scale > 1.01 ? true : normalizeScrollX ? false : "x");
        startScrollX = scrollFuncX();
        startScrollY = scrollFuncY();
        updateClamps();
        lastRefreshID = _refreshID;
    };
    vars.onRelease = vars.onGestureStart = function(self, wasDragging) {
        scrollFuncY.offset && removeContentOffset();
        if (!wasDragging) onStopDelayedCall.restart(true);
        else {
            (0, _observerJs._scrollers).cache++; // make sure we're pulling the non-cached value
            // alternate algorithm: durX = Math.min(6, Math.abs(self.velocityX / 800)),	dur = Math.max(durX, Math.min(6, Math.abs(self.velocityY / 800))); dur = dur * (0.4 + (1 - _power4In(dur / 6)) * 0.6)) * (momentumSpeed || 1)
            var dur = resolveMomentumDuration(), currentScroll, endScroll;
            if (normalizeScrollX) {
                currentScroll = scrollFuncX();
                endScroll = currentScroll + dur * 0.05 * -self.velocityX / 0.227; // the constant .227 is from power4(0.05). velocity is inverted because scrolling goes in the opposite direction.
                dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll(target, (0, _observerJs._horizontal)));
                tween.vars.scrollX = scrollClampX(endScroll);
            }
            currentScroll = scrollFuncY();
            endScroll = currentScroll + dur * 0.05 * -self.velocityY / 0.227; // the constant .227 is from power4(0.05)
            dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll(target, (0, _observerJs._vertical)));
            tween.vars.scrollY = scrollClampY(endScroll);
            tween.invalidate().duration(dur).play(0.01);
            if (_fixIOSBug && tween.vars.scrollY >= maxY || currentScroll >= maxY - 1) // iOS bug: it'll show the address bar but NOT fire the window "resize" event until the animation is done but we must protect against overshoot so we leverage an onUpdate to do so.
            gsap.to({}, {
                onUpdate: onResize,
                duration: dur
            });
        }
        onRelease && onRelease(self);
    };
    vars.onWheel = function() {
        tween._ts && tween.pause();
        if (_getTime() - wheelRefresh > 1000) {
            // after 1 second, refresh the clamps otherwise that'll only happen when ScrollTrigger.refresh() is called or for touch-scrolling.
            lastRefreshID = 0;
            wheelRefresh = _getTime();
        }
    };
    vars.onChange = function(self, dx, dy, xArray, yArray) {
        _refreshID !== lastRefreshID && updateClamps();
        dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self.startX - self.x) : scrollFuncX() + dx - xArray[1])); // for more precision, we track pointer/touch movement from the start, otherwise it'll drift.
        if (dy) {
            scrollFuncY.offset && removeContentOffset();
            var isTouch = yArray[2] === dy, y = isTouch ? startScrollY + self.startY - self.y : scrollFuncY() + dy - yArray[1], yClamped = scrollClampY(y);
            isTouch && y !== yClamped && (startScrollY += yClamped - y);
            scrollFuncY(yClamped);
        }
        (dy || dx) && _updateAll();
    };
    vars.onEnable = function() {
        _allowNativePanning(target, normalizeScrollX ? false : "x");
        ScrollTrigger.addEventListener("refresh", onResize);
        _addListener(_win, "resize", onResize);
        if (scrollFuncY.smooth) {
            scrollFuncY.target.style.scrollBehavior = "auto";
            scrollFuncY.smooth = scrollFuncX.smooth = false;
        }
        inputObserver.enable();
    };
    vars.onDisable = function() {
        _allowNativePanning(target, true);
        _removeListener(_win, "resize", onResize);
        ScrollTrigger.removeEventListener("refresh", onResize);
        inputObserver.kill();
    };
    vars.lockAxis = vars.lockAxis !== false;
    self = new (0, _observerJs.Observer)(vars);
    self.iOS = _fixIOSBug; // used in the Observer getCachedScroll() function to work around an iOS bug that wreaks havoc with TouchEvent.clientY if we allow scroll to go all the way back to 0.
    _fixIOSBug && !scrollFuncY() && scrollFuncY(1); // iOS bug causes event.clientY values to freak out (wildly inaccurate) if the scroll position is exactly 0.
    _fixIOSBug && gsap.ticker.add(_passThrough); // prevent the ticker from sleeping
    onStopDelayedCall = self._dc;
    tween = gsap.to(self, {
        ease: "power4",
        paused: true,
        inherit: false,
        scrollX: normalizeScrollX ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        modifiers: {
            scrollY: _interruptionTracker(scrollFuncY, scrollFuncY(), function() {
                return tween.pause();
            })
        },
        onUpdate: _updateAll,
        onComplete: onStopDelayedCall.vars.onComplete
    }); // we need the modifier to sense if the scroll position is altered outside of the momentum tween (like with a scrollTo tween) so we can pause() it to prevent conflicts.
    return self;
};
ScrollTrigger.sort = function(func) {
    return _triggers.sort(func || function(a, b) {
        return (a.vars.refreshPriority || 0) * -1000000 + a.start - (b.start + (b.vars.refreshPriority || 0) * -1000000);
    });
};
ScrollTrigger.observe = function(vars) {
    return new (0, _observerJs.Observer)(vars);
};
ScrollTrigger.normalizeScroll = function(vars) {
    if (typeof vars === "undefined") return _normalizer;
    if (vars === true && _normalizer) return _normalizer.enable();
    if (vars === false) {
        _normalizer && _normalizer.kill();
        _normalizer = vars;
        return;
    }
    var normalizer = vars instanceof (0, _observerJs.Observer) ? vars : _getScrollNormalizer(vars);
    _normalizer && _normalizer.target === normalizer.target && _normalizer.kill();
    _isViewport(normalizer.target) && (_normalizer = normalizer);
    return normalizer;
};
ScrollTrigger.core = {
    // smaller file size way to leverage in ScrollSmoother and Observer
    _getVelocityProp: (0, _observerJs._getVelocityProp),
    _inputObserver: _inputObserver,
    _scrollers: (0, _observerJs._scrollers),
    _proxies: (0, _observerJs._proxies),
    bridge: {
        // when normalizeScroll sets the scroll position (ss = setScroll)
        ss: function ss() {
            _lastScrollTime || _dispatch("scrollStart");
            _lastScrollTime = _getTime();
        },
        // a way to get the _refreshing value in Observer
        ref: function ref() {
            return _refreshing;
        }
    }
};
_getGSAP() && gsap.registerPlugin(ScrollTrigger);

},{"./Observer.js":"aAWxM","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aAWxM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Observer", ()=>Observer);
parcelHelpers.export(exports, "default", ()=>Observer);
parcelHelpers.export(exports, "_isViewport", ()=>_isViewport);
parcelHelpers.export(exports, "_scrollers", ()=>_scrollers);
parcelHelpers.export(exports, "_getScrollFunc", ()=>_getScrollFunc);
parcelHelpers.export(exports, "_getProxyProp", ()=>_getProxyProp);
parcelHelpers.export(exports, "_proxies", ()=>_proxies);
parcelHelpers.export(exports, "_getVelocityProp", ()=>_getVelocityProp);
parcelHelpers.export(exports, "_vertical", ()=>_vertical);
parcelHelpers.export(exports, "_horizontal", ()=>_horizontal);
parcelHelpers.export(exports, "_getTarget", ()=>_getTarget);
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
/*!
 * Observer 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/ /* eslint-disable */ var gsap, _coreInitted, _clamp, _win, _doc, _docEl, _body, _isTouch, _pointerType, ScrollTrigger, _root, _normalizer, _eventTypes, _context, _getGSAP = function _getGSAP() {
    return gsap || typeof window !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap;
}, _startup = 1, _observers = [], _scrollers = [], _proxies = [], _getTime = Date.now, _bridge = function _bridge(name, value) {
    return value;
}, _integrate = function _integrate() {
    var core = ScrollTrigger.core, data = core.bridge || {}, scrollers = core._scrollers, proxies = core._proxies;
    scrollers.push.apply(scrollers, _scrollers);
    proxies.push.apply(proxies, _proxies);
    _scrollers = scrollers;
    _proxies = proxies;
    _bridge = function _bridge(name, value) {
        return data[name](value);
    };
}, _getProxyProp = function _getProxyProp(element, property) {
    return ~_proxies.indexOf(element) && _proxies[_proxies.indexOf(element) + 1][property];
}, _isViewport = function _isViewport(el) {
    return !!~_root.indexOf(el);
}, _addListener = function _addListener(element, type, func, passive, capture) {
    return element.addEventListener(type, func, {
        passive: passive !== false,
        capture: !!capture
    });
}, _removeListener = function _removeListener(element, type, func, capture) {
    return element.removeEventListener(type, func, !!capture);
}, _scrollLeft = "scrollLeft", _scrollTop = "scrollTop", _onScroll = function _onScroll() {
    return _normalizer && _normalizer.isPressed || _scrollers.cache++;
}, _scrollCacheFunc = function _scrollCacheFunc(f, doNotCache) {
    var cachingFunc = function cachingFunc(value) {
        // since reading the scrollTop/scrollLeft/pageOffsetY/pageOffsetX can trigger a layout, this function allows us to cache the value so it only gets read fresh after a "scroll" event fires (or while we're refreshing because that can lengthen the page and alter the scroll position). when "soft" is true, that means don't actually set the scroll, but cache the new value instead (useful in ScrollSmoother)
        if (value || value === 0) {
            _startup && (_win.history.scrollRestoration = "manual"); // otherwise the new position will get overwritten by the browser onload.
            var isNormalizing = _normalizer && _normalizer.isPressed;
            value = cachingFunc.v = Math.round(value) || (_normalizer && _normalizer.iOS ? 1 : 0); //TODO: iOS Bug: if you allow it to go to 0, Safari can start to report super strange (wildly inaccurate) touch positions!
            f(value);
            cachingFunc.cacheID = _scrollers.cache;
            isNormalizing && _bridge("ss", value); // set scroll (notify ScrollTrigger so it can dispatch a "scrollStart" event if necessary
        } else if (doNotCache || _scrollers.cache !== cachingFunc.cacheID || _bridge("ref")) {
            cachingFunc.cacheID = _scrollers.cache;
            cachingFunc.v = f();
        }
        return cachingFunc.v + cachingFunc.offset;
    };
    cachingFunc.offset = 0;
    return f && cachingFunc;
}, _horizontal = {
    s: _scrollLeft,
    p: "left",
    p2: "Left",
    os: "right",
    os2: "Right",
    d: "width",
    d2: "Width",
    a: "x",
    sc: _scrollCacheFunc(function(value) {
        return arguments.length ? _win.scrollTo(value, _vertical.sc()) : _win.pageXOffset || _doc[_scrollLeft] || _docEl[_scrollLeft] || _body[_scrollLeft] || 0;
    })
}, _vertical = {
    s: _scrollTop,
    p: "top",
    p2: "Top",
    os: "bottom",
    os2: "Bottom",
    d: "height",
    d2: "Height",
    a: "y",
    op: _horizontal,
    sc: _scrollCacheFunc(function(value) {
        return arguments.length ? _win.scrollTo(_horizontal.sc(), value) : _win.pageYOffset || _doc[_scrollTop] || _docEl[_scrollTop] || _body[_scrollTop] || 0;
    })
}, _getTarget = function _getTarget(t, self) {
    return (self && self._ctx && self._ctx.selector || gsap.utils.toArray)(t)[0] || (typeof t === "string" && gsap.config().nullTargetWarn !== false ? console.warn("Element not found:", t) : null);
}, _getScrollFunc = function _getScrollFunc(element, _ref) {
    var s = _ref.s, sc = _ref.sc;
    // we store the scroller functions in an alternating sequenced Array like [element, verticalScrollFunc, horizontalScrollFunc, ...] so that we can minimize memory, maximize performance, and we also record the last position as a ".rec" property in order to revert to that after refreshing to ensure things don't shift around.
    _isViewport(element) && (element = _doc.scrollingElement || _docEl);
    var i = _scrollers.indexOf(element), offset = sc === _vertical.sc ? 1 : 2;
    !~i && (i = _scrollers.push(element) - 1);
    _scrollers[i + offset] || _addListener(element, "scroll", _onScroll); // clear the cache when a scroll occurs
    var prev = _scrollers[i + offset], func = prev || (_scrollers[i + offset] = _scrollCacheFunc(_getProxyProp(element, s), true) || (_isViewport(element) ? sc : _scrollCacheFunc(function(value) {
        return arguments.length ? element[s] = value : element[s];
    })));
    func.target = element;
    prev || (func.smooth = gsap.getProperty(element, "scrollBehavior") === "smooth"); // only set it the first time (don't reset every time a scrollFunc is requested because perhaps it happens during a refresh() when it's disabled in ScrollTrigger.
    return func;
}, _getVelocityProp = function _getVelocityProp(value, minTimeRefresh, useDelta) {
    var v1 = value, v2 = value, t1 = _getTime(), t2 = t1, min = minTimeRefresh || 50, dropToZeroTime = Math.max(500, min * 3), update = function update(value, force) {
        var t = _getTime();
        if (force || t - t1 > min) {
            v2 = v1;
            v1 = value;
            t2 = t1;
            t1 = t;
        } else if (useDelta) v1 += value;
        else // not totally necessary, but makes it a bit more accurate by adjusting the v1 value according to the new slope. This way we're not just ignoring the incoming data. Removing for now because it doesn't seem to make much practical difference and it's probably not worth the kb.
        v1 = v2 + (value - v2) / (t - t2) * (t1 - t2);
    }, reset = function reset() {
        v2 = v1 = useDelta ? 0 : v1;
        t2 = t1 = 0;
    }, getVelocity = function getVelocity(latestValue) {
        var tOld = t2, vOld = v2, t = _getTime();
        (latestValue || latestValue === 0) && latestValue !== v1 && update(latestValue);
        return t1 === t2 || t - t2 > dropToZeroTime ? 0 : (v1 + (useDelta ? vOld : -vOld)) / ((useDelta ? t : t1) - tOld) * 1000;
    };
    return {
        update: update,
        reset: reset,
        getVelocity: getVelocity
    };
}, _getEvent = function _getEvent(e, preventDefault) {
    preventDefault && !e._gsapAllow && e.preventDefault();
    return e.changedTouches ? e.changedTouches[0] : e;
}, _getAbsoluteMax = function _getAbsoluteMax(a) {
    var max = Math.max.apply(Math, a), min = Math.min.apply(Math, a);
    return Math.abs(max) >= Math.abs(min) ? max : min;
}, _setScrollTrigger = function _setScrollTrigger() {
    ScrollTrigger = gsap.core.globals().ScrollTrigger;
    ScrollTrigger && ScrollTrigger.core && _integrate();
}, _initCore = function _initCore(core) {
    gsap = core || _getGSAP();
    if (!_coreInitted && gsap && typeof document !== "undefined" && document.body) {
        _win = window;
        _doc = document;
        _docEl = _doc.documentElement;
        _body = _doc.body;
        _root = [
            _win,
            _doc,
            _docEl,
            _body
        ];
        _clamp = gsap.utils.clamp;
        _context = gsap.core.context || function() {};
        _pointerType = "onpointerenter" in _body ? "pointer" : "mouse"; // isTouch is 0 if no touch, 1 if ONLY touch, and 2 if it can accommodate touch but also other types like mouse/pointer.
        _isTouch = Observer.isTouch = _win.matchMedia && _win.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
        _eventTypes = Observer.eventTypes = ("ontouchstart" in _docEl ? "touchstart,touchmove,touchcancel,touchend" : !("onpointerdown" in _docEl) ? "mousedown,mousemove,mouseup,mouseup" : "pointerdown,pointermove,pointercancel,pointerup").split(",");
        setTimeout(function() {
            return _startup = 0;
        }, 500);
        _setScrollTrigger();
        _coreInitted = 1;
    }
    return _coreInitted;
};
_horizontal.op = _vertical;
_scrollers.cache = 0;
var Observer = /*#__PURE__*/ function() {
    function Observer(vars) {
        this.init(vars);
    }
    var _proto = Observer.prototype;
    _proto.init = function init(vars) {
        _coreInitted || _initCore(gsap) || console.warn("Please gsap.registerPlugin(Observer)");
        ScrollTrigger || _setScrollTrigger();
        var tolerance = vars.tolerance, dragMinimum = vars.dragMinimum, type = vars.type, target = vars.target, lineHeight = vars.lineHeight, debounce = vars.debounce, preventDefault = vars.preventDefault, onStop = vars.onStop, onStopDelay = vars.onStopDelay, ignore = vars.ignore, wheelSpeed = vars.wheelSpeed, event = vars.event, onDragStart = vars.onDragStart, onDragEnd = vars.onDragEnd, onDrag = vars.onDrag, onPress = vars.onPress, onRelease = vars.onRelease, onRight = vars.onRight, onLeft = vars.onLeft, onUp = vars.onUp, onDown = vars.onDown, onChangeX = vars.onChangeX, onChangeY = vars.onChangeY, onChange = vars.onChange, onToggleX = vars.onToggleX, onToggleY = vars.onToggleY, onHover = vars.onHover, onHoverEnd = vars.onHoverEnd, onMove = vars.onMove, ignoreCheck = vars.ignoreCheck, isNormalizer = vars.isNormalizer, onGestureStart = vars.onGestureStart, onGestureEnd = vars.onGestureEnd, onWheel = vars.onWheel, onEnable = vars.onEnable, onDisable = vars.onDisable, onClick = vars.onClick, scrollSpeed = vars.scrollSpeed, capture = vars.capture, allowClicks = vars.allowClicks, lockAxis = vars.lockAxis, onLockAxis = vars.onLockAxis;
        this.target = target = _getTarget(target) || _docEl;
        this.vars = vars;
        ignore && (ignore = gsap.utils.toArray(ignore));
        tolerance = tolerance || 1e-9;
        dragMinimum = dragMinimum || 0;
        wheelSpeed = wheelSpeed || 1;
        scrollSpeed = scrollSpeed || 1;
        type = type || "wheel,touch,pointer";
        debounce = debounce !== false;
        lineHeight || (lineHeight = parseFloat(_win.getComputedStyle(_body).lineHeight) || 22); // note: browser may report "normal", so default to 22.
        var id, onStopDelayedCall, dragged, moved, wheeled, locked, axis, self = this, prevDeltaX = 0, prevDeltaY = 0, passive = vars.passive || !preventDefault, scrollFuncX = _getScrollFunc(target, _horizontal), scrollFuncY = _getScrollFunc(target, _vertical), scrollX = scrollFuncX(), scrollY = scrollFuncY(), limitToTouch = ~type.indexOf("touch") && !~type.indexOf("pointer") && _eventTypes[0] === "pointerdown", // for devices that accommodate mouse events and touch events, we need to distinguish.
        isViewport = _isViewport(target), ownerDoc = target.ownerDocument || _doc, deltaX = [
            0,
            0,
            0
        ], // wheel, scroll, pointer/touch
        deltaY = [
            0,
            0,
            0
        ], onClickTime = 0, clickCapture = function clickCapture() {
            return onClickTime = _getTime();
        }, _ignoreCheck = function _ignoreCheck(e, isPointerOrTouch) {
            return (self.event = e) && ignore && ~ignore.indexOf(e.target) || isPointerOrTouch && limitToTouch && e.pointerType !== "touch" || ignoreCheck && ignoreCheck(e, isPointerOrTouch);
        }, onStopFunc = function onStopFunc() {
            self._vx.reset();
            self._vy.reset();
            onStopDelayedCall.pause();
            onStop && onStop(self);
        }, update = function update() {
            var dx = self.deltaX = _getAbsoluteMax(deltaX), dy = self.deltaY = _getAbsoluteMax(deltaY), changedX = Math.abs(dx) >= tolerance, changedY = Math.abs(dy) >= tolerance;
            onChange && (changedX || changedY) && onChange(self, dx, dy, deltaX, deltaY); // in ScrollTrigger.normalizeScroll(), we need to know if it was touch/pointer so we need access to the deltaX/deltaY Arrays before we clear them out.
            if (changedX) {
                onRight && self.deltaX > 0 && onRight(self);
                onLeft && self.deltaX < 0 && onLeft(self);
                onChangeX && onChangeX(self);
                onToggleX && self.deltaX < 0 !== prevDeltaX < 0 && onToggleX(self);
                prevDeltaX = self.deltaX;
                deltaX[0] = deltaX[1] = deltaX[2] = 0;
            }
            if (changedY) {
                onDown && self.deltaY > 0 && onDown(self);
                onUp && self.deltaY < 0 && onUp(self);
                onChangeY && onChangeY(self);
                onToggleY && self.deltaY < 0 !== prevDeltaY < 0 && onToggleY(self);
                prevDeltaY = self.deltaY;
                deltaY[0] = deltaY[1] = deltaY[2] = 0;
            }
            if (moved || dragged) {
                onMove && onMove(self);
                if (dragged) {
                    onDrag(self);
                    dragged = false;
                }
                moved = false;
            }
            locked && (locked = false, true) && onLockAxis && onLockAxis(self);
            if (wheeled) {
                onWheel(self);
                wheeled = false;
            }
            id = 0;
        }, onDelta = function onDelta(x, y, index) {
            deltaX[index] += x;
            deltaY[index] += y;
            self._vx.update(x);
            self._vy.update(y);
            debounce ? id || (id = requestAnimationFrame(update)) : update();
        }, onTouchOrPointerDelta = function onTouchOrPointerDelta(x, y) {
            if (lockAxis && !axis) {
                self.axis = axis = Math.abs(x) > Math.abs(y) ? "x" : "y";
                locked = true;
            }
            if (axis !== "y") {
                deltaX[2] += x;
                self._vx.update(x, true); // update the velocity as frequently as possible instead of in the debounced function so that very quick touch-scrolls (flicks) feel natural. If it's the mouse/touch/pointer, force it so that we get snappy/accurate momentum scroll.
            }
            if (axis !== "x") {
                deltaY[2] += y;
                self._vy.update(y, true);
            }
            debounce ? id || (id = requestAnimationFrame(update)) : update();
        }, _onDrag = function _onDrag(e) {
            if (_ignoreCheck(e, 1)) return;
            e = _getEvent(e, preventDefault);
            var x = e.clientX, y = e.clientY, dx = x - self.x, dy = y - self.y, isDragging = self.isDragging;
            self.x = x;
            self.y = y;
            if (isDragging || Math.abs(self.startX - x) >= dragMinimum || Math.abs(self.startY - y) >= dragMinimum) {
                onDrag && (dragged = true);
                isDragging || (self.isDragging = true);
                onTouchOrPointerDelta(dx, dy);
                isDragging || onDragStart && onDragStart(self);
            }
        }, _onPress = self.onPress = function(e) {
            if (_ignoreCheck(e, 1) || e && e.button) return;
            self.axis = axis = null;
            onStopDelayedCall.pause();
            self.isPressed = true;
            e = _getEvent(e); // note: may need to preventDefault(?) Won't side-scroll on iOS Safari if we do, though.
            prevDeltaX = prevDeltaY = 0;
            self.startX = self.x = e.clientX;
            self.startY = self.y = e.clientY;
            self._vx.reset(); // otherwise the t2 may be stale if the user touches and flicks super fast and releases in less than 2 requestAnimationFrame ticks, causing velocity to be 0.
            self._vy.reset();
            _addListener(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, passive, true);
            self.deltaX = self.deltaY = 0;
            onPress && onPress(self);
        }, _onRelease = self.onRelease = function(e) {
            if (_ignoreCheck(e, 1)) return;
            _removeListener(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
            var isTrackingDrag = !isNaN(self.y - self.startY), wasDragging = self.isDragging, isDragNotClick = wasDragging && (Math.abs(self.x - self.startX) > 3 || Math.abs(self.y - self.startY) > 3), // some touch devices need some wiggle room in terms of sensing clicks - the finger may move a few pixels.
            eventData = _getEvent(e);
            if (!isDragNotClick && isTrackingDrag) {
                self._vx.reset();
                self._vy.reset(); //if (preventDefault && allowClicks && self.isPressed) { // check isPressed because in a rare edge case, the inputObserver in ScrollTrigger may stopPropagation() on the press/drag, so the onRelease may get fired without the onPress/onDrag ever getting called, thus it could trigger a click to occur on a link after scroll-dragging it.
                if (preventDefault && allowClicks) gsap.delayedCall(0.08, function() {
                    // some browsers (like Firefox) won't trust script-generated clicks, so if the user tries to click on a video to play it, for example, it simply won't work. Since a regular "click" event will most likely be generated anyway (one that has its isTrusted flag set to true), we must slightly delay our script-generated click so that the "real"/trusted one is prioritized. Remember, when there are duplicate events in quick succession, we suppress all but the first one. Some browsers don't even trigger the "real" one at all, so our synthetic one is a safety valve that ensures that no matter what, a click event does get dispatched.
                    if (_getTime() - onClickTime > 300 && !e.defaultPrevented) {
                        if (e.target.click) //some browsers (like mobile Safari) don't properly trigger the click event
                        e.target.click();
                        else if (ownerDoc.createEvent) {
                            var syntheticEvent = ownerDoc.createEvent("MouseEvents");
                            syntheticEvent.initMouseEvent("click", true, true, _win, 1, eventData.screenX, eventData.screenY, eventData.clientX, eventData.clientY, false, false, false, false, 0, null);
                            e.target.dispatchEvent(syntheticEvent);
                        }
                    }
                });
            }
            self.isDragging = self.isGesturing = self.isPressed = false;
            onStop && wasDragging && !isNormalizer && onStopDelayedCall.restart(true);
            onDragEnd && wasDragging && onDragEnd(self);
            onRelease && onRelease(self, isDragNotClick);
        }, _onGestureStart = function _onGestureStart(e) {
            return e.touches && e.touches.length > 1 && (self.isGesturing = true) && onGestureStart(e, self.isDragging);
        }, _onGestureEnd = function _onGestureEnd() {
            return self.isGesturing = false, onGestureEnd(self);
        }, onScroll = function onScroll(e) {
            if (_ignoreCheck(e)) return;
            var x = scrollFuncX(), y = scrollFuncY();
            onDelta((x - scrollX) * scrollSpeed, (y - scrollY) * scrollSpeed, 1);
            scrollX = x;
            scrollY = y;
            onStop && onStopDelayedCall.restart(true);
        }, _onWheel = function _onWheel(e) {
            if (_ignoreCheck(e)) return;
            e = _getEvent(e, preventDefault);
            onWheel && (wheeled = true);
            var multiplier = (e.deltaMode === 1 ? lineHeight : e.deltaMode === 2 ? _win.innerHeight : 1) * wheelSpeed;
            onDelta(e.deltaX * multiplier, e.deltaY * multiplier, 0);
            onStop && !isNormalizer && onStopDelayedCall.restart(true);
        }, _onMove = function _onMove(e) {
            if (_ignoreCheck(e)) return;
            var x = e.clientX, y = e.clientY, dx = x - self.x, dy = y - self.y;
            self.x = x;
            self.y = y;
            moved = true;
            onStop && onStopDelayedCall.restart(true);
            (dx || dy) && onTouchOrPointerDelta(dx, dy);
        }, _onHover = function _onHover(e) {
            self.event = e;
            onHover(self);
        }, _onHoverEnd = function _onHoverEnd(e) {
            self.event = e;
            onHoverEnd(self);
        }, _onClick = function _onClick(e) {
            return _ignoreCheck(e) || _getEvent(e, preventDefault) && onClick(self);
        };
        onStopDelayedCall = self._dc = gsap.delayedCall(onStopDelay || 0.25, onStopFunc).pause();
        self.deltaX = self.deltaY = 0;
        self._vx = _getVelocityProp(0, 50, true);
        self._vy = _getVelocityProp(0, 50, true);
        self.scrollX = scrollFuncX;
        self.scrollY = scrollFuncY;
        self.isDragging = self.isGesturing = self.isPressed = false;
        _context(this);
        self.enable = function(e) {
            if (!self.isEnabled) {
                _addListener(isViewport ? ownerDoc : target, "scroll", _onScroll);
                type.indexOf("scroll") >= 0 && _addListener(isViewport ? ownerDoc : target, "scroll", onScroll, passive, capture);
                type.indexOf("wheel") >= 0 && _addListener(target, "wheel", _onWheel, passive, capture);
                if (type.indexOf("touch") >= 0 && _isTouch || type.indexOf("pointer") >= 0) {
                    _addListener(target, _eventTypes[0], _onPress, passive, capture);
                    _addListener(ownerDoc, _eventTypes[2], _onRelease);
                    _addListener(ownerDoc, _eventTypes[3], _onRelease);
                    allowClicks && _addListener(target, "click", clickCapture, true, true);
                    onClick && _addListener(target, "click", _onClick);
                    onGestureStart && _addListener(ownerDoc, "gesturestart", _onGestureStart);
                    onGestureEnd && _addListener(ownerDoc, "gestureend", _onGestureEnd);
                    onHover && _addListener(target, _pointerType + "enter", _onHover);
                    onHoverEnd && _addListener(target, _pointerType + "leave", _onHoverEnd);
                    onMove && _addListener(target, _pointerType + "move", _onMove);
                }
                self.isEnabled = true;
                e && e.type && _onPress(e);
                onEnable && onEnable(self);
            }
            return self;
        };
        self.disable = function() {
            if (self.isEnabled) {
                // only remove the _onScroll listener if there aren't any others that rely on the functionality.
                _observers.filter(function(o) {
                    return o !== self && _isViewport(o.target);
                }).length || _removeListener(isViewport ? ownerDoc : target, "scroll", _onScroll);
                if (self.isPressed) {
                    self._vx.reset();
                    self._vy.reset();
                    _removeListener(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
                }
                _removeListener(isViewport ? ownerDoc : target, "scroll", onScroll, capture);
                _removeListener(target, "wheel", _onWheel, capture);
                _removeListener(target, _eventTypes[0], _onPress, capture);
                _removeListener(ownerDoc, _eventTypes[2], _onRelease);
                _removeListener(ownerDoc, _eventTypes[3], _onRelease);
                _removeListener(target, "click", clickCapture, true);
                _removeListener(target, "click", _onClick);
                _removeListener(ownerDoc, "gesturestart", _onGestureStart);
                _removeListener(ownerDoc, "gestureend", _onGestureEnd);
                _removeListener(target, _pointerType + "enter", _onHover);
                _removeListener(target, _pointerType + "leave", _onHoverEnd);
                _removeListener(target, _pointerType + "move", _onMove);
                self.isEnabled = self.isPressed = self.isDragging = false;
                onDisable && onDisable(self);
            }
        };
        self.kill = self.revert = function() {
            self.disable();
            var i = _observers.indexOf(self);
            i >= 0 && _observers.splice(i, 1);
            _normalizer === self && (_normalizer = 0);
        };
        _observers.push(self);
        isNormalizer && _isViewport(target) && (_normalizer = self);
        self.enable(event);
    };
    _createClass(Observer, [
        {
            key: "velocityX",
            get: function get() {
                return this._vx.getVelocity();
            }
        },
        {
            key: "velocityY",
            get: function get() {
                return this._vy.getVelocity();
            }
        }
    ]);
    return Observer;
}();
Observer.version = "3.12.5";
Observer.create = function(vars) {
    return new Observer(vars);
};
Observer.register = _initCore;
Observer.getAll = function() {
    return _observers.slice();
};
Observer.getById = function(id) {
    return _observers.filter(function(o) {
        return o.vars.id === id;
    })[0];
};
_getGSAP() && gsap.registerPlugin(Observer);

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1y1Qx":[function(require,module,exports) {
/*!
 * ScrollMagic v2.0.8 (2020-08-14)
 * The javascript library for magical scroll interactions.
 * (c) 2020 Jan Paepke (@janpaepke)
 * Project Website: http://scrollmagic.io
 * 
 * @version 2.0.8
 * @license Dual licensed under MIT license and GPL.
 * @author Jan Paepke - e-mail@janpaepke.de
 *
 * @file ScrollMagic main library.
 */ /**
 * @namespace ScrollMagic
 */ (function(root, factory) {
    if (typeof define === "function" && define.amd) // AMD. Register as an anonymous module.
    define(factory);
    else // CommonJS
    module.exports = factory();
})(this, function() {
    "use strict";
    var ScrollMagic = function() {
        _util.log(2, "(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use 'new ScrollMagic.Controller()' to create a new controller instance. Use 'new ScrollMagic.Scene()' to instance a scene.");
    };
    ScrollMagic.version = "2.0.8";
    // TODO: temporary workaround for chrome's scroll jitter bug
    if (typeof window !== "undefined") window.addEventListener("mousewheel", void 0);
    // global const
    var PIN_SPACER_ATTRIBUTE = "data-scrollmagic-pin-spacer";
    /**
	 * The main class that is needed once per scroll container.
	 *
	 * @class
	 *
	 * @example
	 * // basic initialization
	 * var controller = new ScrollMagic.Controller();
	 *
	 * // passing options
	 * var controller = new ScrollMagic.Controller({container: "#myContainer", loglevel: 3});
	 *
	 * @param {object} [options] - An object containing one or more options for the controller.
	 * @param {(string|object)} [options.container=window] - A selector, DOM object that references the main container for scrolling.
	 * @param {boolean} [options.vertical=true] - Sets the scroll mode to vertical (`true`) or horizontal (`false`) scrolling.
	 * @param {object} [options.globalSceneOptions={}] - These options will be passed to every Scene that is added to the controller using the addScene method. For more information on Scene options see {@link ScrollMagic.Scene}.
	 * @param {number} [options.loglevel=2] Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
											 ** `0` => silent
											 ** `1` => errors
											 ** `2` => errors, warnings
											 ** `3` => errors, warnings, debuginfo
	 * @param {boolean} [options.refreshInterval=100] - Some changes don't call events by default, like changing the container size or moving a scene trigger element.  
	 																										 This interval polls these parameters to fire the necessary events.  
	 																										 If you don't use custom containers, trigger elements or have static layouts, where the positions of the trigger elements don't change, you can set this to 0 disable interval checking and improve performance.
	 *
	 */ ScrollMagic.Controller = function(options) {
        /*
		 * ----------------------------------------------------------------
		 * settings
		 * ----------------------------------------------------------------
		 */ var NAMESPACE = "ScrollMagic.Controller", SCROLL_DIRECTION_FORWARD = "FORWARD", SCROLL_DIRECTION_REVERSE = "REVERSE", SCROLL_DIRECTION_PAUSED = "PAUSED", DEFAULT_OPTIONS = CONTROLLER_OPTIONS.defaults;
        /*
		 * ----------------------------------------------------------------
		 * private vars
		 * ----------------------------------------------------------------
		 */ var Controller = this, _options = _util.extend({}, DEFAULT_OPTIONS, options), _sceneObjects = [], _updateScenesOnNextCycle = false, _scrollPos = 0, _scrollDirection = SCROLL_DIRECTION_PAUSED, _isDocument = true, _viewPortSize = 0, _enabled = true, _updateTimeout, _refreshTimeout;
        /*
		 * ----------------------------------------------------------------
		 * private functions
		 * ----------------------------------------------------------------
		 */ /**
		 * Internal constructor function of the ScrollMagic Controller
		 * @private
		 */ var construct = function() {
            for(var key in _options)if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
                log(2, 'WARNING: Unknown option "' + key + '"');
                delete _options[key];
            }
            _options.container = _util.get.elements(_options.container)[0];
            // check ScrollContainer
            if (!_options.container) {
                log(1, "ERROR creating object " + NAMESPACE + ": No valid scroll container supplied");
                throw NAMESPACE + " init failed."; // cancel
            }
            _isDocument = _options.container === window || _options.container === document.body || !document.body.contains(_options.container);
            // normalize to window
            if (_isDocument) _options.container = window;
            // update container size immediately
            _viewPortSize = getViewportSize();
            // set event handlers
            _options.container.addEventListener("resize", onChange);
            _options.container.addEventListener("scroll", onChange);
            var ri = parseInt(_options.refreshInterval, 10);
            _options.refreshInterval = _util.type.Number(ri) ? ri : DEFAULT_OPTIONS.refreshInterval;
            scheduleRefresh();
            log(3, "added new " + NAMESPACE + " controller (v" + ScrollMagic.version + ")");
        };
        /**
		 * Schedule the next execution of the refresh function
		 * @private
		 */ var scheduleRefresh = function() {
            if (_options.refreshInterval > 0) _refreshTimeout = window.setTimeout(refresh, _options.refreshInterval);
        };
        /**
		 * Default function to get scroll pos - overwriteable using `Controller.scrollPos(newFunction)`
		 * @private
		 */ var getScrollPos = function() {
            return _options.vertical ? _util.get.scrollTop(_options.container) : _util.get.scrollLeft(_options.container);
        };
        /**
		 * Returns the current viewport Size (width vor horizontal, height for vertical)
		 * @private
		 */ var getViewportSize = function() {
            return _options.vertical ? _util.get.height(_options.container) : _util.get.width(_options.container);
        };
        /**
		 * Default function to set scroll pos - overwriteable using `Controller.scrollTo(newFunction)`
		 * Make available publicly for pinned mousewheel workaround.
		 * @private
		 */ var setScrollPos = this._setScrollPos = function(pos) {
            if (_options.vertical) {
                if (_isDocument) window.scrollTo(_util.get.scrollLeft(), pos);
                else _options.container.scrollTop = pos;
            } else if (_isDocument) window.scrollTo(pos, _util.get.scrollTop());
            else _options.container.scrollLeft = pos;
        };
        /**
		 * Handle updates in cycles instead of on scroll (performance)
		 * @private
		 */ var updateScenes = function() {
            if (_enabled && _updateScenesOnNextCycle) {
                // determine scenes to update
                var scenesToUpdate = _util.type.Array(_updateScenesOnNextCycle) ? _updateScenesOnNextCycle : _sceneObjects.slice(0);
                // reset scenes
                _updateScenesOnNextCycle = false;
                var oldScrollPos = _scrollPos;
                // update scroll pos now instead of onChange, as it might have changed since scheduling (i.e. in-browser smooth scroll)
                _scrollPos = Controller.scrollPos();
                var deltaScroll = _scrollPos - oldScrollPos;
                if (deltaScroll !== 0) _scrollDirection = deltaScroll > 0 ? SCROLL_DIRECTION_FORWARD : SCROLL_DIRECTION_REVERSE;
                // reverse order of scenes if scrolling reverse
                if (_scrollDirection === SCROLL_DIRECTION_REVERSE) scenesToUpdate.reverse();
                // update scenes
                scenesToUpdate.forEach(function(scene, index) {
                    log(3, "updating Scene " + (index + 1) + "/" + scenesToUpdate.length + " (" + _sceneObjects.length + " total)");
                    scene.update(true);
                });
                if (scenesToUpdate.length === 0 && _options.loglevel >= 3) log(3, "updating 0 Scenes (nothing added to controller)");
            }
        };
        /**
		 * Initializes rAF callback
		 * @private
		 */ var debounceUpdate = function() {
            _updateTimeout = _util.rAF(updateScenes);
        };
        /**
		 * Handles Container changes
		 * @private
		 */ var onChange = function(e) {
            log(3, "event fired causing an update:", e.type);
            if (e.type == "resize") {
                // resize
                _viewPortSize = getViewportSize();
                _scrollDirection = SCROLL_DIRECTION_PAUSED;
            }
            // schedule update
            if (_updateScenesOnNextCycle !== true) {
                _updateScenesOnNextCycle = true;
                debounceUpdate();
            }
        };
        var refresh = function() {
            if (!_isDocument) // simulate resize event. Only works for viewport relevant param (performance)
            {
                if (_viewPortSize != getViewportSize()) {
                    var resizeEvent;
                    try {
                        resizeEvent = new Event("resize", {
                            bubbles: false,
                            cancelable: false
                        });
                    } catch (e) {
                        resizeEvent = document.createEvent("Event");
                        resizeEvent.initEvent("resize", false, false);
                    }
                    _options.container.dispatchEvent(resizeEvent);
                }
            }
            _sceneObjects.forEach(function(scene, index) {
                scene.refresh();
            });
            scheduleRefresh();
        };
        /**
		 * Send a debug message to the console.
		 * provided publicly with _log for plugins
		 * @private
		 *
		 * @param {number} loglevel - The loglevel required to initiate output for the message.
		 * @param {...mixed} output - One or more variables that should be passed to the console.
		 */ var log = this._log = function(loglevel, output) {
            if (_options.loglevel >= loglevel) {
                Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
                _util.log.apply(window, arguments);
            }
        };
        // for scenes we have getters for each option, but for the controller we don't, so we need to make it available externally for plugins
        this._options = _options;
        /**
		 * Sort scenes in ascending order of their start offset.
		 * @private
		 *
		 * @param {array} ScenesArray - an array of ScrollMagic Scenes that should be sorted
		 * @return {array} The sorted array of Scenes.
		 */ var sortScenes = function(ScenesArray) {
            if (ScenesArray.length <= 1) return ScenesArray;
            else {
                var scenes = ScenesArray.slice(0);
                scenes.sort(function(a, b) {
                    return a.scrollOffset() > b.scrollOffset() ? 1 : -1;
                });
                return scenes;
            }
        };
        /**
		 * ----------------------------------------------------------------
		 * public functions
		 * ----------------------------------------------------------------
		 */ /**
		 * Add one ore more scene(s) to the controller.  
		 * This is the equivalent to `Scene.addTo(controller)`.
		 * @public
		 * @example
		 * // with a previously defined scene
		 * controller.addScene(scene);
		 *
		 * // with a newly created scene.
		 * controller.addScene(new ScrollMagic.Scene({duration : 0}));
		 *
		 * // adding multiple scenes
		 * controller.addScene([scene, scene2, new ScrollMagic.Scene({duration : 0})]);
		 *
		 * @param {(ScrollMagic.Scene|array)} newScene - ScrollMagic Scene or Array of Scenes to be added to the controller.
		 * @return {Controller} Parent object for chaining.
		 */ this.addScene = function(newScene) {
            if (_util.type.Array(newScene)) newScene.forEach(function(scene, index) {
                Controller.addScene(scene);
            });
            else if (newScene instanceof ScrollMagic.Scene) {
                if (newScene.controller() !== Controller) newScene.addTo(Controller);
                else if (_sceneObjects.indexOf(newScene) < 0) {
                    // new scene
                    _sceneObjects.push(newScene); // add to array
                    _sceneObjects = sortScenes(_sceneObjects); // sort
                    newScene.on("shift.controller_sort", function() {
                        _sceneObjects = sortScenes(_sceneObjects);
                    });
                    // insert Global defaults.
                    for(var key in _options.globalSceneOptions)if (newScene[key]) newScene[key].call(newScene, _options.globalSceneOptions[key]);
                    log(3, "adding Scene (now " + _sceneObjects.length + " total)");
                }
            } else log(1, "ERROR: invalid argument supplied for '.addScene()'");
            return Controller;
        };
        /**
		 * Remove one ore more scene(s) from the controller.  
		 * This is the equivalent to `Scene.remove()`.
		 * @public
		 * @example
		 * // remove a scene from the controller
		 * controller.removeScene(scene);
		 *
		 * // remove multiple scenes from the controller
		 * controller.removeScene([scene, scene2, scene3]);
		 *
		 * @param {(ScrollMagic.Scene|array)} Scene - ScrollMagic Scene or Array of Scenes to be removed from the controller.
		 * @returns {Controller} Parent object for chaining.
		 */ this.removeScene = function(Scene) {
            if (_util.type.Array(Scene)) Scene.forEach(function(scene, index) {
                Controller.removeScene(scene);
            });
            else {
                var index = _sceneObjects.indexOf(Scene);
                if (index > -1) {
                    Scene.off("shift.controller_sort");
                    _sceneObjects.splice(index, 1);
                    log(3, "removing Scene (now " + _sceneObjects.length + " left)");
                    Scene.remove();
                }
            }
            return Controller;
        };
        /**
	 * Update one ore more scene(s) according to the scroll position of the container.  
	 * This is the equivalent to `Scene.update()`.  
	 * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
	 * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.  
	 * _**Note:** This method gets called constantly whenever Controller detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
	 * @public
	 * @example
	 * // update a specific scene on next cycle
 	 * controller.updateScene(scene);
 	 *
	 * // update a specific scene immediately
	 * controller.updateScene(scene, true);
 	 *
	 * // update multiple scenes scene on next cycle
	 * controller.updateScene([scene1, scene2, scene3]);
	 *
	 * @param {ScrollMagic.Scene} Scene - ScrollMagic Scene or Array of Scenes that is/are supposed to be updated.
	 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle.  
	 										  This is useful when changing multiple properties of the scene - this way it will only be updated once all new properties are set (updateScenes).
	 * @return {Controller} Parent object for chaining.
	 */ this.updateScene = function(Scene, immediately) {
            if (_util.type.Array(Scene)) Scene.forEach(function(scene, index) {
                Controller.updateScene(scene, immediately);
            });
            else {
                if (immediately) Scene.update(true);
                else if (_updateScenesOnNextCycle !== true && Scene instanceof ScrollMagic.Scene) {
                    // prep array for next update cycle
                    _updateScenesOnNextCycle = _updateScenesOnNextCycle || [];
                    if (_updateScenesOnNextCycle.indexOf(Scene) == -1) _updateScenesOnNextCycle.push(Scene);
                    _updateScenesOnNextCycle = sortScenes(_updateScenesOnNextCycle); // sort
                    debounceUpdate();
                }
            }
            return Controller;
        };
        /**
		 * Updates the controller params and calls updateScene on every scene, that is attached to the controller.  
		 * See `Controller.updateScene()` for more information about what this means.  
		 * In most cases you will not need this function, as it is called constantly, whenever ScrollMagic detects a state change event, like resize or scroll.  
		 * The only application for this method is when ScrollMagic fails to detect these events.  
		 * One application is with some external scroll libraries (like iScroll) that move an internal container to a negative offset instead of actually scrolling. In this case the update on the controller needs to be called whenever the child container's position changes.
		 * For this case there will also be the need to provide a custom function to calculate the correct scroll position. See `Controller.scrollPos()` for details.
		 * @public
		 * @example
		 * // update the controller on next cycle (saves performance due to elimination of redundant updates)
		 * controller.update();
		 *
		 * // update the controller immediately
		 * controller.update(true);
		 *
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance)
		 * @return {Controller} Parent object for chaining.
		 */ this.update = function(immediately) {
            onChange({
                type: "resize"
            }); // will update size and set _updateScenesOnNextCycle to true
            if (immediately) updateScenes();
            return Controller;
        };
        /**
		 * Scroll to a numeric scroll offset, a DOM element, the start of a scene or provide an alternate method for scrolling.  
		 * For vertical controllers it will change the top scroll offset and for horizontal applications it will change the left offset.
		 * @public
		 *
		 * @since 1.1.0
		 * @example
		 * // scroll to an offset of 100
		 * controller.scrollTo(100);
		 *
		 * // scroll to a DOM element
		 * controller.scrollTo("#anchor");
		 *
		 * // scroll to the beginning of a scene
		 * var scene = new ScrollMagic.Scene({offset: 200});
		 * controller.scrollTo(scene);
		 *
		 * // define a new scroll position modification function (jQuery animate instead of jump)
		 * controller.scrollTo(function (newScrollPos) {
		 *	$("html, body").animate({scrollTop: newScrollPos});
		 * });
		 * controller.scrollTo(100); // call as usual, but the new function will be used instead
		 *
		 * // define a new scroll function with an additional parameter
		 * controller.scrollTo(function (newScrollPos, message) {
		 *  console.log(message);
		 *	$(this).animate({scrollTop: newScrollPos});
		 * });
		 * // call as usual, but supply an extra parameter to the defined custom function
		 * controller.scrollTo(100, "my message");
		 *
		 * // define a new scroll function with an additional parameter containing multiple variables
		 * controller.scrollTo(function (newScrollPos, options) {
		 *  someGlobalVar = options.a + options.b;
		 *	$(this).animate({scrollTop: newScrollPos});
		 * });
		 * // call as usual, but supply an extra parameter containing multiple options
		 * controller.scrollTo(100, {a: 1, b: 2});
		 *
		 * // define a new scroll function with a callback supplied as an additional parameter
		 * controller.scrollTo(function (newScrollPos, callback) {
		 *	$(this).animate({scrollTop: newScrollPos}, 400, "swing", callback);
		 * });
		 * // call as usual, but supply an extra parameter, which is used as a callback in the previously defined custom scroll function
		 * controller.scrollTo(100, function() {
		 *	console.log("scroll has finished.");
		 * });
		 *
		 * @param {mixed} scrollTarget - The supplied argument can be one of these types:
		 * 1. `number` -> The container will scroll to this new scroll offset.
		 * 2. `string` or `object` -> Can be a selector or a DOM object.  
		 *  The container will scroll to the position of this element.
		 * 3. `ScrollMagic Scene` -> The container will scroll to the start of this scene.
		 * 4. `function` -> This function will be used for future scroll position modifications.  
		 *  This provides a way for you to change the behaviour of scrolling and adding new behaviour like animation. The function receives the new scroll position as a parameter and a reference to the container element using `this`.  
		 *  It may also optionally receive an optional additional parameter (see below)  
		 *  _**NOTE:**  
		 *  All other options will still work as expected, using the new function to scroll._
		 * @param {mixed} [additionalParameter] - If a custom scroll function was defined (see above 4.), you may want to supply additional parameters to it, when calling it. You can do this using this parameter – see examples for details. Please note, that this parameter will have no effect, if you use the default scrolling function.
		 * @returns {Controller} Parent object for chaining.
		 */ this.scrollTo = function(scrollTarget, additionalParameter) {
            if (_util.type.Number(scrollTarget)) setScrollPos.call(_options.container, scrollTarget, additionalParameter);
            else if (scrollTarget instanceof ScrollMagic.Scene) {
                if (scrollTarget.controller() === Controller) Controller.scrollTo(scrollTarget.scrollOffset(), additionalParameter);
                else log(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", scrollTarget);
            } else if (_util.type.Function(scrollTarget)) setScrollPos = scrollTarget;
            else {
                var elem = _util.get.elements(scrollTarget)[0];
                if (elem) {
                    // if parent is pin spacer, use spacer position instead so correct start position is returned for pinned elements.
                    while(elem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE))elem = elem.parentNode;
                    var param = _options.vertical ? "top" : "left", containerOffset = _util.get.offset(_options.container), elementOffset = _util.get.offset(elem);
                    if (!_isDocument) containerOffset[param] -= Controller.scrollPos();
                    Controller.scrollTo(elementOffset[param] - containerOffset[param], additionalParameter);
                } else log(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", scrollTarget);
            }
            return Controller;
        };
        /**
		 * **Get** the current scrollPosition or **Set** a new method to calculate it.  
		 * -> **GET**:
		 * When used as a getter this function will return the current scroll position.  
		 * To get a cached value use Controller.info("scrollPos"), which will be updated in the update cycle.  
		 * For vertical controllers it will return the top scroll offset and for horizontal applications it will return the left offset.
		 *
		 * -> **SET**:
		 * When used as a setter this method prodes a way to permanently overwrite the controller's scroll position calculation.  
		 * A typical usecase is when the scroll position is not reflected by the containers scrollTop or scrollLeft values, but for example by the inner offset of a child container.  
		 * Moving a child container inside a parent is a commonly used method for several scrolling frameworks, including iScroll.  
		 * By providing an alternate calculation function you can make sure ScrollMagic receives the correct scroll position.  
		 * Please also bear in mind that your function should return y values for vertical scrolls an x for horizontals.
		 *
		 * To change the current scroll position please use `Controller.scrollTo()`.
		 * @public
		 *
		 * @example
		 * // get the current scroll Position
		 * var scrollPos = controller.scrollPos();
		 *
		 * // set a new scroll position calculation method
		 * controller.scrollPos(function () {
		 *	return this.info("vertical") ? -mychildcontainer.y : -mychildcontainer.x
		 * });
		 *
		 * @param {function} [scrollPosMethod] - The function to be used for the scroll position calculation of the container.
		 * @returns {(number|Controller)} Current scroll position or parent object for chaining.
		 */ this.scrollPos = function(scrollPosMethod) {
            if (!arguments.length) return getScrollPos.call(Controller);
            else if (_util.type.Function(scrollPosMethod)) getScrollPos = scrollPosMethod;
            else log(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'.");
            return Controller;
        };
        /**
		 * **Get** all infos or one in particular about the controller.
		 * @public
		 * @example
		 * // returns the current scroll position (number)
		 * var scrollPos = controller.info("scrollPos");
		 *
		 * // returns all infos as an object
		 * var infos = controller.info();
		 *
		 * @param {string} [about] - If passed only this info will be returned instead of an object containing all.  
		 							 Valid options are:
		 							 ** `"size"` => the current viewport size of the container
		 							 ** `"vertical"` => true if vertical scrolling, otherwise false
		 							 ** `"scrollPos"` => the current scroll position
		 							 ** `"scrollDirection"` => the last known direction of the scroll
		 							 ** `"container"` => the container element
		 							 ** `"isDocument"` => true if container element is the document.
		 * @returns {(mixed|object)} The requested info(s).
		 */ this.info = function(about) {
            var values = {
                size: _viewPortSize,
                vertical: _options.vertical,
                scrollPos: _scrollPos,
                scrollDirection: _scrollDirection,
                container: _options.container,
                isDocument: _isDocument
            };
            if (!arguments.length) return values;
            else if (values[about] !== undefined) return values[about];
            else {
                log(1, 'ERROR: option "' + about + '" is not available');
                return;
            }
        };
        /**
		 * **Get** or **Set** the current loglevel option value.
		 * @public
		 *
		 * @example
		 * // get the current value
		 * var loglevel = controller.loglevel();
		 *
		 * // set a new value
		 * controller.loglevel(3);
		 *
		 * @param {number} [newLoglevel] - The new loglevel setting of the Controller. `[0-3]`
		 * @returns {(number|Controller)} Current loglevel or parent object for chaining.
		 */ this.loglevel = function(newLoglevel) {
            if (!arguments.length) return _options.loglevel;
            else if (_options.loglevel != newLoglevel) _options.loglevel = newLoglevel;
            return Controller;
        };
        /**
		 * **Get** or **Set** the current enabled state of the controller.  
		 * This can be used to disable all Scenes connected to the controller without destroying or removing them.
		 * @public
		 *
		 * @example
		 * // get the current value
		 * var enabled = controller.enabled();
		 *
		 * // disable the controller
		 * controller.enabled(false);
		 *
		 * @param {boolean} [newState] - The new enabled state of the controller `true` or `false`.
		 * @returns {(boolean|Controller)} Current enabled state or parent object for chaining.
		 */ this.enabled = function(newState) {
            if (!arguments.length) return _enabled;
            else if (_enabled != newState) {
                _enabled = !!newState;
                Controller.updateScene(_sceneObjects, true);
            }
            return Controller;
        };
        /**
		 * Destroy the Controller, all Scenes and everything.
		 * @public
		 *
		 * @example
		 * // without resetting the scenes
		 * controller = controller.destroy();
		 *
		 * // with scene reset
		 * controller = controller.destroy(true);
		 *
		 * @param {boolean} [resetScenes=false] - If `true` the pins and tweens (if existent) of all scenes will be reset.
		 * @returns {null} Null to unset handler variables.
		 */ this.destroy = function(resetScenes) {
            window.clearTimeout(_refreshTimeout);
            var i = _sceneObjects.length;
            while(i--)_sceneObjects[i].destroy(resetScenes);
            _options.container.removeEventListener("resize", onChange);
            _options.container.removeEventListener("scroll", onChange);
            _util.cAF(_updateTimeout);
            log(3, "destroyed " + NAMESPACE + " (reset: " + (resetScenes ? "true" : "false") + ")");
            return null;
        };
        // INIT
        construct();
        return Controller;
    };
    // store pagewide controller options
    var CONTROLLER_OPTIONS = {
        defaults: {
            container: window,
            vertical: true,
            globalSceneOptions: {},
            loglevel: 2,
            refreshInterval: 100
        }
    };
    /*
	 * method used to add an option to ScrollMagic Scenes.
	 */ ScrollMagic.Controller.addOption = function(name, defaultValue) {
        CONTROLLER_OPTIONS.defaults[name] = defaultValue;
    };
    // instance extension function for plugins
    ScrollMagic.Controller.extend = function(extension) {
        var oldClass = this;
        ScrollMagic.Controller = function() {
            oldClass.apply(this, arguments);
            this.$super = _util.extend({}, this); // copy parent state
            return extension.apply(this, arguments) || this;
        };
        _util.extend(ScrollMagic.Controller, oldClass); // copy properties
        ScrollMagic.Controller.prototype = oldClass.prototype; // copy prototype
        ScrollMagic.Controller.prototype.constructor = ScrollMagic.Controller; // restore constructor
    };
    /**
	 * A Scene defines where the controller should react and how.
	 *
	 * @class
	 *
	 * @example
	 * // create a standard scene and add it to a controller
	 * new ScrollMagic.Scene()
	 *		.addTo(controller);
	 *
	 * // create a scene with custom options and assign a handler to it.
	 * var scene = new ScrollMagic.Scene({
	 * 		duration: 100,
	 *		offset: 200,
	 *		triggerHook: "onEnter",
	 *		reverse: false
	 * });
	 *
	 * @param {object} [options] - Options for the Scene. The options can be updated at any time.  
	 							   Instead of setting the options for each scene individually you can also set them globally in the controller as the controllers `globalSceneOptions` option. The object accepts the same properties as the ones below.  
	 							   When a scene is added to the controller the options defined using the Scene constructor will be overwritten by those set in `globalSceneOptions`.
	 * @param {(number|string|function)} [options.duration=0] - The duration of the scene. 
	 					Please see `Scene.duration()` for details.
	 * @param {number} [options.offset=0] - Offset Value for the Trigger Position. If no triggerElement is defined this will be the scroll distance from the start of the page, after which the scene will start.
	 * @param {(string|object)} [options.triggerElement=null] - Selector or DOM object that defines the start of the scene. If undefined the scene will start right at the start of the page (unless an offset is set).
	 * @param {(number|string)} [options.triggerHook="onCenter"] - Can be a number between 0 and 1 defining the position of the trigger Hook in relation to the viewport.  
	 															  Can also be defined using a string:
	 															  ** `"onEnter"` => `1`
	 															  ** `"onCenter"` => `0.5`
	 															  ** `"onLeave"` => `0`
	 * @param {boolean} [options.reverse=true] - Should the scene reverse, when scrolling up?
	 * @param {number} [options.loglevel=2] - Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
	 										  ** `0` => silent
	 										  ** `1` => errors
	 										  ** `2` => errors, warnings
	 										  ** `3` => errors, warnings, debuginfo
	 * 
	 */ ScrollMagic.Scene = function(options) {
        /*
		 * ----------------------------------------------------------------
		 * settings
		 * ----------------------------------------------------------------
		 */ var NAMESPACE = "ScrollMagic.Scene", SCENE_STATE_BEFORE = "BEFORE", SCENE_STATE_DURING = "DURING", SCENE_STATE_AFTER = "AFTER", DEFAULT_OPTIONS = SCENE_OPTIONS.defaults;
        /*
		 * ----------------------------------------------------------------
		 * private vars
		 * ----------------------------------------------------------------
		 */ var Scene = this, _options = _util.extend({}, DEFAULT_OPTIONS, options), _state = SCENE_STATE_BEFORE, _progress = 0, _scrollOffset = {
            start: 0,
            end: 0
        }, _triggerPos = 0, _enabled = true, _durationUpdateMethod, _controller;
        /**
		 * Internal constructor function of the ScrollMagic Scene
		 * @private
		 */ var construct = function() {
            for(var key in _options)if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
                log(2, 'WARNING: Unknown option "' + key + '"');
                delete _options[key];
            }
            // add getters/setters for all possible options
            for(var optionName in DEFAULT_OPTIONS)addSceneOption(optionName);
            // validate all options
            validateOption();
        };
        /*
		 * ----------------------------------------------------------------
		 * Event Management
		 * ----------------------------------------------------------------
		 */ var _listeners = {};
        /**
		 * Scene start event.  
		 * Fires whenever the scroll position its the starting point of the scene.  
		 * It will also fire when scrolling back up going over the start position of the scene. If you want something to happen only when scrolling down/right, use the scrollDirection parameter passed to the callback.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#start
		 *
		 * @example
		 * scene.on("start", function (event) {
		 * 	console.log("Hit start point of scene.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"` or `"DURING"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */ /**
		 * Scene end event.  
		 * Fires whenever the scroll position its the ending point of the scene.  
		 * It will also fire when scrolling back up from after the scene and going over its end position. If you want something to happen only when scrolling down/right, use the scrollDirection parameter passed to the callback.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#end
		 *
		 * @example
		 * scene.on("end", function (event) {
		 * 	console.log("Hit end point of scene.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"DURING"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */ /**
		 * Scene enter event.  
		 * Fires whenever the scene enters the "DURING" state.  
		 * Keep in mind that it doesn't matter if the scene plays forward or backward: This event always fires when the scene enters its active scroll timeframe, regardless of the scroll-direction.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#enter
		 *
		 * @example
		 * scene.on("enter", function (event) {
		 * 	console.log("Scene entered.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene - always `"DURING"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */ /**
		 * Scene leave event.  
		 * Fires whenever the scene's state goes from "DURING" to either "BEFORE" or "AFTER".  
		 * Keep in mind that it doesn't matter if the scene plays forward or backward: This event always fires when the scene leaves its active scroll timeframe, regardless of the scroll-direction.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#leave
		 *
		 * @example
		 * scene.on("leave", function (event) {
		 * 	console.log("Scene left.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */ /**
		 * Scene update event.  
		 * Fires whenever the scene is updated (but not necessarily changes the progress).
		 *
		 * @event ScrollMagic.Scene#update
		 *
		 * @example
		 * scene.on("update", function (event) {
		 * 	console.log("Scene updated.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.startPos - The starting position of the scene (in relation to the conainer)
		 * @property {number} event.endPos - The ending position of the scene (in relation to the conainer)
		 * @property {number} event.scrollPos - The current scroll position of the container
		 */ /**
		 * Scene progress event.  
		 * Fires whenever the progress of the scene changes.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#progress
		 *
		 * @example
		 * scene.on("progress", function (event) {
		 * 	console.log("Scene progress changed to " + event.progress);
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"`, `"DURING"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */ /**
		 * Scene change event.  
		 * Fires whenvever a property of the scene is changed.
		 *
		 * @event ScrollMagic.Scene#change
		 *
		 * @example
		 * scene.on("change", function (event) {
		 * 	console.log("Scene Property \"" + event.what + "\" changed to " + event.newval);
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {string} event.what - Indicates what value has been changed
		 * @property {mixed} event.newval - The new value of the changed property
		 */ /**
		 * Scene shift event.  
		 * Fires whenvever the start or end **scroll offset** of the scene change.
		 * This happens explicitely, when one of these values change: `offset`, `duration` or `triggerHook`.
		 * It will fire implicitly when the `triggerElement` changes, if the new element has a different position (most cases).
		 * It will also fire implicitly when the size of the container changes and the triggerHook is anything other than `onLeave`.
		 *
		 * @event ScrollMagic.Scene#shift
		 * @since 1.1.0
		 *
		 * @example
		 * scene.on("shift", function (event) {
		 * 	console.log("Scene moved, because the " + event.reason + " has changed.)");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {string} event.reason - Indicates why the scene has shifted
		 */ /**
		 * Scene destroy event.  
		 * Fires whenvever the scene is destroyed.
		 * This can be used to tidy up custom behaviour used in events.
		 *
		 * @event ScrollMagic.Scene#destroy
		 * @since 1.1.0
		 *
		 * @example
		 * scene.on("enter", function (event) {
		 *        // add custom action
		 *        $("#my-elem").left("200");
		 *      })
		 *      .on("destroy", function (event) {
		 *        // reset my element to start position
		 *        if (event.reset) {
		 *          $("#my-elem").left("0");
		 *        }
		 *      });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {boolean} event.reset - Indicates if the destroy method was called with reset `true` or `false`.
		 */ /**
		 * Scene add event.  
		 * Fires when the scene is added to a controller.
		 * This is mostly used by plugins to know that change might be due.
		 *
		 * @event ScrollMagic.Scene#add
		 * @since 2.0.0
		 *
		 * @example
		 * scene.on("add", function (event) {
		 * 	console.log('Scene was added to a new controller.');
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {boolean} event.controller - The controller object the scene was added to.
		 */ /**
		 * Scene remove event.  
		 * Fires when the scene is removed from a controller.
		 * This is mostly used by plugins to know that change might be due.
		 *
		 * @event ScrollMagic.Scene#remove
		 * @since 2.0.0
		 *
		 * @example
		 * scene.on("remove", function (event) {
		 * 	console.log('Scene was removed from its controller.');
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 */ /**
		 * Add one ore more event listener.  
		 * The callback function will be fired at the respective event, and an object containing relevant data will be passed to the callback.
		 * @method ScrollMagic.Scene#on
		 *
		 * @example
		 * function callback (event) {
		 * 		console.log("Event fired! (" + event.type + ")");
		 * }
		 * // add listeners
		 * scene.on("change update progress start end enter leave", callback);
		 *
		 * @param {string} names - The name or names of the event the callback should be attached to.
		 * @param {function} callback - A function that should be executed, when the event is dispatched. An event object will be passed to the callback.
		 * @returns {Scene} Parent object for chaining.
		 */ this.on = function(names, callback) {
            if (_util.type.Function(callback)) {
                names = names.trim().split(" ");
                names.forEach(function(fullname) {
                    var nameparts = fullname.split("."), eventname = nameparts[0], namespace = nameparts[1];
                    if (eventname != "*") {
                        if (!_listeners[eventname]) _listeners[eventname] = [];
                        _listeners[eventname].push({
                            namespace: namespace || "",
                            callback: callback
                        });
                    }
                });
            } else log(1, "ERROR when calling '.on()': Supplied callback for '" + names + "' is not a valid function!");
            return Scene;
        };
        /**
		 * Remove one or more event listener.
		 * @method ScrollMagic.Scene#off
		 *
		 * @example
		 * function callback (event) {
		 * 		console.log("Event fired! (" + event.type + ")");
		 * }
		 * // add listeners
		 * scene.on("change update", callback);
		 * // remove listeners
		 * scene.off("change update", callback);
		 *
		 * @param {string} names - The name or names of the event that should be removed.
		 * @param {function} [callback] - A specific callback function that should be removed. If none is passed all callbacks to the event listener will be removed.
		 * @returns {Scene} Parent object for chaining.
		 */ this.off = function(names, callback) {
            if (!names) {
                log(1, "ERROR: Invalid event name supplied.");
                return Scene;
            }
            names = names.trim().split(" ");
            names.forEach(function(fullname, key) {
                var nameparts = fullname.split("."), eventname = nameparts[0], namespace = nameparts[1] || "", removeList = eventname === "*" ? Object.keys(_listeners) : [
                    eventname
                ];
                removeList.forEach(function(remove) {
                    var list = _listeners[remove] || [], i = list.length;
                    while(i--){
                        var listener = list[i];
                        if (listener && (namespace === listener.namespace || namespace === "*") && (!callback || callback == listener.callback)) list.splice(i, 1);
                    }
                    if (!list.length) delete _listeners[remove];
                });
            });
            return Scene;
        };
        /**
		 * Trigger an event.
		 * @method ScrollMagic.Scene#trigger
		 *
		 * @example
		 * this.trigger("change");
		 *
		 * @param {string} name - The name of the event that should be triggered.
		 * @param {object} [vars] - An object containing info that should be passed to the callback.
		 * @returns {Scene} Parent object for chaining.
		 */ this.trigger = function(name, vars) {
            if (name) {
                var nameparts = name.trim().split("."), eventname = nameparts[0], namespace = nameparts[1], listeners = _listeners[eventname];
                log(3, "event fired:", eventname, vars ? "->" : "", vars || "");
                if (listeners) listeners.forEach(function(listener, key) {
                    if (!namespace || namespace === listener.namespace) listener.callback.call(Scene, new ScrollMagic.Event(eventname, listener.namespace, Scene, vars));
                });
            } else log(1, "ERROR: Invalid event name supplied.");
            return Scene;
        };
        // set event listeners
        Scene.on("change.internal", function(e) {
            if (e.what !== "loglevel" && e.what !== "tweenChanges") {
                if (e.what === "triggerElement") updateTriggerElementPosition();
                else if (e.what === "reverse") Scene.update();
            }
        }).on("shift.internal", function(e) {
            updateScrollOffset();
            Scene.update(); // update scene to reflect new position
        });
        /**
		 * Send a debug message to the console.
		 * @private
		 * but provided publicly with _log for plugins
		 *
		 * @param {number} loglevel - The loglevel required to initiate output for the message.
		 * @param {...mixed} output - One or more variables that should be passed to the console.
		 */ var log = this._log = function(loglevel, output) {
            if (_options.loglevel >= loglevel) {
                Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
                _util.log.apply(window, arguments);
            }
        };
        /**
		 * Add the scene to a controller.  
		 * This is the equivalent to `Controller.addScene(scene)`.
		 * @method ScrollMagic.Scene#addTo
		 *
		 * @example
		 * // add a scene to a ScrollMagic Controller
		 * scene.addTo(controller);
		 *
		 * @param {ScrollMagic.Controller} controller - The controller to which the scene should be added.
		 * @returns {Scene} Parent object for chaining.
		 */ this.addTo = function(controller) {
            if (!(controller instanceof ScrollMagic.Controller)) log(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller");
            else if (_controller != controller) {
                // new controller
                if (_controller) _controller.removeScene(Scene);
                _controller = controller;
                validateOption();
                updateDuration(true);
                updateTriggerElementPosition(true);
                updateScrollOffset();
                _controller.info("container").addEventListener("resize", onContainerResize);
                controller.addScene(Scene);
                Scene.trigger("add", {
                    controller: _controller
                });
                log(3, "added " + NAMESPACE + " to controller");
                Scene.update();
            }
            return Scene;
        };
        /**
		 * **Get** or **Set** the current enabled state of the scene.  
		 * This can be used to disable this scene without removing or destroying it.
		 * @method ScrollMagic.Scene#enabled
		 *
		 * @example
		 * // get the current value
		 * var enabled = scene.enabled();
		 *
		 * // disable the scene
		 * scene.enabled(false);
		 *
		 * @param {boolean} [newState] - The new enabled state of the scene `true` or `false`.
		 * @returns {(boolean|Scene)} Current enabled state or parent object for chaining.
		 */ this.enabled = function(newState) {
            if (!arguments.length) return _enabled;
            else if (_enabled != newState) {
                _enabled = !!newState;
                Scene.update(true);
            }
            return Scene;
        };
        /**
		 * Remove the scene from the controller.  
		 * This is the equivalent to `Controller.removeScene(scene)`.
		 * The scene will not be updated anymore until you readd it to a controller.
		 * To remove the pin or the tween you need to call removeTween() or removePin() respectively.
		 * @method ScrollMagic.Scene#remove
		 * @example
		 * // remove the scene from its controller
		 * scene.remove();
		 *
		 * @returns {Scene} Parent object for chaining.
		 */ this.remove = function() {
            if (_controller) {
                _controller.info("container").removeEventListener("resize", onContainerResize);
                var tmpParent = _controller;
                _controller = undefined;
                tmpParent.removeScene(Scene);
                Scene.trigger("remove");
                log(3, "removed " + NAMESPACE + " from controller");
            }
            return Scene;
        };
        /**
		 * Destroy the scene and everything.
		 * @method ScrollMagic.Scene#destroy
		 * @example
		 * // destroy the scene without resetting the pin and tween to their initial positions
		 * scene = scene.destroy();
		 *
		 * // destroy the scene and reset the pin and tween
		 * scene = scene.destroy(true);
		 *
		 * @param {boolean} [reset=false] - If `true` the pin and tween (if existent) will be reset.
		 * @returns {null} Null to unset handler variables.
		 */ this.destroy = function(reset) {
            Scene.trigger("destroy", {
                reset: reset
            });
            Scene.remove();
            Scene.off("*.*");
            log(3, "destroyed " + NAMESPACE + " (reset: " + (reset ? "true" : "false") + ")");
            return null;
        };
        /**
		 * Updates the Scene to reflect the current state.  
		 * This is the equivalent to `Controller.updateScene(scene, immediately)`.  
		 * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
		 * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.
		 * This means an update doesn't necessarily result in a progress change. The `progress` event will be fired if the progress has indeed changed between this update and the last.  
		 * _**NOTE:** This method gets called constantly whenever ScrollMagic detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
		 * @method ScrollMagic.Scene#update
		 * @example
		 * // update the scene on next tick
		 * scene.update();
		 *
		 * // update the scene immediately
		 * scene.update(true);
		 *
		 * @fires Scene.update
		 *
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance).
		 * @returns {Scene} Parent object for chaining.
		 */ this.update = function(immediately) {
            if (_controller) {
                if (immediately) {
                    if (_controller.enabled() && _enabled) {
                        var scrollPos = _controller.info("scrollPos"), newProgress;
                        if (_options.duration > 0) newProgress = (scrollPos - _scrollOffset.start) / (_scrollOffset.end - _scrollOffset.start);
                        else newProgress = scrollPos >= _scrollOffset.start ? 1 : 0;
                        Scene.trigger("update", {
                            startPos: _scrollOffset.start,
                            endPos: _scrollOffset.end,
                            scrollPos: scrollPos
                        });
                        Scene.progress(newProgress);
                    } else if (_pin && _state === SCENE_STATE_DURING) updatePinState(true); // unpin in position
                } else _controller.updateScene(Scene, false);
            }
            return Scene;
        };
        /**
		 * Updates dynamic scene variables like the trigger element position or the duration.
		 * This method is automatically called in regular intervals from the controller. See {@link ScrollMagic.Controller} option `refreshInterval`.
		 * 
		 * You can call it to minimize lag, for example when you intentionally change the position of the triggerElement.
		 * If you don't it will simply be updated in the next refresh interval of the container, which is usually sufficient.
		 *
		 * @method ScrollMagic.Scene#refresh
		 * @since 1.1.0
		 * @example
		 * scene = new ScrollMagic.Scene({triggerElement: "#trigger"});
		 * 
		 * // change the position of the trigger
		 * $("#trigger").css("top", 500);
		 * // immediately let the scene know of this change
		 * scene.refresh();
		 *
		 * @fires {@link Scene.shift}, if the trigger element position or the duration changed
		 * @fires {@link Scene.change}, if the duration changed
		 *
		 * @returns {Scene} Parent object for chaining.
		 */ this.refresh = function() {
            updateDuration();
            updateTriggerElementPosition();
            // update trigger element position
            return Scene;
        };
        /**
		 * **Get** or **Set** the scene's progress.  
		 * Usually it shouldn't be necessary to use this as a setter, as it is set automatically by scene.update().  
		 * The order in which the events are fired depends on the duration of the scene:
		 *  1. Scenes with `duration == 0`:  
		 *  Scenes that have no duration by definition have no ending. Thus the `end` event will never be fired.  
		 *  When the trigger position of the scene is passed the events are always fired in this order:  
		 *  `enter`, `start`, `progress` when scrolling forward  
		 *  and  
		 *  `progress`, `start`, `leave` when scrolling in reverse
		 *  2. Scenes with `duration > 0`:  
		 *  Scenes with a set duration have a defined start and end point.  
		 *  When scrolling past the start position of the scene it will fire these events in this order:  
		 *  `enter`, `start`, `progress`  
		 *  When continuing to scroll and passing the end point it will fire these events:  
		 *  `progress`, `end`, `leave`  
		 *  When reversing through the end point these events are fired:  
		 *  `enter`, `end`, `progress`  
		 *  And when continuing to scroll past the start position in reverse it will fire:  
		 *  `progress`, `start`, `leave`  
		 *  In between start and end the `progress` event will be called constantly, whenever the progress changes.
		 * 
		 * In short:  
		 * `enter` events will always trigger **before** the progress update and `leave` envents will trigger **after** the progress update.  
		 * `start` and `end` will always trigger at their respective position.
		 * 
		 * Please review the event descriptions for details on the events and the event object that is passed to the callback.
		 * 
		 * @method ScrollMagic.Scene#progress
		 * @example
		 * // get the current scene progress
		 * var progress = scene.progress();
		 *
		 * // set new scene progress
		 * scene.progress(0.3);
		 *
		 * @fires {@link Scene.enter}, when used as setter
		 * @fires {@link Scene.start}, when used as setter
		 * @fires {@link Scene.progress}, when used as setter
		 * @fires {@link Scene.end}, when used as setter
		 * @fires {@link Scene.leave}, when used as setter
		 *
		 * @param {number} [progress] - The new progress value of the scene `[0-1]`.
		 * @returns {number} `get` -  Current scene progress.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */ this.progress = function(progress) {
            if (!arguments.length) return _progress;
            else {
                var doUpdate = false, oldState = _state, scrollDirection = _controller ? _controller.info("scrollDirection") : "PAUSED", reverseOrForward = _options.reverse || progress >= _progress;
                if (_options.duration === 0) {
                    // zero duration scenes
                    doUpdate = _progress != progress;
                    _progress = progress < 1 && reverseOrForward ? 0 : 1;
                    _state = _progress === 0 ? SCENE_STATE_BEFORE : SCENE_STATE_DURING;
                } else {
                    // scenes with start and end
                    if (progress < 0 && _state !== SCENE_STATE_BEFORE && reverseOrForward) {
                        // go back to initial state
                        _progress = 0;
                        _state = SCENE_STATE_BEFORE;
                        doUpdate = true;
                    } else if (progress >= 0 && progress < 1 && reverseOrForward) {
                        _progress = progress;
                        _state = SCENE_STATE_DURING;
                        doUpdate = true;
                    } else if (progress >= 1 && _state !== SCENE_STATE_AFTER) {
                        _progress = 1;
                        _state = SCENE_STATE_AFTER;
                        doUpdate = true;
                    } else if (_state === SCENE_STATE_DURING && !reverseOrForward) updatePinState(); // in case we scrolled backwards mid-scene and reverse is disabled => update the pin position, so it doesn't move back as well.
                }
                if (doUpdate) {
                    // fire events
                    var eventVars = {
                        progress: _progress,
                        state: _state,
                        scrollDirection: scrollDirection
                    }, stateChanged = _state != oldState;
                    var trigger = function(eventName) {
                        Scene.trigger(eventName, eventVars);
                    };
                    if (stateChanged) {
                        if (oldState !== SCENE_STATE_DURING) {
                            trigger("enter");
                            trigger(oldState === SCENE_STATE_BEFORE ? "start" : "end");
                        }
                    }
                    trigger("progress");
                    if (stateChanged) {
                        if (_state !== SCENE_STATE_DURING) {
                            trigger(_state === SCENE_STATE_BEFORE ? "start" : "end");
                            trigger("leave");
                        }
                    }
                }
                return Scene;
            }
        };
        /**
		 * Update the start and end scrollOffset of the container.
		 * The positions reflect what the controller's scroll position will be at the start and end respectively.
		 * Is called, when:
		 *   - Scene event "change" is called with: offset, triggerHook, duration 
		 *   - scroll container event "resize" is called
		 *   - the position of the triggerElement changes
		 *   - the controller changes -> addTo()
		 * @private
		 */ var updateScrollOffset = function() {
            _scrollOffset = {
                start: _triggerPos + _options.offset
            };
            if (_controller && _options.triggerElement) // take away triggerHook portion to get relative to top
            _scrollOffset.start -= _controller.info("size") * _options.triggerHook;
            _scrollOffset.end = _scrollOffset.start + _options.duration;
        };
        /**
		 * Updates the duration if set to a dynamic function.
		 * This method is called when the scene is added to a controller and in regular intervals from the controller through scene.refresh().
		 * 
		 * @fires {@link Scene.change}, if the duration changed
		 * @fires {@link Scene.shift}, if the duration changed
		 *
		 * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
		 * @private
		 */ var updateDuration = function(suppressEvents) {
            // update duration
            if (_durationUpdateMethod) {
                var varname = "duration";
                if (changeOption(varname, _durationUpdateMethod.call(Scene)) && !suppressEvents) {
                    Scene.trigger("change", {
                        what: varname,
                        newval: _options[varname]
                    });
                    Scene.trigger("shift", {
                        reason: varname
                    });
                }
            }
        };
        /**
		 * Updates the position of the triggerElement, if present.
		 * This method is called ...
		 *  - ... when the triggerElement is changed
		 *  - ... when the scene is added to a (new) controller
		 *  - ... in regular intervals from the controller through scene.refresh().
		 * 
		 * @fires {@link Scene.shift}, if the position changed
		 *
		 * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
		 * @private
		 */ var updateTriggerElementPosition = function(suppressEvents) {
            var elementPos = 0, telem = _options.triggerElement;
            if (_controller && (telem || _triggerPos > 0)) {
                if (telem) {
                    if (telem.parentNode) {
                        var controllerInfo = _controller.info(), containerOffset = _util.get.offset(controllerInfo.container), param = controllerInfo.vertical ? "top" : "left"; // which param is of interest ?
                        // if parent is spacer, use spacer position instead so correct start position is returned for pinned elements.
                        while(telem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE))telem = telem.parentNode;
                        var elementOffset = _util.get.offset(telem);
                        if (!controllerInfo.isDocument) containerOffset[param] -= _controller.scrollPos();
                        elementPos = elementOffset[param] - containerOffset[param];
                    } else {
                        log(2, "WARNING: triggerElement was removed from DOM and will be reset to", undefined);
                        Scene.triggerElement(undefined); // unset, so a change event is triggered
                    }
                }
                var changed = elementPos != _triggerPos;
                _triggerPos = elementPos;
                if (changed && !suppressEvents) Scene.trigger("shift", {
                    reason: "triggerElementPosition"
                });
            }
        };
        /**
		 * Trigger a shift event, when the container is resized and the triggerHook is > 1.
		 * @private
		 */ var onContainerResize = function(e) {
            if (_options.triggerHook > 0) Scene.trigger("shift", {
                reason: "containerResize"
            });
        };
        var _validate = _util.extend(SCENE_OPTIONS.validate, {
            // validation for duration handled internally for reference to private var _durationMethod
            duration: function(val) {
                if (_util.type.String(val) && val.match(/^(\.|\d)*\d+%$/)) {
                    // percentage value
                    var perc = parseFloat(val) / 100;
                    val = function() {
                        return _controller ? _controller.info("size") * perc : 0;
                    };
                }
                if (_util.type.Function(val)) {
                    // function
                    _durationUpdateMethod = val;
                    try {
                        val = parseFloat(_durationUpdateMethod.call(Scene));
                    } catch (e) {
                        val = -1; // will cause error below
                    }
                }
                // val has to be float
                val = parseFloat(val);
                if (!_util.type.Number(val) || val < 0) {
                    if (_durationUpdateMethod) {
                        _durationUpdateMethod = undefined;
                        throw [
                            'Invalid return value of supplied function for option "duration":',
                            val
                        ];
                    } else throw [
                        'Invalid value for option "duration":',
                        val
                    ];
                }
                return val;
            }
        });
        /**
		 * Checks the validity of a specific or all options and reset to default if neccessary.
		 * @private
		 */ var validateOption = function(check) {
            check = arguments.length ? [
                check
            ] : Object.keys(_validate);
            check.forEach(function(optionName, key) {
                var value;
                if (_validate[optionName]) try {
                    value = _validate[optionName](_options[optionName]);
                } catch (e) {
                    value = DEFAULT_OPTIONS[optionName];
                    var logMSG = _util.type.String(e) ? [
                        e
                    ] : e;
                    if (_util.type.Array(logMSG)) {
                        logMSG[0] = "ERROR: " + logMSG[0];
                        logMSG.unshift(1); // loglevel 1 for error msg
                        log.apply(this, logMSG);
                    } else log(1, "ERROR: Problem executing validation callback for option '" + optionName + "':", e.message);
                } finally{
                    _options[optionName] = value;
                }
            });
        };
        /**
		 * Helper used by the setter/getters for scene options
		 * @private
		 */ var changeOption = function(varname, newval) {
            var changed = false, oldval = _options[varname];
            if (_options[varname] != newval) {
                _options[varname] = newval;
                validateOption(varname); // resets to default if necessary
                changed = oldval != _options[varname];
            }
            return changed;
        };
        // generate getters/setters for all options
        var addSceneOption = function(optionName) {
            if (!Scene[optionName]) Scene[optionName] = function(newVal) {
                if (!arguments.length) return _options[optionName];
                else {
                    if (optionName === "duration") _durationUpdateMethod = undefined;
                    if (changeOption(optionName, newVal)) {
                        Scene.trigger("change", {
                            what: optionName,
                            newval: _options[optionName]
                        });
                        if (SCENE_OPTIONS.shifts.indexOf(optionName) > -1) Scene.trigger("shift", {
                            reason: optionName
                        });
                    }
                }
                return Scene;
            };
        };
        /**
		 * **Get** or **Set** the duration option value.
		 *
		 * As a **setter** it accepts three types of parameters:
		 * 1. `number`: Sets the duration of the scene to exactly this amount of pixels.  
		 *   This means the scene will last for exactly this amount of pixels scrolled. Sub-Pixels are also valid.
		 *   A value of `0` means that the scene is 'open end' and no end will be triggered. Pins will never unpin and animations will play independently of scroll progress.
		 * 2. `string`: Always updates the duration relative to parent scroll container.  
		 *   For example `"100%"` will keep the duration always exactly at the inner height of the scroll container.
		 *   When scrolling vertically the width is used for reference respectively.
		 * 3. `function`: The supplied function will be called to return the scene duration.
		 *   This is useful in setups where the duration depends on other elements who might change size. By supplying a function you can return a value instead of updating potentially multiple scene durations.  
		 *   The scene can be referenced inside the callback using `this`.
		 *   _**WARNING:** This is an easy way to kill performance, as the callback will be executed every time `Scene.refresh()` is called, which happens a lot. The interval is defined by the controller (see ScrollMagic.Controller option `refreshInterval`).  
		 *   It's recomended to avoid calculations within the function and use cached variables as return values.  
		 *   This counts double if you use the same function for multiple scenes._
		 *
		 * @method ScrollMagic.Scene#duration
		 * @example
		 * // get the current duration value
		 * var duration = scene.duration();
		 *
		 * // set a new duration
		 * scene.duration(300);
		 *
		 * // set duration responsively to container size
		 * scene.duration("100%");
		 *
		 * // use a function to randomize the duration for some reason.
		 * var durationValueCache;
		 * function durationCallback () {
		 *   return durationValueCache;
		 * }
		 * function updateDuration () {
		 *   durationValueCache = Math.random() * 100;
		 * }
		 * updateDuration(); // set to initial value
		 * scene.duration(durationCallback); // set duration callback
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {(number|string|function)} [newDuration] - The new duration setting for the scene.
		 * @returns {number} `get` -  Current scene duration.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */ /**
		 * **Get** or **Set** the offset option value.
		 * @method ScrollMagic.Scene#offset
		 * @example
		 * // get the current offset
		 * var offset = scene.offset();
		 *
		 * // set a new offset
		 * scene.offset(100);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {number} [newOffset] - The new offset of the scene.
		 * @returns {number} `get` -  Current scene offset.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */ /**
		 * **Get** or **Set** the triggerElement option value.
		 * Does **not** fire `Scene.shift`, because changing the trigger Element doesn't necessarily mean the start position changes. This will be determined in `Scene.refresh()`, which is automatically triggered.
		 * @method ScrollMagic.Scene#triggerElement
		 * @example
		 * // get the current triggerElement
		 * var triggerElement = scene.triggerElement();
		 *
		 * // set a new triggerElement using a selector
		 * scene.triggerElement("#trigger");
		 * // set a new triggerElement using a DOM object
		 * scene.triggerElement(document.getElementById("trigger"));
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {(string|object)} [newTriggerElement] - The new trigger element for the scene.
		 * @returns {(string|object)} `get` -  Current triggerElement.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */ /**
		 * **Get** or **Set** the triggerHook option value.
		 * @method ScrollMagic.Scene#triggerHook
		 * @example
		 * // get the current triggerHook value
		 * var triggerHook = scene.triggerHook();
		 *
		 * // set a new triggerHook using a string
		 * scene.triggerHook("onLeave");
		 * // set a new triggerHook using a number
		 * scene.triggerHook(0.7);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {(number|string)} [newTriggerHook] - The new triggerHook of the scene. See {@link Scene} parameter description for value options.
		 * @returns {number} `get` -  Current triggerHook (ALWAYS numerical).
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */ /**
		 * **Get** or **Set** the reverse option value.
		 * @method ScrollMagic.Scene#reverse
		 * @example
		 * // get the current reverse option
		 * var reverse = scene.reverse();
		 *
		 * // set new reverse option
		 * scene.reverse(false);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {boolean} [newReverse] - The new reverse setting of the scene.
		 * @returns {boolean} `get` -  Current reverse option value.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */ /**
		 * **Get** or **Set** the loglevel option value.
		 * @method ScrollMagic.Scene#loglevel
		 * @example
		 * // get the current loglevel
		 * var loglevel = scene.loglevel();
		 *
		 * // set new loglevel
		 * scene.loglevel(3);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {number} [newLoglevel] - The new loglevel setting of the scene. `[0-3]`
		 * @returns {number} `get` -  Current loglevel.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */ /**
		 * **Get** the associated controller.
		 * @method ScrollMagic.Scene#controller
		 * @example
		 * // get the controller of a scene
		 * var controller = scene.controller();
		 *
		 * @returns {ScrollMagic.Controller} Parent controller or `undefined`
		 */ this.controller = function() {
            return _controller;
        };
        /**
		 * **Get** the current state.
		 * @method ScrollMagic.Scene#state
		 * @example
		 * // get the current state
		 * var state = scene.state();
		 *
		 * @returns {string} `"BEFORE"`, `"DURING"` or `"AFTER"`
		 */ this.state = function() {
            return _state;
        };
        /**
		 * **Get** the current scroll offset for the start of the scene.  
		 * Mind, that the scrollOffset is related to the size of the container, if `triggerHook` is bigger than `0` (or `"onLeave"`).  
		 * This means, that resizing the container or changing the `triggerHook` will influence the scene's start offset.
		 * @method ScrollMagic.Scene#scrollOffset
		 * @example
		 * // get the current scroll offset for the start and end of the scene.
		 * var start = scene.scrollOffset();
		 * var end = scene.scrollOffset() + scene.duration();
		 * console.log("the scene starts at", start, "and ends at", end);
		 *
		 * @returns {number} The scroll offset (of the container) at which the scene will trigger. Y value for vertical and X value for horizontal scrolls.
		 */ this.scrollOffset = function() {
            return _scrollOffset.start;
        };
        /**
		 * **Get** the trigger position of the scene (including the value of the `offset` option).  
		 * @method ScrollMagic.Scene#triggerPosition
		 * @example
		 * // get the scene's trigger position
		 * var triggerPosition = scene.triggerPosition();
		 *
		 * @returns {number} Start position of the scene. Top position value for vertical and left position value for horizontal scrolls.
		 */ this.triggerPosition = function() {
            var pos = _options.offset; // the offset is the basis
            if (_controller) {
                // get the trigger position
                if (_options.triggerElement) // Element as trigger
                pos += _triggerPos;
                else // return the height of the triggerHook to start at the beginning
                pos += _controller.info("size") * Scene.triggerHook();
            }
            return pos;
        };
        var _pin, _pinOptions;
        Scene.on("shift.internal", function(e) {
            var durationChanged = e.reason === "duration";
            if (_state === SCENE_STATE_AFTER && durationChanged || _state === SCENE_STATE_DURING && _options.duration === 0) // if [duration changed after a scene (inside scene progress updates pin position)] or [duration is 0, we are in pin phase and some other value changed].
            updatePinState();
            if (durationChanged) updatePinDimensions();
        }).on("progress.internal", function(e) {
            updatePinState();
        }).on("add.internal", function(e) {
            updatePinDimensions();
        }).on("destroy.internal", function(e) {
            Scene.removePin(e.reset);
        });
        /**
		 * Update the pin state.
		 * @private
		 */ var updatePinState = function(forceUnpin) {
            if (_pin && _controller) {
                var containerInfo = _controller.info(), pinTarget = _pinOptions.spacer.firstChild; // may be pin element or another spacer, if cascading pins
                if (!forceUnpin && _state === SCENE_STATE_DURING) {
                    // pinned state
                    if (_util.css(pinTarget, "position") != "fixed") {
                        // change state before updating pin spacer (position changes due to fixed collapsing might occur.)
                        _util.css(pinTarget, {
                            "position": "fixed"
                        });
                        // update pin spacer
                        updatePinDimensions();
                    }
                    var fixedPos = _util.get.offset(_pinOptions.spacer, true), scrollDistance = _options.reverse || _options.duration === 0 ? containerInfo.scrollPos - _scrollOffset.start // quicker
                     : Math.round(_progress * _options.duration * 10) / 10; // if no reverse and during pin the position needs to be recalculated using the progress
                    // add scrollDistance
                    fixedPos[containerInfo.vertical ? "top" : "left"] += scrollDistance;
                    // set new values
                    _util.css(_pinOptions.spacer.firstChild, {
                        top: fixedPos.top,
                        left: fixedPos.left
                    });
                } else {
                    // unpinned state
                    var newCSS = {
                        position: _pinOptions.inFlow ? "relative" : "absolute",
                        top: 0,
                        left: 0
                    }, change = _util.css(pinTarget, "position") != newCSS.position;
                    if (!_pinOptions.pushFollowers) newCSS[containerInfo.vertical ? "top" : "left"] = _options.duration * _progress;
                    else if (_options.duration > 0) {
                        if (_state === SCENE_STATE_AFTER && parseFloat(_util.css(_pinOptions.spacer, "padding-top")) === 0) change = true; // if in after state but havent updated spacer yet (jumped past pin)
                        else if (_state === SCENE_STATE_BEFORE && parseFloat(_util.css(_pinOptions.spacer, "padding-bottom")) === 0) change = true; // jumped past fixed state upward direction
                    }
                    // set new values
                    _util.css(pinTarget, newCSS);
                    if (change) // update pin spacer if state changed
                    updatePinDimensions();
                }
            }
        };
        /**
		 * Update the pin spacer and/or element size.
		 * The size of the spacer needs to be updated whenever the duration of the scene changes, if it is to push down following elements.
		 * @private
		 */ var updatePinDimensions = function() {
            if (_pin && _controller && _pinOptions.inFlow) {
                var after = _state === SCENE_STATE_AFTER, before = _state === SCENE_STATE_BEFORE, during = _state === SCENE_STATE_DURING, vertical = _controller.info("vertical"), pinTarget = _pinOptions.spacer.firstChild, marginCollapse = _util.isMarginCollapseType(_util.css(_pinOptions.spacer, "display")), css = {};
                // set new size
                // if relsize: spacer -> pin | else: pin -> spacer
                if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
                    if (during) _util.css(_pin, {
                        "width": _util.get.width(_pinOptions.spacer)
                    });
                    else _util.css(_pin, {
                        "width": "100%"
                    });
                } else {
                    // minwidth is needed for cascaded pins.
                    css["min-width"] = _util.get.width(vertical ? _pin : pinTarget, true, true);
                    css.width = during ? css["min-width"] : "auto";
                }
                if (_pinOptions.relSize.height) {
                    if (during) // the only padding the spacer should ever include is the duration (if pushFollowers = true), so we need to substract that.
                    _util.css(_pin, {
                        "height": _util.get.height(_pinOptions.spacer) - (_pinOptions.pushFollowers ? _options.duration : 0)
                    });
                    else _util.css(_pin, {
                        "height": "100%"
                    });
                } else {
                    // margin is only included if it's a cascaded pin to resolve an IE9 bug
                    css["min-height"] = _util.get.height(vertical ? pinTarget : _pin, true, !marginCollapse); // needed for cascading pins
                    css.height = during ? css["min-height"] : "auto";
                }
                // add space for duration if pushFollowers is true
                if (_pinOptions.pushFollowers) {
                    css["padding" + (vertical ? "Top" : "Left")] = _options.duration * _progress;
                    css["padding" + (vertical ? "Bottom" : "Right")] = _options.duration * (1 - _progress);
                }
                _util.css(_pinOptions.spacer, css);
            }
        };
        /**
		 * Updates the Pin state (in certain scenarios)
		 * If the controller container is not the document and we are mid-pin-phase scrolling or resizing the main document can result to wrong pin positions.
		 * So this function is called on resize and scroll of the document.
		 * @private
		 */ var updatePinInContainer = function() {
            if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) updatePinState();
        };
        /**
		 * Updates the Pin spacer size state (in certain scenarios)
		 * If container is resized during pin and relatively sized the size of the pin might need to be updated...
		 * So this function is called on resize of the container.
		 * @private
		 */ var updateRelativePinSpacer = function() {
            if (_controller && _pin && // well, duh
            _state === SCENE_STATE_DURING && // element in pinned state?
            ((_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) && _util.get.width(window) != _util.get.width(_pinOptions.spacer.parentNode) || _pinOptions.relSize.height && _util.get.height(window) != _util.get.height(_pinOptions.spacer.parentNode))) updatePinDimensions();
        };
        /**
		 * Is called, when the mousewhel is used while over a pinned element inside a div container.
		 * If the scene is in fixed state scroll events would be counted towards the body. This forwards the event to the scroll container.
		 * @private
		 */ var onMousewheelOverPin = function(e) {
            if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) {
                e.preventDefault();
                _controller._setScrollPos(_controller.info("scrollPos") - ((e.wheelDelta || e[_controller.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || -e.detail * 30));
            }
        };
        /**
		 * Pin an element for the duration of the scene.
		 * If the scene duration is 0 the element will only be unpinned, if the user scrolls back past the start position.  
		 * Make sure only one pin is applied to an element at the same time.
		 * An element can be pinned multiple times, but only successively.
		 * _**NOTE:** The option `pushFollowers` has no effect, when the scene duration is 0._
		 * @method ScrollMagic.Scene#setPin
		 * @example
		 * // pin element and push all following elements down by the amount of the pin duration.
		 * scene.setPin("#pin");
		 *
		 * // pin element and keeping all following elements in their place. The pinned element will move past them.
		 * scene.setPin("#pin", {pushFollowers: false});
		 *
		 * @param {(string|object)} element - A Selector targeting an element or a DOM object that is supposed to be pinned.
		 * @param {object} [settings] - settings for the pin
		 * @param {boolean} [settings.pushFollowers=true] - If `true` following elements will be "pushed" down for the duration of the pin, if `false` the pinned element will just scroll past them.  
		 												   Ignored, when duration is `0`.
		 * @param {string} [settings.spacerClass="scrollmagic-pin-spacer"] - Classname of the pin spacer element, which is used to replace the element.
		 *
		 * @returns {Scene} Parent object for chaining.
		 */ this.setPin = function(element, settings) {
            var defaultSettings = {
                pushFollowers: true,
                spacerClass: "scrollmagic-pin-spacer"
            };
            var pushFollowersActivelySet = settings && settings.hasOwnProperty("pushFollowers");
            settings = _util.extend({}, defaultSettings, settings);
            // validate Element
            element = _util.get.elements(element)[0];
            if (!element) {
                log(1, "ERROR calling method 'setPin()': Invalid pin element supplied.");
                return Scene; // cancel
            } else if (_util.css(element, "position") === "fixed") {
                log(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'.");
                return Scene; // cancel
            }
            if (_pin) {
                if (_pin === element) // same pin we already have -> do nothing
                return Scene; // cancel
                else // kill old pin
                Scene.removePin();
            }
            _pin = element;
            var parentDisplay = _pin.parentNode.style.display, boundsParams = [
                "top",
                "left",
                "bottom",
                "right",
                "margin",
                "marginLeft",
                "marginRight",
                "marginTop",
                "marginBottom"
            ];
            _pin.parentNode.style.display = "none"; // hack start to force css to return stylesheet values instead of calculated px values.
            var inFlow = _util.css(_pin, "position") != "absolute", pinCSS = _util.css(_pin, boundsParams.concat([
                "display"
            ])), sizeCSS = _util.css(_pin, [
                "width",
                "height"
            ]);
            _pin.parentNode.style.display = parentDisplay; // hack end.
            if (!inFlow && settings.pushFollowers) {
                log(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled.");
                settings.pushFollowers = false;
            }
            window.setTimeout(function() {
                if (_pin && _options.duration === 0 && pushFollowersActivelySet && settings.pushFollowers) log(2, "WARNING: pushFollowers =", true, "has no effect, when scene duration is 0.");
            }, 0);
            // create spacer and insert
            var spacer = _pin.parentNode.insertBefore(document.createElement("div"), _pin), spacerCSS = _util.extend(pinCSS, {
                position: inFlow ? "relative" : "absolute",
                boxSizing: "content-box",
                mozBoxSizing: "content-box",
                webkitBoxSizing: "content-box"
            });
            if (!inFlow) _util.extend(spacerCSS, _util.css(_pin, [
                "width",
                "height"
            ]));
            _util.css(spacer, spacerCSS);
            spacer.setAttribute(PIN_SPACER_ATTRIBUTE, "");
            _util.addClass(spacer, settings.spacerClass);
            // set the pin Options
            _pinOptions = {
                spacer: spacer,
                relSize: {
                    width: sizeCSS.width.slice(-1) === "%",
                    height: sizeCSS.height.slice(-1) === "%",
                    autoFullWidth: sizeCSS.width === "auto" && inFlow && _util.isMarginCollapseType(pinCSS.display)
                },
                pushFollowers: settings.pushFollowers,
                inFlow: inFlow
            };
            if (!_pin.___origStyle) {
                _pin.___origStyle = {};
                var pinInlineCSS = _pin.style, copyStyles = boundsParams.concat([
                    "width",
                    "height",
                    "position",
                    "boxSizing",
                    "mozBoxSizing",
                    "webkitBoxSizing"
                ]);
                copyStyles.forEach(function(val) {
                    _pin.___origStyle[val] = pinInlineCSS[val] || "";
                });
            }
            // if relative size, transfer it to spacer and make pin calculate it...
            if (_pinOptions.relSize.width) _util.css(spacer, {
                width: sizeCSS.width
            });
            if (_pinOptions.relSize.height) _util.css(spacer, {
                height: sizeCSS.height
            });
            // now place the pin element inside the spacer	
            spacer.appendChild(_pin);
            // and set new css
            _util.css(_pin, {
                position: inFlow ? "relative" : "absolute",
                margin: "auto",
                top: "auto",
                left: "auto",
                bottom: "auto",
                right: "auto"
            });
            if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) _util.css(_pin, {
                boxSizing: "border-box",
                mozBoxSizing: "border-box",
                webkitBoxSizing: "border-box"
            });
            // add listener to document to update pin position in case controller is not the document.
            window.addEventListener("scroll", updatePinInContainer);
            window.addEventListener("resize", updatePinInContainer);
            window.addEventListener("resize", updateRelativePinSpacer);
            // add mousewheel listener to catch scrolls over fixed elements
            _pin.addEventListener("mousewheel", onMousewheelOverPin);
            _pin.addEventListener("DOMMouseScroll", onMousewheelOverPin);
            log(3, "added pin");
            // finally update the pin to init
            updatePinState();
            return Scene;
        };
        /**
		 * Remove the pin from the scene.
		 * @method ScrollMagic.Scene#removePin
		 * @example
		 * // remove the pin from the scene without resetting it (the spacer is not removed)
		 * scene.removePin();
		 *
		 * // remove the pin from the scene and reset the pin element to its initial position (spacer is removed)
		 * scene.removePin(true);
		 *
		 * @param {boolean} [reset=false] - If `false` the spacer will not be removed and the element's position will not be reset.
		 * @returns {Scene} Parent object for chaining.
		 */ this.removePin = function(reset) {
            if (_pin) {
                if (_state === SCENE_STATE_DURING) updatePinState(true); // force unpin at position
                if (reset || !_controller) {
                    var pinTarget = _pinOptions.spacer.firstChild; // usually the pin element, but may be another spacer (cascaded pins)...
                    if (pinTarget.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
                        var style = _pinOptions.spacer.style, values = [
                            "margin",
                            "marginLeft",
                            "marginRight",
                            "marginTop",
                            "marginBottom"
                        ], margins = {};
                        values.forEach(function(val) {
                            margins[val] = style[val] || "";
                        });
                        _util.css(pinTarget, margins);
                    }
                    _pinOptions.spacer.parentNode.insertBefore(pinTarget, _pinOptions.spacer);
                    _pinOptions.spacer.parentNode.removeChild(_pinOptions.spacer);
                    if (!_pin.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
                        // TODO: only correctly set for first pin (when cascading) - how to fix?
                        _util.css(_pin, _pin.___origStyle);
                        delete _pin.___origStyle;
                    }
                }
                window.removeEventListener("scroll", updatePinInContainer);
                window.removeEventListener("resize", updatePinInContainer);
                window.removeEventListener("resize", updateRelativePinSpacer);
                _pin.removeEventListener("mousewheel", onMousewheelOverPin);
                _pin.removeEventListener("DOMMouseScroll", onMousewheelOverPin);
                _pin = undefined;
                log(3, "removed pin (reset: " + (reset ? "true" : "false") + ")");
            }
            return Scene;
        };
        var _cssClasses, _cssClassElems = [];
        Scene.on("destroy.internal", function(e) {
            Scene.removeClassToggle(e.reset);
        });
        /**
		 * Define a css class modification while the scene is active.  
		 * When the scene triggers the classes will be added to the supplied element and removed, when the scene is over.
		 * If the scene duration is 0 the classes will only be removed if the user scrolls back past the start position.
		 * @method ScrollMagic.Scene#setClassToggle
		 * @example
		 * // add the class 'myclass' to the element with the id 'my-elem' for the duration of the scene
		 * scene.setClassToggle("#my-elem", "myclass");
		 *
		 * // add multiple classes to multiple elements defined by the selector '.classChange'
		 * scene.setClassToggle(".classChange", "class1 class2 class3");
		 *
		 * @param {(string|object)} element - A Selector targeting one or more elements or a DOM object that is supposed to be modified.
		 * @param {string} classes - One or more Classnames (separated by space) that should be added to the element during the scene.
		 *
		 * @returns {Scene} Parent object for chaining.
		 */ this.setClassToggle = function(element, classes) {
            var elems = _util.get.elements(element);
            if (elems.length === 0 || !_util.type.String(classes)) {
                log(1, "ERROR calling method 'setClassToggle()': Invalid " + (elems.length === 0 ? "element" : "classes") + " supplied.");
                return Scene;
            }
            if (_cssClassElems.length > 0) // remove old ones
            Scene.removeClassToggle();
            _cssClasses = classes;
            _cssClassElems = elems;
            Scene.on("enter.internal_class leave.internal_class", function(e) {
                var toggle = e.type === "enter" ? _util.addClass : _util.removeClass;
                _cssClassElems.forEach(function(elem, key) {
                    toggle(elem, _cssClasses);
                });
            });
            return Scene;
        };
        /**
		 * Remove the class binding from the scene.
		 * @method ScrollMagic.Scene#removeClassToggle
		 * @example
		 * // remove class binding from the scene without reset
		 * scene.removeClassToggle();
		 *
		 * // remove class binding and remove the changes it caused
		 * scene.removeClassToggle(true);
		 *
		 * @param {boolean} [reset=false] - If `false` and the classes are currently active, they will remain on the element. If `true` they will be removed.
		 * @returns {Scene} Parent object for chaining.
		 */ this.removeClassToggle = function(reset) {
            if (reset) _cssClassElems.forEach(function(elem, key) {
                _util.removeClass(elem, _cssClasses);
            });
            Scene.off("start.internal_class end.internal_class");
            _cssClasses = undefined;
            _cssClassElems = [];
            return Scene;
        };
        // INIT
        construct();
        return Scene;
    };
    // store pagewide scene options
    var SCENE_OPTIONS = {
        defaults: {
            duration: 0,
            offset: 0,
            triggerElement: undefined,
            triggerHook: 0.5,
            reverse: true,
            loglevel: 2
        },
        validate: {
            offset: function(val) {
                val = parseFloat(val);
                if (!_util.type.Number(val)) throw [
                    'Invalid value for option "offset":',
                    val
                ];
                return val;
            },
            triggerElement: function(val) {
                val = val || undefined;
                if (val) {
                    var elem = _util.get.elements(val)[0];
                    if (elem && elem.parentNode) val = elem;
                    else throw [
                        'Element defined in option "triggerElement" was not found:',
                        val
                    ];
                }
                return val;
            },
            triggerHook: function(val) {
                var translate = {
                    "onCenter": 0.5,
                    "onEnter": 1,
                    "onLeave": 0
                };
                if (_util.type.Number(val)) val = Math.max(0, Math.min(parseFloat(val), 1)); //  make sure its betweeen 0 and 1
                else if (val in translate) val = translate[val];
                else throw [
                    'Invalid value for option "triggerHook": ',
                    val
                ];
                return val;
            },
            reverse: function(val) {
                return !!val; // force boolean
            },
            loglevel: function(val) {
                val = parseInt(val);
                if (!_util.type.Number(val) || val < 0 || val > 3) throw [
                    'Invalid value for option "loglevel":',
                    val
                ];
                return val;
            }
        },
        shifts: [
            "duration",
            "offset",
            "triggerHook"
        ]
    };
    /*
	 * method used to add an option to ScrollMagic Scenes.
	 * TODO: DOC (private for dev)
	 */ ScrollMagic.Scene.addOption = function(name, defaultValue, validationCallback, shifts) {
        if (!(name in SCENE_OPTIONS.defaults)) {
            SCENE_OPTIONS.defaults[name] = defaultValue;
            SCENE_OPTIONS.validate[name] = validationCallback;
            if (shifts) SCENE_OPTIONS.shifts.push(name);
        } else ScrollMagic._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + name + "', because it already exists.");
    };
    // instance extension function for plugins
    // TODO: DOC (private for dev)
    ScrollMagic.Scene.extend = function(extension) {
        var oldClass = this;
        ScrollMagic.Scene = function() {
            oldClass.apply(this, arguments);
            this.$super = _util.extend({}, this); // copy parent state
            return extension.apply(this, arguments) || this;
        };
        _util.extend(ScrollMagic.Scene, oldClass); // copy properties
        ScrollMagic.Scene.prototype = oldClass.prototype; // copy prototype
        ScrollMagic.Scene.prototype.constructor = ScrollMagic.Scene; // restore constructor
    };
    /**
	 * TODO: DOCS (private for dev)
	 * @class
	 * @private
	 */ ScrollMagic.Event = function(type, namespace, target, vars) {
        vars = vars || {};
        for(var key in vars)this[key] = vars[key];
        this.type = type;
        this.target = this.currentTarget = target;
        this.namespace = namespace || "";
        this.timeStamp = this.timestamp = Date.now();
        return this;
    };
    /*
	 * TODO: DOCS (private for dev)
	 */ var _util = ScrollMagic._util = function(window1) {
        var U = {}, i;
        /**
		 * ------------------------------
		 * internal helpers
		 * ------------------------------
		 */ // parse float and fall back to 0.
        var floatval = function(number) {
            return parseFloat(number) || 0;
        };
        // get current style IE safe (otherwise IE would return calculated values for 'auto')
        var _getComputedStyle = function(elem) {
            return elem.currentStyle ? elem.currentStyle : window1.getComputedStyle(elem);
        };
        // get element dimension (width or height)
        var _dimension = function(which, elem, outer, includeMargin) {
            elem = elem === document ? window1 : elem;
            if (elem === window1) includeMargin = false;
            else if (!_type.DomElement(elem)) return 0;
            which = which.charAt(0).toUpperCase() + which.substr(1).toLowerCase();
            var dimension = (outer ? elem["offset" + which] || elem["outer" + which] : elem["client" + which] || elem["inner" + which]) || 0;
            if (outer && includeMargin) {
                var style = _getComputedStyle(elem);
                dimension += which === "Height" ? floatval(style.marginTop) + floatval(style.marginBottom) : floatval(style.marginLeft) + floatval(style.marginRight);
            }
            return dimension;
        };
        // converts 'margin-top' into 'marginTop'
        var _camelCase = function(str) {
            return str.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function(g) {
                return g[1].toUpperCase();
            });
        };
        /**
		 * ------------------------------
		 * external helpers
		 * ------------------------------
		 */ // extend obj – same as jQuery.extend({}, objA, objB)
        U.extend = function(obj) {
            obj = obj || {};
            for(i = 1; i < arguments.length; i++){
                if (!arguments[i]) continue;
                for(var key in arguments[i])if (arguments[i].hasOwnProperty(key)) obj[key] = arguments[i][key];
            }
            return obj;
        };
        // check if a css display type results in margin-collapse or not
        U.isMarginCollapseType = function(str) {
            return [
                "block",
                "flex",
                "list-item",
                "table",
                "-webkit-box"
            ].indexOf(str) > -1;
        };
        // implementation of requestAnimationFrame
        // based on https://gist.github.com/paulirish/1579671
        var lastTime = 0, vendors = [
            "ms",
            "moz",
            "webkit",
            "o"
        ];
        var _requestAnimationFrame = window1.requestAnimationFrame;
        var _cancelAnimationFrame = window1.cancelAnimationFrame;
        // try vendor prefixes if the above doesn't work
        for(i = 0; !_requestAnimationFrame && i < vendors.length; ++i){
            _requestAnimationFrame = window1[vendors[i] + "RequestAnimationFrame"];
            _cancelAnimationFrame = window1[vendors[i] + "CancelAnimationFrame"] || window1[vendors[i] + "CancelRequestAnimationFrame"];
        }
        // fallbacks
        if (!_requestAnimationFrame) _requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime(), timeToCall = Math.max(0, 16 - (currTime - lastTime)), id = window1.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
        if (!_cancelAnimationFrame) _cancelAnimationFrame = function(id) {
            window1.clearTimeout(id);
        };
        U.rAF = _requestAnimationFrame.bind(window1);
        U.cAF = _cancelAnimationFrame.bind(window1);
        var loglevels = [
            "error",
            "warn",
            "log"
        ], console = window1.console || {};
        console.log = console.log || function() {}; // no console log, well - do nothing then...
        // make sure methods for all levels exist.
        for(i = 0; i < loglevels.length; i++){
            var method = loglevels[i];
            if (!console[method]) console[method] = console.log; // prefer .log over nothing
        }
        U.log = function(loglevel) {
            if (loglevel > loglevels.length || loglevel <= 0) loglevel = loglevels.length;
            var now = new Date(), time = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2) + ":" + ("00" + now.getMilliseconds()).slice(-3), method = loglevels[loglevel - 1], args = Array.prototype.splice.call(arguments, 1), func = Function.prototype.bind.call(console[method], console);
            args.unshift(time);
            func.apply(console, args);
        };
        /**
		 * ------------------------------
		 * type testing
		 * ------------------------------
		 */ var _type = U.type = function(v) {
            return Object.prototype.toString.call(v).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
        };
        _type.String = function(v) {
            return _type(v) === "string";
        };
        _type.Function = function(v) {
            return _type(v) === "function";
        };
        _type.Array = function(v) {
            return Array.isArray(v);
        };
        _type.Number = function(v) {
            return !_type.Array(v) && v - parseFloat(v) + 1 >= 0;
        };
        _type.DomElement = function(o) {
            return typeof HTMLElement === "object" || typeof HTMLElement === "function" ? o instanceof HTMLElement || o instanceof SVGElement : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
        };
        /**
		 * ------------------------------
		 * DOM Element info
		 * ------------------------------
		 */ // always returns a list of matching DOM elements, from a selector, a DOM element or an list of elements or even an array of selectors
        var _get = U.get = {};
        _get.elements = function(selector) {
            var arr = [];
            if (_type.String(selector)) try {
                selector = document.querySelectorAll(selector);
            } catch (e) {
                return arr;
            }
            if (_type(selector) === "nodelist" || _type.Array(selector) || selector instanceof NodeList) for(var i = 0, ref = arr.length = selector.length; i < ref; i++){
                var elem = selector[i];
                arr[i] = _type.DomElement(elem) ? elem : _get.elements(elem); // if not an element, try to resolve recursively
            }
            else if (_type.DomElement(selector) || selector === document || selector === window1) arr = [
                selector
            ]; // only the element
            return arr;
        };
        // get scroll top value
        _get.scrollTop = function(elem) {
            return elem && typeof elem.scrollTop === "number" ? elem.scrollTop : window1.pageYOffset || 0;
        };
        // get scroll left value
        _get.scrollLeft = function(elem) {
            return elem && typeof elem.scrollLeft === "number" ? elem.scrollLeft : window1.pageXOffset || 0;
        };
        // get element height
        _get.width = function(elem, outer, includeMargin) {
            return _dimension("width", elem, outer, includeMargin);
        };
        // get element width
        _get.height = function(elem, outer, includeMargin) {
            return _dimension("height", elem, outer, includeMargin);
        };
        // get element position (optionally relative to viewport)
        _get.offset = function(elem, relativeToViewport) {
            var offset = {
                top: 0,
                left: 0
            };
            if (elem && elem.getBoundingClientRect) {
                var rect = elem.getBoundingClientRect();
                offset.top = rect.top;
                offset.left = rect.left;
                if (!relativeToViewport) {
                    offset.top += _get.scrollTop();
                    offset.left += _get.scrollLeft();
                }
            }
            return offset;
        };
        /**
		 * ------------------------------
		 * DOM Element manipulation
		 * ------------------------------
		 */ U.addClass = function(elem, classname) {
            if (classname) {
                if (elem.classList) elem.classList.add(classname);
                else elem.className += " " + classname;
            }
        };
        U.removeClass = function(elem, classname) {
            if (classname) {
                if (elem.classList) elem.classList.remove(classname);
                else elem.className = elem.className.replace(new RegExp("(^|\\b)" + classname.split(" ").join("|") + "(\\b|$)", "gi"), " ");
            }
        };
        // if options is string -> returns css value
        // if options is array -> returns object with css value pairs
        // if options is object -> set new css values
        U.css = function(elem, options) {
            if (_type.String(options)) return _getComputedStyle(elem)[_camelCase(options)];
            else if (_type.Array(options)) {
                var obj = {}, style = _getComputedStyle(elem);
                options.forEach(function(option, key) {
                    obj[option] = style[_camelCase(option)];
                });
                return obj;
            } else for(var option in options){
                var val = options[option];
                if (val == parseFloat(val)) val += "px";
                elem.style[_camelCase(option)] = val;
            }
        };
        return U;
    }(window || {});
    ScrollMagic.Scene.prototype.addIndicators = function() {
        ScrollMagic._util.log(1, "(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js");
        return this;
    };
    ScrollMagic.Scene.prototype.removeIndicators = function() {
        ScrollMagic._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js");
        return this;
    };
    ScrollMagic.Scene.prototype.setTween = function() {
        ScrollMagic._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js");
        return this;
    };
    ScrollMagic.Scene.prototype.removeTween = function() {
        ScrollMagic._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js");
        return this;
    };
    ScrollMagic.Scene.prototype.setVelocity = function() {
        ScrollMagic._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js");
        return this;
    };
    ScrollMagic.Scene.prototype.removeVelocity = function() {
        ScrollMagic._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js");
        return this;
    };
    return ScrollMagic;
});

},{}],"77jB6":[function(require,module,exports) {
(function(global, factory) {
    module.exports = factory();
})(this, function() {
    "use strict";
    var root = document;
    var createText = root.createTextNode.bind(root);
    /**
 * # setProperty
 * Apply a CSS var
 * @param {HTMLElement} el
 * @param {string} varName 
 * @param {string|number} value 
 */ function setProperty(el, varName, value) {
        el.style.setProperty(varName, value);
    }
    /**
 * 
 * @param {!HTMLElement} el 
 * @param {!HTMLElement} child 
 */ function appendChild(el, child) {
        return el.appendChild(child);
    }
    /**
 * 
 * @param {!HTMLElement} parent 
 * @param {string} key 
 * @param {string} text 
 * @param {boolean} whitespace 
 */ function createElement(parent, key, text, whitespace) {
        var el = root.createElement("span");
        key && (el.className = key);
        if (text) {
            !whitespace && el.setAttribute("data-" + key, text);
            el.textContent = text;
        }
        return parent && appendChild(parent, el) || el;
    }
    /**
 * 
 * @param {!HTMLElement} el 
 * @param {string} key 
 */ function getData(el, key) {
        return el.getAttribute("data-" + key);
    }
    /**
 * 
 * @param {import('../types').Target} e 
 * @param {!HTMLElement} parent
 * @returns {!Array<!HTMLElement>}
 */ function $(e, parent) {
        return !e || e.length == 0 ? [] : e.nodeName ? [
            e
        ] : [].slice.call(e[0].nodeName ? e : (parent || root).querySelectorAll(e));
    }
    /**
 * Creates and fills an array with the value provided
 * @param {number} len
 * @param {() => T} valueProvider
 * @return {T}
 * @template T
 */ function Array2D(len) {
        var a = [];
        for(; len--;)a[len] = [];
        return a;
    }
    /**
 * A for loop wrapper used to reduce js minified size.
 * @param {!Array<T>} items 
 * @param {function(T):void} consumer
 * @template T
 */ function each(items, consumer) {
        items && items.some(consumer);
    }
    /**
 * @param {T} obj 
 * @return {function(string):*}
 * @template T
 */ function selectFrom(obj) {
        return function(key) {
            return obj[key];
        };
    }
    /**
 * # Splitting.index
 * Index split elements and add them to a Splitting instance.
 *
 * @param {HTMLElement} element
 * @param {string} key 
 * @param {!Array<!HTMLElement> | !Array<!Array<!HTMLElement>>} items 
 */ function index(element, key, items) {
        var prefix = "--" + key;
        var cssVar = prefix + "-index";
        each(items, function(items, i) {
            if (Array.isArray(items)) each(items, function(item) {
                setProperty(item, cssVar, i);
            });
            else setProperty(items, cssVar, i);
        });
        setProperty(element, prefix + "-total", items.length);
    }
    /**
 * @type {Record<string, import('./types').ISplittingPlugin>}
 */ var plugins = {};
    /**
 * @param {string} by
 * @param {string} parent
 * @param {!Array<string>} deps
 * @return {!Array<string>}
 */ function resolvePlugins(by, parent, deps) {
        // skip if already visited this dependency
        var index = deps.indexOf(by);
        if (index == -1) {
            // if new to dependency array, add to the beginning
            deps.unshift(by);
            // recursively call this function for all dependencies
            var plugin = plugins[by];
            if (!plugin) throw new Error("plugin not loaded: " + by);
            each(plugin.depends, function(p) {
                resolvePlugins(p, by, deps);
            });
        } else {
            // if this dependency was added already move to the left of
            // the parent dependency so it gets loaded in order
            var indexOfParent = deps.indexOf(parent);
            deps.splice(index, 1);
            deps.splice(indexOfParent, 0, by);
        }
        return deps;
    }
    /**
 * Internal utility for creating plugins... essentially to reduce
 * the size of the library
 * @param {string} by 
 * @param {string} key 
 * @param {string[]} depends 
 * @param {Function} split 
 * @returns {import('./types').ISplittingPlugin}
 */ function createPlugin(by, depends, key, split) {
        return {
            by: by,
            depends: depends,
            key: key,
            split: split
        };
    }
    /**
 *
 * @param {string} by
 * @returns {import('./types').ISplittingPlugin[]}
 */ function resolve(by) {
        return resolvePlugins(by, 0, []).map(selectFrom(plugins));
    }
    /**
 * Adds a new plugin to splitting
 * @param {import('./types').ISplittingPlugin} opts
 */ function add(opts) {
        plugins[opts.by] = opts;
    }
    /**
 * # Splitting.split
 * Split an element's textContent into individual elements
 * @param {!HTMLElement} el  Element to split
 * @param {string} key 
 * @param {string} splitOn 
 * @param {boolean} includePrevious 
 * @param {boolean} preserveWhitespace
 * @return {!Array<!HTMLElement>}
 */ function splitText(el, key, splitOn, includePrevious, preserveWhitespace) {
        // Combine any strange text nodes or empty whitespace.
        el.normalize();
        // Use fragment to prevent unnecessary DOM thrashing.
        var elements = [];
        var F = document.createDocumentFragment();
        if (includePrevious) elements.push(el.previousSibling);
        var allElements = [];
        $(el.childNodes).some(function(next) {
            if (next.tagName && !next.hasChildNodes()) {
                // keep elements without child nodes (no text and no children)
                allElements.push(next);
                return;
            }
            // Recursively run through child nodes
            if (next.childNodes && next.childNodes.length) {
                allElements.push(next);
                elements.push.apply(elements, splitText(next, key, splitOn, includePrevious, preserveWhitespace));
                return;
            }
            // Get the text to split, trimming out the whitespace
            /** @type {string} */ var wholeText = next.wholeText || "";
            var contents = wholeText.trim();
            // If there's no text left after trimming whitespace, continue the loop
            if (contents.length) {
                // insert leading space if there was one
                if (wholeText[0] === " ") allElements.push(createText(" "));
                // Concatenate the split text children back into the full array
                var useSegmenter = splitOn === "" && typeof Intl.Segmenter === "function";
                each(useSegmenter ? Array.from(new Intl.Segmenter().segment(contents)).map(function(x) {
                    return x.segment;
                }) : contents.split(splitOn), function(splitText, i) {
                    if (i && preserveWhitespace) allElements.push(createElement(F, "whitespace", " ", preserveWhitespace));
                    var splitEl = createElement(F, key, splitText);
                    elements.push(splitEl);
                    allElements.push(splitEl);
                });
                // insert trailing space if there was one
                if (wholeText[wholeText.length - 1] === " ") allElements.push(createText(" "));
            }
        });
        each(allElements, function(el) {
            appendChild(F, el);
        });
        // Clear out the existing element
        el.innerHTML = "";
        appendChild(el, F);
        return elements;
    }
    /** an empty value */ var _ = 0;
    function copy(dest, src) {
        for(var k in src)dest[k] = src[k];
        return dest;
    }
    var WORDS = "words";
    var wordPlugin = createPlugin(/* by= */ WORDS, /* depends= */ _, /* key= */ "word", /* split= */ function(el) {
        return splitText(el, "word", /\s+/, 0, 1);
    });
    var CHARS = "chars";
    var charPlugin = createPlugin(/* by= */ CHARS, /* depends= */ [
        WORDS
    ], /* key= */ "char", /* split= */ function(el, options, ctx) {
        var results = [];
        each(ctx[WORDS], function(word, i) {
            results.push.apply(results, splitText(word, "char", "", options.whitespace && i));
        });
        return results;
    });
    /**
 * # Splitting
 * 
 * @param {import('./types').ISplittingOptions} opts
 * @return {!Array<*>}
 */ function Splitting(opts) {
        opts = opts || {};
        var key = opts.key;
        return $(opts.target || "[data-splitting]").map(function(el) {
            var ctx = el["\uD83C\uDF4C"];
            if (!opts.force && ctx) return ctx;
            ctx = el["\uD83C\uDF4C"] = {
                el: el
            };
            var by = opts.by || getData(el, "splitting");
            if (!by || by == "true") by = CHARS;
            var items = resolve(by);
            var opts2 = copy({}, opts);
            each(items, function(plugin) {
                if (plugin.split) {
                    var pluginBy = plugin.by;
                    var key2 = (key ? "-" + key : "") + plugin.key;
                    var results = plugin.split(el, opts2, ctx);
                    key2 && index(el, key2, results);
                    ctx[pluginBy] = results;
                    el.classList.add(pluginBy);
                }
            });
            el.classList.add("splitting");
            return ctx;
        });
    }
    /**
 * # Splitting.html
 * 
 * @param {import('./types').ISplittingOptions} opts
 */ function html(opts) {
        opts = opts || {};
        var parent = opts.target = createElement();
        parent.innerHTML = opts.content;
        Splitting(opts);
        return parent.outerHTML;
    }
    Splitting.html = html;
    Splitting.add = add;
    /**
 * Detects the grid by measuring which elements align to a side of it.
 * @param {!HTMLElement} el 
 * @param {import('../core/types').ISplittingOptions} options
 * @param {*} side 
 */ function detectGrid(el, options, side) {
        var items = $(options.matching || el.children, el);
        var c = {};
        each(items, function(w) {
            var val = Math.round(w[side]);
            (c[val] || (c[val] = [])).push(w);
        });
        return Object.keys(c).map(Number).sort(byNumber).map(selectFrom(c));
    }
    /**
 * Sorting function for numbers.
 * @param {number} a 
 * @param {number} b
 * @return {number} 
 */ function byNumber(a, b) {
        return a - b;
    }
    var linePlugin = createPlugin(/* by= */ "lines", /* depends= */ [
        WORDS
    ], /* key= */ "line", /* split= */ function(el, options, ctx) {
        return detectGrid(el, {
            matching: ctx[WORDS]
        }, "offsetTop");
    });
    var itemPlugin = createPlugin(/* by= */ "items", /* depends= */ _, /* key= */ "item", /* split= */ function(el, options) {
        return $(options.matching || el.children, el);
    });
    var rowPlugin = createPlugin(/* by= */ "rows", /* depends= */ _, /* key= */ "row", /* split= */ function(el, options) {
        return detectGrid(el, options, "offsetTop");
    });
    var columnPlugin = createPlugin(/* by= */ "cols", /* depends= */ _, /* key= */ "col", /* split= */ function(el, options) {
        return detectGrid(el, options, "offsetLeft");
    });
    var gridPlugin = createPlugin(/* by= */ "grid", /* depends= */ [
        "rows",
        "cols"
    ]);
    var LAYOUT = "layout";
    var layoutPlugin = createPlugin(/* by= */ LAYOUT, /* depends= */ _, /* key= */ _, /* split= */ function(el, opts) {
        // detect and set options
        var rows = opts.rows = +(opts.rows || getData(el, "rows") || 1);
        var columns = opts.columns = +(opts.columns || getData(el, "columns") || 1);
        // Seek out the first <img> if the value is true 
        opts.image = opts.image || getData(el, "image") || el.currentSrc || el.src;
        if (opts.image) {
            var img = $("img", el)[0];
            opts.image = img && (img.currentSrc || img.src);
        }
        // add optional image to background
        if (opts.image) setProperty(el, "background-image", "url(" + opts.image + ")");
        var totalCells = rows * columns;
        var elements = [];
        var container = createElement(_, "cell-grid");
        while(totalCells--){
            // Create a span
            var cell = createElement(container, "cell");
            createElement(cell, "cell-inner");
            elements.push(cell);
        }
        // Append elements back into the parent
        appendChild(el, container);
        return elements;
    });
    var cellRowPlugin = createPlugin(/* by= */ "cellRows", /* depends= */ [
        LAYOUT
    ], /* key= */ "row", /* split= */ function(el, opts, ctx) {
        var rowCount = opts.rows;
        var result = Array2D(rowCount);
        each(ctx[LAYOUT], function(cell, i, src) {
            result[Math.floor(i / (src.length / rowCount))].push(cell);
        });
        return result;
    });
    var cellColumnPlugin = createPlugin(/* by= */ "cellColumns", /* depends= */ [
        LAYOUT
    ], /* key= */ "col", /* split= */ function(el, opts, ctx) {
        var columnCount = opts.columns;
        var result = Array2D(columnCount);
        each(ctx[LAYOUT], function(cell, i) {
            result[i % columnCount].push(cell);
        });
        return result;
    });
    var cellPlugin = createPlugin(/* by= */ "cells", /* depends= */ [
        "cellRows",
        "cellColumns"
    ], /* key= */ "cell", /* split= */ function(el, opt, ctx) {
        // re-index the layout as the cells
        return ctx[LAYOUT];
    });
    // install plugins
    // word/char plugins
    add(wordPlugin);
    add(charPlugin);
    add(linePlugin);
    // grid plugins
    add(itemPlugin);
    add(rowPlugin);
    add(columnPlugin);
    add(gridPlugin);
    // cell-layout plugins
    add(layoutPlugin);
    add(cellRowPlugin);
    add(cellColumnPlugin);
    add(cellPlugin);
    return Splitting;
});

},{}]},["9tETL","h05Z6"], "h05Z6", "parcelRequire86c2")

//# sourceMappingURL=index.8109ac08.js.map
