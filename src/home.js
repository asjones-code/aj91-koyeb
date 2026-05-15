import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// ── Line-by-line text reveal ─────────────────────────────────────────────────
// Each .reveal-inner starts at translateY(110%) and slides up when its parent
// .reveal-line enters the viewport. data-delay (seconds) staggers siblings.

export function initRevealLines() {
  const inners = document.querySelectorAll('.reveal-inner');
  if (!inners.length) return;

  inners.forEach((inner) => {
    gsap.set(inner, { yPercent: 110 });
    const line = inner.closest('.reveal-line');
    if (!line) return;
    const delay = parseFloat(inner.dataset.delay || 0);

    ScrollTrigger.create({
      trigger: line,
      start: 'top 90%',
      once: true,
      onEnter() {
        gsap.to(inner, {
          yPercent: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay,
        });
      },
    });
  });
}

// ── Writing carousel ─────────────────────────────────────────────────────────
// Wraps the existing #writing-cards horizontal strip with prev/next controls
// and a "01 / 04" counter. Reads card dimensions at runtime so it works with
// whatever writing.js populates.

// ── About media sequence ─────────────────────────────────────────────────────
// firstframe.png → (video plays once on viewport entry) → lastframe.png

export function initAboutMedia() {
  const wrap  = document.getElementById('about-media');
  const video = document.getElementById('about-video');
  if (!wrap || !video) return;

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    setTimeout(() => {
      wrap.classList.add('is-playing');
      video.play().catch(() => {});
      video.addEventListener('ended', () => {
        wrap.classList.remove('is-playing');
        wrap.classList.add('is-ended');
      }, { once: true });
    }, 500);
  }, { threshold: 0.8 });

  io.observe(wrap);
}

// ── Writing carousel ─────────────────────────────────────────────────────────
export function initCarousel() {
  const grid = document.querySelector('.home-writing-grid');
  const prev = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const counter = document.querySelector('.carousel-counter');
  if (!grid) return;

  function cardStep() {
    const card = grid.querySelector('.writing-card');
    if (!card) return 1;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 16;
    return card.offsetWidth + gap;
  }

  function total() { return grid.querySelectorAll('.writing-card').length; }

  function current() {
    const step = cardStep();
    return step > 0 ? Math.round(grid.scrollLeft / step) : 0;
  }

  function go(i) {
    const n = total();
    if (!n) return;
    const clamped = Math.max(0, Math.min(n - 1, i));
    grid.scrollTo({ left: clamped * cardStep(), behavior: 'smooth' });
  }

  function refresh() {
    const n = total();
    const c = current();
    if (counter) {
      counter.textContent = n
        ? `${String(c + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`
        : '— / —';
    }
    if (prev) prev.disabled = c <= 0;
    if (next) next.disabled = n === 0 || c >= n - 1;
  }

  prev?.addEventListener('click', () => go(current() - 1));
  next?.addEventListener('click', () => go(current() + 1));
  grid.addEventListener('scroll', refresh, { passive: true });

  // Re-run when writing.js inserts cards asynchronously
  new MutationObserver(refresh).observe(grid, { childList: true });
  refresh();
}

// ── Terminal magnetic pull (desktop only) ────────────────────────────────────
// Moves .hero-terminal-anchor (never touched by GSAP/terminal-ui) toward the
// cursor when it's within RADIUS px of the terminal center. Disabled once the
// user drags the terminal to a fixed position.
export function initTerminalMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const anchor  = document.querySelector('.hero-terminal-anchor');
  const terminal = document.getElementById('terminal');
  if (!anchor || !terminal) return;

  const RADIUS     = 380;
  const STRENGTH   = 0.18;
  const MAX_OFFSET = 18;   // px — hard cap so it never drifts far
  const LERP       = 0.07;

  let curX = 0, curY = 0, tgtX = 0, tgtY = 0;
  let rafId = null;

  // Snapshot the resting center once (before any transform is applied).
  // Using a fixed reference avoids the feedback loop where applying the
  // transform shifts getBoundingClientRect() and compounds on itself.
  let restCx = 0, restCy = 0;
  function snapshotCenter() {
    const r = terminal.getBoundingClientRect();
    restCx = r.left + r.width  / 2;
    restCy = r.top  + r.height / 2;
  }
  snapshotCenter();
  // Re-snapshot on resize so the resting center stays accurate.
  window.addEventListener('resize', snapshotCenter, { passive: true });

  function clamp(v, max) { return Math.sign(v) * Math.min(Math.abs(v), max); }

  function tick() {
    if (terminal.style.position === 'fixed') { rafId = null; return; }
    curX += (tgtX - curX) * LERP;
    curY += (tgtY - curY) * LERP;
    // Drive via CSS custom properties so the centering translate(-50%, -58%)
    // defined in the stylesheet is preserved — never overwrite the full transform.
    anchor.style.setProperty('--mag-x', `${curX.toFixed(2)}px`);
    anchor.style.setProperty('--mag-y', `${curY.toFixed(2)}px`);
    const settled = Math.abs(curX - tgtX) < 0.05 && Math.abs(curY - tgtY) < 0.05;
    rafId = settled ? null : requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', (e) => {
    if (!anchor.isConnected) return;
    if (terminal.style.position === 'fixed') return;
    const dx = e.clientX - restCx;
    const dy = e.clientY - restCy;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < RADIUS) {
      const pull = (1 - d / RADIUS) * STRENGTH;
      tgtX = clamp(dx * pull, MAX_OFFSET);
      tgtY = clamp(dy * pull, MAX_OFFSET);
    } else {
      tgtX = 0; tgtY = 0;
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });
}
