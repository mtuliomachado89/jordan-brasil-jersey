import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import checkoutHandler from "./api/checkout";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API checkout route bridge
  app.post("/api/checkout", async (req, res) => {
    try {
      await checkoutHandler(req as any, res as any);
    } catch (err: any) {
      console.error("[Checkout Bridge Error]", err);
      res.status(500).json({ error: err.message || "Erro interno de processamento" });
    }
  });

  // Vite development middleware vs production static server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
