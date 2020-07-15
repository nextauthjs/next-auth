import React from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import CodeBlock from '@theme/CodeBlock'
import ProviderMarquee from '../components/ProviderMarquee'
import Seo from './seo'
import styles from './styles.module.css'

const features = [
  {
    title: 'Flexible',
    imageUrl: 'img/undraw_authentication.svg',
    description: (
      <ul>
        <li>Built for Serverless, runs anywhere</li>
        <li>
          Bring Your Own Database – or none<br />
          <em>(MySQL, Postgres, MongoDB…)</em>
        </li>
        <li>Choose Database Sessions or JWT</li>
        <li>Secure web pages and API routes</li>
      </ul>
    )
  },
  {
    title: 'Easy',
    imageUrl: 'img/undraw_social.svg',
    description: (
      <ul>
        <li>Built in support for popular services<br />
          <em>(Google, Facebook, Auth0, Apple…)</em>
        </li>
        <li>API for OAuth service integration</li>
        <li>Email / Passwordless / Magic Link</li>
        <li>Use any username/password store</li>
      </ul>
    )
  },
  {
    title: 'Secure',
    imageUrl: 'img/undraw_secure.svg',
    description: (
      <ul>
        <li>Signed, prefixed, server-only cookies</li>
        <li>CSRF Token protection on HTTP POST</li>
        <li>JWT with JWS / JWE / JWK / JWK</li>
        <li>Tab/Window syncing and keepalives</li>
        <li>Does not rely on client side JavaScript</li>
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
      <h3 className='text--center'>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function Home () {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout description={siteConfig.tagline}>
      <Seo />
      <header className={classnames('hero', styles.heroBanner)}>
        <div className='container'>
          <div className='hero-inner'>
            <img
              src='/img/logo/logo-sm.png'
              alt='Shield with key icon'
              className={styles.heroLogo}
            />
            <div className={styles.heroText}>
              <h1 className='hero__title'>{siteConfig.title}</h1>
              <p className='hero__subtitle'>{siteConfig.tagline}</p>
            </div>
            <div className={styles.buttons}>
              <a
                className={classnames(
                  'button button--outline button--secondary button--lg rounded-pill',
                  styles.button
                )}
                href='https://next-auth-example.now.sh'
              >Live Demo
              </a>
              <Link
                className={classnames(
                  'button button--primary button--lg rounded-pill',
                  styles.button
                )}
                to={useBaseUrl('/getting-started/introduction')}
              >Get Started
              </Link>
            </div>
          </div>
          <div className='hero-marquee'>
            <ProviderMarquee />
          </div>
        </div>
        <div className='hero-wave'>
          <div className='hero-wave-inner' />
        </div>
      </header>
      <main className='home-main'>
        <section className={`section-features ${styles.features}`}>
          <div className='container'>
            <div className='row'>
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <p className='text--center'>
                  <a
                    href='https://www.npmjs.com/package/next-auth'
                    className='button button--secondary button--outline rounded-pill button--lg'
                  >npm install next-auth
                  </a>
                </p>
              </div>
            </div>
            <div className='row'>
              <div className='col col--6'>
                <div className='code'>
                  <h4 className='code-heading'>Server</h4>
                  <CodeBlock className='javascript'>{serverlessFunctionCode}</CodeBlock>
                </div>
              </div>
              <div className='col col--6'>
                <div className='code'>
                  <h4 className='code-heading'>Client</h4>
                  <CodeBlock className='javascript'>{reactComponentCode}</CodeBlock>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <p className='text--center' style={{ marginTop: '2rem' }}>
                  <Link
                    to='/getting-started/example'
                    className='button button--primary button--lg rounded-pill'
                  >Get Started
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className='container'>
          <div className='row home-subtitle'>
            {siteConfig.title} is not affiliated with Vercel or Next.js
          </div>
        </div>
      </main>
    </Layout>
  )
}

const reactComponentCode = `
import React from 'react'
import {
  signIn, 
  signOut,
  useSession
} from 'next-auth/client'

export default () => {
  const [ session, loading ] = useSession()

  return <>
    {!session && <>
      Not signed in <br/>
      <button onClick={signIn}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={signOut}>Sign out</button>
    </>}
  </>
}
`.trim()

const serverlessFunctionCode = `
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    // OAuth authentication providers
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // Sign in with passwordless email link
    Providers.Email({
      server: process.env.MAIL_SERVER,
      from: '<no-reply@example.com>'
    }),
  ],
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL
}

export default (req, res) => NextAuth(req, res, options)
`.trim()

export default Home
