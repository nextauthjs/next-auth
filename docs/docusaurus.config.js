const typedocConfig = require("./typedoc.json")
delete typedocConfig.$schema

/** @type {import("@docusaurus/types").Config} */
module.exports = {
  title: "Auth.js",
  tagline: "Authentication for the web.",
  url: "https://authjs.dev",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "nextauthjs",
  projectName: "next-auth",
  // TODO: remove this once ready
  onBrokenLinks: "log",
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
      indexName: "next-auth",
      searchParameters: {},
    },
    navbar: {
      title: "Auth.js",
      logo: {
        alt: "Auth.js Logo",
        src: "img/logo/logo-xs.png",
      },
      items: [
        {
          to: "/getting-started/introduction",
          activeBasePath: "/getting-started/",
          label: "Getting started",
          position: "left",
        },
        {
          to: "/guides/overview",
          activeBasePath: "/guides/",
          label: "Guides",
          position: "left",
        },
        {
          to: "/reference/index",
          activeBasePath: "/reference",
          label: "Reference",
          position: "left",
        },
        {
          to: "/concepts/faq",
          activeBasePath: "/concepts",
          label: "Concepts",
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
        "<a target='_blank' rel='noopener noreferrer' href='https://next-auth.js.org'>NextAuth.js</a> is becoming Auth.js! 🎉 We're creating Authentication for the Web. Everyone included. Starting with SvelteKit, check out the docs <a  href='/reference/sveltekit'>here</a>.",
      backgroundColor: "#000",
      textColor: "#fff",
    },
    footer: {
      links: [
        {
          title: "About Auth.js",
          items: [
            {
              label: "Introduction",
              to: "/getting-started/introduction",
            },
            {
              html: `
            <a target="_blank" rel="noopener noreferrer" href="https://vercel.com?utm_source=nextauthjs&utm_campaign=oss">
              <img
                alt="Powered by Vercel"
                style="margin-top: 8px"
                height="32"
                src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/docs/static/img/powered-by-vercel.svg"
              />
            </a>`,
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
              label: "Sponsors",
              to: "https://opencollective.com/nextauth",
            },
            {
              label: "Images by unDraw",
              to: "https://undraw.co/",
            },
          ],
        },
      ],
      copyright: `Auth.js &copy; Balázs Orbán ${new Date().getFullYear()}`,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/nextauthjs/next-auth/edit/main/docs",
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
              label: "experimental",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/index.css"),
        },
      },
    ],
  ],
  plugins: [
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        plugin: ["./tyepdoc-custom"],
        entryPoints: [
          "../packages/core/src/index.ts",
          "../packages/core/src/adapters.ts",
          "../packages/core/src/providers/index.ts",
          "../packages/core/src/providers/github.ts",
          "../packages/core/src/providers/spotify.ts",
          "../packages/core/src/providers/email.ts",
          "../packages/core/src/providers/credentials.ts",
          "../packages/core/src/jwt/index.ts",
        ],
        tsconfig: "../packages/core/tsconfig.json",
        out: "reference/03-core",
        watch: process.env.TYPEDOC_WATCH,
        includeExtension: false,
        sidebar: {
          categoryLabel: "Core",
          position: 2,
          // fullNames: true, // REVIEW do we want this?
        },
      },
    ],
  ],
}
