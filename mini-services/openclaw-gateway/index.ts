import { execSync, spawn } from 'child_process';
import http from 'http';

const PORT = 3030;
const OPENCLAW_PORT = 18789;

console.log(`[OpenClaw Gateway] Starting QuranPulse OpenClaw integration on port ${PORT}`);
console.log(`[OpenClaw Gateway] OpenClaw Gateway expected on port ${OPENCLAW_PORT}`);

// Health check + proxy info server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      service: 'openclaw-gateway',
      openclawPort: OPENCLAW_PORT,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Gateway status proxy
  if (url.pathname === '/api/status') {
    try {
      const result = execSync('openclaw gateway status --json 2>&1', { timeout: 5000 }).toString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(result);
    } catch (error: any) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Gateway not running', message: error.message }));
    }
    return;
  }

  // Sessions list
  if (url.pathname === '/api/sessions') {
    try {
      const result = execSync('openclaw sessions list --json 2>&1', { timeout: 5000 }).toString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(result);
    } catch (error: any) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to list sessions', message: error.message }));
    }
    return;
  }

  // Cron jobs list
  if (url.pathname === '/api/cron') {
    try {
      const result = execSync('openclaw cron list --json 2>&1', { timeout: 5000 }).toString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(result);
    } catch (error: any) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to list cron jobs', message: error.message }));
    }
    return;
  }

  // Skills list
  if (url.pathname === '/api/skills') {
    try {
      const result = execSync('openclaw skills list --json 2>&1', { timeout: 5000 }).toString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(result);
    } catch (error: any) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to list skills', message: error.message }));
    }
    return;
  }

  // Send message to agent
  if (url.pathname === '/api/message' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { message, channel, target } = JSON.parse(body);
        const cmd = `openclaw agent --message "${message.replace(/"/g, '\\"')}" ${channel ? `--channel ${channel}` : ''} ${target ? `--target ${target}` : ''} --json 2>&1`;
        const result = execSync(cmd, { timeout: 30000 }).toString();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(result);
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to send message', message: error.message }));
      }
    });
    return;
  }

  // Default: info
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    service: 'openclaw-gateway',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/api/status',
      '/api/sessions', 
      '/api/cron',
      '/api/skills',
      '/api/message (POST)'
    ],
    openclaw: {
      version: '2026.4.15',
      configPort: OPENCLAW_PORT,
      workspace: '~/quranpulse-workspace'
    }
  }));
});

server.listen(PORT, () => {
  console.log(`[OpenClaw Gateway] API server running on port ${PORT}`);
});
