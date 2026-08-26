import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// The site owns every image it imports. The Netlify adapter provides the
// production server integration through TanStack Start's supported entrypoint.
export default defineConfig({
  plugins: [tanstackStart(), react(), tailwindcss(), tsconfigPaths(), netlify()],
});
