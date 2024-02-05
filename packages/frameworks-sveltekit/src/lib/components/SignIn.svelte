<script lang="ts">
  import { enhance } from "$app/forms"
  import type { signIn } from "$lib/actions"

  export let className = ""
  export let provider: Parameters<typeof signIn>[0]
  /** The path to the FormAction file in your route. @default signin */
  export let signInPage = "signin"
  export let options: Parameters<typeof signIn>[1] | undefined = undefined
  export let authorizationParams: Parameters<typeof signIn>[2] | undefined =
    undefined
  const callbackUrl =
    options instanceof FormData
      ? options.get("redirectTo")
      : options?.redirectTo
  const redirect =
    options instanceof FormData ? options.get("redirect") : options?.redirectTo

  const authorizationParamsInputs = authorizationParams
    ? typeof authorizationParams === "string" && authorizationParams
      ? new URLSearchParams(authorizationParams)
      : authorizationParams
    : undefined
</script>

<form
  method="POST"
  action={`/${signInPage}`}
  use:enhance
  class={`signInButton ${className}`}
  {...$$restProps}
>
  <input type="hidden" name="providerId" value={provider} />
  {#if callbackUrl}
  <input type="hidden" name="callbackUrl" value={callbackUrl} />
  {/if}
  {#if redirect}
  <input type="hidden" name="redirect" value={redirect} />
  {/if}
  {#if authorizationParamsInputs}
    {#each Object.entries(authorizationParamsInputs) as [key, value]}
      <input type="hidden" name={`authorizationParams-${key}`} value={value} />
    {/each}
  {/if}
  {#if provider === "credentials"}
    <slot name="credentials" />
  {/if}
  {#if provider === "email" || provider === "sendgrid" || provider === "resend"}
    <slot name="email">
      <label class="section-header" for={`input-email-for-${provider}-provider`}>
        Email
      </label>
      <input
        id="input-email-for-email-provider"
        type="email"
        name="email"
        placeholder="email@example.com"
        required
      />
    </slot>
  {/if}
  <button style="width: 100%" type="submit"
    ><slot name="submitButton">Sign in with {provider}</slot></button
  >
</form>
