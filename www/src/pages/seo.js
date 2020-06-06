import React from 'react'
import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

const Seo = () => {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  const {
    title,
    tagline,
    url
  } = siteConfig

  return (
    <Head>
      <meta charSet='utf-8' />
      <link rel='canonical' href={url} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={tagline} />
      <meta property='og:image' content={`${url}/img/social-media-card.png`} />
      <meta property='og:url' content={url} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={tagline} />
      <meta name="twitter:image" content={`${url}/img/social-media-card.png`} />
    </Head>
  )
}

export default Seo
