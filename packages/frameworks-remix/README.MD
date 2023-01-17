Remix Auth is a Remix integration for Auth.js.
It provides a simple way to add authentication to your Remix app in a few lines of code.

## Installation

```bash npm2yarn2pnpm
npm install @auth/core @auth/remix
```

## Usage

Create a .server file to create and access the authenticator
```ts title="services/auth.server.ts"
import { RemixAuthenticator } from "remix-auth/src/lib";
import Google from "@auth/core/providers/google";
import type { AppLoadContext } from "@remix-run/cloudflare";

// Create an instance of the authenticator
let authenticator: RemixAuthenticator<{ user: any }>;

export const getAuthenticator = (
  env: Record<string, string | undefined> | AppLoadContext
) => {
  if (!authenticator) {
    authenticator = new RemixAuthenticator(
      {
        debug: false, // env.NODE_ENV === "development",
        providers: [
          Google({
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
          }) as unknown as any,
        ],
      },
      env
    );
  }
  return authenticator;
};


```

Create a route for your auth, this is most simply done using optional routes like file named `auth.($action).($providerId).tsx`

```ts title="auth.($action).($providerId).tsx"
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request, params, context }) => {
  const result = getAuthenticator(
    context.env as Record<string, string>
  ).handleAuthRoute({
    request,
    action: params.action!,
    providerId: params.providerId,
    params,
  });
  return result;
};

export let action: ActionFunction = async ({ request, params, context }) => {
  const result = getAuthenticator(
    context.env as Record<string, string>
  ).handleAuthRoute({
    request,
    action: params.action!,
    providerId: params.providerId,
    params,
  });
  return result;
};

```



Don't forget to set the `AUTH_SECRET` [environment variable](https://kit.svelte.dev/docs/modules#$env-static-private). This should be a random 32 character string. On unix systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.

When deploying your app outside Vercel, set the `AUTH_TRUST_HOST` variable to `true` for other hosting providers like Cloudflare Pages or Netlify.

The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you override {@link SvelteKitAuthConfig.prefix}:

```
[origin]/auth/callback/[provider]
```

## Signing in, signing out and getting the user

```ts title="index.tsx"
import type { LoaderFunction } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/services/auth.server";
export let loader: LoaderFunction = async ({ request, context }) => {
  const user = await getAuthenticator(
    context.env as Record<string, string>
  ).isAuthenticated(request);

  return { user };
};
export default function Index() {
  const { user } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {user ? (
        <div>
          <h1 className="text-center text-4xl">{user.name}</h1>
          <fetcher.Form method="post" action="/auth/signout/google">
            <p>
              <button
                type="submit"
                disabled={fetcher.state === "submitting"}
              >
                Sign Out
              </button>
            </p>
          </fetcher.Form>
        </div>
      ) : (
        <fetcher.Form method="post" action="/auth/signin/google">
          <p>
            <button
              type="submit"
              disabled={fetcher.state === "submitting"}
            >
              Sign In
            </button>
          </p>
        </fetcher.Form>
      )}
    </div>
  );
}


```

Special thanks to Sergio Xalambrí of https://github.com/sergiodxa/remix-auth / https://sergiodxa.com
