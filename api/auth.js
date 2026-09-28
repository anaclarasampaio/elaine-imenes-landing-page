// Login do painel (/admin) com o GitHub — passo 1: manda a pessoa para o GitHub autorizar.
// Precisa das variáveis de ambiente GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET na Vercel.
const crypto = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('Falta configurar GITHUB_CLIENT_ID na Vercel.');
    return;
  }
  const state = crypto.randomBytes(16).toString('hex');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `https://${host}/api/callback`;
  const url = 'https://github.com/login/oauth/authorize'
    + `?client_id=${encodeURIComponent(clientId)}`
    + `&redirect_uri=${encodeURIComponent(redirectUri)}`
    + `&scope=${encodeURIComponent(req.query.scope || 'repo,user')}`
    + `&state=${state}`;
  res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.redirect(302, url);
};
