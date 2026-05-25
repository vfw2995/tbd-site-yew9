import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "19010", 10);
const DIST = path.join(__dirname, "dist/public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) return null;
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": mime,
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    });
    res.end(data);
    return true;
  });
}

const server = http.createServer((req, res) => {
  let urlPath = (req.url || "/").split("?")[0];

  // Strip workspace preview prefix so the dev proxy and custom domain both work
  urlPath = urlPath.replace(/^\/amanda-creter-mortgage/, "") || "/";

  // Resolve to a real file path
  const filePath = path.join(DIST, urlPath);

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      // Exact file match
      serveFile(filePath, res);
    } else {
      // SPA fallback — serve index.html for any non-file path
      const indexPath = path.join(DIST, "index.html");
      fs.readFile(indexPath, (err2, html) => {
        if (err2) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not found");
          return;
        }
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        });
        res.end(html);
      });
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Amanda static server running on port ${PORT}`);
});
