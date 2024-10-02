import { component$ } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = (event) => {
  const session = event.sharedMap.get("session");
  if (!session || new Date(session.expires) < new Date()) {
    throw event.redirect(302, `/`);
  }
};

export default component$(() => {
  return (
    <div class="h-[calc(100vh-5rem)] w-screen bg-slate-100 pt-40 text-center text-2xl">
      <div class="py-4 font-bold text-blue-600">
        <a target="_blank" href="https://authjs.dev/">
          Auth.js is awesome!
        </a>
      </div>
    </div>
  );
});
