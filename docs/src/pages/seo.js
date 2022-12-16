// eslint-disable-next-line no-use-before-define
import * as React from "react"
import Head from "@docusaurus/Head"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

export default function Seo() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  const { title, tagline, url } = siteConfig

  return (
    <Head>
      <meta charSet="utf-8" />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={tagline} />
      <meta property="og:image" content={`${url}/img/og-image.png`} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={tagline} />
      <meta name="twitter:image" content={`${url}/img/og-image.png`} />
    </Head>
  )
}
