/* ============================================================
   AVP ADVOGADOS — JAVASCRIPT COMPLETO
   Almeida, Vasconcelos & Pires Advogados Associados
   ============================================================ */

'use strict';

/* ============================================================
   INICIALIZAÇÃO — aguarda o DOM estar pronto
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initTestimonialCarousel();
    initCounters();
    initFormValidation();
    initBackToTop();
    initNavActiveState();
    setStaggerIndexes();
});

/* ============================================================
   1. TEMA CLARO/ESCURO COM PERSISTÊNCIA
   ============================================================ */
function initTheme() {
    const html       = document.documentElement;
    const toggle     = document.getElementById('themeToggle');
    const storageKey = 'avp-theme';

    // Lê preferência salva ou usa a preferência do sistema
    const saved     = localStorage.getItem(storageKey);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const current   = saved || preferred;

    html.setAttribute('data-theme', current);

    toggle?.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem(storageKey, next);
    });

    // Reage a mudança na preferência do sistema (sem salvar)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(storageKey)) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

/* ============================================================
   2. HEADER — comportamento no scroll
   ============================================================ */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    let ticking    = false;

    function onScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    // Estado inicial
    onScroll();
}

/* ============================================================
   3. MENU MOBILE — hambúrguer
   ============================================================ */
function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay    = document.getElementById('menuOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta a');

    if (!hamburger || !mobileMenu) return;

    function openMenu() {
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        overlay?.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        // Foca o primeiro link para acessibilidade
        const firstLink = mobileMenu.querySelector('.mobile-nav-link');
        setTimeout(() => firstLink?.focus(), 50);
    }

    function closeMenu() {
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        overlay?.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Fecha ao clicar no overlay
    overlay?.addEventListener('click', closeMenu);

    // Fecha ao clicar em qualquer link interno
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Fecha com Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
            closeMenu();
            hamburger.focus();
        }
    });
}

/* ============================================================
   4. SMOOTH SCROLL para âncoras
   ============================================================ */
function initSmoothScroll() {
    const headerHeight = () => document.getElementById('header')?.offsetHeight || 76;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight();

            window.scrollTo({ top, behavior: 'smooth' });

            // Foca o elemento para acessibilidade (se tiver tabindex ou for focável)
            setTimeout(() => {
                if (target.getAttribute('tabindex') !== null || target.matches('h1,h2,h3,button,a,input')) {
                    target.focus({ preventScroll: true });
                }
            }, 600);
        });
    });
}

/* ============================================================
   5. ANIMAÇÕES DE ENTRADA — IntersectionObserver
   ============================================================ */
function initScrollAnimations() {
    // Ativa o hero imediatamente
    document.querySelectorAll('.animate-in').forEach(el => {
        requestAnimationFrame(() => el.classList.add('is-visible'));
    });

    // Scroll reveal para o restante do conteúdo
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* Define índices de stagger para delays CSS */
function setStaggerIndexes() {
    const groups = [
        '.areas-grid .area-card',
        '.stats-grid .stat-item',
        '.partners-grid .partner-card',
        '.blog-grid .blog-card',
        '.cases-highlights .highlight-item',
    ];

    groups.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.style.setProperty('--i', i);
        });
    });
}

/* ============================================================
   6. CARROSSEL DE DEPOIMENTOS
   ============================================================ */
function initTestimonialCarousel() {
    const slides   = document.querySelectorAll('.testimonial-slide');
    const dotsWrap = document.getElementById('carouselDots');
    const prevBtn  = document.getElementById('carouselPrev');
    const nextBtn  = document.getElementById('carouselNext');

    if (!slides.length || !dotsWrap) return;

    let current     = 0;
    let autoplayId  = null;
    const total     = slides.length;
    const AUTOPLAY  = 6000; // 6 segundos

    // Cria os pontos de navegação
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.setAttribute('aria-label', `Depoimento ${i + 1} de ${total}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.carousel-dot');

    function goTo(index) {
        // Desativa slide atual
        slides[current].classList.remove('active');
        slides[current].setAttribute('aria-hidden', 'true');
        dots[current].classList.remove('active');
        dots[current].setAttribute('aria-selected', 'false');

        // Ativa novo slide
        current = (index + total) % total;
        slides[current].classList.add('active');
        slides[current].setAttribute('aria-hidden', 'false');
        dots[current].classList.add('active');
        dots[current].setAttribute('aria-selected', 'true');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    nextBtn?.addEventListener('click', () => { resetAutoplay(); next(); });
    prevBtn?.addEventListener('click', () => { resetAutoplay(); prev(); });

    // Teclado: setas dentro do carrossel
    document.getElementById('testimonialCarousel')?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { resetAutoplay(); next(); }
        if (e.key === 'ArrowLeft')  { resetAutoplay(); prev(); }
    });

    // Autoplay
    function startAutoplay() {
        autoplayId = setInterval(next, AUTOPLAY);
    }

    function resetAutoplay() {
        clearInterval(autoplayId);
        startAutoplay();
    }

    // Pausa autoplay quando o mouse está sobre o carrossel
    const carouselWrap = document.querySelector('.carousel-wrap');
    carouselWrap?.addEventListener('mouseenter', () => clearInterval(autoplayId));
    carouselWrap?.addEventListener('mouseleave', startAutoplay);

    // Pausa quando a aba não está visível
    document.addEventListener('visibilitychange', () => {
        document.hidden ? clearInterval(autoplayId) : startAutoplay();
    });

    startAutoplay();
}

/* ============================================================
   7. CONTADORES ANIMADOS
   ============================================================ */
function initCounters() {
    const statItems = document.querySelectorAll('.stat-item');
    if (!statItems.length) return;

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const statEl    = entry.target.querySelector('[data-target]');
                if (!statEl) return;

                const target    = parseInt(statEl.dataset.target, 10);
                const suffix    = statEl.dataset.suffix || '';
                const counter   = statEl.querySelector('.counter');
                const suffixEl  = statEl.querySelector('.stat-suffix');

                if (!counter) return;

                animateCounter(counter, target, suffix, suffixEl);
                counterObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.5 }
    );

    statItems.forEach(item => counterObserver.observe(item));
}

function animateCounter(el, target, suffix, suffixEl) {
    const duration = 1800; // ms
    const startTime = performance.now();
    const startValue = 0;

    // Escolhe o easing baseado no tamanho do número
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOutExpo(progress);
        const current  = Math.round(startValue + (target - startValue) * eased);

        // Formata com ponto para milhares
        el.textContent = current >= 1000
            ? current.toLocaleString('pt-BR')
            : current;

        if (suffixEl) suffixEl.textContent = suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target >= 1000
                ? target.toLocaleString('pt-BR')
                : target;
        }
    }

    requestAnimationFrame(update);
}

/* ============================================================
   8. VALIDAÇÃO DE FORMULÁRIO EM TEMPO REAL
   ============================================================ */
function initFormValidation() {
    const form      = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const success   = document.getElementById('formSuccess');

    if (!form) return;

    // Regras de validação por campo
    const rules = {
        nome: {
            test: v => v.trim().length >= 3,
            msg:  'Informe seu nome completo (mínimo 3 caracteres).',
        },
        email: {
            test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            msg:  'Informe um e-mail válido.',
        },
        telefone: {
            test: v => v.replace(/\D/g, '').length >= 10,
            msg:  'Informe um telefone com DDD (mínimo 10 dígitos).',
        },
        area: {
            test: v => v !== '',
            msg:  'Selecione uma área de interesse.',
        },
        mensagem: {
            test: v => v.trim().length >= 20,
            msg:  'Descreva sua necessidade (mínimo 20 caracteres).',
        },
        lgpd: {
            test: (_, el) => el.checked,
            msg:  'Você precisa aceitar a Política de Privacidade.',
        },
    };

    // Valida um campo individualmente
    function validateField(name) {
        const el      = form.elements[name];
        const errorEl = document.getElementById(`${name}-error`);
        if (!el || !errorEl || !rules[name]) return true;

        const isValid = rules[name].test(el.value, el);

        if (isValid) {
            el.classList.remove('error');
            errorEl.textContent = '';
            return true;
        } else {
            el.classList.add('error');
            errorEl.textContent = rules[name].msg;
            return false;
        }
    }

    // Evento de validação em tempo real (blur + input)
    Object.keys(rules).forEach(name => {
        const el = form.elements[name];
        if (!el) return;

        // Valida ao sair do campo
        el.addEventListener('blur', () => validateField(name));

        // Limpa erro enquanto digita/seleciona
        el.addEventListener('input', () => {
            if (el.classList.contains('error')) {
                validateField(name);
            }
        });

        el.addEventListener('change', () => {
            if (el.classList.contains('error') || el.type === 'checkbox' || el.tagName === 'SELECT') {
                validateField(name);
            }
        });
    });

    // Contador de caracteres para a textarea
    const textarea  = form.elements['mensagem'];
    const charCount = document.getElementById('charCount');
    const MAX_CHARS = 500;

    if (textarea && charCount) {
        textarea.setAttribute('maxlength', MAX_CHARS);

        textarea.addEventListener('input', () => {
            const len = textarea.value.length;
            charCount.textContent = `${len} / ${MAX_CHARS} caracteres`;
            charCount.style.color = len > MAX_CHARS * 0.85 ? 'var(--gold-dark)' : '';
        });
    }

    // Máscara simples de telefone
    const telInput = form.elements['telefone'];
    if (telInput) {
        telInput.addEventListener('input', () => {
            let v = telInput.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 6) {
                v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
            } else if (v.length > 2) {
                v = `(${v.slice(0,2)}) ${v.slice(2)}`;
            }
            telInput.value = v;
        });
    }

    // Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Valida todos os campos
        const allValid = Object.keys(rules).map(validateField).every(Boolean);
        if (!allValid) {
            // Foca o primeiro campo com erro
            const firstError = form.querySelector('.error');
            firstError?.focus();
            return;
        }

        // Simula envio (substituir por fetch real para o backend)
        submitBtn.classList.add('is-loading');

        try {
            await simulateFormSubmit();

            // Exibe sucesso
            form.style.display = 'none';
            if (success) {
                success.setAttribute('aria-hidden', 'false');
                success.classList.add('is-visible');
                success.focus();
            }
        } catch (err) {
            // Em caso de erro real, exibir mensagem de falha
            submitBtn.classList.remove('is-loading');
            alert('Ocorreu um erro ao enviar. Por favor, tente novamente ou ligue para nosso escritório.');
        }
    });
}

/* Simula um delay de envio (substituir por fetch() real) */
function simulateFormSubmit() {
    return new Promise(resolve => setTimeout(resolve, 1800));
}

/* ============================================================
   9. BOTÃO VOLTAR AO TOPO
   ============================================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    function checkVisibility() {
        if (window.scrollY > 400) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    checkVisibility();
}

/* ============================================================
   10. NAVEGAÇÃO ATIVA — destaca o link da seção visível
   ============================================================ */
function initNavActiveState() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const headerH = () => document.getElementById('header')?.offsetHeight || 76;

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href')?.replace('#', '');
                    link.classList.toggle('active', href === id);
                });
            });
        },
        {
            rootMargin: `-${headerH()}px 0px -55% 0px`,
            threshold: 0,
        }
    );

    sections.forEach(section => sectionObserver.observe(section));
}
