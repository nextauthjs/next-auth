import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default class extends React.Component {

  static async getInitialProps({query}) {
    return {
      email: query.email
    }
  }

  render() {
    return(
      <div className="container">
        <Head>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/>
        </Head>
        <div className="text-center">
          <h1 className="display-4 mt-5 mb-3">Check your email</h1>
          <p className="lead">
            A sign in link has been sent to <span className="font-weight-bold">{this.props.email}</span>
          </p>
          <p>
            <Link href="/"><a>Home</a></Link>
          </p>
        </div>
      </div>
    )
  }
}