import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";
// import { createAuthMiddleware } from "better-auth/plugins";

export function birthdayPlugin() {
  return {
    id: "birthdayPlugin",
    schema: {
      user: {
        fields: {
          birthday: {
            type: "date",
            required: true,
            unique: false,
          },
        },
      },
    },

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
