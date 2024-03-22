import { auth } from "auth"
import Image from "next/image"
import { Button } from "./ui/button"
import { SignIn, SignOut } from "./auth-components"

export default async function UserButton() {
  const session = await auth()
  if (!session?.user) return <SignIn />
  return (
    <div className="flex gap-6 items-center">
      <div className="flex gap-2 items-center p-2 px-4 rounded-md bg-neutral-100">
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <div className="w-8 h-8">
            <Image
              src={
                session.user.image ??
                "https://source.boringavatars.com/marble/120"
              }
              alt={session.user.name ?? ""}
            />
          </div>
        </Button>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {session.user.name}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {session.user.email}
          </p>
        </div>
      </div>
      <SignOut />
    </div>
  )
}
