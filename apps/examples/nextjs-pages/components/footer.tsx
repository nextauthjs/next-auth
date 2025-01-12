import CustomLink from "./custom-link"

export default function Footer() {
  return (
    <footer className="mx-0 my-4 flex w-full flex-col space-y-1 px-4 text-sm sm:px-6 md:mx-auto md:my-12 md:h-5 md:max-w-3xl md:flex-row md:items-center md:space-x-4 md:space-y-0">
      <CustomLink href="https://nextjs.authjs.dev">Documentation</CustomLink>
      <CustomLink href="https://www.npmjs.com/package/next-auth">
        NPM
      </CustomLink>
      <CustomLink href="https://github.com/nextauthjs/next-auth/tree/main/apps/examples/nextjs-pages">
        Source on GitHub
      </CustomLink>
      <CustomLink href="/policy">Policy</CustomLink>
    </footer>
  )
}
