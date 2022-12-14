<script>
  import { signIn, signOut } from "@auth/sveltekit/client"
  import { page } from "$app/stores"
</script>

<h1>SvelteKit Auth Example</h1>
<p>
  This is an example site to demonstrate how to use <a
    href="https://kit.svelte.dev/">SvelteKit</a
  >
  with <a href="https://next-auth.js.org">NextAuth.js</a> for authentication.

  {#if Object.keys($page.data.session || {}).length}
    {#if $page.data.session.user.image}
      <span
        style="background-image: url('{$page.data.session.user.image}')"
        class="avatar"
      />
    {/if}
    <span class="signedInText">
      <small>Signed in as</small><br />
      <strong
        >{$page.data.session.user.email || $page.data.session.user.name}</strong
      >
    </span>
    <button on:click={() => signOut()} class="button">Sign out</button>
  {:else}
    <span class="notSignedInText">You are not signed in</span>
    <button on:click={() => signIn("github")}>Sign In with GitHub</button>
  {/if}
</p>
