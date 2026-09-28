/* Cabeçalho do site — montado aqui para ser igual em todas as páginas.
   Use <script src="assets/js/header.js" data-active="chave"></script> no topo do <body>.
   Chaves: inicio, oceu, cursos, sobre, consultas, sala, agenda, contato. */
(function () {
  var script = document.currentScript;
  var active = script.getAttribute('data-active') || '';
  var CALENDLY = 'https://calendly.com/elaine_imenes/consulta';

  function cls(base, key) {
    var parts = [];
    if (base) parts.push(base);
    if (key === active) parts.push('active');
    return parts.length ? ' class="' + parts.join(' ') + '"' : '';
  }
  function current(key) { return key === active ? ' aria-current="page"' : ''; }

  var STAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>';
  var CARET = '<svg class="caret" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  var SEARCH = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';
  var CAL = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';

  var html = ''
    + '<header class="nav">'
    + '  <div class="nav-inner">'
    + '    <a href="inicio.html" class="logo" aria-label="Elaine Imenes — página inicial">'
    + '      <img src="assets/img/logo.png" alt="" width="54" height="54" aria-hidden="true">'
    + '      <span class="logo-text"><span class="logo-name">Elaine Imenes</span><span class="logo-tag">Astrologia</span></span>'
    + '    </a>'
    + '    <input type="checkbox" id="nav-toggle" class="nav-toggle-input" aria-hidden="true" tabindex="-1">'
    + '    <label for="nav-toggle" class="nav-backdrop" aria-hidden="true"></label>'
    + '    <nav class="nav-panel" aria-label="Menu principal">'
    + '      <ul class="nav-links">'
    + '        <li style="--i:0"><a href="inicio.html"' + cls('', 'inicio') + current('inicio') + '>Página Inicial</a></li>'
    + '        <li style="--i:1"><a href="o-ceu-me-contou.html"' + cls('nav-highlight', 'oceu') + current('oceu') + '>' + STAR + 'O Céu Me Contou</a></li>'
    + '        <li style="--i:2" class="has-dropdown has-sub">'
    + '          <a href="cursos.html"' + cls('', 'cursos') + current('cursos') + '>Formação Profissional em Astrologia</a>'
    + '          <button type="button" class="dropdown-toggle sub-toggle" aria-label="Abrir submenu da Formação">' + CARET + '</button>'
    + '          <ul class="dropdown-menu">'
    + '            <li><a href="cursos.html"><strong>Visão geral</strong><small>Os três níveis da formação</small></a></li>'
    + '            <li><a href="ciclo-basico.html"><strong>Nível Básico</strong><small>Programa, aula inaugural e valores</small></a></li>'
    + '          </ul>'
    + '        </li>'
    + '        <li style="--i:3"><a href="sobre.html"' + cls('', 'sobre') + current('sobre') + '>Quem sou eu</a></li>'
    + '        <li style="--i:4"><a href="consultas.html"' + cls('', 'consultas') + current('consultas') + '>Consultas</a></li>'
    + '        <li style="--i:5"><a href="sala-de-leitura.html"' + cls('', 'sala') + current('sala') + '>Sala de Leitura</a></li>'
    + '        <li style="--i:6" class="has-dropdown">'
    + '          <button type="button" class="dropdown-toggle">Mais' + CARET + '</button>'
    + '          <ul class="dropdown-menu">'
    + '            <li><a href="inicio.html#depoimentos">Depoimentos</a></li>'
    + '            <li><a href="agenda.html"' + cls('', 'agenda') + '>Agenda</a></li>'
    + '            <li><a href="contato.html"' + cls('', 'contato') + '>Contato</a></li>'
    + '            <li><a href="o-ceu-me-contou.html">Loja</a></li>'
    + '          </ul>'
    + '        </li>'
    + '      </ul>'
    + '      <a href="' + CALENDLY + '" class="nav-cta nav-cta--panel" target="_blank" rel="noopener">' + CAL + 'Agendar consulta</a>'
    + '    </nav>'
    + '    <div class="nav-right">'
    + '      <button type="button" class="nav-search-btn" aria-label="Buscar no site" aria-expanded="false" title="Buscar (/)">' + SEARCH + '</button>'
    + '      <a href="' + CALENDLY + '" class="nav-cta" target="_blank" rel="noopener">' + CAL + 'Agendar consulta</a>'
    + '      <label for="nav-toggle" class="nav-toggle-label" aria-label="Abrir menu"><span></span><span></span><span></span></label>'
    + '    </div>'
    + '  </div>'
    + '  <div class="nav-search-panel" role="search" hidden>'
    + '    <div class="nav-search-box">'
    + '      ' + SEARCH
    + '      <input type="search" placeholder="O que você procura? Ex.: mapa natal, livro, formação" aria-label="Buscar no site" autocomplete="off">'
    + '      <kbd>Esc</kbd>'
    + '    </div>'
    + '    <ul class="nav-search-results" role="listbox"></ul>'
    + '  </div>'
    + '  <span class="nav-progress" aria-hidden="true"></span>'
    + '</header>';


  // links relativos funcionam também em subpastas (ex.: /post/texto.html)
  var base = (script.getAttribute('src') || '').replace(/assets\/js\/[a-z]+\.js.*$/, '');
  function rebase(root) {
    if (!base || !root) return;
    root.querySelectorAll('[href],[src]').forEach(function (el) {
      ['href', 'src'].forEach(function (attr) {
        var v = el.getAttribute(attr);
        if (v && !/^(https?:|mailto:|tel:|#|\/|data:)/.test(v)) el.setAttribute(attr, base + v);
      });
    });
  }

  script.insertAdjacentHTML('beforebegin', html);

  var nav = document.querySelector('.nav');
  rebase(nav);
  var toggle = document.getElementById('nav-toggle');

  /* ── progresso de leitura e cabeçalho compacto ao rolar ── */
  var progress = nav.querySelector('.nav-progress');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      nav.classList.toggle('compact', window.scrollY > 40);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ── menu do celular: trava a rolagem da página enquanto está aberto ── */
  toggle.addEventListener('change', function () {
    document.documentElement.classList.toggle('nav-open', toggle.checked);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.checked) { toggle.checked = false; document.documentElement.classList.remove('nav-open'); }
  });
  nav.querySelectorAll('.nav-panel a').forEach(function (a) {
    a.addEventListener('click', function () { document.documentElement.classList.remove('nav-open'); });
  });

  /* ── busca pelas páginas do site ── */
  var PAGES = [
    { t: 'Página Inicial', u: 'inicio.html', d: 'Astrologia com método, clareza e leveza', k: 'inicio home elaine imenes astrologia depoimentos' },
    { t: 'O Céu Me Contou', u: 'o-ceu-me-contou.html', d: 'Livro ilustrado a partir do mapa astral da criança', k: 'livro infantil crianca filho presente mapa astral da crianca aquarela loja comprar' },
    { t: 'O Céu Me Contou — saiba mais', u: 'o-ceu-me-contou-saiba-mais.html', d: 'Detalhes do livro personalizado', k: 'livro detalhes saiba mais' },
    { t: 'Formação Profissional em Astrologia', u: 'cursos.html', d: 'Uma formação em três níveis', k: 'curso cursos formacao estudar aprender niveis basico intermediario avancado' },
    { t: 'Nível Básico', u: 'ciclo-basico.html', d: 'Programa, aula inaugural gratuita e valores', k: 'ciclo basico curso 80 horas aula inaugural gratuita valores matricula programa signos planetas casas aspectos' },
    { t: 'Consultas', u: 'consultas.html', d: 'Mapa natal, sinastria, revolução solar e Lua nossa de cada dia', k: 'consulta agendar mapa natal astral sinastria relacionamento revolucao solar previsao anual lua nossa de cada dia calendly' },
    { t: 'Quem sou eu', u: 'sobre.html', d: 'Astróloga, química e educadora', k: 'sobre elaine historia biografia fiocruz sinarj quimica' },
    { t: 'Sala de Leitura', u: 'sala-de-leitura.html', d: 'Textos e artigos do blog', k: 'blog textos artigos leitura posts' },
    { t: 'Agenda', u: 'agenda.html', d: 'Próximas turmas, aulas ao vivo e encontros', k: 'agenda turmas aulas ao vivo eventos datas' },
    { t: 'Contato', u: 'contato.html', d: 'WhatsApp, e-mail e formulário', k: 'contato whatsapp email mensagem formulario falar' }
  ];
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  var panel = nav.querySelector('.nav-search-panel');
  var input = panel.querySelector('input');
  var list = panel.querySelector('.nav-search-results');
  var searchBtn = nav.querySelector('.nav-search-btn');

  function render(q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    var hits = PAGES.filter(function (p) {
      if (!words.length) return true;
      var hay = norm(p.t + ' ' + p.d + ' ' + p.k);
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    }).slice(0, 6);
    list.innerHTML = hits.length
      ? hits.map(function (p, i) {
          return '<li role="option"' + (i === 0 && words.length ? ' class="is-first"' : '') + '><a href="' + base + p.u + '"><strong>' + p.t + '</strong><small>' + p.d + '</small></a></li>';
        }).join('')
      : '<li class="nav-search-empty">Nada encontrado. Tente “consulta”, “livro” ou “formação”.</li>';
  }
  function openSearch() {
    panel.hidden = false;
    nav.classList.add('search-open');
    searchBtn.setAttribute('aria-expanded', 'true');
    render(input.value);
    setTimeout(function () { input.focus(); }, 30);
  }
  function closeSearch() {
    panel.hidden = true;
    nav.classList.remove('search-open');
    searchBtn.setAttribute('aria-expanded', 'false');
  }
  searchBtn.addEventListener('click', function () { panel.hidden ? openSearch() : closeSearch(); });
  input.addEventListener('input', function () { render(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var first = list.querySelector('a'); if (first) location.href = first.getAttribute('href'); }
    if (e.key === 'Escape') { closeSearch(); searchBtn.focus(); }
  });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === '/' && tag !== 'input' && tag !== 'textarea') { e.preventDefault(); openSearch(); }
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !searchBtn.contains(e.target)) closeSearch();
  });
})();
