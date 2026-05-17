/* ─────────────────────────────────────────
   main.js — Orquestrador (módulos carregados via defer no HTML)
   ───────────────────────────────────────── */

// All behavior is initialized in their own modules (navbar, scroll-reveal,
// counter, form, depoimentos). This file handles anything that needs
// cross-module coordination or global page state.

(function () {
  // Mark page as JS-enabled (for any CSS fallbacks)
  document.documentElement.classList.add('js');

  // Prevent flash of invisible content — force reveal after short delay
  // as a safety net if IntersectionObserver fires late.
  const safetyReveal = () => {
    const stuck = document.querySelectorAll('.reveal:not(.visible)');
    stuck.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('visible');
      }
    });
  };

  setTimeout(safetyReveal, 400);
  window.addEventListener('scroll', safetyReveal, { passive: true, once: true });
})();
