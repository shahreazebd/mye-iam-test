import { ZodError, z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  PORT: z.coerce.number().default(3000),
  BETTER_AUTH_SECRET: z.string().default("secret"),
  BETTER_AUTH_URL: z.string().default("http://localhost:3000"),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
});

export let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(Bun.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.error("Invalid env");
    console.error(error.flatten().fieldErrors);

    process.exit(1);
  }
}
