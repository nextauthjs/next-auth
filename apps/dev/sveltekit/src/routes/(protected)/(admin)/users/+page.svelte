<script lang="ts">
  import { page } from "$app/stores"

  $: user = $page.data.session?.user
</script>

<h1>Protected page - Admin</h1>
<p>
  This is a protected content. You can access this content because you are
  signed in and you are an admin.
</p>
<p>Session expiry: {$page.data.session?.expires}</p>
<p>User: {user?.name} ({user?.email})</p>
