import type { Session } from "next-auth"

export default function SessionData({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
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
          <div className="rounded-t-md bg-neutral-200 p-4 font-bold">
            Session
          </div>
          <pre className="whitespace-pre-wrap break-all px-4 py-6">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <p className="w-full rounded-md bg-gray-100 p-4">
      No session data, please <em>Sign In</em> first.
    </p>
  )
}
