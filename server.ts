import express from "express";
import path from "path";
import https from "https";
import http from "http";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Proxy endpoint for JAMPIDUM API
  // URL: https://jampidum.kejaksaan.go.id/web/api/perkara/info/:year/:satker
  app.get("/api/jampidum-perkara", async (req, res) => {
    const year = (req.query.year as string) || "2026";
    const satker = (req.query.satker as string) || "22.08";
    const timestamp = req.query._ || Date.now().toString();

    const targetUrl = `https://jampidum.kejaksaan.go.id/web/api/perkara/info/${encodeURIComponent(year)}/${encodeURIComponent(satker)}?_=${timestamp}`;

    const requestOptions = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://jampidum.kejaksaan.go.id/",
      },
      // Allow self-signed or internal gov certificates if needed
      agent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 15000,
    };

    https
      .get(targetUrl, requestOptions, (apiRes) => {
        let rawData = "";

        apiRes.on("data", (chunk) => {
          rawData += chunk;
        });

        apiRes.on("end", () => {
          try {
            const parsed = JSON.parse(rawData);
            res.setHeader("Cache-Control", "public, max-age=300"); // 5 min cache
            res.json(parsed);
          } catch (e: any) {
            console.error("Failed to parse JAMPIDUM JSON response:", e.message);
            res.status(502).json({
              success: false,
              message: "Invalid response from JAMPIDUM server",
              error: e.message,
              rawSnippet: rawData.slice(0, 200),
            });
          }
        });
      })
      .on("error", (err) => {
        console.error("Error contacting JAMPIDUM API:", err.message);
        res.status(500).json({
          success: false,
          message: "Gagal terhubung ke server JAMPIDUM Kejaksaan RI",
          error: err.message,
        });
      });
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
