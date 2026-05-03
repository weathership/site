import { Hono } from "hono";

type Env = {
  Bindings: {
    ASSETS: { fetch: (req: Request) => Promise<Response> };
  };
};

const app = new Hono<Env>();

app.get("/health", (c) => c.text("ok\n"));

app.all("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
