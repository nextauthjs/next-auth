<script lang="ts">
  import { page } from "$app/stores"
  import { SignIn, SignOut } from "@auth/sveltekit/components"
  import Button from "./ui/button/button.svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import * as Avatar from "$lib/components/ui/avatar/index.js"

  let user = $page.data?.session?.user
  $: if ($page.data) {
    user = $page.data?.session?.user
  }
</script>

<header class="sticky flex justify-between border-b">
  <div
    class="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6"
  >
    <nav class="flex items-center gap-6">
      <a href="/">
        <img class="size-8" src="/logo.png" alt="SvelteKit Auth" />
      </a>
      <ul class="flex items-center gap-6">
        <li><a href="/">Home</a></li>
        <li><a href="/protected">Protected</a></li>
      </ul>
    </nav>

    <div class="nojs-show loaded">
      {#if user}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="ghost"
              size="icon"
              class="rounded-full ml-1.5"
            >
              <Avatar.Root class="w-8 h-8">
                <Avatar.Image src={user?.image ?? ""} alt={user?.name ?? ""} />
                <Avatar.Fallback>{user?.email?.slice(0, 2)}</Avatar.Fallback>
              </Avatar.Root>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56" align="end">
            <DropdownMenu.Label class="font-normal">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">
                  {user?.name || "Anonymous"}
                </p>
                <p class="text-xs leading-none text-muted-foreground">
                  {user?.email || "anonymous@example.com"}
                </p>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <SignOut class="block">
              <DropdownMenu.Item
                slot="submitButton"
                class="w-[214px] cursor-pointer"
              >
                Sign out
              </DropdownMenu.Item>
            </SignOut>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {:else}
        <SignIn>
          <Button slot="submitButton">Sign in</Button>
        </SignIn>
      {/if}
    </div>
  </div>
</header>
