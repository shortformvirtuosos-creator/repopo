// Tiny static server for dist/, mounted under a subpath to prove the build
// works from any folder. Used by scripts/screens.mjs.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.glb': 'model/gltf-binary',
}

export function serve(root, base = '/ceif/', port = 0) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    if (!url.pathname.startsWith(base)) {
      res.writeHead(404).end()
      return
    }
    let rel = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html'
    const file = path.join(root, rel)
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end()
      return
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const { port: p } = server.address()
      resolve({ url: `http://127.0.0.1:${p}${base}`, close: () => server.close() })
    })
  })
}
