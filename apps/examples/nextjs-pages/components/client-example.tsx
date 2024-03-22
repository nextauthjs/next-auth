import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import SessionData from "./session-data"
import CustomLink from "./custom-link"

const UpdateForm = () => {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? "")

  if (!session?.user) return null
  return (
    <>
      <h2 className="text-xl font-bold">Updating the session</h2>
      <div className="flex items-center space-x-2 w-full max-w-sm">
        <Input
          type="text"
          placeholder={session.user.name ?? ""}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <Button
          type="submit"
          onClick={async () => {
            if (session) {
              await update({
                ...session,
                user: { ...session.user, name },
              })
            }
          }}
        >
          Update
        </Button>
      </div>
    </>
  )
}

export default function ClientExample() {
  const { data: session, status } = useSession()
  return (
    <div className="mx-auto mt-10 space-y-4 max-w-screen-md">
      <h1 className="text-3xl font-bold">Client Side Rendering Usage</h1>
      <p className="leading-loose">
        This page fetches session data client side using the{" "}
        <CustomLink href="https://nextjs.authjs.dev/react#usesession">
          <code>useSession</code>
        </CustomLink>{" "}
        React Hook.
      </p>
      <p className="leading-loose">
        Make sure to wrap this component tree in a{" "}
        <CustomLink href="https://nextjs.authjs.dev/react#sessionprovider">
          <code>SessionProvider</code>
        </CustomLink>{" "}
        component in{" "}
        <strong>
          <code>client-example/page.tsx</code>
        </strong>{" "}
        to provide the session data.
      </p>

      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <SessionData session={session} />
      )}
      <UpdateForm />
    </div>
  )
}
