import { Code } from "@/components/Code"
import { Pre, Code as NXCode } from "nextra/components"
import { TSIcon } from "./TSIcon"

interface Props {
  providerName: string
  providerId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highlight: any // TODO...
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
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight
                  ? highlight(
                      // prettier-ignore
                      `
import { signIn } from "@/auth.ts";
// ...
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("${providerId}");
      }}
    >
      <button type="submit">Signin with ${providerName}</button>
    </form>
  );
}
`
                    )
                  : null,
              }}
            />
          </NXCode>
        </Pre>
      </Code.Next>
      <Code.Svelte>
        <p>
          First, we need a SvelteKit route to handle the `POST` requests to the
          `/signin` route
        </p>
        <Pre
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          data-filename="src/routes/signin/+page.server.ts"
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight
                  ? highlight(
                      // prettier-ignore
                      `import { signIn } from "../../auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signIn }
`
                    )
                  : null,
              }}
            />
          </NXCode>
        </Pre>
        <p className="mt-4">
          SvelteKit requires a client-side `+page.svelte` file to go along with
          it, so we can add this empty file to make it happy.
        </p>
        <Pre
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          data-filename="src/routes/signin/+page.svelte"
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight
                  ? highlight(
                      // prettier-ignore
                      `
<!-- empty file -->
`
                    )
                  : null,
              }}
            />
          </NXCode>
        </Pre>
        <p className="mt-4">
          Finally, we can use the exported `SignIn` Svelte component to add a
          button to our UI that will attempt a server-side login.
        </p>
        <Pre
          data-theme="default"
          data-copy=""
          data-language="tsx"
          icon={TSIcon}
          data-filename="src/routes/+page.svelte"
        >
          <NXCode>
            <span
              dangerouslySetInnerHTML={{
                __html: highlight
                  ? highlight(
                      // prettier-ignore
                      `<script lang="ts">
  import {SignIn} from "@auth/sveltekit/components"
</script>

<div>
  <img src="/img/logo.svg" alt="Company Logo" />
  <SignIn provider="${providerId}" signInPage="signin" />
</div> `
                    )
                  : null,
              }}
            />
          </NXCode>
        </Pre>
      </Code.Svelte>
    </Code>
  )
}
