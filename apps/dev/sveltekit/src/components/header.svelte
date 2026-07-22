<script lang="ts">
  import { page } from "$app/stores"
  import { SignIn, SignOut } from "@auth/sveltekit/components"
</script>

<header>
  <nav class="nojs-show loaded">
    <div class="nav-left">
      <img
        alt="Avatar"
        src={$page.data.session?.user?.image ??
          `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`}
        class="avatar"
      />
    </div>
    <div class="nav-right">
      {#if $page.data.session}
        <span class="header-text">
          <small>Signed in as</small><br />
          <strong>
            {$page.data.session.user?.email ?? $page.data.session.user?.name}
          </strong>
        </span>
        <SignOut>
          <div class="buttonPrimary" slot="submitButton">Sign out</div>
        </SignOut>
      {:else}
        <span class="header-text">You are not signed in</span>
        <SignIn>
          <div class="buttonPrimary" slot="submitButton">Sign in</div>
        </SignIn>
      {/if}
    </div>
  </nav>
  <div class="links">
    <a class="linkItem" href="/">Home</a>
    <a class="linkItem" href="/protected">Protected</a>
    <a class="linkItem" href="/client-protected">Client Protected</a>
    <a class="linkItem" href="/users">Admin</a>
  </div>
</header>
