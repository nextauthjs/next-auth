import { MainNav } from "./main-nav"
import UserButton from "./user-button"

export default function Header() {
  return (
    <header className="flex sticky justify-center border-b">
      <div className="flex justify-between items-center px-4 mx-auto w-full max-w-3xl h-16 sm:px-6">
        <MainNav />
        <UserButton />
      </div>
    </header>
  )
}
