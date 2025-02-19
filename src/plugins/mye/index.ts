import { type BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";
// import { createAuthMiddleware } from "better-auth/plugins";
import { z } from "zod";

import { APIError } from "better-auth/api";

const SignUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    phoneNumber: z.string(),
    countryCode: z.string().length(2),
    timezone: z.string(),
    birthday: z.string(),
    userType: z.enum(["parent", "child"]),
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
    postCode: z.string().optional(),
    role: z.enum(["admin", "user"]),
    companyUuid: z.string().optional(),
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

export function myePlugin() {
  return {
    id: "mye-plugin",
    schema: {
      user: {
        fields: {
          birthday: {
            type: "date",
            required: true,
          },
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
            // returned: true,
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
            required: false,
          },
        },
      },
    },

    middlewares: [
      {
        path: "/sign-up/email",
        middleware: createAuthMiddleware(async (ctx) => {
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

    // hooks: {
    //   after: [
    //     {
    //       matcher: (context) => context.path.endsWith("/sign-in/email"),
    //       handler: createAuthMiddleware(async (ctx) => {
    //         const user = await ctx.context.adapter.findMany({
    //           model: "user",
    //           where: [{ operator: "eq", field: "email", value: ctx.body.email }],
    //         });

    //         // const { bir } = ctx.body;
    //         // return { context: ctx };
    //       }),
    //     },
    //   ],
    // },
  } satisfies BetterAuthPlugin;
}
