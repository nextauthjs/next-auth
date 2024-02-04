import type { Session } from "next-auth"

export default function SessionData({ session }: { session: Session | null }) {
  console.log("session-data.session", session)
  if (session?.user) {
    return (
      <div className="overflow-auto p-4 space-y-2 w-full bg-gray-100 rounded-md">
        <h2 className="text-xl font-bold">Current Session Data</h2>
        {Object.keys(session.user).length > 3 ? (
          <blockquote className="pl-2 border-l-4 border-gray-300">
            In this example, the whole session object is passed to the page,
            including the raw user object. Our recommendation is to{" "}
            <em>only pass the necessary fields</em> to the page, as the raw user
            object may contain sensitive information.
          </blockquote>
        ) : (
          <blockquote className="pl-2 border-l-4 border-gray-300">
            In this example, only some fields in the user object is passed to
            the page to avoid exposing sensitive information.
          </blockquote>
        )}
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    )
  }

  return (
    <p className="overflow-auto p-4 space-y-2 w-full bg-gray-100 rounded-md">
      No session data, please <b>Sign In</b> first.
    </p>
  )
}
