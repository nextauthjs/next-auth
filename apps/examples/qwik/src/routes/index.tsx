import { component$ } from "@builder.io/qwik";
import { useSession } from "./plugin@auth";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  const session = useSession();
  return (
    <div class="h-[calc(100vh-5rem)] w-screen bg-slate-100 pt-40 text-center text-2xl">
      <div>This is an example site to demonstrate how to use</div>
      <div class="py-2 font-bold text-blue-600">
        <a target="_blank" href="https://authjs.dev/">
          Auth.js
        </a>
      </div>
      <div>for authentication with</div>
      <div class="py-2 font-bold text-blue-600">
        <a target="_blank" href="https://qwik.dev/">
          Qwik
        </a>
      </div>
      {session.value?.user ? (
        <>
          <div class="pt-6 text-2xl font-bold text-slate-800">
            You are logged. Now you can visit
          </div>
          <a class="py-4 font-bold text-blue-600" href="/protected">
            this protected route.
          </a>
        </>
      ) : (
        <div class="pt-6 text-2xl font-bold text-slate-800">
          You can SignIn with GitHub in the header
        </div>
      )}
    </div>
  );
});
