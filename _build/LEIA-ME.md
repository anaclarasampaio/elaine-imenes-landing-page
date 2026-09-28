# Sala de Leitura — como funciona

Os textos ficam em `content/posts/*.md` (um arquivo por texto). O script
`_build/build.mjs` transforma cada um numa página em `post/`, atualiza a lista da
Sala de Leitura, os "Textos recentes" da página inicial, o `sitemap.xml` e o
`_redirects` (endereços antigos do Wix → novos).

- Gerar tudo no computador: `node _build/build.mjs`
- Não edite `post/*.html` à mão: essas páginas são refeitas a cada build.
- O visual das páginas de texto está em `_build/post-template.html` e `assets/css/blog.css`.

## Colocar no ar (Netlify) — uma vez só

1. **Netlify → Add new site → Import from Git →** escolher o repositório
   `anaclarasampaio/elaine-imenes`. Comando e pasta de publicação vêm do `netlify.toml`.
2. **Login do painel (GitHub OAuth).** No GitHub: *Settings → Developer settings →
   OAuth Apps → New OAuth App*.
   - Homepage URL: o endereço do site (ex.: `https://elaineimenes.netlify.app`)
   - Authorization callback URL: `https://api.netlify.com/auth/done`

   Copie o *Client ID* e gere um *Client secret*.
3. **Netlify → Site configuration → Access & security → OAuth → Install provider →
   GitHub**, colando o Client ID e o secret.
4. **Acesso da Elaine:** ela cria uma conta no GitHub e é adicionada ao repositório
   com permissão de escrita (*Settings → Collaborators*).
5. **Domínio:** em *Domain management*, adicionar `elaineimenes.com` e apontar o DNS
   para a Netlify. Antes disso, migrar as páginas que ainda estão só no Wix
   (listadas em `_build/redirects.base`).


## Como a Elaine publica um texto

1. Abrir `elaineimenes.com/admin` e clicar em **Entrar com o GitHub**.
2. **Sala de Leitura → Novo texto.**
3. Preencher título, data, imagem de capa (opcional), resumo (opcional) e o texto.
   O editor tem negrito, itálico, links, títulos, citações, listas e imagens.
   Para as referências, basta criar um título "Referências" no fim.
4. **Publicar.** Em cerca de um minuto o texto está no site.

Para guardar sem publicar, ligue **Rascunho**. Para corrigir um texto, abra-o na lista,
edite e publique de novo.

## Agenda

Os eventos ficam em `content/eventos/*.md` e são cadastrados no painel, em **Agenda → Novo evento**
(nome, data e hora, tipo, formato, onde, descrição e link). A página separa sozinha os próximos
eventos dos que já aconteceram, mostra quanto falta para o próximo e oferece o botão
"Adicionar à minha agenda" (Google Agenda).

## Formulário de contato (Netlify Forms)

O formulário da página Contato já está pronto para o Netlify Forms (grátis até 100 mensagens por mês).
Depois do primeiro deploy:

1. **Netlify → Forms →** conferir se o formulário "contato" apareceu e ativar a detecção de formulários, se pedir.
2. **Forms → Form notifications → Add notification → Email notification**, para
   `elaineimenes.astrologia@gmail.com`.

As mensagens também ficam guardadas no painel da Netlify. Há um campo escondido contra spam.
