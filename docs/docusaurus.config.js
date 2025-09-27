/** @type {import("@docusaurus/types").Config} */
module.exports = {
  title: "NextAuth.js",
  tagline: "Authentication for Next.js",
  url: "https://next-auth.js.org",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "nextauthjs",
  projectName: "next-auth",
  themeConfig: {
    prism: {
      theme: require("prism-react-renderer/themes/vsDark"),
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
      ],
    },
    algolia: {
      appId: "OUEDA16KPG",
      apiKey: "97c0894508f2d1d4a2fef4fe6db28448",
      indexName: "next-auth-v4",
      searchParameters: {},
      contextualSearch: false,
      externalUrlRegex: "authjs\\.dev|next-auth\\.js\\.org",
    },
    navbar: {
      title: "NextAuth.js",
      logo: {
        alt: "NextAuth Logo",
        src: "img/logo/logo-xs.png",
      },
      items: [
        // TODO: This is the new navigation for the BETA Docs.
        //       Add an env var at build time to switch between this nav
        //       and the old at build time.
        // {
        //   to: "/beta/getting-started/introduction",
        //   activeBasePath: "/beta/getting-started/",
        //   label: "Getting started",
        //   position: "left",
        // },
        // {
        //   to: "/beta/guides/overview",
        //   activeBasePath: "/beta/guides/",
        //   label: "Guides",
        //   position: "left",
        // },
        // {
        //   to: "/beta/reference/index",
        //   activeBasePath: "/beta/reference",
        //   label: "Reference",
        //   position: "left",
        // },
        // {
        //   to: "/beta/concepts/faq",
        //   activeBasePath: "/beta/concepts",
        //   label: "Concepts",
        //   position: "left",
        // },
        {
          to: "/getting-started/introduction",
          activeBasePath: "docs",
          label: "Documentation",
          position: "left",
        },
        {
          to: "/tutorials",
          activeBasePath: "docs",
          label: "Tutorials",
          position: "left",
        },
        {
          to: "/faq",
          activeBasePath: "docs",
          label: "FAQ",
          position: "left",
        },
        {
          to: "/security",
          activeBasePath: "docs",
          label: "Security",
          position: "left",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: "https://github.com/nextauthjs/next-auth/releases",
              label: "All Releases",
            },
          ],
        },
        {
          to: "https://www.npmjs.com/package/next-auth",
          label: "npm",
          position: "right",
        },
        {
          to: "https://github.com/nextauthjs/next-auth",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    announcementBar: {
      id: "new-major-announcement",
      content:
        "NextAuth.js is becoming Auth.js! 🎉 We're creating Authentication for the Web. Everyone included. You are looking at the NextAuth.js (v4) documentation. For the new documentation go to <a target='_blank' rel='noopener noreferrer' href='https://authjs.dev'>authjs.dev</a>.",
      backgroundColor: "#000",
      textColor: "#fff",
    },
    footer: {
      links: [
        {
          title: "About NextAuth.js",
          items: [
            {
              label: "Introduction",
              to: "/getting-started/introduction",
            },
          ],
        },
        {
          title: "Download",
          items: [
            {
              label: "GitHub",
              to: "https://github.com/nextauthjs/next-auth",
            },
            {
              label: "NPM",
              to: "https://www.npmjs.com/package/next-auth",
            },
          ],
        },
        {
          title: "Acknowledgements",
          items: [
            {
              label: "Contributors",
              to: "/contributors",
            },  
            {
              label: "Images by unDraw",
              to: "https://undraw.co/",
            },
          ],
        },
      ],
      copyright: `NextAuth.js &copy; Iain Collins ${new Date().getFullYear()}`,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        gtag: { trackingID: "AW-11313383806", anonymizeIP: true },
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/nextauthjs/next-auth/edit/v4/docs",
          lastVersion: "current",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [
            require("@sapphire/docusaurus-plugin-npm2yarn2pnpm").npm2yarn2pnpm,
            require("remark-github"),
            require("mdx-mermaid"),
          ],
          versions: {
            current: {
              label: "v4",
            },
            v3: {
              label: "v3",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/index.css"),
        },
      },
    ],
  ],
}
