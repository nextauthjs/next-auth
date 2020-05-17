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
        alt: 'My Site Logo',
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
              to: '/upgrade',
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
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/iaincollins/next-auth/docs/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
