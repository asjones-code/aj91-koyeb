const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32"><path fill="currentColor" d="M30.475 22.86h-4.57v-1.53h1.52v-1.52H4.575v1.52H6.1v1.53H1.525V32h28.95Zm-22.86-1.53h16.76v1.53H7.615Zm21.34 9.15H3.045v-6.1h25.91Zm-1.53-28.96h1.53v18.29h-1.53Z"/><path fill="currentColor" d="M18.285 25.9h7.62v1.53h-7.62Zm0-15.23h1.52v1.52h-1.52Zm0-3.05h1.52v1.52h-1.52Zm-4.57 4.57h4.57v1.52h-4.57Zm-1.53-1.52h1.53v1.52h-1.53Zm0-3.05h1.53v1.52h-1.53Z"/><path fill="currentColor" d="M6.1 18.29h19.81V3.05H6.1ZM7.615 4.57h16.76v12.19H7.615ZM6.095 25.9h3.05v3.05h-3.05ZM4.575 0h22.85v1.52H4.575Zm-1.53 1.52h1.53v18.29h-1.53Z"/></svg>`;

export function initTerminalUI() {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  const termBar = terminal.querySelector('.term-bar');
  const closeBtn = terminal.querySelector('.term-btn.close');
  if (!termBar) return;

  let isFixed = false;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function makeFixed() {
    if (isFixed) return;
    // GSAP leaves filter/transform inline styles on animated ancestors after fade-in.
    // Both create stacking contexts that make position:fixed relative to the ancestor
    // instead of the viewport, causing the terminal to jump off-screen.
    // Clear them before reading getBoundingClientRect so coords are viewport-relative.
    let ancestor = terminal.parentElement;
    while (ancestor && ancestor !== document.body) {
      const s = ancestor.style;
      if (s.filter !== undefined) s.filter = '';
      if (s.transform !== undefined) s.transform = '';
      if (s.willChange !== undefined) s.willChange = '';
      ancestor = ancestor.parentElement;
    }
    const rect = terminal.getBoundingClientRect();
    terminal.style.position = 'fixed';
    terminal.style.left = rect.left + 'px';
    terminal.style.top = rect.top + 'px';
    terminal.style.width = rect.width + 'px';
    terminal.style.height = rect.height + 'px';
    terminal.style.margin = '0';
    terminal.style.zIndex = '50';
    isFixed = true;
  }

  function onDragStart(e) {
    if (e.target.classList.contains('term-btn')) return;
    e.preventDefault();
    if (!isFixed) makeFixed();

    isDragging = true;
    termBar.style.cursor = 'grabbing';
    terminal.style.transition = 'none';
    terminal.style.boxShadow = '0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.1)';

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = terminal.getBoundingClientRect();
    dragOffsetX = clientX - rect.left;
    dragOffsetY = clientY - rect.top;

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
  }

  function onDragMove(e) {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const maxX = window.innerWidth - terminal.offsetWidth;
    const maxY = window.innerHeight - terminal.offsetHeight;
    terminal.style.left = Math.max(0, Math.min(maxX, clientX - dragOffsetX)) + 'px';
    terminal.style.top  = Math.max(0, Math.min(maxY, clientY - dragOffsetY)) + 'px';
  }

  function onDragEnd() {
    isDragging = false;
    termBar.style.cursor = 'grab';
    terminal.style.boxShadow = '';
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchend', onDragEnd);
  }

  termBar.style.cursor = 'grab';
  termBar.style.userSelect = 'none';
  termBar.addEventListener('mousedown', onDragStart);
  termBar.addEventListener('touchstart', onDragStart, { passive: false });

  // Close button → hide terminal, show minimised dock icon
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isFixed) makeFixed();
      terminal.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      terminal.style.opacity = '0';
      terminal.style.transform = 'scale(0.94)';
      setTimeout(() => {
        terminal.style.display = 'none';
        showDockIcon();
      }, 250);
    });
  }

  function showDockIcon() {
    const btn = document.createElement('button');
    btn.className = 'terminal-dock-btn';
    btn.setAttribute('aria-label', 'Restore terminal');
    btn.innerHTML = ICON_SVG;
    btn.addEventListener('click', () => {
      btn.remove();
      terminal.style.display = '';
      terminal.style.opacity = '0';
      terminal.style.transform = 'scale(0.94)';
      terminal.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          terminal.style.opacity = '';
          terminal.style.transform = '';
          setTimeout(() => { terminal.style.transition = ''; }, 260);
        });
      });
    });
    document.body.appendChild(btn);
  }
}
