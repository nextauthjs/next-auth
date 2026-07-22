<script lang="ts">
  import { page } from "$app/stores"
</script>

{#if $page.data.session}
  <h1>Protected without hooks.server.ts</h1>
  <p>This page is protected and can only be accessed by authenticated users.</p>
{:else}
  <h1>Access Denied</h1>
{/if}
