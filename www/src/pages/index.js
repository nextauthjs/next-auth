import React from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import CodeBlock from '@theme/CodeBlock'
import styles from './styles.module.css'

const features = [
  {
    title: <>Easy to Use</>,
    imageUrl: 'img/undraw_authentication.svg',
    description: (
      <>
        Open source full stack authentication library designed for Next.js and serverless deployment. Simple to setup
        with either an SQL or noSQL database. Use with client and server side React.
      </>
    )
  },
  {
    title: <>oAuth and Passwordless</>,
    imageUrl: 'img/undraw_social.svg',
    description: (
      <>
        Comes with built-in support for popular oAuth providers, including Google, Facebook, Twitter, GitHub and Auth0.
        Use with any oAuth service. Supports passwordless email sign in.
      </>
    )
  },
  {
    title: <>Secure</>,
    imageUrl: 'img/undraw_secure.svg',
    description: (
      <>
        CSRF protection, signed server-only prefixed cookies (secure / host only) and secure account linking.
        Doesn't expose session tokens to client side JavaScript, or rely on client side JavaScript.
      </>
    )
  }
]

function Feature ({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className='text--center'>
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function Home () {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout title='Home' description={siteConfig.tagline}>
      <header className={classnames('hero', styles.heroBanner)}>
        <div className='container'>
          <h1 className='hero__title'>{siteConfig.title}</h1>
          <p className='hero__subtitle'>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--primary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('/getting-started')}
            >
                Get Started
            </Link>
          </div>
        </div>
      </header>
      <main className='home-main'>
        <div className='container'>
          <div className='row'>
            <div className='col col--6'>
              <div className='code'>
                <h4 className='code-heading'>Serverless function</h4>
                <CodeBlock className='javascript'>{serverlessFunctionCode}</CodeBlock>
              </div>
            </div>
            <div className='col col--6'>
              <div className='code'>
                <h4 className='code-heading'>React component</h4>
                <CodeBlock className='javascript'>{reactComponentCode}</CodeBlock>
              </div>
            </div>
          </div>
        </div>
        {features && features.length && (
          <section className={styles.features}>
            <div className='container'>
              <div className='row'>
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
              <div className='row home-subtitle'>
                NextAuth is not affiliated with Vercel, Next.js or Now.sh
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  )
}

const reactComponentCode = `
import React from 'react'
import NextAuth from 'next-auth'

export default () => {
  const [session, loading] = NextAuth.useSession()

  return <>
    {session && <p>Signed in as {session.user.email}.</p>}
    {!session && <p><a href="/api/auth/signin">Sign in</p>}
  </>
}
`.trim()

const serverlessFunctionCode = `
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: 'https://example.com'
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    Providers.Email({
      server: 'smtp://username:password@smtp.example.com',
      from: '<no-reply@example.com>'
    }),
  ],
  database: process.env.DATABASE_URI
}

export default (req, res) => NextAuth(req, res, options)
`.trim()

export default Home
