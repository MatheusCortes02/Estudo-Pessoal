/* ─────────────────────────────────────────
   depoimentos.js — Carrossel mobile com dots
   ───────────────────────────────────────── */

(function () {
  const grid = document.querySelector('.testimonials__grid');
  const dotsContainer = document.querySelector('.carousel-dots');
  const cards = document.querySelectorAll('.testimonials__card-wrap');

  if (!grid || !cards.length) return;

  let current = 0;
  const total = cards.length;

  // Only activate carousel on mobile
  const isMobile = () => window.innerWidth < 768;

  const goTo = (index) => {
    current = (index + total) % total;
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  };

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', `Depoimento ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(btn);
    });
  };

  const activateMobile = () => {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === 0);
    });
    buildDots();
    current = 0;
  };

  const deactivateMobile = () => {
    cards.forEach((card) => card.classList.add('active'));
    if (dotsContainer) dotsContainer.innerHTML = '';
  };

  const init = () => {
    if (isMobile()) {
      activateMobile();
    } else {
      deactivateMobile();
    }
  };

  init();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });

  // Touch swipe support
  let startX = 0;
  grid.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', (e) => {
    if (!isMobile()) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  });
})();
