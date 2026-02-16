import fallbackArticles from "../data/articles.json";

const MAX_CARDS = 5;
const STAGGER_MS = 100;
const EXCERPT_MAX_LEN = 140;

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
  const thumbnail = item.thumbnail || (item.enclosure && item.enclosure.url) || "";
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
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    const items = parseRss2JsonResponse(data).map((item) => normalizeRssItem(item, "Substack"));
    return items.slice(0, 1);
  } catch {
    return [];
  }
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
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const edges = json?.data?.publication?.posts?.edges || [];
    if (!edges.length) return [];
    const base = "https://aj91.hashnode.dev";
    return edges.map(({ node }) => {
      let thumb = node.coverImage?.url || "";
      if (thumb && !thumb.startsWith("http")) {
        thumb = base + (thumb.startsWith("/") ? "" : "/") + thumb;
      }
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

// ============================================================================
// HARDCODED CARDS - UPDATE THESE MANUALLY
// ============================================================================
// To update YouTube or GoodGrow cards, edit the arrays below with your latest content.
// Format: { source, title, excerpt, url, thumbnail, publishedAt }

function getHardcodedYouTube() {
  return [
    {
      source: "YouTube",
      title: "What is Goodgrow",
      excerpt: "Discover how Goodgrow is building a fairer, more transparent marketplace — connecting artisans, farmers, and conscious consumers through regenerative supply chains.",
      url: "https://www.youtube.com/watch?v=jyW-fOZmM0c",
      // VIDEO CARD: Add video URL here to enable video card (looping video instead of thumbnail)
      video: "https://res.cloudinary.com/duq7hplof/video/upload/v1771259377/Sequence_01_3_zjpuqs.mp4",
      publishedAt: "2025-02-16T00:00:00.000Z",
    },
  ];
}

function getHardcodedGoodGrow() {
  return [
    {
      source: "Goodgrow",
      title: "Brands We Love: Chocolate Edition",
      excerpt: "We’re rounding up some of our favorite chocolate brands doing things the right way: ethically sourced, thoughtfully crafted, and genuinely delicious.",
      url: "https://www.goodgrow.io/projects/chocolate-brands-we-love-valentines-day-edition",
      thumbnail: "https://cdn.prod.website-files.com/68d537666466c2b411241f41/698aa73923f0f83b0fdb1fdb_Screenshot%202026-02-09%20at%2022.33.32.png",
      // VIDEO CARD: Add video URL here to enable video card (looping video instead of thumbnail)
      // Example: video: "https://cdn.example.com/video.mp4"
      video: "",
      publishedAt: "2025-02-16T00:00:00.000Z",
    },
  ];
}
// ============================================================================

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

  const cardLink = document.createElement("a");
  cardLink.className = "writing-card-link";
  cardLink.href = article.url;
  cardLink.target = "_blank";
  cardLink.rel = "noopener noreferrer";

  if (article.video) {
    card.classList.add("writing-card--video");
    cardLink.innerHTML =
      `<div class="writing-card-inner">
        <div class="card-video-container">
          <div class="card-video-overlay"></div>
          <video class="card-video" playsinline loop muted autoplay preload="metadata">
            <source src="${escapeHtml(article.video)}" type="video/mp4">
          </video>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(article.title)}</h3>
          <p class="card-excerpt">${escapeHtml(article.excerpt)}</p>
        </div>
      </div>`;
  } else {
    let thumbBlock = "";
    if (article.thumbnail) {
      thumbBlock = `<img class="card-thumb" src="" data-src="${escapeHtml(article.thumbnail)}" alt="" loading="lazy" width="80" height="80">`;
    } else {
      const placeholderId = "card-ph-" + index + "-" + Math.random().toString(36).slice(2, 9);
      thumbBlock = `<div class="card-thumb card-thumb--placeholder" aria-hidden="true">${thumbPlaceholderSvg(placeholderId)}</div>`;
    }
    cardLink.innerHTML =
      `<div class="writing-card-inner">${thumbBlock}<div class="card-body">
        <h3 class="card-title">${escapeHtml(article.title)}</h3>
        <p class="card-excerpt">${escapeHtml(article.excerpt)}</p>
      </div></div>`;
  }

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

  const video = card.querySelector(".card-video");
  if (video) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            card.classList.add("writing-card--video-visible");
          } else {
            video.pause();
            card.classList.remove("writing-card--video-visible");
          }
        });
      },
      { rootMargin: "50px", threshold: 0.1 }
    );
    io.observe(card);
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

let observer = null;

function setupObserver(container) {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("writing-card--visible");
      });
    },
    { threshold: 0.1, rootMargin: "20px" }
  );
  container.querySelectorAll(".writing-card").forEach((el) => observer.observe(el));
}

function renderCards(container, items) {
  container.classList.remove("writing-cards--loading");
  if (!items.length) {
    container.innerHTML = '<p class="writing-feed-fallback">Writing feed unavailable</p>';
    return;
  }
  const sorted = sortByDate(items).slice(0, MAX_CARDS);
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  sorted.forEach((article, i) => {
    const card = createCardElement(article, i);
    fragment.appendChild(card);
  });
  container.appendChild(fragment);
  setupObserver(container);
}

function loadFallback() {
  return Array.isArray(fallbackArticles) ? [...fallbackArticles] : [];
}

export function init() {
  const container = document.getElementById("writing-cards");
  if (!container) return;

  showLoading(container);

  (async () => {
    const [substack, hashnode] = await Promise.allSettled([
      fetchSubstack(),
      fetchHashnode(),
    ]);
    const items = [];
    if (substack.status === "fulfilled" && substack.value?.length) {
      items.push(...substack.value);
    }
    if (hashnode.status === "fulfilled" && hashnode.value?.length) {
      items.push(...hashnode.value);
    }
    items.push(...getHardcodedYouTube());
    items.push(...getHardcodedGoodGrow());
    if (items.length > 0) {
      renderCards(container, items);
    } else {
      const fallback = loadFallback();
      if (fallback.length) {
        renderCards(container, fallback);
      } else {
        container.classList.remove("writing-cards--loading");
        container.innerHTML = '<p class="writing-feed-fallback">Writing feed unavailable</p>';
      }
    }
  })();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
