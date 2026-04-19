import { spawnSync } from 'child_process';
import http from 'http';

const PORT = 3030;
const OPENCLAW_PORT = 18789;
const OPENCLAW_HOST = '127.0.0.1';

console.log(`[OpenClaw Gateway v2] Starting QuranPulse-OpenClaw integration on port ${PORT}`);
console.log(`[OpenClaw Gateway v2] OpenClaw Gateway expected on port ${OPENCLAW_PORT}`);

// ─── Helper: Validate origin for CORS ──────────────────────────────────────
function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  // Allow localhost for development
  if (origin === 'http://localhost:3000') return true;
  // Allow sandbox preview origins
  if (/\.space\.z\.ai$/.test(origin)) return true;
  return false;
}

// ─── Helper: Set CORS headers safely ───────────────────────────────────────
function setCorsHeaders(req: http.IncomingMessage, res: http.ServerResponse): void {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ─── Helper: Proxy request to OpenClaw Gateway ────────────────────────────────
function proxyToOpenClaw(path: string, method: string = 'GET', body?: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve) => {
    const options = {
      hostname: OPENCLAW_HOST,
      port: OPENCLAW_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 200, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode || 200, data: { raw: data } });
        }
      });
    });

    req.on('error', () => {
      resolve({ status: 503, data: { error: 'OpenClaw Gateway not reachable', hint: 'Start with: openclaw gateway --port 18789' } });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 504, data: { error: 'OpenClaw Gateway timeout' } });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// ─── Helper: Run OpenClaw CLI command (spawnSync — no shell injection) ──────
function runOpenClawCLI(args: string[], timeout: number = 5000): { success: boolean; data: any } {
  try {
    const result = spawnSync('openclaw', [...args, '--json'], {
      timeout,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (result.error) {
      return { success: false, data: { error: result.error.message, hint: 'OpenClaw CLI not available' } };
    }

    const stdout = (result.stdout || '').trim();
    if (result.status !== 0 && !stdout) {
      const stderr = (result.stderr || '').trim();
      return { success: false, data: { error: stderr || `Process exited with code ${result.status}`, hint: 'OpenClaw CLI error' } };
    }

    try {
      return { success: true, data: JSON.parse(stdout) };
    } catch {
      return { success: true, data: { raw: stdout } };
    }
  } catch (error: any) {
    return { success: false, data: { error: error.message, hint: 'OpenClaw CLI not available' } };
  }
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // CORS — restricted origin
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  // ─── Health check ─────────────────────────────────────────────────────────
  if (path === '/health') {
    // Also check if real OpenClaw Gateway is running
    const ocStatus = await proxyToOpenClaw('/health');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'openclaw-gateway-v2',
      version: '2.0.0',
      openclawPort: OPENCLAW_PORT,
      openclawReachable: ocStatus.status === 200,
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // ─── OpenClaw Gateway Status ──────────────────────────────────────────────
  if (path === '/api/status') {
    const result = await proxyToOpenClaw('/health');
    if (result.status === 200) {
      // Also try gateway status endpoint
      const gwStatus = await proxyToOpenClaw('/api/status');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'online',
        gateway: gwStatus.data,
        reachable: true,
        timestamp: new Date().toISOString(),
      }));
    } else {
      // Fallback to CLI
      const cli = runOpenClawCLI(['gateway', 'status']);
      res.writeHead(cli.success ? 200 : 503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: cli.success ? 'online' : 'offline',
        ...cli.data,
        timestamp: new Date().toISOString(),
      }));
    }
    return;
  }

  // ─── Sessions ─────────────────────────────────────────────────────────────
  if (path === '/api/sessions') {
    const result = await proxyToOpenClaw('/api/sessions');
    if (result.status !== 503) {
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.data));
    } else {
      const cli = runOpenClawCLI(['sessions', 'list']);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cli.data));
    }
    return;
  }

  // ─── Cron Jobs ────────────────────────────────────────────────────────────
  if (path === '/api/cron') {
    const result = await proxyToOpenClaw('/api/cron');
    if (result.status !== 503) {
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.data));
    } else {
      const cli = runOpenClawCLI(['cron', 'list']);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cli.data));
    }
    return;
  }

  // ─── Skills List ──────────────────────────────────────────────────────────
  if (path === '/api/skills') {
    const result = await proxyToOpenClaw('/api/skills');
    if (result.status !== 503) {
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.data));
    } else {
      const cli = runOpenClawCLI(['skills', 'list']);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cli.data));
    }
    return;
  }

  // ─── OpenAI-Compatible Chat Completions ───────────────────────────────────
  if (path === '/api/chat/completions' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body);
        // Proxy to OpenClaw's OpenAI-compatible endpoint
        const result = await proxyToOpenClaw('/v1/chat/completions', 'POST', {
          ...parsed,
          // Add QuranPulse context if not present
          model: parsed.model || 'openclaw/default',
        });
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body', message: error.message }));
      }
    });
    return;
  }

  // ─── OpenAI-Compatible Models ─────────────────────────────────────────────
  if (path === '/api/models') {
    const result = await proxyToOpenClaw('/v1/models');
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.data));
    return;
  }

  // ─── Send Message to OpenClaw Agent ───────────────────────────────────────
  if (path === '/api/message' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { message, channel, target, sessionKey, agentId } = JSON.parse(body);

        // ── Input validation ──
        if (typeof message !== 'string' || message.trim().length === 0 || message.length > 2000) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid message: must be a non-empty string up to 2000 characters' }));
          return;
        }
        if (channel !== undefined && channel !== null && channel !== '') {
          if (typeof channel !== 'string' || !/^[a-z]{2,20}$/.test(channel)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid channel: must be 2-20 lowercase letters' }));
            return;
          }
        }
        if (target !== undefined && target !== null && target !== '') {
          if (typeof target !== 'string' || !/^[a-zA-Z0-9_@.-]{1,50}$/.test(target)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid target: must be 1-50 alphanumeric/_.@- characters' }));
            return;
          }
        }

        // Try OpenAI-compatible endpoint first (most reliable)
        const chatResult = await proxyToOpenClaw('/v1/chat/completions', 'POST', {
          model: agentId ? `openclaw/${agentId}` : 'openclaw/default',
          messages: [
            {
              role: 'system',
              content: 'Kamu adalah Ustaz AI, pembantu Islam yang pakar dalam fiqh, akidah, sirah, dan hukum Islam. Jawab dalam Bahasa Melayu. Rujuk sumber Al-Quran dan Hadis.'
            },
            { role: 'user', content: message }
          ],
          stream: false,
        });

        if (chatResult.status === 200 && chatResult.data?.choices?.[0]) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            response: chatResult.data.choices[0].message?.content || chatResult.data.choices[0].text || '',
            model: chatResult.data.model,
            usage: chatResult.data.usage,
            source: 'openclaw-chat-api',
          }));
          return;
        }

        // Fallback to CLI agent command — args passed as array, no shell interpolation
        const cliArgs: string[] = ['agent', '--message', message];
        if (channel) cliArgs.push('--channel', channel);
        if (target) cliArgs.push('--target', target);
        const cli = runOpenClawCLI(cliArgs, 30000);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ...cli.data,
          source: 'openclaw-cli',
        }));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to send message', message: error.message }));
      }
    });
    return;
  }

  // ─── Schedule Prayer Reminder (Cron) ──────────────────────────────────────
  if (path === '/api/schedule-prayer' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { prayerName, time, channel } = JSON.parse(body);

        // ── Input validation ──
        if (typeof prayerName !== 'string' || !/^[A-Za-z\s]{2,30}$/.test(prayerName)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid prayerName: must be 2-30 letters/spaces only' }));
          return;
        }
        if (typeof time !== 'string' || !/^\d{1,2}:\d{2}$/.test(time)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid time: must be HH:MM format' }));
          return;
        }

        // Build cron expression from validated time
        const timeParts = time.split(':');
        const minute = timeParts[1];
        const hour = timeParts[0];
        const cronExpr = `0 ${minute} ${hour} * * *`;
        const taskDesc = `Prayer reminder: ${prayerName} - It's time for ${prayerName} prayer!`;

        // Pass as array args — no shell interpolation
        const cli = runOpenClawCLI(['cron', 'add', '--schedule', cronExpr, '--task', taskDesc], 5000);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: cli.success,
          scheduled: cli.success,
          prayer: prayerName,
          time,
          ...cli.data,
        }));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to schedule prayer', message: error.message }));
      }
    });
    return;
  }

  // ─── Generate Media (Image/Video/Music) ───────────────────────────────────
  if (path === '/api/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { type, prompt, model } = JSON.parse(body);

        // Use OpenClaw's built-in tools via chat API
        let systemPrompt = '';
        let userPrompt = '';

        switch (type) {
          case 'image':
            systemPrompt = 'Generate Islamic art based on the description. Use halal, non-figurative art styles like calligraphy, geometric patterns, or arabesque.';
            userPrompt = `Generate an image: ${prompt}`;
            break;
          case 'video':
            systemPrompt = 'Generate a short video based on the description.';
            userPrompt = `Generate a video: ${prompt}`;
            break;
          case 'music':
            systemPrompt = 'Generate nasheed or Islamic ambient music without instruments. Use vocal only.';
            userPrompt = `Generate music: ${prompt}`;
            break;
          default:
            systemPrompt = 'Help with the following creative request.';
            userPrompt = prompt;
        }

        const result = await proxyToOpenClaw('/v1/chat/completions', 'POST', {
          model: model || 'openclaw/default',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          tools: type === 'image' ? ['image_generate'] : type === 'video' ? ['video_generate'] : type === 'music' ? ['music_generate'] : [],
          stream: false,
        });

        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ...result.data,
          type,
          source: 'openclaw-generate',
        }));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Generation failed', message: error.message }));
      }
    });
    return;
  }

  // ─── Web Search via OpenClaw ──────────────────────────────────────────────
  if (path === '/api/web-search' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { query } = JSON.parse(body);
        const result = await proxyToOpenClaw('/v1/chat/completions', 'POST', {
          model: 'openclaw/default',
          messages: [
            { role: 'system', content: 'Search the web and provide accurate Islamic knowledge. Cite sources when possible. Respond in Bahasa Melayu.' },
            { role: 'user', content: query },
          ],
          tools: ['web_search', 'web_fetch'],
          stream: false,
        });

        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Web search failed', message: error.message }));
      }
    });
    return;
  }

  // ─── OpenClaw Config ──────────────────────────────────────────────────────
  if (path === '/api/config' && req.method === 'GET') {
    const result = await proxyToOpenClaw('/api/config');
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.data));
    return;
  }

  if (path === '/api/config' && req.method === 'PATCH') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const config = JSON.parse(body);
        const result = await proxyToOpenClaw('/api/config', 'PATCH', config);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Config update failed', message: error.message }));
      }
    });
    return;
  }

  // ─── Default: API Index ───────────────────────────────────────────────────
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    service: 'openclaw-gateway-v2',
    version: '2.0.0',
    description: 'QuranPulse OpenClaw Integration Bridge',
    features: [
      'OpenAI-compatible chat API (/api/chat/completions)',
      'OpenAI-compatible models (/api/models)',
      'Agent messaging (/api/message)',
      'Scheduled tasks (/api/cron, /api/schedule-prayer)',
      'Skills management (/api/skills)',
      'Media generation (/api/generate - image/video/music)',
      'Web search (/api/web-search)',
      'Session management (/api/sessions)',
      'Gateway config (/api/config)',
      'Health monitoring (/health, /api/status)',
    ],
    endpoints: {
      'GET /health': 'Bridge health + OpenClaw reachability',
      'GET /api/status': 'OpenClaw Gateway status',
      'GET /api/sessions': 'Active agent sessions',
      'GET /api/cron': 'Scheduled cron jobs',
      'GET /api/skills': 'Available OpenClaw skills',
      'GET /api/models': 'Available AI models (OpenAI-compat)',
      'GET /api/config': 'OpenClaw configuration',
      'POST /api/message': 'Send message to agent',
      'POST /api/chat/completions': 'OpenAI-compatible chat',
      'POST /api/generate': 'Generate image/video/music',
      'POST /api/web-search': 'Web search via OpenClaw',
      'POST /api/schedule-prayer': 'Schedule prayer reminder',
      'PATCH /api/config': 'Update OpenClaw config',
    },
    openclaw: {
      defaultPort: OPENCLAW_PORT,
      openAICompat: true,
      webSocketChat: true,
      multiChannel: ['whatsapp', 'telegram', 'discord', 'signal', 'webchat'],
    },
  }));
});

server.listen(PORT, () => {
  console.log(`[OpenClaw Gateway v2] API server running on port ${PORT}`);
  console.log(`[OpenClaw Gateway v2] Bridge to OpenClaw on ${OPENCLAW_HOST}:${OPENCLAW_PORT}`);
  console.log(`[OpenClaw Gateway v2] Features: OpenAI-compat API, Media Gen, Web Search, Prayer Scheduling`);
});
