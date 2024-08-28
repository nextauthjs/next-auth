import { signIn, signOut } from "next-auth/react"
import { Button } from "./ui/button"

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button onClick={() => signIn()} {...props}>
      Sign In
    </Button>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button
      onClick={() => signOut()}
      variant="ghost"
      className="w-full p-0"
      {...props}
    >
      Sign Out
    </Button>
  )
}
