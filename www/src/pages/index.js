import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Easy to Use</>,
    imageUrl: 'img/undraw_authentication.svg',
    description: (
      <>
        Serverless authentication library built primarily for Next.js, but will
        work in any environment. Simple to setup and does not require Express or PassportJS.
      </>
    ),
  },
  {
    title: <>Many Login Providers</>,
    imageUrl: 'img/undraw_social.svg',
    description: (
      <>
        Built-in support for many OAuth providers. If you can't find yours, we make it
        easy to add others as well. We also support an Email / Password based signup and
        login method.
      </>
    ),
  },
  {
    title: <>Secure</>,
    imageUrl: 'img/undraw_secure.svg',
    description: (
      <>
        OAuth, CSRF Protection, and secure host only and http only signed cookies out
        of the box! Session IDs are never exposed to client-side javascript so your
        users sessions cant get hijacked.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('/getting-started')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
              <div className="row home-subtitle">
                We are not affiliated with Now / Vercel / Next.js in any way!
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
