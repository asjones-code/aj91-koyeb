// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  distDir,
  publicUrl,
  devServer
) {
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

  var importMap = previousRequire.i || {};
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
        globalObject
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
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

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
    }
  }
})({"hTkpg":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "d6ad1f56a8e1416d";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
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
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
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
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            if (err.message) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
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
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
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
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
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
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
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
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
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
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
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
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
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
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
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
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
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
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"7ZQXK":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _core = require("@barba/core");
var _coreDefault = parcelHelpers.interopDefault(_core);
var _gsap = require("gsap");
var _customEase = require("gsap/CustomEase");
var _scrollTrigger = require("gsap/ScrollTrigger");
var _lenis = require("lenis");
var _lenisDefault = parcelHelpers.interopDefault(_lenis);
var _splitting = require("splitting");
var _splittingDefault = parcelHelpers.interopDefault(_splitting);
(0, _gsap.gsap).registerPlugin((0, _customEase.CustomEase), (0, _scrollTrigger.ScrollTrigger));
// Lenis smooth scroll – keeps scroll-linked effects (e.g. work header pinch) from jittering
const lenis = new (0, _lenisDefault.default)({
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
lenis.on("scroll", (e)=>{
    (0, _scrollTrigger.ScrollTrigger).update(e);
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
(0, _gsap.gsap).ticker.add((time)=>lenis.raf(time * 1000));
(0, _gsap.gsap).ticker.lagSmoothing(0);
(0, _customEase.CustomEase).create("stutterEase", "M0,0 C0,0 0.052,0.1 0.152,0.1 0.242,0.1 0.299,0.349 0.399,0.349 0.586,0.349 0.569,0.596 0.67,0.624 0.842,0.671 0.95,0.95 1,1");
// Sine wave shadow effect for logo text based on loading progress
let logoProgress = 0;
function initLogoMouseEffect() {
    const word = document.querySelector(".logo-text");
    if (!word) return;
    const updateTransform = ()=>{
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
    const updateLoop = ()=>{
        updateTransform();
        requestAnimationFrame(updateLoop);
    };
    updateLoop();
}
function updateLogoProgress(progress) {
    logoProgress = progress;
}
const textAnimations = {
    logoAnimation: (el)=>{
        // Just make the text visible, no SplitText effect
        (0, _gsap.gsap).set(el, {
            visibility: "visible"
        });
    },
    headerAnimation: (el)=>{
        const [ctx] = (0, _splittingDefault.default)({
            target: el,
            by: "chars"
        });
        if (!ctx?.chars?.length) {
            (0, _gsap.gsap).set(el, {
                visibility: "visible"
            });
            return;
        }
        (0, _gsap.gsap).from(ctx.chars, {
            xPercent: -100,
            ease: "power2.inOut",
            stagger: {
                each: 0.02,
                from: "random"
            },
            duration: 0.5
        });
    },
    bodyAnimation: (el)=>{
        const [ctx] = (0, _splittingDefault.default)({
            target: el,
            by: "lines"
        });
        if (!ctx?.lines?.length) {
            (0, _gsap.gsap).set(el, {
                visibility: "visible"
            });
            return;
        }
        (0, _gsap.gsap).from(ctx.lines, {
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
    document.fonts.ready.then(()=>{
        (0, _gsap.gsap).set(el, {
            visibility: "visible"
        });
        const animType = document.querySelector(el).dataset.textAnim;
        const animFunc = textAnimations[animType];
        console.log(animFunc);
        if (animFunc) animFunc(el);
    });
}
function preloaderAnimation() {
    let tl = (0, _gsap.gsap).timeline({
        onUpdate: function() {
            // Update logo progress based on timeline progress
            updateLogoProgress(this.progress());
        }
    });
    tl.call(animateText, [
        ".logo-text"
    ]).to(".preloader-bg", {
        scaleX: 1,
        ease: "stutterEase",
        duration: 2.8
    }).to(".preloader-mask", {
        "--preloader-mask-size": "600%",
        duration: 1.4,
        ease: "expoScale(0.5,7,power1.in)"
    }).to(".preloader-bg, .preloader-logo, .preloader-progress-bar", {
        opacity: 0,
        duration: 0.85,
        ease: "power2.inOut"
    }, "<").to(".hero-globe-wrap", {
        scale: 1,
        duration: 2.85,
        ease: "expoScale(0.5,7,power1.out)"
    }, "<");
    return tl;
}
function heroAnimation() {
    let tl = (0, _gsap.gsap).timeline();
    tl.fromTo("[data-fade-in]", {
        filter: "blur(30px)",
        opacity: 0,
        yPercent: (index, element)=>{
            return element.getAttribute("data-fade-in") === "down" ? -100 : 0;
        },
        xPercent: (index, element)=>{
            return element.getAttribute("data-fade-in") === "left" ? 100 : 0;
        }
    }, {
        yPercent: 0,
        xPercent: 0,
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.25,
        ease: "power4.inOut",
        stagger: 0.08
    }, "<-.25").call(animateText, [
        "h1"
    ], "<.55").call(animateText, [
        ".sub-title"
    ], "-=.75");
    return tl;
}
// Initialize mouse effect as soon as DOM is ready
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initLogoMouseEffect);
else initLogoMouseEffect();
function initTerminal() {
    // Load tinycli (terminal with commands; about/work are clickable links)
    require("c2f389049d47a126").then((m)=>m.initTinycli());
}
// Resize in real time: progress 0→1 over this scroll distance (driven by Lenis in scroll callback)
const WORK_HEADER_SCROLL_END_PX = 120;
function initStickyHeader() {
// is-scrolled driven by smoothed progress only (navTick non-work, Lenis callback work)
}
/**
 * Work page: sync header pinch state to current scroll when entering; pinch is driven in Lenis scroll callback.
 */ function initWorkHeaderPinch() {
    const header = document.querySelector(".header");
    if (!header || !document.body.classList.contains("page-is-work")) return;
    const raw = Math.max(0, Math.min(1, lenis.scroll / WORK_HEADER_SCROLL_END_PX));
    workHeaderSmoothedP = raw;
    header.style.setProperty("--work-header-pinch", String(smoothstep(raw)));
    // Clear navTick-driven inline styles so work page CSS (pinch/::before) controls the header
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
    const isMobile = ()=>window.matchMedia("(max-width: 768px)").matches;
    const menuEase = "power2.inOut";
    const menuDuration = {
        open: 0.65,
        close: 0.5
    };
    let isOpen = false;
    /** @type {{ top: number; left: number; width: number; height: number } | null} */ let savedTerminalRect = null;
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
        const tl = (0, _gsap.gsap).timeline({
            defaults: {
                ease: "power2.inOut"
            },
            onComplete: ()=>{
                document.body.style.overflow = "auto";
            }
        });
        if (isMobile() && contentMain && terminalWrap) {
            const terminalEl = terminalWrap.querySelector("#terminal");
            const d = menuDuration.open;
            // Freeze hero-content height so when terminal goes fixed, text doesn't drop
            if (heroContent) heroContent.style.minHeight = `${heroContent.offsetHeight}px`;
            // Capture terminal position/size before we change anything (for smooth open + reverse on close)
            const rect = terminalWrap.getBoundingClientRect();
            savedTerminalRect = {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            };
            // Globe: scale down 20%
            if (heroImg) tl.to(heroImg, {
                scale: 0.8,
                duration: d,
                ease: menuEase
            }, 0);
            // Text: swipe out upwards from current position (no reflow = no teleport)
            tl.to(contentMain, {
                y: -140,
                opacity: 0,
                pointerEvents: "none",
                duration: d * 0.7,
                ease: "power2.in"
            }, 0);
            // Terminal: smooth animation from current position/size to top-third card (position + size)
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
                top: "10%",
                left: "50%",
                xPercent: -50,
                width: "90%",
                maxWidth: 320,
                height: "32vh",
                maxHeight: "32vh",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                duration: d,
                ease: menuEase
            }, 0).to(terminalEl, {
                height: "100%",
                duration: d * 0.65,
                ease: menuEase
            }, 0.05).fromTo(navRail, {
                x: "-100%",
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: d * 0.85,
                ease: menuEase
            }, 0.1).fromTo(menuCardsWrap, {
                x: "100%",
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: d * 0.85,
                ease: menuEase
            }, 0.16);
        } else tl.to(heroSection, {
            scale: 0.3,
            duration: 0.6
        }, 0).fromTo(navRail, {
            x: "-100%",
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.5
        }, 0.1).fromTo(menuCardsWrap, {
            x: "100%",
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.5
        }, 0.15);
    }
    function closeMenu() {
        if (!isOpen) return;
        isOpen = false;
        document.body.style.overflow = "hidden";
        const onComplete = ()=>{
            toggle.classList.remove("active");
            document.body.classList.remove("menu-open");
            layout.classList.remove("menu-open");
            toggle.setAttribute("aria-expanded", "false");
            navRail?.setAttribute("aria-hidden", "true");
            menuCardsWrap?.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "auto";
            (0, _gsap.gsap).set([
                heroSection,
                navRail,
                menuCardsWrap
            ], {
                clearProps: "transform,opacity"
            });
            if (heroImg) (0, _gsap.gsap).set(heroImg, {
                clearProps: "transform"
            });
            if (heroContent) heroContent.style.minHeight = "";
            if (terminalWrap) {
                (0, _gsap.gsap).set(terminalWrap, {
                    clearProps: "all"
                });
                const inner = terminalWrap.querySelector("#terminal");
                if (inner) (0, _gsap.gsap).set(inner, {
                    clearProps: "height"
                });
            }
            if (contentMain) (0, _gsap.gsap).set(contentMain, {
                clearProps: "opacity,pointerEvents,y"
            });
        };
        const tl = (0, _gsap.gsap).timeline({
            defaults: {
                ease: menuEase
            },
            onComplete
        });
        const dc = menuDuration.close;
        if (isMobile() && contentMain && terminalWrap) {
            // Globe: scale back to 1
            if (heroImg) tl.to(heroImg, {
                scale: 1,
                duration: dc,
                ease: menuEase
            }, 0);
            // Terminal: reverse of open – animate position and size back to saved rect (inner height in px so resize interpolates)
            if (savedTerminalRect) {
                const terminalEl = terminalWrap.querySelector("#terminal");
                const dur = dc * 0.85;
                tl.to(terminalEl, {
                    height: savedTerminalRect.height,
                    duration: dur,
                    ease: menuEase
                }, 0);
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
            tl.to(menuCardsWrap, {
                x: "100%",
                opacity: 0,
                duration: dc * 0.8,
                ease: menuEase
            }, 0).to(navRail, {
                x: "-100%",
                opacity: 0,
                duration: dc * 0.8,
                ease: menuEase
            }, 0.05);
            // Text: swipe back in from above
            tl.fromTo(contentMain, {
                y: -140,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                pointerEvents: "auto",
                duration: dc * 0.75,
                ease: "power2.out"
            }, dc * 0.2);
        } else tl.to(menuCardsWrap, {
            x: "100%",
            opacity: 0,
            duration: 0.35
        }).to(navRail, {
            x: "-100%",
            opacity: 0,
            duration: 0.35
        }, "-=0.2").to(heroSection, {
            scale: 1,
            duration: 0.5
        }, "-=0.4");
    }
    toggle.addEventListener("click", ()=>{
        if (isOpen) closeMenu();
        else openMenu();
    });
    // Close menu when clicking the header logo ("aj91") so it doesn’t stay open on home
    const headerLogo = document.querySelector(".header-logo");
    if (headerLogo) headerLogo.addEventListener("click", ()=>{
        if (isOpen) closeMenu();
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
const REST_SCROLL_PX = 55; // start easing to rest when within this many px of top
const REST_VEL_PX_S = 70; // consider "low velocity" so we enter zone while still coasting up
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
 */ function navBaselineFromPosition(scrollY) {
    const rawP = Math.max(0, Math.min(1, scrollY / NAV_SCROLL_END_PX));
    const scrollingUp = rawP < navSmoothedP;
    const nearTop = scrollY < NAV_NEAR_TOP_PX;
    const t = nearTop ? 1 - scrollY / NAV_NEAR_TOP_PX : 0; // 0 at 90px, 1 at 0
    const lerp = scrollingUp && nearTop ? NAV_POS_LERP_UP + (NAV_POS_LERP_UP_NEAR_TOP - NAV_POS_LERP_UP) * t : scrollingUp ? NAV_POS_LERP_UP : NAV_POS_LERP_DOWN;
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
 */ function navTransientFromVelocity(velocityPxPerSec) {
    const directionFlip = velocityPxPerSec * navSmoothedVel < 0;
    if (directionFlip) navSmoothedVel *= 1 - NAV_VEL_DECAY_FLIP;
    else navSmoothedVel += (velocityPxPerSec - navSmoothedVel) * NAV_VEL_DECAY;
    const absVel = Math.abs(navSmoothedVel);
    if (absVel < NAV_VEL_EPSILON) {
        navSmoothedVel = 0;
        return {
            scaleX: 0,
            y: 0
        };
    }
    const v = navSmoothedVel * smoothstep(Math.min(1, absVel / 120));
    const scaleDelta = -Math.min(NAV_TRANSIENT_SCALE_CAP, Math.abs(v) * NAV_VEL_SCALE_IMPACT);
    const yDelta = Math.max(-NAV_TRANSIENT_Y_CAP, Math.min(NAV_TRANSIENT_Y_CAP, v * NAV_VEL_Y_IMPACT));
    return {
        scaleX: scaleDelta,
        y: yDelta
    };
}
/**
 * Run inside Lenis RAF loop (GSAP ticker). Transforms the header (the bar), not the inner nav.
 * Header y = slide (-8 → 0 when scrolled) + baseline.y + transient.y. quickSetter = no double smoothing.
 */ function navTick() {
    if (document.body.classList.contains("page-is-work")) return; // work page uses its own header transform (pinch)
    const inner = document.querySelector(".header-inner");
    if (!inner) return;
    if (inner !== navLastHeader) {
        navLastHeader = inner;
        navSetX = (0, _gsap.gsap).quickSetter(inner, "x");
        navSetScaleX = (0, _gsap.gsap).quickSetter(inner, "scaleX");
        navSetY = (0, _gsap.gsap).quickSetter(inner, "y");
        (0, _gsap.gsap).set(inner, {
            transformOrigin: "50% 0"
        });
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
    } else navRestBlend = 0;
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
        if (header !== navLastHeaderEl) {
            navLastHeaderEl = header;
            navSetHeaderOpacity = (0, _gsap.gsap).quickSetter(header, "opacity");
            navSetHeaderMargin = (0, _gsap.gsap).quickSetter(header, "marginTop");
        }
        if (navSetHeaderOpacity && navSetHeaderMargin) {
            navSetHeaderOpacity(0.95 + 0.05 * headerScrollP);
            navSetHeaderMargin(`${12 * headerScrollP}px`);
            header.style.background = `rgba(37, 32, 28, ${0.75 * headerScrollP})`;
            header.style.backdropFilter = `blur(${12 * headerScrollP}px)`;
            header.style.webkitBackdropFilter = `blur(${12 * headerScrollP}px)`;
            header.style.boxShadow = `0 4px 24px rgba(0, 0, 0, ${0.2 * headerScrollP})`;
            header.style.borderRadius = `${9999 * headerScrollP}px`;
        }
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
    (0, _gsap.gsap).set(inner, {
        x: 0,
        scaleX: 1 - p * NAV_BASELINE_SCALE,
        y: slideY - p * NAV_BASELINE_Y_PX,
        transformOrigin: "50% 0"
    });
    const header = inner.closest(".header");
    if (header) {
        header.style.opacity = String(0.95 + 0.05 * p);
        header.style.marginTop = `${12 * p}px`;
        header.style.background = `rgba(37, 32, 28, ${0.75 * p})`;
        header.style.backdropFilter = `blur(${12 * p}px)`;
        header.style.webkitBackdropFilter = `blur(${12 * p}px)`;
        header.style.boxShadow = `0 4px 24px rgba(0, 0, 0, ${0.2 * p})`;
        header.style.borderRadius = `${9999 * p}px`;
        if (p > 0.02) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
    }
    if (!window.__navTickBound) {
        window.__navTickBound = true;
        (0, _gsap.gsap).ticker.add(navTick);
    }
}
let hasRunIntro = false;
function runPageInit() {
    initStickyHeader();
    initMenuToggle();
    initNavIndicator();
}
(0, _coreDefault.default).init({
    transitions: [
        {
            name: "default",
            leave ({ current }) {
                document.body.classList.remove("menu-open");
                const layout = document.getElementById("layout-morph");
                if (layout) layout.classList.remove("menu-open");
                if (current.container.getAttribute("data-barba-namespace") === "work") killWorkHeaderPinch();
                return (0, _gsap.gsap).to(current.container, {
                    opacity: 0,
                    duration: 0.25,
                    ease: "power2.inOut"
                });
            },
            enter ({ next }) {
                return (0, _gsap.gsap).fromTo(next.container, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 0.35,
                    ease: "power2.inOut"
                });
            }
        }
    ],
    views: []
});
(0, _coreDefault.default).hooks.after((data)=>{
    lenis.resize();
    runPageInit();
    // Body class for work page (header max-width 50% when scrolled)
    document.body.classList.remove("page-is-work");
    if (data.next.namespace === "work") {
        document.body.classList.add("page-is-work");
        // TOC is only in work.html; when we arrive via Barba the script didn’t run, so generate it
        require("76213d29b45178e4");
        // Ensure the work container is visible (transition can leave it hidden)
        data.next.container.style.opacity = "1";
        // Smooth scroll-linked header pinch (100% → 50% by scroll %)
        requestAnimationFrame(()=>initWorkHeaderPinch());
    }
    // When navigating back to home (e.g. from About), run the same intro as initial load
    if (data.next.namespace === "home") {
        const introTimeline = (0, _gsap.gsap).timeline();
        const preloaderTl = preloaderAnimation();
        const heroTl = heroAnimation();
        introTimeline.add(preloaderTl).add(heroTl, "-=2.4");
        initTerminal();
        // Re-mount the globe into the new .hero-globe-wrap (script only runs once on load)
        window.dispatchEvent(new CustomEvent("hero-globe-mount"));
    }
});
window.addEventListener("load", ()=>{
    if (!hasRunIntro && document.querySelector("[data-barba-namespace='home']")) {
        const introTimeline = (0, _gsap.gsap).timeline();
        const preloaderTl = preloaderAnimation();
        const heroTl = heroAnimation();
        introTimeline.add(preloaderTl).add(heroTl, "-=2.4");
        initTerminal();
        hasRunIntro = true;
    }
    runPageInit();
    if (document.querySelector("[data-barba-namespace='work']")) {
        document.body.classList.add("page-is-work");
        initWorkHeaderPinch();
    }
});

},{"@barba/core":"pKfSe","gsap":"9F7Z6","gsap/CustomEase":"1ObMh","gsap/ScrollTrigger":"372oo","lenis":"kcpn5","splitting":"6m3bh","c2f389049d47a126":"8N00J","76213d29b45178e4":"bMYMi","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"pKfSe":[function(require,module,exports,__globalThis) {
!function(t, n) {
    module.exports = n();
}(this, function() {
    function t(t, n) {
        for(var r = 0; r < n.length; r++){
            var i = n[r];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, "symbol" == typeof (e = function(t, n) {
                if ("object" != typeof t || null === t) return t;
                var r = t[Symbol.toPrimitive];
                if (void 0 !== r) {
                    var i = r.call(t, "string");
                    if ("object" != typeof i) return i;
                    throw new TypeError("@@toPrimitive must return a primitive value.");
                }
                return String(t);
            }(i.key)) ? e : String(e), i);
        }
        var e;
    }
    function n(n, r, i) {
        return r && t(n.prototype, r), i && t(n, i), Object.defineProperty(n, "prototype", {
            writable: !1
        }), n;
    }
    function r() {
        return r = Object.assign ? Object.assign.bind() : function(t) {
            for(var n = 1; n < arguments.length; n++){
                var r = arguments[n];
                for(var i in r)Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
            }
            return t;
        }, r.apply(this, arguments);
    }
    function i(t, n) {
        t.prototype = Object.create(n.prototype), t.prototype.constructor = t, o(t, n);
    }
    function e(t) {
        return e = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t);
        }, e(t);
    }
    function o(t, n) {
        return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, n) {
            return t.__proto__ = n, t;
        }, o(t, n);
    }
    function u() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (t) {
            return !1;
        }
    }
    function s(t, n, r) {
        return s = u() ? Reflect.construct.bind() : function(t, n, r) {
            var i = [
                null
            ];
            i.push.apply(i, n);
            var e = new (Function.bind.apply(t, i));
            return r && o(e, r.prototype), e;
        }, s.apply(null, arguments);
    }
    function f(t) {
        var n = "function" == typeof Map ? new Map : void 0;
        return f = function(t) {
            if (null === t || -1 === Function.toString.call(t).indexOf("[native code]")) return t;
            if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== n) {
                if (n.has(t)) return n.get(t);
                n.set(t, r);
            }
            function r() {
                return s(t, arguments, e(this).constructor);
            }
            return r.prototype = Object.create(t.prototype, {
                constructor: {
                    value: r,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), o(r, t);
        }, f(t);
    }
    function c(t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
    }
    var a, h = function() {
        this.before = void 0, this.beforeLeave = void 0, this.leave = void 0, this.afterLeave = void 0, this.beforeEnter = void 0, this.enter = void 0, this.afterEnter = void 0, this.after = void 0;
    };
    !function(t) {
        t[t.off = 0] = "off", t[t.error = 1] = "error", t[t.warning = 2] = "warning", t[t.info = 3] = "info", t[t.debug = 4] = "debug";
    }(a || (a = {}));
    var v = a.off, d = /*#__PURE__*/ function() {
        function t(t) {
            this.t = void 0, this.t = t;
        }
        t.getLevel = function() {
            return v;
        }, t.setLevel = function(t) {
            return v = a[t];
        };
        var n = t.prototype;
        return n.error = function() {
            this.i(console.error, a.error, [].slice.call(arguments));
        }, n.warn = function() {
            this.i(console.warn, a.warning, [].slice.call(arguments));
        }, n.info = function() {
            this.i(console.info, a.info, [].slice.call(arguments));
        }, n.debug = function() {
            this.i(console.log, a.debug, [].slice.call(arguments));
        }, n.i = function(n, r, i) {
            r <= t.getLevel() && n.apply(console, [
                "[" + this.t + "] "
            ].concat(i));
        }, t;
    }();
    function l(t) {
        return t.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }
    function p(t) {
        return t && t.sensitive ? "" : "i";
    }
    var m = {
        container: "container",
        history: "history",
        namespace: "namespace",
        prefix: "data-barba",
        prevent: "prevent",
        wrapper: "wrapper"
    }, w = /*#__PURE__*/ function() {
        function t() {
            this.o = m, this.u = void 0, this.h = {
                after: null,
                before: null,
                parent: null
            };
        }
        var n = t.prototype;
        return n.toString = function(t) {
            return t.outerHTML;
        }, n.toDocument = function(t) {
            return this.u || (this.u = new DOMParser), this.u.parseFromString(t, "text/html");
        }, n.toElement = function(t) {
            var n = document.createElement("div");
            return n.innerHTML = t, n;
        }, n.getHtml = function(t) {
            return void 0 === t && (t = document), this.toString(t.documentElement);
        }, n.getWrapper = function(t) {
            return void 0 === t && (t = document), t.querySelector("[" + this.o.prefix + '="' + this.o.wrapper + '"]');
        }, n.getContainer = function(t) {
            return void 0 === t && (t = document), t.querySelector("[" + this.o.prefix + '="' + this.o.container + '"]');
        }, n.removeContainer = function(t) {
            document.body.contains(t) && (this.v(t), t.parentNode.removeChild(t));
        }, n.addContainer = function(t, n) {
            var r = this.getContainer() || this.h.before;
            r ? this.l(t, r) : this.h.after ? this.h.after.parentNode.insertBefore(t, this.h.after) : this.h.parent ? this.h.parent.appendChild(t) : n.appendChild(t);
        }, n.getSibling = function() {
            return this.h;
        }, n.getNamespace = function(t) {
            void 0 === t && (t = document);
            var n = t.querySelector("[" + this.o.prefix + "-" + this.o.namespace + "]");
            return n ? n.getAttribute(this.o.prefix + "-" + this.o.namespace) : null;
        }, n.getHref = function(t) {
            if (t.tagName && "a" === t.tagName.toLowerCase()) {
                if ("string" == typeof t.href) return t.href;
                var n = t.getAttribute("href") || t.getAttribute("xlink:href");
                if (n) return this.resolveUrl(n.baseVal || n);
            }
            return null;
        }, n.resolveUrl = function() {
            var t = [].slice.call(arguments).length;
            if (0 === t) throw new Error("resolveUrl requires at least one argument; got none.");
            var n = document.createElement("base");
            if (n.href = arguments[0], 1 === t) return n.href;
            var r = document.getElementsByTagName("head")[0];
            r.insertBefore(n, r.firstChild);
            for(var i, e = document.createElement("a"), o = 1; o < t; o++)e.href = arguments[o], n.href = i = e.href;
            return r.removeChild(n), i;
        }, n.l = function(t, n) {
            n.parentNode.insertBefore(t, n.nextSibling);
        }, n.v = function(t) {
            return this.h = {
                after: t.nextElementSibling,
                before: t.previousElementSibling,
                parent: t.parentElement
            }, this.h;
        }, t;
    }(), b = new w, y = /*#__PURE__*/ function() {
        function t() {
            this.p = void 0, this.m = [], this.P = -1;
        }
        var i = t.prototype;
        return i.init = function(t, n) {
            this.p = "barba";
            var r = {
                data: {},
                ns: n,
                scroll: {
                    x: window.scrollX,
                    y: window.scrollY
                },
                url: t
            };
            this.P = 0, this.m.push(r);
            var i = {
                from: this.p,
                index: this.P,
                states: [].concat(this.m)
            };
            window.history && window.history.replaceState(i, "", t);
        }, i.change = function(t, n, r) {
            if (r && r.state) {
                var i = r.state, e = i.index;
                n = this.g(this.P - e), this.replace(i.states), this.P = e;
            } else this.add(t, n);
            return n;
        }, i.add = function(t, n, r, i) {
            var e = null != r ? r : this.R(n), o = {
                data: null != i ? i : {},
                ns: "tmp",
                scroll: {
                    x: window.scrollX,
                    y: window.scrollY
                },
                url: t
            };
            switch(e){
                case "push":
                    this.P = this.size, this.m.push(o);
                    break;
                case "replace":
                    this.set(this.P, o);
            }
            var u = {
                from: this.p,
                index: this.P,
                states: [].concat(this.m)
            };
            switch(e){
                case "push":
                    window.history && window.history.pushState(u, "", t);
                    break;
                case "replace":
                    window.history && window.history.replaceState(u, "", t);
            }
        }, i.store = function(t, n) {
            var i = n || this.P, e = this.get(i);
            e.data = r({}, e.data, t), this.set(i, e);
            var o = {
                from: this.p,
                index: this.P,
                states: [].concat(this.m)
            };
            window.history.replaceState(o, "");
        }, i.update = function(t, n) {
            var i = n || this.P, e = r({}, this.get(i), t);
            this.set(i, e);
        }, i.remove = function(t) {
            t ? this.m.splice(t, 1) : this.m.pop(), this.P--;
        }, i.clear = function() {
            this.m = [], this.P = -1;
        }, i.replace = function(t) {
            this.m = t;
        }, i.get = function(t) {
            return this.m[t];
        }, i.set = function(t, n) {
            return this.m[t] = n;
        }, i.R = function(t) {
            var n = "push", r = t, i = m.prefix + "-" + m.history;
            return r.hasAttribute && r.hasAttribute(i) && (n = r.getAttribute(i)), n;
        }, i.g = function(t) {
            return Math.abs(t) > 1 ? t > 0 ? "forward" : "back" : 0 === t ? "popstate" : t > 0 ? "back" : "forward";
        }, n(t, [
            {
                key: "current",
                get: function() {
                    return this.m[this.P];
                }
            },
            {
                key: "previous",
                get: function() {
                    return this.P < 1 ? null : this.m[this.P - 1];
                }
            },
            {
                key: "size",
                get: function() {
                    return this.m.length;
                }
            }
        ]), t;
    }(), P = new y, g = function(t, n) {
        try {
            var r = function() {
                if (!n.next.html) return Promise.resolve(t).then(function(t) {
                    var r = n.next;
                    if (t) {
                        var i = b.toElement(t.html);
                        r.namespace = b.getNamespace(i), r.container = b.getContainer(i), r.url = t.url, r.html = t.html, P.update({
                            ns: r.namespace
                        });
                        var e = b.toDocument(t.html);
                        document.title = e.title;
                    }
                });
            }();
            return Promise.resolve(r && r.then ? r.then(function() {}) : void 0);
        } catch (t) {
            return Promise.reject(t);
        }
    }, E = function t(n, r, i) {
        return n instanceof RegExp ? function(t, n) {
            if (!n) return t;
            for(var r = /\((?:\?<(.*?)>)?(?!\?)/g, i = 0, e = r.exec(t.source); e;)n.push({
                name: e[1] || i++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            }), e = r.exec(t.source);
            return t;
        }(n, r) : Array.isArray(n) ? function(n, r, i) {
            var e = n.map(function(n) {
                return t(n, r, i).source;
            });
            return new RegExp("(?:".concat(e.join("|"), ")"), p(i));
        }(n, r, i) : function(t, n, r) {
            return function(t, n, r) {
                void 0 === r && (r = {});
                for(var i = r.strict, e = void 0 !== i && i, o = r.start, u = void 0 === o || o, s = r.end, f = void 0 === s || s, c = r.encode, a = void 0 === c ? function(t) {
                    return t;
                } : c, h = r.delimiter, v = void 0 === h ? "/#?" : h, d = r.endsWith, m = "[".concat(l(void 0 === d ? "" : d), "]|$"), w = "[".concat(l(v), "]"), b = u ? "^" : "", y = 0, P = t; y < P.length; y++){
                    var g = P[y];
                    if ("string" == typeof g) b += l(a(g));
                    else {
                        var E = l(a(g.prefix)), x = l(a(g.suffix));
                        if (g.pattern) {
                            if (n && n.push(g), E || x) {
                                if ("+" === g.modifier || "*" === g.modifier) {
                                    var R = "*" === g.modifier ? "?" : "";
                                    b += "(?:".concat(E, "((?:").concat(g.pattern, ")(?:").concat(x).concat(E, "(?:").concat(g.pattern, "))*)").concat(x, ")").concat(R);
                                } else b += "(?:".concat(E, "(").concat(g.pattern, ")").concat(x, ")").concat(g.modifier);
                            } else b += "+" === g.modifier || "*" === g.modifier ? "((?:".concat(g.pattern, ")").concat(g.modifier, ")") : "(".concat(g.pattern, ")").concat(g.modifier);
                        } else b += "(?:".concat(E).concat(x, ")").concat(g.modifier);
                    }
                }
                if (f) e || (b += "".concat(w, "?")), b += r.endsWith ? "(?=".concat(m, ")") : "$";
                else {
                    var k = t[t.length - 1], O = "string" == typeof k ? w.indexOf(k[k.length - 1]) > -1 : void 0 === k;
                    e || (b += "(?:".concat(w, "(?=").concat(m, "))?")), O || (b += "(?=".concat(w, "|").concat(m, ")"));
                }
                return new RegExp(b, p(r));
            }(function(t, n) {
                void 0 === n && (n = {});
                for(var r = function(t) {
                    for(var n = [], r = 0; r < t.length;){
                        var i = t[r];
                        if ("*" !== i && "+" !== i && "?" !== i) {
                            if ("\\" !== i) {
                                if ("{" !== i) {
                                    if ("}" !== i) {
                                        if (":" !== i) {
                                            if ("(" !== i) n.push({
                                                type: "CHAR",
                                                index: r,
                                                value: t[r++]
                                            });
                                            else {
                                                var e = 1, o = "";
                                                if ("?" === t[s = r + 1]) throw new TypeError('Pattern cannot start with "?" at '.concat(s));
                                                for(; s < t.length;)if ("\\" !== t[s]) {
                                                    if (")" === t[s]) {
                                                        if (0 == --e) {
                                                            s++;
                                                            break;
                                                        }
                                                    } else if ("(" === t[s] && (e++, "?" !== t[s + 1])) throw new TypeError("Capturing groups are not allowed at ".concat(s));
                                                    o += t[s++];
                                                } else o += t[s++] + t[s++];
                                                if (e) throw new TypeError("Unbalanced pattern at ".concat(r));
                                                if (!o) throw new TypeError("Missing pattern at ".concat(r));
                                                n.push({
                                                    type: "PATTERN",
                                                    index: r,
                                                    value: o
                                                }), r = s;
                                            }
                                        } else {
                                            for(var u = "", s = r + 1; s < t.length;){
                                                var f = t.charCodeAt(s);
                                                if (!(f >= 48 && f <= 57 || f >= 65 && f <= 90 || f >= 97 && f <= 122 || 95 === f)) break;
                                                u += t[s++];
                                            }
                                            if (!u) throw new TypeError("Missing parameter name at ".concat(r));
                                            n.push({
                                                type: "NAME",
                                                index: r,
                                                value: u
                                            }), r = s;
                                        }
                                    } else n.push({
                                        type: "CLOSE",
                                        index: r,
                                        value: t[r++]
                                    });
                                } else n.push({
                                    type: "OPEN",
                                    index: r,
                                    value: t[r++]
                                });
                            } else n.push({
                                type: "ESCAPED_CHAR",
                                index: r++,
                                value: t[r++]
                            });
                        } else n.push({
                            type: "MODIFIER",
                            index: r,
                            value: t[r++]
                        });
                    }
                    return n.push({
                        type: "END",
                        index: r,
                        value: ""
                    }), n;
                }(t), i = n.prefixes, e = void 0 === i ? "./" : i, o = "[^".concat(l(n.delimiter || "/#?"), "]+?"), u = [], s = 0, f = 0, c = "", a = function(t) {
                    if (f < r.length && r[f].type === t) return r[f++].value;
                }, h = function(t) {
                    var n = a(t);
                    if (void 0 !== n) return n;
                    var i = r[f], e = i.index;
                    throw new TypeError("Unexpected ".concat(i.type, " at ").concat(e, ", expected ").concat(t));
                }, v = function() {
                    for(var t, n = ""; t = a("CHAR") || a("ESCAPED_CHAR");)n += t;
                    return n;
                }; f < r.length;){
                    var d = a("CHAR"), p = a("NAME"), m = a("PATTERN");
                    if (p || m) -1 === e.indexOf(b = d || "") && (c += b, b = ""), c && (u.push(c), c = ""), u.push({
                        name: p || s++,
                        prefix: b,
                        suffix: "",
                        pattern: m || o,
                        modifier: a("MODIFIER") || ""
                    });
                    else {
                        var w = d || a("ESCAPED_CHAR");
                        if (w) c += w;
                        else if (c && (u.push(c), c = ""), a("OPEN")) {
                            var b = v(), y = a("NAME") || "", P = a("PATTERN") || "", g = v();
                            h("CLOSE"), u.push({
                                name: y || (P ? s++ : ""),
                                pattern: y && !P ? o : P,
                                prefix: b,
                                suffix: g,
                                modifier: a("MODIFIER") || ""
                            });
                        } else h("END");
                    }
                }
                return u;
            }(t, r), n, r);
        }(n, r, i);
    }, x = {
        __proto__: null,
        update: g,
        nextTick: function() {
            return new Promise(function(t) {
                window.requestAnimationFrame(t);
            });
        },
        pathToRegexp: E
    }, R = function() {
        return window.location.origin;
    }, k = function(t) {
        return void 0 === t && (t = window.location.href), O(t).port;
    }, O = function(t) {
        var n, r = t.match(/:\d+/);
        if (null === r) /^http/.test(t) && (n = 80), /^https/.test(t) && (n = 443);
        else {
            var i = r[0].substring(1);
            n = parseInt(i, 10);
        }
        var e, o = t.replace(R(), ""), u = {}, s = o.indexOf("#");
        s >= 0 && (e = o.slice(s + 1), o = o.slice(0, s));
        var f = o.indexOf("?");
        return f >= 0 && (u = T(o.slice(f + 1)), o = o.slice(0, f)), {
            hash: e,
            path: o,
            port: n,
            query: u
        };
    }, T = function(t) {
        return t.split("&").reduce(function(t, n) {
            var r = n.split("=");
            return t[r[0]] = r[1], t;
        }, {});
    }, A = function(t) {
        return void 0 === t && (t = window.location.href), t.replace(/(\/#.*|\/|#.*)$/, "");
    }, j = {
        __proto__: null,
        getHref: function() {
            return window.location.href;
        },
        getAbsoluteHref: function(t, n) {
            return void 0 === n && (n = document.baseURI), new URL(t, n).href;
        },
        getOrigin: R,
        getPort: k,
        getPath: function(t) {
            return void 0 === t && (t = window.location.href), O(t).path;
        },
        getQuery: function(t, n) {
            return void 0 === n && (n = !1), n ? JSON.stringify(O(t).query) : O(t).query;
        },
        getHash: function(t) {
            return O(t).hash;
        },
        parse: O,
        parseQuery: T,
        clean: A
    };
    function M(t, n, i, e, o) {
        return void 0 === n && (n = 2e3), new Promise(function(u, s) {
            var f = new XMLHttpRequest;
            f.onreadystatechange = function() {
                if (f.readyState === XMLHttpRequest.DONE) {
                    if (200 === f.status) {
                        var n = "" !== f.responseURL && f.responseURL !== t ? f.responseURL : t;
                        u({
                            html: f.responseText,
                            url: r({
                                href: n
                            }, O(n))
                        }), e.update(t, {
                            status: "fulfilled",
                            target: n
                        });
                    } else if (f.status) {
                        var o = {
                            status: f.status,
                            statusText: f.statusText
                        };
                        i(t, o), s(o), e.update(t, {
                            status: "rejected"
                        });
                    }
                }
            }, f.ontimeout = function() {
                var r = new Error("Timeout error [" + n + "]");
                i(t, r), s(r), e.update(t, {
                    status: "rejected"
                });
            }, f.onerror = function() {
                var n = new Error("Fetch error");
                i(t, n), s(n), e.update(t, {
                    status: "rejected"
                });
            }, f.open("GET", t), f.timeout = n, f.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml"), f.setRequestHeader("x-barba", "yes"), o.all().forEach(function(t, n) {
                f.setRequestHeader(n, t);
            }), f.send();
        });
    }
    function N(t) {
        return !!t && ("object" == typeof t || "function" == typeof t) && "function" == typeof t.then;
    }
    function S(t, n) {
        return void 0 === n && (n = {}), function() {
            var r = arguments, i = !1, e = new Promise(function(e, o) {
                n.async = function() {
                    return i = !0, function(t, n) {
                        t ? o(t) : e(n);
                    };
                };
                var u = t.apply(n, [].slice.call(r));
                i || (N(u) ? u.then(e, o) : e(u));
            });
            return e;
        };
    }
    var C = /*#__PURE__*/ function(t) {
        function n() {
            var n;
            return (n = t.call(this) || this).logger = new d("@barba/core"), n.all = [
                "ready",
                "page",
                "reset",
                "currentAdded",
                "currentRemoved",
                "nextAdded",
                "nextRemoved",
                "beforeOnce",
                "once",
                "afterOnce",
                "before",
                "beforeLeave",
                "leave",
                "afterLeave",
                "beforeEnter",
                "enter",
                "afterEnter",
                "after"
            ], n.registered = new Map, n.init(), n;
        }
        i(n, t);
        var r = n.prototype;
        return r.init = function() {
            var t = this;
            this.registered.clear(), this.all.forEach(function(n) {
                t[n] || (t[n] = function(r, i) {
                    t.registered.has(n) || t.registered.set(n, new Set), t.registered.get(n).add({
                        ctx: i || {},
                        fn: r
                    });
                });
            });
        }, r.do = function(t) {
            var n = arguments, r = this;
            if (this.registered.has(t)) {
                var i = Promise.resolve();
                return this.registered.get(t).forEach(function(t) {
                    i = i.then(function() {
                        return S(t.fn, t.ctx).apply(void 0, [].slice.call(n, 1));
                    });
                }), i.catch(function(n) {
                    r.logger.debug("Hook error [" + t + "]"), r.logger.error(n);
                });
            }
            return Promise.resolve();
        }, r.clear = function() {
            var t = this;
            this.all.forEach(function(n) {
                delete t[n];
            }), this.init();
        }, r.help = function() {
            this.logger.info("Available hooks: " + this.all.join(","));
            var t = [];
            this.registered.forEach(function(n, r) {
                return t.push(r);
            }), this.logger.info("Registered hooks: " + t.join(","));
        }, n;
    }(h), L = new C, H = /*#__PURE__*/ function() {
        function t(t) {
            if (this.k = void 0, this.O = [], "boolean" == typeof t) this.k = t;
            else {
                var n = Array.isArray(t) ? t : [
                    t
                ];
                this.O = n.map(function(t) {
                    return E(t);
                });
            }
        }
        return t.prototype.checkHref = function(t) {
            if ("boolean" == typeof this.k) return this.k;
            var n = O(t).path;
            return this.O.some(function(t) {
                return null !== t.exec(n);
            });
        }, t;
    }(), _ = /*#__PURE__*/ function(t) {
        function n(n) {
            var r;
            return (r = t.call(this, n) || this).T = new Map, r;
        }
        i(n, t);
        var e = n.prototype;
        return e.set = function(t, n, r, i, e) {
            return this.T.set(t, {
                action: r,
                request: n,
                status: i,
                target: null != e ? e : t
            }), {
                action: r,
                request: n,
                status: i,
                target: e
            };
        }, e.get = function(t) {
            return this.T.get(t);
        }, e.getRequest = function(t) {
            return this.T.get(t).request;
        }, e.getAction = function(t) {
            return this.T.get(t).action;
        }, e.getStatus = function(t) {
            return this.T.get(t).status;
        }, e.getTarget = function(t) {
            return this.T.get(t).target;
        }, e.has = function(t) {
            return !this.checkHref(t) && this.T.has(t);
        }, e.delete = function(t) {
            return this.T.delete(t);
        }, e.update = function(t, n) {
            var i = r({}, this.T.get(t), n);
            return this.T.set(t, i), i;
        }, n;
    }(H), D = /*#__PURE__*/ function() {
        function t() {
            this.A = new Map;
        }
        var n = t.prototype;
        return n.set = function(t, n) {
            return this.A.set(t, n), {
                name: n
            };
        }, n.get = function(t) {
            return this.A.get(t);
        }, n.all = function() {
            return this.A;
        }, n.has = function(t) {
            return this.A.has(t);
        }, n.delete = function(t) {
            return this.A.delete(t);
        }, n.clear = function() {
            return this.A.clear();
        }, t;
    }(), B = function() {
        return !window.history.pushState;
    }, q = function(t) {
        return !t.el || !t.href;
    }, F = function(t) {
        var n = t.event;
        return n.which > 1 || n.metaKey || n.ctrlKey || n.shiftKey || n.altKey;
    }, I = function(t) {
        var n = t.el;
        return n.hasAttribute("target") && "_blank" === n.target;
    }, U = function(t) {
        var n = t.el;
        return void 0 !== n.protocol && window.location.protocol !== n.protocol || void 0 !== n.hostname && window.location.hostname !== n.hostname;
    }, $ = function(t) {
        var n = t.el;
        return void 0 !== n.port && k() !== k(n.href);
    }, Q = function(t) {
        var n = t.el;
        return n.getAttribute && "string" == typeof n.getAttribute("download");
    }, X = function(t) {
        return t.el.hasAttribute(m.prefix + "-" + m.prevent);
    }, z = function(t) {
        return Boolean(t.el.closest("[" + m.prefix + "-" + m.prevent + '="all"]'));
    }, G = function(t) {
        var n = t.href;
        return A(n) === A() && k(n) === k();
    }, J = /*#__PURE__*/ function(t) {
        function n(n) {
            var r;
            return (r = t.call(this, n) || this).suite = [], r.tests = new Map, r.init(), r;
        }
        i(n, t);
        var r = n.prototype;
        return r.init = function() {
            this.add("pushState", B), this.add("exists", q), this.add("newTab", F), this.add("blank", I), this.add("corsDomain", U), this.add("corsPort", $), this.add("download", Q), this.add("preventSelf", X), this.add("preventAll", z), this.add("sameUrl", G, !1);
        }, r.add = function(t, n, r) {
            void 0 === r && (r = !0), this.tests.set(t, n), r && this.suite.push(t);
        }, r.run = function(t, n, r, i) {
            return this.tests.get(t)({
                el: n,
                event: r,
                href: i
            });
        }, r.checkLink = function(t, n, r) {
            var i = this;
            return this.suite.some(function(e) {
                return i.run(e, t, n, r);
            });
        }, n;
    }(H), W = /*#__PURE__*/ function(t) {
        function n(r, i) {
            var e;
            return void 0 === i && (i = "Barba error"), (e = t.call.apply(t, [
                this
            ].concat([].slice.call(arguments, 2))) || this).error = void 0, e.label = void 0, e.error = r, e.label = i, Error.captureStackTrace && Error.captureStackTrace(c(e), n), e.name = "BarbaError", e;
        }
        return i(n, t), n;
    }(/*#__PURE__*/ f(Error)), K = /*#__PURE__*/ function() {
        function t(t) {
            void 0 === t && (t = []), this.logger = new d("@barba/core"), this.all = [], this.page = [], this.once = [], this.j = [
                {
                    name: "namespace",
                    type: "strings"
                },
                {
                    name: "custom",
                    type: "function"
                }
            ], t && (this.all = this.all.concat(t)), this.update();
        }
        var n = t.prototype;
        return n.add = function(t, n) {
            "rule" === t ? this.j.splice(n.position || 0, 0, n.value) : this.all.push(n), this.update();
        }, n.resolve = function(t, n) {
            var r = this;
            void 0 === n && (n = {});
            var i = n.once ? this.once : this.page;
            i = i.filter(n.self ? function(t) {
                return t.name && "self" === t.name;
            } : function(t) {
                return !t.name || "self" !== t.name;
            });
            var e = new Map, o = i.find(function(i) {
                var o = !0, u = {};
                return n.self && "self" === i.name ? (e.set(i, u), !0) : (r.j.reverse().forEach(function(n) {
                    o && (o = r.M(i, n, t, u), i.from && i.to && (o = r.M(i, n, t, u, "from") && r.M(i, n, t, u, "to")), i.from && !i.to && (o = r.M(i, n, t, u, "from")), !i.from && i.to && (o = r.M(i, n, t, u, "to")));
                }), e.set(i, u), o);
            }), u = e.get(o), s = [];
            if (s.push(n.once ? "once" : "page"), n.self && s.push("self"), u) {
                var f, c = [
                    o
                ];
                Object.keys(u).length > 0 && c.push(u), (f = this.logger).info.apply(f, [
                    "Transition found [" + s.join(",") + "]"
                ].concat(c));
            } else this.logger.info("No transition found [" + s.join(",") + "]");
            return o;
        }, n.update = function() {
            var t = this;
            this.all = this.all.map(function(n) {
                return t.N(n);
            }).sort(function(t, n) {
                return t.priority - n.priority;
            }).reverse().map(function(t) {
                return delete t.priority, t;
            }), this.page = this.all.filter(function(t) {
                return void 0 !== t.leave || void 0 !== t.enter;
            }), this.once = this.all.filter(function(t) {
                return void 0 !== t.once;
            });
        }, n.M = function(t, n, r, i, e) {
            var o = !0, u = !1, s = t, f = n.name, c = f, a = f, h = f, v = e ? s[e] : s, d = "to" === e ? r.next : r.current;
            if (e ? v && v[f] : v[f]) {
                switch(n.type){
                    case "strings":
                    default:
                        var l = Array.isArray(v[c]) ? v[c] : [
                            v[c]
                        ];
                        d[c] && -1 !== l.indexOf(d[c]) && (u = !0), -1 === l.indexOf(d[c]) && (o = !1);
                        break;
                    case "object":
                        var p = Array.isArray(v[a]) ? v[a] : [
                            v[a]
                        ];
                        d[a] ? (d[a].name && -1 !== p.indexOf(d[a].name) && (u = !0), -1 === p.indexOf(d[a].name) && (o = !1)) : o = !1;
                        break;
                    case "function":
                        v[h](r) ? u = !0 : o = !1;
                }
                u && (e ? (i[e] = i[e] || {}, i[e][f] = s[e][f]) : i[f] = s[f]);
            }
            return o;
        }, n.S = function(t, n, r) {
            var i = 0;
            return (t[n] || t.from && t.from[n] || t.to && t.to[n]) && (i += Math.pow(10, r), t.from && t.from[n] && (i += 1), t.to && t.to[n] && (i += 2)), i;
        }, n.N = function(t) {
            var n = this;
            t.priority = 0;
            var r = 0;
            return this.j.forEach(function(i, e) {
                r += n.S(t, i.name, e + 1);
            }), t.priority = r, t;
        }, t;
    }();
    function V(t, n) {
        try {
            var r = t();
        } catch (t) {
            return n(t);
        }
        return r && r.then ? r.then(void 0, n) : r;
    }
    var Y = /*#__PURE__*/ function() {
        function t(t) {
            void 0 === t && (t = []), this.logger = new d("@barba/core"), this.store = void 0, this.C = !1, this.store = new K(t);
        }
        var r = t.prototype;
        return r.get = function(t, n) {
            return this.store.resolve(t, n);
        }, r.doOnce = function(t) {
            var n = t.data, r = t.transition;
            try {
                var i = function() {
                    e.C = !1;
                }, e = this, o = r || {};
                e.C = !0;
                var u = V(function() {
                    return Promise.resolve(e.L("beforeOnce", n, o)).then(function() {
                        return Promise.resolve(e.once(n, o)).then(function() {
                            return Promise.resolve(e.L("afterOnce", n, o)).then(function() {});
                        });
                    });
                }, function(t) {
                    e.C = !1, e.logger.debug("Transition error [before/after/once]"), e.logger.error(t);
                });
                return Promise.resolve(u && u.then ? u.then(i) : i());
            } catch (t) {
                return Promise.reject(t);
            }
        }, r.doPage = function(t) {
            var n = t.data, r = t.transition, i = t.page, e = t.wrapper;
            try {
                var o = function(t) {
                    u.C = !1;
                }, u = this, s = r || {}, f = !0 === s.sync || !1;
                u.C = !0;
                var c = V(function() {
                    function t() {
                        return Promise.resolve(u.L("before", n, s)).then(function() {
                            function t(t) {
                                return Promise.resolve(u.remove(n)).then(function() {
                                    return Promise.resolve(u.L("after", n, s)).then(function() {});
                                });
                            }
                            var r = function() {
                                if (f) return V(function() {
                                    return Promise.resolve(u.add(n, e)).then(function() {
                                        return Promise.resolve(u.L("beforeLeave", n, s)).then(function() {
                                            return Promise.resolve(u.L("beforeEnter", n, s)).then(function() {
                                                return Promise.resolve(Promise.all([
                                                    u.leave(n, s),
                                                    u.enter(n, s)
                                                ])).then(function() {
                                                    return Promise.resolve(u.L("afterLeave", n, s)).then(function() {
                                                        return Promise.resolve(u.L("afterEnter", n, s)).then(function() {});
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }, function(t) {
                                    if (u.H(t)) throw new W(t, "Transition error [sync]");
                                });
                                var t = function(t) {
                                    return V(function() {
                                        var t = function() {
                                            if (!1 !== r) return Promise.resolve(u.add(n, e)).then(function() {
                                                return Promise.resolve(u.L("beforeEnter", n, s)).then(function() {
                                                    return Promise.resolve(u.enter(n, s, r)).then(function() {
                                                        return Promise.resolve(u.L("afterEnter", n, s)).then(function() {});
                                                    });
                                                });
                                            });
                                        }();
                                        if (t && t.then) return t.then(function() {});
                                    }, function(t) {
                                        if (u.H(t)) throw new W(t, "Transition error [before/after/enter]");
                                    });
                                }, r = !1, o = V(function() {
                                    return Promise.resolve(u.L("beforeLeave", n, s)).then(function() {
                                        return Promise.resolve(Promise.all([
                                            u.leave(n, s),
                                            g(i, n)
                                        ]).then(function(t) {
                                            return t[0];
                                        })).then(function(t) {
                                            return r = t, Promise.resolve(u.L("afterLeave", n, s)).then(function() {});
                                        });
                                    });
                                }, function(t) {
                                    if (u.H(t)) throw new W(t, "Transition error [before/after/leave]");
                                });
                                return o && o.then ? o.then(t) : t();
                            }();
                            return r && r.then ? r.then(t) : t();
                        });
                    }
                    var r = function() {
                        if (f) return Promise.resolve(g(i, n)).then(function() {});
                    }();
                    return r && r.then ? r.then(t) : t();
                }, function(t) {
                    if (u.C = !1, t.name && "BarbaError" === t.name) throw u.logger.debug(t.label), u.logger.error(t.error), t;
                    throw u.logger.debug("Transition error [page]"), u.logger.error(t), t;
                });
                return Promise.resolve(c && c.then ? c.then(o) : o());
            } catch (t) {
                return Promise.reject(t);
            }
        }, r.once = function(t, n) {
            try {
                return Promise.resolve(L.do("once", t, n)).then(function() {
                    return n.once ? S(n.once, n)(t) : Promise.resolve();
                });
            } catch (t) {
                return Promise.reject(t);
            }
        }, r.leave = function(t, n) {
            try {
                return Promise.resolve(L.do("leave", t, n)).then(function() {
                    return n.leave ? S(n.leave, n)(t) : Promise.resolve();
                });
            } catch (t) {
                return Promise.reject(t);
            }
        }, r.enter = function(t, n, r) {
            try {
                return Promise.resolve(L.do("enter", t, n)).then(function() {
                    return n.enter ? S(n.enter, n)(t, r) : Promise.resolve();
                });
            } catch (t) {
                return Promise.reject(t);
            }
        }, r.add = function(t, n) {
            try {
                return b.addContainer(t.next.container, n), L.do("nextAdded", t), Promise.resolve();
            } catch (t) {
                return Promise.reject(t);
            }
        }, r.remove = function(t) {
            try {
                return b.removeContainer(t.current.container), L.do("currentRemoved", t), Promise.resolve();
            } catch (t) {
                return Promise.reject(t);
            }
        }, r.H = function(t) {
            return t.message ? !/Timeout error|Fetch error/.test(t.message) : !t.status;
        }, r.L = function(t, n, r) {
            try {
                return Promise.resolve(L.do(t, n, r)).then(function() {
                    return r[t] ? S(r[t], r)(n) : Promise.resolve();
                });
            } catch (t) {
                return Promise.reject(t);
            }
        }, n(t, [
            {
                key: "isRunning",
                get: function() {
                    return this.C;
                },
                set: function(t) {
                    this.C = t;
                }
            },
            {
                key: "hasOnce",
                get: function() {
                    return this.store.once.length > 0;
                }
            },
            {
                key: "hasSelf",
                get: function() {
                    return this.store.all.some(function(t) {
                        return "self" === t.name;
                    });
                }
            },
            {
                key: "shouldWait",
                get: function() {
                    return this.store.all.some(function(t) {
                        return t.to && !t.to.route || t.sync;
                    });
                }
            }
        ]), t;
    }(), Z = /*#__PURE__*/ function() {
        function t(t) {
            var n = this;
            this.names = [
                "beforeLeave",
                "afterLeave",
                "beforeEnter",
                "afterEnter"
            ], this.byNamespace = new Map, 0 !== t.length && (t.forEach(function(t) {
                n.byNamespace.set(t.namespace, t);
            }), this.names.forEach(function(t) {
                L[t](n._(t));
            }));
        }
        return t.prototype._ = function(t) {
            var n = this;
            return function(r) {
                var i = t.match(/enter/i) ? r.next : r.current, e = n.byNamespace.get(i.namespace);
                return e && e[t] ? S(e[t], e)(r) : Promise.resolve();
            };
        }, t;
    }();
    Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector), Element.prototype.closest || (Element.prototype.closest = function(t) {
        var n = this;
        do {
            if (n.matches(t)) return n;
            n = n.parentElement || n.parentNode;
        }while (null !== n && 1 === n.nodeType);
        return null;
    });
    var tt = {
        container: null,
        html: "",
        namespace: "",
        url: {
            hash: "",
            href: "",
            path: "",
            port: null,
            query: {}
        }
    }, nt = /*#__PURE__*/ function() {
        function t() {
            this.version = "2.10.3", this.schemaPage = tt, this.Logger = d, this.logger = new d("@barba/core"), this.plugins = [], this.timeout = void 0, this.cacheIgnore = void 0, this.cacheFirstPage = void 0, this.prefetchIgnore = void 0, this.preventRunning = void 0, this.hooks = L, this.cache = void 0, this.headers = void 0, this.prevent = void 0, this.transitions = void 0, this.views = void 0, this.dom = b, this.helpers = x, this.history = P, this.request = M, this.url = j, this.D = void 0, this.B = void 0, this.q = void 0, this.F = void 0;
        }
        var i = t.prototype;
        return i.use = function(t, n) {
            var r = this.plugins;
            r.indexOf(t) > -1 ? this.logger.warn("Plugin [" + t.name + "] already installed.") : "function" == typeof t.install ? (t.install(this, n), r.push(t)) : this.logger.warn("Plugin [" + t.name + '] has no "install" method.');
        }, i.init = function(t) {
            var n = void 0 === t ? {} : t, i = n.transitions, e = void 0 === i ? [] : i, o = n.views, u = void 0 === o ? [] : o, s = n.schema, f = void 0 === s ? m : s, c = n.requestError, a = n.timeout, h = void 0 === a ? 2e3 : a, v = n.cacheIgnore, l = void 0 !== v && v, p = n.cacheFirstPage, w = void 0 !== p && p, b = n.prefetchIgnore, y = void 0 !== b && b, P = n.preventRunning, g = void 0 !== P && P, E = n.prevent, x = void 0 === E ? null : E, R = n.debug, k = n.logLevel;
            if (d.setLevel(!0 === (void 0 !== R && R) ? "debug" : void 0 === k ? "off" : k), this.logger.info(this.version), Object.keys(f).forEach(function(t) {
                m[t] && (m[t] = f[t]);
            }), this.B = c, this.timeout = h, this.cacheIgnore = l, this.cacheFirstPage = w, this.prefetchIgnore = y, this.preventRunning = g, this.q = this.dom.getWrapper(), !this.q) throw new Error("[@barba/core] No Barba wrapper found");
            this.I();
            var O = this.data.current;
            if (!O.container) throw new Error("[@barba/core] No Barba container found");
            if (this.cache = new _(l), this.headers = new D, this.prevent = new J(y), this.transitions = new Y(e), this.views = new Z(u), null !== x) {
                if ("function" != typeof x) throw new Error("[@barba/core] Prevent should be a function");
                this.prevent.add("preventCustom", x);
            }
            this.history.init(O.url.href, O.namespace), w && this.cache.set(O.url.href, Promise.resolve({
                html: O.html,
                url: O.url
            }), "init", "fulfilled"), this.U = this.U.bind(this), this.$ = this.$.bind(this), this.X = this.X.bind(this), this.G(), this.plugins.forEach(function(t) {
                return t.init();
            });
            var T = this.data;
            T.trigger = "barba", T.next = T.current, T.current = r({}, this.schemaPage), this.hooks.do("ready", T), this.once(T), this.I();
        }, i.destroy = function() {
            this.I(), this.J(), this.history.clear(), this.hooks.clear(), this.plugins = [];
        }, i.force = function(t) {
            window.location.assign(t);
        }, i.go = function(t, n, r) {
            var i;
            if (void 0 === n && (n = "barba"), this.F = null, this.transitions.isRunning) this.force(t);
            else if (!(i = "popstate" === n ? this.history.current && this.url.getPath(this.history.current.url) === this.url.getPath(t) && this.url.getQuery(this.history.current.url, !0) === this.url.getQuery(t, !0) : this.prevent.run("sameUrl", null, null, t)) || this.transitions.hasSelf) return n = this.history.change(this.cache.has(t) ? this.cache.get(t).target : t, n, r), r && (r.stopPropagation(), r.preventDefault()), this.page(t, n, null != r ? r : void 0, i);
        }, i.once = function(t) {
            try {
                var n = this;
                return Promise.resolve(n.hooks.do("beforeEnter", t)).then(function() {
                    function r() {
                        return Promise.resolve(n.hooks.do("afterEnter", t)).then(function() {});
                    }
                    var i = function() {
                        if (n.transitions.hasOnce) {
                            var r = n.transitions.get(t, {
                                once: !0
                            });
                            return Promise.resolve(n.transitions.doOnce({
                                transition: r,
                                data: t
                            })).then(function() {});
                        }
                    }();
                    return i && i.then ? i.then(r) : r();
                });
            } catch (t) {
                return Promise.reject(t);
            }
        }, i.page = function(t, n, i, e) {
            try {
                var o, u = function() {
                    var t = s.data;
                    return Promise.resolve(s.hooks.do("page", t)).then(function() {
                        var n = function(n, r) {
                            try {
                                var i = (u = s.transitions.get(t, {
                                    once: !1,
                                    self: e
                                }), Promise.resolve(s.transitions.doPage({
                                    data: t,
                                    page: o,
                                    transition: u,
                                    wrapper: s.q
                                })).then(function() {
                                    s.I();
                                }));
                            } catch (t) {
                                return r();
                            }
                            var u;
                            return i && i.then ? i.then(void 0, r) : i;
                        }(0, function() {
                            0 === d.getLevel() && s.force(t.next.url.href);
                        });
                        if (n && n.then) return n.then(function() {});
                    });
                }, s = this;
                if (s.data.next.url = r({
                    href: t
                }, s.url.parse(t)), s.data.trigger = n, s.data.event = i, s.cache.has(t)) o = s.cache.update(t, {
                    action: "click"
                }).request;
                else {
                    var f = s.request(t, s.timeout, s.onRequestError.bind(s, n), s.cache, s.headers);
                    f.then(function(r) {
                        r.url.href !== t && s.history.add(r.url.href, n, "replace");
                    }), o = s.cache.set(t, f, "click", "pending").request;
                }
                var c = function() {
                    if (s.transitions.shouldWait) return Promise.resolve(g(o, s.data)).then(function() {});
                }();
                return Promise.resolve(c && c.then ? c.then(u) : u());
            } catch (t) {
                return Promise.reject(t);
            }
        }, i.onRequestError = function(t) {
            this.transitions.isRunning = !1;
            var n = [].slice.call(arguments, 1), r = n[0], i = n[1], e = this.cache.getAction(r);
            return this.cache.delete(r), this.B && !1 === this.B(t, e, r, i) || "click" === e && this.force(r), !1;
        }, i.prefetch = function(t) {
            var n = this;
            t = this.url.getAbsoluteHref(t), this.cache.has(t) || this.cache.set(t, this.request(t, this.timeout, this.onRequestError.bind(this, "barba"), this.cache, this.headers).catch(function(t) {
                n.logger.error(t);
            }), "prefetch", "pending");
        }, i.G = function() {
            !0 !== this.prefetchIgnore && (document.addEventListener("mouseover", this.U), document.addEventListener("touchstart", this.U)), document.addEventListener("click", this.$), window.addEventListener("popstate", this.X);
        }, i.J = function() {
            !0 !== this.prefetchIgnore && (document.removeEventListener("mouseover", this.U), document.removeEventListener("touchstart", this.U)), document.removeEventListener("click", this.$), window.removeEventListener("popstate", this.X);
        }, i.U = function(t) {
            var n = this, r = this.W(t);
            if (r) {
                var i = this.url.getAbsoluteHref(this.dom.getHref(r));
                this.prevent.checkHref(i) || this.cache.has(i) || this.cache.set(i, this.request(i, this.timeout, this.onRequestError.bind(this, r), this.cache, this.headers).catch(function(t) {
                    n.logger.error(t);
                }), "enter", "pending");
            }
        }, i.$ = function(t) {
            var n = this.W(t);
            if (n) {
                if (this.transitions.isRunning && this.preventRunning) return t.preventDefault(), void t.stopPropagation();
                this.F = t, this.go(this.dom.getHref(n), n, t);
            }
        }, i.X = function(t) {
            this.go(this.url.getHref(), "popstate", t);
        }, i.W = function(t) {
            for(var n = t.target; n && !this.dom.getHref(n);)n = n.parentNode;
            if (n && !this.prevent.checkLink(n, t, this.dom.getHref(n))) return n;
        }, i.I = function() {
            var t = this.url.getHref(), n = {
                container: this.dom.getContainer(),
                html: this.dom.getHtml(),
                namespace: this.dom.getNamespace(),
                url: r({
                    href: t
                }, this.url.parse(t))
            };
            this.D = {
                current: n,
                event: void 0,
                next: r({}, this.schemaPage),
                trigger: void 0
            }, this.hooks.do("reset", this.data);
        }, n(t, [
            {
                key: "data",
                get: function() {
                    return this.D;
                }
            },
            {
                key: "wrapper",
                get: function() {
                    return this.q;
                }
            }
        ]), t;
    }();
    return new nt;
});

},{}],"1ObMh":[function(require,module,exports,__globalThis) {
/*!
 * CustomEase 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/ /* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CustomEase", ()=>CustomEase);
parcelHelpers.export(exports, "default", ()=>CustomEase);
var _pathsJs = require("./utils/paths.js");
var gsap, _coreInitted, _getGSAP = function _getGSAP() {
    return gsap || typeof window !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap;
}, _initCore = function _initCore() {
    gsap = _getGSAP();
    if (gsap) {
        gsap.registerEase("_CE", CustomEase.create);
        _coreInitted = 1;
    } else console.warn("Please gsap.registerPlugin(CustomEase)");
}, _bigNum = 1e20, _round = function _round(value) {
    return ~~(value * 1000 + (value < 0 ? -0.5 : .5)) / 1000;
}, _bonusValidated = 1, //<name>CustomEase</name>
_numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi, //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_needsParsingExp = /[cLlsSaAhHvVtTqQ]/g, _findMinimum = function _findMinimum(values) {
    var l = values.length, min = _bigNum, i;
    for(i = 1; i < l; i += 6)+values[i] < min && (min = +values[i]);
    return min;
}, //takes all the points and translates/scales them so that the x starts at 0 and ends at 1.
_normalize = function _normalize(values, height, originY) {
    if (!originY && originY !== 0) originY = Math.max(+values[values.length - 1], +values[1]);
    var tx = +values[0] * -1, ty = -originY, l = values.length, sx = 1 / (+values[l - 2] + tx), sy = -height || (Math.abs(+values[l - 1] - +values[1]) < 0.01 * (+values[l - 2] - +values[0]) ? _findMinimum(values) + ty : +values[l - 1] + ty), i;
    if (sy) //typically y ends at 1 (so that the end values are reached)
    sy = 1 / sy;
    else //in case the ease returns to its beginning value, scale everything proportionally
    sy = -sx;
    for(i = 0; i < l; i += 2){
        values[i] = (+values[i] + tx) * sx;
        values[i + 1] = (+values[i + 1] + ty) * sy;
    }
}, //note that this function returns point objects like {x, y} rather than working with segments which are arrays with alternating x, y values as in the similar function in paths.js
_bezierToPoints = function _bezierToPoints(x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
    var x12 = (x1 + x2) / 2, y12 = (y1 + y2) / 2, x23 = (x2 + x3) / 2, y23 = (y2 + y3) / 2, x34 = (x3 + x4) / 2, y34 = (y3 + y4) / 2, x123 = (x12 + x23) / 2, y123 = (y12 + y23) / 2, x234 = (x23 + x34) / 2, y234 = (y23 + y34) / 2, x1234 = (x123 + x234) / 2, y1234 = (y123 + y234) / 2, dx = x4 - x1, dy = y4 - y1, d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx), d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx), length;
    if (!points) {
        points = [
            {
                x: x1,
                y: y1
            },
            {
                x: x4,
                y: y4
            }
        ];
        index = 1;
    }
    points.splice(index || points.length - 1, 0, {
        x: x1234,
        y: y1234
    });
    if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
        length = points.length;
        _bezierToPoints(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);
        _bezierToPoints(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 1 + (points.length - length));
    }
    return points;
};
var CustomEase = /*#__PURE__*/ function() {
    function CustomEase(id, data, config) {
        _coreInitted || _initCore();
        this.id = id;
        _bonusValidated && this.setData(data, config);
    }
    var _proto = CustomEase.prototype;
    _proto.setData = function setData(data, config) {
        config = config || {};
        data = data || "0,0,1,1";
        var values = data.match(_numExp), closest = 1, points = [], lookup = [], precision = config.precision || 1, fast = precision <= 1, l, a1, a2, i, inc, j, point, prevPoint, p;
        this.data = data;
        if (_needsParsingExp.test(data) || ~data.indexOf("M") && data.indexOf("C") < 0) values = (0, _pathsJs.stringToRawPath)(data)[0];
        l = values.length;
        if (l === 4) {
            values.unshift(0, 0);
            values.push(1, 1);
            l = 8;
        } else if ((l - 2) % 6) throw "Invalid CustomEase";
        if (+values[0] !== 0 || +values[l - 2] !== 1) _normalize(values, config.height, config.originY);
        this.segment = values;
        for(i = 2; i < l; i += 6){
            a1 = {
                x: +values[i - 2],
                y: +values[i - 1]
            };
            a2 = {
                x: +values[i + 4],
                y: +values[i + 5]
            };
            points.push(a1, a2);
            _bezierToPoints(a1.x, a1.y, +values[i], +values[i + 1], +values[i + 2], +values[i + 3], a2.x, a2.y, 1 / (precision * 200000), points, points.length - 1);
        }
        l = points.length;
        for(i = 0; i < l; i++){
            point = points[i];
            prevPoint = points[i - 1] || point;
            if ((point.x > prevPoint.x || prevPoint.y !== point.y && prevPoint.x === point.x || point === prevPoint) && point.x <= 1) {
                //if a point goes BACKWARD in time or is a duplicate, just drop it. Also it shouldn't go past 1 on the x axis, as could happen in a string like "M0,0 C0,0 0.12,0.68 0.18,0.788 0.195,0.845 0.308,1 0.32,1 0.403,1.005 0.398,1 0.5,1 0.602,1 0.816,1.005 0.9,1 0.91,1 0.948,0.69 0.962,0.615 1.003,0.376 1,0 1,0".
                prevPoint.cx = point.x - prevPoint.x; //change in x between this point and the next point (performance optimization)
                prevPoint.cy = point.y - prevPoint.y;
                prevPoint.n = point;
                prevPoint.nx = point.x; //next point's x value (performance optimization, making lookups faster in getRatio()). Remember, the lookup will always land on a spot where it's either this point or the very next one (never beyond that)
                if (fast && i > 1 && Math.abs(prevPoint.cy / prevPoint.cx - points[i - 2].cy / points[i - 2].cx) > 2) //if there's a sudden change in direction, prioritize accuracy over speed. Like a bounce ease - you don't want to risk the sampling chunks landing on each side of the bounce anchor and having it clipped off.
                fast = 0;
                if (prevPoint.cx < closest) {
                    if (!prevPoint.cx) {
                        prevPoint.cx = 0.001; //avoids math problems in getRatio() (dividing by zero)
                        if (i === l - 1) {
                            //in case the final segment goes vertical RIGHT at the end, make sure we end at the end.
                            prevPoint.x -= 0.001;
                            closest = Math.min(closest, 0.001);
                            fast = 0;
                        }
                    } else closest = prevPoint.cx;
                }
            } else {
                points.splice(i--, 1);
                l--;
            }
        }
        l = 1 / closest + 1 | 0;
        inc = 1 / l;
        j = 0;
        point = points[0];
        if (fast) {
            for(i = 0; i < l; i++){
                //for fastest lookups, we just sample along the path at equal x (time) distance. Uses more memory and is slightly less accurate for anchors that don't land on the sampling points, but for the vast majority of eases it's excellent (and fast).
                p = i * inc;
                if (point.nx < p) point = points[++j];
                a1 = point.y + (p - point.x) / point.cx * point.cy;
                lookup[i] = {
                    x: p,
                    cx: inc,
                    y: a1,
                    cy: 0,
                    nx: 9
                };
                if (i) lookup[i - 1].cy = a1 - lookup[i - 1].y;
            }
            lookup[l - 1].cy = points[points.length - 1].y - a1;
        } else {
            //this option is more accurate, ensuring that EVERY anchor is hit perfectly. Clipping across a bounce, for example, would never happen.
            for(i = 0; i < l; i++){
                //build a lookup table based on the smallest distance so that we can instantly find the appropriate point (well, it'll either be that point or the very next one). We'll look up based on the linear progress. So it's it's 0.5 and the lookup table has 100 elements, it'd be like lookup[Math.floor(0.5 * 100)]
                if (point.nx < i * inc) point = points[++j];
                lookup[i] = point;
            }
            if (j < points.length - 1) lookup[i - 1] = points[points.length - 2];
        } //this._calcEnd = (points[points.length-1].y !== 1 || points[0].y !== 0); //ensures that we don't run into floating point errors. As long as we're starting at 0 and ending at 1, tell GSAP to skip the final calculation and use 0/1 as the factor.
        this.ease = function(p) {
            var point = lookup[p * l | 0] || lookup[l - 1];
            if (point.nx < p) point = point.n;
            return point.y + (p - point.x) / point.cx * point.cy;
        };
        this.ease.custom = this;
        this.id && gsap && gsap.registerEase(this.id, this.ease);
        return this;
    };
    _proto.getSVGData = function getSVGData(config) {
        return CustomEase.getSVGData(this, config);
    };
    CustomEase.create = function create(id, data, config) {
        return new CustomEase(id, data, config).ease;
    };
    CustomEase.register = function register(core) {
        gsap = core;
        _initCore();
    };
    CustomEase.get = function get(id) {
        return gsap.parseEase(id);
    };
    CustomEase.getSVGData = function getSVGData(ease, config) {
        config = config || {};
        var width = config.width || 100, height = config.height || 100, x = config.x || 0, y = (config.y || 0) + height, e = gsap.utils.toArray(config.path)[0], a, slope, i, inc, tx, ty, precision, threshold, prevX, prevY;
        if (config.invert) {
            height = -height;
            y = 0;
        }
        if (typeof ease === "string") ease = gsap.parseEase(ease);
        if (ease.custom) ease = ease.custom;
        if (ease instanceof CustomEase) a = (0, _pathsJs.rawPathToString)((0, _pathsJs.transformRawPath)([
            ease.segment
        ], width, 0, 0, -height, x, y));
        else {
            a = [
                x,
                y
            ];
            precision = Math.max(5, (config.precision || 1) * 200);
            inc = 1 / precision;
            precision += 2;
            threshold = 5 / precision;
            prevX = _round(x + inc * width);
            prevY = _round(y + ease(inc) * -height);
            slope = (prevY - y) / (prevX - x);
            for(i = 2; i < precision; i++){
                tx = _round(x + i * inc * width);
                ty = _round(y + ease(i * inc) * -height);
                if (Math.abs((ty - prevY) / (tx - prevX) - slope) > threshold || i === precision - 1) {
                    //only add points when the slope changes beyond the threshold
                    a.push(prevX, prevY);
                    slope = (ty - prevY) / (tx - prevX);
                }
                prevX = tx;
                prevY = ty;
            }
            a = "M" + a.join(",");
        }
        e && e.setAttribute("d", a);
        return a;
    };
    return CustomEase;
}();
_getGSAP() && gsap.registerPlugin(CustomEase);
CustomEase.version = "3.12.5";

},{"./utils/paths.js":"egr9q","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"egr9q":[function(require,module,exports,__globalThis) {
/*!
 * paths 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/ /* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/* TERMINOLOGY
 - RawPath - an array of arrays, one for each Segment. A single RawPath could have multiple "M" commands, defining Segments (paths aren't always connected).
 - Segment - an array containing a sequence of Cubic Bezier coordinates in alternating x, y, x, y format. Starting anchor, then control point 1, control point 2, and ending anchor, then the next control point 1, control point 2, anchor, etc. Uses less memory than an array with a bunch of {x, y} points.
 - Bezier - a single cubic Bezier with a starting anchor, two control points, and an ending anchor.
 - the variable "t" is typically the position along an individual Bezier path (time) and it's NOT linear, meaning it could accelerate/decelerate based on the control points whereas the "p" or "progress" value is linearly mapped to the whole path, so it shouldn't really accelerate/decelerate based on control points. So a progress of 0.2 would be almost exactly 20% along the path. "t" is ONLY in an individual Bezier piece.
 */ //accepts basic selector text, a path instance, a RawPath instance, or a Segment and returns a RawPath (makes it easy to homogenize things). If an element or selector text is passed in, it'll also cache the value so that if it's queried again, it'll just take the path data from there instead of parsing it all over again (as long as the path data itself hasn't changed - it'll check).
parcelHelpers.export(exports, "getRawPath", ()=>getRawPath) //copies a RawPath WITHOUT the length meta data (for speed)
;
parcelHelpers.export(exports, "copyRawPath", ()=>copyRawPath);
parcelHelpers.export(exports, "reverseSegment", ()=>reverseSegment);
parcelHelpers.export(exports, "convertToPath", ()=>convertToPath) //returns the rotation (in degrees) at a particular progress on a rawPath (the slope of the tangent)
;
parcelHelpers.export(exports, "getRotationAtProgress", ()=>getRotationAtProgress);
parcelHelpers.export(exports, "sliceRawPath", ()=>sliceRawPath) //measures a Segment according to its resolution (so if segment.resolution is 6, for example, it'll take 6 samples equally across each Bezier) and create/populate a "samples" Array that has the length up to each of those sample points (always increasing from the start) as well as a "lookup" array that's broken up according to the smallest distance between 2 samples. This gives us a very fast way of looking up a progress position rather than looping through all the points/Beziers. You can optionally have it only measure a subset, starting at startIndex and going for a specific number of beziers (remember, there are 3 x/y pairs each, for a total of 6 elements for each Bezier). It will also populate a "totalLength" property, but that's not generally super accurate because by default it'll only take 6 samples per Bezier. But for performance reasons, it's perfectly adequate for measuring progress values along the path. If you need a more accurate totalLength, either increase the resolution or use the more advanced bezierToPoints() method which keeps adding points until they don't deviate by more than a certain precision value.
;
parcelHelpers.export(exports, "cacheRawPathMeasurements", ()=>cacheRawPathMeasurements) //divide segment[i] at position t (value between 0 and 1, progress along that particular cubic bezier segment that starts at segment[i]). Returns how many elements were spliced into the segment array (either 0 or 6)
;
parcelHelpers.export(exports, "subdivideSegment", ()=>subdivideSegment) // returns an object {path, segment, segIndex, i, t}
;
parcelHelpers.export(exports, "getPositionOnPath", ()=>getPositionOnPath) //applies a matrix transform to RawPath (or a segment in a RawPath) and returns whatever was passed in (it transforms the values in the array(s), not a copy).
;
parcelHelpers.export(exports, "transformRawPath", ()=>transformRawPath) // translates SVG arc data into a segment (cubic beziers). Angle is in degrees.
;
parcelHelpers.export(exports, "stringToRawPath", ()=>stringToRawPath) //populates the points array in alternating x/y values (like [x, y, x, y...] instead of individual point objects [{x, y}, {x, y}...] to conserve memory and stay in line with how we're handling segment arrays
;
parcelHelpers.export(exports, "bezierToPoints", ()=>bezierToPoints);
/*
function getAngleBetweenPoints(x0, y0, x1, y1, x2, y2) { //angle between 3 points in radians
	var dx1 = x1 - x0,
		dy1 = y1 - y0,
		dx2 = x2 - x1,
		dy2 = y2 - y1,
		dx3 = x2 - x0,
		dy3 = y2 - y0,
		a = dx1 * dx1 + dy1 * dy1,
		b = dx2 * dx2 + dy2 * dy2,
		c = dx3 * dx3 + dy3 * dy3;
	return Math.acos( (a + b - c) / _sqrt(4 * a * b) );
},
*/ //pointsToSegment() doesn't handle flat coordinates (where y is always 0) the way we need (the resulting control points are always right on top of the anchors), so this function basically makes the control points go directly up and down, varying in length based on the curviness (more curvy, further control points)
parcelHelpers.export(exports, "flatPointsToSegment", ()=>flatPointsToSegment) //points is an array of x/y points, like [x, y, x, y, x, y]
;
parcelHelpers.export(exports, "pointsToSegment", ()=>pointsToSegment) //returns the squared distance between an x/y coordinate and a segment between x1/y1 and x2/y2
;
parcelHelpers.export(exports, "simplifyPoints", ()=>simplifyPoints);
parcelHelpers.export(exports, "getClosestData", ()=>getClosestData) //subdivide a Segment closest to a specific x,y coordinate
;
parcelHelpers.export(exports, "subdivideSegmentNear", ()=>subdivideSegmentNear);
/*
Takes any of the following and converts it to an all Cubic Bezier SVG data string:
- A <path> data string like "M0,0 L2,4 v20,15 H100"
- A RawPath, like [[x, y, x, y, x, y, x, y][[x, y, x, y, x, y, x, y]]
- A Segment, like [x, y, x, y, x, y, x, y]

Note: all numbers are rounded down to the closest 0.001 to minimize memory, maximize speed, and avoid odd numbers like 1e-13
*/ parcelHelpers.export(exports, "rawPathToString", ()=>rawPathToString) /*
// takes a segment with coordinates [x, y, x, y, ...] and converts the control points into angles and lengths [x, y, angle, length, angle, length, x, y, angle, length, ...] so that it animates more cleanly and avoids odd breaks/kinks. For example, if you animate from 1 o'clock to 6 o'clock, it'd just go directly/linearly rather than around. So the length would be very short in the middle of the tween.
export function cpCoordsToAngles(segment, copy) {
	var result = copy ? segment.slice(0) : segment,
		x, y, i;
	for (i = 0; i < segment.length; i+=6) {
		x = segment[i+2] - segment[i];
		y = segment[i+3] - segment[i+1];
		result[i+2] = Math.atan2(y, x);
		result[i+3] = Math.sqrt(x * x + y * y);
		x = segment[i+6] - segment[i+4];
		y = segment[i+7] - segment[i+5];
		result[i+4] = Math.atan2(y, x);
		result[i+5] = Math.sqrt(x * x + y * y);
	}
	return result;
}

// takes a segment that was converted with cpCoordsToAngles() to have angles and lengths instead of coordinates for the control points, and converts it BACK into coordinates.
export function cpAnglesToCoords(segment, copy) {
	var result = copy ? segment.slice(0) : segment,
		length = segment.length,
		rnd = 1000,
		angle, l, i, j;
	for (i = 0; i < length; i+=6) {
		angle = segment[i+2];
		l = segment[i+3]; //length
		result[i+2] = (((segment[i] + Math.cos(angle) * l) * rnd) | 0) / rnd;
		result[i+3] = (((segment[i+1] + Math.sin(angle) * l) * rnd) | 0) / rnd;
		angle = segment[i+4];
		l = segment[i+5]; //length
		result[i+4] = (((segment[i+6] - Math.cos(angle) * l) * rnd) | 0) / rnd;
		result[i+5] = (((segment[i+7] - Math.sin(angle) * l) * rnd) | 0) / rnd;
	}
	return result;
}

//adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
export function populateSmoothData(rawPath) {
	let j = rawPath.length,
		smooth, segment, x, y, x2, y2, i, l, a, a2, isSmooth, smoothData;
	while (--j > -1) {
		segment = rawPath[j];
		isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
		smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
		isSmooth.length = 4;
		l = segment.length - 2;
		for (i = 6; i < l; i += 6) {
			x = segment[i] - segment[i - 2];
			y = segment[i + 1] - segment[i - 1];
			x2 = segment[i + 2] - segment[i];
			y2 = segment[i + 3] - segment[i + 1];
			a = _atan2(y, x);
			a2 = _atan2(y2, x2);
			smooth = (Math.abs(a - a2) < 0.09);
			if (smooth) {
				smoothData[i - 2] = a;
				smoothData[i + 2] = a2;
				smoothData[i - 1] = _sqrt(x * x + y * y);
				smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
			}
			isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
		}
		//if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.
		if (segment[l] === segment[0] && segment[l+1] === segment[1]) {
			x = segment[0] - segment[l-2];
			y = segment[1] - segment[l-1];
			x2 = segment[2] - segment[0];
			y2 = segment[3] - segment[1];
			a = _atan2(y, x);
			a2 = _atan2(y2, x2);
			if (Math.abs(a - a2) < 0.09) {
				smoothData[l-2] = a;
				smoothData[2] = a2;
				smoothData[l-1] = _sqrt(x * x + y * y);
				smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
				isSmooth[l-2] = isSmooth[l-1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
			}
		}
	}
	return rawPath;
}
export function pointToScreen(svgElement, point) {
	if (arguments.length < 2) { //by default, take the first set of coordinates in the path as the point
		let rawPath = getRawPath(svgElement);
		point = svgElement.ownerSVGElement.createSVGPoint();
		point.x = rawPath[0][0];
		point.y = rawPath[0][1];
	}
	return point.matrixTransform(svgElement.getScreenCTM());
}

*/ ;
var _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig, _numbersExp = /(?:(-)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig, _scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig, _selectorExp = /(^[#\.][a-z]|[a-y][a-z])/i, _DEG2RAD = Math.PI / 180, _RAD2DEG = 180 / Math.PI, _sin = Math.sin, _cos = Math.cos, _abs = Math.abs, _sqrt = Math.sqrt, _atan2 = Math.atan2, _largeNum = 1e8, _isString = function _isString(value) {
    return typeof value === "string";
}, _isNumber = function _isNumber(value) {
    return typeof value === "number";
}, _isUndefined = function _isUndefined(value) {
    return typeof value === "undefined";
}, _temp = {}, _temp2 = {}, _roundingNum = 1e5, _wrapProgress = function _wrapProgress(progress) {
    return Math.round((progress + _largeNum) % 1 * _roundingNum) / _roundingNum || (progress < 0 ? 0 : 1);
}, //if progress lands on 1, the % will make it 0 which is why we || 1, but not if it's negative because it makes more sense for motion to end at 0 in that case.
_round = function _round(value) {
    return Math.round(value * _roundingNum) / _roundingNum || 0;
}, _roundPrecise = function _roundPrecise(value) {
    return Math.round(value * 1e10) / 1e10 || 0;
}, _splitSegment = function _splitSegment(rawPath, segIndex, i, t) {
    var segment = rawPath[segIndex], shift = t === 1 ? 6 : subdivideSegment(segment, i, t);
    if ((shift || !t) && shift + i + 2 < segment.length) {
        rawPath.splice(segIndex, 0, segment.slice(0, i + shift + 2));
        segment.splice(0, i + shift);
        return 1;
    }
}, _getSampleIndex = function _getSampleIndex(samples, length, progress) {
    // slightly slower way than doing this (when there's no lookup): segment.lookup[progress < 1 ? ~~(length / segment.minLength) : segment.lookup.length - 1] || 0;
    var l = samples.length, i = ~~(progress * l);
    if (samples[i] > length) {
        while(--i && samples[i] > length);
        i < 0 && (i = 0);
    } else {
        while(samples[++i] < length && i < l);
    }
    return i < l ? i : l - 1;
}, _reverseRawPath = function _reverseRawPath(rawPath, skipOuter) {
    var i = rawPath.length;
    skipOuter || rawPath.reverse();
    while(i--)rawPath[i].reversed || reverseSegment(rawPath[i]);
}, _copyMetaData = function _copyMetaData(source, copy) {
    copy.totalLength = source.totalLength;
    if (source.samples) {
        //segment
        copy.samples = source.samples.slice(0);
        copy.lookup = source.lookup.slice(0);
        copy.minLength = source.minLength;
        copy.resolution = source.resolution;
    } else if (source.totalPoints) //rawPath
    copy.totalPoints = source.totalPoints;
    return copy;
}, //pushes a new segment into a rawPath, but if its starting values match the ending values of the last segment, it'll merge it into that same segment (to reduce the number of segments)
_appendOrMerge = function _appendOrMerge(rawPath, segment) {
    var index = rawPath.length, prevSeg = rawPath[index - 1] || [], l = prevSeg.length;
    if (index && segment[0] === prevSeg[l - 2] && segment[1] === prevSeg[l - 1]) {
        segment = prevSeg.concat(segment.slice(2));
        index--;
    }
    rawPath[index] = segment;
}, _bestDistance;
function getRawPath(value) {
    value = _isString(value) && _selectorExp.test(value) ? document.querySelector(value) || value : value;
    var e = value.getAttribute ? value : 0, rawPath;
    if (e && (value = value.getAttribute("d"))) {
        //implements caching
        if (!e._gsPath) e._gsPath = {};
        rawPath = e._gsPath[value];
        return rawPath && !rawPath._dirty ? rawPath : e._gsPath[value] = stringToRawPath(value);
    }
    return !value ? console.warn("Expecting a <path> element or an SVG path data string") : _isString(value) ? stringToRawPath(value) : _isNumber(value[0]) ? [
        value
    ] : value;
}
function copyRawPath(rawPath) {
    var a = [], i = 0;
    for(; i < rawPath.length; i++)a[i] = _copyMetaData(rawPath[i], rawPath[i].slice(0));
    return _copyMetaData(rawPath, a);
}
function reverseSegment(segment) {
    var i = 0, y;
    segment.reverse(); //this will invert the order y, x, y, x so we must flip it back.
    for(; i < segment.length; i += 2){
        y = segment[i];
        segment[i] = segment[i + 1];
        segment[i + 1] = y;
    }
    segment.reversed = !segment.reversed;
}
var _createPath = function _createPath(e, ignore) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path"), attr = [].slice.call(e.attributes), i = attr.length, name;
    ignore = "," + ignore + ",";
    while(--i > -1){
        name = attr[i].nodeName.toLowerCase(); //in Microsoft Edge, if you don't set the attribute with a lowercase name, it doesn't render correctly! Super weird.
        if (ignore.indexOf("," + name + ",") < 0) path.setAttributeNS(null, name, attr[i].nodeValue);
    }
    return path;
}, _typeAttrs = {
    rect: "rx,ry,x,y,width,height",
    circle: "r,cx,cy",
    ellipse: "rx,ry,cx,cy",
    line: "x1,x2,y1,y2"
}, _attrToObj = function _attrToObj(e, attrs) {
    var props = attrs ? attrs.split(",") : [], obj = {}, i = props.length;
    while(--i > -1)obj[props[i]] = +e.getAttribute(props[i]) || 0;
    return obj;
}; //converts an SVG shape like <circle>, <rect>, <polygon>, <polyline>, <ellipse>, etc. to a <path>, swapping it in and copying the attributes to match.
function convertToPath(element, swap) {
    var type = element.tagName.toLowerCase(), circ = 0.552284749831, data, x, y, r, ry, path, rcirc, rycirc, points, w, h, x2, x3, x4, x5, x6, y2, y3, y4, y5, y6, attr;
    if (type === "path" || !element.getBBox) return element;
    path = _createPath(element, "x,y,width,height,cx,cy,rx,ry,r,x1,x2,y1,y2,points");
    attr = _attrToObj(element, _typeAttrs[type]);
    if (type === "rect") {
        r = attr.rx;
        ry = attr.ry || r;
        x = attr.x;
        y = attr.y;
        w = attr.width - r * 2;
        h = attr.height - ry * 2;
        if (r || ry) {
            //if there are rounded corners, render cubic beziers
            x2 = x + r * (1 - circ);
            x3 = x + r;
            x4 = x3 + w;
            x5 = x4 + r * circ;
            x6 = x4 + r;
            y2 = y + ry * (1 - circ);
            y3 = y + ry;
            y4 = y3 + h;
            y5 = y4 + ry * circ;
            y6 = y4 + ry;
            data = "M" + x6 + "," + y3 + " V" + y4 + " C" + [
                x6,
                y5,
                x5,
                y6,
                x4,
                y6,
                x4 - (x4 - x3) / 3,
                y6,
                x3 + (x4 - x3) / 3,
                y6,
                x3,
                y6,
                x2,
                y6,
                x,
                y5,
                x,
                y4,
                x,
                y4 - (y4 - y3) / 3,
                x,
                y3 + (y4 - y3) / 3,
                x,
                y3,
                x,
                y2,
                x2,
                y,
                x3,
                y,
                x3 + (x4 - x3) / 3,
                y,
                x4 - (x4 - x3) / 3,
                y,
                x4,
                y,
                x5,
                y,
                x6,
                y2,
                x6,
                y3
            ].join(",") + "z";
        } else data = "M" + (x + w) + "," + y + " v" + h + " h" + -w + " v" + -h + " h" + w + "z";
    } else if (type === "circle" || type === "ellipse") {
        if (type === "circle") {
            r = ry = attr.r;
            rycirc = r * circ;
        } else {
            r = attr.rx;
            ry = attr.ry;
            rycirc = ry * circ;
        }
        x = attr.cx;
        y = attr.cy;
        rcirc = r * circ;
        data = "M" + (x + r) + "," + y + " C" + [
            x + r,
            y + rycirc,
            x + rcirc,
            y + ry,
            x,
            y + ry,
            x - rcirc,
            y + ry,
            x - r,
            y + rycirc,
            x - r,
            y,
            x - r,
            y - rycirc,
            x - rcirc,
            y - ry,
            x,
            y - ry,
            x + rcirc,
            y - ry,
            x + r,
            y - rycirc,
            x + r,
            y
        ].join(",") + "z";
    } else if (type === "line") data = "M" + attr.x1 + "," + attr.y1 + " L" + attr.x2 + "," + attr.y2; //previously, we just converted to "Mx,y Lx,y" but Safari has bugs that cause that not to render properly when using a stroke-dasharray that's not fully visible! Using a cubic bezier fixes that issue.
    else if (type === "polyline" || type === "polygon") {
        points = (element.getAttribute("points") + "").match(_numbersExp) || [];
        x = points.shift();
        y = points.shift();
        data = "M" + x + "," + y + " L" + points.join(",");
        if (type === "polygon") data += "," + x + "," + y + "z";
    }
    path.setAttribute("d", rawPathToString(path._gsRawPath = stringToRawPath(data)));
    if (swap && element.parentNode) {
        element.parentNode.insertBefore(path, element);
        element.parentNode.removeChild(element);
    }
    return path;
}
function getRotationAtProgress(rawPath, progress) {
    var d = getProgressData(rawPath, progress >= 1 ? 1 - 1e-9 : progress ? progress : 1e-9);
    return getRotationAtBezierT(d.segment, d.i, d.t);
}
function getRotationAtBezierT(segment, i, t) {
    var a = segment[i], b = segment[i + 2], c = segment[i + 4], x;
    a += (b - a) * t;
    b += (c - b) * t;
    a += (b - a) * t;
    x = b + (c + (segment[i + 6] - c) * t - b) * t - a;
    a = segment[i + 1];
    b = segment[i + 3];
    c = segment[i + 5];
    a += (b - a) * t;
    b += (c - b) * t;
    a += (b - a) * t;
    return _round(_atan2(b + (c + (segment[i + 7] - c) * t - b) * t - a, x) * _RAD2DEG);
}
function sliceRawPath(rawPath, start, end) {
    end = _isUndefined(end) ? 1 : _roundPrecise(end) || 0; // we must round to avoid issues like 4.15 / 8 = 0.8300000000000001 instead of 0.83 or 2.8 / 5 = 0.5599999999999999 instead of 0.56 and if someone is doing a loop like start: 2.8 / 0.5, end: 2.8 / 0.5 + 1.
    start = _roundPrecise(start) || 0;
    var loops = Math.max(0, ~~(_abs(end - start) - 1e-8)), path = copyRawPath(rawPath);
    if (start > end) {
        start = 1 - start;
        end = 1 - end;
        _reverseRawPath(path);
        path.totalLength = 0;
    }
    if (start < 0 || end < 0) {
        var offset = Math.abs(~~Math.min(start, end)) + 1;
        start += offset;
        end += offset;
    }
    path.totalLength || cacheRawPathMeasurements(path);
    var wrap = end > 1, s = getProgressData(path, start, _temp, true), e = getProgressData(path, end, _temp2), eSeg = e.segment, sSeg = s.segment, eSegIndex = e.segIndex, sSegIndex = s.segIndex, ei = e.i, si = s.i, sameSegment = sSegIndex === eSegIndex, sameBezier = ei === si && sameSegment, wrapsBehind, sShift, eShift, i, copy, totalSegments, l, j;
    if (wrap || loops) {
        wrapsBehind = eSegIndex < sSegIndex || sameSegment && ei < si || sameBezier && e.t < s.t;
        if (_splitSegment(path, sSegIndex, si, s.t)) {
            sSegIndex++;
            if (!wrapsBehind) {
                eSegIndex++;
                if (sameBezier) {
                    e.t = (e.t - s.t) / (1 - s.t);
                    ei = 0;
                } else if (sameSegment) ei -= si;
            }
        }
        if (Math.abs(1 - (end - start)) < 1e-5) eSegIndex = sSegIndex - 1;
        else if (!e.t && eSegIndex) eSegIndex--;
        else if (_splitSegment(path, eSegIndex, ei, e.t) && wrapsBehind) sSegIndex++;
        if (s.t === 1) sSegIndex = (sSegIndex + 1) % path.length;
        copy = [];
        totalSegments = path.length;
        l = 1 + totalSegments * loops;
        j = sSegIndex;
        l += (totalSegments - sSegIndex + eSegIndex) % totalSegments;
        for(i = 0; i < l; i++)_appendOrMerge(copy, path[j++ % totalSegments]);
        path = copy;
    } else {
        eShift = e.t === 1 ? 6 : subdivideSegment(eSeg, ei, e.t);
        if (start !== end) {
            sShift = subdivideSegment(sSeg, si, sameBezier ? s.t / e.t : s.t);
            sameSegment && (eShift += sShift);
            eSeg.splice(ei + eShift + 2);
            (sShift || si) && sSeg.splice(0, si + sShift);
            i = path.length;
            while(i--)//chop off any extra segments
            (i < sSegIndex || i > eSegIndex) && path.splice(i, 1);
        } else {
            eSeg.angle = getRotationAtBezierT(eSeg, ei + eShift, 0); //record the value before we chop because it'll be impossible to determine the angle after its length is 0!
            ei += eShift;
            s = eSeg[ei];
            e = eSeg[ei + 1];
            eSeg.length = eSeg.totalLength = 0;
            eSeg.totalPoints = path.totalPoints = 8;
            eSeg.push(s, e, s, e, s, e, s, e);
        }
    }
    path.totalLength = 0;
    return path;
}
function measureSegment(segment, startIndex, bezierQty) {
    startIndex = startIndex || 0;
    if (!segment.samples) {
        segment.samples = [];
        segment.lookup = [];
    }
    var resolution = ~~segment.resolution || 12, inc = 1 / resolution, endIndex = bezierQty ? startIndex + bezierQty * 6 + 1 : segment.length, x1 = segment[startIndex], y1 = segment[startIndex + 1], samplesIndex = startIndex ? startIndex / 6 * resolution : 0, samples = segment.samples, lookup = segment.lookup, min = (startIndex ? segment.minLength : _largeNum) || _largeNum, prevLength = samples[samplesIndex + bezierQty * resolution - 1], length = startIndex ? samples[samplesIndex - 1] : 0, i, j, x4, x3, x2, xd, xd1, y4, y3, y2, yd, yd1, inv, t, lengthIndex, l, segLength;
    samples.length = lookup.length = 0;
    for(j = startIndex + 2; j < endIndex; j += 6){
        x4 = segment[j + 4] - x1;
        x3 = segment[j + 2] - x1;
        x2 = segment[j] - x1;
        y4 = segment[j + 5] - y1;
        y3 = segment[j + 3] - y1;
        y2 = segment[j + 1] - y1;
        xd = xd1 = yd = yd1 = 0;
        if (_abs(x4) < .01 && _abs(y4) < .01 && _abs(x2) + _abs(y2) < .01) //dump points that are sufficiently close (basically right on top of each other, making a bezier super tiny or 0 length)
        {
            if (segment.length > 8) {
                segment.splice(j, 6);
                j -= 6;
                endIndex -= 6;
            }
        } else for(i = 1; i <= resolution; i++){
            t = inc * i;
            inv = 1 - t;
            xd = xd1 - (xd1 = (t * t * x4 + 3 * inv * (t * x3 + inv * x2)) * t);
            yd = yd1 - (yd1 = (t * t * y4 + 3 * inv * (t * y3 + inv * y2)) * t);
            l = _sqrt(yd * yd + xd * xd);
            if (l < min) min = l;
            length += l;
            samples[samplesIndex++] = length;
        }
        x1 += x4;
        y1 += y4;
    }
    if (prevLength) {
        prevLength -= length;
        for(; samplesIndex < samples.length; samplesIndex++)samples[samplesIndex] += prevLength;
    }
    if (samples.length && min) {
        segment.totalLength = segLength = samples[samples.length - 1] || 0;
        segment.minLength = min;
        if (segLength / min < 9999) {
            // if the lookup would require too many values (memory problem), we skip this and instead we use a loop to lookup values directly in the samples Array
            l = lengthIndex = 0;
            for(i = 0; i < segLength; i += min)lookup[l++] = samples[lengthIndex] < i ? ++lengthIndex : lengthIndex;
        }
    } else segment.totalLength = samples[0] = 0;
    return startIndex ? length - samples[startIndex / 2 - 1] : length;
}
function cacheRawPathMeasurements(rawPath, resolution) {
    var pathLength, points, i;
    for(i = pathLength = points = 0; i < rawPath.length; i++){
        rawPath[i].resolution = ~~resolution || 12; //steps per Bezier curve (anchor, 2 control points, to anchor)
        points += rawPath[i].length;
        pathLength += measureSegment(rawPath[i]);
    }
    rawPath.totalPoints = points;
    rawPath.totalLength = pathLength;
    return rawPath;
}
function subdivideSegment(segment, i, t) {
    if (t <= 0 || t >= 1) return 0;
    var ax = segment[i], ay = segment[i + 1], cp1x = segment[i + 2], cp1y = segment[i + 3], cp2x = segment[i + 4], cp2y = segment[i + 5], bx = segment[i + 6], by = segment[i + 7], x1a = ax + (cp1x - ax) * t, x2 = cp1x + (cp2x - cp1x) * t, y1a = ay + (cp1y - ay) * t, y2 = cp1y + (cp2y - cp1y) * t, x1 = x1a + (x2 - x1a) * t, y1 = y1a + (y2 - y1a) * t, x2a = cp2x + (bx - cp2x) * t, y2a = cp2y + (by - cp2y) * t;
    x2 += (x2a - x2) * t;
    y2 += (y2a - y2) * t;
    segment.splice(i + 2, 4, _round(x1a), _round(y1a), _round(x1), _round(y1), _round(x1 + (x2 - x1) * t), _round(y1 + (y2 - y1) * t), _round(x2), _round(y2), _round(x2a), _round(y2a));
    segment.samples && segment.samples.splice(i / 6 * segment.resolution | 0, 0, 0, 0, 0, 0, 0, 0);
    return 6;
}
function getProgressData(rawPath, progress, decoratee, pushToNextIfAtEnd) {
    decoratee = decoratee || {};
    rawPath.totalLength || cacheRawPathMeasurements(rawPath);
    if (progress < 0 || progress > 1) progress = _wrapProgress(progress);
    var segIndex = 0, segment = rawPath[0], samples, resolution, length, min, max, i, t;
    if (!progress) {
        t = i = segIndex = 0;
        segment = rawPath[0];
    } else if (progress === 1) {
        t = 1;
        segIndex = rawPath.length - 1;
        segment = rawPath[segIndex];
        i = segment.length - 8;
    } else {
        if (rawPath.length > 1) {
            //speed optimization: most of the time, there's only one segment so skip the recursion.
            length = rawPath.totalLength * progress;
            max = i = 0;
            while((max += rawPath[i++].totalLength) < length)segIndex = i;
            segment = rawPath[segIndex];
            min = max - segment.totalLength;
            progress = (length - min) / (max - min) || 0;
        }
        samples = segment.samples;
        resolution = segment.resolution; //how many samples per cubic bezier chunk
        length = segment.totalLength * progress;
        i = segment.lookup.length ? segment.lookup[~~(length / segment.minLength)] || 0 : _getSampleIndex(samples, length, progress);
        min = i ? samples[i - 1] : 0;
        max = samples[i];
        if (max < length) {
            min = max;
            max = samples[++i];
        }
        t = 1 / resolution * ((length - min) / (max - min) + i % resolution);
        i = ~~(i / resolution) * 6;
        if (pushToNextIfAtEnd && t === 1) {
            if (i + 6 < segment.length) {
                i += 6;
                t = 0;
            } else if (segIndex + 1 < rawPath.length) {
                i = t = 0;
                segment = rawPath[++segIndex];
            }
        }
    }
    decoratee.t = t;
    decoratee.i = i;
    decoratee.path = rawPath;
    decoratee.segment = segment;
    decoratee.segIndex = segIndex;
    return decoratee;
}
function getPositionOnPath(rawPath, progress, includeAngle, point) {
    var segment = rawPath[0], result = point || {}, samples, resolution, length, min, max, i, t, a, inv;
    if (progress < 0 || progress > 1) progress = _wrapProgress(progress);
    segment.lookup || cacheRawPathMeasurements(rawPath);
    if (rawPath.length > 1) {
        //speed optimization: most of the time, there's only one segment so skip the recursion.
        length = rawPath.totalLength * progress;
        max = i = 0;
        while((max += rawPath[i++].totalLength) < length)segment = rawPath[i];
        min = max - segment.totalLength;
        progress = (length - min) / (max - min) || 0;
    }
    samples = segment.samples;
    resolution = segment.resolution;
    length = segment.totalLength * progress;
    i = segment.lookup.length ? segment.lookup[progress < 1 ? ~~(length / segment.minLength) : segment.lookup.length - 1] || 0 : _getSampleIndex(samples, length, progress);
    min = i ? samples[i - 1] : 0;
    max = samples[i];
    if (max < length) {
        min = max;
        max = samples[++i];
    }
    t = 1 / resolution * ((length - min) / (max - min) + i % resolution) || 0;
    inv = 1 - t;
    i = ~~(i / resolution) * 6;
    a = segment[i];
    result.x = _round((t * t * (segment[i + 6] - a) + 3 * inv * (t * (segment[i + 4] - a) + inv * (segment[i + 2] - a))) * t + a);
    result.y = _round((t * t * (segment[i + 7] - (a = segment[i + 1])) + 3 * inv * (t * (segment[i + 5] - a) + inv * (segment[i + 3] - a))) * t + a);
    if (includeAngle) result.angle = segment.totalLength ? getRotationAtBezierT(segment, i, t >= 1 ? 1 - 1e-9 : t ? t : 1e-9) : segment.angle || 0;
    return result;
}
function transformRawPath(rawPath, a, b, c, d, tx, ty) {
    var j = rawPath.length, segment, l, i, x, y;
    while(--j > -1){
        segment = rawPath[j];
        l = segment.length;
        for(i = 0; i < l; i += 2){
            x = segment[i];
            y = segment[i + 1];
            segment[i] = x * a + y * c + tx;
            segment[i + 1] = x * b + y * d + ty;
        }
    }
    rawPath._dirty = 1;
    return rawPath;
}
function arcToSegment(lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
    if (lastX === x && lastY === y) return;
    rx = _abs(rx);
    ry = _abs(ry);
    var angleRad = angle % 360 * _DEG2RAD, cosAngle = _cos(angleRad), sinAngle = _sin(angleRad), PI = Math.PI, TWOPI = PI * 2, dx2 = (lastX - x) / 2, dy2 = (lastY - y) / 2, x1 = cosAngle * dx2 + sinAngle * dy2, y1 = -sinAngle * dx2 + cosAngle * dy2, x1_sq = x1 * x1, y1_sq = y1 * y1, radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);
    if (radiiCheck > 1) {
        rx = _sqrt(radiiCheck) * rx;
        ry = _sqrt(radiiCheck) * ry;
    }
    var rx_sq = rx * rx, ry_sq = ry * ry, sq = (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) / (rx_sq * y1_sq + ry_sq * x1_sq);
    if (sq < 0) sq = 0;
    var coef = (largeArcFlag === sweepFlag ? -1 : 1) * _sqrt(sq), cx1 = coef * (rx * y1 / ry), cy1 = coef * -(ry * x1 / rx), sx2 = (lastX + x) / 2, sy2 = (lastY + y) / 2, cx = sx2 + (cosAngle * cx1 - sinAngle * cy1), cy = sy2 + (sinAngle * cx1 + cosAngle * cy1), ux = (x1 - cx1) / rx, uy = (y1 - cy1) / ry, vx = (-x1 - cx1) / rx, vy = (-y1 - cy1) / ry, temp = ux * ux + uy * uy, angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / _sqrt(temp)), angleExtent = (ux * vy - uy * vx < 0 ? -1 : 1) * Math.acos((ux * vx + uy * vy) / _sqrt(temp * (vx * vx + vy * vy)));
    isNaN(angleExtent) && (angleExtent = PI); //rare edge case. Math.cos(-1) is NaN.
    if (!sweepFlag && angleExtent > 0) angleExtent -= TWOPI;
    else if (sweepFlag && angleExtent < 0) angleExtent += TWOPI;
    angleStart %= TWOPI;
    angleExtent %= TWOPI;
    var segments = Math.ceil(_abs(angleExtent) / (TWOPI / 4)), rawPath = [], angleIncrement = angleExtent / segments, controlLength = 4 / 3 * _sin(angleIncrement / 2) / (1 + _cos(angleIncrement / 2)), ma = cosAngle * rx, mb = sinAngle * rx, mc = sinAngle * -ry, md = cosAngle * ry, i;
    for(i = 0; i < segments; i++){
        angle = angleStart + i * angleIncrement;
        x1 = _cos(angle);
        y1 = _sin(angle);
        ux = _cos(angle += angleIncrement);
        uy = _sin(angle);
        rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
    } //now transform according to the actual size of the ellipse/arc (the beziers were noramlized, between 0 and 1 on a circle).
    for(i = 0; i < rawPath.length; i += 2){
        x1 = rawPath[i];
        y1 = rawPath[i + 1];
        rawPath[i] = x1 * ma + y1 * mc + cx;
        rawPath[i + 1] = x1 * mb + y1 * md + cy;
    }
    rawPath[i - 2] = x; //always set the end to exactly where it's supposed to be
    rawPath[i - 1] = y;
    return rawPath;
} //Spits back a RawPath with absolute coordinates. Each segment starts with a "moveTo" command (x coordinate, then y) and then 2 control points (x, y, x, y), then anchor. The goal is to minimize memory and maximize speed.
function stringToRawPath(d) {
    var a = (d + "").replace(_scientific, function(m) {
        var n = +m;
        return n < 0.0001 && n > -0.0001 ? 0 : n;
    }).match(_svgPathExp) || [], //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
    path = [], relativeX = 0, relativeY = 0, twoThirds = 2 / 3, elements = a.length, points = 0, errorMessage = "ERROR: malformed path: " + d, i, j, x, y, command, isRelative, segment, startX, startY, difX, difY, beziers, prevCommand, flag1, flag2, line = function line(sx, sy, ex, ey) {
        difX = (ex - sx) / 3;
        difY = (ey - sy) / 3;
        segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
    };
    if (!d || !isNaN(a[0]) || isNaN(a[1])) {
        console.log(errorMessage);
        return path;
    }
    for(i = 0; i < elements; i++){
        prevCommand = command;
        if (isNaN(a[i])) {
            command = a[i].toUpperCase();
            isRelative = command !== a[i]; //lower case means relative
        } else //commands like "C" can be strung together without any new command characters between.
        i--;
        x = +a[i + 1];
        y = +a[i + 2];
        if (isRelative) {
            x += relativeX;
            y += relativeY;
        }
        if (!i) {
            startX = x;
            startY = y;
        } // "M" (move)
        if (command === "M") {
            if (segment) {
                if (segment.length < 8) //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
                path.length -= 1;
                else points += segment.length;
            }
            relativeX = startX = x;
            relativeY = startY = y;
            segment = [
                x,
                y
            ];
            path.push(segment);
            i += 2;
            command = "L"; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").
        // "C" (cubic bezier)
        } else if (command === "C") {
            if (!segment) segment = [
                0,
                0
            ];
            if (!isRelative) relativeX = relativeY = 0;
             //note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.
            segment.push(x, y, relativeX + a[i + 3] * 1, relativeY + a[i + 4] * 1, relativeX += a[i + 5] * 1, relativeY += a[i + 6] * 1);
            i += 6; // "S" (continuation of cubic bezier)
        } else if (command === "S") {
            difX = relativeX;
            difY = relativeY;
            if (prevCommand === "C" || prevCommand === "S") {
                difX += relativeX - segment[segment.length - 4];
                difY += relativeY - segment[segment.length - 3];
            }
            if (!isRelative) relativeX = relativeY = 0;
            segment.push(difX, difY, x, y, relativeX += a[i + 3] * 1, relativeY += a[i + 4] * 1);
            i += 4; // "Q" (quadratic bezier)
        } else if (command === "Q") {
            difX = relativeX + (x - relativeX) * twoThirds;
            difY = relativeY + (y - relativeY) * twoThirds;
            if (!isRelative) relativeX = relativeY = 0;
            relativeX += a[i + 3] * 1;
            relativeY += a[i + 4] * 1;
            segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
            i += 4; // "T" (continuation of quadratic bezier)
        } else if (command === "T") {
            difX = relativeX - segment[segment.length - 4];
            difY = relativeY - segment[segment.length - 3];
            segment.push(relativeX + difX, relativeY + difY, x + (relativeX + difX * 1.5 - x) * twoThirds, y + (relativeY + difY * 1.5 - y) * twoThirds, relativeX = x, relativeY = y);
            i += 2; // "H" (horizontal line)
        } else if (command === "H") {
            line(relativeX, relativeY, relativeX = x, relativeY);
            i += 1; // "V" (vertical line)
        } else if (command === "V") {
            //adjust values because the first (and only one) isn't x in this case, it's y.
            line(relativeX, relativeY, relativeX, relativeY = x + (isRelative ? relativeY - relativeX : 0));
            i += 1; // "L" (line) or "Z" (close)
        } else if (command === "L" || command === "Z") {
            if (command === "Z") {
                x = startX;
                y = startY;
                segment.closed = true;
            }
            if (command === "L" || _abs(relativeX - x) > 0.5 || _abs(relativeY - y) > 0.5) {
                line(relativeX, relativeY, x, y);
                if (command === "L") i += 2;
            }
            relativeX = x;
            relativeY = y; // "A" (arc)
        } else if (command === "A") {
            flag1 = a[i + 4];
            flag2 = a[i + 5];
            difX = a[i + 6];
            difY = a[i + 7];
            j = 7;
            if (flag1.length > 1) {
                // for cases when the flags are merged, like "a8 8 0 018 8" (the 0 and 1 flags are WITH the x value of 8, but it could also be "a8 8 0 01-8 8" so it may include x or not)
                if (flag1.length < 3) {
                    difY = difX;
                    difX = flag2;
                    j--;
                } else {
                    difY = flag2;
                    difX = flag1.substr(2);
                    j -= 2;
                }
                flag2 = flag1.charAt(1);
                flag1 = flag1.charAt(0);
            }
            beziers = arcToSegment(relativeX, relativeY, +a[i + 1], +a[i + 2], +a[i + 3], +flag1, +flag2, (isRelative ? relativeX : 0) + difX * 1, (isRelative ? relativeY : 0) + difY * 1);
            i += j;
            if (beziers) for(j = 0; j < beziers.length; j++)segment.push(beziers[j]);
            relativeX = segment[segment.length - 2];
            relativeY = segment[segment.length - 1];
        } else console.log(errorMessage);
    }
    i = segment.length;
    if (i < 6) {
        //in case there's odd SVG like a M0,0 command at the very end.
        path.pop();
        i = 0;
    } else if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) segment.closed = true;
    path.totalPoints = points + i;
    return path;
}
function bezierToPoints(x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
    var x12 = (x1 + x2) / 2, y12 = (y1 + y2) / 2, x23 = (x2 + x3) / 2, y23 = (y2 + y3) / 2, x34 = (x3 + x4) / 2, y34 = (y3 + y4) / 2, x123 = (x12 + x23) / 2, y123 = (y12 + y23) / 2, x234 = (x23 + x34) / 2, y234 = (y23 + y34) / 2, x1234 = (x123 + x234) / 2, y1234 = (y123 + y234) / 2, dx = x4 - x1, dy = y4 - y1, d2 = _abs((x2 - x4) * dy - (y2 - y4) * dx), d3 = _abs((x3 - x4) * dy - (y3 - y4) * dx), length;
    if (!points) {
        points = [
            x1,
            y1,
            x4,
            y4
        ];
        index = 2;
    }
    points.splice(index || points.length - 2, 0, x1234, y1234);
    if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
        length = points.length;
        bezierToPoints(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);
        bezierToPoints(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 2 + (points.length - length));
    }
    return points;
}
function flatPointsToSegment(points, curviness) {
    if (curviness === void 0) curviness = 1;
    var x = points[0], y = 0, segment = [
        x,
        y
    ], i = 2;
    for(; i < points.length; i += 2)segment.push(x, y, points[i], y = (points[i] - x) * curviness / 2, x = points[i], -y);
    return segment;
}
function pointsToSegment(points, curviness) {
    //points = simplifyPoints(points, tolerance);
    _abs(points[0] - points[2]) < 1e-4 && _abs(points[1] - points[3]) < 1e-4 && (points = points.slice(2)); // if the first two points are super close, dump the first one.
    var l = points.length - 2, x = +points[0], y = +points[1], nextX = +points[2], nextY = +points[3], segment = [
        x,
        y,
        x,
        y
    ], dx2 = nextX - x, dy2 = nextY - y, closed = Math.abs(points[l] - x) < 0.001 && Math.abs(points[l + 1] - y) < 0.001, prevX, prevY, i, dx1, dy1, r1, r2, r3, tl, mx1, mx2, mxm, my1, my2, mym;
    if (closed) {
        // if the start and end points are basically on top of each other, close the segment by adding the 2nd point to the end, and the 2nd-to-last point to the beginning (we'll remove them at the end, but this allows the curvature to look perfect)
        points.push(nextX, nextY);
        nextX = x;
        nextY = y;
        x = points[l - 2];
        y = points[l - 1];
        points.unshift(x, y);
        l += 4;
    }
    curviness = curviness || curviness === 0 ? +curviness : 1;
    for(i = 2; i < l; i += 2){
        prevX = x;
        prevY = y;
        x = nextX;
        y = nextY;
        nextX = +points[i + 2];
        nextY = +points[i + 3];
        if (x === nextX && y === nextY) continue;
        dx1 = dx2;
        dy1 = dy2;
        dx2 = nextX - x;
        dy2 = nextY - y;
        r1 = _sqrt(dx1 * dx1 + dy1 * dy1); // r1, r2, and r3 correlate x and y (and z in the future). Basically 2D or 3D hypotenuse
        r2 = _sqrt(dx2 * dx2 + dy2 * dy2);
        r3 = _sqrt(Math.pow(dx2 / r2 + dx1 / r1, 2) + Math.pow(dy2 / r2 + dy1 / r1, 2));
        tl = (r1 + r2) * curviness * 0.25 / r3;
        mx1 = x - (x - prevX) * (r1 ? tl / r1 : 0);
        mx2 = x + (nextX - x) * (r2 ? tl / r2 : 0);
        mxm = x - (mx1 + ((mx2 - mx1) * (r1 * 3 / (r1 + r2) + 0.5) / 4 || 0));
        my1 = y - (y - prevY) * (r1 ? tl / r1 : 0);
        my2 = y + (nextY - y) * (r2 ? tl / r2 : 0);
        mym = y - (my1 + ((my2 - my1) * (r1 * 3 / (r1 + r2) + 0.5) / 4 || 0));
        if (x !== prevX || y !== prevY) segment.push(_round(mx1 + mxm), _round(my1 + mym), _round(x), _round(y), _round(mx2 + mxm), _round(my2 + mym));
    }
    x !== nextX || y !== nextY || segment.length < 4 ? segment.push(_round(nextX), _round(nextY), _round(nextX), _round(nextY)) : segment.length -= 2;
    if (segment.length === 2) // only one point!
    segment.push(x, y, x, y, x, y);
    else if (closed) {
        segment.splice(0, 6);
        segment.length = segment.length - 6;
    }
    return segment;
}
function pointToSegDist(x, y, x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1, t;
    if (dx || dy) {
        t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
            x1 = x2;
            y1 = y2;
        } else if (t > 0) {
            x1 += dx * t;
            y1 += dy * t;
        }
    }
    return Math.pow(x - x1, 2) + Math.pow(y - y1, 2);
}
function simplifyStep(points, first, last, tolerance, simplified) {
    var maxSqDist = tolerance, firstX = points[first], firstY = points[first + 1], lastX = points[last], lastY = points[last + 1], index, i, d;
    for(i = first + 2; i < last; i += 2){
        d = pointToSegDist(points[i], points[i + 1], firstX, firstY, lastX, lastY);
        if (d > maxSqDist) {
            index = i;
            maxSqDist = d;
        }
    }
    if (maxSqDist > tolerance) {
        index - first > 2 && simplifyStep(points, first, index, tolerance, simplified);
        simplified.push(points[index], points[index + 1]);
        last - index > 2 && simplifyStep(points, index, last, tolerance, simplified);
    }
} //points is an array of x/y values like [x, y, x, y, x, y]
function simplifyPoints(points, tolerance) {
    var prevX = parseFloat(points[0]), prevY = parseFloat(points[1]), temp = [
        prevX,
        prevY
    ], l = points.length - 2, i, x, y, dx, dy, result, last;
    tolerance = Math.pow(tolerance || 1, 2);
    for(i = 2; i < l; i += 2){
        x = parseFloat(points[i]);
        y = parseFloat(points[i + 1]);
        dx = prevX - x;
        dy = prevY - y;
        if (dx * dx + dy * dy > tolerance) {
            temp.push(x, y);
            prevX = x;
            prevY = y;
        }
    }
    temp.push(parseFloat(points[l]), parseFloat(points[l + 1]));
    last = temp.length - 2;
    result = [
        temp[0],
        temp[1]
    ];
    simplifyStep(temp, 0, last, tolerance, result);
    result.push(temp[last], temp[last + 1]);
    return result;
}
function getClosestProgressOnBezier(iterations, px, py, start, end, slices, x0, y0, x1, y1, x2, y2, x3, y3) {
    var inc = (end - start) / slices, best = 0, t = start, x, y, d, dx, dy, inv;
    _bestDistance = _largeNum;
    while(t <= end){
        inv = 1 - t;
        x = inv * inv * inv * x0 + 3 * inv * inv * t * x1 + 3 * inv * t * t * x2 + t * t * t * x3;
        y = inv * inv * inv * y0 + 3 * inv * inv * t * y1 + 3 * inv * t * t * y2 + t * t * t * y3;
        dx = x - px;
        dy = y - py;
        d = dx * dx + dy * dy;
        if (d < _bestDistance) {
            _bestDistance = d;
            best = t;
        }
        t += inc;
    }
    return iterations > 1 ? getClosestProgressOnBezier(iterations - 1, px, py, Math.max(best - inc, 0), Math.min(best + inc, 1), slices, x0, y0, x1, y1, x2, y2, x3, y3) : best;
}
function getClosestData(rawPath, x, y, slices) {
    //returns an object with the closest j, i, and t (j is the segment index, i is the index of the point in that segment, and t is the time/progress along that bezier)
    var closest = {
        j: 0,
        i: 0,
        t: 0
    }, bestDistance = _largeNum, i, j, t, segment;
    for(j = 0; j < rawPath.length; j++){
        segment = rawPath[j];
        for(i = 0; i < segment.length; i += 6){
            t = getClosestProgressOnBezier(1, x, y, 0, 1, slices || 20, segment[i], segment[i + 1], segment[i + 2], segment[i + 3], segment[i + 4], segment[i + 5], segment[i + 6], segment[i + 7]);
            if (bestDistance > _bestDistance) {
                bestDistance = _bestDistance;
                closest.j = j;
                closest.i = i;
                closest.t = t;
            }
        }
    }
    return closest;
}
function subdivideSegmentNear(x, y, segment, slices, iterations) {
    var l = segment.length, bestDistance = _largeNum, bestT = 0, bestSegmentIndex = 0, t, i;
    slices = slices || 20;
    iterations = iterations || 3;
    for(i = 0; i < l; i += 6){
        t = getClosestProgressOnBezier(1, x, y, 0, 1, slices, segment[i], segment[i + 1], segment[i + 2], segment[i + 3], segment[i + 4], segment[i + 5], segment[i + 6], segment[i + 7]);
        if (bestDistance > _bestDistance) {
            bestDistance = _bestDistance;
            bestT = t;
            bestSegmentIndex = i;
        }
    }
    t = getClosestProgressOnBezier(iterations, x, y, bestT - 0.05, bestT + 0.05, slices, segment[bestSegmentIndex], segment[bestSegmentIndex + 1], segment[bestSegmentIndex + 2], segment[bestSegmentIndex + 3], segment[bestSegmentIndex + 4], segment[bestSegmentIndex + 5], segment[bestSegmentIndex + 6], segment[bestSegmentIndex + 7]);
    subdivideSegment(segment, bestSegmentIndex, t);
    return bestSegmentIndex + 6;
}
function rawPathToString(rawPath) {
    if (_isNumber(rawPath[0])) //in case a segment is passed in instead
    rawPath = [
        rawPath
    ];
    var result = "", l = rawPath.length, sl, s, i, segment;
    for(s = 0; s < l; s++){
        segment = rawPath[s];
        result += "M" + _round(segment[0]) + "," + _round(segment[1]) + " C";
        sl = segment.length;
        for(i = 2; i < sl; i++)result += _round(segment[i++]) + "," + _round(segment[i++]) + " " + _round(segment[i++]) + "," + _round(segment[i++]) + " " + _round(segment[i++]) + "," + _round(segment[i]) + " ";
        if (segment.closed) result += "z";
    }
    return result;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"kcpn5":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>Lenis);
function clamp(t, i, e) {
    return Math.max(t, Math.min(i, e));
}
class Animate {
    constructor(){
        this.isRunning = !1, this.value = 0, this.from = 0, this.to = 0, this.currentTime = 0;
    }
    advance(t) {
        var i;
        if (!this.isRunning) return;
        let e = !1;
        if (this.duration && this.easing) {
            this.currentTime += t;
            const i = clamp(0, this.currentTime / this.duration, 1);
            e = i >= 1;
            const s = e ? 1 : this.easing(i);
            this.value = this.from + (this.to - this.from) * s;
        } else this.lerp ? (this.value = function damp(t, i, e, s) {
            return function lerp(t, i, e) {
                return (1 - e) * t + e * i;
            }(t, i, 1 - Math.exp(-e * s));
        }(this.value, this.to, 60 * this.lerp, t), Math.round(this.value) === this.to && (this.value = this.to, e = !0)) : (this.value = this.to, e = !0);
        e && this.stop(), null === (i = this.onUpdate) || void 0 === i || i.call(this, this.value, e);
    }
    stop() {
        this.isRunning = !1;
    }
    fromTo(t, i, { lerp: e, duration: s, easing: o, onStart: n, onUpdate: l }) {
        this.from = this.value = t, this.to = i, this.lerp = e, this.duration = s, this.easing = o, this.currentTime = 0, this.isRunning = !0, null == n || n(), this.onUpdate = l;
    }
}
class Dimensions {
    constructor(t, i, { autoResize: e = !0, debounce: s = 250 } = {}){
        this.wrapper = t, this.content = i, this.width = 0, this.height = 0, this.scrollHeight = 0, this.scrollWidth = 0, this.resize = ()=>{
            this.onWrapperResize(), this.onContentResize();
        }, this.onWrapperResize = ()=>{
            this.wrapper instanceof Window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
        }, this.onContentResize = ()=>{
            this.wrapper instanceof Window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth);
        }, e && (this.debouncedResize = function debounce(t, i) {
            let e;
            return function(...s) {
                let o = this;
                clearTimeout(e), e = setTimeout(()=>{
                    e = void 0, t.apply(o, s);
                }, i);
            };
        }(this.resize, s), this.wrapper instanceof Window ? window.addEventListener("resize", this.debouncedResize, !1) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize();
    }
    destroy() {
        var t, i;
        null === (t = this.wrapperResizeObserver) || void 0 === t || t.disconnect(), null === (i = this.contentResizeObserver) || void 0 === i || i.disconnect(), this.wrapper === window && this.debouncedResize && window.removeEventListener("resize", this.debouncedResize, !1);
    }
    get limit() {
        return {
            x: this.scrollWidth - this.width,
            y: this.scrollHeight - this.height
        };
    }
}
class Emitter {
    constructor(){
        this.events = {};
    }
    emit(t, ...i) {
        var e;
        let s = this.events[t] || [];
        for(let t = 0, o = s.length; t < o; t++)null === (e = s[t]) || void 0 === e || e.call(s, ...i);
    }
    on(t, i) {
        var e;
        return (null === (e = this.events[t]) || void 0 === e ? void 0 : e.push(i)) || (this.events[t] = [
            i
        ]), ()=>{
            var e;
            this.events[t] = null === (e = this.events[t]) || void 0 === e ? void 0 : e.filter((t)=>i !== t);
        };
    }
    off(t, i) {
        var e;
        this.events[t] = null === (e = this.events[t]) || void 0 === e ? void 0 : e.filter((t)=>i !== t);
    }
    destroy() {
        this.events = {};
    }
}
const t = 100 / 6, i = {
    passive: !1
};
class VirtualScroll {
    constructor(e, s = {
        wheelMultiplier: 1,
        touchMultiplier: 1
    }){
        this.element = e, this.options = s, this.touchStart = {
            x: 0,
            y: 0
        }, this.lastDelta = {
            x: 0,
            y: 0
        }, this.window = {
            width: 0,
            height: 0
        }, this.emitter = new Emitter, this.onTouchStart = (t)=>{
            const { clientX: i, clientY: e } = t.targetTouches ? t.targetTouches[0] : t;
            this.touchStart.x = i, this.touchStart.y = e, this.lastDelta = {
                x: 0,
                y: 0
            }, this.emitter.emit("scroll", {
                deltaX: 0,
                deltaY: 0,
                event: t
            });
        }, this.onTouchMove = (t)=>{
            const { clientX: i, clientY: e } = t.targetTouches ? t.targetTouches[0] : t, s = -(i - this.touchStart.x) * this.options.touchMultiplier, o = -(e - this.touchStart.y) * this.options.touchMultiplier;
            this.touchStart.x = i, this.touchStart.y = e, this.lastDelta = {
                x: s,
                y: o
            }, this.emitter.emit("scroll", {
                deltaX: s,
                deltaY: o,
                event: t
            });
        }, this.onTouchEnd = (t)=>{
            this.emitter.emit("scroll", {
                deltaX: this.lastDelta.x,
                deltaY: this.lastDelta.y,
                event: t
            });
        }, this.onWheel = (i)=>{
            let { deltaX: e, deltaY: s, deltaMode: o } = i;
            e *= 1 === o ? t : 2 === o ? this.window.width : 1, s *= 1 === o ? t : 2 === o ? this.window.height : 1, e *= this.options.wheelMultiplier, s *= this.options.wheelMultiplier, this.emitter.emit("scroll", {
                deltaX: e,
                deltaY: s,
                event: i
            });
        }, this.onWindowResize = ()=>{
            this.window = {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }, window.addEventListener("resize", this.onWindowResize, !1), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, i), this.element.addEventListener("touchstart", this.onTouchStart, i), this.element.addEventListener("touchmove", this.onTouchMove, i), this.element.addEventListener("touchend", this.onTouchEnd, i);
    }
    on(t, i) {
        return this.emitter.on(t, i);
    }
    destroy() {
        this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize, !1), this.element.removeEventListener("wheel", this.onWheel, i), this.element.removeEventListener("touchstart", this.onTouchStart, i), this.element.removeEventListener("touchmove", this.onTouchMove, i), this.element.removeEventListener("touchend", this.onTouchEnd, i);
    }
}
class Lenis {
    constructor({ wrapper: t = window, content: i = document.documentElement, eventsTarget: e = t, smoothWheel: s = !0, syncTouch: o = !1, syncTouchLerp: n = .075, touchInertiaMultiplier: l = 35, duration: r, easing: h = (t)=>Math.min(1, 1.001 - Math.pow(2, -10 * t)), lerp: a = .1, infinite: c = !1, orientation: u = "vertical", gestureOrientation: d = "vertical", touchMultiplier: p = 1, wheelMultiplier: m = 1, autoResize: v = !0, prevent: g, virtualScroll: S, __experimental__naiveDimensions: w = !1 } = {}){
        this._isScrolling = !1, this._isStopped = !1, this._isLocked = !1, this._preventNextNativeScrollEvent = !1, this._resetVelocityTimeout = null, this.time = 0, this.userData = {}, this.lastVelocity = 0, this.velocity = 0, this.direction = 0, this.animate = new Animate, this.emitter = new Emitter, this.onPointerDown = (t)=>{
            1 === t.button && this.reset();
        }, this.onVirtualScroll = (t)=>{
            if ("function" == typeof this.options.virtualScroll && !1 === this.options.virtualScroll(t)) return;
            const { deltaX: i, deltaY: e, event: s } = t;
            if (this.emitter.emit("virtual-scroll", {
                deltaX: i,
                deltaY: e,
                event: s
            }), s.ctrlKey) return;
            const o = s.type.includes("touch"), n = s.type.includes("wheel");
            this.isTouching = "touchstart" === s.type || "touchmove" === s.type;
            if (this.options.syncTouch && o && "touchstart" === s.type && !this.isStopped && !this.isLocked) return void this.reset();
            const l = 0 === i && 0 === e, r = "vertical" === this.options.gestureOrientation && 0 === e || "horizontal" === this.options.gestureOrientation && 0 === i;
            if (l || r) return;
            let h = s.composedPath();
            h = h.slice(0, h.indexOf(this.rootElement));
            const a = this.options.prevent;
            if (h.find((t)=>{
                var i, e, s, l, r;
                return t instanceof HTMLElement && ("function" == typeof a && (null == a ? void 0 : a(t)) || (null === (i = t.hasAttribute) || void 0 === i ? void 0 : i.call(t, "data-lenis-prevent")) || o && (null === (e = t.hasAttribute) || void 0 === e ? void 0 : e.call(t, "data-lenis-prevent-touch")) || n && (null === (s = t.hasAttribute) || void 0 === s ? void 0 : s.call(t, "data-lenis-prevent-wheel")) || (null === (l = t.classList) || void 0 === l ? void 0 : l.contains("lenis")) && !(null === (r = t.classList) || void 0 === r ? void 0 : r.contains("lenis-stopped")));
            })) return;
            if (this.isStopped || this.isLocked) return void s.preventDefault();
            if (!(this.options.syncTouch && o || this.options.smoothWheel && n)) return this.isScrolling = "native", void this.animate.stop();
            s.preventDefault();
            let c = e;
            "both" === this.options.gestureOrientation ? c = Math.abs(e) > Math.abs(i) ? e : i : "horizontal" === this.options.gestureOrientation && (c = i);
            const u = o && this.options.syncTouch, d = o && "touchend" === s.type && Math.abs(c) > 5;
            d && (c = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + c, Object.assign({
                programmatic: !1
            }, u ? {
                lerp: d ? this.options.syncTouchLerp : 1
            } : {
                lerp: this.options.lerp,
                duration: this.options.duration,
                easing: this.options.easing
            }));
        }, this.onNativeScroll = ()=>{
            if (null !== this._resetVelocityTimeout && (clearTimeout(this._resetVelocityTimeout), this._resetVelocityTimeout = null), this._preventNextNativeScrollEvent) this._preventNextNativeScrollEvent = !1;
            else if (!1 === this.isScrolling || "native" === this.isScrolling) {
                const t = this.animatedScroll;
                this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity, this.velocity = this.animatedScroll - t, this.direction = Math.sign(this.animatedScroll - t), this.isScrolling = "native", this.emit(), 0 !== this.velocity && (this._resetVelocityTimeout = setTimeout(()=>{
                    this.lastVelocity = this.velocity, this.velocity = 0, this.isScrolling = !1, this.emit();
                }, 400));
            }
        }, window.lenisVersion = "1.1.13", t && t !== document.documentElement && t !== document.body || (t = window), this.options = {
            wrapper: t,
            content: i,
            eventsTarget: e,
            smoothWheel: s,
            syncTouch: o,
            syncTouchLerp: n,
            touchInertiaMultiplier: l,
            duration: r,
            easing: h,
            lerp: a,
            infinite: c,
            gestureOrientation: d,
            orientation: u,
            touchMultiplier: p,
            wheelMultiplier: m,
            autoResize: v,
            prevent: g,
            virtualScroll: S,
            __experimental__naiveDimensions: w
        }, this.dimensions = new Dimensions(t, i, {
            autoResize: v
        }), this.updateClassName(), this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1), this.options.wrapper.addEventListener("pointerdown", this.onPointerDown, !1), this.virtualScroll = new VirtualScroll(e, {
            touchMultiplier: p,
            wheelMultiplier: m
        }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
        this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1), this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown, !1), this.virtualScroll.destroy(), this.dimensions.destroy(), this.cleanUpClassName();
    }
    on(t, i) {
        return this.emitter.on(t, i);
    }
    off(t, i) {
        return this.emitter.off(t, i);
    }
    setScroll(t) {
        this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t;
    }
    resize() {
        this.dimensions.resize(), this.animatedScroll = this.targetScroll = this.actualScroll, this.emit();
    }
    emit() {
        this.emitter.emit("scroll", this);
    }
    reset() {
        this.isLocked = !1, this.isScrolling = !1, this.animatedScroll = this.targetScroll = this.actualScroll, this.lastVelocity = this.velocity = 0, this.animate.stop();
    }
    start() {
        this.isStopped && (this.isStopped = !1, this.reset());
    }
    stop() {
        this.isStopped || (this.isStopped = !0, this.animate.stop(), this.reset());
    }
    raf(t) {
        const i = t - (this.time || t);
        this.time = t, this.animate.advance(.001 * i);
    }
    scrollTo(t, { offset: i = 0, immediate: e = !1, lock: s = !1, duration: o = this.options.duration, easing: n = this.options.easing, lerp: l = this.options.lerp, onStart: r, onComplete: h, force: a = !1, programmatic: c = !0, userData: u } = {}) {
        if (!this.isStopped && !this.isLocked || a) {
            if ("string" == typeof t && [
                "top",
                "left",
                "start"
            ].includes(t)) t = 0;
            else if ("string" == typeof t && [
                "bottom",
                "right",
                "end"
            ].includes(t)) t = this.limit;
            else {
                let e;
                if ("string" == typeof t ? e = document.querySelector(t) : t instanceof HTMLElement && (null == t ? void 0 : t.nodeType) && (e = t), e) {
                    if (this.options.wrapper !== window) {
                        const t = this.rootElement.getBoundingClientRect();
                        i -= this.isHorizontal ? t.left : t.top;
                    }
                    const s = e.getBoundingClientRect();
                    t = (this.isHorizontal ? s.left : s.top) + this.animatedScroll;
                }
            }
            if ("number" == typeof t) {
                if (t += i, t = Math.round(t), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : t = clamp(0, t, this.limit), t === this.targetScroll) return null == r || r(this), void (null == h || h(this));
                if (this.userData = null != u ? u : {}, e) return this.animatedScroll = this.targetScroll = t, this.setScroll(this.scroll), this.reset(), this.preventNextNativeScrollEvent(), this.emit(), null == h || h(this), void (this.userData = {});
                c || (this.targetScroll = t), this.animate.fromTo(this.animatedScroll, t, {
                    duration: o,
                    easing: n,
                    lerp: l,
                    onStart: ()=>{
                        s && (this.isLocked = !0), this.isScrolling = "smooth", null == r || r(this);
                    },
                    onUpdate: (t, i)=>{
                        this.isScrolling = "smooth", this.lastVelocity = this.velocity, this.velocity = t - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t, this.setScroll(this.scroll), c && (this.targetScroll = t), i || this.emit(), i && (this.reset(), this.emit(), null == h || h(this), this.userData = {}, this.preventNextNativeScrollEvent());
                    }
                });
            }
        }
    }
    preventNextNativeScrollEvent() {
        this._preventNextNativeScrollEvent = !0, requestAnimationFrame(()=>{
            this._preventNextNativeScrollEvent = !1;
        });
    }
    get rootElement() {
        return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
    }
    get limit() {
        return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    get isHorizontal() {
        return "horizontal" === this.options.orientation;
    }
    get actualScroll() {
        return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
    }
    get scroll() {
        return this.options.infinite ? function modulo(t, i) {
            return (t % i + i) % i;
        }(this.animatedScroll, this.limit) : this.animatedScroll;
    }
    get progress() {
        return 0 === this.limit ? 1 : this.scroll / this.limit;
    }
    get isScrolling() {
        return this._isScrolling;
    }
    set isScrolling(t) {
        this._isScrolling !== t && (this._isScrolling = t, this.updateClassName());
    }
    get isStopped() {
        return this._isStopped;
    }
    set isStopped(t) {
        this._isStopped !== t && (this._isStopped = t, this.updateClassName());
    }
    get isLocked() {
        return this._isLocked;
    }
    set isLocked(t) {
        this._isLocked !== t && (this._isLocked = t, this.updateClassName());
    }
    get isSmooth() {
        return "smooth" === this.isScrolling;
    }
    get className() {
        let t = "lenis";
        return this.isStopped && (t += " lenis-stopped"), this.isLocked && (t += " lenis-locked"), this.isScrolling && (t += " lenis-scrolling"), "smooth" === this.isScrolling && (t += " lenis-smooth"), t;
    }
    updateClassName() {
        this.cleanUpClassName(), this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
    }
    cleanUpClassName() {
        this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8N00J":[function(require,module,exports,__globalThis) {
module.exports = Promise.all([
    import("./tinycli.85d9dc3b.js"),
    import("./tinycli.92d3a6e1.js")
]).then(()=>module.bundle.root('d6NTQ'));

},{"d6NTQ":"d6NTQ"}],"bMYMi":[function(require,module,exports,__globalThis) {
module.exports = import("./work-toc.d8601748.js").then(()=>module.bundle.root('bh7vx'));

},{"bh7vx":"bh7vx"}]},["hTkpg","7ZQXK"], "7ZQXK", "parcelRequire86c2")

//# sourceMappingURL=index_beta.a8e1416d.js.map
