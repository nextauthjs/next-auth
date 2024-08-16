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
    <header class="flex flex-col w-full gap-2 fixed left-2/4 right-2/4 -translate-x-2/4 items-center">
      <nav class="w-[70vw] sm:w-2/4 lg:w-[40%]  p-5 bg-[#0000000d] flex items-center justify-between rounded-lg">
        <Show
          when={session()?.user}
          keyed
          fallback={
            <>
              <p class="text-lg font-semibold">You are not signed in</p>
              <button
                class="p-2.5 rounded-lg bg-[#346df1] text-white text-lg font-bold flex items-center justify-center"
                onClick={() => signIn("github")}
              >
                Sign in
              </button>
            </>
          }
        >
          {(us) => (
            <>
              <div class="flex gap-2 items-center">
                <Show when={us.image} keyed>
                  {(im) => <img src={im} class="w-12 h-12 rounded-full" />}
                </Show>
                <div class="flex flex-col">
                  <h3 class="font-bold text-lg">Signed in as</h3>
                  <p class="text-lg font-semibold">{us.name}</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                class="text-[#555] font-semibold underline"
              >
                Sign out
              </button>
            </>
          )}
        </Show>
      </nav>
      <div class="flex gap-2 items-center">
        <A class="text-blue-500 font-bold underline" href="/">
          Home
        </A>
        <A class="text-blue-500 font-bold underline" href="/protected">
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
