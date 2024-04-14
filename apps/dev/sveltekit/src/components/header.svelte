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
          "https://source.boringavatars.com/marble/120"}
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
  </div>
</header>
