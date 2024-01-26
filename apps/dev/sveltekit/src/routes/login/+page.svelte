<script lang="ts">
  import { SignIn } from "@auth/sveltekit/components"
</script>

<SignIn provider={"github"} signInPage="login" className="w-full">
  <div>
    <span class="flex justify-center w-full"> Signin with Github </span>
  </div>
</SignIn>
