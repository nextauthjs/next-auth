Remix Auth is a Remix integration for Auth.js.
It provides a simple way to add authentication to your Remix app in a few lines of code.

## Installation

```bash npm2yarn2pnpm
npm install @auth/core @auth/remix
```

## Usage

Replace the return of createRequestHandler with the return of createRequestHandlerWithAuth.

createRequestHandlerWithAuth takes the following arguments:
req: Request
env: Record<string, string> - the environment variables including AUTH_SECRET
context: Record<string, any> - the context object to add the getSession function to that can be accessed in your loaders
authConfig: RemixAuthConfig - the auth config

e.g if using express

```js title="remix.config.js"
module.exports = {
  ...,
  server: "./server.ts",
  serverDependenciesToBundle: ["@auth/core", "@auth/remix"],
}
```

```ts title="server.ts"
const context = {
  data: {},
}
const requestHandler = createRequestHandler({
  build: require(BUILD_DIR),
  mode: process.env.NODE_ENV,
  getLoadContext: (res: any, req: any) => ({ env: process.env, ...context }),
})

app.all("*", (req: Request, res: any, next: any) => {
  console.log("request made", req.url)
  process.env.NODE_ENV === "development" && purgeRequireCache()
  createRequestHandlerWithAuth(
    req,
    process.env,
    context.data,
    {
      providers: [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ],
    },
    async () => {
      await requestHandler(req, res, next)
      return res
    }
  )
})
```

Or if using cloudflare pages

```ts title="server.ts"
const pagesFunctionHandler = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => ({ data: context.data, env: context.env }),
})

export function onRequest(context: EventContext<any, any, any>) {
  return createRequestHandlerWithAuth(
    context.request,
    context.env,
    context.data,
    {
      providers: [
        GitHub({
          clientId: context.env.GOOGLE_CLIENT_ID!,
          clientSecret: context.env.GOOGLE_CLIENT_SECRET!,
        }) as unknown as Provider<Profile>,
      ],
    },
    () => pagesFunctionHandler(context)
  )
}
```

the getSession function is added to the context.data object

Don't forget to set the `AUTH_SECRET` [environment variable](https://kit.svelte.dev/docs/modules#$env-static-private). This should be a random 32 character string. On unix systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.

When deploying your app outside Vercel, set the `AUTH_TRUST_HOST` variable to `true` for other hosting providers like Cloudflare Pages or Netlify.

The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you override {@link SvelteKitAuthConfig.prefix}:

```
[origin]/auth/callback/[provider]
```

## Signing in and signing out

```ts
import { signIn, signOut } from "@auth/remix/client"
export let loader: LoaderFunction = async ({ context }) => {
  const session = await (context.data as Record<string, any>).getSession()
  return { session }
}
export default function App() {
  const { session } = useLoaderData()

  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Div100vh>
          {session?.user ? (
            <div>
              <h1 className="text-center text-4xl">{session?.user?.name}</h1>
              <button color="secondary" onClick={() => signOut()}>
                Sign Out
              </button>
            </div>
          ) : (
            <button color="primary" onClick={() => signIn("google")}>
              Sign In with Google
            </button>
          )}
          <Outlet />
          <ScrollRestoration /> <Scripts /> <LiveReload />
        </Div100vh>
      </body>
    </html>
  )
}
```

Special thanks to Sergio Xalambrí of https://github.com/sergiodxa/remix-auth / https://sergiodxa.com
