import express, { type Request, Response, NextFunction } from "express";
import net from "node:net";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function checkPortAvailability(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const tester = net
      .createServer()
      .once("error", (error) => {
        if ((error as NodeJS.ErrnoException).code === "EADDRINUSE") {
          resolve(false);
        } else {
          reject(error);
        }
      })
      .once("listening", () => {
        tester.close(() => resolve(true));
      })
      .listen(port, "0.0.0.0");
  });
}

async function findAvailablePort(preferredPort: number, attempts = 10): Promise<number> {
  let port = preferredPort;
  for (let i = 0; i < attempts; i++) {
    const available = await checkPortAvailability(port);
    if (available) {
      return port;
    }
    port += 1;
  }
  throw new Error(`Unable to find an open port starting at ${preferredPort}`);
}

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || '5000', 10);
  let port: number;

  try {
    port = await findAvailablePort(preferredPort);
  } catch (error) {
    log(`unable to start dev server: ${(error as Error).message}`);
    process.exit(1);
    return;
  }

  if (port !== preferredPort) {
    log(`port ${preferredPort} is busy, switched to ${port}`);
  }

  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
