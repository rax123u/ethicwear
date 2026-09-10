import { writeFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const ORBIT_CONFIG_STUB = [
  "window.ORBIT_PUBLIC_API = {",
  '  baseUrl: "/api/public/v1",',
  '  apiKey: "",',
  "};",
  "",
].join("\n");

function orbitLocalConfig(apiKey: string): Plugin {
  const source = [
    "window.ORBIT_PUBLIC_API = {",
    '  baseUrl: "/api/public/v1",',
    `  apiKey: ${JSON.stringify(apiKey)},`,
    "};",
    "",
  ].join("\n");

  return {
    name: "orbit-local-config",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/config.js") {
          next();
          return;
        }

        res.setHeader("Content-Type", "application/javascript");
        res.setHeader("Cache-Control", "no-store");
        res.end(source);
      });
    },
  };
}

function orbitProductionConfig(): Plugin {
  return {
    name: "orbit-production-config",
    apply: "build",
    closeBundle() {
      writeFileSync(
        fileURLToPath(new URL("./dist/config.js", import.meta.url)),
        ORBIT_CONFIG_STUB,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    envPrefix: "VITE_",
    plugins: [
      orbitLocalConfig(env.ORBIT_API_KEY ?? ""),
      orbitProductionConfig(),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      emptyOutDir: true,
      sourcemap: false,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            motion: ["lenis"],
          },
        },
      },
    },
  };
});
