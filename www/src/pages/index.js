import React from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import CodeBlock from '@theme/CodeBlock'
import Seo from './seo'
import styles from './styles.module.css'

const features = [
  {
    title: 'Easy to Setup',
    imageUrl: 'img/undraw_authentication.svg',
    description: (
      <ul>
        <li>Designed for Next.js and Serverless</li>
        <li>
          Bring Your Own Database – or no database!<br />
          <em>(MySQL, MariaDB, Postgres, MongoDB…)</em>
        </li>
        <li>JSON Web Tokens or Session Database</li>
      </ul>
    )
  },
  {
    title: 'Easy to Sign in',
    imageUrl: 'img/undraw_social.svg',
    description: (
      <ul>
        <li>Sign in with any OAuth service</li>
        <li>Sign in with any email / passwordless</li>
        <li>Built in support for popular OAuth services <br />
          <em>(Google, Facebook, Twitter, Auth0, Apple…)</em>
        </li>

      </ul>
    )
  },
  {
    title: 'Secure by Default',
    imageUrl: 'img/undraw_secure.svg',
    description: (
      <ul>
        <li>CSRF protection with double submit cookie</li>
        <li>Signed, refixed, server-only cookies</li>
        <li>Signed + Encrypted (HMAC+AES) JWT</li>
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
          <img
            src='/img/logo/logo-with-icon-sm.png'
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
                'button button--outline button--primary button--lg rounded-pill',
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
      </header>
      <main className='home-main'>
        <section className={`section-features ${styles.features}`}>
          <div className='container'>
            <h2 className='text--center'>
              Full stack open source authentication
            </h2>
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
                  <h4 className='code-heading'>Step 1 – Add API Route</h4>
                  <CodeBlock className='javascript'>{serverlessFunctionCode}</CodeBlock>
                </div>
              </div>
              <div className='col col--6'>
                <div className='code'>
                  <h4 className='code-heading'>Step 2 – Add React Component</h4>
                  <CodeBlock className='javascript'>{reactComponentCode}</CodeBlock>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <p className='text--center'>
                  <Link
                    to='/getting-started/example'
                    className='button button--secondary button--ouline button--lg rounded-pill'
                  >Example Code
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
  useSession, 
  signin, 
  signout 
} from 'next-auth/client'

export default () => {
  const [ session, loading ] = useSession()

  return <p>
    {!session && <>
      Not signed in <br/>
      <button onClick={signin}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={signout}>Sign out</button>
    </>}
  </p>
}
`.trim()

const serverlessFunctionCode = `
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: 'https://example.com'
  providers: [
    // OAuth authentication providers
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
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
