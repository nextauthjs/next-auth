<script lang="ts">
  export let provider: any
  export let callbackUrl: string
</script>

<form action={provider.signinUrl} method="POST">
  <input type="hidden" name="callbackUrl" value={callbackUrl} />
  <button type="submit">
    <slot>Sign in with {provider.name}</slot>
  </button>
</form>
