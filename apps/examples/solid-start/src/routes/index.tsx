import { type ParentComponent } from "solid-js"
import { A, Title } from "solid-start"

const Home: ParentComponent = () => {
  return (
    <>
      <Title>Create JD App</Title>
      <div class="flex flex-col gap-2 items-center">
        <h1 class="text-4xl font-bold">SolidStart Auth Example</h1>
        <p class="font-semibold text-md max-w-[40rem]">
          This is an example site to demonstrate how to use{" "}
          <A
            href="https://start.solidjs.com/getting-started/what-is-solidstart"
            class="text-blue-500 underline font-bold"
          >
            SolidStart
          </A>{" "}
          with{" "}
          <A
            href="https://authjs.dev/reference/solidstart"
            class="text-blue-500 underline font-bold"
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
