<script lang="ts">
  import { page } from "$app/stores"
  import { SignIn, SignOut } from "@auth/sveltekit/components"
</script>

<header>
  <div class="signedInStatus">
    <div class="nojs-show loaded">
      <img
        alt="User avatar"
        src={$page.data?.session?.user?.image ??
          `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`}
        class="avatar"
      />
      {#if $page.data.session}
        <span class="signedInText">
          {$page.data.session.user?.email ?? $page.data.session.user?.name}
        </span>
        <SignOut>
          <div slot="submitButton" class="buttonPrimary">Sign out</div>
        </SignOut>
      {:else}
        <span class="notSignedInText">You are not signed in</span>
        <SignIn>
          <div slot="submitButton" class="buttonPrimary">Sign in</div>
        </SignIn>
      {/if}
    </div>
  </div>
  <nav>
    <ul class="navItems">
      <li class="navItem"><a href="/">Home</a></li>
      <li class="navItem"><a href="/protected">Protected</a></li>
    </ul>
  </nav>
</header>

<style>
  .nojs-show {
    opacity: 1;
    top: 0;
  }
  .signedInStatus {
    display: block;
    min-height: 4rem;
  }
  .loaded {
    position: relative;
    top: 0;
    opacity: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-radius: 0 0 0.6rem 0.6rem;
    padding: 0.6rem 1rem;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease-in;
  }
  .signedInText,
  .notSignedInText {
    justify-content: end;
    padding-left: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inherit;
    line-height: 1.3rem;
    flex: 1;
  }
  .signedInText {
    padding-top: 0rem;
    left: 4.6rem;
  }
  .avatar {
    border-radius: 2rem;
    float: left;
    height: 2.8rem;
    width: 2.8rem;
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .buttonPrimary {
    font-weight: 500;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1.4rem;
    position: relative;
    justify-self: end;
    background-color: #346df1;
    color: #fff;
    text-decoration: none;
    padding: 0.7rem 1.4rem;
  }
  .buttonPrimary:hover {
    box-shadow: inset 0 0 5rem rgba(0, 0, 0, 0.2);
  }
  .navItems {
    margin-bottom: 2rem;
    padding: 0;
    list-style: none;
  }
  .navItem {
    display: inline-block;
    margin-right: 1rem;
  }
  :global(form button) {
    border: none !important;
  }
</style>
