import { Hono } from "hono";
import { auth } from "./lib/auth"; // path to your auth file
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { env } from "./lib/env";

const app = new Hono();

app.use(cors());

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.json({ status: "Ok", timestamp: Date.now() });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
  }
);
