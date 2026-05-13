import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwindcss from "@tailwindcss/vite";

const PORT = Number(process.env.CLIENT_PORT) || 5000;
const SOCKET_PORT = Number(process.env.SERVER_PORT) || 3000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [basicSsl(), react(), tailwindcss()],
  server: {
    allowedHosts: ["ace.srujanmb.com"],
    port: PORT,
    host: true,
    proxy: {
      // Proxy the socket.io server for secure context
      "/socket.io": {
        target: `http://localhost:${SOCKET_PORT}`,
        ws: true, // Crucial for WebSockets
        rewrite: (path) => path.replace(/^\/socket.io/, "/socket.io"),
      },
    },
  },
});
