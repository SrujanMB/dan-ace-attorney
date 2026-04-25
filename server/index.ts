import express from "express";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

const PORT = Number(process.env.SERVER_PORT) || 3000;
const HOST = "0.0.0.0";

httpServer.listen(PORT, HOST, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
