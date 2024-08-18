import { Match, Show, Switch, type Component } from "solid-js"
import { createServerData$ } from "solid-start/server"
import { authOpts } from "~/routes/api/auth/[...solidauth]"
import { signIn, signOut } from "@solid-auth/next/client"
import { getSession } from "@solid-auth/next"
import { A } from "solid-start"

interface INavBarProps {}

const NavBar: Component<INavBarProps> = () => {
  const session = useSession()
  return (
    <header class="fixed left-2/4 right-2/4 flex w-full -translate-x-2/4 flex-col items-center gap-2">
      <nav class="flex w-[70vw] items-center  justify-between rounded-lg bg-[#0000000d] p-5 sm:w-2/4 lg:w-[40%]">
        <Show
          when={session()?.user}
          keyed
          fallback={
            <>
              <p class="text-lg font-semibold">You are not signed in</p>
              <button
                class="flex items-center justify-center rounded-lg bg-[#346df1] p-2.5 text-lg font-bold text-white"
                onClick={() => signIn("github")}
              >
                Sign in
              </button>
            </>
          }
        >
          {(us) => (
            <>
              <div class="flex items-center gap-2">
                <Show when={us.image} keyed>
                  {(im) => <img src={im} class="h-12 w-12 rounded-full" />}
                </Show>
                <div class="flex flex-col">
                  <h3 class="text-lg font-bold">Signed in as</h3>
                  <p class="text-lg font-semibold">{us.name}</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                class="font-semibold text-[#555] underline"
              >
                Sign out
              </button>
            </>
          )}
        </Show>
      </nav>
      <div class="flex items-center gap-2">
        <A class="font-bold text-blue-500 underline" href="/">
          Home
        </A>
        <A class="font-bold text-blue-500 underline" href="/protected">
          Protected
        </A>
      </div>
    </header>
  )
}

export default NavBar

export const useSession = () => {
  return createServerData$(
    async (_, { request }) => {
      return await getSession(request, authOpts)
    },
    { key: () => ["auth_user"] }
  )
}
