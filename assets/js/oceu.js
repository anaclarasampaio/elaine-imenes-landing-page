/* O Céu Me Contou — animações da página.
   Céu em canvas, livro com StPageFlip e animações de rolagem com GSAP.
   Tudo degrada bem: sem as bibliotecas, ou com movimento reduzido,
   o conteúdo continua visível e o livro vira uma sequência de páginas. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ── Céu estrelado em canvas, com parallax do mouse e estrelas cadentes ── */
  function initSky() {
    var canvas = document.querySelector('.oc2-sky');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [], meteors = [], w = 0, h = 0;
    var mx = 0, my = 0, tx = 0, ty = 0;
    var visible = true;

    function resize() {
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round((w * h) / 5200);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.3 + .3,
          z: Math.random() * .9 + .1,
          p: Math.random() * Math.PI * 2,
          s: Math.random() * .02 + .005,
          warm: Math.random() < .25
        });
      }
    }

    function spawnMeteor() {
      meteors.push({ x: Math.random() * w * .8 + w * .2, y: Math.random() * h * .35, life: 0, len: 120 + Math.random() * 80 });
    }

    function frame() {
      if (!visible) { requestAnimationFrame(frame); return; }
      tx += (mx - tx) * .05; ty += (my - ty) * .05;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.p += s.s;
        var a = .35 + Math.sin(s.p) * .35 + .3 * s.z;
        var x = s.x + tx * s.z * 24, y = s.y + ty * s.z * 24;
        ctx.beginPath();
        ctx.arc(x, y, s.r * (s.z + .4), 0, Math.PI * 2);
        ctx.fillStyle = s.warm ? 'rgba(244,226,176,' + a + ')' : 'rgba(255,248,230,' + a + ')';
        ctx.fill();
      }
      if (!reduceMotion && Math.random() < .006 && meteors.length < 2) spawnMeteor();
      for (var j = meteors.length - 1; j >= 0; j--) {
        var m = meteors[j];
        m.life += 1;
        var k = m.life / 60;
        var mxp = m.x - k * 320, myp = m.y + k * 180;
        var grad = ctx.createLinearGradient(mxp, myp, mxp + m.len, myp - m.len * .56);
        grad.addColorStop(0, 'rgba(255,248,230,' + (1 - k) + ')');
        grad.addColorStop(1, 'rgba(255,248,230,0)');
        ctx.strokeStyle = grad; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(mxp, myp); ctx.lineTo(mxp + m.len, myp - m.len * .56); ctx.stroke();
        if (m.life > 60) meteors.splice(j, 1);
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5;
      my = (e.clientY - r.top) / r.height - .5;
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);
    }
    if (reduceMotion) { frame(); visible = false; } else { requestAnimationFrame(frame); }
  }

  /* ── Rastro de brilho do cursor no hero ── */
  function initCursorTrail() {
    var hero = document.querySelector('.oc2-hero');
    if (!hero || reduceMotion || !finePointer) return;
    var last = 0;
    hero.addEventListener('mousemove', function (e) {
      var now = performance.now();
      if (now - last < 45) return;
      last = now;
      var r = hero.getBoundingClientRect();
      var dot = document.createElement('span');
      dot.className = 'oc2-trail-dot';
      var size = 4 + Math.random() * 6;
      dot.style.width = dot.style.height = size + 'px';
      dot.style.left = (e.clientX - r.left) + 'px';
      dot.style.top = (e.clientY - r.top) + 'px';
      hero.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 900);
    });
  }

  /* ── Livro 3D para folhear ──
     Cada folha é uma corrente de fatias verticais: ao virar, a folha gira na
     lombada e as fatias se curvam aos poucos, como papel de verdade. A capa é
     dura e não curva. As páginas passam sozinhas; ao clicar, o livro obedece e
     a passagem automática volta depois de alguns segundos parado. */
  var BOOK_IMG = 'assets/img/livro/';
  var LEAVES = [
    { f: 'capa',    b: 'guarda',     hard: true },
    { f: 'rosto',   b: 'sol' },
    { f: 'cancer',  b: 'jupiter' },
    { f: 'aquario', b: 'ascendente' },
    { f: 'aries',   b: 'guarda' }
  ];
  var LABELS = ['Capa', 'Guarda e folha de rosto', 'Sol e Câncer', 'Júpiter e Aquário', 'Ascendente e Áries', 'Fim do livro'];
  var SLICES = 10, GAP = 1.4, STACK = 10, TURN_MS = 1400, WAIT_MS = 3200;

  function easeInOut(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function initBook3d() {
    var scene = document.getElementById('book3d');
    if (!scene) return;
    var book = scene.querySelector('.b3-book');

    var pw = 0, ph = 0;
    var leaves = LEAVES.map(function (cfg, i) {
      var el = document.createElement('div');
      el.className = 'b3-leaf' + (cfg.hard ? ' b3-leaf--hard' : '');
      var parent = el, slices = [];
      for (var k = 0; k < SLICES; k++) {
        var sl = document.createElement('div');
        sl.className = 'b3-slice';
        var front = document.createElement('div');
        front.className = 'b3-face b3-face--front' + (k === 0 ? ' is-gutter' : '');
        front.style.backgroundImage = 'url(' + BOOK_IMG + cfg.f + '.jpg)';
        var back = document.createElement('div');
        back.className = 'b3-face b3-face--back' + (k === 0 ? ' is-gutter' : '');
        back.style.backgroundImage = 'url(' + BOOK_IMG + cfg.b + '.jpg)';
        sl.appendChild(front); sl.appendChild(back);
        parent.appendChild(sl); parent = sl; slices.push({ el: sl, front: front, back: back });
      }
      // faces inteiras para quando a folha está parada (sem emendas entre as fatias)
      ['front', 'back'].forEach(function (side) {
        var flat = document.createElement('div');
        flat.className = 'b3-face b3-flat b3-face--' + side + ' is-gutter';
        flat.style.backgroundImage = 'url(' + BOOK_IMG + (side === 'front' ? cfg.f : cfg.b) + '.jpg)';
        el.appendChild(flat);
      });
      book.appendChild(el);
      return { el: el, slices: slices, hard: !!cfg.hard, p: 0, index: i };
    });

    function layout() {
      var avail = scene.clientWidth;
      var narrow = avail < 600;
      // no celular o livro aberto ocupa a largura toda
      pw = Math.max(130, Math.min(380, (avail - (narrow ? 6 : 30)) / 2));
      ph = Math.round(pw * 660 / 520);
      book.style.setProperty('--pw', pw + 'px');
      book.style.setProperty('--ph', ph + 'px');
      book.style.setProperty('--stack', STACK + 'px');
      book.style.setProperty('--cover-z', (STACK + leaves.length * GAP + .6) + 'px');
      scene.style.height = Math.round(ph * (narrow ? .98 : .92) + (narrow ? 40 : 70)) + 'px';
      var sw = pw / SLICES;
      leaves.forEach(function (leaf) {
        leaf.slices.forEach(function (s, k) {
          s.el.style.width = (sw + 1.5) + 'px';
          s.el.style.left = (k === 0 ? 0 : sw) + 'px';
          var size = pw + 'px ' + ph + 'px';
          s.front.style.backgroundSize = size;
          s.back.style.backgroundSize = size;
          s.front.style.backgroundPosition = (-k * sw) + 'px 0';
          s.back.style.backgroundPosition = (-(SLICES - 1 - k) * sw) + 'px 0';
        });
        render(leaf);
      });
      placeBook(false);
    }

    function render(leaf) {
      var p = leaf.p, n = leaves.length;
      var zr = STACK + (n - leaf.index) * GAP;
      // a capa aberta deita na mesa, por baixo do bloco de páginas da esquerda
      var zl = leaf.hard ? .5 : STACK + (leaf.index + 1) * GAP;
      var z = zr * (1 - p) - zl * p;
      var lift = Math.sin(p * Math.PI);
      leaf.el.style.transform = 'rotateY(' + (-180 * p) + 'deg) translateZ(' + z + 'px)';
      var bend = leaf.hard ? 0 : lift * 5.2 * (1 - .35 * p);
      for (var k = 1; k < leaf.slices.length; k++) {
        leaf.slices[k].el.style.transform = 'rotateY(' + bend + 'deg)';
      }
      leaf.el.style.setProperty('--shade', (lift * .38).toFixed(3));
    }

    var current = 0, busy = false, queue = [];

    function placeBook(animate) {
      var x = current === 0 ? -pw / 2 : 0;
      book.style.transition = animate ? 'transform 1s cubic-bezier(.6,.05,.3,1)' : 'none';
      book.style.setProperty('--shift', x + 'px');
      // Lombada (só com o livro fechado) e bloco de páginas da esquerda (só aberto).
      // São ligados por classes com um pequeno atraso, sem depender de transições:
      // assim funciona igual no Safari do iPhone, que não esconde peças 3D por opacidade.
      book.classList.toggle('is-closed', current === 0);
      clearTimeout(book._b3t);
      if (current === 0) {
        book.classList.remove('stack-on');
        if (animate) book._b3t = setTimeout(function () { if (current === 0) book.classList.add('spine-on'); }, 600);
        else book.classList.add('spine-on');
      } else {
        book.classList.remove('spine-on');
        if (animate && !book.classList.contains('stack-on')) book._b3t = setTimeout(function () { if (current > 0) book.classList.add('stack-on'); }, 1000);
        else book.classList.add('stack-on');
      }
    }

    function updateUi() {
      scene.setAttribute('aria-valuetext', LABELS[current]);
    }

    function turn(leaf, to, ms, done) {
      var from = leaf.p, t0 = performance.now();
      leaf.el.classList.add('is-turning');
      function step(now) {
        var x = Math.min(1, (now - t0) / ms);
        leaf.p = from + (to - from) * easeInOut(x);
        render(leaf);
        if (x < 1) requestAnimationFrame(step);
        else { leaf.el.classList.remove('is-turning'); done && done(); }
      }
      requestAnimationFrame(step);
    }

    function go(dir, fast) {
      if (busy) { if (queue.length < 2) queue.push(dir); return; }
      var target = current + dir;
      if (target < 0 || target > leaves.length) return;
      busy = true;
      var leaf = dir > 0 ? leaves[current] : leaves[current - 1];
      current = target;
      updateUi();
      placeBook(true);
      turn(leaf, dir > 0 ? 1 : 0, fast ? 520 : (reduceMotion ? 1 : TURN_MS), function () {
        busy = false;
        if (queue.length) go(queue.shift(), fast);
      });
    }

    // fecha o livro folha por folha, de trás para frente, para recomeçar
    function closeBook(done) {
      var i = current;
      function next() {
        if (i === 0) { busy = false; done && done(); return; }
        i--;
        var leaf = leaves[i];
        current = i; updateUi(); placeBook(true);
        turn(leaf, 0, 620, function () { setTimeout(next, 60); });
      }
      busy = true;
      next();
    }

    // passagem automática
    var playing = !reduceMotion, inView = false, hover = false, idleUntil = 0, timer = null;
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(tick, WAIT_MS);
    }
    function tick() {
      if (playing && inView && !hover && !document.hidden && performance.now() > idleUntil && !busy) {
        if (current === leaves.length) closeBook(schedule);
        else { go(1); }
      }
      schedule();
    }
    function userAction() { idleUntil = performance.now() + 7000; }

    scene.addEventListener('click', function (e) {
      userAction();
      var r = book.getBoundingClientRect();
      var mid = r.left + r.width / 2;
      var right = e.clientX >= mid;
      if (current === 0 || (right && current < leaves.length)) go(1);
      else if (right && !busy) closeBook();   // no fim do livro, o lado direito recomeça
      else go(-1);
    });
    scene.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); userAction(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); userAction(); go(-1); }
    });
    scene.addEventListener('mouseenter', function () { hover = true; });
    scene.addEventListener('mouseleave', function () { hover = false; });

    // o livro acompanha o mouse, inclinando um pouco na mesa
    if (finePointer && !reduceMotion) {
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      scene.addEventListener('mousemove', function (e) {
        var r = scene.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - .5);
        ty = ((e.clientY - r.top) / r.height - .5);
        if (!raf) raf = requestAnimationFrame(follow);
      });
      scene.addEventListener('mouseleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(follow); });
      function follow() {
        cx += (tx - cx) * .08; cy += (ty - cy) * .08;
        book.style.setProperty('--tilt-y', (cx * 10).toFixed(2) + 'deg');
        book.style.setProperty('--tilt-x', (-cy * 8).toFixed(2) + 'deg');
        raf = (Math.abs(tx - cx) > .002 || Math.abs(ty - cy) > .002) ? requestAnimationFrame(follow) : null;
      }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: .45 }).observe(scene);
    } else { inView = true; }

    layout();
    updateUi();
    window.addEventListener('resize', layout);
    schedule();
  }

  /* ── Separa texto em palavras para animar ── */
  function splitWords(node) {
    var out = [];
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var span = document.createElement('span');
          span.className = 'w'; span.textContent = part;
          frag.appendChild(span); out.push(span);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        out = out.concat(splitWords(child));
      }
    });
    return out;
  }

  /* ── Inclinação 3D dos cartões ── */
  function initTilt() {
    if (reduceMotion || !finePointer) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform .5s ease, box-shadow .3s, border-color .3s';
        card.style.transform = '';
        setTimeout(function () { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ── Animações de rolagem (GSAP + ScrollTrigger + MotionPath) ── */
  function initGsap() {
    var titleWords = splitWords(document.querySelector('.oc2-title'));
    var manifestoWords = splitWords(document.querySelector('.oc2-manifesto-text'));

    if (!window.gsap || reduceMotion) {
      manifestoWords.forEach(function (w) { w.style.opacity = 1; });
      document.querySelectorAll('.oc2-trail-node').forEach(function (n) { n.classList.add('is-lit'); });
      return;
    }
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);

    // entrada do hero
    var intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('.oc2-hero .eyebrow', { y: 20, opacity: 0, duration: .6 })
      .from(titleWords, { y: 50, opacity: 0, rotate: 4, duration: .9, stagger: .06 }, '-=.3')
      .from('.oc2-hero .oc2-lead, .oc2-hero .oc2-sub, .oc2-hero-btns', { y: 24, opacity: 0, duration: .7, stagger: .12 }, '-=.5')
      .from('.oc2-book-tilt', { y: 80, rotateY: -35, opacity: 0, duration: 1.4, ease: 'expo.out' }, .2)
      .from('.oc2-planet', { scale: 0, opacity: 0, duration: .8, stagger: .12, ease: 'back.out(2)' }, .8)
      .from('.oc2-book-caption', { opacity: 0, y: 10, duration: .6 }, 1.3);

    // livro e planetas seguem o mouse, cada um numa profundidade
    var hero = document.querySelector('.oc2-hero');
    if (finePointer) {
      var rx = gsap.quickTo('.oc2-book-tilt', 'rotateY', { duration: .8, ease: 'power3' });
      var ry = gsap.quickTo('.oc2-book-tilt', 'rotateX', { duration: .8, ease: 'power3' });
      var planets = Array.prototype.map.call(document.querySelectorAll('.oc2-planet'), function (p) {
        var d = parseFloat(p.dataset.depth) || 1;
        return { d: d, x: gsap.quickTo(p, 'x', { duration: 1, ease: 'power3' }), y: gsap.quickTo(p, 'y', { duration: 1, ease: 'power3' }) };
      });
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        rx(x * 22); ry(-y * 14);
        planets.forEach(function (p) { p.x(x * 40 * p.d); p.y(y * 40 * p.d); });
      });
      hero.addEventListener('mouseleave', function () { rx(0); ry(0); planets.forEach(function (p) { p.x(0); p.y(0); }); });
    }

    if (!window.ScrollTrigger) return;

    // nuvens sobem e o livro recua ao rolar
    gsap.to('.oc2-cloud--back', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.oc2-hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.oc2-hero-stage', { y: 90, scale: .92, ease: 'none', scrollTrigger: { trigger: '.oc2-hero', start: 'top top', end: 'bottom top', scrub: true } });

    // manifesto se acende palavra por palavra
    gsap.to(manifestoWords, {
      opacity: 1, stagger: .05, ease: 'none',
      scrollTrigger: { trigger: '.oc2-manifesto-text', start: 'top 80%', end: 'bottom 45%', scrub: true }
    });

    // livro entra girando levemente
    gsap.from('.oc2-flip-wrap', {
      y: 80, rotateX: 18, opacity: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.oc2-flip-section', start: 'top 70%' }
    });

    // trilha da criação: a linha se desenha e a estrela percorre o caminho
    var path = document.getElementById('oc2TrailPath');
    var trail = document.querySelector('.oc2-trail');
    if (path && trail && getComputedStyle(trail).display !== 'none') {
      var len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      var nodes = document.querySelectorAll('.oc2-trail-node');
      var steps = document.querySelectorAll('.oc2-step');
      gsap.set(steps, { opacity: .25, y: 16 });
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.oc2-journey-inner', start: 'top 75%', end: 'bottom 55%', scrub: .6,
          onUpdate: function (self) {
            var p = self.progress;
            nodes.forEach(function (n, i) {
              var lit = p >= (i * 2 + 1) / 10 - .02;
              n.classList.toggle('is-lit', lit);
              gsap.to(steps[i], { opacity: lit ? 1 : .25, y: lit ? 0 : 16, duration: .4, overwrite: 'auto' });
            });
          }
        }
      });
      tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0);
      if (window.MotionPathPlugin) {
        tl.to('#oc2TrailStar', { motionPath: { path: path, align: path, alignOrigin: [.5, .5], autoRotate: false }, ease: 'none' }, 0);
      }
    } else {
      gsap.from('.oc2-step', { y: 30, opacity: 0, duration: .7, stagger: .12, scrollTrigger: { trigger: '.oc2-steps', start: 'top 80%' } });
    }

    // cartões da obra única
    gsap.from('.oc2-card', {
      y: 60, opacity: 0, rotateX: -20, duration: .9, stagger: .12, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.oc2-unique-grid', start: 'top 80%' }
    });

    // preço: o bloco sobe e os itens entram em sequência
    gsap.from('.oc2-price', { y: 60, opacity: 0, scale: .96, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.oc2-price', start: 'top 80%' } });
    gsap.from('.oc2-price-list li', { x: 40, opacity: 0, duration: .6, stagger: .1, ease: 'power2.out', scrollTrigger: { trigger: '.oc2-price', start: 'top 70%' } });

    // autora
    gsap.from('.oc2-polaroid', { rotate: -18, y: 60, opacity: 0, duration: 1.2, ease: 'elastic.out(1, .6)', scrollTrigger: { trigger: '.oc2-author', start: 'top 70%' } });
    gsap.from('.oc2-author-text > *', { y: 30, opacity: 0, duration: .7, stagger: .1, scrollTrigger: { trigger: '.oc2-author', start: 'top 70%' } });

    // perguntas
    gsap.from('.oc2-faq details', { y: 24, opacity: 0, duration: .6, stagger: .08, scrollTrigger: { trigger: '.oc2-faq', start: 'top 85%' } });

    // CTA: o móbile desce do teto
    gsap.from('.oc2-hang', { scaleY: 0, duration: 1.2, stagger: .1, ease: 'elastic.out(1, .5)', transformOrigin: 'top center', scrollTrigger: { trigger: '.oc2-cta', start: 'top 75%' } });
    gsap.from('.oc2-cta-inner > *', { y: 30, opacity: 0, duration: .8, stagger: .12, scrollTrigger: { trigger: '.oc2-cta', start: 'top 60%' } });
  }

  /* ── Abrir/fechar suave das perguntas ── */
  function initFaq() {
    document.querySelectorAll('.oc2-faq details').forEach(function (d) {
      var summary = d.querySelector('summary');
      var body = d.querySelector('.oc2-faq-body');
      summary.addEventListener('click', function (e) {
        if (reduceMotion || !body.animate) return;
        e.preventDefault();
        if (d.open) {
          var anim = body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'ease' });
          anim.onfinish = function () { d.open = false; };
        } else {
          d.open = true;
          var h = body.offsetHeight;
          body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 350, easing: 'ease' });
        }
      });
    });
  }

  function start() {
    initSky();
    initCursorTrail();
    initBook3d();
    initGsap();
    initTilt();
    initFaq();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
