import { typedocFramework, typedocAdapter } from "./typedoc-utils"
import { themes } from "prism-react-renderer"
import pkgManagerPlugin from "@docusaurus/remark-plugin-npm2yarn"
import manifest from "./manifest.mjs"

import type { Config } from "@docusaurus/types"

const repo = { org: "nextauthjs", repo: "next-auth" }
const metadata = {
  url: "https://authjs.dev",
  title: "Auth.js",
  tagline: "Authentication for the Web.",
}

export default {
  ...metadata,
  organizationName: repo.org,
  projectName: repo.repo,
  baseUrl: "/",
  markdown: {
    mermaid: true,
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },
  themes: ["@docusaurus/theme-mermaid"],
  favicon: "img/favicon.ico",
  trailingSlash: false,
  // TODO: remove this once all links are fixed
  onBrokenLinks: "log",
  themeConfig: {
    prism: {
      theme: themes.nightOwl,
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
      title: metadata.title,
      logo: { alt: "Auth.js Logo", src: "img/logo/logo-xs.webp" },
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
          to: "/reference",
          activeBasePath: "/reference",
          label: "API Reference",
          position: "left",
        },
        {
          to: "/concepts/faq",
          activeBasePath: "/concepts",
          label: "Concepts",
          position: "left",
        },
        {
          to: "/security",
          activeBasePath: "/security",
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
        "<a target='_blank' rel='noopener noreferrer' href='https://next-auth.js.org'>NextAuth.js</a> is becoming Auth.js! 🎉 <a target='_blank' rel='noopener noreferrer' href='https://twitter.com/balazsorban44/status/1603082914362986496'>Read the announcement.</a> Note, this site is under active development. 🏗",
      backgroundColor: "#000",
      textColor: "#fff",
    },
    footer: {
      links: [
        {
          title: "About Auth.js",
          items: [
            { label: "Introduction", to: "/getting-started/introduction" },
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
            { label: "GitHub", to: "https://github.com/nextauthjs/next-auth" },
            { label: "NPM", to: "https://www.npmjs.com/package/next-auth" },
          ],
        },
        {
          title: "Acknowledgements",
          items: [
            { label: "Contributors", to: "/contributors" },
            { label: "Sponsors", to: "/sponsors" },
            { label: "Images by unDraw", to: "https://undraw.co/" },
          ],
        },
      ],
      copyright: `Auth.js &copy; Balázs Orbán ${new Date().getFullYear()}`,
    },
    colorMode: { respectPrefersColorScheme: true },
    docs: { sidebar: { autoCollapseCategories: true } },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        gtag: { trackingID: "AW-11313383806", anonymizeIP: true },
        docs: {
          breadcrumbs: false,
          routeBasePath: "/",
          numberPrefixParser: false,
          sidebarPath: require.resolve("./sidebars.js"),
          /**
           *
           * @param {{
           *  version: string;
           *  versionDocsDirPath: string;
           *  docPath: string;
           *  permalink: string;
           *  locale: string;
           *}} params
           */
          editUrl({ docPath }) {
            // TODO: support other packages, fix directory links like "providers"
            const base =
              "https://github.com/nextauthjs/next-auth/edit/main/packages"
            if (docPath.includes("reference/core")) {
              const file = docPath
                .split("reference/core/")[1]
                .replace(".md", ".ts")
                .replace("_", "/")
              return `${base}/core/src/${file}`
            } else if (docPath.includes("reference/adapter/")) {
              const file = docPath
                .split("reference/adapter/")[1]
                .replace("index.md", "src/index.ts")
              return `${base}/adapter-${file}`
            }
            return `https://github.com/nextauthjs/next-auth/edit/main/docs/docs/${docPath}`
          },
          lastVersion: "current",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [[pkgManagerPlugin, { sync: true }]],
          versions: { current: { label: "experimental" } },
          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args)
            const sidebarIdsToOmit = manifest.frameworks.map(
              (f) => `reference/${f.id}/index`
            )
            return sidebarItems.filter(
              ({ id }) => !sidebarIdsToOmit.includes(id)
            )
          },
        },
        theme: { customCss: require.resolve("./src/css/index.css") },
      },
    ],
  ],
  plugins: [
    ...manifest.frameworks.map(typedocFramework),
    ...(process.env.TYPEDOC_SKIP_ADAPTERS
      ? []
      : manifest.adapters.map(typedocAdapter)),
  ],
  scripts: [
    {
      src: "js/clerk.js",
      async: true,
    },
  ],
  headTags: [
    { tagName: "meta", attributes: { charSet: "utf-8" } },
    { tagName: "link", attributes: { rel: "canonical", href: metadata.url } },
    {
      tagName: "meta",
      attributes: { property: "og:title", content: metadata.title },
    },
    {
      tagName: "meta",
      attributes: { property: "og:description", content: metadata.tagline },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:image",
        content: `${metadata.url}/img/og-image.png`,
      },
    },
    {
      tagName: "meta",
      attributes: { property: "og:url", content: metadata.url },
    },
    {
      tagName: "meta",
      attributes: { name: "twitter:card", content: "summary_large_image" },
    },
    {
      tagName: "meta",
      attributes: { name: "twitter:title", content: metadata.title },
    },
    {
      tagName: "meta",
      attributes: { name: "twitter:description", content: metadata.tagline },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:image",
        content: `${metadata.url}/img/og-image.png`,
      },
    },
  ],
} satisfies Config
