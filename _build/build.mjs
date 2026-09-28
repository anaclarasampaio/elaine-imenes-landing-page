/* Gera a Sala de Leitura a partir dos textos em content/posts/*.md.
 *
 *   node _build/build.mjs
 *
 * Para cada texto, cria post/<slug>.html usando _build/post-template.html.
 * Também atualiza a lista de textos em sala-de-leitura.html, os "Textos recentes"
 * da página inicial e o vercel.json (hospedagem e endereços antigos do Wix → novos).
 * Não precisa de nenhuma dependência: roda com o Node puro, local ou na Vercel.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const OUT_DIR = path.join(ROOT, 'post');
const SITE_URL = 'https://www.elaineimenes.com';
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/* ── front matter (o subconjunto de YAML que o painel escreve) ── */
function parseFrontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z_][\w-]*):\s?(.*)$/);
    if (!kv) continue;
    let [, key, val] = kv;
    if (/^[|>][+-]?$/.test(val.trim())) {
      // bloco de várias linhas
      const folded = val.trim().startsWith('>');
      const block = [];
      while (i + 1 < lines.length && (/^\s+/.test(lines[i + 1]) || lines[i + 1] === '')) block.push(lines[++i].replace(/^\s{2}/, ''));
      val = folded ? block.join(' ').replace(/\s+/g, ' ') : block.join('\n');
      data[key] = val.trim();
      continue;
    }
    val = val.trim();
    if (/^".*"$/.test(val)) { try { val = JSON.parse(val); } catch { val = val.slice(1, -1); } }
    else if (/^'.*'$/.test(val)) val = val.slice(1, -1).replace(/''/g, "'");
    else if (val === 'true' || val === 'false') val = val === 'true';
    data[key] = val;
  }
  return { data, body: m[2] };
}

/* ── Markdown → HTML (títulos, parágrafos, listas, citações, imagens, links, ênfase) ── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(text) {
  let s = esc(text);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const ext = /^https?:/.test(href) && !href.includes('elaineimenes.com');
    return `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+?)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\n]+?)_(?!_)/g, '$1<em>$2</em>');
  s = s.replace(/ {2,}\n|\\\n/g, '<br>\n');
  return s;
}

function markdown(md) {
  const blocks = md.replace(/\r\n/g, '\n').trim().split(/\n{2,}/);
  const out = [];
  for (const raw of blocks) {
    const b = raw.replace(/\s+$/, '');
    if (!b) continue;
    let m;
    if ((m = b.match(/^(#{1,6})\s+(.*)$/)) && !b.includes('\n')) {
      const lvl = Math.min(4, Math.max(2, m[1].length));
      out.push(`<h${lvl}>${inline(m[2])}</h${lvl}>`);
    } else if (/^(-{3,}|\*{3,})$/.test(b)) {
      out.push('<hr>');
    } else if (/^!\[[^\]]*\]\([^)]+\)$/.test(b)) {
      const [, alt, src] = b.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      out.push(`<figure><img src="${src}" alt="${esc(alt)}" loading="lazy">${alt ? `<figcaption>${esc(alt)}</figcaption>` : ''}</figure>`);
    } else if (b.split('\n').every((l) => /^>\s?/.test(l))) {
      out.push(`<blockquote><p>${inline(b.split('\n').map((l) => l.replace(/^>\s?/, '')).join('\n'))}</p></blockquote>`);
    } else if (b.split('\n').every((l) => /^[-*+]\s+/.test(l))) {
      out.push('<ul>' + b.split('\n').map((l) => `<li>${inline(l.replace(/^[-*+]\s+/, ''))}</li>`).join('') + '</ul>');
    } else if (b.split('\n').every((l) => /^\d+[.)]\s+/.test(l))) {
      out.push('<ol>' + b.split('\n').map((l) => `<li>${inline(l.replace(/^\d+[.)]\s+/, ''))}</li>`).join('') + '</ol>');
    } else {
      out.push(`<p>${inline(b)}</p>`);
    }
  }
  return out.join('\n');
}

/* ── utilidades ── */
const plain = (md) => md.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_#>`]/g, '').replace(/\s+/g, ' ').trim();
function dateBR(d) { return `${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`; }
function slugOf(file) { return path.basename(file, '.md'); }
// caminhos do painel começam com "/" (raiz do site); as páginas de post ficam em /post/
const rel = (url, prefix) => (url && url.startsWith('/') ? prefix + url.slice(1) : url || '');

function card(p, prefix, extraClass = '') {
  const cover = p.cover ? `<span class="rd-card-img"><img src="${rel(p.cover, prefix)}" alt="" loading="lazy"></span>` : '';
  return `<a class="rd-card${extraClass}" href="${prefix}post/${p.slug}.html" data-search="${esc((p.title + ' ' + p.excerpt).toLowerCase())}">
        ${cover}
        <span class="rd-card-body">
          <span class="rd-card-meta"><time datetime="${p.iso}">${p.dateLabel}</time> · ${p.minutes} min de leitura</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.excerpt)}</p>
          <span class="rd-card-more">Ler o texto <span aria-hidden="true">→</span></span>
        </span>
      </a>`;
}

function replaceBetween(file, name, html) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return;
  const src = fs.readFileSync(full, 'utf8');
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(src)) { console.warn(`  aviso: marcador ${name} não encontrado em ${file}`); return; }
  fs.writeFileSync(full, src.replace(re, `$1\n${html}\n      $2`));
}

/* ── build ── */
const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')) : [];
const posts = files.map((f) => {
  const { data, body } = parseFrontMatter(fs.readFileSync(path.join(POSTS_DIR, f), 'utf8'));
  const d = new Date(data.date || fs.statSync(path.join(POSTS_DIR, f)).mtime);
  const text = plain(body);
  const excerpt = data.excerpt || (text.length > 220 ? text.slice(0, 220).replace(/\s+\S*$/, '') + '…' : text);
  return {
    slug: slugOf(f), title: data.title || slugOf(f), date: d, iso: d.toISOString(), dateLabel: dateBR(d),
    excerpt, cover: data.cover || '', draft: data.draft === true, original: data.original_url || '',
    body, minutes: Math.max(1, Math.round(text.split(' ').length / 200)),
  };
}).filter((p) => !p.draft).sort((a, b) => b.date - a.date);

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const f of fs.readdirSync(OUT_DIR)) if (f.endsWith('.html')) fs.unlinkSync(path.join(OUT_DIR, f));

const template = fs.readFileSync(path.join(ROOT, '_build', 'post-template.html'), 'utf8');
posts.forEach((p, i) => {
  const others = posts.filter((o) => o !== p).slice(0, 3);
  let body = markdown(p.body).replace(/(src|href)="\/(?!\/)/g, '$1="../');
  // a seção de referências (no fim do texto) ganha letra menor
  body = body.replace(/<h([2-4])>(Refer[êe]ncias[^<]*)<\/h\1>([\s\S]*)$/i, '<section class="pt-refs"><h2>$2</h2>\n$3\n</section>');
  const cover = rel(p.cover, '../');
  const html = template
    .replaceAll('{{title_url}}', encodeURIComponent(p.title))
    .replaceAll('{{title}}', esc(p.title))
    .replaceAll('{{excerpt}}', esc(p.excerpt))
    .replaceAll('{{date_iso}}', p.iso)
    .replaceAll('{{date}}', p.dateLabel)
    .replaceAll('{{minutes}}', String(p.minutes))
    .replaceAll('{{url}}', `${SITE_URL}/post/${p.slug}`)
    .replaceAll('{{og_image}}', p.cover ? SITE_URL + p.cover : `${SITE_URL}/assets/img/logo.png`)
    .replaceAll('{{cover}}', cover ? `<figure class="pt-cover"><img src="${cover}" alt=""></figure>` : '')
    .replaceAll('{{body}}', body)
    .replaceAll('{{more}}', others.map((o) => card(o, '../')).join('\n      '))
    .replaceAll('{{prev}}', posts[i + 1] ? `<a class="pt-nav-link" href="${posts[i + 1].slug}.html"><small>Texto anterior</small>${esc(posts[i + 1].title)}</a>` : '<span></span>')
    .replaceAll('{{next}}', posts[i - 1] ? `<a class="pt-nav-link pt-nav-link--next" href="${posts[i - 1].slug}.html"><small>Próximo texto</small>${esc(posts[i - 1].title)}</a>` : '<span></span>');
  fs.writeFileSync(path.join(OUT_DIR, `${p.slug}.html`), html);
});

// Sala de Leitura: o texto mais recente em destaque, os outros em grade
const [first, ...rest] = posts;
replaceBetween('sala-de-leitura.html', 'POSTS',
  posts.length
    ? `      ${card(first, '', ' rd-card--featured')}\n      <div class="rd-grid" data-rd-grid>\n      ${rest.map((p) => card(p, '')).join('\n      ')}\n      </div>`
    : '      <p class="rd-empty">Os primeiros textos chegam em breve.</p>');

// Página inicial: os três mais recentes
replaceBetween('inicio.html', 'RECENT_POSTS', posts.slice(0, 3).map((p) => `    <a href="post/${p.slug}.html" class="hm-article">
      <span class="hm-article-tag">${p.dateLabel}</span>
      <h3>${esc(p.title)}</h3>
      <span class="hm-article-more">Ler o texto <span aria-hidden="true">→</span></span>
    </a>`).join('\n'));

// vercel.json: configuração da hospedagem, com os endereços antigos do Wix → novos.
// A Vercel lê este arquivo antes do build, então ele é gerado aqui e vai junto no commit.
const oldRedirects = [
  ['/saladeleitura', '/sala-de-leitura'],
  ['/oceumecontou', '/o-ceu-me-contou'],
  ['/oceumecontou-saibamais', '/o-ceu-me-contou-saiba-mais'],
  ['/formação-profissional-em-astrologia', '/cursos'],
  ['/depoimentos', '/inicio#depoimentos'],
  ['/blog', '/sala-de-leitura'],
  ...posts.filter((p) => p.original).map((p) => [decodeURIComponent(new URL(p.original).pathname), `/post/${p.slug}`]),
].filter(([from, to]) => from !== to);
// cada endereço com acento entra nas duas formas (com acento e codificado)
const redirects = oldRedirects.flatMap(([from, to]) => {
  const enc = encodeURI(from);
  return (enc !== from ? [from, enc] : [from]).map((source) => ({ source, destination: to, permanent: true }));
});
const vercel = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  buildCommand: 'node _build/build.mjs',
  outputDirectory: '.',
  cleanUrls: true,
  trailingSlash: false,
  rewrites: [{ source: '/', destination: '/inicio' }],
  redirects,
  headers: [
    { source: '/admin/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
    { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }] },
  ],
};
fs.writeFileSync(path.join(ROOT, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n');

// sitemap.xml
const pages = ['inicio.html', 'o-ceu-me-contou.html', 'cursos.html', 'ciclo-basico.html', 'sobre.html', 'consultas.html', 'sala-de-leitura.html', 'agenda.html', 'contato.html'];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE_URL}/${p.replace('.html', '')}</loc></url>`).join('\n')}
${posts.map((p) => `  <url><loc>${SITE_URL}/post/${p.slug}</loc><lastmod>${p.iso.slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`);

console.log(`Sala de Leitura: ${posts.length} texto(s) publicados.`);

/* ── Agenda: eventos em content/eventos/*.md ──
   Todos os eventos entram na página em ordem de data; o script da própria página
   separa os próximos dos que já aconteceram, pela data de quem está visitando. */
const EVENTS_DIR = path.join(ROOT, 'content', 'eventos');
const TZ = 'America/Sao_Paulo';
const fmt = (d, o) => new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, ...o }).format(d);
const gcal = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const events = (fs.existsSync(EVENTS_DIR) ? fs.readdirSync(EVENTS_DIR).filter((f) => f.endsWith('.md')) : [])
  .map((f) => ({ slug: slugOf(f), ...parseFrontMatter(fs.readFileSync(path.join(EVENTS_DIR, f), 'utf8')).data }))
  .filter((e) => e.date && !e.draft)
  .map((e) => {
    const start = new Date(e.date);
    const end = e.end ? new Date(e.end) : new Date(start.getTime() + 90 * 60000);
    return { ...e, start, end };
  })
  .sort((a, b) => a.start - b.start);

function eventCard(e) {
  const link = rel(e.link || '', '');
  const where = [e.format, e.place].filter(Boolean).join(' · ');
  const cal = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + `&text=${encodeURIComponent(e.title)}`
    + `&dates=${gcal(e.start)}/${gcal(e.end)}`
    + `&details=${encodeURIComponent((e.description || '') + (link && /^https?:/.test(link) ? `\n\n${link}` : ''))}`
    + `&location=${encodeURIComponent(e.place || e.format || '')}`
    + `&ctz=${TZ}`;
  return `<article class="ag-event" data-start="${e.start.toISOString()}" data-end="${e.end.toISOString()}">
        <div class="ag-date" aria-hidden="true">
          <span class="ag-date-day">${fmt(e.start, { day: '2-digit' })}</span>
          <span class="ag-date-month">${fmt(e.start, { month: 'short' }).replace('.', '')}</span>
          <span class="ag-date-year">${fmt(e.start, { year: 'numeric' })}</span>
        </div>
        <div class="ag-info">
          <div class="ag-tags">${e.type ? `<span class="ag-tag">${esc(e.type)}</span>` : ''}<span class="ag-status" data-status></span></div>
          <h3>${esc(e.title)}</h3>
          <p class="ag-when"><time datetime="${e.start.toISOString()}">${fmt(e.start, { weekday: 'long', day: 'numeric', month: 'long' })}, às ${fmt(e.start, { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}</time>${where ? ` · ${esc(where)}` : ''}</p>
          ${e.description ? `<p class="ag-desc">${esc(e.description)}</p>` : ''}
          <div class="ag-actions">
            ${link ? `<a class="btn btn-primary ag-btn" href="${esc(link)}"${/^https?:/.test(link) ? ' target="_blank" rel="noopener"' : ''}>${esc(e.link_label || 'Saiba mais')}</a>` : ''}
            <a class="ag-cal" href="${cal}" target="_blank" rel="noopener" data-upcoming-only>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>
              Adicionar à minha agenda
            </a>
          </div>
        </div>
      </article>`;
}
replaceBetween('agenda.html', 'EVENTS', events.map(eventCard).join('\n      '));
console.log(`Agenda: ${events.length} evento(s).`);
