const fs = require("fs")
const path = require("path")

// list providers entries from @auth/core/providers/*.ts
const coreSrc = "../packages/core/src"
const providers = fs
  .readdirSync(path.join(__dirname, coreSrc, "/providers"))
  .filter((file) => file.endsWith(".ts") && !file.startsWith("oauth"))
  .map((p) => `${coreSrc}/providers/${p}`)

const typedocConfig = require("./typedoc.json")
delete typedocConfig.$schema

/** @type {import("@docusaurus/types").Config} */
const docusaurusConfig = {
  title: "Auth.js",
  tagline: "Authentication for the Web.",
  url: "https://authjs.dev",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  organizationName: "nextauthjs",
  // TODO: remove this once ready
  onBrokenLinks: "log",
  projectName: "next-auth",
  themeConfig: {
    prism: {
      theme: require("prism-react-renderer/themes/nightOwl"),
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
      contextualSearch: false,
      externalUrlRegex: "authjs\\.dev|next-auth\\.js\\.org",
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
          to: "/guides",
          activeBasePath: "/guides",
          label: "Guides",
          position: "left",
        },
        {
          to: "/reference/core/modules/main",
          // TODO: change to this when the overview page looks better.
          // to: "/reference",
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
            <a target="_blank" rel="noopener noreferrer" href="https://vercel.com?utm_source=authjs&utm_campaign=oss">
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
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          breadcrumbs: false,
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/nextauthjs/next-auth/edit/main/docs",
          lastVersion: "current",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [require("@sapphire/docusaurus-plugin-npm2yarn2pnpm").npm2yarn2pnpm, require("remark-github")],
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
        id: "core",
        plugin: ["./tyepdoc"],
        entryPoints: ["index.ts", "adapters.ts", "errors.ts", "jwt.ts", "types.ts"].map((e) => `${coreSrc}/${e}`).concat(providers),
        tsconfig: "../packages/core/tsconfig.json",
        out: "reference/03-core",
        watch: process.env.TYPEDOC_WATCH,
        includeExtension: false,
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        id: "sveltekit",
        plugin: ["./tyepdoc"],
        entryPoints: ["index.ts", "client.ts"].map((e) => `../packages/frameworks-sveltekit/src/lib/${e}`),
        tsconfig: "../packages/frameworks-sveltekit/tsconfig.json",
        out: "reference/04-sveltekit",
        watch: process.env.TYPEDOC_WATCH,
        includeExtension: false,
      },
    ],
  ],
}

docusaurusConfig.headTags = [
  {
    tagName: "meta",
    attributes: {
      charSet: "utf-8",
    },
  },
  {
    tagName: "link",
    attributes: {
      rel: "canonical",
      href: docusaurusConfig.url,
    },
  },
  {
    tagName: "meta",
    attributes: {
      property: "og:title",
      content: docusaurusConfig.title,
    },
  },
  {
    tagName: "meta",
    attributes: {
      property: "og:description",
      content: docusaurusConfig.tagline,
    },
  },
  {
    tagName: "meta",
    attributes: {
      property: "og:image",
      content: `${docusaurusConfig.url}/img/og-image.png`,
    },
  },
  {
    tagName: "meta",
    attributes: {
      property: "og:url",
      content: docusaurusConfig.url,
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "twitter:card",
      content: "summary_large_image",
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "twitter:title",
      content: docusaurusConfig.title,
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "twitter:description",
      content: docusaurusConfig.tagline,
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "twitter:image",
      content: `${docusaurusConfig.url}/img/og-image.png`,
    },
  },
]

module.exports = docusaurusConfig
