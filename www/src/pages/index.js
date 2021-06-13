import React, { useEffect } from "react"
import classnames from "classnames"
import Layout from "@theme/Layout"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import useBaseUrl from "@docusaurus/useBaseUrl"
import CodeBlock from "@theme/CodeBlock"
import ProviderMarquee from "../components/ProviderMarquee"
import Seo from "./seo"
import styles from "./index.module.css"

const features = [
  {
    title: "Easy",
    imageUrl: "img/undraw_social.svg",
    description: (
      <ul>
        <li>
          Built in support for popular services
          <br />
          <em>(Google, Facebook, Auth0, Apple…)</em>
        </li>
        <li>Built in email / passwordless / magic link</li>
        <li>Use with any username / password store</li>
        <li>Use with OAuth 1.0 &amp; 2.0 services</li>
      </ul>
    ),
  },
  {
    title: "Flexible",
    imageUrl: "img/undraw_authentication.svg",
    description: (
      <ul>
        <li>Built for Serverless, runs anywhere</li>
        <li>
          Bring Your Own Database - or none!
          <br />
          <em>(MySQL, Postgres, MSSQL, MongoDB…)</em>
        </li>
        <li>Choose database sessions or JWT</li>
        <li>Secure web pages and API routes</li>
      </ul>
    ),
  },
  {
    title: "Secure",
    imageUrl: "img/undraw_secure.svg",
    description: (
      <ul>
        <li>Signed, prefixed, server-only cookies</li>
        <li>HTTP POST + CSRF Token validation</li>
        <li>JWT with JWS / JWE / JWK / JWK</li>
        <li>Tab syncing, auto-revalidation, keepalives</li>
        <li>Doesn't rely on client side JavaScript</li>
      </ul>
    ),
  },
]

const kFormatter = (num) => {
  return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
}

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={classnames("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <div className="feature-image-wrapper">
            <img className={styles.featureImage} src={imgUrl} alt={title} />
          </div>
        </div>
      )}
      <h3 className="text--center">{title}</h3>
      <div>{description}</div>
    </div>
  )
}

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context

  useEffect(() => {
    fetch("https://api.github.com/repos/nextauthjs/next-auth")
      .then((res) => res.json())
      .then((data) => {
        const navLinks = document.getElementsByClassName(
          "navbar__item navbar__link"
        )
        const githubStat = document.createElement("span")
        githubStat.innerHTML = kFormatter(data.stargazers_count)
        githubStat.className = "github-counter"
        navLinks[4].appendChild(githubStat)
      })
  }, [])
  return (
    <Layout description={siteConfig.tagline}>
      <Seo />
      <div className="home-wrapper">
        <header className={classnames("hero", styles.heroBanner)}>
          <div className="container">
            <div className="hero-inner">
              <img
                src="/img/logo/logo-sm.png"
                alt="Shield with key icon"
                className={styles.heroLogo}
              />
              <div className={styles.heroText}>
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
              </div>
              <div className={styles.buttons}>
                <a
                  className={classnames(
                    "button button--outline button--secondary button--lg rounded-pill",
                    styles.button
                  )}
                  href="https://next-auth-example.vercel.app"
                >
                  Live Demo
                </a>
                <Link
                  className={classnames(
                    "button button--primary button--lg rounded-pill",
                    styles.button
                  )}
                  to={useBaseUrl("/getting-started/example")}
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hero-marquee">
              <ProviderMarquee />
            </div>
          </div>
          <div className="hero-wave">
            <div className="hero-wave-inner" />
          </div>
        </header>
        <main className="home-main">
          <section className={`section-features ${styles.features}`}>
            <div className="container">
              <div className="row">
                <div className="col">
                  <h2 className={styles.featuresTitle}>
                    <span>Open Source.</span> <span>Full Stack.</span>{" "}
                    <span>Own Your Data.</span>
                  </h2>
                </div>
              </div>
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
          <section>
            <div className="container">
              <div className="row">
                <div className="col">
                  <p className="text--center">
                    <a
                      href="https://www.npmjs.com/package/next-auth"
                      className="button button--primary button--outline rounded-pill button--lg"
                    >
                      npm install next-auth
                    </a>
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <h2 className="text--center" style={{ fontSize: "2.5rem" }}>
                    Add authentication in minutes!
                  </h2>
                </div>
              </div>
              <div className="row">
                <div className="col col--6">
                  <div className="code">
                    <h4 className="code-heading">
                      Server <span>/pages/api/auth/[...nextauth].js</span>
                    </h4>
                    <CodeBlock className="javascript">
                      {serverlessFunctionCode}
                    </CodeBlock>
                  </div>
                </div>
                <div className="col col--6">
                  <div className="code">
                    <h4 className="code-heading">
                      Client <span>/pages/index.js</span>
                    </h4>
                    <CodeBlock className="javascript">
                      {reactComponentCode}
                    </CodeBlock>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p className="text--center" style={{ marginTop: "2rem" }}>
                    <Link
                      to="/getting-started/example"
                      className="button button--primary button--lg rounded-pill"
                    >
                      Example Code
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div className="home-subtitle">
            <p>NextAuth.js is an open source community project.</p>
          </div>
        </main>
      </div>
    </Layout>
  )
}

const reactComponentCode = `
import {
  useSession, signIn, signOut
} from "next-auth/react"

export default function Component() {
  const [ session, loading ] = useSession()
  if(session) {
    return <>
      Signed in as {session.user.email} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
    Not signed in <br/>
    <button onClick={() => signIn()}>Sign in</button>
  </>
}`.trim()

const serverlessFunctionCode = `
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    // OAuth authentication providers...
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
    // Passwordless / email sign in
    Providers.Email({
      server: process.env.MAIL_SERVER,
      from: 'NextAuth.js <no-reply@example.com>'
    }),
  ]
})
`.trim()

export default Home
