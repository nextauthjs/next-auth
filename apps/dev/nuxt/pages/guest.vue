<script setup lang="ts">
definePageMeta({
  middleware: ["auth-logged-out"],
  auth: {
    authenticatedRedirectTo: "/protected",
  },
})
</script>
<template>
  <h1>Guest page</h1>
  <p>
    This is a guest content. You can access this content without being logged
    in.
  </p>
</template>
