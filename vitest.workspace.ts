import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./website/vite.config.ts",
  "./webapp_v2/vitest.config.ts",
  "./admin_v2/vitest.config.ts",
  "./customer_configs/vitest.config.ts"
])
