(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky nav shadow on scroll
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Close mobile menu when a link is clicked
  var navToggle = document.getElementById('nav-toggle');
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navToggle) navToggle.checked = false;
    });
  });

  // "Mais" dropdown — clique abre/fecha (funciona em touch e desktop);
  // hover continua funcionando via CSS em telas largas.
  document.querySelectorAll('.has-dropdown > .dropdown-toggle').forEach(function (toggle) {
    var item = toggle.parentElement;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        var t = item.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Modal genérico (ex.: detalhes da promoção) — data-modal-open="id" abre, data-modal-close fecha
  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var overlay = document.getElementById(btn.getAttribute('data-modal-open'));
      if (overlay) { overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    });
  });
  document.querySelectorAll('.oc-modal-overlay').forEach(function (overlay) {
    function closeModal() { overlay.classList.remove('is-open'); document.body.style.overflow = ''; }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    overlay.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
  });

  // Livro 3D — "O Céu Me Contou" abre, folheia e fecha.
  // `turned` = quantas folhas já viraram. 0 = fechado (vê-se a capa);
  // LAST = última página de conteúdo. Cada folha vira em torno da lombada.
  document.querySelectorAll('.book3d-wrap').forEach(function (root) {
    var stage = root.querySelector('.book3d-stage');
    var book = root.querySelector('.book3d');
    var leaves = Array.prototype.slice.call(root.querySelectorAll('.leaf'));
    var label = root.querySelector('[data-book="label"]');
    var prevBtn = root.querySelector('[data-book="prev"]');
    var nextBtn = root.querySelector('[data-book="next"]');
    if (!stage || !book || !leaves.length) return;

    var TOTAL = leaves.length;
    var LAST = TOTAL - 1;      // após virar a última folha só restaria a contracapa
    var THICKNESS = 0.7;       // px de "papel" por folha, separa os planos em 3D
    var LABELS = ['Capa', 'Folha de rosto', 'Sol · Câncer', 'Júpiter · Aquário', 'Ascendente · Áries'];

    var turned = 0;
    var timer = null;
    var paused = false;

    function apply(delayFor) {
      leaves.forEach(function (leaf, i) {
        var flipped = i < turned;
        // folhas viradas empilham à esquerda (a última a virar por cima);
        // as demais empilham à direita (a próxima a virar por cima)
        var lift = (flipped ? i + 1 : TOTAL - i) * THICKNESS;
        leaf.style.transitionDelay = (delayFor ? delayFor(i) : 0) + 'ms';
        leaf.style.setProperty('--rot', flipped ? '-180deg' : '0deg');
        leaf.style.setProperty('--lift', lift + 'px');
        leaf.style.zIndex = String(flipped ? i + 1 : TOTAL - i);
      });
      book.classList.toggle('is-open', turned > 0);
      stage.classList.toggle('is-open', turned > 0);   // a aura acompanha a largura do livro
      if (label) label.textContent = LABELS[turned] || '';
      if (prevBtn) prevBtn.disabled = turned === 0;
      if (nextBtn) nextBtn.disabled = turned === LAST;
    }

    function goTo(target) {
      target = Math.max(0, Math.min(LAST, target));
      if (target === turned) return;
      var from = turned;
      var closing = target < turned;
      turned = target;
      // ao fechar, as folhas caem em sequência (a de cima primeiro)
      apply(closing ? function (i) { return Math.max(0, from - 1 - i) * 80; } : null);
    }

    function stop() { if (timer) { clearTimeout(timer); timer = null; } }

    function schedule() {
      stop();
      if (reduceMotion || paused) return;
      // pausa mais longa no fim, antes de fechar o livro
      timer = setTimeout(function () {
        goTo(turned >= LAST ? 0 : turned + 1);
        schedule();
      }, turned >= LAST ? 3600 : 2700);
    }

    // partículas douradas flutuando ao redor do livro
    function buildSparks() {
      if (reduceMotion) return;

      function layer(className, count, keepClear) {
        var box = document.createElement('div');
        box.className = className;
        box.setAttribute('aria-hidden', 'true');
        for (var i = 0; i < count; i++) {
          var s = document.createElement('span');
          s.className = 'spark' + (Math.random() < 0.38 ? ' star' : '');
          // a camada da frente evita o miolo, onde fica o texto das páginas
          var x = keepClear
            ? (Math.random() < 0.5 ? Math.random() * 19 : 81 + Math.random() * 19)
            : Math.random() * 100;
          s.style.left = x.toFixed(2) + '%';
          s.style.top = (Math.random() * 100).toFixed(2) + '%';
          s.style.setProperty('--size', (keepClear ? 3 + Math.random() * 4 : 3 + Math.random() * 6).toFixed(1) + 'px');
          s.style.setProperty('--dur', (3.8 + Math.random() * 3.6).toFixed(2) + 's');
          s.style.setProperty('--delay', (Math.random() * 6).toFixed(2) + 's');
          box.appendChild(s);
        }
        stage.appendChild(box);
      }

      layer('book-sparks', 22, false);
      layer('book-sparks front', 9, true);
    }

    buildSparks();
    apply(null);

    stage.addEventListener('click', function () {
      goTo(turned >= LAST ? 0 : turned + 1);
      schedule();
    });

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goTo(turned >= LAST ? 0 : turned + 1);
        schedule();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(turned - 1);
        schedule();
      }
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(turned - 1); schedule(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(turned + 1); schedule(); });

    // só anima enquanto o livro estiver visível na tela
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        paused = !entries[0].isIntersecting;
        if (paused) stop(); else schedule();
      }, { threshold: 0.25 }).observe(stage);
    } else {
      schedule();
    }
  });

  if (reduceMotion) return;

  // Scroll-reveal for content blocks
  var selectors = [
    '.quick-card', '.article-card', '.mod-card', '.course-card',
    '.timeline-item', '.agenda-item', '.faq-item', '.card',
    '.contact-card', '.about-lead', '.course-feature', '.book-hero',
    '.oc-feature-card'
  ];
  var targets = document.querySelectorAll(selectors.join(','));

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (Math.min(i % 3, 2) * 0.08) + 's';
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('reveal-visible'); });
  }
})();
