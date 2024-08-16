import { useEffect, useState } from "react"
import { type Highlighter, getHighlighter } from "shiki"
import cx from "classnames"
import { Callout, Pre, Code as NXCode } from "nextra/components"

import { StepTitle } from "./components/StepTitle"
import { SetupCode } from "./components/SetupCode"
import { SignInCode } from "./components/SignInCode"
import { Link } from "@/components/Link"
import { Code } from "@/components/Code"
import manifest from "@/data/manifest.json"

interface Props {
  providerId: string
  disabled?: boolean
}

export function OAuthInstructions({ providerId, disabled = false }: Props) {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)
  useEffect(() => {
    ;(async () => {
      const hl = await getHighlighter({
        themes: ["github-light", "github-dark"],
        langs: ["ts", "tsx", "bash"],
      })
      setHighlighter(hl)
    })()
  }, [])

  const highlight = (code: string): string => {
    if (!highlighter) return ""
    return highlighter.codeToHtml(code, {
      lang: "tsx",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    })
  }

  const providerName = manifest.providersOAuth[providerId]

  return (
    <div
      className={cx(
        "nextra-steps ml-4 mb-12 border-l border-gray-200 pl-6 dark:border-neutral-800 [counter-reset:step]",
        { "pointer-events-none opacity-40": disabled }
      )}
    >
      {/* Step 1 */}
      <StepTitle>Register OAuth App in {providerName}'s dashboard</StepTitle>
      <p className="mt-6 leading-7 first:mt-0">
        First you have to setup an OAuth application on the {providerName}{" "}
        developers dashboard.
      </p>
      <Callout>
        If you haven’t used OAuth before, you can read the beginners
        step-by-step guide on{" "}
        <Link href="/guides/configuring-github">
          how to setup "Sign in with GitHub" with Auth.js
        </Link>
        .
      </Callout>
      <p className="mt-6 leading-7 first:mt-0">
        When registering an OAuth application on {providerName}, they will all
        ask you to enter your application’s callback URL. See below for the
        callback URL you must insert based on your framework.
      </p>
      <h4 className="mt-4 -mb-3 text-lg font-bold">Callback URL</h4>
      <Code>
        <Code.Next>
          <Pre data-copy="">
            <NXCode>
              <span>{`[origin]/api/auth/callback/${providerId}`}</span>
            </NXCode>
          </Pre>
        </Code.Next>
        <Code.Qwik>
          <Pre data-copy="">
            <NXCode>
              <span>{`[origin]/auth/callback/${providerId}`}</span>
            </NXCode>
          </Pre>
        </Code.Qwik>
        <Code.Svelte>
          <Pre data-copy="">
            <NXCode>
              <span>{`[origin]/auth/callback/${providerId}`}</span>
            </NXCode>
          </Pre>
        </Code.Svelte>
        <Code.Express>
          <Pre data-copy="">
            <NXCode>
              <span>{`[origin]/auth/callback/${providerId}`}</span>
            </NXCode>
          </Pre>
        </Code.Express>
      </Code>
      <Callout type="info">
        Many providers only allow you to register one callback URL at a time.
        Therefore, if you want to have an active OAuth configuration for
        development and production environments, you'll need to register a
        second OAuth app in the {providerName} dashboard for the other
        environment(s).
      </Callout>
      {/* Step 2 */}
      <StepTitle>Setup Environment Variables</StepTitle>
      <p className="mt-6 leading-7 first:mt-0">
        Once registered, you should get a <strong>Client ID</strong> and{" "}
        <strong>Client Secret</strong>. Add those in your application
        environment file:
      </p>
      <Code>
        <Code.Next>
          <Pre
            data-copy=""
            data-filename=".env.local"
            dangerouslySetInnerHTML={{
              __html: highlight(
                `
AUTH_${providerId.toUpperCase().replace(/-/gi, "_")}_ID={CLIENT_ID}
AUTH_${providerId.toUpperCase().replace(/-/gi, "_")}_SECRET={CLIENT_SECRET}
`
              ),
            }}
          />
        </Code.Next>
        <Code.Qwik>
          <Pre
            data-copy=""
            data-filename=".env.local"
            dangerouslySetInnerHTML={{
              __html: highlight(
                `
AUTH_${providerId.toUpperCase().replace(/-/gi, "_")}_ID={CLIENT_ID}
AUTH_${providerId.toUpperCase().replace(/-/gi, "_")}_SECRET={CLIENT_SECRET}
`
              ),
            }}
          />
        </Code.Qwik>
        <Code.Svelte>
          <Pre
            data-copy=""
            data-filename=".env.local"
            dangerouslySetInnerHTML={{
              __html: highlight(
                `
AUTH_${providerId.toUpperCase().replace(/-/gi, "_")}_ID={CLIENT_ID}
AUTH_${providerId.toUpperCase().replace(/-/gi, "_")}_SECRET={CLIENT_SECRET}
`
              ),
            }}
          />
        </Code.Svelte>
        <Code.Express>
          <Pre
            data-copy=""
            data-filename=".env.local"
            dangerouslySetInnerHTML={{
              __html: highlight(
                `
AUTH_${providerId.toUpperCase().replace(/-/gi, "_")}_ID={CLIENT_ID}
AUTH_${providerId.toUpperCase().replace(/-/gi, "_")}_SECRET={CLIENT_SECRET}
`
              ),
            }}
          />
          <p className="mt-2 leading-7 first:mt-0">
            Assuming{" "}
            <Link href="https://www.npmjs.com/package/dotenv">
              <NXCode>dotenv</NXCode>
            </Link>{" "}
            is installed or you're using{" "}
            <Link href="https://nodejs.org/dist/latest-v20.x/docs/api/cli.html#--env-fileconfig">
              Node 20 <NXCode>.env</NXCode> file feature
            </Link>
            .
          </p>
        </Code.Express>
      </Code>
      <p className="mt-6 leading-7 first:mt-0">
        Auth.js will automatically pick up these if formatted like the example
        above. You can{" "}
        <Link href="/guides/environment-variables#oauth-variables">
          also use a different name for the environment variables
        </Link>{" "}
        if needed, but then you’ll need to pass them to the provider manually.
      </p>
      {/* Step 3 */}
      <StepTitle>Setup Provider</StepTitle>
      <p className="mt-6 leading-7 first:mt-0">
        Let’s enable {providerName} as a sign in option in our Auth.js
        configuration. You’ll have to import the <NXCode>{providerName}</NXCode>{" "}
        provider from the package and pass it to the <NXCode>providers</NXCode>{" "}
        array we setup earlier in the Auth.js config file:
      </p>
      <SetupCode
        providerId={providerId}
        providerName={providerName}
        highlight={highlight}
      />
      {/* Step 4 */}
      <StepTitle>Add Signin Button</StepTitle>
      <p className="mt-6 leading-7 first:mt-0">
        Next, we can add a signin button somewhere in your application like the
        Navbar. It will trigger Auth.js sign in when clicked.
      </p>
      <SignInCode
        providerId={providerId}
        providerName={providerName}
        highlight={highlight}
      />
      {/* Step 5 */}
      <StepTitle>Ship it!</StepTitle>
      <p className="mt-6 leading-7 first:mt-0">
        Click the “Sign in with {providerName}" button and if all went well, you
        should be redirected to {providerName} and once authenticated,
        redirected back to the app!
      </p>
      <Callout>
        You can build your own Signin, Signout, etc. pages to match the style of
        your application, check out{" "}
        <Link href="/getting-started/session-management/custom-pages">
          session management
        </Link>{" "}
        for more details.
      </Callout>
      <p className="mt-6 leading-7 first:mt-0">
        For more information on this provider check out the detailed{" "}
        {providerName} provider{" "}
        <Link href={`/getting-started/providers/${providerId}`}>docs page</Link>
        .
      </p>
    </div>
  )
}
