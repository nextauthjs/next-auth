<script lang="ts">
  import { page } from "$app/stores"
  import SignInButton from "$lib/SignInButton.svelte"
</script>

<h1>SvelteKit Auth Example</h1>
<p>Disable JS in this page and SvelteKit Auth would still work.</p>
{#if $page.data.session}
  {#if $page.data.session.user?.image}
    <span
      style="background-image: url('{$page.data.session.user.image}')"
      class="avatar"
    />
  {/if}
  <span class="signedInText">
    <small>Signed in as</small><br />
    <strong
      >{$page.data.session.user?.email ?? $page.data.session.user?.name}</strong
    >
  </span>
  <form action="/auth/signout" method="POST">
    <button id="submitButton" type="submit">Sign out</button>
  </form>
{:else}
  <span class="notSignedInText">You are not signed in</span>
  {#each Object.values($page.data.providers) as provider}
    <SignInButton {provider} />
  {/each}
{/if}
