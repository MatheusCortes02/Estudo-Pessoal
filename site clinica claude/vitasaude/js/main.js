// VitaSaúde — main.js
// Vanilla ES2022. Zero dependencies.

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ------------------------------------------------------------------
   Navbar: encolhe + ganha blur ao rolar
   ------------------------------------------------------------------ */
const navbar = document.getElementById('navbar');

const handleNavbarScroll = () => {
  navbar.classList.toggle('is-scrolled', window.scrollY > 48);
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();


/* ------------------------------------------------------------------
   Mobile menu: toggle com animação de hamburguer → X
   ------------------------------------------------------------------ */
const toggle     = document.querySelector('.navbar__toggle');
const mobileMenu = document.getElementById('mobile-menu');
const bars       = toggle?.querySelectorAll('.toggle-bar');

const openMenu = () => {
  toggle.setAttribute('aria-expanded', 'true');
  mobileMenu.hidden = false;
  if (bars) {
    bars[0].style.transform = 'translateY(3px) rotate(45deg)';
    bars[1].style.transform = 'translateY(-3px) rotate(-45deg)';
  }
};

const closeMenu = () => {
  toggle.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  if (bars) {
    bars[0].style.transform = '';
    bars[1].style.transform = '';
  }
};

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  isOpen ? closeMenu() : openMenu();
});

mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});


/* ------------------------------------------------------------------
   Scroll reveal: IntersectionObserver
   ------------------------------------------------------------------ */
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}


/* ------------------------------------------------------------------
   Contador animado: dispara ao entrar no viewport
   Elementos: [data-count="5000"] [data-start="0"] [data-suffix="+"]
   ------------------------------------------------------------------ */
const counterEls = document.querySelectorAll('[data-count]');

const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

const animateCounter = (el) => {
  const target  = parseInt(el.dataset.count, 10);
  const start   = parseInt(el.dataset.start ?? '0', 10);
  const suffix  = el.dataset.suffix ?? '';
  const duration = Math.min(1800, Math.max(800, target * 0.35));

  const startTime = performance.now();

  const tick = (now) => {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(start + easeOutCubic(progress) * (target - start));

    el.textContent = value.toLocaleString('pt-BR') + (progress >= 1 ? suffix : '');

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (prefersReducedMotion) {
  counterEls.forEach(el => {
    const target = el.dataset.count;
    const suffix = el.dataset.suffix ?? '';
    el.textContent = Number(target).toLocaleString('pt-BR') + suffix;
  });
} else if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  counterEls.forEach(el => counterObserver.observe(el));
}


/* ------------------------------------------------------------------
   FAQ: fecha outros itens ao abrir um (accordion behavior)
   Native <details> já abre/fecha — apenas garantimos um aberto por vez
   ------------------------------------------------------------------ */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach(other => {
      if (other !== item && other.open) other.open = false;
    });
  });
});


/* ------------------------------------------------------------------
   Smooth scroll: ancora nos links internos
   (CSS scroll-behavior: smooth já cobre, mas garante fallback)
   ------------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar?.offsetHeight ?? 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
