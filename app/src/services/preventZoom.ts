// ============================================================
// BLOQUEIO TOTAL DE ZOOM E COMPORTAMENTO NATIVO (STANDALONE)
// Trava pinch-to-zoom, double-tap zoom e gestos no mobile
// ============================================================

export function initMobileAntiZoomLock() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Bloqueia eventos de gesto do Safari/WebKit (iOS)
  const preventDefaultHandler = (e: Event) => {
    e.preventDefault();
  };

  document.addEventListener('gesturestart', preventDefaultHandler, { passive: false });
  document.addEventListener('gesturechange', preventDefaultHandler, { passive: false });
  document.addEventListener('gestureend', preventDefaultHandler, { passive: false });

  // 2. Bloqueia gesto de pinça multi-toque (pinch-to-zoom)
  document.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // 3. Bloqueia zoom por toque duplo rápido (double-tap to zoom)
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        // Se o elemento tocado não for input/textarea editável, previne o zoom
        const target = e.target as HTMLElement;
        const isEditable = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (!isEditable) {
          e.preventDefault();
        }
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  // 4. Bloqueia zoom por scroll do mouse com Ctrl (Desktop e Touchpad de laptops)
  document.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // 5. Bloqueia atalhos de zoom do teclado (Ctrl +, Ctrl -, Ctrl 0)
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault();
    }
  });
}
