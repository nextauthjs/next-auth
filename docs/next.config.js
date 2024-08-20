import nextra from "nextra"

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  codeHighlight: true,
})

export default withNextra({
  redirects: () => {
    return [
      {
        source: "/security.txt",
        destination: "/.well-known/security.txt",
        permanent: true,
      },
      {
        source: "/new/provider-issue",
        destination:
          "https://github.com/nextauthjs/next-auth/issues/new?assignees=&labels=triage%2Cproviders&template=2_bug_provider.yml",
        permanent: true,
      },
      {
        source: "/new/github-discussions",
        destination:
          "https://github.com/nextauthjs/next-auth/discussions/categories/questions",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "sveltekit.authjs.dev" }],
        destination: "https://authjs.dev/reference/sveltekit",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "solid-start.authjs.dev" }],
        destination: "https://authjs.dev/reference/solid-start",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "express.authjs.dev" }],
        destination: "https://authjs.dev/reference/express",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "nextjs.authjs.dev" }],
        destination: "https://authjs.dev/reference/nextjs",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "qwik.authjs.dev" }],
        destination: "https://authjs.dev/reference/qwik",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "cli.authjs.dev" }],
        destination: "https://github.com/nextauthjs/cli",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "errors.authjs.dev" }],
        destination: "https://authjs.dev/reference/core/errors/:path*",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "warnings.authjs.dev" }],
        destination: "https://authjs.dev/reference/warnings/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "adapters.authjs.dev" }],
        destination: "https://authjs.dev/getting-started/database",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "adapters.authjs.dev" }],
        destination: "https://authjs.dev/reference/adapter/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "providers.authjs.dev" }],
        destination: "https://authjs.dev/getting-started/authentication/oauth",
        permanent: true,
      },
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "providers.authjs.dev" }],
        destination: "https://authjs.dev/getting-started/providers/:path",
        permanent: true,
      },
      {
        source: "/reference/core/providers_:slug(.*)",
        destination: "/reference/core/providers/:slug",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "discord.authjs.dev" }],
        destination: "https://discord.gg/kuv7wXkHY4",
        permanent: true,
      },
      {
        source: "/reference/next-auth:path(.*)",
        destination: "/reference/nextjs:path(.*)",
        permanent: true,
      },
      {
        source: "/img/providers/:providerId*-dark.svg",
        destination: "/img/providers/:providerId*.svg",
        permanent: true,
      },
      {
        source: "/reference/adapter/:path(.*)",
        destination: "/getting-started/adapters/:path(.*)",
        permanent: true,
      },
      {
        source: "/getting-started/providers/email",
        destination: "/getting-started/providers/nodemailer",
        permanent: true,
      },
      {
        source: "/guides/basics/role-based-access-control",
        destination: "/guides/role-based-access-control",
        permanent: true,
      },
      {
        source: "/guides/basics/refresh-token-rotation",
        destination: "/guides/refresh-token-rotation",
        permanent: true,
      },
      {
        source: "/getting-started/providers",
        destination: "/getting-started/authentication/oauth",
        permanent: true,
      },
      {
        source: "/getting-started/providers/oauth-tutorial",
        destination: "/getting-started/authentication/oauth",
        permanent: true,
      },
      {
        source: "/getting-started/providers/email-tutorial",
        destination: "/getting-started/authentication/email",
        permanent: true,
      },
      {
        source: "/getting-started/providers/credentials-tutorial",
        destination: "/getting-started/providers/credentials",
        permanent: true,
      },
      {
        source: "/guides/providers/email-http",
        destination: "/guides/configuring-http-email",
        permanent: true,
      },
      {
        source: "/guides/upgrade-to-v5",
        destination: "/getting-started/migrating-to-v5",
        permanent: true,
      },
      {
        permanent: true,
        source: "/guides",
        destination: "/guides/debugging",
      },
    ]
  },
  i18n: {
    locales: ["en", "ja"],
    defaultLocale: "en",
  },
})
