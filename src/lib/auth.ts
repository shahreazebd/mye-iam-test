import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { env } from "./env";
import { myePlugin } from "../plugins/mye";
import { bearer, jwt, openAPI } from "better-auth/plugins";
import { myeRBAC } from "../plugins/rbac";

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
  plugins: [openAPI(), bearer(), jwt(), myePlugin(), myeRBAC()],
});
