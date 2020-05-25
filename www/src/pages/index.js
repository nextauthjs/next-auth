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
    title: 'Easy to Setup',
    imageUrl: 'img/undraw_authentication.svg',
    description: (
      <ul>
        <li>Full stack open source authentication</li>
        <li>Designed for Next.js and serverless</li>
        <li>Use with any database</li>
        <li>Works in both client and server side React</li>
      </ul>
    )
  },
  {
    title: 'Easy to Sign in',
    imageUrl: 'img/undraw_social.svg',
    description: (
      <ul>
        <li>Built-in support for popular OAuth services (Google, Facebook, Twitter, Auth0…)</li>
        <li>Use with any OAuth service (1.x or 2.x)</li>
        <li>Passwordless email sign in</li>
        <li>Secure account linking</li>
      </ul>
    )
  },
  {
    title: 'Secure by Default',
    imageUrl: 'img/undraw_secure.svg',
    description: (
      <ul>
        <li>CSRF protection (double submit cookie)</li>
        <li>Cookies are signed, server-only, prefixed</li>
        <li>Session tokens secret from JavaScript</li>
        <li>Doesn't require client side JavaScript</li>
      </ul>
    )
  }
]

function Feature ({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className='text--center'>
          <div className='feature-image-wrapper'>
            <img className={styles.featureImage} src={imgUrl} alt={title} />
          </div>
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
            <a
              className={classnames(
                'button button--outline button--primary button--lg',
                styles.button
              )}
              href='https://next-auth-example.now.sh'
            >
              Try it out
            </a>
            <Link
              className={classnames(
                'button button--primary button--lg',
                styles.button
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
          <section className={styles.features}>
            <div className='row'>
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </section>
          <section>
            <div className='row'>
              <div className='col'>
                <h2 className='text--center'>Examples</h2>
              </div>
            </div>
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
            <div className='container'>
              <div className='row home-subtitle'>
                {siteConfig.title} is not affiliated with Vercel or Next.js
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  )
}

const reactComponentCode = `
import React from 'react'
import NextAuth from 'next-auth'

export default () => {
  const [ session, loading ] = NextAuth.useSession()

  return <p>
    {session && <>
      Signed in as {session.user.email}
      {' '}
      <a href="/api/auth/signout">Sign out</a>
    </>}
    {!session && 
      Not signed in
      {' '}
      <a href="/api/auth/signin">Sign in</a>
    }
  </p>
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
