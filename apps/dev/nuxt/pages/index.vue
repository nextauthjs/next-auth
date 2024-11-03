<script setup lang="ts">
const { signIn, session, auth } = useAuth()

const password = ref("")
</script>

<template>
  <h1>Nuxt Auth Example</h1>
  <div class="container">
    <p>
      This is an example site to demonstrate how to use
      <a href="https://nuxt.com/">Nuxt</a>
      with <a href="https://nuxt.authjs.dev">Nuxt Auth</a> for authentication.
    </p>

    <div class="session-code">
      <div class="session-code-header">
        <h3>Session</h3>
      </div>
      <div class="session-code-body">
        <pre>
{{ session ?? "null" }}
        </pre>
      </div>
    </div>

    <div class="session-code">
      <div class="session-code-header">
        <h3>User</h3>
      </div>
      <div class="session-code-body">
        <pre>
{{ auth.user }}
        </pre>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Client Actions</h3>
      </div>
      <div class="card-body">
        <p>These actions are all using the methods exported from Client</p>
        <div class="actions">
          <div class="wrapper-form">
            <button @click="signIn('github')">Sign In with GitHub</button>
          </div>
          <div class="wrapper-form">
            <button @click="signIn('discord')">Sign In with Discord</button>
          </div>
          <div class="wrapper-form">
            <div class="input-wrapper">
              <label for="client-password">Password</label>
              <input
                v-model="password"
                type="password"
                id="client-password"
                name="password"
              />
            </div>
            <button @click="signIn('credentials', { password: password })">
              Sign In with Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
