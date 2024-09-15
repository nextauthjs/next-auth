import { Protected } from "~/components"

export const { routeData, Page } = Protected((session) => {
  return (
    <main class="flex flex-col items-center gap-2">
      <h1>This is a protected route</h1>
    </main>
  )
})

export default Page
