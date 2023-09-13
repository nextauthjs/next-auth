// This is an example of how to protect content using server rendering
// and fetching data from Supabase with RLS enabled.
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { createClient } from "@supabase/supabase-js"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"

export default function Page({ data, session }) {
  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>Protected Page</h1>
      <p>Data fetched during SSR from Supabase with RSL enabled:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (!session)
    return {
      props: {
        session,
        data: null,
        error: "No session",
      },
    }

  const { supabaseAccessToken } = session

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  )
  // Now you can query with RLS enabled.
  const { data, error } = await supabase.from("users").select("*")

  return {
    props: {
      session,
      data,
      error,
    },
  }
}
