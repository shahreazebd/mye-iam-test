import { betterAuth } from "better-auth";
import { env } from "./env";
import { myeAdditionalFields } from "../plugins/mye-additional-fields";
import { bearer, jwt, openAPI } from "better-auth/plugins";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

import pg from "pg";
const { Pool } = pg;

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.BETTER_AUTH_URL, "https://www.manageyourecommerce.com"],

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          userType: "parent",
          phoneNumber: "n/a",
          countryCode: "n/a",
          timezone: "n/a",
          role: "admin",
          companyUuid: randomUUID(),
        };
      },
    },
  },
  plugins: [
    openAPI(),
    bearer(),
    jwt({ jwt: { expirationTime: "5m" } }),
    myeAdditionalFields(),
  ],
});

try {
  await fs.access("openapi.json");
} catch (e) {
  const schema = await auth.api.generateOpenAPISchema();
  await fs.writeFile("openapi.json", JSON.stringify(schema, null, 2));
}
