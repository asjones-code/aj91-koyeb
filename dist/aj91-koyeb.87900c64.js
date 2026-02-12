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
})({"4twtF":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "ea919fa187900c64";
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

},{}],"5D30b":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _jquery = require("jquery");
var _routerJs = require("router_js");
var _routerJsDefault = parcelHelpers.interopDefault(_routerJs);
var router = new (0, _routerJsDefault.default)();
async function gql(query, variables = {}) {
    const data = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '032b81d9-8aff-4e25-b5dd-3fb4b43d0c31'
        },
        body: JSON.stringify({
            query
        })
    });
    return data.json();
}
const GET_USER_ARTICLES = `
query Publication{
  publication(host: "aj91.hashnode.dev"){
    isTeam
    title   
      posts(first: 10) {
            edges {
                node {
                  id
                  	slug
                    title
                    brief
                    url
                    content{
                    markdown
                    }
                }
            }
            totalDocuments
        }
    
  
  }
}`;
const showPost = `
query Publication{
  publication(host: "aj91.hashnode.dev"){
    isTeam
    title   
      posts(first: 10) {
            edges {
                node {
                  id
                  	slug
                    title
                    url
                    content{
                    markdown
                    }
                }
            }
        }
  }
}`;
gql(GET_USER_ARTICLES, {
    page: 0
}).then((result)=>{
    const article = result.data.publication.posts.edges[0].node;
    const title = result.data.publication.posts.edges[0].node.title;
    const url = result.data.publication.posts.edges[0].node.url;
    const slug = result.data.publication.posts.edges[0].node.slug;
    const md = result.data.publication.posts.edges[0].node.content.markdown;
    //console.log(article)
    console.log(slug);
    const pElement = document.querySelector("article p"); // Selects the <p> inside <article>
    const emElement = document.querySelector("article em"); // Selects the <p> inside <article>
    pElement.textContent = article.brief; // 
    emElement.textContent = title; // 
    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.textContent = title;
    linkElement.target = "_blank"; // Opens the link in a new tab
    // Clear the em element and append the new link
    emElement.innerHTML = '';
    emElement.appendChild(linkElement);
//linkElement.addEventListener("click", (event) => route(event, url, title, slug, md));
});
const route = (event, title, slug, md)=>{
    // Update the URL without reloading
    console.log(slug);
    // Log the title (for debugging or other purposes)
    //console.log(title);
    // Fetch post data and update the page content
    gql(showPost).then((postData)=>{
        history.pushState({}, slug, `blog/${slug}`);
        // Render HTML in a specific container, e.g., #content
        console.log(postData.data.publication.posts.edges[0].node.content);
        const text = postData.data.publication.posts.edges[0].node.content;
        const contentContainer = document.getElementById('content');
        contentContainer.innerHTML = `
                    <h1>${title}</h1>
                    <p>${JSON.stringify(text)}</p>
                `;
    }).catch((error)=>console.error("Error fetching post data:"));
};

},{"jquery":"dlwdd","router_js":"bFQvY","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"bFQvY":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _routerDefault.default));
parcelHelpers.export(exports, "InternalTransition", ()=>(0, _transitionDefault.default));
parcelHelpers.export(exports, "logAbort", ()=>(0, _transition.logAbort));
parcelHelpers.export(exports, "STATE_SYMBOL", ()=>(0, _transition.STATE_SYMBOL));
parcelHelpers.export(exports, "PARAMS_SYMBOL", ()=>(0, _transition.PARAMS_SYMBOL));
parcelHelpers.export(exports, "QUERY_PARAMS_SYMBOL", ()=>(0, _transition.QUERY_PARAMS_SYMBOL));
parcelHelpers.export(exports, "TransitionState", ()=>(0, _transitionStateDefault.default));
parcelHelpers.export(exports, "TransitionError", ()=>(0, _transitionState.TransitionError));
parcelHelpers.export(exports, "InternalRouteInfo", ()=>(0, _routeInfoDefault.default));
var _router = require("./router");
var _routerDefault = parcelHelpers.interopDefault(_router);
var _transition = require("./transition");
var _transitionDefault = parcelHelpers.interopDefault(_transition);
var _transitionState = require("./transition-state");
var _transitionStateDefault = parcelHelpers.interopDefault(_transitionState);
var _routeInfo = require("./route-info");
var _routeInfoDefault = parcelHelpers.interopDefault(_routeInfo);

},{"./router":"fQr0U","./transition":"eQZIA","./transition-state":"lAMtU","./route-info":"euUya","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"fQr0U":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _routeRecognizer = require("route-recognizer");
var _routeRecognizerDefault = parcelHelpers.interopDefault(_routeRecognizer);
var _rsvp = require("rsvp");
var _routeInfo = require("./route-info");
var _transition = require("./transition");
var _transitionDefault = parcelHelpers.interopDefault(_transition);
var _transitionAbortedError = require("./transition-aborted-error");
var _namedTransitionIntent = require("./transition-intent/named-transition-intent");
var _namedTransitionIntentDefault = parcelHelpers.interopDefault(_namedTransitionIntent);
var _urlTransitionIntent = require("./transition-intent/url-transition-intent");
var _urlTransitionIntentDefault = parcelHelpers.interopDefault(_urlTransitionIntent);
var _transitionState = require("./transition-state");
var _transitionStateDefault = parcelHelpers.interopDefault(_transitionState);
var _utils = require("./utils");
class Router {
    constructor(logger){
        this._lastQueryParams = {};
        this.state = undefined;
        this.oldState = undefined;
        this.activeTransition = undefined;
        this.currentRouteInfos = undefined;
        this._changedQueryParams = undefined;
        this.currentSequence = 0;
        this.log = logger;
        this.recognizer = new (0, _routeRecognizerDefault.default)();
        this.reset();
    }
    /**
      The main entry point into the router. The API is essentially
      the same as the `map` method in `route-recognizer`.
  
      This method extracts the String handler at the last `.to()`
      call and uses it as the name of the whole route.
  
      @param {Function} callback
    */ map(callback) {
        this.recognizer.map(callback, function(recognizer, routes) {
            for(let i = routes.length - 1, proceed = true; i >= 0 && proceed; --i){
                let route = routes[i];
                let handler = route.handler;
                recognizer.add(routes, {
                    as: handler
                });
                proceed = route.path === '/' || route.path === '' || handler.slice(-6) === '.index';
            }
        });
    }
    hasRoute(route) {
        return this.recognizer.hasRoute(route);
    }
    queryParamsTransition(changelist, wasTransitioning, oldState, newState) {
        this.fireQueryParamDidChange(newState, changelist);
        if (!wasTransitioning && this.activeTransition) // One of the routes in queryParamsDidChange
        // caused a transition. Just return that transition.
        return this.activeTransition;
        else {
            // Running queryParamsDidChange didn't change anything.
            // Just update query params and be on our way.
            // We have to return a noop transition that will
            // perform a URL update at the end. This gives
            // the user the ability to set the url update
            // method (default is replaceState).
            let newTransition = new (0, _transitionDefault.default)(this, undefined, undefined);
            newTransition.queryParamsOnly = true;
            oldState.queryParams = this.finalizeQueryParamChange(newState.routeInfos, newState.queryParams, newTransition);
            newTransition[0, _transition.QUERY_PARAMS_SYMBOL] = newState.queryParams;
            this.toReadOnlyInfos(newTransition, newState);
            this.routeWillChange(newTransition);
            newTransition.promise = newTransition.promise.then((result)=>{
                if (!newTransition.isAborted) {
                    this._updateURL(newTransition, oldState);
                    this.didTransition(this.currentRouteInfos);
                    this.toInfos(newTransition, newState.routeInfos, true);
                    this.routeDidChange(newTransition);
                }
                return result;
            }, null, (0, _utils.promiseLabel)('Transition complete'));
            return newTransition;
        }
    }
    transitionByIntent(intent, isIntermediate) {
        try {
            return this.getTransitionByIntent(intent, isIntermediate);
        } catch (e) {
            return new (0, _transitionDefault.default)(this, intent, undefined, e, undefined);
        }
    }
    recognize(url) {
        let intent = new (0, _urlTransitionIntentDefault.default)(this, url);
        let newState = this.generateNewState(intent);
        if (newState === null) return newState;
        let readonlyInfos = (0, _routeInfo.toReadOnlyRouteInfo)(newState.routeInfos, newState.queryParams, {
            includeAttributes: false,
            localizeMapUpdates: true
        });
        return readonlyInfos[readonlyInfos.length - 1];
    }
    recognizeAndLoad(url) {
        let intent = new (0, _urlTransitionIntentDefault.default)(this, url);
        let newState = this.generateNewState(intent);
        if (newState === null) return (0, _rsvp.Promise).reject(`URL ${url} was not recognized`);
        let newTransition = new (0, _transitionDefault.default)(this, intent, newState, undefined);
        return newTransition.then(()=>{
            let routeInfosWithAttributes = (0, _routeInfo.toReadOnlyRouteInfo)(newState.routeInfos, newTransition[0, _transition.QUERY_PARAMS_SYMBOL], {
                includeAttributes: true,
                localizeMapUpdates: false
            });
            return routeInfosWithAttributes[routeInfosWithAttributes.length - 1];
        });
    }
    generateNewState(intent) {
        try {
            return intent.applyToState(this.state, false);
        } catch (e) {
            return null;
        }
    }
    getTransitionByIntent(intent, isIntermediate) {
        let wasTransitioning = !!this.activeTransition;
        let oldState = wasTransitioning ? this.activeTransition[0, _transition.STATE_SYMBOL] : this.state;
        let newTransition;
        let newState = intent.applyToState(oldState, isIntermediate);
        let queryParamChangelist = (0, _utils.getChangelist)(oldState.queryParams, newState.queryParams);
        if (routeInfosEqual(newState.routeInfos, oldState.routeInfos)) {
            // This is a no-op transition. See if query params changed.
            if (queryParamChangelist) {
                let newTransition = this.queryParamsTransition(queryParamChangelist, wasTransitioning, oldState, newState);
                newTransition.queryParamsOnly = true;
                // SAFETY: The returned OpaqueTransition should actually be this.
                return newTransition;
            }
            // No-op. No need to create a new transition.
            return this.activeTransition || new (0, _transitionDefault.default)(this, undefined, undefined);
        }
        if (isIntermediate) {
            let transition = new (0, _transitionDefault.default)(this, undefined, newState);
            transition.isIntermediate = true;
            this.toReadOnlyInfos(transition, newState);
            this.setupContexts(newState, transition);
            this.routeWillChange(transition);
            return this.activeTransition;
        }
        // Create a new transition to the destination route.
        newTransition = new (0, _transitionDefault.default)(this, intent, newState, undefined, this.activeTransition);
        // transition is to same route with same params, only query params differ.
        // not caught above probably because refresh() has been used
        if (routeInfosSameExceptQueryParams(newState.routeInfos, oldState.routeInfos)) newTransition.queryParamsOnly = true;
        this.toReadOnlyInfos(newTransition, newState);
        // Abort and usurp any previously active transition.
        if (this.activeTransition) this.activeTransition.redirect(newTransition);
        this.activeTransition = newTransition;
        // Transition promises by default resolve with resolved state.
        // For our purposes, swap out the promise to resolve
        // after the transition has been finalized.
        newTransition.promise = newTransition.promise.then((result)=>{
            return this.finalizeTransition(newTransition, result);
        }, null, (0, _utils.promiseLabel)('Settle transition promise when transition is finalized'));
        if (!wasTransitioning) this.notifyExistingHandlers(newState, newTransition);
        this.fireQueryParamDidChange(newState, queryParamChangelist);
        return newTransition;
    }
    /**
    @private
  
    Begins and returns a Transition based on the provided
    arguments. Accepts arguments in the form of both URL
    transitions and named transitions.
  
    @param {Router} router
    @param {Array[Object]} args arguments passed to transitionTo,
      replaceWith, or handleURL
  */ doTransition(name, modelsArray = [], isIntermediate = false) {
        let lastArg = modelsArray[modelsArray.length - 1];
        let queryParams = {};
        if (lastArg && Object.prototype.hasOwnProperty.call(lastArg, 'queryParams')) // We just checked this.
        // TODO: Use an assertion?
        queryParams = modelsArray.pop().queryParams;
        let intent;
        if (name === undefined) {
            (0, _utils.log)(this, 'Updating query params');
            // A query param update is really just a transition
            // into the route you're already on.
            let { routeInfos } = this.state;
            intent = new (0, _namedTransitionIntentDefault.default)(this, routeInfos[routeInfos.length - 1].name, undefined, [], queryParams);
        } else if (name.charAt(0) === '/') {
            (0, _utils.log)(this, 'Attempting URL transition to ' + name);
            intent = new (0, _urlTransitionIntentDefault.default)(this, name);
        } else {
            (0, _utils.log)(this, 'Attempting transition to ' + name);
            intent = new (0, _namedTransitionIntentDefault.default)(this, name, undefined, // SAFETY: We know this to be the case since we removed the last item if it was QPs
            modelsArray, queryParams);
        }
        return this.transitionByIntent(intent, isIntermediate);
    }
    /**
    @private
  
    Updates the URL (if necessary) and calls `setupContexts`
    to update the router's array of `currentRouteInfos`.
   */ finalizeTransition(transition, newState) {
        try {
            (0, _utils.log)(transition.router, transition.sequence, 'Resolved all models on destination route; finalizing transition.');
            let routeInfos = newState.routeInfos;
            // Run all the necessary enter/setup/exit hooks
            this.setupContexts(newState, transition);
            // Check if a redirect occurred in enter/setup
            if (transition.isAborted) {
                // TODO: cleaner way? distinguish b/w targetRouteInfos?
                this.state.routeInfos = this.currentRouteInfos;
                return (0, _rsvp.Promise).reject((0, _transition.logAbort)(transition));
            }
            this._updateURL(transition, newState);
            transition.isActive = false;
            this.activeTransition = undefined;
            this.triggerEvent(this.currentRouteInfos, true, 'didTransition', []);
            this.didTransition(this.currentRouteInfos);
            this.toInfos(transition, newState.routeInfos, true);
            this.routeDidChange(transition);
            (0, _utils.log)(this, transition.sequence, 'TRANSITION COMPLETE.');
            // Resolve with the final route.
            return routeInfos[routeInfos.length - 1].route;
        } catch (e) {
            if (!(0, _transitionAbortedError.isTransitionAborted)(e)) {
                let infos = transition[0, _transition.STATE_SYMBOL].routeInfos;
                transition.trigger(true, 'error', e, transition, infos[infos.length - 1].route);
                transition.abort();
            }
            throw e;
        }
    }
    /**
    @private
  
    Takes an Array of `RouteInfo`s, figures out which ones are
    exiting, entering, or changing contexts, and calls the
    proper route hooks.
  
    For example, consider the following tree of routes. Each route is
    followed by the URL segment it handles.
  
    ```
    |~index ("/")
    | |~posts ("/posts")
    | | |-showPost ("/:id")
    | | |-newPost ("/new")
    | | |-editPost ("/edit")
    | |~about ("/about/:id")
    ```
  
    Consider the following transitions:
  
    1. A URL transition to `/posts/1`.
       1. Triggers the `*model` callbacks on the
          `index`, `posts`, and `showPost` routes
       2. Triggers the `enter` callback on the same
       3. Triggers the `setup` callback on the same
    2. A direct transition to `newPost`
       1. Triggers the `exit` callback on `showPost`
       2. Triggers the `enter` callback on `newPost`
       3. Triggers the `setup` callback on `newPost`
    3. A direct transition to `about` with a specified
       context object
       1. Triggers the `exit` callback on `newPost`
          and `posts`
       2. Triggers the `serialize` callback on `about`
       3. Triggers the `enter` callback on `about`
       4. Triggers the `setup` callback on `about`
  
    @param {Router} transition
    @param {TransitionState} newState
  */ setupContexts(newState, transition) {
        let partition = this.partitionRoutes(this.state, newState);
        let i, l, route;
        for(i = 0, l = partition.exited.length; i < l; i++){
            route = partition.exited[i].route;
            delete route.context;
            if (route !== undefined) {
                if (route._internalReset !== undefined) route._internalReset(true, transition);
                if (route.exit !== undefined) route.exit(transition);
            }
        }
        let oldState = this.oldState = this.state;
        this.state = newState;
        let currentRouteInfos = this.currentRouteInfos = partition.unchanged.slice();
        try {
            for(i = 0, l = partition.reset.length; i < l; i++){
                route = partition.reset[i].route;
                if (route !== undefined) {
                    if (route._internalReset !== undefined) route._internalReset(false, transition);
                }
            }
            for(i = 0, l = partition.updatedContext.length; i < l; i++)this.routeEnteredOrUpdated(currentRouteInfos, partition.updatedContext[i], false, transition);
            for(i = 0, l = partition.entered.length; i < l; i++)this.routeEnteredOrUpdated(currentRouteInfos, partition.entered[i], true, transition);
        } catch (e) {
            this.state = oldState;
            this.currentRouteInfos = oldState.routeInfos;
            throw e;
        }
        this.state.queryParams = this.finalizeQueryParamChange(currentRouteInfos, newState.queryParams, transition);
    }
    /**
    @private
  
    Fires queryParamsDidChange event
  */ fireQueryParamDidChange(newState, queryParamChangelist) {
        // If queryParams changed trigger event
        if (queryParamChangelist) {
            // This is a little hacky but we need some way of storing
            // changed query params given that no activeTransition
            // is guaranteed to have occurred.
            this._changedQueryParams = queryParamChangelist.all;
            this.triggerEvent(newState.routeInfos, true, 'queryParamsDidChange', [
                queryParamChangelist.changed,
                queryParamChangelist.all,
                queryParamChangelist.removed
            ]);
            this._changedQueryParams = undefined;
        }
    }
    /**
    @private
  
    Helper method used by setupContexts. Handles errors or redirects
    that may happen in enter/setup.
  */ routeEnteredOrUpdated(currentRouteInfos, routeInfo, enter, transition) {
        let route = routeInfo.route, context = routeInfo.context;
        function _routeEnteredOrUpdated(route) {
            if (enter) {
                if (route.enter !== undefined) route.enter(transition);
            }
            (0, _transitionAbortedError.throwIfAborted)(transition);
            route.context = context;
            if (route.contextDidChange !== undefined) route.contextDidChange();
            if (route.setup !== undefined) route.setup(context, transition);
            (0, _transitionAbortedError.throwIfAborted)(transition);
            currentRouteInfos.push(routeInfo);
            return route;
        }
        // If the route doesn't exist, it means we haven't resolved the route promise yet
        if (route === undefined) routeInfo.routePromise = routeInfo.routePromise.then(_routeEnteredOrUpdated);
        else _routeEnteredOrUpdated(route);
        return true;
    }
    /**
    @private
  
    This function is called when transitioning from one URL to
    another to determine which routes are no longer active,
    which routes are newly active, and which routes remain
    active but have their context changed.
  
    Take a list of old routes and new routes and partition
    them into four buckets:
  
    * unchanged: the route was active in both the old and
      new URL, and its context remains the same
    * updated context: the route was active in both the
      old and new URL, but its context changed. The route's
      `setup` method, if any, will be called with the new
      context.
    * exited: the route was active in the old URL, but is
      no longer active.
    * entered: the route was not active in the old URL, but
      is now active.
  
    The PartitionedRoutes structure has four fields:
  
    * `updatedContext`: a list of `RouteInfo` objects that
      represent routes that remain active but have a changed
      context
    * `entered`: a list of `RouteInfo` objects that represent
      routes that are newly active
    * `exited`: a list of `RouteInfo` objects that are no
      longer active.
    * `unchanged`: a list of `RouteInfo` objects that remain active.
  
    @param {Array[InternalRouteInfo]} oldRoutes a list of the route
      information for the previous URL (or `[]` if this is the
      first handled transition)
    @param {Array[InternalRouteInfo]} newRoutes a list of the route
      information for the new URL
  
    @return {Partition}
  */ partitionRoutes(oldState, newState) {
        let oldRouteInfos = oldState.routeInfos;
        let newRouteInfos = newState.routeInfos;
        let routes = {
            updatedContext: [],
            exited: [],
            entered: [],
            unchanged: [],
            reset: []
        };
        let routeChanged, contextChanged = false, i, l;
        for(i = 0, l = newRouteInfos.length; i < l; i++){
            let oldRouteInfo = oldRouteInfos[i], newRouteInfo = newRouteInfos[i];
            if (!oldRouteInfo || oldRouteInfo.route !== newRouteInfo.route) routeChanged = true;
            if (routeChanged) {
                routes.entered.push(newRouteInfo);
                if (oldRouteInfo) routes.exited.unshift(oldRouteInfo);
            } else if (contextChanged || oldRouteInfo.context !== newRouteInfo.context) {
                contextChanged = true;
                routes.updatedContext.push(newRouteInfo);
            } else routes.unchanged.push(oldRouteInfo);
        }
        for(i = newRouteInfos.length, l = oldRouteInfos.length; i < l; i++)routes.exited.unshift(oldRouteInfos[i]);
        routes.reset = routes.updatedContext.slice();
        routes.reset.reverse();
        return routes;
    }
    _updateURL(transition, state) {
        let urlMethod = transition.urlMethod;
        if (!urlMethod) return;
        let { routeInfos } = state;
        let { name: routeName } = routeInfos[routeInfos.length - 1];
        let params = {};
        for(let i = routeInfos.length - 1; i >= 0; --i){
            let routeInfo = routeInfos[i];
            (0, _utils.merge)(params, routeInfo.params);
            if (routeInfo.route.inaccessibleByURL) urlMethod = null;
        }
        if (urlMethod) {
            params.queryParams = transition._visibleQueryParams || state.queryParams;
            let url = this.recognizer.generate(routeName, params);
            // transitions during the initial transition must always use replaceURL.
            // When the app boots, you are at a url, e.g. /foo. If some route
            // redirects to bar as part of the initial transition, you don't want to
            // add a history entry for /foo. If you do, pressing back will immediately
            // hit the redirect again and take you back to /bar, thus killing the back
            // button
            let initial = transition.isCausedByInitialTransition;
            // say you are at / and you click a link to route /foo. In /foo's
            // route, the transition is aborted using replaceWith('/bar').
            // Because the current url is still /, the history entry for / is
            // removed from the history. Clicking back will take you to the page
            // you were on before /, which is often not even the app, thus killing
            // the back button. That's why updateURL is always correct for an
            // aborting transition that's not the initial transition
            let replaceAndNotAborting = urlMethod === 'replace' && !transition.isCausedByAbortingTransition;
            // because calling refresh causes an aborted transition, this needs to be
            // special cased - if the initial transition is a replace transition, the
            // urlMethod should be honored here.
            let isQueryParamsRefreshTransition = transition.queryParamsOnly && urlMethod === 'replace';
            // say you are at / and you a `replaceWith(/foo)` is called. Then, that
            // transition is aborted with `replaceWith(/bar)`. At the end, we should
            // end up with /bar replacing /. We are replacing the replace. We only
            // will replace the initial route if all subsequent aborts are also
            // replaces. However, there is some ambiguity around the correct behavior
            // here.
            let replacingReplace = urlMethod === 'replace' && transition.isCausedByAbortingReplaceTransition;
            if (initial || replaceAndNotAborting || isQueryParamsRefreshTransition || replacingReplace) this.replaceURL(url);
            else this.updateURL(url);
        }
    }
    finalizeQueryParamChange(resolvedHandlers, newQueryParams, transition) {
        // We fire a finalizeQueryParamChange event which
        // gives the new route hierarchy a chance to tell
        // us which query params it's consuming and what
        // their final values are. If a query param is
        // no longer consumed in the final route hierarchy,
        // its serialized segment will be removed
        // from the URL.
        for(let k in newQueryParams)if (newQueryParams.hasOwnProperty(k) && newQueryParams[k] === null) delete newQueryParams[k];
        let finalQueryParamsArray = [];
        this.triggerEvent(resolvedHandlers, true, 'finalizeQueryParamChange', [
            newQueryParams,
            finalQueryParamsArray,
            transition
        ]);
        if (transition) transition._visibleQueryParams = {};
        let finalQueryParams = {};
        for(let i = 0, len = finalQueryParamsArray.length; i < len; ++i){
            let qp = finalQueryParamsArray[i];
            finalQueryParams[qp.key] = qp.value;
            if (transition && qp.visible !== false) transition._visibleQueryParams[qp.key] = qp.value;
        }
        return finalQueryParams;
    }
    toReadOnlyInfos(newTransition, newState) {
        let oldRouteInfos = this.state.routeInfos;
        this.fromInfos(newTransition, oldRouteInfos);
        this.toInfos(newTransition, newState.routeInfos);
        this._lastQueryParams = newState.queryParams;
    }
    fromInfos(newTransition, oldRouteInfos) {
        if (newTransition !== undefined && oldRouteInfos.length > 0) {
            let fromInfos = (0, _routeInfo.toReadOnlyRouteInfo)(oldRouteInfos, Object.assign({}, this._lastQueryParams), {
                includeAttributes: true,
                localizeMapUpdates: false
            });
            newTransition.from = fromInfos[fromInfos.length - 1] || null;
        }
    }
    toInfos(newTransition, newRouteInfos, includeAttributes = false) {
        if (newTransition !== undefined && newRouteInfos.length > 0) {
            let toInfos = (0, _routeInfo.toReadOnlyRouteInfo)(newRouteInfos, Object.assign({}, newTransition[0, _transition.QUERY_PARAMS_SYMBOL]), {
                includeAttributes,
                localizeMapUpdates: false
            });
            newTransition.to = toInfos[toInfos.length - 1] || null;
        }
    }
    notifyExistingHandlers(newState, newTransition) {
        let oldRouteInfos = this.state.routeInfos, changing = [], i, oldRouteInfoLen, oldHandler, newRouteInfo;
        oldRouteInfoLen = oldRouteInfos.length;
        for(i = 0; i < oldRouteInfoLen; i++){
            oldHandler = oldRouteInfos[i];
            newRouteInfo = newState.routeInfos[i];
            if (!newRouteInfo || oldHandler.name !== newRouteInfo.name) break;
            if (!newRouteInfo.isResolved) changing.push(oldHandler);
        }
        this.triggerEvent(oldRouteInfos, true, 'willTransition', [
            newTransition
        ]);
        this.routeWillChange(newTransition);
        this.willTransition(oldRouteInfos, newState.routeInfos, newTransition);
    }
    /**
      Clears the current and target route routes and triggers exit
      on each of them starting at the leaf and traversing up through
      its ancestors.
    */ reset() {
        if (this.state) (0, _utils.forEach)(this.state.routeInfos.slice().reverse(), function(routeInfo) {
            let route = routeInfo.route;
            if (route !== undefined) {
                if (route.exit !== undefined) route.exit();
            }
            return true;
        });
        this.oldState = undefined;
        this.state = new (0, _transitionStateDefault.default)();
        this.currentRouteInfos = undefined;
    }
    /**
      let handler = routeInfo.handler;
      The entry point for handling a change to the URL (usually
      via the back and forward button).
  
      Returns an Array of handlers and the parameters associated
      with those parameters.
  
      @param {String} url a URL to process
  
      @return {Array} an Array of `[handler, parameter]` tuples
    */ handleURL(url) {
        // Perform a URL-based transition, but don't change
        // the URL afterward, since it already happened.
        if (url.charAt(0) !== '/') url = '/' + url;
        return this.doTransition(url).method(null);
    }
    /**
      Transition into the specified named route.
  
      If necessary, trigger the exit callback on any routes
      that are no longer represented by the target route.
  
      @param {String} name the name of the route
    */ transitionTo(name, ...contexts) {
        if (typeof name === 'object') {
            contexts.push(name);
            return this.doTransition(undefined, contexts, false);
        }
        return this.doTransition(name, contexts);
    }
    intermediateTransitionTo(name, ...args) {
        return this.doTransition(name, args, true);
    }
    refresh(pivotRoute) {
        let previousTransition = this.activeTransition;
        let state = previousTransition ? previousTransition[0, _transition.STATE_SYMBOL] : this.state;
        let routeInfos = state.routeInfos;
        if (pivotRoute === undefined) pivotRoute = routeInfos[0].route;
        (0, _utils.log)(this, 'Starting a refresh transition');
        let name = routeInfos[routeInfos.length - 1].name;
        let intent = new (0, _namedTransitionIntentDefault.default)(this, name, pivotRoute, [], this._changedQueryParams || state.queryParams);
        let newTransition = this.transitionByIntent(intent, false);
        // if the previous transition is a replace transition, that needs to be preserved
        if (previousTransition && previousTransition.urlMethod === 'replace') newTransition.method(previousTransition.urlMethod);
        return newTransition;
    }
    /**
      Identical to `transitionTo` except that the current URL will be replaced
      if possible.
  
      This method is intended primarily for use with `replaceState`.
  
      @param {String} name the name of the route
    */ replaceWith(name) {
        return this.doTransition(name).method('replace');
    }
    /**
      Take a named route and context objects and generate a
      URL.
  
      @param {String} name the name of the route to generate
        a URL for
      @param {...Object} objects a list of objects to serialize
  
      @return {String} a URL
    */ generate(routeName, ...args) {
        let partitionedArgs = (0, _utils.extractQueryParams)(args), suppliedParams = partitionedArgs[0], queryParams = partitionedArgs[1];
        // Construct a TransitionIntent with the provided params
        // and apply it to the present state of the router.
        let intent = new (0, _namedTransitionIntentDefault.default)(this, routeName, undefined, suppliedParams);
        let state = intent.applyToState(this.state, false);
        let params = {};
        for(let i = 0, len = state.routeInfos.length; i < len; ++i){
            let routeInfo = state.routeInfos[i];
            let routeParams = routeInfo.serialize();
            (0, _utils.merge)(params, routeParams);
        }
        params.queryParams = queryParams;
        return this.recognizer.generate(routeName, params);
    }
    applyIntent(routeName, contexts) {
        let intent = new (0, _namedTransitionIntentDefault.default)(this, routeName, undefined, contexts);
        let state = this.activeTransition && this.activeTransition[0, _transition.STATE_SYMBOL] || this.state;
        return intent.applyToState(state, false);
    }
    isActiveIntent(routeName, contexts, queryParams, _state) {
        let state = _state || this.state, targetRouteInfos = state.routeInfos, routeInfo, len;
        if (!targetRouteInfos.length) return false;
        let targetHandler = targetRouteInfos[targetRouteInfos.length - 1].name;
        let recognizerHandlers = this.recognizer.handlersFor(targetHandler);
        let index = 0;
        for(len = recognizerHandlers.length; index < len; ++index){
            routeInfo = targetRouteInfos[index];
            if (routeInfo.name === routeName) break;
        }
        if (index === recognizerHandlers.length) // The provided route name isn't even in the route hierarchy.
        return false;
        let testState = new (0, _transitionStateDefault.default)();
        testState.routeInfos = targetRouteInfos.slice(0, index + 1);
        recognizerHandlers = recognizerHandlers.slice(0, index + 1);
        let intent = new (0, _namedTransitionIntentDefault.default)(this, targetHandler, undefined, contexts);
        let newState = intent.applyToHandlers(testState, recognizerHandlers, targetHandler, true, true);
        let routesEqual = routeInfosEqual(newState.routeInfos, testState.routeInfos);
        if (!queryParams || !routesEqual) return routesEqual;
        // Get a hash of QPs that will still be active on new route
        let activeQPsOnNewHandler = {};
        (0, _utils.merge)(activeQPsOnNewHandler, queryParams);
        let activeQueryParams = state.queryParams;
        for(let key in activeQueryParams)if (activeQueryParams.hasOwnProperty(key) && activeQPsOnNewHandler.hasOwnProperty(key)) activeQPsOnNewHandler[key] = activeQueryParams[key];
        return routesEqual && !(0, _utils.getChangelist)(activeQPsOnNewHandler, queryParams);
    }
    isActive(routeName, ...args) {
        let [contexts, queryParams] = (0, _utils.extractQueryParams)(args);
        return this.isActiveIntent(routeName, contexts, queryParams);
    }
    trigger(name, ...args) {
        this.triggerEvent(this.currentRouteInfos, false, name, args);
    }
}
exports.default = Router;
function routeInfosEqual(routeInfos, otherRouteInfos) {
    if (routeInfos.length !== otherRouteInfos.length) return false;
    for(let i = 0, len = routeInfos.length; i < len; ++i){
        // SAFETY: Just casting for comparison
        if (routeInfos[i] !== otherRouteInfos[i]) return false;
    }
    return true;
}
function routeInfosSameExceptQueryParams(routeInfos, otherRouteInfos) {
    if (routeInfos.length !== otherRouteInfos.length) return false;
    for(let i = 0, len = routeInfos.length; i < len; ++i){
        if (routeInfos[i].name !== otherRouteInfos[i].name) return false;
        if (!paramsEqual(routeInfos[i].params, otherRouteInfos[i].params)) return false;
    }
    return true;
}
function paramsEqual(params, otherParams) {
    if (params === otherParams) // Both identical or both undefined
    return true;
    if (!params || !otherParams) // One is falsy but other is not
    return false;
    let keys = Object.keys(params);
    let otherKeys = Object.keys(otherParams);
    if (keys.length !== otherKeys.length) return false;
    for(let i = 0, len = keys.length; i < len; ++i){
        let key = keys[i];
        if (params[key] !== otherParams[key]) return false;
    }
    return true;
}

},{"route-recognizer":"2nlov","rsvp":"lmmjP","./route-info":"euUya","./transition":"eQZIA","./transition-aborted-error":"19V3P","./transition-intent/named-transition-intent":"8z19V","./transition-intent/url-transition-intent":"jaGW3","./transition-state":"lAMtU","./utils":"6JhJh","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2nlov":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var createObject = Object.create;
function createMap() {
    var map = createObject(null);
    map["__"] = undefined;
    delete map["__"];
    return map;
}
var Target = function Target(path, matcher, delegate) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
};
Target.prototype.to = function to(target, callback) {
    var delegate = this.delegate;
    if (delegate && delegate.willAddRoute) target = delegate.willAddRoute(this.matcher.target, target);
    this.matcher.add(this.path, target);
    if (callback) {
        if (callback.length === 0) throw new Error("You must have an argument in the function passed to `to`");
        this.matcher.addChild(this.path, target, callback, this.delegate);
    }
};
var Matcher = function Matcher(target) {
    this.routes = createMap();
    this.children = createMap();
    this.target = target;
};
Matcher.prototype.add = function add(path, target) {
    this.routes[path] = target;
};
Matcher.prototype.addChild = function addChild(path, target, callback, delegate) {
    var matcher = new Matcher(target);
    this.children[path] = matcher;
    var match = generateMatch(path, matcher, delegate);
    if (delegate && delegate.contextEntered) delegate.contextEntered(target, match);
    callback(match);
};
function generateMatch(startingPath, matcher, delegate) {
    function match(path, callback) {
        var fullPath = startingPath + path;
        if (callback) callback(generateMatch(fullPath, matcher, delegate));
        else return new Target(fullPath, matcher, delegate);
    }
    return match;
}
function addRoute(routeArray, path, handler) {
    var len = 0;
    for(var i = 0; i < routeArray.length; i++)len += routeArray[i].path.length;
    path = path.substr(len);
    var route = {
        path: path,
        handler: handler
    };
    routeArray.push(route);
}
function eachRoute(baseRoute, matcher, callback, binding) {
    var routes = matcher.routes;
    var paths = Object.keys(routes);
    for(var i = 0; i < paths.length; i++){
        var path = paths[i];
        var routeArray = baseRoute.slice();
        addRoute(routeArray, path, routes[path]);
        var nested = matcher.children[path];
        if (nested) eachRoute(routeArray, nested, callback, binding);
        else callback.call(binding, routeArray);
    }
}
var map = function(callback, addRouteCallback) {
    var matcher = new Matcher();
    callback(generateMatch("", matcher, this.delegate));
    eachRoute([], matcher, function(routes) {
        if (addRouteCallback) addRouteCallback(this, routes);
        else this.add(routes);
    }, this);
};
// Normalizes percent-encoded values in `path` to upper-case and decodes percent-encoded
// values that are not reserved (i.e., unicode characters, emoji, etc). The reserved
// chars are "/" and "%".
// Safe to call multiple times on the same path.
// Normalizes percent-encoded values in `path` to upper-case and decodes percent-encoded
function normalizePath(path) {
    return path.split("/").map(normalizeSegment).join("/");
}
// We want to ensure the characters "%" and "/" remain in percent-encoded
// form when normalizing paths, so replace them with their encoded form after
// decoding the rest of the path
var SEGMENT_RESERVED_CHARS = /%|\//g;
function normalizeSegment(segment) {
    if (segment.length < 3 || segment.indexOf("%") === -1) return segment;
    return decodeURIComponent(segment).replace(SEGMENT_RESERVED_CHARS, encodeURIComponent);
}
// We do not want to encode these characters when generating dynamic path segments
// See https://tools.ietf.org/html/rfc3986#section-3.3
// sub-delims: "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="
// others allowed by RFC 3986: ":", "@"
//
// First encode the entire path segment, then decode any of the encoded special chars.
//
// The chars "!", "'", "(", ")", "*" do not get changed by `encodeURIComponent`,
// so the possible encoded chars are:
// ['%24', '%26', '%2B', '%2C', '%3B', '%3D', '%3A', '%40'].
var PATH_SEGMENT_ENCODINGS = /%(?:2(?:4|6|B|C)|3(?:B|D|A)|40)/g;
function encodePathSegment(str) {
    return encodeURIComponent(str).replace(PATH_SEGMENT_ENCODINGS, decodeURIComponent);
}
var escapeRegex = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;
var isArray = Array.isArray;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function getParam(params, key) {
    if (typeof params !== "object" || params === null) throw new Error("You must pass an object as the second argument to `generate`.");
    if (!hasOwnProperty.call(params, key)) throw new Error("You must provide param `" + key + "` to `generate`.");
    var value = params[key];
    var str = typeof value === "string" ? value : "" + value;
    if (str.length === 0) throw new Error("You must provide a param `" + key + "`.");
    return str;
}
var eachChar = [];
eachChar[0 /* Static */ ] = function(segment, currentState) {
    var state = currentState;
    var value = segment.value;
    for(var i = 0; i < value.length; i++){
        var ch = value.charCodeAt(i);
        state = state.put(ch, false, false);
    }
    return state;
};
eachChar[1 /* Dynamic */ ] = function(_, currentState) {
    return currentState.put(47 /* SLASH */ , true, true);
};
eachChar[2 /* Star */ ] = function(_, currentState) {
    return currentState.put(-1 /* ANY */ , false, true);
};
eachChar[4 /* Epsilon */ ] = function(_, currentState) {
    return currentState;
};
var regex = [];
regex[0 /* Static */ ] = function(segment) {
    return segment.value.replace(escapeRegex, "\\$1");
};
regex[1 /* Dynamic */ ] = function() {
    return "([^/]+)";
};
regex[2 /* Star */ ] = function() {
    return "(.+)";
};
regex[4 /* Epsilon */ ] = function() {
    return "";
};
var generate = [];
generate[0 /* Static */ ] = function(segment) {
    return segment.value;
};
generate[1 /* Dynamic */ ] = function(segment, params) {
    var value = getParam(params, segment.value);
    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) return encodePathSegment(value);
    else return value;
};
generate[2 /* Star */ ] = function(segment, params) {
    return getParam(params, segment.value);
};
generate[4 /* Epsilon */ ] = function() {
    return "";
};
var EmptyObject = Object.freeze({});
var EmptyArray = Object.freeze([]);
// The `names` will be populated with the paramter name for each dynamic/star
// segment. `shouldDecodes` will be populated with a boolean for each dyanamic/star
// segment, indicating whether it should be decoded during recognition.
function parse(segments, route, types) {
    // normalize route as not starting with a "/". Recognition will
    // also normalize.
    if (route.length > 0 && route.charCodeAt(0) === 47 /* SLASH */ ) route = route.substr(1);
    var parts = route.split("/");
    var names = undefined;
    var shouldDecodes = undefined;
    for(var i = 0; i < parts.length; i++){
        var part = parts[i];
        var flags = 0;
        var type = 0;
        if (part === "") type = 4 /* Epsilon */ ;
        else if (part.charCodeAt(0) === 58 /* COLON */ ) type = 1 /* Dynamic */ ;
        else if (part.charCodeAt(0) === 42 /* STAR */ ) type = 2 /* Star */ ;
        else type = 0 /* Static */ ;
        flags = 2 << type;
        if (flags & 12 /* Named */ ) {
            part = part.slice(1);
            names = names || [];
            names.push(part);
            shouldDecodes = shouldDecodes || [];
            shouldDecodes.push((flags & 4 /* Decoded */ ) !== 0);
        }
        if (flags & 14 /* Counted */ ) types[type]++;
        segments.push({
            type: type,
            value: normalizeSegment(part)
        });
    }
    return {
        names: names || EmptyArray,
        shouldDecodes: shouldDecodes || EmptyArray
    };
}
function isEqualCharSpec(spec, char, negate) {
    return spec.char === char && spec.negate === negate;
}
// A State has a character specification and (`charSpec`) and a list of possible
// subsequent states (`nextStates`).
//
// If a State is an accepting state, it will also have several additional
// properties:
//
// * `regex`: A regular expression that is used to extract parameters from paths
//   that reached this accepting state.
// * `handlers`: Information on how to convert the list of captures into calls
//   to registered handlers with the specified parameters
// * `types`: How many static, dynamic or star segments in this route. Used to
//   decide which route to use if multiple registered routes match a path.
//
// Currently, State is implemented naively by looping over `nextStates` and
// comparing a character specification against a character. A more efficient
// implementation would use a hash of keys pointing at one or more next states.
var State = function State(states, id, char, negate, repeat) {
    this.states = states;
    this.id = id;
    this.char = char;
    this.negate = negate;
    this.nextStates = repeat ? id : null;
    this.pattern = "";
    this._regex = undefined;
    this.handlers = undefined;
    this.types = undefined;
};
State.prototype.regex = function regex$1() {
    if (!this._regex) this._regex = new RegExp(this.pattern);
    return this._regex;
};
State.prototype.get = function get(char, negate) {
    var this$1 = this;
    var nextStates = this.nextStates;
    if (nextStates === null) return;
    if (isArray(nextStates)) for(var i = 0; i < nextStates.length; i++){
        var child = this$1.states[nextStates[i]];
        if (isEqualCharSpec(child, char, negate)) return child;
    }
    else {
        var child$1 = this.states[nextStates];
        if (isEqualCharSpec(child$1, char, negate)) return child$1;
    }
};
State.prototype.put = function put(char, negate, repeat) {
    var state;
    // If the character specification already exists in a child of the current
    // state, just return that state.
    if (state = this.get(char, negate)) return state;
    // Make a new state for the character spec
    var states = this.states;
    state = new State(states, states.length, char, negate, repeat);
    states[states.length] = state;
    // Insert the new state as a child of the current state
    if (this.nextStates == null) this.nextStates = state.id;
    else if (isArray(this.nextStates)) this.nextStates.push(state.id);
    else this.nextStates = [
        this.nextStates,
        state.id
    ];
    // Return the new state
    return state;
};
// Find a list of child states matching the next character
State.prototype.match = function match(ch) {
    var this$1 = this;
    var nextStates = this.nextStates;
    if (!nextStates) return [];
    var returned = [];
    if (isArray(nextStates)) for(var i = 0; i < nextStates.length; i++){
        var child = this$1.states[nextStates[i]];
        if (isMatch(child, ch)) returned.push(child);
    }
    else {
        var child$1 = this.states[nextStates];
        if (isMatch(child$1, ch)) returned.push(child$1);
    }
    return returned;
};
function isMatch(spec, char) {
    return spec.negate ? spec.char !== char && spec.char !== -1 /* ANY */  : spec.char === char || spec.char === -1 /* ANY */ ;
}
// This is a somewhat naive strategy, but should work in a lot of cases
// A better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
//
// This strategy generally prefers more static and less dynamic matching.
// Specifically, it
//
//  * prefers fewer stars to more, then
//  * prefers using stars for less of the match to more, then
//  * prefers fewer dynamic segments to more, then
//  * prefers more static segments to more
function sortSolutions(states) {
    return states.sort(function(a, b) {
        var ref = a.types || [
            0,
            0,
            0
        ];
        var astatics = ref[0];
        var adynamics = ref[1];
        var astars = ref[2];
        var ref$1 = b.types || [
            0,
            0,
            0
        ];
        var bstatics = ref$1[0];
        var bdynamics = ref$1[1];
        var bstars = ref$1[2];
        if (astars !== bstars) return astars - bstars;
        if (astars) {
            if (astatics !== bstatics) return bstatics - astatics;
            if (adynamics !== bdynamics) return bdynamics - adynamics;
        }
        if (adynamics !== bdynamics) return adynamics - bdynamics;
        if (astatics !== bstatics) return bstatics - astatics;
        return 0;
    });
}
function recognizeChar(states, ch) {
    var nextStates = [];
    for(var i = 0, l = states.length; i < l; i++){
        var state = states[i];
        nextStates = nextStates.concat(state.match(ch));
    }
    return nextStates;
}
var RecognizeResults = function RecognizeResults(queryParams) {
    this.length = 0;
    this.queryParams = queryParams || {};
};
RecognizeResults.prototype.splice = Array.prototype.splice;
RecognizeResults.prototype.slice = Array.prototype.slice;
RecognizeResults.prototype.push = Array.prototype.push;
function findHandler(state, originalPath, queryParams) {
    var handlers = state.handlers;
    var regex = state.regex();
    if (!regex || !handlers) throw new Error("state not initialized");
    var captures = originalPath.match(regex);
    var currentCapture = 1;
    var result = new RecognizeResults(queryParams);
    result.length = handlers.length;
    for(var i = 0; i < handlers.length; i++){
        var handler = handlers[i];
        var names = handler.names;
        var shouldDecodes = handler.shouldDecodes;
        var params = EmptyObject;
        var isDynamic = false;
        if (names !== EmptyArray && shouldDecodes !== EmptyArray) for(var j = 0; j < names.length; j++){
            isDynamic = true;
            var name = names[j];
            var capture = captures && captures[currentCapture++];
            if (params === EmptyObject) params = {};
            if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS && shouldDecodes[j]) params[name] = capture && decodeURIComponent(capture);
            else params[name] = capture;
        }
        result[i] = {
            handler: handler.handler,
            params: params,
            isDynamic: isDynamic
        };
    }
    return result;
}
function decodeQueryParamPart(part) {
    // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
    part = part.replace(/\+/gm, "%20");
    var result;
    try {
        result = decodeURIComponent(part);
    } catch (error) {
        result = "";
    }
    return result;
}
var RouteRecognizer = function RouteRecognizer() {
    this.names = createMap();
    var states = [];
    var state = new State(states, 0, -1 /* ANY */ , true, false);
    states[0] = state;
    this.states = states;
    this.rootState = state;
};
RouteRecognizer.prototype.add = function add(routes, options) {
    var currentState = this.rootState;
    var pattern = "^";
    var types = [
        0,
        0,
        0
    ];
    var handlers = new Array(routes.length);
    var allSegments = [];
    var isEmpty = true;
    var j = 0;
    for(var i = 0; i < routes.length; i++){
        var route = routes[i];
        var ref = parse(allSegments, route.path, types);
        var names = ref.names;
        var shouldDecodes = ref.shouldDecodes;
        // preserve j so it points to the start of newly added segments
        for(; j < allSegments.length; j++){
            var segment = allSegments[j];
            if (segment.type === 4 /* Epsilon */ ) continue;
            isEmpty = false;
            // Add a "/" for the new segment
            currentState = currentState.put(47 /* SLASH */ , false, false);
            pattern += "/";
            // Add a representation of the segment to the NFA and regex
            currentState = eachChar[segment.type](segment, currentState);
            pattern += regex[segment.type](segment);
        }
        handlers[i] = {
            handler: route.handler,
            names: names,
            shouldDecodes: shouldDecodes
        };
    }
    if (isEmpty) {
        currentState = currentState.put(47 /* SLASH */ , false, false);
        pattern += "/";
    }
    currentState.handlers = handlers;
    currentState.pattern = pattern + "$";
    currentState.types = types;
    var name;
    if (typeof options === "object" && options !== null && options.as) name = options.as;
    if (name) // if (this.names[name]) {
    //   throw new Error("You may not add a duplicate route named `" + name + "`.");
    // }
    this.names[name] = {
        segments: allSegments,
        handlers: handlers
    };
};
RouteRecognizer.prototype.handlersFor = function handlersFor(name) {
    var route = this.names[name];
    if (!route) throw new Error("There is no route named " + name);
    var result = new Array(route.handlers.length);
    for(var i = 0; i < route.handlers.length; i++){
        var handler = route.handlers[i];
        result[i] = handler;
    }
    return result;
};
RouteRecognizer.prototype.hasRoute = function hasRoute(name) {
    return !!this.names[name];
};
RouteRecognizer.prototype.generate = function generate$1(name, params) {
    var route = this.names[name];
    var output = "";
    if (!route) throw new Error("There is no route named " + name);
    var segments = route.segments;
    for(var i = 0; i < segments.length; i++){
        var segment = segments[i];
        if (segment.type === 4 /* Epsilon */ ) continue;
        output += "/";
        output += generate[segment.type](segment, params);
    }
    if (output.charAt(0) !== "/") output = "/" + output;
    if (params && params.queryParams) output += this.generateQueryString(params.queryParams);
    return output;
};
RouteRecognizer.prototype.generateQueryString = function generateQueryString(params) {
    var pairs = [];
    var keys = Object.keys(params);
    keys.sort();
    for(var i = 0; i < keys.length; i++){
        var key = keys[i];
        var value = params[key];
        if (value == null) continue;
        var pair = encodeURIComponent(key);
        if (isArray(value)) for(var j = 0; j < value.length; j++){
            var arrayPair = key + "[]" + "=" + encodeURIComponent(value[j]);
            pairs.push(arrayPair);
        }
        else {
            pair += "=" + encodeURIComponent(value);
            pairs.push(pair);
        }
    }
    if (pairs.length === 0) return "";
    return "?" + pairs.join("&");
};
RouteRecognizer.prototype.parseQueryString = function parseQueryString(queryString) {
    var pairs = queryString.split("&");
    var queryParams = {};
    for(var i = 0; i < pairs.length; i++){
        var pair = pairs[i].split("="), key = decodeQueryParamPart(pair[0]), keyLength = key.length, isArray = false, value = void 0;
        if (pair.length === 1) value = "true";
        else {
            // Handle arrays
            if (keyLength > 2 && key.slice(keyLength - 2) === "[]") {
                isArray = true;
                key = key.slice(0, keyLength - 2);
                if (!queryParams[key]) queryParams[key] = [];
            }
            value = pair[1] ? decodeQueryParamPart(pair[1]) : "";
        }
        if (isArray) queryParams[key].push(value);
        else queryParams[key] = value;
    }
    return queryParams;
};
RouteRecognizer.prototype.recognize = function recognize(path) {
    var results;
    var states = [
        this.rootState
    ];
    var queryParams = {};
    var isSlashDropped = false;
    var hashStart = path.indexOf("#");
    if (hashStart !== -1) path = path.substr(0, hashStart);
    var queryStart = path.indexOf("?");
    if (queryStart !== -1) {
        var queryString = path.substr(queryStart + 1, path.length);
        path = path.substr(0, queryStart);
        queryParams = this.parseQueryString(queryString);
    }
    if (path.charAt(0) !== "/") path = "/" + path;
    var originalPath = path;
    if (RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS) path = normalizePath(path);
    else {
        path = decodeURI(path);
        originalPath = decodeURI(originalPath);
    }
    var pathLen = path.length;
    if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
        path = path.substr(0, pathLen - 1);
        originalPath = originalPath.substr(0, originalPath.length - 1);
        isSlashDropped = true;
    }
    for(var i = 0; i < path.length; i++){
        states = recognizeChar(states, path.charCodeAt(i));
        if (!states.length) break;
    }
    var solutions = [];
    for(var i$1 = 0; i$1 < states.length; i$1++)if (states[i$1].handlers) solutions.push(states[i$1]);
    states = sortSolutions(solutions);
    var state = solutions[0];
    if (state && state.handlers) {
        // if a trailing slash was dropped and a star segment is the last segment
        // specified, put the trailing slash back
        if (isSlashDropped && state.pattern && state.pattern.slice(-5) === "(.+)$") originalPath = originalPath + "/";
        results = findHandler(state, originalPath, queryParams);
    }
    return results;
};
RouteRecognizer.VERSION = "0.3.4";
// Set to false to opt-out of encoding and decoding path segments.
// See https://github.com/tildeio/route-recognizer/pull/55
RouteRecognizer.ENCODE_AND_DECODE_PATH_SEGMENTS = true;
RouteRecognizer.Normalizer = {
    normalizeSegment: normalizeSegment,
    normalizePath: normalizePath,
    encodePathSegment: encodePathSegment
};
RouteRecognizer.prototype.map = map;
exports.default = RouteRecognizer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"lmmjP":[function(require,module,exports,__globalThis) {
/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2016 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   4.8.4+ff10049b
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "asap", ()=>asap);
parcelHelpers.export(exports, "cast", ()=>cast);
parcelHelpers.export(exports, "Promise", ()=>Promise);
parcelHelpers.export(exports, "EventTarget", ()=>EventTarget);
parcelHelpers.export(exports, "all", ()=>all$1);
parcelHelpers.export(exports, "allSettled", ()=>allSettled);
parcelHelpers.export(exports, "race", ()=>race$1);
parcelHelpers.export(exports, "hash", ()=>hash);
parcelHelpers.export(exports, "hashSettled", ()=>hashSettled);
parcelHelpers.export(exports, "rethrow", ()=>rethrow);
parcelHelpers.export(exports, "defer", ()=>defer);
parcelHelpers.export(exports, "denodeify", ()=>denodeify);
parcelHelpers.export(exports, "configure", ()=>configure);
parcelHelpers.export(exports, "on", ()=>on);
parcelHelpers.export(exports, "off", ()=>off);
parcelHelpers.export(exports, "resolve", ()=>resolve$2);
parcelHelpers.export(exports, "reject", ()=>reject$2);
parcelHelpers.export(exports, "map", ()=>map);
parcelHelpers.export(exports, "async", ()=>async);
parcelHelpers.export(exports, "filter", ()=>filter);
var process = require("41089d4dfa957c3c");
function callbacksFor(object) {
    var callbacks = object._promiseCallbacks;
    if (!callbacks) callbacks = object._promiseCallbacks = {};
    return callbacks;
}
/**
  @class EventTarget
  @for rsvp
  @public
*/ var EventTarget = {
    /**
    `EventTarget.mixin` extends an object with EventTarget methods. For
    Example:
     ```javascript
    import EventTarget from 'rsvp';
     let object = {};
     EventTarget.mixin(object);
     object.on('finished', function(event) {
      // handle event
    });
     object.trigger('finished', { detail: value });
    ```
     `EventTarget.mixin` also works with prototypes:
     ```javascript
    import EventTarget from 'rsvp';
     let Person = function() {};
    EventTarget.mixin(Person.prototype);
     let yehuda = new Person();
    let tom = new Person();
     yehuda.on('poke', function(event) {
      console.log('Yehuda says OW');
    });
     tom.on('poke', function(event) {
      console.log('Tom says OW');
    });
     yehuda.trigger('poke');
    tom.trigger('poke');
    ```
     @method mixin
    @for rsvp
    @private
    @param {Object} object object to extend with EventTarget methods
  */ mixin: function(object) {
        object.on = this.on;
        object.off = this.off;
        object.trigger = this.trigger;
        object._promiseCallbacks = undefined;
        return object;
    },
    /**
    Registers a callback to be executed when `eventName` is triggered
     ```javascript
    object.on('event', function(eventInfo){
      // handle the event
    });
     object.trigger('event');
    ```
     @method on
    @for EventTarget
    @private
    @param {String} eventName name of the event to listen for
    @param {Function} callback function to be called when the event is triggered.
  */ on: function(eventName, callback) {
        if (typeof callback !== 'function') throw new TypeError('Callback must be a function');
        var allCallbacks = callbacksFor(this);
        var callbacks = allCallbacks[eventName];
        if (!callbacks) callbacks = allCallbacks[eventName] = [];
        if (callbacks.indexOf(callback) === -1) callbacks.push(callback);
    },
    /**
    You can use `off` to stop firing a particular callback for an event:
     ```javascript
    function doStuff() { // do stuff! }
    object.on('stuff', doStuff);
     object.trigger('stuff'); // doStuff will be called
     // Unregister ONLY the doStuff callback
    object.off('stuff', doStuff);
    object.trigger('stuff'); // doStuff will NOT be called
    ```
     If you don't pass a `callback` argument to `off`, ALL callbacks for the
    event will not be executed when the event fires. For example:
     ```javascript
    let callback1 = function(){};
    let callback2 = function(){};
     object.on('stuff', callback1);
    object.on('stuff', callback2);
     object.trigger('stuff'); // callback1 and callback2 will be executed.
     object.off('stuff');
    object.trigger('stuff'); // callback1 and callback2 will not be executed!
    ```
     @method off
    @for rsvp
    @private
    @param {String} eventName event to stop listening to
    @param {Function} [callback] optional argument. If given, only the function
    given will be removed from the event's callback queue. If no `callback`
    argument is given, all callbacks will be removed from the event's callback
    queue.
  */ off: function(eventName, callback) {
        var allCallbacks = callbacksFor(this);
        if (!callback) {
            allCallbacks[eventName] = [];
            return;
        }
        var callbacks = allCallbacks[eventName];
        var index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
    },
    /**
    Use `trigger` to fire custom events. For example:
     ```javascript
    object.on('foo', function(){
      console.log('foo event happened!');
    });
    object.trigger('foo');
    // 'foo event happened!' logged to the console
    ```
     You can also pass a value as a second argument to `trigger` that will be
    passed as an argument to all event listeners for the event:
     ```javascript
    object.on('foo', function(value){
      console.log(value.name);
    });
     object.trigger('foo', { name: 'bar' });
    // 'bar' logged to the console
    ```
     @method trigger
    @for rsvp
    @private
    @param {String} eventName name of the event to be triggered
    @param {*} [options] optional value to be passed to any event handlers for
    the given `eventName`
  */ trigger: function(eventName, options, label) {
        var allCallbacks = callbacksFor(this);
        var callbacks = allCallbacks[eventName];
        if (callbacks) {
            // Don't cache the callbacks.length since it may grow
            var callback = void 0;
            for(var i = 0; i < callbacks.length; i++){
                callback = callbacks[i];
                callback(options, label);
            }
        }
    }
};
var config = {
    instrument: false
};
EventTarget['mixin'](config);
function configure(name, value) {
    if (arguments.length === 2) config[name] = value;
    else return config[name];
}
var queue = [];
function scheduleFlush() {
    setTimeout(function() {
        for(var i = 0; i < queue.length; i++){
            var entry = queue[i];
            var payload = entry.payload;
            payload.guid = payload.key + payload.id;
            payload.childGuid = payload.key + payload.childId;
            if (payload.error) payload.stack = payload.error.stack;
            config['trigger'](entry.name, entry.payload);
        }
        queue.length = 0;
    }, 50);
}
function instrument(eventName, promise, child) {
    if (1 === queue.push({
        name: eventName,
        payload: {
            key: promise._guidKey,
            id: promise._id,
            eventName: eventName,
            detail: promise._result,
            childId: child && child._id,
            label: promise._label,
            timeStamp: Date.now(),
            error: config["instrument-with-stack"] ? new Error(promise._label) : null
        }
    })) scheduleFlush();
}
/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  import Promise from 'rsvp';

  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  import Promise from 'rsvp';

  let promise = RSVP.Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @for Promise
  @static
  @param {*} object value that the returned promise will be resolved with
  @param {String} [label] optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/ function resolve$$1(object, label) {
    /*jshint validthis:true */ var Constructor = this;
    if (object && typeof object === 'object' && object.constructor === Constructor) return object;
    var promise = new Constructor(noop, label);
    resolve$1(promise, object);
    return promise;
}
function withOwnPromise() {
    return new TypeError('A promises callback cannot return that same promise.');
}
function objectOrFunction(x) {
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}
function noop() {}
var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;
var TRY_CATCH_ERROR = {
    error: null
};
function getThen(promise) {
    try {
        return promise.then;
    } catch (error) {
        TRY_CATCH_ERROR.error = error;
        return TRY_CATCH_ERROR;
    }
}
var tryCatchCallback = void 0;
function tryCatcher() {
    try {
        var target = tryCatchCallback;
        tryCatchCallback = null;
        return target.apply(this, arguments);
    } catch (e) {
        TRY_CATCH_ERROR.error = e;
        return TRY_CATCH_ERROR;
    }
}
function tryCatch(fn) {
    tryCatchCallback = fn;
    return tryCatcher;
}
function handleForeignThenable(promise, thenable, then$$1) {
    config.async(function(promise) {
        var sealed = false;
        var result = tryCatch(then$$1).call(thenable, function(value) {
            if (sealed) return;
            sealed = true;
            if (thenable === value) fulfill(promise, value);
            else resolve$1(promise, value);
        }, function(reason) {
            if (sealed) return;
            sealed = true;
            reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));
        if (!sealed && result === TRY_CATCH_ERROR) {
            sealed = true;
            var error = TRY_CATCH_ERROR.error;
            TRY_CATCH_ERROR.error = null;
            reject(promise, error);
        }
    }, promise);
}
function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) fulfill(promise, thenable._result);
    else if (thenable._state === REJECTED) {
        thenable._onError = null;
        reject(promise, thenable._result);
    } else subscribe(thenable, undefined, function(value) {
        if (thenable === value) fulfill(promise, value);
        else resolve$1(promise, value);
    }, function(reason) {
        return reject(promise, reason);
    });
}
function handleMaybeThenable(promise, maybeThenable, then$$1) {
    var isOwnThenable = maybeThenable.constructor === promise.constructor && then$$1 === then && promise.constructor.resolve === resolve$$1;
    if (isOwnThenable) handleOwnThenable(promise, maybeThenable);
    else if (then$$1 === TRY_CATCH_ERROR) {
        var error = TRY_CATCH_ERROR.error;
        TRY_CATCH_ERROR.error = null;
        reject(promise, error);
    } else if (typeof then$$1 === 'function') handleForeignThenable(promise, maybeThenable, then$$1);
    else fulfill(promise, maybeThenable);
}
function resolve$1(promise, value) {
    if (promise === value) fulfill(promise, value);
    else if (objectOrFunction(value)) handleMaybeThenable(promise, value, getThen(value));
    else fulfill(promise, value);
}
function publishRejection(promise) {
    if (promise._onError) promise._onError(promise._result);
    publish(promise);
}
function fulfill(promise, value) {
    if (promise._state !== PENDING) return;
    promise._result = value;
    promise._state = FULFILLED;
    if (promise._subscribers.length === 0) {
        if (config.instrument) instrument('fulfilled', promise);
    } else config.async(publish, promise);
}
function reject(promise, reason) {
    if (promise._state !== PENDING) return;
    promise._state = REJECTED;
    promise._result = reason;
    config.async(publishRejection, promise);
}
function subscribe(parent, child, onFulfillment, onRejection) {
    var subscribers = parent._subscribers;
    var length = subscribers.length;
    parent._onError = null;
    subscribers[length] = child;
    subscribers[length + FULFILLED] = onFulfillment;
    subscribers[length + REJECTED] = onRejection;
    if (length === 0 && parent._state) config.async(publish, parent);
}
function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;
    if (config.instrument) instrument(settled === FULFILLED ? 'fulfilled' : 'rejected', promise);
    if (subscribers.length === 0) return;
    var child = void 0, callback = void 0, result = promise._result;
    for(var i = 0; i < subscribers.length; i += 3){
        child = subscribers[i];
        callback = subscribers[i + settled];
        if (child) invokeCallback(settled, child, callback, result);
        else callback(result);
    }
    promise._subscribers.length = 0;
}
function invokeCallback(state, promise, callback, result) {
    var hasCallback = typeof callback === 'function';
    var value = void 0;
    if (hasCallback) value = tryCatch(callback)(result);
    else value = result;
    if (promise._state !== PENDING) ;
    else if (value === promise) reject(promise, withOwnPromise());
    else if (value === TRY_CATCH_ERROR) {
        var error = TRY_CATCH_ERROR.error;
        TRY_CATCH_ERROR.error = null; // release
        reject(promise, error);
    } else if (hasCallback) resolve$1(promise, value);
    else if (state === FULFILLED) fulfill(promise, value);
    else if (state === REJECTED) reject(promise, value);
}
function initializePromise(promise, resolver) {
    var resolved = false;
    try {
        resolver(function(value) {
            if (resolved) return;
            resolved = true;
            resolve$1(promise, value);
        }, function(reason) {
            if (resolved) return;
            resolved = true;
            reject(promise, reason);
        });
    } catch (e) {
        reject(promise, e);
    }
}
function then(onFulfillment, onRejection, label) {
    var parent = this;
    var state = parent._state;
    if (state === FULFILLED && !onFulfillment || state === REJECTED && !onRejection) {
        config.instrument && instrument('chained', parent, parent);
        return parent;
    }
    parent._onError = null;
    var child = new parent.constructor(noop, label);
    var result = parent._result;
    config.instrument && instrument('chained', parent, child);
    if (state === PENDING) subscribe(parent, child, onFulfillment, onRejection);
    else {
        var callback = state === FULFILLED ? onFulfillment : onRejection;
        config.async(function() {
            return invokeCallback(state, child, callback, result);
        });
    }
    return child;
}
var Enumerator = function() {
    function Enumerator(Constructor, input, abortOnReject, label) {
        this._instanceConstructor = Constructor;
        this.promise = new Constructor(noop, label);
        this._abortOnReject = abortOnReject;
        this._isUsingOwnPromise = Constructor === Promise;
        this._isUsingOwnResolve = Constructor.resolve === resolve$$1;
        this._init.apply(this, arguments);
    }
    Enumerator.prototype._init = function _init(Constructor, input) {
        var len = input.length || 0;
        this.length = len;
        this._remaining = len;
        this._result = new Array(len);
        this._enumerate(input);
    };
    Enumerator.prototype._enumerate = function _enumerate(input) {
        var length = this.length;
        var promise = this.promise;
        for(var i = 0; promise._state === PENDING && i < length; i++)this._eachEntry(input[i], i, true);
        this._checkFullfillment();
    };
    Enumerator.prototype._checkFullfillment = function _checkFullfillment() {
        if (this._remaining === 0) {
            var result = this._result;
            fulfill(this.promise, result);
            this._result = null;
        }
    };
    Enumerator.prototype._settleMaybeThenable = function _settleMaybeThenable(entry, i, firstPass) {
        var c = this._instanceConstructor;
        if (this._isUsingOwnResolve) {
            var then$$1 = getThen(entry);
            if (then$$1 === then && entry._state !== PENDING) {
                entry._onError = null;
                this._settledAt(entry._state, i, entry._result, firstPass);
            } else if (typeof then$$1 !== 'function') this._settledAt(FULFILLED, i, entry, firstPass);
            else if (this._isUsingOwnPromise) {
                var promise = new c(noop);
                handleMaybeThenable(promise, entry, then$$1);
                this._willSettleAt(promise, i, firstPass);
            } else this._willSettleAt(new c(function(resolve) {
                return resolve(entry);
            }), i, firstPass);
        } else this._willSettleAt(c.resolve(entry), i, firstPass);
    };
    Enumerator.prototype._eachEntry = function _eachEntry(entry, i, firstPass) {
        if (entry !== null && typeof entry === 'object') this._settleMaybeThenable(entry, i, firstPass);
        else this._setResultAt(FULFILLED, i, entry, firstPass);
    };
    Enumerator.prototype._settledAt = function _settledAt(state, i, value, firstPass) {
        var promise = this.promise;
        if (promise._state === PENDING) {
            if (this._abortOnReject && state === REJECTED) reject(promise, value);
            else {
                this._setResultAt(state, i, value, firstPass);
                this._checkFullfillment();
            }
        }
    };
    Enumerator.prototype._setResultAt = function _setResultAt(state, i, value, firstPass) {
        this._remaining--;
        this._result[i] = value;
    };
    Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i, firstPass) {
        var _this = this;
        subscribe(promise, undefined, function(value) {
            return _this._settledAt(FULFILLED, i, value, firstPass);
        }, function(reason) {
            return _this._settledAt(REJECTED, i, reason, firstPass);
        });
    };
    return Enumerator;
}();
function setSettledResult(state, i, value) {
    this._remaining--;
    if (state === FULFILLED) this._result[i] = {
        state: 'fulfilled',
        value: value
    };
    else this._result[i] = {
        state: 'rejected',
        reason: value
    };
}
/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  import Promise, { resolve } from 'rsvp';

  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `RSVP.all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  import Promise, { resolve, reject } from 'rsvp';

  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @for Promise
  @param {Array} entries array of promises
  @param {String} [label] optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/ function all(entries, label) {
    if (!Array.isArray(entries)) return this.reject(new TypeError("Promise.all must be called with an array"), label);
    return new Enumerator(this, entries, true, label).promise;
}
/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  import Promise from 'rsvp';

  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  import Promise from 'rsvp';

  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  import Promise from 'rsvp';

  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @for Promise
  @static
  @param {Array} entries array of promises to observe
  @param {String} [label] optional string for describing the promise returned.
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/ function race(entries, label) {
    /*jshint validthis:true */ var Constructor = this;
    var promise = new Constructor(noop, label);
    if (!Array.isArray(entries)) {
        reject(promise, new TypeError('Promise.race must be called with an array'));
        return promise;
    }
    for(var i = 0; promise._state === PENDING && i < entries.length; i++)subscribe(Constructor.resolve(entries[i]), undefined, function(value) {
        return resolve$1(promise, value);
    }, function(reason) {
        return reject(promise, reason);
    });
    return promise;
}
/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  import Promise from 'rsvp';

  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  import Promise from 'rsvp';

  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @for Promise
  @static
  @param {*} reason value that the returned promise will be rejected with.
  @param {String} [label] optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/ function reject$1(reason, label) {
    /*jshint validthis:true */ var Constructor = this;
    var promise = new Constructor(noop, label);
    reject(promise, reason);
    return promise;
}
var guidKey = 'rsvp_' + Date.now() + '-';
var counter = 0;
function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}
function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}
/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise’s eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @public
  @param {function} resolver
  @param {String} [label] optional string for labeling the promise.
  Useful for tooling.
  @constructor
*/ var Promise = function() {
    function Promise(resolver, label) {
        this._id = counter++;
        this._label = label;
        this._state = undefined;
        this._result = undefined;
        this._subscribers = [];
        config.instrument && instrument('created', this);
        if (noop !== resolver) {
            typeof resolver !== 'function' && needsResolver();
            this instanceof Promise ? initializePromise(this, resolver) : needsNew();
        }
    }
    Promise.prototype._onError = function _onError(reason) {
        var _this = this;
        config.after(function() {
            if (_this._onError) config.trigger('error', reason, _this._label);
        });
    };
    /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn\'t find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    @param {String} [label] optional string for labeling the promise.
    Useful for tooling.
    @return {Promise}
  */ Promise.prototype.catch = function _catch(onRejection, label) {
        return this.then(undefined, onRejection, label);
    };
    /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuthor();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuthor();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @param {String} [label] optional string for labeling the promise.
    Useful for tooling.
    @return {Promise}
  */ Promise.prototype.finally = function _finally(callback, label) {
        var promise = this;
        var constructor = promise.constructor;
        if (typeof callback === 'function') return promise.then(function(value) {
            return constructor.resolve(callback()).then(function() {
                return value;
            });
        }, function(reason) {
            return constructor.resolve(callback()).then(function() {
                throw reason;
            });
        });
        return promise.then(callback, callback);
    };
    return Promise;
}();
Promise.cast = resolve$$1; // deprecated
Promise.all = all;
Promise.race = race;
Promise.resolve = resolve$$1;
Promise.reject = reject$1;
Promise.prototype._guidKey = guidKey;
/**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.

  ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```

  Chaining
  --------

  The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.

  ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });

  findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we\'re unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we\'re unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

  ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```

  Assimilation
  ------------

  Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.

  ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```

  If the assimliated promise rejects, then the downstream promise will also reject.

  ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```

  Simple Example
  --------------

  Synchronous Example

  ```javascript
  let result;

  try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```

  Errback Example

  ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```

  Promise Example;

  ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```

  Advanced Example
  --------------

  Synchronous Example

  ```javascript
  let author, books;

  try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```

  Errback Example

  ```js

  function foundBooks(books) {

  }

  function failure(reason) {

  }

  findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```

  Promise Example;

  ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```

  @method then
  @param {Function} onFulfillment
  @param {Function} onRejection
  @param {String} [label] optional string for labeling the promise.
  Useful for tooling.
  @return {Promise}
*/ Promise.prototype.then = then;
function makeObject(_, argumentNames) {
    var obj = {};
    var length = _.length;
    var args = new Array(length);
    for(var x = 0; x < length; x++)args[x] = _[x];
    for(var i = 0; i < argumentNames.length; i++){
        var name = argumentNames[i];
        obj[name] = args[i + 1];
    }
    return obj;
}
function arrayResult(_) {
    var length = _.length;
    var args = new Array(length - 1);
    for(var i = 1; i < length; i++)args[i - 1] = _[i];
    return args;
}
function wrapThenable(then, promise) {
    return {
        then: function(onFulFillment, onRejection) {
            return then.call(promise, onFulFillment, onRejection);
        }
    };
}
/**
  `denodeify` takes a 'node-style' function and returns a function that
  will return an `Promise`. You can use `denodeify` in Node.js or the
  browser when you'd prefer to use promises over using callbacks. For example,
  `denodeify` transforms the following:

  ```javascript
  let fs = require('fs');

  fs.readFile('myfile.txt', function(err, data){
    if (err) return handleError(err);
    handleData(data);
  });
  ```

  into:

  ```javascript
  let fs = require('fs');
  let readFile = denodeify(fs.readFile);

  readFile('myfile.txt').then(handleData, handleError);
  ```

  If the node function has multiple success parameters, then `denodeify`
  just returns the first one:

  ```javascript
  let request = denodeify(require('request'));

  request('http://example.com').then(function(res) {
    // ...
  });
  ```

  However, if you need all success parameters, setting `denodeify`'s
  second parameter to `true` causes it to return all success parameters
  as an array:

  ```javascript
  let request = denodeify(require('request'), true);

  request('http://example.com').then(function(result) {
    // result[0] -> res
    // result[1] -> body
  });
  ```

  Or if you pass it an array with names it returns the parameters as a hash:

  ```javascript
  let request = denodeify(require('request'), ['res', 'body']);

  request('http://example.com').then(function(result) {
    // result.res
    // result.body
  });
  ```

  Sometimes you need to retain the `this`:

  ```javascript
  let app = require('express')();
  let render = denodeify(app.render.bind(app));
  ```

  The denodified function inherits from the original function. It works in all
  environments, except IE 10 and below. Consequently all properties of the original
  function are available to you. However, any properties you change on the
  denodeified function won't be changed on the original function. Example:

  ```javascript
  let request = denodeify(require('request')),
      cookieJar = request.jar(); // <- Inheritance is used here

  request('http://example.com', {jar: cookieJar}).then(function(res) {
    // cookieJar.cookies holds now the cookies returned by example.com
  });
  ```

  Using `denodeify` makes it easier to compose asynchronous operations instead
  of using callbacks. For example, instead of:

  ```javascript
  let fs = require('fs');

  fs.readFile('myfile.txt', function(err, data){
    if (err) { ... } // Handle error
    fs.writeFile('myfile2.txt', data, function(err){
      if (err) { ... } // Handle error
      console.log('done')
    });
  });
  ```

  you can chain the operations together using `then` from the returned promise:

  ```javascript
  let fs = require('fs');
  let readFile = denodeify(fs.readFile);
  let writeFile = denodeify(fs.writeFile);

  readFile('myfile.txt').then(function(data){
    return writeFile('myfile2.txt', data);
  }).then(function(){
    console.log('done')
  }).catch(function(error){
    // Handle error
  });
  ```

  @method denodeify
  @public
  @static
  @for rsvp
  @param {Function} nodeFunc a 'node-style' function that takes a callback as
  its last argument. The callback expects an error to be passed as its first
  argument (if an error occurred, otherwise null), and the value from the
  operation as its second argument ('function(err, value){ }').
  @param {Boolean|Array} [options] An optional paramter that if set
  to `true` causes the promise to fulfill with the callback's success arguments
  as an array. This is useful if the node function has multiple success
  paramters. If you set this paramter to an array with names, the promise will
  fulfill with a hash with these names as keys and the success parameters as
  values.
  @return {Function} a function that wraps `nodeFunc` to return a `Promise`
*/ function denodeify(nodeFunc, options) {
    var fn = function() {
        var l = arguments.length;
        var args = new Array(l + 1);
        var promiseInput = false;
        for(var i = 0; i < l; ++i){
            var arg = arguments[i];
            if (!promiseInput) {
                // TODO: clean this up
                promiseInput = needsPromiseInput(arg);
                if (promiseInput === TRY_CATCH_ERROR) {
                    var error = TRY_CATCH_ERROR.error;
                    TRY_CATCH_ERROR.error = null;
                    var p = new Promise(noop);
                    reject(p, error);
                    return p;
                } else if (promiseInput && promiseInput !== true) arg = wrapThenable(promiseInput, arg);
            }
            args[i] = arg;
        }
        var promise = new Promise(noop);
        args[l] = function(err, val) {
            if (err) reject(promise, err);
            else if (options === undefined) resolve$1(promise, val);
            else if (options === true) resolve$1(promise, arrayResult(arguments));
            else if (Array.isArray(options)) resolve$1(promise, makeObject(arguments, options));
            else resolve$1(promise, val);
        };
        if (promiseInput) return handlePromiseInput(promise, args, nodeFunc, this);
        else return handleValueInput(promise, args, nodeFunc, this);
    };
    fn.__proto__ = nodeFunc;
    return fn;
}
function handleValueInput(promise, args, nodeFunc, self1) {
    var result = tryCatch(nodeFunc).apply(self1, args);
    if (result === TRY_CATCH_ERROR) {
        var error = TRY_CATCH_ERROR.error;
        TRY_CATCH_ERROR.error = null;
        reject(promise, error);
    }
    return promise;
}
function handlePromiseInput(promise, args, nodeFunc, self1) {
    return Promise.all(args).then(function(args) {
        return handleValueInput(promise, args, nodeFunc, self1);
    });
}
function needsPromiseInput(arg) {
    if (arg !== null && typeof arg === 'object') {
        if (arg.constructor === Promise) return true;
        else return getThen(arg);
    } else return false;
}
/**
  This is a convenient alias for `Promise.all`.

  @method all
  @public
  @static
  @for rsvp
  @param {Array} array Array of promises.
  @param {String} [label] An optional label. This is useful
  for tooling.
*/ function all$1(array, label) {
    return Promise.all(array, label);
}
function _possibleConstructorReturn(self1, call) {
    if (!self1) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return call && (typeof call === "object" || typeof call === "function") ? call : self1;
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
/**
@module rsvp
@public
**/ var AllSettled = function(_Enumerator) {
    _inherits(AllSettled, _Enumerator);
    function AllSettled(Constructor, entries, label) {
        return _possibleConstructorReturn(this, _Enumerator.call(this, Constructor, entries, false, label));
    }
    return AllSettled;
}(Enumerator);
AllSettled.prototype._setResultAt = setSettledResult;
/**
`RSVP.allSettled` is similar to `RSVP.all`, but instead of implementing
a fail-fast method, it waits until all the promises have returned and
shows you all the results. This is useful if you want to handle multiple
promises' failure states together as a set.
 Returns a promise that is fulfilled when all the given promises have been
settled. The return promise is fulfilled with an array of the states of
the promises passed into the `promises` array argument.
 Each state object will either indicate fulfillment or rejection, and
provide the corresponding value or reason. The states will take one of
the following formats:
 ```javascript
{ state: 'fulfilled', value: value }
  or
{ state: 'rejected', reason: reason }
```
 Example:
 ```javascript
let promise1 = RSVP.Promise.resolve(1);
let promise2 = RSVP.Promise.reject(new Error('2'));
let promise3 = RSVP.Promise.reject(new Error('3'));
let promises = [ promise1, promise2, promise3 ];
 RSVP.allSettled(promises).then(function(array){
  // array == [
  //   { state: 'fulfilled', value: 1 },
  //   { state: 'rejected', reason: Error },
  //   { state: 'rejected', reason: Error }
  // ]
  // Note that for the second item, reason.message will be '2', and for the
  // third item, reason.message will be '3'.
}, function(error) {
  // Not run. (This block would only be called if allSettled had failed,
  // for instance if passed an incorrect argument type.)
});
```
 @method allSettled
@public
@static
@for rsvp
@param {Array} entries
@param {String} [label] - optional string that describes the promise.
Useful for tooling.
@return {Promise} promise that is fulfilled with an array of the settled
states of the constituent promises.
*/ function allSettled(entries, label) {
    if (!Array.isArray(entries)) return Promise.reject(new TypeError("Promise.allSettled must be called with an array"), label);
    return new AllSettled(Promise, entries, label).promise;
}
/**
  This is a convenient alias for `Promise.race`.

  @method race
  @public
  @static
  @for rsvp
  @param {Array} array Array of promises.
  @param {String} [label] An optional label. This is useful
  for tooling.
 */ function race$1(array, label) {
    return Promise.race(array, label);
}
function _possibleConstructorReturn$1(self1, call) {
    if (!self1) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return call && (typeof call === "object" || typeof call === "function") ? call : self1;
}
function _inherits$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var PromiseHash = function(_Enumerator) {
    _inherits$1(PromiseHash, _Enumerator);
    function PromiseHash(Constructor, object) {
        var abortOnReject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var label = arguments[3];
        return _possibleConstructorReturn$1(this, _Enumerator.call(this, Constructor, object, abortOnReject, label));
    }
    PromiseHash.prototype._init = function _init(Constructor, object) {
        this._result = {};
        this._enumerate(object);
    };
    PromiseHash.prototype._enumerate = function _enumerate(input) {
        var keys = Object.keys(input);
        var length = keys.length;
        var promise = this.promise;
        this._remaining = length;
        var key = void 0, val = void 0;
        for(var i = 0; promise._state === PENDING && i < length; i++){
            key = keys[i];
            val = input[key];
            this._eachEntry(val, key, true);
        }
        this._checkFullfillment();
    };
    return PromiseHash;
}(Enumerator);
/**
  `hash` is similar to `all`, but takes an object instead of an array
  for its `promises` argument.

  Returns a promise that is fulfilled when all the given promises have been
  fulfilled, or rejected if any of them become rejected. The returned promise
  is fulfilled with a hash that has the same key names as the `promises` object
  argument. If any of the values in the object are not promises, they will
  simply be copied over to the fulfilled object.

  Example:

  ```javascript
  let promises = {
    myPromise: resolve(1),
    yourPromise: resolve(2),
    theirPromise: resolve(3),
    notAPromise: 4
  };

  hash(promises).then(function(hash){
    // hash here is an object that looks like:
    // {
    //   myPromise: 1,
    //   yourPromise: 2,
    //   theirPromise: 3,
    //   notAPromise: 4
    // }
  });
  ```

  If any of the `promises` given to `hash` are rejected, the first promise
  that is rejected will be given as the reason to the rejection handler.

  Example:

  ```javascript
  let promises = {
    myPromise: resolve(1),
    rejectedPromise: reject(new Error('rejectedPromise')),
    anotherRejectedPromise: reject(new Error('anotherRejectedPromise')),
  };

  hash(promises).then(function(hash){
    // Code here never runs because there are rejected promises!
  }, function(reason) {
    // reason.message === 'rejectedPromise'
  });
  ```

  An important note: `hash` is intended for plain JavaScript objects that
  are just a set of keys and values. `hash` will NOT preserve prototype
  chains.

  Example:

  ```javascript
  import { hash, resolve } from 'rsvp';
  function MyConstructor(){
    this.example = resolve('Example');
  }

  MyConstructor.prototype = {
    protoProperty: resolve('Proto Property')
  };

  let myObject = new MyConstructor();

  hash(myObject).then(function(hash){
    // protoProperty will not be present, instead you will just have an
    // object that looks like:
    // {
    //   example: 'Example'
    // }
    //
    // hash.hasOwnProperty('protoProperty'); // false
    // 'undefined' === typeof hash.protoProperty
  });
  ```

  @method hash
  @public
  @static
  @for rsvp
  @param {Object} object
  @param {String} [label] optional string that describes the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all properties of `promises`
  have been fulfilled, or rejected if any of them become rejected.
*/ function hash(object, label) {
    return Promise.resolve(object, label).then(function(object) {
        if (object === null || typeof object !== 'object') throw new TypeError("Promise.hash must be called with an object");
        return new PromiseHash(Promise, object, label).promise;
    });
}
function _possibleConstructorReturn$2(self1, call) {
    if (!self1) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return call && (typeof call === "object" || typeof call === "function") ? call : self1;
}
function _inherits$2(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var HashSettled = function(_PromiseHash) {
    _inherits$2(HashSettled, _PromiseHash);
    function HashSettled(Constructor, object, label) {
        return _possibleConstructorReturn$2(this, _PromiseHash.call(this, Constructor, object, false, label));
    }
    return HashSettled;
}(PromiseHash);
HashSettled.prototype._setResultAt = setSettledResult;
/**
  `hashSettled` is similar to `allSettled`, but takes an object
  instead of an array for its `promises` argument.

  Unlike `all` or `hash`, which implement a fail-fast method,
  but like `allSettled`, `hashSettled` waits until all the
  constituent promises have returned and then shows you all the results
  with their states and values/reasons. This is useful if you want to
  handle multiple promises' failure states together as a set.

  Returns a promise that is fulfilled when all the given promises have been
  settled, or rejected if the passed parameters are invalid.

  The returned promise is fulfilled with a hash that has the same key names as
  the `promises` object argument. If any of the values in the object are not
  promises, they will be copied over to the fulfilled object and marked with state
  'fulfilled'.

  Example:

  ```javascript
  import { hashSettled, resolve } from 'rsvp';

  let promises = {
    myPromise: resolve(1),
    yourPromise: resolve(2),
    theirPromise: resolve(3),
    notAPromise: 4
  };

  hashSettled(promises).then(function(hash){
    // hash here is an object that looks like:
    // {
    //   myPromise: { state: 'fulfilled', value: 1 },
    //   yourPromise: { state: 'fulfilled', value: 2 },
    //   theirPromise: { state: 'fulfilled', value: 3 },
    //   notAPromise: { state: 'fulfilled', value: 4 }
    // }
  });
  ```

  If any of the `promises` given to `hash` are rejected, the state will
  be set to 'rejected' and the reason for rejection provided.

  Example:

  ```javascript
  import { hashSettled, reject, resolve } from 'rsvp';

  let promises = {
    myPromise: resolve(1),
    rejectedPromise: reject(new Error('rejection')),
    anotherRejectedPromise: reject(new Error('more rejection')),
  };

  hashSettled(promises).then(function(hash){
    // hash here is an object that looks like:
    // {
    //   myPromise:              { state: 'fulfilled', value: 1 },
    //   rejectedPromise:        { state: 'rejected', reason: Error },
    //   anotherRejectedPromise: { state: 'rejected', reason: Error },
    // }
    // Note that for rejectedPromise, reason.message == 'rejection',
    // and for anotherRejectedPromise, reason.message == 'more rejection'.
  });
  ```

  An important note: `hashSettled` is intended for plain JavaScript objects that
  are just a set of keys and values. `hashSettled` will NOT preserve prototype
  chains.

  Example:

  ```javascript
  import Promise, { hashSettled, resolve } from 'rsvp';

  function MyConstructor(){
    this.example = resolve('Example');
  }

  MyConstructor.prototype = {
    protoProperty: Promise.resolve('Proto Property')
  };

  let myObject = new MyConstructor();

  hashSettled(myObject).then(function(hash){
    // protoProperty will not be present, instead you will just have an
    // object that looks like:
    // {
    //   example: { state: 'fulfilled', value: 'Example' }
    // }
    //
    // hash.hasOwnProperty('protoProperty'); // false
    // 'undefined' === typeof hash.protoProperty
  });
  ```

  @method hashSettled
  @public
  @for rsvp
  @param {Object} object
  @param {String} [label] optional string that describes the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when when all properties of `promises`
  have been settled.
  @static
*/ function hashSettled(object, label) {
    return Promise.resolve(object, label).then(function(object) {
        if (object === null || typeof object !== 'object') throw new TypeError("hashSettled must be called with an object");
        return new HashSettled(Promise, object, false, label).promise;
    });
}
/**
  `rethrow` will rethrow an error on the next turn of the JavaScript event
  loop in order to aid debugging.

  Promises A+ specifies that any exceptions that occur with a promise must be
  caught by the promises implementation and bubbled to the last handler. For
  this reason, it is recommended that you always specify a second rejection
  handler function to `then`. However, `rethrow` will throw the exception
  outside of the promise, so it bubbles up to your console if in the browser,
  or domain/cause uncaught exception in Node. `rethrow` will also throw the
  error again so the error can be handled by the promise per the spec.

  ```javascript
  import { rethrow } from 'rsvp';

  function throws(){
    throw new Error('Whoops!');
  }

  let promise = new Promise(function(resolve, reject){
    throws();
  });

  promise.catch(rethrow).then(function(){
    // Code here doesn't run because the promise became rejected due to an
    // error!
  }, function (err){
    // handle the error here
  });
  ```

  The 'Whoops' error will be thrown on the next turn of the event loop
  and you can watch for it in your console. You can also handle it using a
  rejection handler given to `.then` or `.catch` on the returned promise.

  @method rethrow
  @public
  @static
  @for rsvp
  @param {Error} reason reason the promise became rejected.
  @throws Error
  @static
*/ function rethrow(reason) {
    setTimeout(function() {
        throw reason;
    });
    throw reason;
}
/**
  `defer` returns an object similar to jQuery's `$.Deferred`.
  `defer` should be used when porting over code reliant on `$.Deferred`'s
  interface. New code should use the `Promise` constructor instead.

  The object returned from `defer` is a plain object with three properties:

  * promise - an `Promise`.
  * reject - a function that causes the `promise` property on this object to
    become rejected
  * resolve - a function that causes the `promise` property on this object to
    become fulfilled.

  Example:

   ```javascript
   let deferred = defer();

   deferred.resolve("Success!");

   deferred.promise.then(function(value){
     // value here is "Success!"
   });
   ```

  @method defer
  @public
  @static
  @for rsvp
  @param {String} [label] optional string for labeling the promise.
  Useful for tooling.
  @return {Object}
 */ function defer(label) {
    var deferred = {
        resolve: undefined,
        reject: undefined
    };
    deferred.promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    }, label);
    return deferred;
}
function _possibleConstructorReturn$3(self1, call) {
    if (!self1) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return call && (typeof call === "object" || typeof call === "function") ? call : self1;
}
function _inherits$3(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var MapEnumerator = function(_Enumerator) {
    _inherits$3(MapEnumerator, _Enumerator);
    function MapEnumerator(Constructor, entries, mapFn, label) {
        return _possibleConstructorReturn$3(this, _Enumerator.call(this, Constructor, entries, true, label, mapFn));
    }
    MapEnumerator.prototype._init = function _init(Constructor, input, bool, label, mapFn) {
        var len = input.length || 0;
        this.length = len;
        this._remaining = len;
        this._result = new Array(len);
        this._mapFn = mapFn;
        this._enumerate(input);
    };
    MapEnumerator.prototype._setResultAt = function _setResultAt(state, i, value, firstPass) {
        if (firstPass) {
            var val = tryCatch(this._mapFn)(value, i);
            if (val === TRY_CATCH_ERROR) this._settledAt(REJECTED, i, val.error, false);
            else this._eachEntry(val, i, false);
        } else {
            this._remaining--;
            this._result[i] = value;
        }
    };
    return MapEnumerator;
}(Enumerator);
/**
 `map` is similar to JavaScript's native `map` method. `mapFn` is eagerly called
  meaning that as soon as any promise resolves its value will be passed to `mapFn`.
  `map` returns a promise that will become fulfilled with the result of running
  `mapFn` on the values the promises become fulfilled with.

  For example:

  ```javascript
  import { map, resolve } from 'rsvp';

  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  let mapFn = function(item){
    return item + 1;
  };

  map(promises, mapFn).then(function(result){
    // result is [ 2, 3, 4 ]
  });
  ```

  If any of the `promises` given to `map` are rejected, the first promise
  that is rejected will be given as an argument to the returned promise's
  rejection handler. For example:

  ```javascript
  import { map, reject, resolve } from 'rsvp';

  let promise1 = resolve(1);
  let promise2 = reject(new Error('2'));
  let promise3 = reject(new Error('3'));
  let promises = [ promise1, promise2, promise3 ];

  let mapFn = function(item){
    return item + 1;
  };

  map(promises, mapFn).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(reason) {
    // reason.message === '2'
  });
  ```

  `map` will also wait if a promise is returned from `mapFn`. For example,
  say you want to get all comments from a set of blog posts, but you need
  the blog posts first because they contain a url to those comments.

  ```javscript
  import { map } from 'rsvp';

  let mapFn = function(blogPost){
    // getComments does some ajax and returns an Promise that is fulfilled
    // with some comments data
    return getComments(blogPost.comments_url);
  };

  // getBlogPosts does some ajax and returns an Promise that is fulfilled
  // with some blog post data
  map(getBlogPosts(), mapFn).then(function(comments){
    // comments is the result of asking the server for the comments
    // of all blog posts returned from getBlogPosts()
  });
  ```

  @method map
  @public
  @static
  @for rsvp
  @param {Array} promises
  @param {Function} mapFn function to be called on each fulfilled promise.
  @param {String} [label] optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled with the result of calling
  `mapFn` on each fulfilled promise or value when they become fulfilled.
   The promise will be rejected if any of the given `promises` become rejected.
*/ function map(promises, mapFn, label) {
    if (typeof mapFn !== 'function') return Promise.reject(new TypeError("map expects a function as a second argument"), label);
    return Promise.resolve(promises, label).then(function(promises) {
        if (!Array.isArray(promises)) throw new TypeError("map must be called with an array");
        return new MapEnumerator(Promise, promises, mapFn, label).promise;
    });
}
/**
  This is a convenient alias for `Promise.resolve`.

  @method resolve
  @public
  @static
  @for rsvp
  @param {*} value value that the returned promise will be resolved with
  @param {String} [label] optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/ function resolve$2(value, label) {
    return Promise.resolve(value, label);
}
/**
  This is a convenient alias for `Promise.reject`.

  @method reject
  @public
  @static
  @for rsvp
  @param {*} reason value that the returned promise will be rejected with.
  @param {String} [label] optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/ function reject$2(reason, label) {
    return Promise.reject(reason, label);
}
function _possibleConstructorReturn$4(self1, call) {
    if (!self1) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return call && (typeof call === "object" || typeof call === "function") ? call : self1;
}
function _inherits$4(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var EMPTY_OBJECT = {};
var FilterEnumerator = function(_MapEnumerator) {
    _inherits$4(FilterEnumerator, _MapEnumerator);
    function FilterEnumerator() {
        return _possibleConstructorReturn$4(this, _MapEnumerator.apply(this, arguments));
    }
    FilterEnumerator.prototype._checkFullfillment = function _checkFullfillment() {
        if (this._remaining === 0 && this._result !== null) {
            var result = this._result.filter(function(val) {
                return val !== EMPTY_OBJECT;
            });
            fulfill(this.promise, result);
            this._result = null;
        }
    };
    FilterEnumerator.prototype._setResultAt = function _setResultAt(state, i, value, firstPass) {
        if (firstPass) {
            this._result[i] = value;
            var val = tryCatch(this._mapFn)(value, i);
            if (val === TRY_CATCH_ERROR) this._settledAt(REJECTED, i, val.error, false);
            else this._eachEntry(val, i, false);
        } else {
            this._remaining--;
            if (!value) this._result[i] = EMPTY_OBJECT;
        }
    };
    return FilterEnumerator;
}(MapEnumerator);
/**
 `filter` is similar to JavaScript's native `filter` method.
 `filterFn` is eagerly called meaning that as soon as any promise
  resolves its value will be passed to `filterFn`. `filter` returns
  a promise that will become fulfilled with the result of running
  `filterFn` on the values the promises become fulfilled with.

  For example:

  ```javascript
  import { filter, resolve } from 'rsvp';

  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);

  let promises = [promise1, promise2, promise3];

  let filterFn = function(item){
    return item > 1;
  };

  filter(promises, filterFn).then(function(result){
    // result is [ 2, 3 ]
  });
  ```

  If any of the `promises` given to `filter` are rejected, the first promise
  that is rejected will be given as an argument to the returned promise's
  rejection handler. For example:

  ```javascript
  import { filter, reject, resolve } from 'rsvp';

  let promise1 = resolve(1);
  let promise2 = reject(new Error('2'));
  let promise3 = reject(new Error('3'));
  let promises = [ promise1, promise2, promise3 ];

  let filterFn = function(item){
    return item > 1;
  };

  filter(promises, filterFn).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(reason) {
    // reason.message === '2'
  });
  ```

  `filter` will also wait for any promises returned from `filterFn`.
  For instance, you may want to fetch a list of users then return a subset
  of those users based on some asynchronous operation:

  ```javascript
  import { filter, resolve } from 'rsvp';

  let alice = { name: 'alice' };
  let bob   = { name: 'bob' };
  let users = [ alice, bob ];

  let promises = users.map(function(user){
    return resolve(user);
  });

  let filterFn = function(user){
    // Here, Alice has permissions to create a blog post, but Bob does not.
    return getPrivilegesForUser(user).then(function(privs){
      return privs.can_create_blog_post === true;
    });
  };
  filter(promises, filterFn).then(function(users){
    // true, because the server told us only Alice can create a blog post.
    users.length === 1;
    // false, because Alice is the only user present in `users`
    users[0] === bob;
  });
  ```

  @method filter
  @public
  @static
  @for rsvp
  @param {Array} promises
  @param {Function} filterFn - function to be called on each resolved value to
  filter the final results.
  @param {String} [label] optional string describing the promise. Useful for
  tooling.
  @return {Promise}
*/ function filter(promises, filterFn, label) {
    if (typeof filterFn !== 'function') return Promise.reject(new TypeError("filter expects function as a second argument"), label);
    return Promise.resolve(promises, label).then(function(promises) {
        if (!Array.isArray(promises)) throw new TypeError("filter must be called with an array");
        return new FilterEnumerator(Promise, promises, filterFn, label).promise;
    });
}
var len = 0;
var vertxNext = void 0;
function asap(callback, arg) {
    queue$1[len] = callback;
    queue$1[len + 1] = arg;
    len += 2;
    if (len === 2) // If len is 1, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    scheduleFlush$1();
}
var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && false;
// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
// node
function useNextTick() {
    var nextTick = process.nextTick;
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // setImmediate should be used instead instead
    var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
    if (Array.isArray(version) && version[1] === '0' && version[2] === '10') nextTick = setImmediate;
    return function() {
        return nextTick(flush);
    };
}
// vertx
function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') return function() {
        vertxNext(flush);
    };
    return useSetTimeout();
}
function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {
        characterData: true
    });
    return function() {
        return node.data = iterations = ++iterations % 2;
    };
}
// web worker
function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function() {
        return channel.port2.postMessage(0);
    };
}
function useSetTimeout() {
    return function() {
        return setTimeout(flush, 1);
    };
}
var queue$1 = new Array(1000);
function flush() {
    for(var i = 0; i < len; i += 2){
        var callback = queue$1[i];
        var arg = queue$1[i + 1];
        callback(arg);
        queue$1[i] = undefined;
        queue$1[i + 1] = undefined;
    }
    len = 0;
}
function attemptVertex() {
    try {
        var vertx = Function('return this')().require('vertx');
        vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return useVertxTimer();
    } catch (e) {
        return useSetTimeout();
    }
}
var scheduleFlush$1 = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) scheduleFlush$1 = useNextTick();
else if (BrowserMutationObserver) scheduleFlush$1 = useMutationObserver();
else if (isWorker) scheduleFlush$1 = useMessageChannel();
else if (browserWindow === undefined && true) scheduleFlush$1 = attemptVertex();
else scheduleFlush$1 = useSetTimeout();
// defaults
config.async = asap;
config.after = function(cb) {
    return setTimeout(cb, 0);
};
var cast = resolve$2;
var async = function(callback, arg) {
    return config.async(callback, arg);
};
function on() {
    config.on.apply(config, arguments);
}
function off() {
    config.off.apply(config, arguments);
}
// Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
    var callbacks = window['__PROMISE_INSTRUMENTATION__'];
    configure('instrument', true);
    for(var eventName in callbacks)if (callbacks.hasOwnProperty(eventName)) on(eventName, callbacks[eventName]);
}
// the default export here is for backwards compat:
//   https://github.com/tildeio/rsvp.js/issues/434
var rsvp = {
    asap: asap,
    cast: cast,
    Promise: Promise,
    EventTarget: EventTarget,
    all: all$1,
    allSettled: allSettled,
    race: race$1,
    hash: hash,
    hashSettled: hashSettled,
    rethrow: rethrow,
    defer: defer,
    denodeify: denodeify,
    configure: configure,
    on: on,
    off: off,
    resolve: resolve$2,
    reject: reject$2,
    map: map,
    async: async,
    filter: filter
};
exports.default = rsvp;

},{"41089d4dfa957c3c":"iLTG4","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"iLTG4":[function(require,module,exports,__globalThis) {
// shim for using process in browser
var process = module.exports = {};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function() {
    try {
        if (typeof setTimeout === 'function') cachedSetTimeout = setTimeout;
        else cachedSetTimeout = defaultSetTimout;
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') cachedClearTimeout = clearTimeout;
        else cachedClearTimeout = defaultClearTimeout;
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) //normal enviroments in sane situations
    return setTimeout(fun, 0);
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) //normal enviroments in sane situations
    return clearTimeout(marker);
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) return;
    draining = false;
    if (currentQueue.length) queue = currentQueue.concat(queue);
    else queueIndex = -1;
    if (queue.length) drainQueue();
}
function drainQueue() {
    if (draining) return;
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while(++queueIndex < len)if (currentQueue) currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) runTimeout(drainQueue);
};
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
    return [];
};
process.binding = function(name) {
    throw new Error('process.binding is not supported');
};
process.cwd = function() {
    return '/';
};
process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() {
    return 0;
};

},{}],"euUya":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "toReadOnlyRouteInfo", ()=>toReadOnlyRouteInfo);
parcelHelpers.export(exports, "ResolvedRouteInfo", ()=>ResolvedRouteInfo);
parcelHelpers.export(exports, "UnresolvedRouteInfoByParam", ()=>UnresolvedRouteInfoByParam);
parcelHelpers.export(exports, "UnresolvedRouteInfoByObject", ()=>UnresolvedRouteInfoByObject);
var _rsvp = require("rsvp");
var _transition = require("./transition");
var _utils = require("./utils");
var _transitionAbortedError = require("./transition-aborted-error");
let ROUTE_INFOS = new WeakMap();
function toReadOnlyRouteInfo(routeInfos, queryParams = {}, options = {
    includeAttributes: false,
    localizeMapUpdates: false
}) {
    const LOCAL_ROUTE_INFOS = new WeakMap();
    return routeInfos.map((info, i)=>{
        let { name, params, paramNames, context, route } = info;
        // SAFETY: This should be safe since it is just for use as a key
        let key = info;
        if (ROUTE_INFOS.has(key) && options.includeAttributes) {
            let routeInfo = ROUTE_INFOS.get(key);
            routeInfo = attachMetadata(route, routeInfo);
            let routeInfoWithAttribute = createRouteInfoWithAttributes(routeInfo, context);
            LOCAL_ROUTE_INFOS.set(key, routeInfo);
            if (!options.localizeMapUpdates) ROUTE_INFOS.set(key, routeInfoWithAttribute);
            return routeInfoWithAttribute;
        }
        const routeInfosRef = options.localizeMapUpdates ? LOCAL_ROUTE_INFOS : ROUTE_INFOS;
        let routeInfo = {
            find (predicate, thisArg) {
                let publicInfo;
                let arr = [];
                if (predicate.length === 3) arr = routeInfos.map(// SAFETY: This should be safe since it is just for use as a key
                (info)=>routeInfosRef.get(info));
                for(let i = 0; routeInfos.length > i; i++){
                    // SAFETY: This should be safe since it is just for use as a key
                    publicInfo = routeInfosRef.get(routeInfos[i]);
                    if (predicate.call(thisArg, publicInfo, i, arr)) return publicInfo;
                }
                return undefined;
            },
            get name () {
                return name;
            },
            get paramNames () {
                return paramNames;
            },
            get metadata () {
                return buildRouteInfoMetadata(info.route);
            },
            get parent () {
                let parent = routeInfos[i - 1];
                if (parent === undefined) return null;
                // SAFETY: This should be safe since it is just for use as a key
                return routeInfosRef.get(parent);
            },
            get child () {
                let child = routeInfos[i + 1];
                if (child === undefined) return null;
                // SAFETY: This should be safe since it is just for use as a key
                return routeInfosRef.get(child);
            },
            get localName () {
                let parts = this.name.split('.');
                return parts[parts.length - 1];
            },
            get params () {
                return params;
            },
            get queryParams () {
                return queryParams;
            }
        };
        if (options.includeAttributes) routeInfo = createRouteInfoWithAttributes(routeInfo, context);
        // SAFETY: This should be safe since it is just for use as a key
        LOCAL_ROUTE_INFOS.set(info, routeInfo);
        if (!options.localizeMapUpdates) // SAFETY: This should be safe since it is just for use as a key
        ROUTE_INFOS.set(info, routeInfo);
        return routeInfo;
    });
}
function createRouteInfoWithAttributes(routeInfo, context) {
    let attributes = {
        get attributes () {
            return context;
        }
    };
    if (!Object.isExtensible(routeInfo) || routeInfo.hasOwnProperty('attributes')) return Object.freeze(Object.assign({}, routeInfo, attributes));
    return Object.assign(routeInfo, attributes);
}
function buildRouteInfoMetadata(route) {
    if (route !== undefined && route !== null && route.buildRouteInfoMetadata !== undefined) return route.buildRouteInfoMetadata();
    return null;
}
function attachMetadata(route, routeInfo) {
    let metadata = {
        get metadata () {
            return buildRouteInfoMetadata(route);
        }
    };
    if (!Object.isExtensible(routeInfo) || routeInfo.hasOwnProperty('metadata')) return Object.freeze(Object.assign({}, routeInfo, metadata));
    return Object.assign(routeInfo, metadata);
}
class InternalRouteInfo {
    constructor(router, name, paramNames, route){
        this._routePromise = undefined;
        this._route = null;
        this.params = {};
        this.isResolved = false;
        this.name = name;
        this.paramNames = paramNames;
        this.router = router;
        if (route) this._processRoute(route);
    }
    getModel(_transition) {
        return (0, _rsvp.Promise).resolve(this.context);
    }
    serialize(_context) {
        return this.params || {};
    }
    resolve(transition) {
        return (0, _rsvp.Promise).resolve(this.routePromise).then((route)=>{
            (0, _transitionAbortedError.throwIfAborted)(transition);
            return route;
        }).then(()=>this.runBeforeModelHook(transition)).then(()=>(0, _transitionAbortedError.throwIfAborted)(transition)).then(()=>this.getModel(transition)).then((resolvedModel)=>{
            (0, _transitionAbortedError.throwIfAborted)(transition);
            return resolvedModel;
        }).then((resolvedModel)=>this.runAfterModelHook(transition, resolvedModel)).then((resolvedModel)=>this.becomeResolved(transition, resolvedModel));
    }
    becomeResolved(transition, resolvedContext) {
        let params = this.serialize(resolvedContext);
        if (transition) {
            this.stashResolvedModel(transition, resolvedContext);
            transition[0, _transition.PARAMS_SYMBOL] = transition[0, _transition.PARAMS_SYMBOL] || {};
            transition[0, _transition.PARAMS_SYMBOL][this.name] = params;
        }
        let context;
        let contextsMatch = resolvedContext === this.context;
        if ('context' in this || !contextsMatch) context = resolvedContext;
        // SAFETY: Since this is just for lookup, it should be safe
        let cached = ROUTE_INFOS.get(this);
        let resolved = new ResolvedRouteInfo(this.router, this.name, this.paramNames, params, this.route, context);
        if (cached !== undefined) // SAFETY: This is potentially a bit risker, but for what we're doing, it should be ok.
        ROUTE_INFOS.set(resolved, cached);
        return resolved;
    }
    shouldSupersede(routeInfo) {
        // Prefer this newer routeInfo over `other` if:
        // 1) The other one doesn't exist
        // 2) The names don't match
        // 3) This route has a context that doesn't match
        //    the other one (or the other one doesn't have one).
        // 4) This route has parameters that don't match the other.
        if (!routeInfo) return true;
        let contextsMatch = routeInfo.context === this.context;
        return routeInfo.name !== this.name || 'context' in this && !contextsMatch || this.hasOwnProperty('params') && !paramsMatch(this.params, routeInfo.params);
    }
    get route() {
        // _route could be set to either a route object or undefined, so we
        // compare against null to know when it's been set
        if (this._route !== null) return this._route;
        return this.fetchRoute();
    }
    set route(route) {
        this._route = route;
    }
    get routePromise() {
        if (this._routePromise) return this._routePromise;
        this.fetchRoute();
        return this._routePromise;
    }
    set routePromise(routePromise) {
        this._routePromise = routePromise;
    }
    log(transition, message) {
        if (transition.log) transition.log(this.name + ': ' + message);
    }
    updateRoute(route) {
        route._internalName = this.name;
        return this.route = route;
    }
    runBeforeModelHook(transition) {
        if (transition.trigger) transition.trigger(true, 'willResolveModel', transition, this.route);
        let result;
        if (this.route) {
            if (this.route.beforeModel !== undefined) result = this.route.beforeModel(transition);
        }
        if ((0, _transition.isTransition)(result)) result = null;
        return (0, _rsvp.Promise).resolve(result);
    }
    runAfterModelHook(transition, resolvedModel) {
        // Stash the resolved model on the payload.
        // This makes it possible for users to swap out
        // the resolved model in afterModel.
        let name = this.name;
        this.stashResolvedModel(transition, resolvedModel);
        let result;
        if (this.route !== undefined) {
            if (this.route.afterModel !== undefined) result = this.route.afterModel(resolvedModel, transition);
        }
        result = (0, _transition.prepareResult)(result);
        return (0, _rsvp.Promise).resolve(result).then(()=>{
            // Ignore the fulfilled value returned from afterModel.
            // Return the value stashed in resolvedModels, which
            // might have been swapped out in afterModel.
            // SAFTEY: We expect this to be of type T, though typing it as such is challenging.
            return transition.resolvedModels[name];
        });
    }
    stashResolvedModel(transition, resolvedModel) {
        transition.resolvedModels = transition.resolvedModels || {};
        // SAFETY: It's unfortunate that we have to do this cast. It should be safe though.
        transition.resolvedModels[this.name] = resolvedModel;
    }
    fetchRoute() {
        let route = this.router.getRoute(this.name);
        return this._processRoute(route);
    }
    _processRoute(route) {
        // Setup a routePromise so that we can wait for asynchronously loaded routes
        this.routePromise = (0, _rsvp.Promise).resolve(route);
        // Wait until the 'route' property has been updated when chaining to a route
        // that is a promise
        if ((0, _utils.isPromise)(route)) {
            this.routePromise = this.routePromise.then((r)=>{
                return this.updateRoute(r);
            });
            // set to undefined to avoid recursive loop in the route getter
            return this.route = undefined;
        } else if (route) return this.updateRoute(route);
        return undefined;
    }
}
exports.default = InternalRouteInfo;
class ResolvedRouteInfo extends InternalRouteInfo {
    constructor(router, name, paramNames, params, route, context){
        super(router, name, paramNames, route);
        this.params = params;
        this.isResolved = true;
        this.context = context;
    }
    resolve(transition) {
        // A ResolvedRouteInfo just resolved with itself.
        if (transition && transition.resolvedModels) transition.resolvedModels[this.name] = this.context;
        return (0, _rsvp.Promise).resolve(this);
    }
}
class UnresolvedRouteInfoByParam extends InternalRouteInfo {
    constructor(router, name, paramNames, params, route){
        super(router, name, paramNames, route);
        this.params = {};
        if (params) this.params = params;
    }
    getModel(transition) {
        let fullParams = this.params;
        if (transition && transition[0, _transition.QUERY_PARAMS_SYMBOL]) {
            fullParams = {};
            (0, _utils.merge)(fullParams, this.params);
            fullParams.queryParams = transition[0, _transition.QUERY_PARAMS_SYMBOL];
        }
        let route = this.route;
        let result;
        // FIXME: Review these casts
        if (route.deserialize) result = route.deserialize(fullParams, transition);
        else if (route.model) result = route.model(fullParams, transition);
        if (result && (0, _transition.isTransition)(result)) result = undefined;
        return (0, _rsvp.Promise).resolve(result);
    }
}
class UnresolvedRouteInfoByObject extends InternalRouteInfo {
    constructor(router, name, paramNames, context){
        super(router, name, paramNames);
        this.context = context;
        this.serializer = this.router.getSerializer(name);
    }
    getModel(transition) {
        if (this.router.log !== undefined) this.router.log(this.name + ': resolving provided model');
        return super.getModel(transition);
    }
    /**
      @private
  
      Serializes a route using its custom `serialize` method or
      by a default that looks up the expected property name from
      the dynamic segment.
  
      @param {Object} model the model to be serialized for this route
    */ serialize(model) {
        let { paramNames, context } = this;
        if (!model) // SAFETY: By the time we serialize, we expect to be resolved.
        // This may not be an entirely safe assumption though no tests fail.
        model = context;
        let object = {};
        if ((0, _utils.isParam)(model)) {
            object[paramNames[0]] = model;
            return object;
        }
        // Use custom serialize if it exists.
        if (this.serializer) // invoke this.serializer unbound (getSerializer returns a stateless function)
        return this.serializer.call(null, model, paramNames);
        else if (this.route !== undefined) {
            if (this.route.serialize) return this.route.serialize(model, paramNames);
        }
        if (paramNames.length !== 1) return;
        let name = paramNames[0];
        if (/_id$/.test(name)) // SAFETY: Model is supposed to extend IModel already
        object[name] = model.id;
        else object[name] = model;
        return object;
    }
}
function paramsMatch(a, b) {
    if (a === b) // Both are identical, may both be undefined
    return true;
    if (!a || !b) // Only one is undefined, already checked they aren't identical
    return false;
    // Note: this assumes that both params have the same
    // number of keys, but since we're comparing the
    // same routes, they should.
    for(let k in a){
        if (a.hasOwnProperty(k) && a[k] !== b[k]) return false;
    }
    return true;
}

},{"rsvp":"lmmjP","./transition":"eQZIA","./utils":"6JhJh","./transition-aborted-error":"19V3P","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"eQZIA":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "STATE_SYMBOL", ()=>STATE_SYMBOL);
parcelHelpers.export(exports, "PARAMS_SYMBOL", ()=>PARAMS_SYMBOL);
parcelHelpers.export(exports, "QUERY_PARAMS_SYMBOL", ()=>QUERY_PARAMS_SYMBOL);
parcelHelpers.export(exports, "REDIRECT_DESTINATION_SYMBOL", ()=>REDIRECT_DESTINATION_SYMBOL);
/**
  @private

  Logs and returns an instance of TransitionAborted.
 */ parcelHelpers.export(exports, "logAbort", ()=>logAbort);
parcelHelpers.export(exports, "isTransition", ()=>isTransition);
parcelHelpers.export(exports, "prepareResult", ()=>prepareResult);
var _rsvp = require("rsvp");
var _transitionAbortedError = require("./transition-aborted-error");
var _utils = require("./utils");
var _env = require("@glimmer/env");
const STATE_SYMBOL = `__STATE__-2619860001345920-3322w3`;
const PARAMS_SYMBOL = `__PARAMS__-261986232992830203-23323`;
const QUERY_PARAMS_SYMBOL = `__QPS__-2619863929824844-32323`;
const REDIRECT_DESTINATION_SYMBOL = `__RDS__-2619863929824844-32323`;
class Transition {
    constructor(router, intent, state, error, previousTransition){
        this.from = null;
        this.to = undefined;
        this.isAborted = false;
        this.isActive = true;
        this.urlMethod = 'update';
        this.resolveIndex = 0;
        this.queryParamsOnly = false;
        this.isTransition = true;
        this.isCausedByAbortingTransition = false;
        this.isCausedByInitialTransition = false;
        this.isCausedByAbortingReplaceTransition = false;
        this._visibleQueryParams = {};
        this.isIntermediate = false;
        this[STATE_SYMBOL] = state || router.state;
        this.intent = intent;
        this.router = router;
        this.data = intent && intent.data || {};
        this.resolvedModels = {};
        this[QUERY_PARAMS_SYMBOL] = {};
        this.promise = undefined;
        this.error = undefined;
        this[PARAMS_SYMBOL] = {};
        this.routeInfos = [];
        this.targetName = undefined;
        this.pivotHandler = undefined;
        this.sequence = -1;
        if (0, _env.DEBUG) {
            let error = new Error(`Transition creation stack`);
            this.debugCreationStack = ()=>error.stack;
            // not aborted yet, will be replaced when `this.isAborted` is set
            this.debugAbortStack = ()=>undefined;
            this.debugPreviousTransition = previousTransition;
        }
        if (error) {
            this.promise = (0, _rsvp.Promise).reject(error);
            this.error = error;
            return;
        }
        // if you're doing multiple redirects, need the new transition to know if it
        // is actually part of the first transition or not. Any further redirects
        // in the initial transition also need to know if they are part of the
        // initial transition
        this.isCausedByAbortingTransition = !!previousTransition;
        this.isCausedByInitialTransition = !!previousTransition && (previousTransition.isCausedByInitialTransition || previousTransition.sequence === 0);
        // Every transition in the chain is a replace
        this.isCausedByAbortingReplaceTransition = !!previousTransition && previousTransition.urlMethod === 'replace' && (!previousTransition.isCausedByAbortingTransition || previousTransition.isCausedByAbortingReplaceTransition);
        if (state) {
            this[PARAMS_SYMBOL] = state.params;
            this[QUERY_PARAMS_SYMBOL] = state.queryParams;
            this.routeInfos = state.routeInfos;
            let len = state.routeInfos.length;
            if (len) this.targetName = state.routeInfos[len - 1].name;
            for(let i = 0; i < len; ++i){
                let handlerInfo = state.routeInfos[i];
                // TODO: this all seems hacky
                if (!handlerInfo.isResolved) break;
                this.pivotHandler = handlerInfo.route;
            }
            this.sequence = router.currentSequence++;
            this.promise = state.resolve(this).catch((result)=>{
                let error = this.router.transitionDidError(result, this);
                throw error;
            }, (0, _utils.promiseLabel)('Handle Abort'));
        } else {
            this.promise = (0, _rsvp.Promise).resolve(this[STATE_SYMBOL]);
            this[PARAMS_SYMBOL] = {};
        }
    }
    /**
      The Transition's internal promise. Calling `.then` on this property
      is that same as calling `.then` on the Transition object itself, but
      this property is exposed for when you want to pass around a
      Transition's promise, but not the Transition object itself, since
      Transition object can be externally `abort`ed, while the promise
      cannot.
  
      @property promise
      @type {Object}
      @public
     */ /**
      Custom state can be stored on a Transition's `data` object.
      This can be useful for decorating a Transition within an earlier
      hook and shared with a later hook. Properties set on `data` will
      be copied to new transitions generated by calling `retry` on this
      transition.
  
      @property data
      @type {Object}
      @public
     */ /**
      A standard promise hook that resolves if the transition
      succeeds and rejects if it fails/redirects/aborts.
  
      Forwards to the internal `promise` property which you can
      use in situations where you want to pass around a thenable,
      but not the Transition itself.
  
      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
      @public
     */ then(onFulfilled, onRejected, label) {
        return this.promise.then(onFulfilled, onRejected, label);
    }
    /**
  
      Forwards to the internal `promise` property which you can
      use in situations where you want to pass around a thennable,
      but not the Transition itself.
  
      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
      @public
     */ catch(onRejection, label) {
        return this.promise.catch(onRejection, label);
    }
    /**
  
      Forwards to the internal `promise` property which you can
      use in situations where you want to pass around a thenable,
      but not the Transition itself.
  
      @method finally
      @param {Function} callback
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
      @public
     */ finally(callback, label) {
        return this.promise.finally(callback, label);
    }
    /**
      Aborts the Transition. Note you can also implicitly abort a transition
      by initiating another transition while a previous one is underway.
  
      @method abort
      @return {Transition} this transition
      @public
     */ abort() {
        this.rollback();
        let transition = new Transition(this.router, undefined, undefined, undefined);
        transition.to = this.from;
        transition.from = this.from;
        transition.isAborted = true;
        this.router.routeWillChange(transition);
        this.router.routeDidChange(transition);
        return this;
    }
    rollback() {
        if (!this.isAborted) {
            (0, _utils.log)(this.router, this.sequence, this.targetName + ': transition was aborted');
            if (0, _env.DEBUG) {
                let error = new Error(`Transition aborted stack`);
                this.debugAbortStack = ()=>error.stack;
            }
            if (this.intent !== undefined && this.intent !== null) this.intent.preTransitionState = this.router.state;
            this.isAborted = true;
            this.isActive = false;
            this.router.activeTransition = undefined;
        }
    }
    redirect(newTransition) {
        this[REDIRECT_DESTINATION_SYMBOL] = newTransition;
        this.rollback();
        this.router.routeWillChange(newTransition);
    }
    /**
  
      Retries a previously-aborted transition (making sure to abort the
      transition if it's still active). Returns a new transition that
      represents the new attempt to transition.
  
      @method retry
      @return {Transition} new transition
      @public
     */ retry() {
        // TODO: add tests for merged state retry()s
        this.abort();
        let newTransition = this.router.transitionByIntent(this.intent, false);
        // inheriting a `null` urlMethod is not valid
        // the urlMethod is only set to `null` when
        // the transition is initiated *after* the url
        // has been updated (i.e. `router.handleURL`)
        //
        // in that scenario, the url method cannot be
        // inherited for a new transition because then
        // the url would not update even though it should
        if (this.urlMethod !== null) newTransition.method(this.urlMethod);
        return newTransition;
    }
    /**
  
      Sets the URL-changing method to be employed at the end of a
      successful transition. By default, a new Transition will just
      use `updateURL`, but passing 'replace' to this method will
      cause the URL to update using 'replaceWith' instead. Omitting
      a parameter will disable the URL change, allowing for transitions
      that don't update the URL at completion (this is also used for
      handleURL, since the URL has already changed before the
      transition took place).
  
      @method method
      @param {String} method the type of URL-changing method to use
        at the end of a transition. Accepted values are 'replace',
        falsy values, or any other non-falsy value (which is
        interpreted as an updateURL transition).
  
      @return {Transition} this transition
      @public
     */ method(method) {
        this.urlMethod = method;
        return this;
    }
    // Alias 'trigger' as 'send'
    send(ignoreFailure = false, _name, err, transition, handler) {
        this.trigger(ignoreFailure, _name, err, transition, handler);
    }
    /**
  
      Fires an event on the current list of resolved/resolving
      handlers within this transition. Useful for firing events
      on route hierarchies that haven't fully been entered yet.
  
      Note: This method is also aliased as `send`
  
      @method trigger
      @param {Boolean} [ignoreFailure=false] a boolean specifying whether unhandled events throw an error
      @param {String} name the name of the event to fire
      @public
     */ trigger(ignoreFailure = false, name, ...args) {
        // TODO: Deprecate the current signature
        if (typeof ignoreFailure === 'string') {
            name = ignoreFailure;
            ignoreFailure = false;
        }
        this.router.triggerEvent(this[STATE_SYMBOL].routeInfos.slice(0, this.resolveIndex + 1), ignoreFailure, name, args);
    }
    /**
      Transitions are aborted and their promises rejected
      when redirects occur; this method returns a promise
      that will follow any redirects that occur and fulfill
      with the value fulfilled by any redirecting transitions
      that occur.
  
      @method followRedirects
      @return {Promise} a promise that fulfills with the same
        value that the final redirecting transition fulfills with
      @public
     */ followRedirects() {
        return this.promise.catch((reason)=>{
            if (this[REDIRECT_DESTINATION_SYMBOL]) return this[REDIRECT_DESTINATION_SYMBOL].followRedirects();
            return (0, _rsvp.Promise).reject(reason);
        });
    }
    toString() {
        return 'Transition (sequence ' + this.sequence + ')';
    }
    /**
      @private
     */ log(message) {
        (0, _utils.log)(this.router, this.sequence, message);
    }
}
exports.default = Transition;
function logAbort(transition) {
    (0, _utils.log)(transition.router, transition.sequence, 'detected abort.');
    return (0, _transitionAbortedError.buildTransitionAborted)();
}
function isTransition(obj) {
    return typeof obj === 'object' && obj instanceof Transition && obj.isTransition;
}
function prepareResult(obj) {
    if (isTransition(obj)) return null;
    return obj;
}

},{"rsvp":"lmmjP","./transition-aborted-error":"19V3P","./utils":"6JhJh","@glimmer/env":"iEUnm","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"19V3P":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "buildTransitionAborted", ()=>buildTransitionAborted);
parcelHelpers.export(exports, "isTransitionAborted", ()=>isTransitionAborted);
parcelHelpers.export(exports, "throwIfAborted", ()=>throwIfAborted);
function buildTransitionAborted() {
    let error = new Error('TransitionAborted');
    error.name = 'TransitionAborted';
    error.code = 'TRANSITION_ABORTED';
    return error;
}
function isTransitionAborted(maybeError) {
    return typeof maybeError === 'object' && maybeError !== null && maybeError.code === 'TRANSITION_ABORTED';
}
function isAbortable(maybeAbortable) {
    return typeof maybeAbortable === 'object' && maybeAbortable !== null && typeof maybeAbortable.isAborted === 'boolean';
}
function throwIfAborted(maybe) {
    if (isAbortable(maybe) && maybe.isAborted) throw buildTransitionAborted();
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"6JhJh":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "slice", ()=>slice);
/**
  Determines if an object is Promise by checking if it is "thenable".
**/ parcelHelpers.export(exports, "isPromise", ()=>isPromise);
parcelHelpers.export(exports, "merge", ()=>merge);
/**
  @private

  Extracts query params from the end of an array
**/ parcelHelpers.export(exports, "extractQueryParams", ()=>extractQueryParams);
/**
  @private

  Coerces query param properties and array elements into strings.
**/ parcelHelpers.export(exports, "coerceQueryParamsToString", ()=>coerceQueryParamsToString);
/**
  @private
 */ parcelHelpers.export(exports, "log", ()=>log);
parcelHelpers.export(exports, "isParam", ()=>isParam);
parcelHelpers.export(exports, "forEach", ()=>forEach);
parcelHelpers.export(exports, "getChangelist", ()=>getChangelist);
parcelHelpers.export(exports, "promiseLabel", ()=>promiseLabel);
const slice = Array.prototype.slice;
const hasOwnProperty = Object.prototype.hasOwnProperty;
function isPromise(p) {
    return p !== null && typeof p === 'object' && typeof p.then === 'function';
}
function merge(hash, other) {
    for(let prop in other)if (hasOwnProperty.call(other, prop)) hash[prop] = other[prop];
}
function extractQueryParams(array) {
    let len = array && array.length, head, queryParams;
    if (len && len > 0) {
        let obj = array[len - 1];
        if (isQueryParamsContainer(obj)) {
            queryParams = obj.queryParams;
            head = slice.call(array, 0, len - 1);
            return [
                head,
                queryParams
            ];
        }
    }
    // SAFETY: We confirmed that the last item isn't a QP container
    return [
        array,
        null
    ];
}
// TODO: Actually check that Dict is QueryParams
function isQueryParamsContainer(obj) {
    if (obj && typeof obj === 'object') {
        let cast = obj;
        return 'queryParams' in cast && Object.keys(cast.queryParams).every((k)=>typeof k === 'string');
    }
    return false;
}
function coerceQueryParamsToString(queryParams) {
    for(let key in queryParams){
        let val = queryParams[key];
        if (typeof val === 'number') queryParams[key] = '' + val;
        else if (Array.isArray(val)) for(let i = 0, l = val.length; i < l; i++)val[i] = '' + val[i];
    }
}
function log(router, ...args) {
    if (!router.log) return;
    if (args.length === 2) {
        let [sequence, msg] = args;
        router.log('Transition #' + sequence + ': ' + msg);
    } else {
        let [msg] = args;
        router.log(msg);
    }
}
function isParam(object) {
    return typeof object === 'string' || object instanceof String || typeof object === 'number' || object instanceof Number;
}
function forEach(array, callback) {
    for(let i = 0, l = array.length; i < l && callback(array[i]) !== false; i++);
}
function getChangelist(oldObject, newObject) {
    let key;
    let results = {
        all: {},
        changed: {},
        removed: {}
    };
    merge(results.all, newObject);
    let didChange = false;
    coerceQueryParamsToString(oldObject);
    coerceQueryParamsToString(newObject);
    // Calculate removals
    for(key in oldObject){
        if (hasOwnProperty.call(oldObject, key)) {
            if (!hasOwnProperty.call(newObject, key)) {
                didChange = true;
                results.removed[key] = oldObject[key];
            }
        }
    }
    // Calculate changes
    for(key in newObject)if (hasOwnProperty.call(newObject, key)) {
        let oldElement = oldObject[key];
        let newElement = newObject[key];
        if (isArray(oldElement) && isArray(newElement)) {
            if (oldElement.length !== newElement.length) {
                results.changed[key] = newObject[key];
                didChange = true;
            } else {
                for(let i = 0, l = oldElement.length; i < l; i++)if (oldElement[i] !== newElement[i]) {
                    results.changed[key] = newObject[key];
                    didChange = true;
                }
            }
        } else if (oldObject[key] !== newObject[key]) {
            results.changed[key] = newObject[key];
            didChange = true;
        }
    }
    return didChange ? results : undefined;
}
function isArray(obj) {
    return Array.isArray(obj);
}
function promiseLabel(label) {
    return 'Router: ' + label;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"iEUnm":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "DEBUG", ()=>DEBUG);
parcelHelpers.export(exports, "CI", ()=>CI);
const DEBUG = false;
const CI = false;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"8z19V":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _routeInfo = require("../route-info");
var _transitionIntent = require("../transition-intent");
var _transitionState = require("../transition-state");
var _transitionStateDefault = parcelHelpers.interopDefault(_transitionState);
var _utils = require("../utils");
class NamedTransitionIntent extends (0, _transitionIntent.TransitionIntent) {
    constructor(router, name, pivotHandler, contexts = [], queryParams = {}, data){
        super(router, data);
        this.preTransitionState = undefined;
        this.name = name;
        this.pivotHandler = pivotHandler;
        this.contexts = contexts;
        this.queryParams = queryParams;
    }
    applyToState(oldState, isIntermediate) {
        let handlers = this.router.recognizer.handlersFor(this.name);
        let targetRouteName = handlers[handlers.length - 1].handler;
        return this.applyToHandlers(oldState, handlers, targetRouteName, isIntermediate, false);
    }
    applyToHandlers(oldState, parsedHandlers, targetRouteName, isIntermediate, checkingIfActive) {
        let i, len;
        let newState = new (0, _transitionStateDefault.default)();
        let objects = this.contexts.slice(0);
        let invalidateIndex = parsedHandlers.length;
        // Pivot handlers are provided for refresh transitions
        if (this.pivotHandler) {
            for(i = 0, len = parsedHandlers.length; i < len; ++i)if (parsedHandlers[i].handler === this.pivotHandler._internalName) {
                invalidateIndex = i;
                break;
            }
        }
        for(i = parsedHandlers.length - 1; i >= 0; --i){
            let result = parsedHandlers[i];
            let name = result.handler;
            let oldHandlerInfo = oldState.routeInfos[i];
            let newHandlerInfo = null;
            if (result.names.length > 0) {
                if (i >= invalidateIndex) newHandlerInfo = this.createParamHandlerInfo(name, result.names, objects, oldHandlerInfo);
                else newHandlerInfo = this.getHandlerInfoForDynamicSegment(name, result.names, objects, oldHandlerInfo, targetRouteName, i);
            } else // This route has no dynamic segment.
            // Therefore treat as a param-based handlerInfo
            // with empty params. This will cause the `model`
            // hook to be called with empty params, which is desirable.
            newHandlerInfo = this.createParamHandlerInfo(name, result.names, objects, oldHandlerInfo);
            if (checkingIfActive) {
                // If we're performing an isActive check, we want to
                // serialize URL params with the provided context, but
                // ignore mismatches between old and new context.
                newHandlerInfo = newHandlerInfo.becomeResolved(null, // SAFETY: This seems to imply that it would be resolved, but it's unclear if that's actually the case.
                newHandlerInfo.context);
                let oldContext = oldHandlerInfo && oldHandlerInfo.context;
                if (result.names.length > 0 && oldHandlerInfo.context !== undefined && newHandlerInfo.context === oldContext) // If contexts match in isActive test, assume params also match.
                // This allows for flexibility in not requiring that every last
                // handler provide a `serialize` method
                newHandlerInfo.params = oldHandlerInfo && oldHandlerInfo.params;
                newHandlerInfo.context = oldContext;
            }
            let handlerToUse = oldHandlerInfo;
            if (i >= invalidateIndex || newHandlerInfo.shouldSupersede(oldHandlerInfo)) {
                invalidateIndex = Math.min(i, invalidateIndex);
                handlerToUse = newHandlerInfo;
            }
            if (isIntermediate && !checkingIfActive) handlerToUse = handlerToUse.becomeResolved(null, // SAFETY: This seems to imply that it would be resolved, but it's unclear if that's actually the case.
            handlerToUse.context);
            newState.routeInfos.unshift(handlerToUse);
        }
        if (objects.length > 0) throw new Error('More context objects were passed than there are dynamic segments for the route: ' + targetRouteName);
        if (!isIntermediate) this.invalidateChildren(newState.routeInfos, invalidateIndex);
        (0, _utils.merge)(newState.queryParams, this.queryParams || {});
        if (isIntermediate && oldState.queryParams) (0, _utils.merge)(newState.queryParams, oldState.queryParams);
        return newState;
    }
    invalidateChildren(handlerInfos, invalidateIndex) {
        for(let i = invalidateIndex, l = handlerInfos.length; i < l; ++i){
            let handlerInfo = handlerInfos[i];
            if (handlerInfo.isResolved) {
                let { name, params, route, paramNames } = handlerInfos[i];
                handlerInfos[i] = new (0, _routeInfo.UnresolvedRouteInfoByParam)(this.router, name, paramNames, params, route);
            }
        }
    }
    getHandlerInfoForDynamicSegment(name, names, objects, oldHandlerInfo, _targetRouteName, i) {
        let objectToUse;
        if (objects.length > 0) {
            // Use the objects provided for this transition.
            objectToUse = objects[objects.length - 1];
            if ((0, _utils.isParam)(objectToUse)) return this.createParamHandlerInfo(name, names, objects, oldHandlerInfo);
            else objects.pop();
        } else if (oldHandlerInfo && oldHandlerInfo.name === name) // Reuse the matching oldHandlerInfo
        return oldHandlerInfo;
        else {
            if (this.preTransitionState) {
                let preTransitionHandlerInfo = this.preTransitionState.routeInfos[i];
                objectToUse = preTransitionHandlerInfo === null || preTransitionHandlerInfo === void 0 ? void 0 : preTransitionHandlerInfo.context;
            } else // Ideally we should throw this error to provide maximal
            // information to the user that not enough context objects
            // were provided, but this proves too cumbersome in Ember
            // in cases where inner template helpers are evaluated
            // before parent helpers un-render, in which cases this
            // error somewhat prematurely fires.
            //throw new Error("Not enough context objects were provided to complete a transition to " + targetRouteName + ". Specifically, the " + name + " route needs an object that can be serialized into its dynamic URL segments [" + names.join(', ') + "]");
            return oldHandlerInfo;
        }
        return new (0, _routeInfo.UnresolvedRouteInfoByObject)(this.router, name, names, objectToUse);
    }
    createParamHandlerInfo(name, names, objects, oldHandlerInfo) {
        let params = {};
        // Soak up all the provided string/numbers
        let numNames = names.length;
        let missingParams = [];
        while(numNames--){
            // Only use old params if the names match with the new handler
            let oldParams = oldHandlerInfo && name === oldHandlerInfo.name && oldHandlerInfo.params || {};
            let peek = objects[objects.length - 1];
            let paramName = names[numNames];
            if ((0, _utils.isParam)(peek)) params[paramName] = '' + objects.pop();
            else // If we're here, this means only some of the params
            // were string/number params, so try and use a param
            // value from a previous handler.
            if (oldParams.hasOwnProperty(paramName)) params[paramName] = oldParams[paramName];
            else missingParams.push(paramName);
        }
        if (missingParams.length > 0) throw new Error(`You didn't provide enough string/numeric parameters to satisfy all of the dynamic segments for route ${name}.` + ` Missing params: ${missingParams}`);
        return new (0, _routeInfo.UnresolvedRouteInfoByParam)(this.router, name, names, params);
    }
}
exports.default = NamedTransitionIntent;

},{"../route-info":"euUya","../transition-intent":"j32BT","../transition-state":"lAMtU","../utils":"6JhJh","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"j32BT":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TransitionIntent", ()=>TransitionIntent);
class TransitionIntent {
    constructor(router, data = {}){
        this.router = router;
        this.data = data;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lAMtU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TransitionError", ()=>TransitionError);
var _rsvp = require("rsvp");
var _utils = require("./utils");
var _transitionAbortedError = require("./transition-aborted-error");
function handleError(currentState, transition, error) {
    // This is the only possible
    // reject value of TransitionState#resolve
    let routeInfos = currentState.routeInfos;
    let errorHandlerIndex = transition.resolveIndex >= routeInfos.length ? routeInfos.length - 1 : transition.resolveIndex;
    let wasAborted = transition.isAborted;
    throw new TransitionError(error, currentState.routeInfos[errorHandlerIndex].route, wasAborted, currentState);
}
function resolveOneRouteInfo(currentState, transition) {
    if (transition.resolveIndex === currentState.routeInfos.length) // This is is the only possible
    // fulfill value of TransitionState#resolve
    return;
    let routeInfo = currentState.routeInfos[transition.resolveIndex];
    let callback = proceed.bind(null, currentState, transition);
    return routeInfo.resolve(transition).then(callback, null, currentState.promiseLabel('Proceed'));
}
function proceed(currentState, transition, resolvedRouteInfo) {
    let wasAlreadyResolved = currentState.routeInfos[transition.resolveIndex].isResolved;
    // Swap the previously unresolved routeInfo with
    // the resolved routeInfo
    currentState.routeInfos[transition.resolveIndex++] = resolvedRouteInfo;
    if (!wasAlreadyResolved) {
        // Call the redirect hook. The reason we call it here
        // vs. afterModel is so that redirects into child
        // routes don't re-run the model hooks for this
        // already-resolved route.
        let { route } = resolvedRouteInfo;
        if (route !== undefined) {
            if (route.redirect) route.redirect(resolvedRouteInfo.context, transition);
        }
    }
    // Proceed after ensuring that the redirect hook
    // didn't abort this transition by transitioning elsewhere.
    (0, _transitionAbortedError.throwIfAborted)(transition);
    return resolveOneRouteInfo(currentState, transition);
}
class TransitionState {
    constructor(){
        this.routeInfos = [];
        this.queryParams = {};
        this.params = {};
    }
    promiseLabel(label) {
        let targetName = '';
        (0, _utils.forEach)(this.routeInfos, function(routeInfo) {
            if (targetName !== '') targetName += '.';
            targetName += routeInfo.name;
            return true;
        });
        return (0, _utils.promiseLabel)("'" + targetName + "': " + label);
    }
    resolve(transition) {
        // First, calculate params for this state. This is useful
        // information to provide to the various route hooks.
        let params = this.params;
        (0, _utils.forEach)(this.routeInfos, (routeInfo)=>{
            params[routeInfo.name] = routeInfo.params || {};
            return true;
        });
        transition.resolveIndex = 0;
        let callback = resolveOneRouteInfo.bind(null, this, transition);
        let errorHandler = handleError.bind(null, this, transition);
        // The prelude RSVP.resolve() async moves us into the promise land.
        return (0, _rsvp.Promise).resolve(null, this.promiseLabel('Start transition')).then(callback, null, this.promiseLabel('Resolve route')).catch(errorHandler, this.promiseLabel('Handle error')).then(()=>this);
    }
}
exports.default = TransitionState;
class TransitionError {
    constructor(error, route, wasAborted, state){
        this.error = error;
        this.route = route;
        this.wasAborted = wasAborted;
        this.state = state;
    }
}

},{"rsvp":"lmmjP","./utils":"6JhJh","./transition-aborted-error":"19V3P","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jaGW3":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _routeInfo = require("../route-info");
var _transitionIntent = require("../transition-intent");
var _transitionState = require("../transition-state");
var _transitionStateDefault = parcelHelpers.interopDefault(_transitionState);
var _unrecognizedUrlError = require("../unrecognized-url-error");
var _unrecognizedUrlErrorDefault = parcelHelpers.interopDefault(_unrecognizedUrlError);
var _utils = require("../utils");
class URLTransitionIntent extends (0, _transitionIntent.TransitionIntent) {
    constructor(router, url, data){
        super(router, data);
        this.url = url;
        this.preTransitionState = undefined;
    }
    applyToState(oldState) {
        let newState = new (0, _transitionStateDefault.default)();
        let results = this.router.recognizer.recognize(this.url), i, len;
        if (!results) throw new (0, _unrecognizedUrlErrorDefault.default)(this.url);
        let statesDiffer = false;
        let _url = this.url;
        // Checks if a handler is accessible by URL. If it is not, an error is thrown.
        // For the case where the handler is loaded asynchronously, the error will be
        // thrown once it is loaded.
        function checkHandlerAccessibility(handler) {
            if (handler && handler.inaccessibleByURL) throw new (0, _unrecognizedUrlErrorDefault.default)(_url);
            return handler;
        }
        for(i = 0, len = results.length; i < len; ++i){
            let result = results[i];
            let name = result.handler;
            let paramNames = [];
            if (this.router.recognizer.hasRoute(name)) paramNames = this.router.recognizer.handlersFor(name)[i].names;
            let newRouteInfo = new (0, _routeInfo.UnresolvedRouteInfoByParam)(this.router, name, paramNames, result.params);
            let route = newRouteInfo.route;
            if (route) checkHandlerAccessibility(route);
            else // If the handler is being loaded asynchronously, check if we can
            // access it after it has resolved
            newRouteInfo.routePromise = newRouteInfo.routePromise.then(checkHandlerAccessibility);
            let oldRouteInfo = oldState.routeInfos[i];
            if (statesDiffer || newRouteInfo.shouldSupersede(oldRouteInfo)) {
                statesDiffer = true;
                newState.routeInfos[i] = newRouteInfo;
            } else newState.routeInfos[i] = oldRouteInfo;
        }
        (0, _utils.merge)(newState.queryParams, results.queryParams);
        return newState;
    }
}
exports.default = URLTransitionIntent;

},{"../route-info":"euUya","../transition-intent":"j32BT","../transition-state":"lAMtU","../unrecognized-url-error":"aZoIN","../utils":"6JhJh","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"aZoIN":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const UnrecognizedURLError = function() {
    UnrecognizedURLError.prototype = Object.create(Error.prototype);
    UnrecognizedURLError.prototype.constructor = UnrecognizedURLError;
    function UnrecognizedURLError(message) {
        let error = Error.call(this, message);
        this.name = 'UnrecognizedURLError';
        this.message = message || 'UnrecognizedURL';
        if (Error.captureStackTrace) Error.captureStackTrace(this, UnrecognizedURLError);
        else this.stack = error.stack;
    }
    return UnrecognizedURLError;
}();
exports.default = UnrecognizedURLError;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["4twtF","5D30b"], "5D30b", "parcelRequire86c2")

//# sourceMappingURL=aj91-koyeb.87900c64.js.map
