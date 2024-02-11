<script lang="ts">
  import { page } from "$app/stores"
  import { SignIn, SignOut } from "@auth/sveltekit/components"
  import Header from "$components/header.svelte"
  import "$lib/style.css"
</script>

<Header />
<slot />
