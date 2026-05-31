
'use strict';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const update = () =>
    navbar.classList.toggle('scrolled', window.scrollY > 60);

  update();
  window.addEventListener('scroll', update, { passive: true });
})();


(function initTheme() {
  const html   = document.documentElement;
  const btn    = $('#themeToggle');
  if (!btn) return;

 
  const saved  = localStorage.getItem('ecovision-theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const initial = saved || system;

  html.setAttribute('data-theme', initial);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ecovision-theme', next);
  });
})();


(function initMobileMenu() {
  const toggle = $('#navToggle');
  const menu   = $('#navMenu');
  if (!toggle || !menu) return;

  const open  = () => {
    toggle.classList.add('active');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    toggle.classList.remove('active');
    menu.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () =>
    menu.classList.contains('open') ? close() : open());


  $$('.nav-link', menu).forEach(l => l.addEventListener('click', close));

  
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) close();
  });


  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


(function initParallax() {
  const bg = $('.hero-bg');
  if (!bg) return;

  const mq = window.matchMedia('(min-width: 769px)');

  const run = () => {
    if (mq.matches)
      bg.style.transform = `translateY(${window.scrollY * 0.38}px)`;
  };

  window.addEventListener('scroll', run, { passive: true });
})();


(function initScrollReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();


(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  const update = () =>
    btn.classList.toggle('visible', window.scrollY > 400);

  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');

      if (id === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = $(id);
      if (!target) return;

      e.preventDefault();
      const offset = ($('#navbar')?.offsetHeight || 80);
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


(function initGalleryA11y() {
  $$('.gallery-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('keyboard-focus');
      }
    });

    card.addEventListener('blur', () =>
      card.classList.remove('keyboard-focus'));
  });
})();


console.log(
  '%c🌿 EcoVision%c iniciado com sucesso!',
  'color:#588157;font-weight:700;font-size:1.1rem;',
  'color:#A3B18A;font-size:1rem;'
);
