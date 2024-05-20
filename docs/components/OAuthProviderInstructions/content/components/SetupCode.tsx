import { Code } from "@/components/Code"
import { Pre, Code as NXCode } from "nextra/components"
import { TSIcon } from "./TSIcon"

interface Props {
  providerName: string
  providerId: string
  highlight: (code: string) => string
}

export function SetupCode({ providerId, providerName, highlight }: Props) {
  return (
    <Code>
      <Code.Next>
        In Next.js you should also setup your Auth.js configuration in a file
        at <code>auth.ts</code>.
        <br />
        <Pre
          data-filename="./auth.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          dangerouslySetInnerHTML={{
            __html: highlight(`
import NextAuth from "next-auth"
import ${providerName} from "next-auth/providers/${providerId}"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [${providerName}],
})`),
          }}
        />
        <br />
        Add the <code>handlers</code> which <code>NextAuth</code> returns to
        your <code>api/auth/[...nextauth]/route.ts</code> file so that Auth.js can run on any
        incoming request.
        <Pre
          data-filename="./app/api/auth/[...nextauth]/route.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          dangerouslySetInnerHTML={{
            __html: highlight(`
import { handlers } from "@/auth"
export const { GET, POST } = handlers
`),
          }}
        />
      </Code.Next>
      <Code.Svelte>
        In SvelteKit you should also setup your Auth.js configuration in a file
        at <code>/src/auth.ts</code>.
        <br />
        <Pre
          data-filename="./src/auth.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          dangerouslySetInnerHTML={{
            __html: highlight(`
import { SvelteKitAuth } from "@auth/sveltekit"
import ${providerName} from "@auth/sveltekit/providers/${providerId}"
 
export const { handle, signIn } = SvelteKitAuth({
  providers: [${providerName}],
}) `),
          }}
        />
        <br />
        Add the <code>handler</code> which <code>SvelteKitAuth</code> returns to
        your <code>hooks.server.ts</code> file so that Auth.js can run on any
        incoming request.
        <Pre
          data-filename="./src/hooks.server.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          dangerouslySetInnerHTML={{
            __html: highlight(`export { handle } from "./auth"`),
          }}
        />
        <br />
        Finally, using your <code>+layout.server.ts</code> we can add the{" "}
        <code>session</code> object onto the <code>$page</code> store so that
        the session is easy to access in your routes and components. For
        example, on <code>$page.data.session</code>.
        <Pre
          data-filename="./src/routes/+layout.server.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          dangerouslySetInnerHTML={{
            __html: highlight(`
import type { LayoutServerLoad } from "./$types"
 
export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth()
 
  return {
    session,
  }
}`),
          }}
        />
      </Code.Svelte>
      <Code.Express>
        <Pre
          data-filename="./src/routes/auth.route.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          dangerouslySetInnerHTML={{
            __html: highlight(`
import { ExpressAuth } from "@auth/express"
import ${providerName} from "@auth/express/providers/${providerId}"
import express from "express"
 
const app = express()
 
// If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
app.set('trust proxy', true)
app.use("/auth/*", ExpressAuth({ providers: [ ${providerName} ] }))
`),
          }}
        />
      </Code.Express>
    </Code>
  )
}
