/**
 * EcoVision — script.js
 * Portfólio Fotográfico Ambiental | IHC Project
 *
 * Funcionalidades:
 *  - Navbar com blur/cor ao scroll
 *  - Parallax suave no hero
 *  - Reveal animado ao scroll (IntersectionObserver)
 *  - Botão "voltar ao topo"
 *  - Menu hamburguer responsivo
 *  - Scroll suave para âncoras
 *  - Feedback do formulário de contato
 */

'use strict';

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

/** Seleciona elemento(s) com segurança */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ============================================================
   NAVBAR — mudança ao scroll
   ============================================================ */
(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 60; // px até ativar o estado scrolled

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Verificação inicial (caso página carregue com scroll)
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ============================================================
   MENU HAMBURGUER (mobile)
   ============================================================ */
(function initMobileMenu() {
  const toggle = $('#navToggle');
  const menu   = $('#navMenu');
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.classList.remove('active');
    menu.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    toggle.classList.add('active');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden'; // evita scroll enquanto menu aberto
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Fechar ao clicar em um link
  $$('.nav-link', menu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fechar ao clicar fora do menu
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ============================================================
   PARALLAX HERO
   ============================================================ */
(function initParallax() {
  const heroBg = $('.hero-bg');
  if (!heroBg) return;

  // Parallax desativado em mobile (performance)
  const mq = window.matchMedia('(min-width: 769px)');

  function handleParallax() {
    if (!mq.matches) return;
    const scrolled = window.scrollY;
    // Move o fundo a 40% da velocidade do scroll
    heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
  }

  window.addEventListener('scroll', handleParallax, { passive: true });
})();


/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Para de observar após revelar (performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,      // 12% visível já aciona
      rootMargin: '0px 0px -40px 0px', // margem de antecipação
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   BOTÃO VOLTAR AO TOPO
   ============================================================ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  const SHOW_THRESHOLD = 400; // px de scroll para mostrar o botão

  function onScroll() {
    if (window.scrollY > SHOW_THRESHOLD) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // verificação inicial
})();


/* ============================================================
   SCROLL SUAVE PARA ÂNCORAS
   ============================================================ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarH = $('#navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   GALERIA — destaque de card ao abrir pelo teclado
   ============================================================ */


/* ============================================================
   CARDS DA GALERIA — acessibilidade com teclado
   ============================================================ */
(function initGalleryA11y() {
  $$('.gallery-card').forEach(card => {
    // Permite foco via teclado
    card.setAttribute('tabindex', '0');

    // Ativa hover via teclado (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('keyboard-focus');
      }
    });
  });
})();


/* ============================================================
   ANIMAÇÃO DE COUNTERS (opcional, caso adicione stats)
   ============================================================ */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Easing out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* Expõe para uso externo caso necessário */
window.EcoVision = { animateCounter };


/* ============================================================
   LOG DE INICIALIZAÇÃO (debug amigável)
   ============================================================ */
console.log(
  '%c🌿 EcoVision%c carregado com sucesso!',
  'color: #588157; font-weight: bold; font-size: 1.1rem;',
  'color: #A3B18A; font-size: 1rem;'
);