/**
 * Writing Feed — populates #writing-cards with article cards from RSS/APIs.
 * Sources: Substack (1), YouTube (1), Hashnode (1), GoodGrow (1). Fallback: articles.json. Max 5 cards.
 */
import fallbackArticles from "../data/articles.json";

const MAX_CARDS = 5;
const STAGGER_MS = 100;
const EXCERPT_MAX_LEN = 140;

/** Set to your YouTube channel ID (e.g. from channel page URL) to show latest video. */
const YOUTUBE_CHANNEL_ID = "UCy1T4MetuPZMfHj-wGFIWHg";

function truncate(str, max = EXCERPT_MAX_LEN) {
  if (!str || typeof str !== "string") return "";
  str = str.replace(/\s+/g, " ").trim();
  return str.length <= max ? str : str.slice(0, max - 1).trim() + "…";
}

function normalizeRssItem(item, source) {
  const title = item.title || "";
  const link = item.link || item.url || "";
  const pubDate = item.pubDate || item.published || item.isoDate || "";
  let excerpt = item.contentSnippet || item.content || item.description || "";
  excerpt = excerpt.replace(/<[^>]+>/g, "").trim();
  const thumbnail =
    item.thumbnail ||
    (item.enclosure && item.enclosure.url) ||
    (item.media && item.media.thumbnail && item.media.thumbnail.$ && item.media.thumbnail.$.url) ||
    "";
  return {
    source,
    title,
    excerpt: truncate(excerpt),
    url: link,
    thumbnail,
    publishedAt: pubDate,
  };
}

function parseRss2JsonResponse(data) {
  if (!data || data.status !== "ok" || !Array.isArray(data.items)) return [];
  return data.items;
}

async function fetchSubstack() {
  try {
    const url = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://aj91.substack.com/feed");
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    const items = parseRss2JsonResponse(data).map((item) => normalizeRssItem(item, "Substack"));
    return items.slice(0, 1);
  } catch {
    return [];
  }
}

function parseYouTubeItemFromXml(itemEl) {
  const atom = "http://www.w3.org/2005/Atom";
  const media = "http://search.yahoo.com/mrss/";
  const getText = (parent, tag) => {
    const el = parent.getElementsByTagNameNS?.(atom, tag)?.[0] || parent.getElementsByTagName?.(tag)?.[0];
    return el ? (el.textContent || "").trim() : "";
  };
  const linkEl = itemEl.getElementsByTagNameNS?.(atom, "link")?.[0] || itemEl.getElementsByTagName?.("link")?.[0];
  const link = linkEl?.getAttribute?.("href") || "";
  const title = getText(itemEl, "title");
  const published = getText(itemEl, "published");
  let thumb = "";
  const group = itemEl.getElementsByTagNameNS?.(media, "group")?.[0] || itemEl.getElementsByTagName?.("group")?.[0];
  if (group) {
    const thumbEl = group.getElementsByTagNameNS?.(media, "thumbnail")?.[0] || group.getElementsByTagName?.("thumbnail")?.[0];
    thumb = thumbEl?.getAttribute?.("url") || "";
  }
  if (!thumb && link) {
    const m = link.match(/[?&]v=([^&]+)/);
    if (m) thumb = "https://img.youtube.com/vi/" + m[1] + "/mqdefault.jpg";
  }
  let description = "";
  const summaryEl = itemEl.getElementsByTagNameNS?.(atom, "summary")?.[0] || itemEl.getElementsByTagName?.("summary")?.[0];
  if (summaryEl) description = (summaryEl.textContent || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!description && group) {
    const descEl = group.getElementsByTagNameNS?.(media, "description")?.[0] || group.getElementsByTagName?.("description")?.[0];
    if (descEl) description = (descEl.textContent || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  return {
    source: "YouTube",
    title,
    excerpt: truncate(description),
    url: link,
    thumbnail: thumb,
    publishedAt: published,
  };
}

async function fetchYouTubeViaProxy(rssUrl) {
  const proxies = [
    () => "https://corsproxy.io/?" + encodeURIComponent(rssUrl),
    () => "https://api.allorigins.win/raw?url=" + encodeURIComponent(rssUrl),
  ];
  for (const toUrl of proxies) {
    try {
      const res = await fetch(toUrl(), { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const xml = await res.text();
      if (!xml || xml.length < 200) continue;
      const doc = new DOMParser().parseFromString(xml, "text/xml");
      const parseError = doc.querySelector("parsererror");
      if (parseError) continue;
      const atom = "http://www.w3.org/2005/Atom";
      const entries = doc.getElementsByTagNameNS?.(atom, "entry") || doc.querySelectorAll("entry");
      if (!entries.length) continue;
      const item = parseYouTubeItemFromXml(entries[0]);
      if (item && item.url) return [item];
    } catch {
      /* try next proxy */
    }
  }
  return [];
}

async function fetchYouTube() {
  if (!YOUTUBE_CHANNEL_ID) return [];
  try {
    const rssUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" + YOUTUBE_CHANNEL_ID;
    const url =
      "https://api.rss2json.com/v1/api.json?rss_url=" +
      encodeURIComponent(rssUrl) +
      "&count=1";
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return await fetchYouTubeViaProxy(rssUrl);
    const data = await res.json();
    if (data.status === "error" || !Array.isArray(data.items) || !data.items.length) {
      return await fetchYouTubeViaProxy(rssUrl);
    }
    const raw = data.items;
    const items = raw.map((item) => {
      const link = item.link || item.url || "";
      let thumb = item.thumbnail || "";
      if (!thumb && link) {
        const m = link.match(/[?&]v=([^&]+)/);
        if (m) thumb = "https://img.youtube.com/vi/" + m[1] + "/mqdefault.jpg";
      }
      return {
        source: "YouTube",
        title: item.title || "",
        excerpt: truncate((item.contentSnippet || item.description || "").replace(/<[^>]+>/g, "").trim()),
        url: link,
        thumbnail: thumb,
        publishedAt: item.pubDate || item.published || item.isoDate || "",
      };
    });
    return items.slice(0, 1);
  } catch {
    return await fetchYouTubeViaProxy(rssUrl);
  }
}

const GOODGROW_RSS_URL = "https://www.goodgrow.io/projects/rss.xml";
const GOODGROW_PROJECTS_URL = "https://www.goodgrow.io/our-projects";

async function fetchViaProxy(targetUrl) {
  const proxies = [
    () => "https://corsproxy.io/?" + encodeURIComponent(targetUrl),
    () => "https://api.allorigins.win/raw?url=" + encodeURIComponent(targetUrl),
  ];
  for (const toUrl of proxies) {
    try {
      const res = await fetch(toUrl(), { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      return await res.text();
    } catch {
      /* try next proxy */
    }
  }
  return null;
}

/** Get the most recent project page URL from RSS or our-projects listing. */
async function getGoodgrowFirstProjectUrl() {
  try {
    const url = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(GOODGROW_RSS_URL) + "&count=1";
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      const link = data?.items?.[0]?.link || data?.items?.[0]?.url;
      if (link) return link.trim();
    }
  } catch {
    /* ignore */
  }
  const xml = await fetchViaProxy(GOODGROW_RSS_URL);
  if (xml && xml.length > 200) {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const item = doc.querySelector("item");
    const entry = doc.querySelector("entry");
    const first = item || entry;
    if (first) {
      const linkEl = first.querySelector("link[href]") || first.querySelector("link");
      const link = linkEl ? (linkEl.getAttribute("href") || linkEl.textContent || "").trim() : "";
      if (link) return link.startsWith("http") ? link : "https://www.goodgrow.io" + (link.startsWith("/") ? "" : "/") + link;
    }
  }
  const html = await fetchViaProxy(GOODGROW_PROJECTS_URL);
  if (html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    for (const a of doc.querySelectorAll('a[href*="/projects/"]')) {
      const href = (a.getAttribute("href") || "").trim();
      if (!href || href.includes("project-categories") || href === "/our-projects") continue;
      return href.startsWith("http") ? href : "https://www.goodgrow.io" + (href.startsWith("/") ? "" : "/") + href;
    }
  }
  return null;
}

/** Scrape title from head meta tags and excerpt from first <p> on the project page. */
function scrapeGoodgrowProjectPage(html, pageUrl) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  let title = "";
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  const twitterTitle = doc.querySelector('meta[name="twitter:title"]');
  const titleTag = doc.querySelector("head title");
  if (ogTitle) title = (ogTitle.getAttribute("content") || "").trim();
  if (!title && twitterTitle) title = (twitterTitle.getAttribute("content") || "").trim();
  if (!title && titleTag) title = (titleTag.textContent || "").trim();
  let excerpt = "";
  const firstP = doc.querySelector("body p");
  if (firstP) excerpt = (firstP.textContent || "").replace(/\s+/g, " ").trim();
  return {
    source: "GoodGrow",
    title: title || "Project",
    excerpt: truncate(excerpt) || "Latest from GoodGrow",
    url: pageUrl,
    thumbnail: (doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || "").trim(),
    publishedAt: "",
  };
}

async function fetchGoodgrow() {
  const projectUrl = await getGoodgrowFirstProjectUrl();
  if (!projectUrl) return [];
  const html = await fetchViaProxy(projectUrl);
  if (!html || html.length < 100) return [];
  return [scrapeGoodgrowProjectPage(html, projectUrl)];
}

async function fetchHashnode() {
  try {
    const res = await fetch("https://gql.hashnode.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query PublicationPosts($host: String!, $first: Int!) {
          publication(host: $host) {
            posts(first: $first) {
              edges {
                node {
                  title
                  url
                  brief
                  publishedAt
                  coverImage { url }
                }
              }
            }
          }
        }`,
        variables: { host: "aj91.hashnode.dev", first: 1 },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const edges =
      json?.data?.publication?.posts?.edges || [];
    const base = "https://aj91.hashnode.dev";
    return edges.map(({ node }) => {
      let thumb = node.coverImage?.url || "";
      if (thumb && !thumb.startsWith("http")) thumb = base + (thumb.startsWith("/") ? "" : "/") + thumb;
      return {
        source: "Hashnode",
        title: node.title || "",
        excerpt: truncate(node.brief || ""),
        url: node.url || base + "/",
        thumbnail: thumb,
        publishedAt: node.publishedAt || "",
      };
    });
  } catch {
    return [];
  }
}

function loadFallback() {
  return Array.isArray(fallbackArticles) ? [...fallbackArticles] : [];
}

function sortByDate(items) {
  return [...items].sort((a, b) => {
    const tA = new Date(a.publishedAt || 0).getTime();
    const tB = new Date(b.publishedAt || 0).getTime();
    return tB - tA;
  });
}

function createCardElement(article, index) {
  const card = document.createElement("div");
  card.className = "menu-card writing-card";
  card.style.setProperty("--card-stagger", index * STAGGER_MS + "ms");

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "card-close";
  closeBtn.setAttribute("aria-label", "Close card");
  closeBtn.textContent = "×";

  const thumbPlaceholderSvg = (id) => {
    const step = 4;
    const dots = [];
    for (let y = 0; y <= 80; y += step) {
      for (let x = 0; x <= 80; x += step) {
        const t = (x / 80 + y / 80) / 2;
        const opacity = 0.04 + 0.14 * (1 - t);
        dots.push(`<circle cx="${x}" cy="${y}" r="1.1" fill="#fff" opacity="${opacity.toFixed(2)}"/>`);
      }
    }
    return `<svg class="card-thumb-placeholder-svg" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${id}-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#252320"/>
          <stop offset="100%" stop-color="#151513"/>
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="16" fill="url(#${id}-bg)"/>
      ${dots.join("")}
    </svg>`;
  };

  let thumbBlock = "";
  if (article.thumbnail) {
    thumbBlock = `<img class="card-thumb" src="" data-src="${article.thumbnail}" alt="" loading="lazy" width="80" height="80">`;
  } else {
    const placeholderId = "card-ph-" + index + "-" + Math.random().toString(36).slice(2, 9);
    thumbBlock = `<div class="card-thumb card-thumb--placeholder" aria-hidden="true">${thumbPlaceholderSvg(placeholderId)}</div>`;
  }

  const cardLink = document.createElement("a");
  cardLink.className = "writing-card-link";
  cardLink.href = article.url;
  cardLink.target = "_blank";
  cardLink.rel = "noopener noreferrer";
  cardLink.innerHTML =
    `<div class="writing-card-inner">${thumbBlock}<div class="card-body">
      <h3 class="card-title">${escapeHtml(article.title)}</h3>
      <p class="card-excerpt">${escapeHtml(article.excerpt)}</p>
    </div></div>`;

  card.appendChild(cardLink);
  card.prepend(closeBtn);

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    card.classList.add("writing-card--closing");
    card.addEventListener(
      "transitionend",
      () => card.remove(),
      { once: true }
    );
  });

  const img = card.querySelector(".card-thumb");
  if (img && img.dataset.src) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = img.dataset.src || "";
            img.removeAttribute("data-src");
          }
        });
      },
      { rootMargin: "50px" }
    );
    io.observe(img);
  }

  return card;
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function showLoading(container) {
  container.classList.add("writing-cards--loading");
  container.innerHTML = `
    <div class="writing-card-skeleton" aria-hidden="true">
      <div class="writing-card-skeleton__thumb"></div>
      <div class="writing-card-skeleton__body">
        <div class="writing-card-skeleton__line writing-card-skeleton__line--title"></div>
        <div class="writing-card-skeleton__line writing-card-skeleton__line--excerpt"></div>
      </div>
    </div>
    <div class="writing-card-skeleton" aria-hidden="true">
      <div class="writing-card-skeleton__thumb"></div>
      <div class="writing-card-skeleton__body">
        <div class="writing-card-skeleton__line writing-card-skeleton__line--title"></div>
        <div class="writing-card-skeleton__line writing-card-skeleton__line--excerpt"></div>
      </div>
    </div>
    <div class="writing-card-skeleton" aria-hidden="true">
      <div class="writing-card-skeleton__thumb"></div>
      <div class="writing-card-skeleton__body">
        <div class="writing-card-skeleton__line writing-card-skeleton__line--title"></div>
        <div class="writing-card-skeleton__line writing-card-skeleton__line--excerpt"></div>
      </div>
    </div>
  `;
}

function renderCards(container, items) {
  container.classList.remove("writing-cards--loading");
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = '<p class="writing-feed-fallback">Writing feed unavailable</p>';
    return;
  }
  const sorted = sortByDate(items).slice(0, MAX_CARDS);
  const fragment = document.createDocumentFragment();
  sorted.forEach((article, i) => fragment.appendChild(createCardElement(article, i)));
  container.appendChild(fragment);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("writing-card--visible");
      });
    },
    { threshold: 0.1, rootMargin: "20px" }
  );
  container.querySelectorAll(".writing-card").forEach((el) => observer.observe(el));
}

export function init() {
  const container = document.getElementById("writing-cards");
  if (!container) return;

  showLoading(container);

  (async () => {
    const [substack, youtube, hashnode, goodgrow] = await Promise.all([
      fetchSubstack(),
      fetchYouTube(),
      fetchHashnode(),
      fetchGoodgrow(),
    ]);
    const merged = [...substack, ...youtube, ...hashnode, ...goodgrow];
    const items = merged.length ? merged : loadFallback();
    renderCards(container, items);
  })();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
