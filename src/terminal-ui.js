const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"><path fill="currentColor" d="M30.475 22.86h-4.57v-1.53h1.52v-1.52H4.575v1.52H6.1v1.53H1.525V32h28.95Zm-22.86-1.53h16.76v1.53H7.615Zm21.34 9.15H3.045v-6.1h25.91Zm-1.53-28.96h1.53v18.29h-1.53Z"/><path fill="currentColor" d="M18.285 25.9h7.62v1.53h-7.62Zm0-15.23h1.52v1.52h-1.52Zm0-3.05h1.52v1.52h-1.52Zm-4.57 4.57h4.57v1.52h-4.57Zm-1.53-1.52h1.53v1.52h-1.53Zm0-3.05h1.53v1.52h-1.53Z"/><path fill="currentColor" d="M6.1 18.29h19.81V3.05H6.1ZM7.615 4.57h16.76v12.19H7.615ZM6.095 25.9h3.05v3.05h-3.05ZM4.575 0h22.85v1.52H4.575Zm-1.53 1.52h1.53v18.29h-1.53Z"/></svg>`;

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const DUR  = '0.42s';
const TRANSITION = `opacity ${DUR} ${EASE}, transform ${DUR} ${EASE}`;

export function initTerminalUI() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  const termBar  = terminal.querySelector('.term-bar');
  const closeBtn = terminal.querySelector('.term-btn.close');
  if (!termBar) return;

  let isFixed = false;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  // Rect snapshot taken at mousedown so makeFixed() uses the visual position
  // including any magnetic transform — avoids the snap-to-original jump.
  let pendingRect = null;

  function makeFixed(precomputedRect) {
    if (isFixed) return;
    // Force transform:none (inline) on every ancestor — not just '' — so that CSS-class
    // transforms (like the .hero-terminal-anchor centering rule) are also overridden.
    // Any ancestor transform creates a containing block for position:fixed children,
    // which makes left/top relative to that ancestor instead of the viewport.
    let ancestor = terminal.parentElement;
    while (ancestor && ancestor !== document.body) {
      const s = ancestor.style;
      s.filter     = '';
      s.transform  = 'none';
      s.willChange = '';
      // Remove magnetic CSS vars so they don't linger on the now-neutralised anchor.
      ancestor.style.removeProperty('--mag-x');
      ancestor.style.removeProperty('--mag-y');
      ancestor = ancestor.parentElement;
    }
    // Use the pre-computed rect (captured before transforms were cleared) so the
    // terminal lands exactly where it appeared, not at the non-magnetic position.
    const rect = precomputedRect || terminal.getBoundingClientRect();
    terminal.style.position = 'fixed';
    terminal.style.left   = rect.left   + 'px';
    terminal.style.top    = rect.top    + 'px';
    terminal.style.width  = rect.width  + 'px';
    terminal.style.height = rect.height + 'px';
    terminal.style.margin = '0';
    terminal.style.zIndex = '50';
    isFixed = true;
  }

  function onDragStart(e) {
    if (e.target.classList.contains('term-btn')) return;
    e.preventDefault();
    isDragging = true;
    termBar.style.cursor      = 'grabbing';
    terminal.style.transition = 'none';
    terminal.style.boxShadow  = '0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.1)';

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (!isFixed) {
      // Snapshot the terminal's current visual position (includes magnetic offset).
      // makeFixed() is deferred to the first actual mousemove so a plain click on
      // the term-bar never triggers the snap-to-fixed behaviour.
      pendingRect = terminal.getBoundingClientRect();
      dragOffsetX = clientX - pendingRect.left;
      dragOffsetY = clientY - pendingRect.top;
    } else {
      const rect = terminal.getBoundingClientRect();
      dragOffsetX = clientX - rect.left;
      dragOffsetY = clientY - rect.top;
    }

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup',  onDragEnd);
    document.addEventListener('touchend', onDragEnd);
  }

  function onDragMove(e) {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();

    // First actual movement: commit to fixed using the pre-snapshotted rect so
    // the terminal doesn't jump when the magnetic transform is cleared.
    if (pendingRect) {
      makeFixed(pendingRect);
      pendingRect = null;
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const maxX = window.innerWidth  - terminal.offsetWidth;
    const maxY = window.innerHeight - terminal.offsetHeight;
    terminal.style.left = Math.max(0, Math.min(maxX, clientX - dragOffsetX)) + 'px';
    terminal.style.top  = Math.max(0, Math.min(maxY, clientY - dragOffsetY)) + 'px';
  }

  function onDragEnd() {
    isDragging = false;
    pendingRect = null;
    termBar.style.cursor     = 'grab';
    terminal.style.boxShadow = '';
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('mouseup',  onDragEnd);
    document.removeEventListener('touchend', onDragEnd);
  }

  termBar.style.cursor     = 'grab';
  termBar.style.userSelect = 'none';
  termBar.addEventListener('mousedown',  onDragStart);
  termBar.addEventListener('touchstart', onDragStart, { passive: false });

  if (closeBtn) {
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isFixed) makeFixed();
      terminal.style.willChange  = 'opacity, transform';
      terminal.style.transition  = TRANSITION;
      terminal.style.opacity     = '0';
      terminal.style.transform   = 'scale(0.9) translateY(10px)';
      terminal.addEventListener('transitionend', () => {
        terminal.style.display   = 'none';
        terminal.style.willChange = '';
        showDockIcon();
      }, { once: true });
    });
  }

  function showDockIcon() {
    document.querySelector('.terminal-dock-btn')?.remove();
    const btn = document.createElement('button');
    btn.className = 'terminal-dock-btn';
    btn.setAttribute('aria-label', 'Restore terminal');
    btn.innerHTML = ICON_SVG;
    btn.addEventListener('click', () => {
      btn.remove();
      terminal.style.display    = '';
      terminal.style.willChange = 'opacity, transform';
      terminal.style.transition = 'none';
      terminal.style.opacity    = '0';
      terminal.style.transform  = 'scale(0.9) translateY(10px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          terminal.style.transition = TRANSITION;
          terminal.style.opacity    = '1';
          terminal.style.transform  = 'none';
          terminal.addEventListener('transitionend', () => {
            terminal.style.opacity    = '';
            terminal.style.transform  = '';
            terminal.style.transition = '';
            terminal.style.willChange = '';
          }, { once: true });
        });
      });
    });
    document.body.appendChild(btn);
  }
}
