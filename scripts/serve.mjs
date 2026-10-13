// Minimal dependency-free static file server for local development and for
// previewing the production build. Usage: node scripts/serve.mjs --root dist --port 4173
// --base /Repo-Name/ serves the root under a sub-path the way GitHub Pages
// serves a project site (anything outside it is a 404; directories without a
// trailing slash redirect, as on Pages); --max-age 600 sends Pages-style
// Cache-Control headers.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const root = path.resolve(opt('root', '.'));
const port = Number(opt('port', process.env.PORT || 5173));
const host = opt('host', '0.0.0.0');
const maxAge = opt('max-age', '');
const base = ('/' + opt('base', '/').replace(/^\/+|\/+$/g, '') + '/').replace('//', '/');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    let rel = decodeURIComponent(url.pathname);
    if (base !== '/') {
      if (rel + '/' === base) { res.writeHead(301, { location: base + url.search }).end(); return; }
      if (!rel.startsWith(base)) { res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found'); return; }
      rel = '/' + rel.slice(base.length);
    }
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.normalize(path.join(root, rel));
    if (!file.startsWith(root)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    fs.stat(file, (err, st) => {
      if (!err && st.isDirectory()) {
        // like GitHub Pages: /dir → /dir/
        res.writeHead(301, { location: url.pathname + '/' + url.search }).end();
        return;
      }
      if (err || !st.isFile()) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
        return;
      }
      res.writeHead(200, {
        'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'content-length': st.size,
        // --max-age 600 mimics GitHub Pages' caching; the default always revalidates
        'cache-control': maxAge ? `max-age=${Number(maxAge)}` : 'no-cache',
      });
      if (req.method === 'HEAD') return res.end();
      fs.createReadStream(file).pipe(res);
    });
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://localhost:${port}${base}`);
});
