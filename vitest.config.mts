import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/testing/setup.ts"],
  },

  resolve: {
    alias: {
      "server-only": fileURLToPath(
        new URL("./src/testing/server-only.ts", import.meta.url)
      ),
    },
    tsconfigPaths: true,
  },
});
