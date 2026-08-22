import express from "express";
import { apiRouter } from "../server/apiRouter";

const app = express();

// Disable x-powered-by
app.disable("x-powered-by");

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Enable CORS for Vercel edge/subdomain requests
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (_req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Support both /api/* and root mount
app.use("/api", apiRouter);
app.use("/", apiRouter);

// Express global error handler to prevent unhandled 500 crash
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Vercel API Handler Error]:", err);
  res.status(500).json({
    error: err?.message || "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err?.stack : undefined,
  });
});

export default app;
