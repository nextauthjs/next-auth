import type { Session } from "next-auth"

export default function SessionData({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <div className="flex flex-col gap-4 p-4 w-full bg-gray-100 rounded-md">
        <h2 className="text-xl font-bold">Current Session Data</h2>
        {Object.keys(session.user).length > 3 ? (
          <p>
            In this example, the whole session object is passed to the page,
            including the raw user object. Our recommendation is to{" "}
            <em>only pass the necessary fields</em> to the page, as the raw user
            object may contain sensitive information.
          </p>
        ) : (
          <p>
            In this example, only some fields in the user object is passed to
            the page to avoid exposing sensitive information.
          </p>
        )}
        <div className="flex flex-col rounded-md bg-neutral-100">
          <div className="p-4 font-bold rounded-t-md bg-neutral-200">
            Session
          </div>
          <pre className="py-6 px-4 whitespace-pre-wrap break-all">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <p className="p-4 w-full bg-gray-100 rounded-md">
      No session data, please <em>Sign In</em> first.
    </p>
  )
}
