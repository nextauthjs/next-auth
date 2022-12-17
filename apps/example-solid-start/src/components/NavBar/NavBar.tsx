import { Match, Show, Switch, type Component } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { authOpts } from "~/routes/api/auth/[...solidauth]";
import { signIn, signOut } from "@solid-auth/next/utils";
import { getSession } from "@solid-auth/next/session";

interface INavBarProps {}

const NavBar: Component<INavBarProps> = () => {
  const session = useSession();
  return (
    <nav class="w-full p-5 bg-gray-400 flex items-center gap-2">
      <Switch
        fallback={
          <>
            <button
              onClick={() => {
                return signIn("github");
              }}
            >
              Sign in with github
            </button>
            <span>|</span>
          </>
        }
      >
        <Match when={session.loading}>
          <p>Loading</p>
        </Match>
        <Match when={session()?.user} keyed>
          {(us) => (
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-lg">{us.name}</h3>
              <Show when={us.image} keyed>
                {(im) => <img src={im} class="w-8 h-8 rounded-full" />}
              </Show>
              <button onClick={() => signOut()}>Logout</button>
            </div>
          )}
        </Match>
      </Switch>
    </nav>
  );
};

export default NavBar;

export const useSession = () => {
  return createServerData$(
    async (_, { request }) => {
      return await getSession(request, authOpts);
    },
    { key: () => ["auth_user"] }
  );
};
