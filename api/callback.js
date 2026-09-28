// Login do painel (/admin) com o GitHub — passo 2: o GitHub volta para cá com um código,
// trocamos pelo token e devolvemos para a janela do painel no formato que o Decap CMS espera.

function reply(res, status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!doctype html><html><body><p>Concluindo o login…</p><script>
(function () {
  var msg = ${JSON.stringify(message)};
  function receive(e) {
    window.opener.postMessage(msg, e.origin);
    window.removeEventListener('message', receive, false);
    setTimeout(function () { window.close(); }, 200);
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`);
}

module.exports = async (req, res) => {
  const { code, state } = req.query;
  const cookie = (req.headers.cookie || '').match(/(?:^|;\s*)oauth_state=([a-f0-9]+)/);
  if (!code || !state || !cookie || cookie[1] !== state) {
    reply(res, 'error', { message: 'Não foi possível confirmar o login. Tente de novo.' });
    return;
  }
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await r.json();
    if (!data.access_token) throw new Error(data.error_description || 'sem token');
    reply(res, 'success', { token: data.access_token, provider: 'github' });
  } catch (err) {
    reply(res, 'error', { message: 'O GitHub recusou o login: ' + err.message });
  }
};
