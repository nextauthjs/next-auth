import { signIn, useSession } from "@auth/nextjs/client"

export default function Client() {
  const { data: session } = useSession()
  return (
    <div>
      {JSON.stringify(session)}
      <button onClick={() => signIn("github")}>Sign in</button>
    </div>
  )
}
