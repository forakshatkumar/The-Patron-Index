// One Vercel Node.js Function for all existing Express API endpoints.
const { app } = require('../backend/src/server');

module.exports = function handler(req, res) {
  // Vercel may expose the incoming URL or the rewrite destination. Support both.
  const url = new URL(req.url || '/api', 'http://internal.invalid');
  const rewritten = url.searchParams.get('__patron_path');
  url.searchParams.delete('__patron_path');
  if (url.pathname === '/api/patron' || url.pathname === '/api/patron.js') {
    // The path is supplied by the internal rewrite; only relative API paths are accepted.
    const path = (rewritten || '').replace(/^\/+/, '');
    url.pathname = '/api/' + path;
  }
  req.url = url.pathname + url.search;
  return app(req, res);
};
