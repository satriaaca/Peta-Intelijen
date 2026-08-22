import express, { Request, Response } from "express";
import { apiRouter } from "../server/apiRouter";

const app = express();

app.use(express.json({ limit: "15mb" }));

// Enable CORS for Vercel edge/subdomain requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Mount all API endpoints both directly and at /api
app.use("/api", apiRouter);
app.use("/", apiRouter);

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
