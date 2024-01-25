<script lang="ts">
  export let callbackUrl: string
  export let providerName: string
</script>

<form action='/signin' method="POST">
  <input type="hidden" name="callbackUrl" value={callbackUrl} />
  <button type="submit" class="button">
    <slot>Sign in with {providerName}</slot>
  </button>
</form>
