import { type ParentComponent } from "solid-js"
import { A, Title, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import { authOpts } from "./api/auth/[...solidauth]"
import { getSession } from "@solid-auth/next"

export const routeData = () => {
  return createServerData$(
    async (_, { request }) => {
      return await getSession(request, authOpts)
    },
    { key: () => ["auth_user"] }
  )
}
const Home: ParentComponent = () => {
  const user = useRouteData<typeof routeData>()
  return (
    <>
      <Title>Create JD App</Title>
      <div class="flex flex-col items-center gap-2">
        <h1 class="text-4xl font-bold">SolidStart Auth Example</h1>
        <p class="text-md max-w-[40rem] font-semibold">
          This is an example site to demonstrate how to use{" "}
          <A
            href="https://start.solidjs.com/getting-started/what-is-solidstart"
            class="font-bold text-blue-500 underline"
          >
            SolidStart
          </A>{" "}
          with{" "}
          <A
            href="https://authjs.dev/reference/solidstart"
            class="font-bold text-blue-500 underline"
          >
            SolidStart Auth
          </A>{" "}
          for authentication.
        </p>
      </div>
    </>
  )
}

export default Home
