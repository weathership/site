import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  // Production canonical URL. Dev (weathership.zndx.org) reuses the same
  // build, so its canonical/OG metadata also points to weathership.org —
  // intentional, since dev shouldn't be indexed independently.
  site: "https://weathership.org",
  output: "static",
  integrations: [react()],
});
