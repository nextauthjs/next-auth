import * as React from "react"
import Link from "@docusaurus/Link"
import useBaseUrl from "@docusaurus/useBaseUrl"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import CodeBlock from "@theme/CodeBlock"
import Layout from "@theme/Layout"
import classnames from "classnames"
import { useEffect } from "react"
import ProviderMarquee from "../components/ProviderMarquee"
import styles from "./index.module.css"
import providers from "../../providers.json"

const providersCount = Object.keys(providers).length + 2 // email, credentials
const features = [
  {
    title: "Easy",
    imageUrl: "img/undraw_social.svg",
    description: (
      <ul>
        <li>
          Built in support for {providersCount}+ popular services
          <br />
          <em>(Google, Facebook, Auth0, Apple…)</em>
        </li>
        <li>
          Use with <i>any</i> OAuth 2 or OpenID Connect provider
        </li>
        <li>Built in email / passwordless / magic link</li>
        <li>
          Use with <i>any</i> username / password store
        </li>
      </ul>
    ),
  },
  {
    title: "Flexible",
    imageUrl: "img/undraw_authentication.svg",
    description: (
      <ul>
        <li>
          Runtime agnostic, runs anywhere!
          <br />
          <em>Vercel Edge Functions, Node.js, Serverless…</em>
        </li>
        <li>
          Use with any modern framework!
          <br />
          <em>Next.js, SolidStart, SvelteKit…</em>
        </li>
        <li>
          Bring Your Own Database - or none!
          <br />
          <em>MySQL, Postgres, MSSQL, MongoDB…</em>
        </li>
        <li>Choose database sessions or JWT</li>
      </ul>
    ),
  },
  {
    title: "Secure",
    imageUrl: "img/undraw_secure.svg",
    description: (
      <ul>
        <li>Signed, prefixed, server-only cookies</li>
        <li>Built-in CSRF protection</li>
        <li>JWT with JWS / JWE / JWK</li>
        {/* <li>Tab syncing, auto-revalidation, keepalives</li> */}
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
      {description}
    </div>
  )
}

export default function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context

  useEffect(() => {
    window
      .fetch("https://api.github.com/repos/nextauthjs/next-auth")
      .then((res) => res.json())
      .then((data) => {
        const githubLink = document.querySelector(
          ".navbar__item.navbar__link[href*='github']"
        )
        const githubStat = document.createElement("span")
        githubStat.innerHTML = kFormatter(data.stargazers_count)
        githubStat.className = "github-counter"
        githubLink.appendChild(githubStat)
      })
  }, [])
  return (
    <Layout description={siteConfig.tagline}>
      <div className="home-wrapper">
        <header className={classnames("hero", styles.heroBanner)}>
          <div className="container">
            <div className="hero-inner">
              <img
                src="/img/logo/logo-sm.webp"
                alt="Shield with key icon"
                className={styles.heroLogo}
                height="142"
                width="128"
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
                  Next.js Demo
                </a>
                <a
                  className={classnames(
                    "button button--outline button--secondary button--lg rounded-pill",
                    styles.button
                  )}
                  href="https://sveltekit-auth-example.vercel.app"
                >
                  SvelteKit Demo
                </a>
                <a
                  className={classnames(
                    "button button--outline button--secondary button--lg rounded-pill",
                    styles.button
                  )}
                  href="https://auth-solid.vercel.app"
                >
                  SolidStart Demo
                </a>
                <Link
                  className={classnames(
                    "button button--primary button--lg rounded-pill",
                    styles.button
                  )}
                  to={useBaseUrl("/getting-started/introduction")}
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
                      href="https://www.npmjs.com/package/@auth/core"
                      className="button button--primary button--outline rounded-pill button--lg"
                    >
                      npm install @auth/core
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
                    <div className="code-heading">
                      Next.js <span>/pages/api/auth/[...nextauth].ts</span>
                    </div>
                    <CodeBlock className="prism-code language-js">
                      {nextJsCode}
                    </CodeBlock>
                  </div>
                </div>
                <div className="col col--6">
                  <div className="code">
                    <div className="code-heading">
                      SvelteKit <span>/hooks.server.ts</span>
                    </div>
                    <CodeBlock className="prism-code language-js">
                      {svelteKitCode}
                    </CodeBlock>
                  </div>
                </div>
                <div className="col col--6">
                  <div className="code">
                    <div className="code-heading">
                      SolidStart <span>/routes/api/auth/[...solidauth].ts</span>
                    </div>
                    <CodeBlock className="prism-code language-js">
                      {solidStartCode}
                    </CodeBlock>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p className="text--center" style={{ marginTop: "2rem" }}>
                    <Link
                      to="/getting-started/introduction"
                      className="button button--primary button--lg rounded-pill"
                    >
                      Example Code
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div className={styles.homeSubtitle}>
            <p>Auth.js is an open source community project.</p>
          </div>
        </main>
      </div>
    </Layout>
  )
}

const svelteKitCode = `
import SvelteKitAuth from "@auth/sveltekit"
import GitHub from '@auth/core/providers/github'
import Facebook from '@auth/core/providers/facebook'
import Google from '@auth/core/providers/google'

import { 
  GITHUB_ID,
  GITHUB_SECRET,
  FACEBOOK_ID,
  FACEBOOK_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET
} from "$env/static/private"

export const handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    Facebook({ clientId: FACEBOOK_ID, clientSecret: FACEBOOK_SECRET }),
    Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })
  ],
})
`.trim()

const solidStartCode =
  `import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start";
import GitHub from "@auth/core/providers/github";

export const authOpts: SolidAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);`.trim()

const nextJsCode = `
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ]
})
`.trim()
