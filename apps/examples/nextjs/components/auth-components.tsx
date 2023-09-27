import { CSRF_experimental } from "auth"
import { Button } from "./ui/button"

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={provider ? `/api/auth/signin/${provider}` : "/api/auth/signin"}
      method="post"
    >
      <Button {...props}>Sign In</Button>
      <CSRF_experimental />
    </form>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action="/api/auth/signout" className="w-full" method="post">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
      <CSRF_experimental />
    </form>
  )
}
