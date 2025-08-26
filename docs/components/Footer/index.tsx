import React from "react"

function FooterSection({ children }) {
  return <div className="flex flex-col gap-4">{children}</div>
}

function FooterHeading({ children }) {
  return (
    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
      {children}
    </h3>
  )
}

function FooterLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-neutral-600 transition-colors hover:text-violet-500 dark:text-neutral-400 dark:hover:text-violet-400"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-8 pb-8 pt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FooterSection>
            <FooterHeading>About Auth.js</FooterHeading>
            <FooterLink href="/getting-started">Introduction</FooterLink>
            <FooterLink href="/security">Security</FooterLink>
            <FooterLink href="/getting-started/migrating-to-v5">
              Migrating to v5
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterHeading>Documentation</FooterHeading>
            <FooterLink href="/getting-started">Get Started</FooterLink>
            <FooterLink href="/getting-started/providers/42-school">
              Providers
            </FooterLink>
            <FooterLink href="/getting-started/adapters/azure-tables">
              Adapters
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterHeading>Community</FooterHeading>
            <FooterLink href="https://github.com/nextauthjs/next-auth">
              GitHub
            </FooterLink>
            <FooterLink href="https://discord.authjs.dev/?utm_source=docs">
              Discord
            </FooterLink>
            <FooterLink href="https://www.npmjs.com/package/next-auth">
              NPM
            </FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterHeading>Acknowledgements</FooterHeading>
            <FooterLink href="https://clerk.com">Clerk (Sponsor)</FooterLink>
            <FooterLink href="https://authjs.dev/contributors">
              Contributors
            </FooterLink>
            <FooterLink href="https://authjs.dev/sponsors">Sponsors</FooterLink>
          </FooterSection>
        </div>
        <div className="mt-16 border-t border-neutral-200 pt-8 text-center text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} Auth.js Team. Balázs Orbán and
            Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
