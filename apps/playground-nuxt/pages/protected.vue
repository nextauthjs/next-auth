<script setup lang="ts">
const session = useSession()

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    <h1>Protected Page</h1>
    <p>
      This is a protected content. You can access this content because you are
      signed in.
    </p>
    <p>Session expiry: {{ session?.expires }}</p>
  </div>
</template>
