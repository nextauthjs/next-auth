import { Code } from "@/components/Code"
import { Pre } from "nextra/components"
import { TSIcon } from "./TSIcon"

interface Props {
  providerName: string
  providerId: string
  highlight: (code: string) => string
}

export function SignInCode({ providerId, providerName, highlight }: Props) {
  return (
    <Code>
      <Code.Next>
        <Pre
          data-filename="./components/sign-in.tsx"
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          dangerouslySetInnerHTML={{
            __html: highlight(`
import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("${providerId}")
      }}
    >
      <button type="submit">Signin with ${providerName}</button>
    </form>
  )
} `),
          }}
        />
      </Code.Next>
      <Code.Svelte>
        With SvelteKit we can do a server-side login with Form Actions, or a
        more simple client-side login via links and redirects.
        <div className="my-4 text-xl font-semibold">Client-side login</div>
        <Pre
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          data-filename="src/routes/+page.svelte"
          dangerouslySetInnerHTML={{
            __html: highlight(`
<script lang="ts">
   import { signIn } from "@auth/sveltekit/client"
</script>
 
<div>
  <img src="/img/logo.svg" alt="Company Logo" />
  <button on:click={signIn} />
</div> `),
          }}
        />
        <div className="my-4 text-xl font-semibold">Server-side login</div>
        <p>
          First, we need a SvelteKit route to handle the <code>POST</code>{" "}
          requests to the
          <code>/signin</code> route
        </p>
        <Pre
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          data-filename="src/routes/signin/+page.server.ts"
          dangerouslySetInnerHTML={{
            __html: highlight(`import { signIn } from "../../auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signIn }
`),
          }}
        />
        <p className="mt-4">
          Finally, we can use the exported <code>SignIn</code> Svelte component
          to add a button to our UI that will attempt a server-side login.
        </p>
        <Pre
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          data-filename="src/routes/+page.svelte"
          dangerouslySetInnerHTML={{
            __html: highlight(`
<script lang="ts">
   import { SignIn } from "@auth/sveltekit/components"
</script>
 
<div>
  <img src="/img/logo.svg" alt="Company Logo" />
  <SignIn provider="${providerId}" signInPage="signin" />
</div> `),
          }}
        />
      </Code.Svelte>
    </Code>
  )
}
