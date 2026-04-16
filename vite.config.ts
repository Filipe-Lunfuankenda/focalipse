import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readFileSync, rmSync } from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8")) as { version: string };
  const appVersion = mode === "production" ? `${packageJson.version}-${Date.now()}` : `${packageJson.version}-dev`;

  return {
    base: mode === "production" ? "/focalipse/" : "/",
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
    },
    server: {
      host: "::",
      port: 7078,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      {
        name: "emit-version-file",
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "version.json",
            source: JSON.stringify({ version: appVersion }, null, 2),
          });
        },
      },
      {
        name: "emit-legal-and-readme-files",
        generateBundle() {
          const legalFiles = [
            { source: "./README.md", target: "README.md" },
            { source: "./LICENSE", target: "LICENSE" },
            { source: "./CONCEPT-LICENSE.txt", target: "CONCEPT-LICENSE.txt" },
          ];

          for (const file of legalFiles) {
            this.emitFile({
              type: "asset",
              fileName: file.target,
              source: readFileSync(new URL(file.source, import.meta.url), "utf-8"),
            });
          }
        },
      },
      {
        name: "remove-public-about-from-build",
        writeBundle() {
          rmSync("dist/about", { recursive: true, force: true });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // ─── VENDOR CHUNKS ───
            // Split large dependencies into separate chunks
            if (id.includes('node_modules')) {
              if (id.includes('framer-motion')) {
                return 'chunk-framer';
              }
              if (id.includes('react-router-dom')) {
                return 'chunk-router';
              }
              if (id.includes('@radix-ui') || id.includes('@tabler/icons') || id.includes('lucide-react')) {
                return 'chunk-ui';
              }
              if (id.includes('@tanstack')) {
                return 'chunk-query';
              }
              return 'vendor';
            }
            
            // ─── FEATURE CHUNKS ───
            // Large interactive sections get their own chunks
            if (id.includes('/components/GeneratorSection')) {
              return 'chunk-generator';
            }
            if (id.includes('/components/VerifierSection')) {
              return 'chunk-verifier';
            }
            if (id.includes('/components/ArticlesSection') || 
                id.includes('/components/DifferencesSection') ||
                id.includes('/components/FooterSection')) {
              return 'chunk-sections';
            }
            
            // ─── I18N CHUNK ───
            // Keep translations separate
            if (id.includes('/i18n/')) {
              return 'chunk-i18n';
            }
          }
        }
      },
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
    },
  };
});
