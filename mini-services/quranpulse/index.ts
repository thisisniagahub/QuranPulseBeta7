import { serve } from "bun";

const PORT = 5173;
const DIST_DIR = "/home/z/QuranPulse-v6.0/dist";

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    // SPA fallback: serve index.html for all non-file routes
    // Try to serve the file first, if not found, serve index.html
    if (path === "/") path = "/index.html";

    try {
      const file = Bun.file(DIST_DIR + path);
      if (await file.exists()) {
        return new Response(file);
      }
    } catch {
      // File not found, fall through to index.html
    }

    // SPA fallback
    try {
      const indexFile = Bun.file(DIST_DIR + "/index.html");
      if (await indexFile.exists()) {
        return new Response(indexFile, {
          headers: { "Content-Type": "text/html" },
        });
      }
    } catch {
      // index.html not found
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`QuranPulse static server running on http://localhost:${PORT}`);
