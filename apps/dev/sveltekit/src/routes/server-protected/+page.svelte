<script lang="ts">
  import { page } from "$app/stores"
</script>

<h1>Protected page</h1>
<p>
  This is protected content. You should not be able to navigate to this page
  unless you are signed in. Note that only the Auth.js session ends with
  sign-out, and you may get silently signed back in (with a new Auth.js browser
  session created) if you return to this page.
</p>
<p>Session expiry: {$page.data.session?.expires}</p>
<a href="/server-signout">Sign out with GET endpoint</a>
