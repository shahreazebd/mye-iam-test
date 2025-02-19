import { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";

export function userRoutes() {
  return {
    id: "userRoutes",
    endpoints: {
      getHelloWorld: createAuthEndpoint(
        "/users/list",
        {
          method: "GET",
        },
        async (ctx) => {
          const user = await ctx.context.adapter.findMany({ model: "user" });
          return ctx.json({
            message: user,
          });
        }
      ),
    },
  } satisfies BetterAuthPlugin;
}
