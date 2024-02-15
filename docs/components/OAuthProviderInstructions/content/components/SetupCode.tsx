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
        <Pre
          data-filename="@/auth"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight(`
import NextAuth from "next-auth"
import ${providerName} from "next-auth/providers/${providerId}"

export const { signIn, signOut, auth } = NextAuth({
  providers: [${providerName}],
})`),
              }}
            />
          </NXCode>
        </Pre>
      </Code.Next>
      <Code.Svelte>
        <Pre
          data-filename="./src/auth.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight(`
import { SvelteKitAuth } from "@auth/sveltekit"
import ${providerName} from "@auth/sveltekit/providers/${providerId}"

export const { handle } = SvelteKitAuth({
  providers: [${providerName}],
}) `),
              }}
            />
          </NXCode>
        </Pre>
        <Pre
          data-filename="./src/hooks.server.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight(`export { handle } from "./auth"`),
              }}
            />
          </NXCode>
        </Pre>
      </Code.Svelte>
      <Code.Express>
        <Pre
          data-filename="./src/routes/auth.route.ts"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight(`
import { ExpressAuth } from "@auth/express"
import ${providerName} from "@auth/express/providers/${providerId}"
import express from "express"

const app = express()

// If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
app.use('trust proxy')
app.use("/auth/*", ExpressAuth({ providers: [ GitHub ] }))
`),
              }}
            />
          </NXCode>
        </Pre>
      </Code.Express>
    </Code>
  )
}
