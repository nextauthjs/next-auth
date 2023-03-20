// @ts-check

const fs = require("fs")
const path = require("path")

// list providers entries from @auth/core/providers/*.ts
const coreSrc = "../packages/core/src"
const providers = fs
  .readdirSync(path.join(__dirname, coreSrc, "/providers"))
  .filter((file) => file.endsWith(".ts") && !file.startsWith("oauth"))
  .map((p) => `${coreSrc}/providers/${p}`)

const typedocConfig = require("./typedoc.json")
// @ts-expect-error
delete typedocConfig.$schema

/**
 * @param {string} name
 * @returns Record<string, any>
 */
function createTypeDocAdapterConfig(name) {
  const slug = name.toLowerCase().replace(" ", "-")

  return {
    id: slug,
    plugin: [require.resolve("./typedoc-mdn-links")],
    watch: process.env.TYPEDOC_WATCH,
    entryPoints: [`../packages/adapter-${slug}/src/index.ts`],
    tsconfig: `../packages/adapter-${slug}/tsconfig.json`,
    out: `reference/adapter/${slug}`,
    sidebar: {
      indexLabel: name,
    },
  }
}

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
        src: "img/logo/logo-xs.webp",
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
          to: "/reference/core",
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
        "<a target='_blank' rel='noopener noreferrer' href='https://next-auth.js.org'>NextAuth.js</a> is becoming Auth.js! 🎉 We're creating Authentication for the Web. Everyone included. Starting with SvelteKit, check out <a href='/reference/sveltekit'>the docs</a>. Note, this site is under active development.",
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
                width="167"
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
          remarkPlugins: [require("@sapphire/docusaurus-plugin-npm2yarn2pnpm").npm2yarn2pnpm],
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
        plugin: [require.resolve("./typedoc-mdn-links")],
        watch: process.env.TYPEDOC_WATCH,
        entryPoints: ["index.ts", "adapters.ts", "errors.ts", "jwt.ts", "types.ts"].map((e) => `${coreSrc}/${e}`).concat(providers),
        tsconfig: "../packages/core/tsconfig.json",
        out: "reference/core",
        sidebar: {
          indexLabel: "index",
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        id: "sveltekit",
        plugin: [require.resolve("./typedoc-mdn-links")],
        watch: process.env.TYPEDOC_WATCH,
        entryPoints: ["index.ts", "client.ts"].map((e) => `../packages/frameworks-sveltekit/src/lib/${e}`),
        tsconfig: "../packages/frameworks-sveltekit/tsconfig.json",
        out: "reference/sveltekit",
        sidebar: {
          indexLabel: "index",
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        ...createTypeDocAdapterConfig("Firebase"),
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        ...createTypeDocAdapterConfig("Dgraph"),
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        ...createTypeDocAdapterConfig("Prisma"),
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        ...createTypeDocAdapterConfig("Fauna"),
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        id: "typeorm",
        plugin: [require.resolve("./typedoc-mdn-links")],
        watch: process.env.TYPEDOC_WATCH,
        entryPoints: [`../packages/adapter-typeorm-legacy/src/index.ts`],
        tsconfig: `../packages/adapter-typeorm-legacy/tsconfig.json`,
        out: `reference/adapter/typeorm`,
        sidebar: {
          indexLabel: "TypeORM",
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        ...createTypeDocAdapterConfig("DynamoDB"),
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        ...createTypeDocAdapterConfig("MongoDB"),
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typedocConfig,
        ...createTypeDocAdapterConfig("PouchDB"),
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
