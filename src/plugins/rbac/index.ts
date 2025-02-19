import { type BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/plugins";

export function myeRBAC() {
  return {
    id: "rbac",
    schema: {
      rbac: {
        fields: {
          role: {
            type: "string",
            required: true,
          },
          permissions: {
            type: "string[]",
            required: true,
          },
        },
      },
    },

    endpoints: {
      getHelloWorld: createAuthEndpoint(
        "/rbac/list",
        {
          method: "GET",
        },
        async (ctx) => {
          const res = await ctx.context.adapter.findMany({
            model: "rbac",
          });

          console.log(res);

          return ctx.json({
            data: res,
          });
        }
      ),
    },
  } satisfies BetterAuthPlugin;
}
