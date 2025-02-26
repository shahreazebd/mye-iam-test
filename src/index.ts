import { Hono } from "hono";
import { auth } from "./lib/auth"; // path to your auth file

import { cors } from "hono/cors";
import { env } from "./lib/env";

const app = new Hono();

import openapi from "../openapi.json";

app.use(cors());

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.json({ status: "Ok", timestamp: Date.now() });
});

app.get("/dashboard", (c) => {
  return c.json({ status: "Dashboard", timestamp: Date.now() });
});

app.get("/doc", (c) => {
  return c.json(openapi);
});

export default {
  fetch: app.fetch,
  port: env.PORT,
};
