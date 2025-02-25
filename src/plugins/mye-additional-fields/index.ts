import { type BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";
import { z } from "zod";

import { APIError } from "better-auth/api";
import { randomUUID } from "node:crypto";
import { generateAvatar } from "../../lib/helpers";

const SignUpSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phoneNumber: z.string(),
    countryCode: z.string().length(2),
    timezone: z.string(),
    userType: z.enum(["parent", "child"]),
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
    postCode: z.string().optional(),
    role: z.enum(["admin", "user", "cs"]),
    companyUuid: z.string().uuid().optional(),
    image: z.string().url().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.userType === "child" && !val.companyUuid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must provide parent company uuid",
        path: ["companyUuid"],
      });
    }
  });

export function myeAdditionalFields() {
  return {
    id: "mye-plugin",
    schema: {
      user: {
        fields: {
          userType: {
            type: "string",
            required: true,
          },
          phoneNumber: {
            type: "string",
            required: true,
          },
          countryCode: {
            type: "string",
            required: false,
          },
          timezone: {
            type: "string",
            required: false,
          },
          companyUuid: {
            type: "string",
            required: false,
          },
          companyName: {
            type: "string",
            required: false,
          },
          companyAddress: {
            type: "string",
            required: false,
          },
          postCode: {
            type: "string",
            required: false,
          },
          role: {
            type: "string",
            required: true,
            returned: true,
          },
        },
      },
    },

    hooks: {
      before: [
        {
          matcher: (context) => context.path.endsWith("/sign-up/email"),
          handler: createAuthMiddleware(async (ctx) => {
            const result = await SignUpSchema.safeParse(ctx.body);

            if (result.error) {
              throw new APIError("BAD_REQUEST", {
                message: "Validation failed",
                details: result.error,
              });
            }

            ctx.body = result.data;
          }),
        },
      ],
      after: [
        {
          matcher: (context) => context.path.endsWith("/sign-up/email"),
          handler: createAuthMiddleware(async (ctx) => {
            if (ctx.body.userType === "parent") {
              await ctx.context.adapter.update({
                model: "user",
                update: {
                  companyUuid: randomUUID(),
                },
                where: [{ operator: "eq", field: "email", value: ctx.body.email }],
              });
            }

            if (!ctx.body.image) {
              await ctx.context.adapter.update({
                model: "user",
                update: {
                  image: generateAvatar(ctx.body.name),
                },
                where: [{ operator: "eq", field: "email", value: ctx.body.email }],
              });
            }
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
}
