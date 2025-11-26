import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Izinkan server berjalan di IP cloud (0.0.0.0)
    host: "0.0.0.0",
    // PENTING: Izinkan semua host agar CodeSandbox tidak memblokir preview
    allowedHosts: true,
  },
});
