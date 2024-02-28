<script lang="ts">
  import { page } from "$app/stores"
  import { SignIn, SignOut } from "@auth/sveltekit/components"
  import { signIn, signOut } from "@auth/sveltekit/client"

  let password = ""
</script>

<h1>SvelteKit Auth Example</h1>
<div class="container">
  <p>
    This is an example site to demonstrate how to use
    <a href="https://kit.svelte.dev/">SvelteKit</a>
    with <a href="https://sveltekit.authjs.dev">SvelteKit Auth</a> for authentication.
  </p>

  <div class="card">
    <div class="card-header">
      <h3>Server Actions</h3>
    </div>
    <div class="card-body">
      <p>
        These actions are all using the components exported from
        <code>@auth/sveltekit/components</code> to run via form actions.
      </p>
      <div class="actions">
        <SignIn provider="github">
          <span slot="submitButton">Sign In with GitHub</span>
        </SignIn>
        <SignIn provider="discord">
          <span slot="submitButton">Sign In with Discord</span>
        </SignIn>
        <SignIn
          provider="credentials"
          authorizationParams={{
            foo: "bar",
          }}
        >
          <span slot="submitButton">Sign In with Credentials</span>
          <div slot="credentials" class="input-wrapper">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
        </SignIn>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <h3>Client Actions</h3>
    </div>
    <div class="card-body">
      <p>
        These actions are all using the methods exported from
        <code>@auth/sveltekit/client</code>
      </p>
      <div class="actions">
        <div class="wrapper-form">
          <button on:click={() => signIn("github")}>Sign In with GitHub</button>
        </div>
        <div class="wrapper-form">
          <button on:click={() => signIn("discord")}
            >Sign In with Discord</button
          >
        </div>
        <div class="wrapper-form">
          <div class="input-wrapper">
            <label for="password">Password</label>
            <input
              bind:value={password}
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <button on:click={() => signIn("credentials", { password })}>
            Sign In with Credentials
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
