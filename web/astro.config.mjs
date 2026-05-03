import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://weathership.zndx.org",
  output: "static",
  integrations: [react()],
});
