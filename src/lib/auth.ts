import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { env } from "./env";
import { birthdayPlugin } from "../plugins/bday-plugin";
import { bearer, jwt, openAPI } from "better-auth/plugins";
import { userRoutes } from "../plugins/user";

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
  plugins: [birthdayPlugin(), openAPI(), userRoutes(), bearer(), jwt()],
});
