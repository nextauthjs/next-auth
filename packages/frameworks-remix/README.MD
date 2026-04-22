Remix Auth is a Remix integration for Auth.js.
It provides a simple way to add authentication to your Remix app in a few lines of code.

## Installation

```bash npm2yarn2pnpm
npm install @auth/core @auth/remix
```

## Configuration

In your remix.config.js we need to add the esm modules so they are properly bundled.

This will always include @auth/core, oauth4webapi, preact-render-to-string and any providers you use.

e.g

```js title="remix.config.js"

module.exports = {
  ...
  serverDependenciesToBundle: [
    "@auth/core",
    "oauth4webapi",
    "preact-render-to-string",
    "@auth/core/providers/google",
  ],
};

```

## Usage

Create a .server file to create and access the authenticator

```ts title="services/auth.server.ts"
import { RemixAuthenticator } from "remix-auth/src/lib"
import Google from "@auth/core/providers/google"
import type { AppLoadContext } from "@remix-run/cloudflare"
import { D1Adapter } from "@auth/adapter-d1"

// Create an instance of the authenticator
let authenticator: RemixAuthenticator<Record<string, unknown>>

export const getAuthenticator = (env: Record<string, any> | AppLoadContext) => {
  if (!authenticator) {
    authenticator = new RemixAuthenticator(
      {
        session: {
          strategy: "jwt",
        },
        debug: env.NODE_ENV === "development",
        adapter: D1Adapter(env["vsle-keystone"] as D1Database),
        providers: [
          Google({
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
          }) as unknown as any,
        ],
      },
      env
    )
  }
  return authenticator
}
```

Create a route for your auth, this is most simply done using optional routes like file named `auth.$action.($providerId).tsx`

WARNING: In order to fully and securely support progressive enhancement for auth actions (automatically handling getting csrf tokens regardless of javascript) this route MUST be a [Resource Route](https://remix.run/docs/en/v1/guides/api-routes#resource-routes).

Relevant remix discussion (here)[https://github.com/remix-run/remix/discussions/5258]

```ts title="auth.$action.($providerId).tsx"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { getAuthenticator } from "~/services/auth.server"

export let loader: LoaderFunction = async ({ request, params, context }) => {
  const result = getAuthenticator(
    context.env as Record<string, string>
  ).handleAuthRoute({
    request,
    action: params.action!,
    providerId: params.providerId,
    params,
  })
  return result
}

export let action: ActionFunction = async ({ request, params, context }) => {
  const result = getAuthenticator(
    context.env as Record<string, string>
  ).handleAuthRoute({
    request,
    action: params.action!,
    providerId: params.providerId,
    params,
  })
  return result
}
```

Don't forget to set the `AUTH_SECRET` [environment variable](https://kit.svelte.dev/docs/modules#$env-static-private). This should be a random 32 character string. On unix systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.

When deploying your app outside Vercel, set the `AUTH_TRUST_HOST` variable to `true` for other hosting providers like Cloudflare Pages or Netlify.

The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you override {@link SvelteKitAuthConfig.prefix}:

```
[origin]/auth/callback/[provider]
```

## Signing in, signing out and getting the user

(and yes it takes advantage of remix's progressive enhancement and works without javascript!)

!WARN for email you will likely need to alter the route or the login page to properly handle the response from email which should give a message that an email has been sent

```ts title="index.tsx"
import { getAuthenticator } from "~/services/auth.server"
import type { DataFunctionArgs } from "@remix-run/cloudflare"
import { useRef } from "react"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { SignInForm, SignOutForm } from "remix-auth/src/lib/components"
export const loader = async ({ request, context }: DataFunctionArgs) => {
  const authenticator = getAuthenticator(context.env as Record<string, any>)
  const providers = await authenticator.getProviders(request)
  const user = await authenticator.isAuthenticated(request)
  return { user, providers }
}

export default function Auth() {
  const { user, providers } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const loading = fetcher.state === "loading" || fetcher.state === "submitting"
  const signOutForm = useRef<HTMLFormElement>(null)
  return (
    <div className="">
      <section className="container">
        {user ? (
          <div>
            <h1 className="">{user.name}</h1>
            <SignOutForm ref={signOutForm} fetcher={fetcher}>
              <button disabled={loading} aria-busy={loading}>
                Sign Out
              </button>
            </SignOutForm>
          </div>
        ) : (
          <>
            {Object.entries(providers).map(([key, provider]) => {
              return (
                <SignInForm
                  fetcher={fetcher}
                  providerId={provider.id}
                  key={key}
                >
                  <input
                    type="hidden"
                    name="callbackUrl"
                    value={
                      typeof document !== "undefined"
                        ? window.location.href
                        : ""
                    }
                  />
                  {provider.type === "email" && (
                    <>
                      <label htmlFor="email">Email address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email address"
                        required
                      />
                    </>
                  )}
                  <button disabled={loading} aria-busy={loading}>
                    Sign In with {provider.name}
                  </button>
                </SignInForm>
              )
            })}
          </>
        )}
      </section>
    </div>
  )
}
```

Special thanks to Sergio Xalambrí of https://github.com/sergiodxa/remix-auth / https://sergiodxa.com
