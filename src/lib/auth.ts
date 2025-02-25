import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { env } from "./env";
import { myePlugin } from "../plugins/mye";
import { bearer, jwt, multiSession, openAPI } from "better-auth/plugins";
import { myeRBAC } from "../plugins/rbac";

import fs from "node:fs/promises";

const dialect = new LibsqlDialect({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const auth = betterAuth({
  database: {
    dialect,
    type: "sqlite",
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    openAPI(),
    bearer(),
    jwt({ jwt: { expirationTime: "5m" } }),
    multiSession({ maximumSessions: 1 }),
    myePlugin(),
    myeRBAC(),
  ],
});

try {
  await fs.access("openapi.json");
} catch (e) {
  const schema = await auth.api.generateOpenAPISchema();
  await fs.writeFile("openapi.json", JSON.stringify(schema, null, 2));
}
