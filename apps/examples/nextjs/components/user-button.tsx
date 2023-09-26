import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { auth } from "auth";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import CustomLink from "./custom-link";

export default async function UserButton() {
  const session = await auth();
  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8">
            {session.user?.picture && (
              <AvatarImage
                src={session.user?.picture}
                alt={session.user?.name ?? ""}
              />
            )}
            <AvatarFallback>{session.user?.email}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <CustomLink href="/api/auth/signout">
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </CustomLink>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href="api/auth/signin">
      <Button>Sign In</Button>
    </Link>
  );
}
