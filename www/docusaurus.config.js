module.exports = {
  title: 'NextAuth.js',
  tagline: 'Authentication for Next.js',
  url: 'https://next-auth.js.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'nextauthjs',
  projectName: 'next-auth',
  themeConfig: {
    sidebarCollapsible: true,
    prism: {
      theme: require('prism-react-renderer/themes/vsDark')
    },
    navbar: {
      title: 'NextAuth.js',
      logo: {
        alt: 'NextAuth Logo',
        src: 'img/logo/logo-xs.png'
      },
      links: [
        {
          to: '/getting-started/introduction',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left'
        },
        {
          to: '/tutorials',
          activeBasePath: 'docs',
          label: 'Tutorials',
          position: 'left'
        },
        {
          to: '/faq',
          activeBasePath: 'docs',
          label: 'FAQ',
          position: 'left'
        },
        {
          href: 'https://www.npmjs.com/package/next-auth',
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
    /*
    announcementBar: {
      id: 'release-candiate-announcement',
      content: 'NextAuth.js v2.0 has been released <a target="_blank" rel="noopener noreferrer" href="https://www.npmjs.com/package/next-auth">npm i next-auth</a>',
      backgroundColor: '#2DB2F9',
      textColor: '#fff'
    },
    */
    footer: {
      links: [
        {
          title: 'About NextAuth.js',
          items: [
            {
              label: 'Introduction',
              to: '/getting-started/introduction'
            },
            {
              label: 'Contributors',
              to: '/contributors'
            }
          ]
        },
        {
          title: 'Download',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/iaincollins/next-auth'
            },
            {
              label: 'NPM',
              to: 'https://www.npmjs.com/package/next-auth'
            }
          ]
        },
        {
          title: 'Acknowledgements',
          items: [
            {
              label: 'Docusaurus',
              to: 'https://v2.docusaurus.io/'
            },
            {
              label: 'Images by unDraw',
              to: 'https://undraw.co/'
            }
          ]
        }
      ],
      copyright: 'NextAuth.js &copy; Iain Collins 2020'
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/iaincollins/next-auth/edit/main/www'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  plugins: ['docusaurus-lunr-search']
}
