<script lang="ts">
  import { enhance } from "$app/forms"
  import type { signIn } from "$lib/actions"

  export let className = ""
  export let provider: Parameters<typeof signIn>[0]
  export let callbackUrl: string = '/'
  export let signInPage = "signin"
  export let options: Parameters<typeof signIn>[1] | undefined = undefined
  export let authorizationParams: Parameters<typeof signIn>[2] | undefined = undefined
</script>

<form
  method="POST"
  action={`/${signInPage}${
    authorizationParams && Object.keys(authorizationParams).length
      ? `?${new URLSearchParams(authorizationParams).toString()}`
      : ""
  }`}
  use:enhance
  class={`signInButton ${className}`}
>
  <input type="hidden" name="id" value={provider} />
  <input type="hidden" name="callbackUrl" value={callbackUrl} />
  {#if options}
    {#each Object.entries(options) as [key, value]}
      <input type="hidden" name={key} value={value} />
    {/each}
  {/if}
  <button style="width: 100%" type="submit"><slot /></button>
</form>
