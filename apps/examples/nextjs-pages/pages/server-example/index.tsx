import CustomLink from "@/components/custom-link"
import SessionData from "@/components/session-data"
import { auth } from "../../auth"

export default function Page({ session }) {
  return (
    <div className="mx-auto mt-10 space-y-2 max-w-screen-md">
      <h1 className="text-3xl font-bold">React Server Component Usage</h1>
      <p>
        This page is server-rendered as a{" "}
        <CustomLink href="https://nextjs.org/docs/app/building-your-application/rendering/server-components">
          React Server Component
        </CustomLink>
        . It gets the session data on the server using{" "}
        <CustomLink href="https://nextjs.authjs.dev#auth">
          <code>auth()</code>
        </CustomLink>{" "}
        method.
      </p>
      <SessionData session={session} />
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const session = await auth(context)
  return {
    props: {
      session,
    },
  }
}
