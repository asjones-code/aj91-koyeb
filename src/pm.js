(function () {
	"use strict";

	const API_BASE = (typeof window !== "undefined" && window.API_ORIGIN) ? window.API_ORIGIN : "";
	const STORAGE_KEY = "pm_token";
	const IDB_NAME = "pm_workspace";
	const IDB_STORE = "workspace";
	const DEFAULT_STATUSES = [
		{ name: "To do", color: "#94a3b8", type: "TODO" },
		{ name: "In progress", color: "#3b82f6", type: "INPROCESS" },
		{ name: "Done", color: "#22c55e", type: "DONE" },
	];

	function id() {
		return crypto.randomUUID ? crypto.randomUUID() : "x" + Math.random().toString(36).slice(2, 11);
	}

	function getToken() {
		try {
			return sessionStorage.getItem(STORAGE_KEY);
		} catch {
			return null;
		}
	}
	function setToken(t) {
		try {
			if (t) sessionStorage.setItem(STORAGE_KEY, t);
			else sessionStorage.removeItem(STORAGE_KEY);
		} catch (_) {}
	}

	function emptyWorkspace() {
		return {
			version: 1,
			lastModified: new Date().toISOString(),
			projects: [],
			taskStatuses: [],
			projectViews: [],
			tasks: [],
			tags: [],
		};
	}

	// ——— IndexedDB (local) ———
	function openDB() {
		return new Promise((resolve, reject) => {
			const r = indexedDB.open(IDB_NAME, 1);
			r.onerror = () => reject(r.error);
			r.onsuccess = () => resolve(r.result);
			r.onupgradeneeded = (e) => {
				e.target.result.createObjectStore(IDB_STORE, { keyPath: "id" });
			};
		});
	}
	function localGet() {
		return openDB().then((db) => {
			return new Promise((resolve, reject) => {
				const t = db.transaction(IDB_STORE, "readonly");
				const req = t.objectStore(IDB_STORE).get("workspace");
				req.onsuccess = () => resolve(req.result ? req.result.data : null);
				req.onerror = () => reject(req.error);
			});
		});
	}
	function localSet(data) {
		return openDB().then((db) => {
			return new Promise((resolve, reject) => {
				const t = db.transaction(IDB_STORE, "readwrite");
				const payload = { id: "workspace", data, updatedAt: Date.now() };
				const req = t.objectStore(IDB_STORE).put(payload);
				req.onsuccess = () => resolve();
				req.onerror = () => reject(req.error);
			});
		});
	}

	// ——— API (sync) ———
	function apiHeaders() {
		const token = getToken();
		const h = { "Content-Type": "application/json" };
		if (token) h["X-PM-Token"] = token;
		return h;
	}
	function apiGetWorkspace() {
		return fetch(API_BASE + "/api/pm/workspace", { headers: apiHeaders() }).then((r) => {
			if (r.status === 401) {
				setToken(null);
				window.pmShowLogin();
				throw new Error("Unauthorized");
			}
			if (!r.ok) return r.json().then((body) => Promise.reject(new Error(body.error || "Failed to load")));
			return r.json();
		});
	}
	function apiSyncWorkspace(data) {
		return fetch(API_BASE + "/api/pm/workspace", {
			method: "POST",
			headers: apiHeaders(),
			body: JSON.stringify(data),
		}).then((r) => {
			if (r.status === 401) {
				setToken(null);
				window.pmShowLogin();
				throw new Error("Unauthorized");
			}
			if (!r.ok) return r.json().then((b) => Promise.reject(new Error(b.error || "Sync failed")));
			return r.json();
		});
	}

	// ——— App state ———
	let workspace = emptyWorkspace();
	let mode = "local"; // "local" | "sync"
	let currentProjectId = null;

	function isLocal() {
		return mode === "local";
	}
	function getWorkspace() {
		if (isLocal()) return localGet().then((w) => (w ? { ...w } : emptyWorkspace()));
		return apiGetWorkspace();
	}
	function saveWorkspace(data) {
		const payload = {
			...data,
			lastModified: new Date().toISOString(),
		};
		if (isLocal()) {
			return localSet(payload).then(() => {
				workspace = payload;
				render();
			});
		}
		return apiSyncWorkspace(payload).then(() => {
			workspace = { ...workspace, ...payload };
			render();
		});
	}

	function ensureDefaultStatuses(projectId) {
		const existing = workspace.taskStatuses.filter((s) => s.projectId === projectId);
		if (existing.length > 0) return;
		const newStatuses = DEFAULT_STATUSES.map((s, i) => ({
			id: id(),
			projectId,
			name: s.name,
			color: s.color,
			order: i,
			type: s.type,
		}));
		workspace.taskStatuses.push(...newStatuses);
	}

	// ——— UI ———
	const $ = (id) => document.getElementById(id);

	function showLogin() {
		$("pm-login").style.display = "block";
		$("pm-app").style.display = "none";
	}
	function showApp() {
		$("pm-login").style.display = "none";
		$("pm-app").style.display = "block";
		$("pm-login-error").style.display = "none";
		loadAndRender();
	}
	window.pmShowLogin = showLogin;

	function setLoading(loading) {
		const main = $("pm-main");
		if (loading) main.innerHTML = "<p class=\"pm-loading\">Loading…</p>";
	}

	function loadAndRender() {
		setLoading(true);
		getWorkspace()
			.then((w) => {
				workspace = w;
				setLoading(false);
				render();
			})
			.catch((err) => {
				setLoading(false);
				$("pm-main").innerHTML = "<p class=\"pm-empty\">Failed to load: " + (err.message || "Unknown error") + "</p>";
			});
	}

	function render() {
		if (currentProjectId) {
			renderDetail();
			return;
		}
		renderList();
	}

	function renderList() {
		$("pm-list-view").style.display = "block";
		$("pm-detail-view").style.display = "none";
		const list = $("pm-project-list");
		const empty = $("pm-no-projects");
		const projects = workspace.projects || [];
		if (projects.length === 0) {
			list.innerHTML = "";
			empty.style.display = "block";
			return;
		}
		empty.style.display = "none";
		list.innerHTML = projects
			.map(
				(p) =>
					`<div class="pm-project-card" data-id="${p.id}">
            <h3>${escapeHtml(p.name || "Untitled")}</h3>
            <p>${escapeHtml((p.description || "").slice(0, 80))}${(p.description || "").length > 80 ? "…" : ""}</p>
          </div>`
			)
			.join("");
		list.querySelectorAll(".pm-project-card").forEach((el) => {
			el.addEventListener("click", () => {
				currentProjectId = el.dataset.id;
				ensureDefaultStatuses(currentProjectId);
				render();
			});
		});
	}

	function renderDetail() {
		$("pm-list-view").style.display = "none";
		$("pm-detail-view").style.display = "block";
		const project = (workspace.projects || []).find((p) => p.id === currentProjectId);
		if (!project) {
			currentProjectId = null;
			render();
			return;
		}
		$("pm-detail-title").textContent = project.name || "Untitled";
		const statuses = (workspace.taskStatuses || []).filter((s) => s.projectId === currentProjectId).sort((a, b) => (a.order || 0) - (b.order || 0));
		const tasks = (workspace.tasks || []).filter((t) => t.projectId === currentProjectId);
		const columns = $("pm-status-columns");
		columns.innerHTML = statuses
			.map(
				(s) => {
					const statusTasks = tasks.filter((t) => t.taskStatusId === s.id).sort((a, b) => (a.order || 0) - (b.order || 0));
					return `
          <div class="pm-status" data-status-id="${s.id}">
            <h4 style="color:${s.color || "#888"}">${escapeHtml(s.name)}</h4>
            <div class="pm-task-list" data-status-id="${s.id}">
              ${statusTasks.map((t) => `<div class="pm-task" data-task-id="${t.id}">${escapeHtml(t.title || "Untitled")}</div>`).join("")}
            </div>
            <div class="pm-task-form">
              <input type="text" placeholder="+ Add task" data-status-id="${s.id}" data-add-task>
            </div>
          </div>`;
				}
			)
			.join("");
		columns.querySelectorAll(".pm-task[data-task-id]").forEach((el) => {
			el.addEventListener("click", () => {
				// Optional: open edit / delete
			});
		});
		columns.querySelectorAll("input[data-add-task]").forEach((input) => {
			input.addEventListener("keydown", (e) => {
				if (e.key !== "Enter") return;
				const title = input.value.trim();
				if (!title) return;
				const statusId = input.dataset.statusId;
				const status = statuses.find((s) => s.id === statusId);
				const maxOrder = Math.max(0, ...tasks.filter((t) => t.taskStatusId === statusId).map((t) => t.order || 0));
				const newTask = {
					id: id(),
					projectId: currentProjectId,
					taskStatusId: statusId,
					title,
					description: "",
					dueDate: null,
					order: maxOrder + 1,
					priority: "",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				workspace.tasks = workspace.tasks || [];
				workspace.tasks.push(newTask);
				saveWorkspace(workspace).then(() => {
					input.value = "";
				});
			});
		});
	}

	function escapeHtml(s) {
		const div = document.createElement("div");
		div.textContent = s;
		return div.innerHTML;
	}

	// ——— Login ———
	$("pm-login-form").addEventListener("submit", (e) => {
		e.preventDefault();
		const form = e.target;
		const password = form.password.value;
		const errEl = $("pm-login-error");
		errEl.style.display = "none";
		fetch(API_BASE + "/api/pm/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		})
			.then((r) => r.json())
			.then((data) => {
				if (data.error) {
					errEl.textContent = data.error;
					errEl.style.display = "block";
					return;
				}
				setToken(data.token);
				showApp();
			})
			.catch(() => {
				errEl.textContent = "Request failed.";
				errEl.style.display = "block";
			});
	});

	// ——— Mode ———
	document.querySelectorAll("input[name=pm-mode]").forEach((radio) => {
		radio.addEventListener("change", () => {
			mode = radio.value;
			loadAndRender();
		});
	});
	$("pm-mode-local").checked = true;

	// ——— New project ———
	$("pm-new-project").addEventListener("click", () => {
		const name = window.prompt("Project name", "New project");
		if (name == null) return;
		const project = {
			id: id(),
			name: (name || "").trim() || "New project",
			description: "",
			cover: "",
			icon: "",
			isArchived: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		workspace.projects = workspace.projects || [];
		workspace.projects.push(project);
		ensureDefaultStatuses(project.id);
		saveWorkspace(workspace).then(() => {
			currentProjectId = project.id;
			render();
		});
	});

	// ——— Back ———
	$("pm-back").addEventListener("click", () => {
		currentProjectId = null;
		render();
	});

	// ——— Export / Import ———
	$("pm-export-btn").addEventListener("click", () => {
		const data = isLocal() ? workspace : { ...workspace };
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "pm-workspace-" + new Date().toISOString().slice(0, 10) + ".json";
		a.click();
		URL.revokeObjectURL(a.href);
	});

	$("pm-import-btn").addEventListener("click", () => {
		$("pm-import-file").click();
	});
	$("pm-import-file").addEventListener("change", (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const data = JSON.parse(reader.result);
				const projects = Array.isArray(data.projects) ? data.projects : [];
				const taskStatuses = Array.isArray(data.taskStatuses) ? data.taskStatuses : [];
				const projectViews = Array.isArray(data.projectViews) ? data.projectViews : [];
				const tasks = Array.isArray(data.tasks) ? data.tasks : [];
				const tags = Array.isArray(data.tags) ? data.tags : [];
				workspace = {
					version: data.version || 1,
					lastModified: new Date().toISOString(),
					projects,
					taskStatuses,
					projectViews,
					tasks,
					tags,
				};
				saveWorkspace(workspace).then(() => {
					currentProjectId = null;
					render();
				});
			} catch (err) {
				alert("Invalid JSON file.");
			}
			e.target.value = "";
		};
		reader.readAsText(file);
	});

	// ——— Logout ———
	$("pm-logout").addEventListener("click", () => {
		setToken(null);
		showLogin();
	});

	// ——— Boot ———
	if (getToken()) {
		showApp();
	} else {
		showLogin();
	}
})();
