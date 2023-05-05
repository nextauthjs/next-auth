// This is an example of how to protect content using server rendering
import { getServerSession } from "auth"
import AccessDenied from "components/access-denied"

export default function Page({ content, session }) {
  // If no session exists, display access denied message
  if (!session) return <AccessDenied />

  // If session exists, display content
  return (
    <>
      <h1>Protected Page</h1>
      <p>
        <strong>{content}</strong>
      </p>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res)
  if (session) {
    // Note usually you don't need to fetch from an API route in getServerSideProps
    // This is done here to demonstrate how you can fetch from a third-party API
    // with a valid session. Likely you would also not pass cookies but an `Authorization` header
    const hostname = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const res = await fetch(`${hostname}/api/examples/protected`, {
      headers: { cookie: context.req.headers.cookie },
    })
    return { props: { session, content: (await res.json()).content } }
  }

  return { props: {} }
}
