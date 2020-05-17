module.exports = {
  title: 'next-auth',
  tagline: 'Serverless Authentication, written from scratch for modern Next.js!',
  url: 'https://next-auth.js.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'iaincollins',
  projectName: 'next-auth',
  themeConfig: {
    navbar: {
      title: 'next-auth',
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
        /* { */
        /*   title: 'More', */
        /*   items: [ */
        /*     { */
        /*       label: 'GitHub', */
        /*       href: 'https://github.com/facebook/docusaurus', */
        /*     }, */
        /*   ], */
        /* }, */
      ],
      copyright: `Built with Docusaurus 🦖`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/iaincollins/next-auth/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
