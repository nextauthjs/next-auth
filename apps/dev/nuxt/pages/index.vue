<script setup lang="ts">
const { signIn, signOut, session, auth } = useAuth()

const password = ref("")
async function callAPI() {
  const data = await $fetch("/api/protected")

  alert(data?.message ?? "No data returned")
}
</script>

<template>
  <header>
    <nav class="nojs-show loaded">
      <div class="nav-left">
        <img
          alt="Avatar"
          :src="
            session?.user?.image ?? 'https://source.boringavatars.com/beam/120'
          "
          class="avatar"
        />
      </div>
      <div class="nav-right">
        <template v-if="session">
          <span class="header-text">
            <small>Signed in as</small><br />
            <strong>
              {{
                auth.loggedIn
                  ? auth.user.email ?? auth.user.name
                  : "unauthenticated"
              }}
            </strong>
          </span>
          <div class="buttonPrimary" @click="signOut()">Sign out</div>
        </template>
        <template v-else>
          <span class="header-text"
            >Status:
            {{ auth.loggedIn ? "authenticated" : "unauthenticated" }}</span
          >
          <span class="header-text">You are not signed in</span>
          <div class="buttonPrimary">Sign in</div>
        </template>
      </div>
    </nav>
    <div class="links">
      <NuxtLink class="linkItem" href="/">Home</NuxtLink>
      <NuxtLink class="linkItem" href="/protected">Protected</NuxtLink>
      <NuxtLink class="linkItem" href="/guest">Guest</NuxtLink>
      <div class="linkItem" @click="callAPI">Call Protected API</div>
    </div>
  </header>

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
      </pre
        >
      </div>
    </div>

    <div class="session-code">
      <div class="session-code-header">
        <h3>User</h3>
      </div>
      <div class="session-code-body">
        <pre>
            {{ auth.user }}
      </pre
        >
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
