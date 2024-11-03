<script setup lang="ts">
const { signIn, signOut, session, auth } = useAuth()

const password = ref("")

async function getProtectedRoute() {
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
            session?.user?.image ??
            'https://api.dicebear.com/9.x/thumbs/svg?seed=234173&randomizeIds=true'
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
                  ? (auth.user.email ?? auth.user.name)
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
      <div class="linkItem" @click="getProtectedRoute">Call Protected API</div>
    </div>
  </header>
</template>
