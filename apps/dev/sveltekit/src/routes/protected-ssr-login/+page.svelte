<script lang="ts">
  import { page } from "$app/stores"
</script>

<h1>Protected page</h1>
<p>
  You can only access this content if you are signed in. Otherwise, this page triggers the sign in process automatically.
</p>
<p>Session expiry: {$page.data.session?.expires}</p>
