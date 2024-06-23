<script setup lang="ts">
const { session } = useAuth()
</script>
<template>
  <div v-if="session">
    <h1>Protected page</h1>
    <p>
      This is a protected content. You can access this content because you are
      signed in.
    </p>
    <p>Session expiry: {{ session?.expires }}</p>
  </div>
  <div v-else>
    <h1>Access Denied</h1>
    <p>
      <NuxtLink href="/"> You must be signed in to view this page </NuxtLink>
    </p>
  </div>
</template>
