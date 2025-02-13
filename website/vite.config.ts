import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
// import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    tailwindcss(),
    solidPlugin(),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: "bin/example.wasm",
    //       dest: "wasm-files",
    //     },
    //   ],
    // }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
