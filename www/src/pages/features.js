import React from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Seo from './seo'


function Home () {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout description={siteConfig.tagline}>
      <Seo />
      <main>
        <div className='container'>
          <header style={{marginTop: '2rem'}}>
            <div className='row'>
              <div className='col'>
                <h1 className='text--center'>Features</h1>


              </div>
            </div>
          </header>
          <section>
            <div className='row'>
              <div className='col'>
                <h2 className='text--center'>Authentication</h2>


              </div>
            </div>
          </section>
          <section>
            <div className='row'>
              <div className='col'>
                <h2 className='text--center'>Databases</h2>

                  <p>NextAuth.js supports a wide range of databases, including</p>
              </div>
            </div>
          </section>
          <section>
            <div className='row'>
              <div className='col'>
                <h2 className='text--center'>Providers</h2>


              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  )
}

export default Home
