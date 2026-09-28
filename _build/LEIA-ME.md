# Site da Elaine Imenes — como funciona

Os textos da Sala de Leitura ficam em `content/posts/*.md` e os eventos da Agenda em
`content/eventos/*.md` (um arquivo por item). O script `_build/build.mjs` transforma cada
texto numa página em `post/`, atualiza a lista da Sala de Leitura, os "Textos recentes" da
página inicial, a Agenda, o `sitemap.xml` e o `vercel.json` (hospedagem e endereços antigos
do Wix → novos).

- Gerar tudo no computador: `node _build/build.mjs`
- Não edite `post/*.html` nem `vercel.json` à mão: são refeitos a cada build.
- O visual das páginas de texto está em `_build/post-template.html` e `assets/css/blog.css`.

## Colocar no ar (Vercel) — uma vez só

1. **Vercel → Add New → Project →** importar o repositório
   `anaclarasampaio/elaine-imenes-landing-page`. Em *Framework Preset*, deixar **Other**.
   Não precisa mudar mais nada: o comando de build e a pasta vêm do `vercel.json`.
2. **Login do painel (GitHub OAuth).** No GitHub: *Settings → Developer settings →
   OAuth Apps → New OAuth App*.
   - Homepage URL: o endereço do site (ex.: `https://elaine-imenes-landing-page.vercel.app`)
   - Authorization callback URL: o mesmo endereço + `/api/callback`
     (ex.: `https://elaine-imenes-landing-page.vercel.app/api/callback`)

   Copie o *Client ID* e gere um *Client secret*.
3. **Vercel → projeto → Settings → Environment Variables:** criar
   `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` com os valores do passo 2 e fazer um
   novo deploy (*Deployments → ⋯ → Redeploy*).
4. **Acesso da Elaine:** ela cria uma conta no GitHub e é adicionada ao repositório
   com permissão de escrita (*Settings → Collaborators*).
5. **Domínio:** em *Settings → Domains*, adicionar `elaineimenes.com` e `www.elaineimenes.com`
   e ajustar o DNS como a Vercel indicar. Depois, **trocar no OAuth App do GitHub** a
   Homepage URL e a callback URL para `https://www.elaineimenes.com/api/callback`.
   Antes de apontar o domínio, migrar as páginas que ainda estão só no Wix:
   Programa Céu Interno, Entre Estrelas e Caminhos, A Lua, a Mãe e o Espelho da Alma e
   O Mapa dos Encontros.

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

Os eventos são cadastrados no painel, em **Agenda → Novo evento** (nome, data e hora, tipo,
formato, onde, descrição e link). A página separa sozinha os próximos eventos dos que já
aconteceram, mostra quanto falta para o próximo e oferece o botão "Adicionar à minha agenda"
(Google Agenda).

## Formulário de contato (FormSubmit)

As mensagens do formulário da página Contato chegam direto em
`elaineimenes.astrologia@gmail.com`, pelo serviço gratuito FormSubmit (formsubmit.co).

- **Na primeira mensagem**, o FormSubmit manda para esse e-mail um pedido de confirmação
  ("Activate Form"). A Elaine precisa clicar em ativar uma única vez; a partir daí todas as
  mensagens chegam normalmente. Vale mandar uma mensagem de teste logo depois do deploy.
- Ao responder o e-mail, a resposta vai direto para quem escreveu.
- Há um campo escondido contra spam.
