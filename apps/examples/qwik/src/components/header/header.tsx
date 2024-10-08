import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useSession, useSignIn, useSignOut } from "~/routes/plugin@auth";
import { QwikIcon } from "../icones/qwik";
import { Avatar } from "../avatar/avatar";

export const Header = component$(() => {
  const session = useSession();
  const signInSig = useSignIn();
  const signOutSig = useSignOut();

  return (
    <header class="flex h-20 items-center gap-3 border-b px-6 py-3">
      <Link href="/">
        <QwikIcon width="46" height="50" />
      </Link>
      <span class="text-xl font-bold text-slate-800">Auth.js with Qwik</span>

      {session.value?.user ? (
        <div class="ml-auto flex items-center justify-center gap-8">
          <Avatar
            src={session.value.user.image ?? ""}
            alt={session.value.user.name ?? ""}
          />
          <Link
            class="cursor-pointer text-xl font-bold text-slate-800"
            onClick$={() => signOutSig.submit({ redirectTo: "/" })}
          >
            Logout
          </Link>
        </div>
      ) : (
        <div class="ml-auto flex items-center justify-center gap-8">
          <Link
            class="cursor-pointer text-xl font-bold text-slate-800"
            onClick$={() => signInSig.submit({ redirectTo: "/" })}
          >
            SignIn
          </Link>
        </div>
      )}
    </header>
  );
});
