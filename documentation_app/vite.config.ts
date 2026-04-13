import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/dualsense-ts/",
  resolve: {
    preserveSymlinks: true,
  },
});
