<script setup lang="ts">
import { useSession, useFetch, useLazyFetch } from '#imports'
import AccessDenied from '~/components/AccessDenied.vue'

const { data: session } = useSession()
const { data } = await useLazyFetch('/api/examples/protected', {
  server: false
})
</script>

<template>
  <div>
    <AccessDenied v-if="!session" />
    <template v-else>
      <h1>Protected Page</h1>
      <p><strong>{{ data?.content || "\u00a0" }}</strong></p>
    </template>
  </div>
</template>
