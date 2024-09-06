import { component$, Slot } from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import { Header } from "~/components/header/header";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <div>
      <Header />
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Auth.js with Qwik",
  meta: [
    {
      name: "description",
      content: "An example project for Auth.js with Qwik",
    },
  ],
};
