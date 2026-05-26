/**
 * PassCrack AI — Backend Proxy Server
 * Keeps your Anthropic API key safe on the server side.
 * Run: node server.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ── CONFIG ──────────────────────────────────────────────
const PORT = 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY || 'YOUR_API_KEY_HERE';
// ────────────────────────────────────────────────────────

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
};

const server = http.createServer(async (req, res) => {
  // CORS headers (allow browser to call this server)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // ── POST /api/analyze  →  proxy to Anthropic ──────────
  if (req.method === 'POST' && req.url === '/api/analyze') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let parsed;
      try { parsed = JSON.parse(body); }
      catch { res.writeHead(400); res.end(JSON.stringify({ error: 'Bad JSON' })); return; }

      const payload = JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: parsed.prompt }],
      });

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const apiReq = https.request(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
          res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(data);
        });
      });

      apiReq.on('error', err => {
        res.writeHead(502);
        res.end(JSON.stringify({ error: 'API request failed: ' + err.message }));
      });

      apiReq.write(payload);
      apiReq.end();
    });
    return;
  }

  // ── GET /  →  serve password_analyzer_gui.html ────────
  if (req.method === 'GET') {
    let filePath = req.url === '/' ? '/password_analyzer_gui.html' : req.url;
    const fullPath = path.join(__dirname, filePath);

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found: ' + filePath);
        return;
      }
      const ext = path.extname(fullPath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
      res.end(data);
    });
    return;
  }

  res.writeHead(405); res.end('Method not allowed');
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   PassCrack AI — Server Running      ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║   URL  →  http://localhost:${PORT}       ║`);
  console.log('  ║   Stop →  Ctrl + C                   ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');

  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('  ⚠  WARNING: No API key set!');
    console.log('     Set it with:');
    console.log('     ANTHROPIC_API_KEY=sk-ant-... node server.js');
    console.log('');
  } else {
    console.log('  ✓  API key loaded');
    console.log('');
  }
});
