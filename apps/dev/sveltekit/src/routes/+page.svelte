<script lang="ts">
  import { page } from "$app/stores"
  import { SignIn, SignOut } from "@auth/sveltekit/components"
  // import { signIn, signOut } from "../auth"
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
      These actions are all using the SvelteKit exported components to attempt
      their action via server actions.
      <div class="actions">
        <SignIn provider="github">
          <span slot="submitButton">Sign In with GitHub</span>
        </SignIn>
        <SignIn provider="sendgrid">
          <div slot="email" class="input-wrapper">
            <label class="section-header" for="sendgrid-input"> Email </label>
            <input
              id="sendgrid-input"
              type="email"
              name="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <span slot="submitButton">Sign In with SendGrid</span>
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
      These actions are all using the methods exported from `auth.ts`
      <div class="actions">
        <div>
          <button on:click={() => signIn("github")}>Sign In with GitHub</button>
        </div>
        <div>
          <div class="input-wrapper">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button on:click={() => signIn("credentials")}
            >Sign In with Credentials</button
          >
        </div>
      </div>
    </div>
  </div>
</div>
