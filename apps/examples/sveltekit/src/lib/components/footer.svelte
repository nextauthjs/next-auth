<script lang="ts">
  import packageJSON from "@auth/sveltekit/package.json"
  import ExternalIcon from "./external-icon.svelte"
</script>

<footer
  class="mx-0 my-4 flex w-full flex-col gap-4 px-4 text-sm
  sm:mx-auto sm:my-12 sm:h-5 sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:px-6"
>
  <div class="flex flex-wrap items-center gap-4">
    <a
      class="flex items-center gap-1 underline underline-offset-4"
      target="_blank"
      href="https://sveltekit.authjs.dev">Documentation <ExternalIcon /></a
    >
    <a
      class="flex items-center gap-1 underline underline-offset-4"
      target="_blank"
      href="https://www.npmjs.com/package/next-auth"
    >
      NPM <ExternalIcon />
    </a>
    <a
      class="flex items-center gap-1 underline underline-offset-4"
      target="_blank"
      href="https://github.com/nextauthjs/next-auth/tree/main/apps/examples/sveltekit"
    >
      Source on GitHub <ExternalIcon />
    </a>
    <a href="/policy">Policy</a>
  </div>
  <div class="flex items-center gap-2 underline underline-offset-4">
    <img
      class="size-6"
      src="https://authjs.dev/img/logo-sm.png"
      alt="Auth.js Logo"
    />
    <a
      class="flex items-center gap-1"
      target="_blank"
      href="https://www.npmjs.com/package/@auth/sveltekit"
    >
      @auth/sveltekit@{packageJSON.version}
      <ExternalIcon />
    </a>
  </div>
</footer>
