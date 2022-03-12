<script context="module" lang="ts">
  export async function load({ session }) {
    const { user } = session
    if (!user) {
      return {
        status: 302,
        redirect: "/",
      }
    }
    return {
      props: {
        session,
      },
    }
  }
</script>

<script lang="ts">
  export let session
</script>

<h1>Protected page</h1>
<p>
  This is a protected content. You can access this content because you are
  signed in.
</p>
<p>Session expiry: {session.expires}</p>
