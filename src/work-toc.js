/**
 * Generates the table of contents for the Work page from article headings.
 * Sticky sidebar on desktop; on mobile, hide/show via toggle. Anchor links scroll to sections.
 */
let tocToggleListenerAdded = false;

function initTOCToggleOnce() {
  if (tocToggleListenerAdded) return;
  tocToggleListenerAdded = true;
  document.body.addEventListener("click", (e) => {
    const toggle = e.target.closest("#work-toc-toggle");
    if (!toggle) return;
    e.preventDefault();
    document.body.classList.toggle("sidebar-visible");
    toggle.setAttribute("aria-expanded", String(document.body.classList.contains("sidebar-visible")));
  });
}

export function generateTableOfContents() {
  initTOCToggleOnce();

  const tocElement = document.querySelector("table-of-contents");
  if (!tocElement) return;

  tocElement.replaceChildren(); /* avoid duplicate nav when run twice (e.g. Barba + module init) */

  const article = document.querySelector(".page-work-article") || document.querySelector("article");
  if (!article) return;

  const headings = Array.from(article.querySelectorAll("h2, h3, h4, h5, h6"));
  if (headings.length === 0) return;

  function buildTOC(items, startIndex = 0, currentLevel = 1) {
    const list = document.createElement("ol");
    let index = startIndex;

    while (index < items.length) {
      const item = items[index];
      const level = parseInt(item.tagName.charAt(1), 10);

      if (level < currentLevel) break;

      if (level === currentLevel) {
        const listItem = document.createElement("li");
        const link = document.createElement("a");

        const id =
          item.id ||
          item.textContent
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
        if (!item.id) item.id = id;

        link.href = `#${id}`;
        link.className = "sidebar-link";
        link.textContent = item.textContent.trim();

        listItem.appendChild(link);
        index++;

        if (index < items.length) {
          const nextLevel = parseInt(items[index].tagName.charAt(1), 10);
          if (nextLevel > currentLevel) {
            const result = buildTOC(items, index, currentLevel + 1);
            listItem.appendChild(result.list);
            index = result.nextIndex;
          }
        }

        list.appendChild(listItem);
      } else {
        break;
      }
    }

    return { list, nextIndex: index };
  }

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Table of Contents");

  const heading = document.createElement("h2");
  heading.textContent = "Contents";
  nav.appendChild(heading);

  const result = buildTOC(headings, 0, 2);
  nav.appendChild(result.list);

  const split = document.createElement("hr");
  split.classList.add("split");
  nav.appendChild(split);

  const backToTop = document.createElement("div");
  backToTop.classList.add("back-to-top");
  backToTop.innerHTML = `
    <a aria-label="Back to Top" href="#pre">
      top
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m11.99 7.5 3.75-3.75m0 0 3.75 3.75m-3.75-3.75v16.499H4.49" />
      </svg>
    </a>
  `;

  nav.appendChild(backToTop);

  const backToHome = document.createElement("div");
  backToHome.classList.add("back-to-home");
  backToHome.innerHTML = `<a href="/" class="font-mono" aria-label="Back to home">← Back to home</a>`;
  nav.appendChild(backToHome);

  tocElement.appendChild(nav);

  // Smooth scroll to section on TOC link click (works with hash and SPA)
  tocElement.querySelectorAll("nav a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
        document.body.classList.remove("sidebar-visible");
      }
    });
  });

  tocElement.querySelectorAll("nav .back-to-home a").forEach((a) => {
    a.addEventListener("click", () => document.body.classList.remove("sidebar-visible"));
  });

  // Toggle listener is attached once via initTOCToggleOnce() (delegation on body).

  // Scroll spy: set .active on the link for the section in view
  const tocLinks = tocElement.querySelectorAll("nav .sidebar-link");
  const sections = Array.from(tocLinks).map((a) => {
    const id = a.getAttribute("href")?.slice(1);
    return id ? document.getElementById(id) : null;
  }).filter(Boolean);

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length === 0) return;
        const topmost = intersecting.reduce((a, b) =>
          a.target.getBoundingClientRect().top < b.target.getBoundingClientRect().top ? a : b
        );
        const id = topmost.target.id;
        tocLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
  }
}

if (document.querySelector("table-of-contents")) {
  generateTableOfContents();
}
