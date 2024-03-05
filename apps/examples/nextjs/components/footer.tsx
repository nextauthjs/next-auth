import CustomLink from "./custom-link"
import packageJSON from "next-auth/package.json"

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 px-4 my-4 mx-0 w-full text-sm sm:px-6 md:flex-row md:justify-between md:items-center md:my-12 md:mx-auto md:max-w-3xl md:h-5">
      <div className="flex flex-col gap-4 md:flex-row">
        <CustomLink href="https://nextjs.authjs.dev">Documentation</CustomLink>
        <CustomLink href="https://www.npmjs.com/package/next-auth">
          NPM
        </CustomLink>
        <CustomLink href="https://github.com/nextauthjs/next-auth/tree/main/apps/examples/nextjs">
          Source on GitHub
        </CustomLink>
        <CustomLink href="/policy">Policy</CustomLink>
      </div>
      <div className="flex gap-2 justify-start items-center">
        <img
          className="size-5"
          src="https://authjs.dev/img/logo/logo-sm.webp"
          alt="Auth.js Logo"
        />
        <CustomLink href="https://npmjs.org/package/next-auth">
          {packageJSON.version}
        </CustomLink>
      </div>
    </footer>
  )
}
