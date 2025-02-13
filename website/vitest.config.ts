// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'v8'
      exclude: [
        "src/components/icons/**",
        "vite.config.ts",
        "vitest.config.ts",
        "dist/**",
        "src/types.ts",
        "src/assets/**",
        "src/generated_app_info.ts",
        "src/db/firebase_init.ts",
        "tests/**",
        "src/App.tsx",
        "src/index.tsx",
      ],
    },
  },
});
