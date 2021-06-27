module.exports = {
  title: "NextAuth.js",
  tagline: "Authentication for Next.js",
  url: "https://next-auth.js.org",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "nextauthjs",
  projectName: "next-auth",
  themeConfig: {
    sidebarCollapsible: true,
    prism: {
      theme: require("prism-react-renderer/themes/vsDark"),
    },
    algolia: {
      apiKey: "b81e3ca39a920b7815e880aea49c00ec",
      indexName: "next-auth",
      searchParameters: {},
    },
    navbar: {
      title: "NextAuth.js",
      logo: {
        alt: "NextAuth Logo",
        src: "img/logo/logo-xs.png",
      },
      items: [
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
    // announcementBar: {
    //   id: 'release-candiate-announcement',
    //   content: 'NextAuth.js now has automatic 🤖 releases 🎉! Check out the <a href="https://next-auth-git-canary.nextauthjs.vercel.app">Canary documentation 📚</a>',
    //   backgroundColor: '#2DB2F9',
    //   textColor: '#fff'
    // },
    footer: {
      links: [
        {
          title: "About NextAuth.js",
          items: [
            {
              label: "Introduction",
              to: "/getting-started/introduction",
            },
            {
              label: "Contributors",
              to: "/contributors",
            },
            {
              label: "Next documentation",
              to: "https://next-auth-git-next.nextauthjs.vercel.app",
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
              label: "Docusaurus",
              to: "https://v2.docusaurus.io/",
            },
            {
              label: "Images by unDraw",
              to: "https://undraw.co/",
            },
            {
              html: `
            <a target="_blank" rel="noopener noreferrer" href="https://vercel.com?utm_source=nextauthjs&utm_campaign=oss">
              <img
                alt="Powered by Vercel"
                style="margin-top: 8px"
                height="32"
                src="https://raw.githubusercontent.com/nextauthjs/next-auth/canary/www/static/img/powered-by-vercel.svg"
              />
            </a>`,
            },
          ],
        },
      ],
      copyright: "NextAuth.js &copy; Iain Collins 2021",
    },
    colorMode: {
      respectPrefersColorScheme: true,
      switchConfig: {
        darkIcon: "🌑",
        lightIcon: "💡",
      },
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/nextauthjs/next-auth/edit/main/www",
        },
        theme: {
          customCss: require.resolve("./src/css/index.css"),
        },
      },
    ],
  ],
}
