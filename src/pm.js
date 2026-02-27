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
			comments: [],
			activities: [],
			taskChecklists: [],
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
	let detailViewMode = "board"; // "board" | "list" | "calendar"
	let lastSyncedAt = null;
	let selectedTaskId = null;
	let filterState = { statusId: "", assigneeIds: [], priority: "" };
	let calendarMonth = new Date();

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
				updateSyncStatus();
				render();
			});
		}
		return apiSyncWorkspace(payload).then(() => {
			lastSyncedAt = Date.now();
			workspace = { ...workspace, ...payload };
			updateSyncStatus();
			render();
		});
	}

	function updateSyncStatus() {
		const el = document.getElementById("pm-sync-status");
		if (!el) return;
		if (isLocal()) {
			el.textContent = "Stored locally";
			el.classList.remove("synced");
		} else {
			el.textContent = lastSyncedAt
				? "Synced to server · Last synced " + new Date(lastSyncedAt).toLocaleTimeString()
				: "Synced to server";
			el.classList.add("synced");
		}
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

	function appendActivity(taskId, type, data) {
		workspace.activities = workspace.activities || [];
		workspace.activities.push({
			id: id(),
			objectId: taskId,
			objectType: "TASK",
			type,
			createdBy: "",
			data: data || {},
			createdAt: new Date().toISOString(),
		});
	}

	function getTaskAssigneeIds(task) {
		if (Array.isArray(task.assigneeIds) && task.assigneeIds.length > 0) return task.assigneeIds;
		if (task.assignee) return [task.assignee];
		return [];
	}

	function pointToStars(n) {
		const v = n == null || n === "" ? 0 : Math.min(5, Math.max(0, parseInt(Number(n), 10)));
		if (Number.isNaN(v)) return 0;
		return "★".repeat(v) + "☆".repeat(5 - v);
	}
	function pointValueForDisplay(n) {
		if (n == null || n === "") return 0;
		const v = parseInt(Number(n), 10);
		return Number.isNaN(v) ? 0 : Math.min(5, Math.max(0, v));
	}

	function getFilteredTasks(projectId) {
		let list = (workspace.tasks || []).filter((t) => t.projectId === projectId);
		if (filterState.statusId) list = list.filter((t) => t.taskStatusId === filterState.statusId);
		if (filterState.priority) list = list.filter((t) => (t.priority || "").toLowerCase() === filterState.priority);
		if (filterState.assigneeIds.length > 0) list = list.filter((t) => getTaskAssigneeIds(t).some((aid) => filterState.assigneeIds.includes(aid)));
		return list;
	}

	function formatDueDateRelative(dueStr) {
		if (!dueStr) return "—";
		const dueDate = new Date(dueStr);
		if (Number.isNaN(dueDate.getTime())) return dueStr;
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const due = new Date(dueDate);
		due.setHours(0, 0, 0, 0);
		const diffDays = Math.round((due - today) / (24 * 60 * 60 * 1000));
		if (diffDays < 0) return "Overdue";
		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Tomorrow";
		if (diffDays < 7) return "in " + diffDays + " days";
		if (diffDays < 14) return "in 1 week";
		if (diffDays <= 31) return "in " + Math.floor(diffDays / 7) + " weeks";
		return due.toLocaleDateString();
	}

	function deleteTask(taskId) {
		const task = workspace.tasks.find((t) => t.id === taskId);
		if (!task) return;
		if (!window.confirm('Delete task "' + (task.title || "Untitled") + '"?')) return;
		workspace.tasks = (workspace.tasks || []).filter((t) => t.id !== taskId);
		workspace.comments = (workspace.comments || []).filter((c) => c.taskId !== taskId);
		workspace.activities = (workspace.activities || []).filter((a) => a.objectId !== taskId || a.objectType !== "TASK");
		workspace.taskChecklists = (workspace.taskChecklists || []).filter((c) => c.taskId !== taskId);
		if (selectedTaskId === taskId) {
			closeTaskPanel();
			selectedTaskId = null;
		}
		saveWorkspace(workspace).then(() => render());
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
		const loadingEl = $("pm-loading");
		const listView = $("pm-list-view");
		const detailView = $("pm-detail-view");
		if (loadingEl) loadingEl.style.display = loading ? "block" : "none";
		if (listView) listView.style.display = loading ? "none" : (currentProjectId ? "none" : "block");
		if (detailView) detailView.style.display = loading ? "none" : (currentProjectId ? "block" : "none");
	}

	function loadAndRender() {
		setLoading(true);
		getWorkspace()
			.then((w) => {
				document.getElementById("pm-load-fail")?.remove();
				workspace = w;
				setLoading(false);
				updateSyncStatus();
				render();
			})
			.catch((err) => {
				setLoading(false);
				const main = $("pm-main");
				const prev = document.getElementById("pm-load-fail");
				if (prev) prev.remove();
				const fail = document.createElement("p");
				fail.id = "pm-load-fail";
				fail.className = "pm-empty";
				fail.textContent = "Failed to load: " + (err.message || "Unknown error");
				main.insertBefore(fail, main.firstChild);
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
		const tasks = getFilteredTasks(currentProjectId);
		const doneStatus = statuses.find((s) => (s.type || "").toUpperCase() === "DONE");

		// View toggle
		$("pm-view-list").classList.toggle("active", detailViewMode === "list");
		$("pm-view-board").classList.toggle("active", detailViewMode === "board");
		$("pm-view-calendar").classList.toggle("active", detailViewMode === "calendar");
		$("pm-board-wrap").style.display = detailViewMode === "board" ? "block" : "none";
		$("pm-list-wrap").style.display = detailViewMode === "list" ? "block" : "none";
		$("pm-calendar-wrap").style.display = detailViewMode === "calendar" ? "block" : "none";
		$("pm-filter-bar").style.display = detailViewMode === "calendar" ? "none" : "block";

		// Filter bar (list/board)
		if (detailViewMode !== "calendar") renderFilterBar(statuses, tasks);
		// Saved views dropdown
		const views = (workspace.projectViews || []).filter((v) => v.projectId === currentProjectId).sort((a, b) => (a.order || 0) - (b.order || 0));
		const savedSelect = $("pm-saved-views");
		if (savedSelect) {
			savedSelect.innerHTML = "<option value=\"\">Saved views…</option>" + views.map((v) => `<option value="${v.id}">${escapeHtml(v.name || v.type || "View")}</option>`).join("");
		}

		if (detailViewMode === "list") {
			renderListView(tasks, doneStatus);
			return;
		}
		if (detailViewMode === "calendar") {
			renderCalendarView(tasks);
			return;
		}

		// Board view
		const columns = $("pm-status-columns");
		columns.innerHTML = statuses
			.map(
				(s) => {
					const statusTasks = tasks.filter((t) => t.taskStatusId === s.id).sort((a, b) => (a.order || 0) - (b.order || 0));
					return `
          <div class="pm-status" data-status-id="${s.id}">
            <h4 style="color:${s.color || "#888"}">${escapeHtml(s.name)}</h4>
            <div class="pm-task-list" data-status-id="${s.id}">
              ${statusTasks.map((t) => {
								const pri = (t.priority || "").toLowerCase();
								const priClass = pri === "urgent" ? "priority-urgent" : pri === "high" ? "priority-high" : pri === "medium" ? "priority-medium" : pri === "low" ? "priority-low" : "";
								const stars = pointToStars(t.point);
								return `<div class="pm-task ${priClass}" data-task-id="${t.id}" draggable="true"><span class="pm-task-title-text">${escapeHtml(t.title || "Untitled")}</span>${stars ? `<span class="pm-task-point-stars" title="${pointValueForDisplay(t.point)}/5">${stars}</span>` : ""}</div>`;
							}).join("")}
            </div>
            <div class="pm-task-form">
              <input type="text" placeholder="+ Add task" data-status-id="${s.id}" data-add-task>
            </div>
          </div>`;
				}
			)
			.join("");

		// Drag and drop + click to open task panel
		columns.querySelectorAll(".pm-task[data-task-id]").forEach((el) => {
			el.addEventListener("dragstart", (e) => {
				e.dataTransfer.setData("text/plain", el.dataset.taskId);
				e.dataTransfer.effectAllowed = "move";
				el.classList.add("dragging");
			});
			el.addEventListener("dragend", () => el.classList.remove("dragging"));
			el.addEventListener("click", (e) => { if (!el.classList.contains("dragging")) openTaskPanel(el.dataset.taskId); });
		});
		columns.querySelectorAll(".pm-status").forEach((col) => {
			const statusId = col.dataset.statusId;
			col.addEventListener("dragover", (e) => {
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";
				col.classList.add("drag-over");
			});
			col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
			col.addEventListener("drop", (e) => {
				e.preventDefault();
				col.classList.remove("drag-over");
				const taskId = e.dataTransfer.getData("text/plain");
				if (!taskId) return;
				const task = workspace.tasks.find((t) => t.id === taskId);
				if (!task || task.taskStatusId === statusId) return;
				const oldStatus = workspace.taskStatuses.find((s) => s.id === task.taskStatusId);
				const newStatus = workspace.taskStatuses.find((s) => s.id === statusId);
				const statusTasks = tasks.filter((t) => t.taskStatusId === statusId).map((t) => t.order || 0);
				const maxOrder = statusTasks.length ? Math.max(...statusTasks) : 0;
				task.taskStatusId = statusId;
				task.order = maxOrder + 1;
				task.updatedAt = new Date().toISOString();
				appendActivity(taskId, "TASK_STATUS_CHANGED", { from: oldStatus?.name, to: newStatus?.name });
				render();
				saveWorkspace(workspace);
			});
		});

		columns.querySelectorAll("input[data-add-task]").forEach((input) => {
			input.addEventListener("keydown", (e) => {
				if (e.key !== "Enter") return;
				const title = input.value.trim();
				if (!title) return;
				const statusId = input.dataset.statusId;
				const maxOrder = Math.max(0, ...tasks.filter((t) => t.taskStatusId === statusId).map((t) => t.order || 0));
				const newTask = {
					id: id(),
					projectId: currentProjectId,
					taskStatusId: statusId,
					title,
					description: "",
					dueDate: null,
					startDate: null,
					order: maxOrder + 1,
					priority: "",
					assigneeIds: [],
					assignee: "",
					type: "Task",
					point: undefined,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				workspace.tasks = workspace.tasks || [];
				workspace.tasks.push(newTask);
				appendActivity(newTask.id, "TASK_CREATED", { title: newTask.title });
				saveWorkspace(workspace).then(() => {
					input.value = "";
				});
			});
		});
	}

	function renderListView(tasks, doneStatus) {
		const container = $("pm-list-groups");
		if (!container) return;
		const statuses = (workspace.taskStatuses || []).filter((s) => s.projectId === currentProjectId).sort((a, b) => (a.order || 0) - (b.order || 0));
		const doneId = doneStatus ? doneStatus.id : null;
		const firstTodo = statuses.find((s) => (s.type || "").toUpperCase() !== "DONE");

		let html = "";
		for (const status of statuses) {
			const statusTasks = tasks.filter((t) => t.taskStatusId === status.id).sort((a, b) => (a.order || 0) - (b.order || 0));
			const rows = statusTasks
				.map((t, i) => {
					const isDone = t.taskStatusId === doneId;
					const pri = (t.priority || "").toLowerCase();
					const priClass = pri === "urgent" ? "urgent" : pri === "high" ? "high" : pri === "medium" ? "medium" : pri === "low" ? "low" : "";
					const assigneeDisplay = getTaskAssigneeIds(t).length ? getTaskAssigneeIds(t).join(", ") : "—";
					const pointVal = pointValueForDisplay(t.point);
					const pointStarsHtml = [1, 2, 3, 4, 5].map((i) => `<span class="pm-point-star" data-task-id="${t.id}" data-value="${i}" role="button" tabindex="0" title="${i}/5">${i <= pointVal ? "★" : "☆"}</span>`).join("");
					const dueStr = formatDueDateRelative(t.dueDate);
					let dueClass = "";
					if (t.dueDate) {
						const dueDate = new Date(t.dueDate);
						dueDate.setHours(0, 0, 0, 0);
						const today = new Date();
						today.setHours(0, 0, 0, 0);
						if (dueDate < today) dueClass = "overdue";
					}
					const priVal = (t.priority || "").toLowerCase();
					const priorityOptions = [
						{ value: "", label: "—" },
						{ value: "urgent", label: "🔴 Urgent" },
						{ value: "high", label: "🟠 High" },
						{ value: "medium", label: "🟡 Medium" },
						{ value: "low", label: "🟢 Low" },
					];
					const prioritySelectHtml = `<select class="pm-list-priority-select pm-priority ${priClass}" data-task-id="${t.id}" data-field="priority">${priorityOptions.map((o) => `<option value="${o.value}" ${o.value === priVal ? "selected" : ""}>${o.label}</option>`).join("")}</select>`;
					const num = String(i + 1).padStart(2, "0");
					return `<tr data-task-id="${t.id}" class="pm-list-task-row" draggable="true">
  <td class="pm-col-num">${num}</td>
  <td class="pm-col-check"><input type="checkbox" ${isDone ? "checked" : ""} data-task-id="${t.id}" data-done></td>
  <td class="pm-col-task"><span class="pm-list-edit pm-list-task-title" data-task-id="${t.id}" data-field="title" contenteditable="true">${escapeHtml(t.title || "Untitled")}</span></td>
  <td class="pm-col-assignee"><span class="pm-list-edit" data-task-id="${t.id}" data-field="assigneeIds" contenteditable="true">${escapeHtml(assigneeDisplay)}</span></td>
  <td class="pm-col-type"><span class="pm-list-edit" data-task-id="${t.id}" data-field="type" contenteditable="true">${escapeHtml(t.type || "Task")}</span></td>
  <td class="pm-col-priority">${prioritySelectHtml}</td>
  <td class="pm-col-point pm-list-point pm-point-stars-wrap">${pointStarsHtml}</td>
  <td class="pm-col-due pm-list-due ${dueClass}">${escapeHtml(dueStr)}</td>
  <td class="pm-col-actions"><button type="button" class="pm-list-delete-btn" data-task-id="${t.id}" title="Delete task" aria-label="Delete">⌫</button></td>
</tr>`;
				})
				.join("");
			html += `
<div class="pm-list-group" data-status-id="${status.id}">
  <div class="pm-list-group-title" style="color:${status.color || "#888"}">${escapeHtml(status.name)}</div>
  <table class="pm-list-table">
    <thead><tr>
      <th class="pm-col-num"></th>
      <th class="pm-col-check"></th>
      <th class="pm-col-task">Task</th>
      <th class="pm-col-assignee">Assignee</th>
      <th class="pm-col-type">Type</th>
      <th class="pm-col-priority">Priority</th>
      <th class="pm-col-point">Point</th>
      <th class="pm-col-due">Due date</th>
      <th class="pm-col-actions"></th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <button type="button" class="pm-list-create-link" data-status-id="${status.id}">+ Create new task</button>
</div>`;
		}
		container.innerHTML = html;

		container.querySelectorAll("tr.pm-list-task-row").forEach((row) => {
			row.setAttribute("tabindex", "0");
			row.addEventListener("click", (e) => {
				if (e.target.closest("input, select, [contenteditable], .pm-list-delete-btn, .pm-point-star")) return;
				row.focus();
				openTaskPanel(row.dataset.taskId);
			});
			row.addEventListener("dragstart", (e) => {
				e.dataTransfer.setData("text/plain", row.dataset.taskId);
				e.dataTransfer.effectAllowed = "move";
				row.classList.add("dragging");
			});
			row.addEventListener("dragend", () => row.classList.remove("dragging"));
		});
		container.querySelectorAll(".pm-list-group").forEach((group) => {
			group.addEventListener("dragover", (e) => {
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";
				group.classList.add("drag-over");
			});
			group.addEventListener("dragleave", () => group.classList.remove("drag-over"));
			group.addEventListener("drop", (e) => {
				e.preventDefault();
				group.classList.remove("drag-over");
				const taskId = e.dataTransfer.getData("text/plain");
				if (!taskId) return;
				const task = workspace.tasks.find((t) => t.id === taskId);
				const statusId = group.dataset.statusId;
				if (!task || !statusId || task.taskStatusId === statusId) return;
				const oldStatus = workspace.taskStatuses.find((s) => s.id === task.taskStatusId);
				const newStatus = workspace.taskStatuses.find((s) => s.id === statusId);
				const statusTasks = tasks.filter((t) => t.taskStatusId === statusId).map((t) => t.order || 0);
				const maxOrder = statusTasks.length ? Math.max(...statusTasks) : 0;
				task.taskStatusId = statusId;
				task.order = maxOrder + 1;
				task.updatedAt = new Date().toISOString();
				if (oldStatus && newStatus) appendActivity(taskId, "TASK_STATUS_CHANGED", { from: oldStatus.name, to: newStatus.name });
				saveWorkspace(workspace);
			});
		});
		container.querySelectorAll("input[data-done]").forEach((cb) => {
			cb.addEventListener("change", () => {
				const task = workspace.tasks.find((t) => t.id === cb.dataset.taskId);
				if (!task || !doneStatus) return;
				const oldStatus = workspace.taskStatuses.find((s) => s.id === task.taskStatusId);
				const newStatus = cb.checked ? doneStatus : firstTodo;
				task.taskStatusId = cb.checked ? doneStatus.id : (firstTodo && firstTodo.id) || task.taskStatusId;
				task.updatedAt = new Date().toISOString();
				if (oldStatus && newStatus && oldStatus.id !== newStatus.id) appendActivity(task.id, "TASK_STATUS_CHANGED", { from: oldStatus.name, to: newStatus.name });
				saveWorkspace(workspace).then(() => render());
			});
		});
		container.querySelectorAll(".pm-list-edit").forEach((span) => {
			span.addEventListener("blur", () => {
				const task = workspace.tasks.find((t) => t.id === span.dataset.taskId);
				if (!task) return;
				const field = span.dataset.field;
				const raw = span.textContent.trim();
				if (field === "title") task.title = raw || "Untitled";
				else if (field === "assigneeIds") {
					const assigneeIds = raw === "—" || !raw ? [] : raw.split(",").map((s) => s.trim()).filter(Boolean);
					task.assigneeIds = assigneeIds;
					task.assignee = assigneeIds[0] || "";
				} else if (field === "type") task.type = raw || "Task";
				task.updatedAt = new Date().toISOString();
				saveWorkspace(workspace).then(() => render());
			});
		});
		container.querySelectorAll(".pm-list-priority-select").forEach((sel) => {
			sel.addEventListener("change", () => {
				const task = workspace.tasks.find((t) => t.id === sel.dataset.taskId);
				if (!task) return;
				const prev = (task.priority || "").toLowerCase();
				const next = (sel.value || "").toLowerCase();
				task.priority = sel.value || "";
				task.updatedAt = new Date().toISOString();
				if (prev !== next) appendActivity(task.id, "TASK_PRIORITY_CHANGED", { from: prev || "none", to: next || "none" });
				saveWorkspace(workspace).then(() => render());
			});
		});
		container.querySelectorAll(".pm-list-delete-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => { e.stopPropagation(); deleteTask(btn.dataset.taskId); });
		});
		container.querySelectorAll(".pm-point-star").forEach((star) => {
			star.addEventListener("click", (e) => {
				e.stopPropagation();
				const task = workspace.tasks.find((t) => t.id === star.dataset.taskId);
				if (!task) return;
				const val = parseInt(star.dataset.value, 10);
				task.point = val;
				task.updatedAt = new Date().toISOString();
				saveWorkspace(workspace).then(() => render());
			});
			star.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); star.click(); } });
		});
		container.querySelectorAll(".pm-list-create-link").forEach((link) => {
			link.addEventListener("click", () => addTaskInListForStatus(link.dataset.statusId));
		});
	}

	function addTaskInListForStatus(statusId) {
		const statuses = (workspace.taskStatuses || []).filter((s) => s.projectId === currentProjectId).sort((a, b) => (a.order || 0) - (b.order || 0));
		const status = statuses.find((s) => s.id === statusId);
		if (!status) return;
		const tasks = (workspace.tasks || []).filter((t) => t.projectId === currentProjectId && t.taskStatusId === statusId);
		const maxOrder = Math.max(0, ...tasks.map((t) => t.order || 0));
		const title = window.prompt("Task title", "");
		if (title == null) return;
		const newTask = {
			id: id(),
			projectId: currentProjectId,
			taskStatusId: statusId,
			title: (title || "").trim() || "New task",
			description: "",
			dueDate: null,
			startDate: null,
			order: maxOrder + 1,
			priority: "",
			assigneeIds: [],
			assignee: "",
			type: "Task",
			point: undefined,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		workspace.tasks = workspace.tasks || [];
		workspace.tasks.push(newTask);
		appendActivity(newTask.id, "TASK_CREATED", { title: newTask.title });
		saveWorkspace(workspace).then(() => render());
	}

	function escapeHtml(s) {
		const div = document.createElement("div");
		div.textContent = s;
		return div.innerHTML;
	}

	function renderFilterBar(statuses, tasks) {
		const statusEl = $("pm-filter-status");
		const priorityEl = $("pm-filter-priority");
		const assigneeEl = $("pm-filter-assignee");
		if (!statusEl || !priorityEl || !assigneeEl) return;
		statusEl.innerHTML = '<option value="">Any status</option>' + statuses.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
		statusEl.value = filterState.statusId || "";
		priorityEl.value = filterState.priority || "";
		const allTasks = (workspace.tasks || []).filter((t) => t.projectId === currentProjectId);
		const assigneeSet = new Set();
		allTasks.forEach((t) => getTaskAssigneeIds(t).forEach((a) => assigneeSet.add(a)));
		assigneeEl.innerHTML = '<option value="">Any assignee</option>' + [...assigneeSet].sort().map((a) => `<option value="${a}">${escapeHtml(a)}</option>`).join("");
		assigneeEl.value = filterState.assigneeIds[0] || "";
	}

	function renderCalendarView(tasks) {
		const titleEl = $("pm-calendar-month-title");
		const gridEl = $("pm-calendar-grid");
		if (!titleEl || !gridEl) return;
		const y = calendarMonth.getFullYear();
		const m = calendarMonth.getMonth();
		titleEl.textContent = new Date(y, m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
		const first = new Date(y, m, 1);
		const last = new Date(y, m + 1, 0);
		const startPad = first.getDay();
		const daysInMonth = last.getDate();
		const totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7;
		const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		let html = dayLabels.map((l) => `<div class="pm-calendar-day-header">${l}</div>`).join("");
		for (let i = 0; i < totalCells; i++) {
			const dayNum = i - startPad + 1;
			const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
			const dateStr = isCurrentMonth ? `${y}-${String(m + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}` : "";
			const dayTasks = isCurrentMonth ? tasks.filter((t) => t.dueDate && t.dueDate.slice(0, 10) === dateStr) : [];
			html += `<div class="pm-calendar-day" data-date="${dateStr}" data-day-num="${dayNum}" data-current="${isCurrentMonth}">
        <div class="pm-calendar-day-num">${isCurrentMonth ? dayNum : ""}</div>
        ${dayTasks.map((t) => `<div class="pm-calendar-task" data-task-id="${t.id}">${escapeHtml(t.title || "Untitled")}</div>`).join("")}
        ${isCurrentMonth ? `<button type="button" class="pm-btn pm-calendar-add" data-date="${dateStr}">+ Add task</button>` : ""}
      </div>`;
		}
		gridEl.innerHTML = html;
		gridEl.querySelectorAll(".pm-calendar-task").forEach((el) => el.addEventListener("click", () => openTaskPanel(el.dataset.taskId)));
		gridEl.querySelectorAll(".pm-calendar-add").forEach((btn) => btn.addEventListener("click", () => addTaskWithDueDate(btn.dataset.date)));
	}

	function addTaskWithDueDate(dateStr) {
		const statuses = (workspace.taskStatuses || []).filter((s) => s.projectId === currentProjectId).sort((a, b) => (a.order || 0) - (b.order || 0));
		const firstStatus = statuses[0];
		if (!firstStatus) return;
		const tasks = (workspace.tasks || []).filter((t) => t.projectId === currentProjectId);
		const maxOrder = Math.max(0, ...tasks.map((t) => t.order || 0));
		const title = window.prompt("Task title", "");
		if (title == null) return;
		const newTask = {
			id: id(),
			projectId: currentProjectId,
			taskStatusId: firstStatus.id,
			title: (title || "").trim() || "New task",
			description: "",
			dueDate: dateStr,
			startDate: null,
			order: maxOrder + 1,
			priority: "",
			assigneeIds: [],
			assignee: "",
			type: "Task",
			point: undefined,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		workspace.tasks = workspace.tasks || [];
		workspace.tasks.push(newTask);
		appendActivity(newTask.id, "TASK_CREATED", { title: newTask.title });
		saveWorkspace(workspace).then(() => render());
	}

	function openTaskPanel(taskId) {
		selectedTaskId = taskId;
		$("pm-task-panel-wrap").setAttribute("aria-hidden", "false");
		renderTaskPanel();
	}

	function closeTaskPanel() {
		selectedTaskId = null;
		$("pm-task-panel-wrap").setAttribute("aria-hidden", "true");
		document.querySelector(".pm-list-task-row:focus")?.blur();
	}

	function renderTaskPanel() {
		if (!selectedTaskId) return;
		const task = workspace.tasks.find((t) => t.id === selectedTaskId);
		if (!task) {
			closeTaskPanel();
			return;
		}
		const statuses = workspace.taskStatuses || [];
		const status = statuses.find((s) => s.id === task.taskStatusId);
		const titleEl = $("pm-task-panel-title");
		if (titleEl) {
			titleEl.textContent = task.title || "Untitled";
			titleEl.contentEditable = "true";
			titleEl.setAttribute("title", "Click to edit");
			if (!titleEl._pmTitleBound) {
				titleEl._pmTitleBound = true;
				titleEl.addEventListener("blur", () => {
					if (!selectedTaskId) return;
					const t = workspace.tasks.find((x) => x.id === selectedTaskId);
					if (!t) return;
					const v = (titleEl.textContent || "").trim();
					t.title = v || "Untitled";
					t.updatedAt = new Date().toISOString();
					saveWorkspace(workspace).then(() => renderTaskPanel());
				});
			}
		}
		const metaParts = [];
		if (status) metaParts.push("Status: " + status.name);
		if (task.priority) metaParts.push("Priority: " + task.priority);
		if (getTaskAssigneeIds(task).length) metaParts.push("Assignees: " + getTaskAssigneeIds(task).join(", "));
		$("pm-task-meta").textContent = metaParts.join(" · ");

		// Checklist items (for progress bar and list)
		const taskChecklists = (workspace.taskChecklists || []).filter((c) => c.taskId === task.id).sort((a, b) => (a.order || 0) - (b.order || 0));
		const progressWrap = $("pm-task-progress-wrap");
		const progressFill = $("pm-task-progress-fill");
		const progressText = $("pm-task-progress-text");
		if (progressWrap && progressFill && progressText) {
			if (taskChecklists.length > 0) {
				const done = taskChecklists.filter((c) => c.done).length;
				const pct = Math.round((done / taskChecklists.length) * 100);
				progressWrap.style.display = "block";
				progressFill.style.width = pct + "%";
				progressText.textContent = `${done}/${taskChecklists.length} (${pct}%)`;
			} else {
				progressWrap.style.display = "none";
			}
		}
		const descEl = $("pm-task-description");
		const startEl = $("pm-task-start-date");
		const dueEl = $("pm-task-due-date");
		const pointStarsEl = $("pm-task-point-stars");
		if (descEl) descEl.value = task.description || "";
		if (startEl) startEl.value = task.startDate ? task.startDate.slice(0, 10) : "";
		if (dueEl) dueEl.value = task.dueDate ? task.dueDate.slice(0, 10) : "";
		const pv = pointValueForDisplay(task.point);
		if (pointStarsEl) {
			pointStarsEl.innerHTML = [1, 2, 3, 4, 5].map((i) => `<button type="button" class="pm-panel-star" data-value="${i}" title="${i}/5" aria-pressed="${i <= pv}">${i <= pv ? "★" : "☆"}</button>`).join("");
			pointStarsEl.querySelectorAll(".pm-panel-star").forEach((btn) => {
				btn.addEventListener("click", () => {
					if (!selectedTaskId) return;
					const t = workspace.tasks.find((x) => x.id === selectedTaskId);
					if (!t) return;
					const val = parseInt(btn.dataset.value, 10);
					t.point = val;
					t.updatedAt = new Date().toISOString();
					saveWorkspace(workspace).then(() => renderTaskPanel());
				});
			});
		}
		// One-time bind save handlers if not already bound
		if (!descEl._pmBound) {
			descEl._pmBound = true;
			descEl.addEventListener("blur", () => { if (selectedTaskId) { const t = workspace.tasks.find((x) => x.id === selectedTaskId); if (t) { t.description = descEl.value; t.updatedAt = new Date().toISOString(); saveWorkspace(workspace).then(() => renderTaskPanel()); } } });
		}
		if (!startEl._pmBound) {
			startEl._pmBound = true;
			startEl.addEventListener("change", () => { if (selectedTaskId) { const t = workspace.tasks.find((x) => x.id === selectedTaskId); if (t) { t.startDate = startEl.value || null; t.updatedAt = new Date().toISOString(); saveWorkspace(workspace).then(() => renderTaskPanel()); } } });
		}
		if (!dueEl._pmBound) {
			dueEl._pmBound = true;
			dueEl.addEventListener("change", () => {
				if (!selectedTaskId) return;
				const t = workspace.tasks.find((x) => x.id === selectedTaskId);
				if (!t) return;
				const prev = t.dueDate || "";
				t.dueDate = dueEl.value || null;
				t.updatedAt = new Date().toISOString();
				if (prev !== (t.dueDate || "")) appendActivity(t.id, "TASK_DUEDATE_CHANGED", { from: prev || "none", to: t.dueDate || "none" });
				saveWorkspace(workspace).then(() => renderTaskPanel());
			});
		}
		// Checklist
		const listEl = $("pm-task-checklist-list");
		listEl.innerHTML = taskChecklists.map((c) => `<li data-id="${c.id}"><input type="checkbox" ${c.done ? "checked" : ""} data-id="${c.id}"><span class="${c.done ? "pm-checklist-done" : ""}">${escapeHtml(c.title)}</span></li>`).join("");
		listEl.querySelectorAll("input[type=checkbox]").forEach((cb) => {
			cb.addEventListener("change", () => {
				const item = workspace.taskChecklists.find((x) => x.id === cb.dataset.id);
				if (!item) return;
				item.done = cb.checked;
				item.doneAt = cb.checked ? new Date().toISOString() : null;
				saveWorkspace(workspace).then(() => renderTaskPanel());
			});
		});

		// Activity
		const activities = (workspace.activities || []).filter((a) => a.objectId === task.id && a.objectType === "TASK").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		$("pm-task-activity-list").innerHTML = activities.map((a) => {
			let text = a.type.replace(/_/g, " ");
			if (a.type === "TASK_STATUS_CHANGED" && a.data.to) text = `Status changed to ${a.data.to}`;
			else if (a.type === "TASK_PRIORITY_CHANGED" && a.data.to) text = `Priority set to ${a.data.to}`;
			else if (a.type === "TASK_DUEDATE_CHANGED" && a.data.to) text = `Due date set to ${a.data.to}`;
			else if (a.type === "TASK_CREATED") text = "Task created";
			return `<li class="pm-activity-item"><span class="pm-activity-meta">${new Date(a.createdAt).toLocaleString()}</span> ${escapeHtml(text)}</li>`;
		}).join("") || "<li class=\"pm-activity-item\">No activity yet.</li>";

		// Comments
		const comments = (workspace.comments || []).filter((c) => c.taskId === task.id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
		$("pm-task-comments-list").innerHTML = comments.map((c) => `<li class="pm-comment-item"><span class="pm-comment-meta">${escapeHtml(c.createdBy || "Someone")} · ${new Date(c.createdAt).toLocaleString()}</span><div>${escapeHtml(c.content)}</div></li>`).join("") || "";
		$("pm-comment-input").value = "";
	}

	function onCommentSubmit() {
		if (!selectedTaskId) return;
		const task = workspace.tasks.find((t) => t.id === selectedTaskId);
		if (!task) return;
		const content = ($("pm-comment-input") && $("pm-comment-input").value || "").trim();
		if (!content) return;
		workspace.comments = workspace.comments || [];
		workspace.comments.push({
			id: id(),
			taskId: selectedTaskId,
			projectId: task.projectId,
			content,
			createdBy: "",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		$("pm-comment-input").value = "";
		saveWorkspace(workspace).then(() => renderTaskPanel());
	}

	function onChecklistAdd() {
		if (!selectedTaskId) return;
		const input = $("pm-task-checklist-input");
		const title = (input && input.value || "").trim();
		if (!title) return;
		workspace.taskChecklists = workspace.taskChecklists || [];
		const existing = workspace.taskChecklists.filter((c) => c.taskId === selectedTaskId).map((c) => c.order || 0);
		const maxOrder = existing.length ? Math.max(...existing) : 0;
		workspace.taskChecklists.push({
			id: id(),
			taskId: selectedTaskId,
			title,
			order: maxOrder + 1,
			done: false,
			doneAt: null,
		});
		if (input) input.value = "";
		saveWorkspace(workspace).then(() => renderTaskPanel());
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

	// ——— Detail view toggle (List / Board / Calendar) ———
	$("pm-view-list").addEventListener("click", () => {
		detailViewMode = "list";
		render();
	});
	$("pm-view-board").addEventListener("click", () => {
		detailViewMode = "board";
		render();
	});
	$("pm-view-calendar").addEventListener("click", () => {
		detailViewMode = "calendar";
		calendarMonth = new Date();
		render();
	});

	// ——— Calendar nav ———
	$("pm-calendar-prev").addEventListener("click", () => {
		calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1);
		render();
	});
	$("pm-calendar-next").addEventListener("click", () => {
		calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1);
		render();
	});

	// ——— Filter bar ———
	function applyFilterFromBar() {
		const statusEl = $("pm-filter-status");
		const priorityEl = $("pm-filter-priority");
		const assigneeEl = $("pm-filter-assignee");
		if (statusEl) filterState.statusId = (statusEl.value || "").trim();
		if (priorityEl) filterState.priority = (priorityEl.value || "").trim();
		if (assigneeEl) filterState.assigneeIds = assigneeEl.value ? [assigneeEl.value] : [];
		render();
	}
	if ($("pm-filter-status")) $("pm-filter-status").addEventListener("change", applyFilterFromBar);
	if ($("pm-filter-priority")) $("pm-filter-priority").addEventListener("change", applyFilterFromBar);
	if ($("pm-filter-assignee")) $("pm-filter-assignee").addEventListener("change", applyFilterFromBar);
	$("pm-filter-clear").addEventListener("click", () => {
		filterState = { statusId: "", assigneeIds: [], priority: "" };
		render();
	});

	// ——— Saved project views ———
	$("pm-saved-views").addEventListener("change", () => {
		const viewId = $("pm-saved-views").value;
		if (!viewId) return;
		const view = (workspace.projectViews || []).find((v) => v.id === viewId);
		if (!view) return;
		detailViewMode = view.data && view.data.viewType ? view.data.viewType : view.type || "board";
		if (view.data && view.data.filter) filterState = { ...view.data.filter };
		if (filterState.statusIds !== undefined) { filterState.statusId = Array.isArray(filterState.statusIds) ? (filterState.statusIds[0] || "") : ""; delete filterState.statusIds; }
		if (!filterState.assigneeIds) filterState.assigneeIds = [];
		$("pm-saved-views").value = "";
		render();
	});
	$("pm-save-view-btn").addEventListener("click", () => {
		const name = window.prompt("View name", detailViewMode.charAt(0).toUpperCase() + detailViewMode.slice(1));
		if (name == null || !name.trim()) return;
		workspace.projectViews = workspace.projectViews || [];
		const maxOrder = Math.max(0, ...workspace.projectViews.filter((v) => v.projectId === currentProjectId).map((v) => v.order || 0));
		workspace.projectViews.push({
			id: id(),
			projectId: currentProjectId,
			type: detailViewMode,
			name: name.trim(),
			data: { viewType: detailViewMode, filter: { ...filterState } },
			order: maxOrder + 1,
		});
		saveWorkspace(workspace).then(() => render());
	});

	// ——— Task panel ———
	$("pm-task-panel-close").addEventListener("click", closeTaskPanel);
	$("pm-task-panel-delete").addEventListener("click", () => { if (selectedTaskId) deleteTask(selectedTaskId); });
	$("pm-task-panel-wrap").addEventListener("click", (e) => { if (e.target === $("pm-task-panel-wrap")) closeTaskPanel(); });
	$("pm-comment-submit").addEventListener("click", onCommentSubmit);
	$("pm-task-checklist-add-btn").addEventListener("click", onChecklistAdd);
	if ($("pm-comment-input")) $("pm-comment-input").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onCommentSubmit(); } });
	if ($("pm-task-checklist-input")) $("pm-task-checklist-input").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); onChecklistAdd(); } });

	// ——— List view: Create new task is per-status via .pm-list-create-link in renderListView ———

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
				const comments = Array.isArray(data.comments) ? data.comments : [];
				const activities = Array.isArray(data.activities) ? data.activities : [];
				const taskChecklists = Array.isArray(data.taskChecklists) ? data.taskChecklists : [];
				workspace = {
					version: data.version || 1,
					lastModified: new Date().toISOString(),
					projects,
					taskStatuses,
					projectViews,
					tasks,
					tags,
					comments,
					activities,
					taskChecklists,
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

	// ——— Design system (theme + mode) ———
	const PM_DS_THEME_KEY = "pm-ds-theme";
	const PM_DS_MODE_KEY = "pm-ds-mode";
	function getDesignSystemTheme() {
		try {
			return localStorage.getItem(PM_DS_THEME_KEY) || "neuromorphic";
		} catch {
			return "neuromorphic";
		}
	}
	function getDesignSystemMode() {
		try {
			return localStorage.getItem(PM_DS_MODE_KEY) || "light";
		} catch {
			return "light";
		}
	}
	function applyDesignSystem() {
		const theme = getDesignSystemTheme();
		const mode = getDesignSystemMode();
		const root = document.body;
		if (root) {
			root.setAttribute("data-theme", theme);
			root.setAttribute("data-mode", mode);
		}
		const themeSelect = $("pm-ds-theme");
		if (themeSelect) themeSelect.value = theme;
	}
	applyDesignSystem();
	const themeSelect = $("pm-ds-theme");
	if (themeSelect) {
		themeSelect.addEventListener("change", () => {
			const theme = themeSelect.value;
			document.body.setAttribute("data-theme", theme);
			try {
				localStorage.setItem(PM_DS_THEME_KEY, theme);
			} catch (_) {}
		});
	}
	const modeToggle = $("pm-ds-mode-toggle");
	if (modeToggle) {
		modeToggle.addEventListener("click", () => {
			const current = document.body.getAttribute("data-mode");
			const next = current === "dark" ? "light" : "dark";
			document.body.setAttribute("data-mode", next);
			try {
				localStorage.setItem(PM_DS_MODE_KEY, next);
			} catch (_) {}
		});
	}

	// ——— Boot ———
	if (getToken()) {
		showApp();
	} else {
		showLogin();
	}
})();
