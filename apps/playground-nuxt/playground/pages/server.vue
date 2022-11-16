<script setup lang="ts">
import { useFetch } from '#imports'

await useFetch('/api/examples/session')
</script>

<template>
  <div>
    <h1>Server Side Rendering</h1>
    <p>
      This page uses the <strong>getServerSession()</strong> method inside an api route and is fetched using the <strong>useFetch()</strong> composable.
    </p>
    <p>
      Using <strong>getServerSession()</strong> is the recommended approach if you need to
      support Server Side Rendering with authentication.
    </p>
    <p>
      The advantage of Server Side Rendering is this page does not require client side JavaScript.
    </p>
    <p>
      The disadvantage of Server Side Rendering is that this page is slower to render.
    </p>
  </div>
</template>
