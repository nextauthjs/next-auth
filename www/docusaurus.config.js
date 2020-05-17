module.exports = {
  title: 'NextAuth',
  tagline: 'Serverless Authentication, written from scratch for Next.js',
  url: 'https://next-auth.js.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'iaincollins',
  projectName: 'next-auth',
  themeConfig: {
    navbar: {
      title: 'NextAuth',
      logo: {
        alt: 'NextAuth Logo',
        src: 'img/nextjs-logo.svg',
      },
      links: [
        {
          to: '/getting-started',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/iaincollins/next-auth',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://npmjs.com/package/next-auth',
          label: 'NPM',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started',
            },
            {
              label: 'Migrating from v1',
              to: '/upgrading',
            },
          ],
        },
      ],
      copyright: `Built with Docusaurus 🦖`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/iaincollins/next-auth/tree/master/www',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
