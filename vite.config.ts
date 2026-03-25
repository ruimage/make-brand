import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: true,
    exports: true,
  },
  lint: {
    ignorePatterns: ["vite.config.ts", "bumpp.config.ts"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
