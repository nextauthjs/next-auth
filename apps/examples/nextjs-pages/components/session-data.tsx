import type { Session } from "next-auth"

export default function SessionData({ session }: { session: Session | null }) {
  console.log("session-data.session", session)
  if (session?.user) {
    return (
      <div className="w-full space-y-2 overflow-auto rounded-md bg-gray-100 p-4">
        <h2 className="text-xl font-bold">Current Session Data</h2>
        {Object.keys(session.user).length > 3 ? (
          <blockquote className="border-l-4 border-gray-300 pl-2">
            In this example, the whole session object is passed to the page,
            including the raw user object. Our recommendation is to{" "}
            <em>only pass the necessary fields</em> to the page, as the raw user
            object may contain sensitive information.
          </blockquote>
        ) : (
          <blockquote className="border-l-4 border-gray-300 pl-2">
            In this example, only some fields in the user object is passed to
            the page to avoid exposing sensitive information.
          </blockquote>
        )}
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    )
  }

  return (
    <p className="w-full space-y-2 overflow-auto rounded-md bg-gray-100 p-4">
      No session data, please <b>Sign In</b> first.
    </p>
  )
}
