import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "sigma72hq" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
