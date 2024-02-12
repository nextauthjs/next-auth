<script lang="ts">
  import { page } from "$app/stores"
  import { SignIn, SignOut } from "@auth/sveltekit/components"
</script>

<header>
  <div class="signedInStatus">
    <div class="nojs-show loaded">
      <img
        src={$page.data?.session?.user?.image ??
          "https://source.boringavatars.com/marble/120"}
        class="avatar"
      />
      {#if $page.data.session}
        <span class="signedInText">
          <small>Signed in as</small><br />
          <strong>
            {$page.data.session.user?.email ?? $page.data.session.user?.name}
          </strong>
        </span>
        <SignOut>
          <button type="submit" slot="submitButton" class="buttonPrimary">
            Sign out
          </button>
        </SignOut>
      {:else}
        <span class="notSignedInText">You are not signed in</span>
        <SignIn>
          <button type="submit" slot="submitButton" class="buttonPrimary">
            Sign in
          </button>
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
    width: 100%;
  }
  .loaded {
    position: relative;
    top: 0;
    opacity: 1;
    overflow: hidden;
    width: 100%;
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
  .button,
  .buttonPrimary {
    margin-right: -0.4rem;
    font-weight: 500;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1.4rem;
    padding: 0.7rem 0.8rem;
    position: relative;
    z-index: 10;
    background-color: transparent;
    color: #555;
  }
  .buttonPrimary {
    justify-self: end;
    background-color: #346df1;
    border: none;
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
</style>
