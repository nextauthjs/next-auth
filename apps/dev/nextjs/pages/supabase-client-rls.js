import Layout from "../components/layout"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { createClient } from "@supabase/supabase-js"

export default function Page() {
  const { data: session } = useSession()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (session) {
      // User is logged in, let's fetch their data.
      const { supabaseAccessToken } = session
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          global: {
            headers: { Authorization: `Bearer ${supabaseAccessToken}` },
          },
        }
      )
      // Fetch data with RLS enabled.
      supabase
        .from("users")
        .select("*")
        .then(({ data }) => setData(data))
    }
  }, [session])

  return (
    <Layout>
      <h1>Fetch Data from Supabase with RLS</h1>
      <h2>Client-side data fetching with RLS:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <h2>API Example</h2>
      <p>
        You can also use Supabase in API routes. See the code in the
        `/pages/api/examples/supabase-rls.js` file.
      </p>
      <p>
        <em>You must be signed in to see responses.</em>
      </p>
      <p>/api/examples/supabase-rls</p>
      <iframe src="/api/examples/supabase-rls" />
    </Layout>
  )
}
