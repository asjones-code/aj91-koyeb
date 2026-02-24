/**
 * Live session: WebSocket for location sharing (globe) + ephemeral chat.
 * Open the socket when user opts in to share location; email opt-in required to send chat.
 */
const API_ORIGIN = String(typeof process !== "undefined" && process.env && process.env.API_ORIGIN || "").trim() || (typeof window !== "undefined" && window.location ? window.location.origin : "");
const WS_PROTOCOL = API_ORIGIN.startsWith("https") ? "wss" : "ws";
const WS_PATH = "/live";

function getLiveWsUrl() {
	const base = API_ORIGIN ? new URL(API_ORIGIN).host : (typeof window !== "undefined" && window.location ? window.location.host : "localhost:3000");
	return `${WS_PROTOCOL}://${base}${WS_PATH}`;
}

let ws = null;
let connected = false;
let emailOptedIn = false;
let chatCallback = null;

function setChatCallback(fn) {
	chatCallback = fn;
}

function getState() {
	return { connected, emailOptedIn };
}

function sendMessage(obj) {
	if (ws && ws.readyState === 1) {
		ws.send(JSON.stringify(obj));
	}
}

function openLiveSession(opts = {}) {
	if (ws && (ws.readyState === 0 || ws.readyState === 1)) {
		if (opts.onOpen) opts.onOpen();
		return ws;
	}
	const url = getLiveWsUrl();
	ws = new WebSocket(url);
	ws.onopen = () => {
		connected = true;
		if (opts.onOpen) opts.onOpen();
	};
	ws.onclose = () => {
		connected = false;
		ws = null;
		if (opts.onClose) opts.onClose();
	};
	ws.onerror = () => {
		if (opts.onError) opts.onError();
	};
	ws.onmessage = (event) => {
		let data;
		try {
			data = JSON.parse(event.data);
		} catch {
			return;
		}
		if (data.type === "email_ok") {
			emailOptedIn = true;
			if (opts.onEmailOk) opts.onEmailOk();
		}
		if (data.type === "locations") {
			window.dispatchEvent(new CustomEvent("globe-locations", { detail: { locations: data.locations || [] } }));
		}
		if (data.type === "chat" && typeof chatCallback === "function") {
			chatCallback(data);
		}
	};
	return ws;
}

function closeLiveSession() {
	if (ws) {
		ws.close();
		ws = null;
	}
	connected = false;
	emailOptedIn = false;
}

/**
 * Connect to live session (chat + optional globe). Opens WebSocket first, then optionally
 * requests location. Resolves when connected even if location is denied (so chat still works).
 */
function optInGlobeLocation() {
	return new Promise((resolve, reject) => {
		openLiveSession({
			onOpen: () => {
				// Optionally send location if permitted; don't block on deny
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							sendMessage({
								type: "location",
								lat: pos.coords.latitude,
								lng: pos.coords.longitude,
								accuracy: pos.coords.accuracy != null ? pos.coords.accuracy : undefined
							});
						},
						() => { /* denied or unavailable – still connected for chat */ },
						{ enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 }
					);
				}
				resolve();
			},
			onError: () => reject(new Error("Connection failed"))
		});
	});
}

export { getLiveWsUrl, openLiveSession, closeLiveSession, sendMessage, getState, setChatCallback, optInGlobeLocation };
