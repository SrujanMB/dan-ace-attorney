import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const PORT = Number(process.env.CLIENT_PORT) || 5000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: PORT,
    host: true,
  },
});
