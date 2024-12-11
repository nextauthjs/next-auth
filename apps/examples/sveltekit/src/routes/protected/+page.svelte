<script lang="ts">
  import { page } from "$app/stores"
</script>

<main
  class="flex-1 prose dark:prose-invert
  mx-auto w-full
  max-w-3xl px-4 py-8
  sm:px-6 md:py-12"
>
  {#if $page.data.session}
    <h1>Protected page</h1>
    <p>
      This is a protected content. You can access this content because you are
      signed in.
    </p>
    <p>Current Session Data:</p>
    <pre><code>{JSON.stringify($page.data.session, null, 2)}</code></pre>
  {:else}
    <h1>Access Denied</h1>
  {/if}
</main>
