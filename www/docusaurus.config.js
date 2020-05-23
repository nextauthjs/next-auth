module.exports = {
  title: 'NextAuth.js',
  tagline: 'Serverless authentication for Next.js',
  url: 'https://next-auth.js.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'iaincollins',
  projectName: 'next-auth',
  themeConfig: {
    navbar: {
      title: 'NextAuth.js',
      /*
      logo: {
        alt: 'NextAuth Logo',
        src: 'img/nextjs-logo.svg'
      },
      */
      links: [
        {
          to: '/getting-started',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left'
        },
        {
          to: '/about',
          activeBasePath: 'docs',
          label: 'About',
          position: 'left'
        },
        {
          href: 'https://www.npmjs.com/package/next-auth/v/beta',
          label: 'npm',
          position: 'right'
        },
        {
          href: 'https://github.com/iaincollins/next-auth',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    announcementBar: {
      id: 'beta-announcement',
      content: 'NextAuth v2 is in beta! <a target="_blank" rel="noopener noreferrer" href="https://github.com/iaincollins/next-auth/issues/99">View announcement</a>',
      backgroundColor: '#eee',
      textColor: '#091E42'
    },
    footer: {
      style: 'dark',
      links: [
        {
          // title: 'About',
          items: [
            {
              label: 'About',
              to: '/about'
            },
            {
              label: 'Contributors',
              to: '/contributors'
            },
          ]
        }
      ],
      copyright: 'Built with Docusaurus 🦖'
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/iaincollins/next-auth/edit/master/www'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  plugins: ['docusaurus-lunr-search']
}
