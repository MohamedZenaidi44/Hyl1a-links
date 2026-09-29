// ─────────────────────────────────────────────────────────────
// Rendu + interactions. Aucune dépendance externe.
// Données dans data.js (PROJECTS, CATEGORIES, STATUSES, CATEGORY_COLORS).
// ─────────────────────────────────────────────────────────────

const ICONS = {
  external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  github: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.78 10.77.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.03-.71.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.25.44-2.26 1.18-3.06-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.17a10.9 10.9 0 0 1 5.79 0c2.2-1.48 3.17-1.17 3.17-1.17.63 1.59.24 2.76.12 3.05.74.8 1.18 1.81 1.18 3.06 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z"/></svg>`,
  docs: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 2h9l5 5v15H6V2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 2v5h5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>`,
};

const state = { query: "", category: "all" };

const els = {
  count: document.getElementById("project-count"),
  search: document.getElementById("search-input"),
  rail: document.getElementById("category-rail"),
  resultsCount: document.getElementById("results-count"),
  emptyState: document.getElementById("empty-state"),
  list: document.getElementById("link-list"),
  overlay: document.getElementById("panel-overlay"),
  panelContent: document.getElementById("panel-content"),
  panelClose: document.getElementById("panel-close"),
};

function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
function categoryColor(id) {
  return CATEGORY_COLORS[id] ?? "#7C9EFF";
}

/* ── Lazy-loaded live preview (iframe) ──────────────────────
   Ne charge le vrai site que quand la miniature entre dans
   l'écran, et une seule fois — évite de charger 5+ sites lourds
   (vidéo, audio, JS) en même temps au démarrage. */
const lazyLoadObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          delete iframe.dataset.src;
        }
        lazyLoadObserver.unobserve(iframe);
      }
    });
  },
  { rootMargin: "200px" }
);

function buildThumb(project, { fontSize = "13px" } = {}) {
  const wrapper = document.createElement("div");

  const fallback = document.createElement("span");
  fallback.className = "link-thumb-fallback";
  fallback.style.fontSize = fontSize;
  fallback.textContent = project.name.slice(0, 2).toUpperCase();
  wrapper.appendChild(fallback);

  const demoLink = project.links.find((l) => l.kind === "demo");

  if (project.preview === "live" && demoLink) {
    const iframe = document.createElement("iframe");
    iframe.className = "preview-iframe";
    iframe.dataset.src = demoLink.url;
    iframe.loading = "lazy";
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    iframe.style.width = "1000%";
    iframe.style.height = "1000%";
    iframe.style.transform = "scale(0.1)";
    iframe.style.transformOrigin = "top left";
    iframe.addEventListener("load", () => iframe.classList.add("loaded"));
    wrapper.appendChild(iframe);
    lazyLoadObserver.observe(iframe);
  } else if (project.preview && project.preview !== "live") {
    fallback.remove();
    const img = document.createElement("img");
    img.src = project.preview;
    img.alt = "";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    wrapper.appendChild(img);
  }

  return wrapper;
}

/* ── Link item (the "linktree" row) ─────────────────────── */
function renderLinkItem(project) {
  const demoLink = project.links.find((l) => l.kind === "demo");
  const githubLink = project.links.find((l) => l.kind === "github");
  const statusMeta = STATUSES[project.status] ?? STATUSES.dev;

  const item = document.createElement("article");
  item.className = "link-item";

  // Toute la ligne ouvre le site en un clic, comme un vrai lien
  // linktree — sauf les boutons d'action (au-dessus, z-index 2).
  const clickArea = document.createElement("div");
  clickArea.className = "link-click-area";
  clickArea.addEventListener("click", () => {
    if (demoLink) window.open(demoLink.url, "_blank", "noreferrer");
    else openPanel(project);
  });
  item.appendChild(clickArea);

  const thumb = document.createElement("div");
  thumb.className = "link-thumb";
  thumb.appendChild(buildThumb(project));
  item.appendChild(thumb);

  const text = document.createElement("div");
  text.className = "link-text";
  text.innerHTML = `
    <div class="link-top-row">
      <h3 class="link-name">${project.name}</h3>
      <span class="link-category">${categoryLabel(project.category)}</span>
    </div>
    <p class="link-tagline">${project.tagline}</p>
  `;
  item.appendChild(text);

  const actions = document.createElement("div");
  actions.className = "link-actions";

  const statusDot = document.createElement("span");
  statusDot.className = "status-dot";
  statusDot.style.background = statusMeta.color;
  statusDot.title = statusMeta.label;
  actions.appendChild(statusDot);

  if (githubLink) {
    const a = document.createElement("a");
    a.href = githubLink.url;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.className = "icon-btn";
    a.setAttribute("aria-label", "Voir sur GitHub");
    a.innerHTML = ICONS.github;
    actions.appendChild(a);
  }

  const infoBtn = document.createElement("button");
  infoBtn.className = "icon-btn info-btn";
  infoBtn.setAttribute("aria-label", "Voir le détail du projet");
  infoBtn.innerHTML = ICONS.info;
  infoBtn.addEventListener("click", () => openPanel(project));
  actions.appendChild(infoBtn);

  item.appendChild(actions);

  return item;
}

/* ── Detail panel ────────────────────────────────────────── */
function formatDate(value) {
  if (!value) return "inconnue";
  return new Date(value).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

const LINK_ICON = { demo: ICONS.external, github: ICONS.github, docs: ICONS.docs, other: ICONS.external };

function openPanel(project) {
  els.panelContent.innerHTML = "";

  const banner = document.createElement("div");
  banner.className = "panel-banner";
  banner.appendChild(buildThumb(project, { fontSize: "28px" }));
  els.panelContent.appendChild(banner);

  const body = document.createElement("div");
  body.className = "panel-body";

  const linksHtml = project.links
    .map((l) => `<a href="${l.url}" target="_blank" rel="noreferrer" class="panel-link-btn">${LINK_ICON[l.kind] ?? ICONS.external} ${l.label}</a>`)
    .join("");

  const descHtml = project.description
    .split("\n\n")
    .map((p) => `<p>${p}</p>`)
    .join("");

  const techHtml = project.technologies.map((t) => `<span class="tech-tag">${t}</span>`).join("");

  body.innerHTML = `
    <span class="panel-category">${categoryLabel(project.category)}</span>
    <h2 class="panel-name">${project.name}</h2>
    <div class="panel-links-row">${linksHtml}</div>
    <div class="panel-description">${descHtml}</div>
    <div class="panel-meta">
      <div class="panel-block" style="grid-column:1/-1">
        <p class="panel-block-title">technologies</p>
        <div class="tech-list">${techHtml}</div>
      </div>

    </div>
  `;

  els.panelContent.appendChild(body);
  els.overlay.hidden = false;
  document.body.classList.add("panel-open");
}

function closePanel() {
  els.overlay.hidden = true;
  document.body.classList.remove("panel-open");
}

els.panelClose.addEventListener("click", closePanel);
els.overlay.addEventListener("click", (e) => {
  if (e.target === els.overlay) closePanel();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !els.overlay.hidden) closePanel();
});

/* ── Category rail ───────────────────────────────────────── */
function renderCategoryRail() {
  els.rail.innerHTML = "";
  const all = [{ id: "all", label: "Tout" }, ...CATEGORIES];

  all.forEach((cat) => {
    const count = cat.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat.id).length;
    const color = cat.id === "all" ? "#7C9EFF" : categoryColor(cat.id);

    const btn = document.createElement("button");
    btn.className = "chip" + (state.category === cat.id ? " active" : "");
    btn.style.setProperty("--chip-color", color);
    btn.innerHTML = cat.id === "all" ? cat.label : `<span class="dot"></span>${cat.label} (${count})`;
    btn.addEventListener("click", () => {
      state.category = cat.id;
      render();
    });
    els.rail.appendChild(btn);
  });
}

/* ── Main render ─────────────────────────────────────────── */
function render() {
  renderCategoryRail();

  const q = state.query.trim().toLowerCase();
  const noFilter = q === "" && state.category === "all";

  const filtered = PROJECTS.filter((p) => {
    const matchesCategory = state.category === "all" || p.category === state.category;
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  // Featured en tête de liste par défaut (pas de filtre actif).
  const ordered = noFilter
    ? [...filtered].sort((a, b) => (b.featured === true) - (a.featured === true))
    : filtered;

  els.resultsCount.hidden = noFilter;
  if (!noFilter) {
    els.resultsCount.textContent = `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`;
  }

  els.list.innerHTML = "";
  els.emptyState.hidden = ordered.length !== 0;
  ordered.forEach((p) => els.list.appendChild(renderLinkItem(p)));
}

/* ── Init ─────────────────────────────────────────────────── */
els.count.textContent = PROJECTS.length;
els.search.addEventListener("input", (e) => {
  state.query = e.target.value;
  render();
});

render();
