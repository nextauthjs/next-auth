// This is an example of how to query data from Supabase with RLS.
// Learn more about Row Levele Security (RLS): https://supabase.com/docs/guides/auth/row-level-security
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { createClient } from "@supabase/supabase-js"

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session)
    return res.send(JSON.stringify({ error: "No session!" }, null, 2))

  const { supabase_access_token } = session

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabase_access_token}`,
        },
      },
    }
  )
  // Now you can query with RLS enabled.
  const { data, error } = await supabase.from("users").select("*")

  res.send(JSON.stringify({ supabase_access_token, data, error }, null, 2))
}
