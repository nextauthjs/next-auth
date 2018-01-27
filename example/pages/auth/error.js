import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default class extends React.Component {

  static async getInitialProps({query}) {
    return {
      action: query.action || null,
      type: query.type || null,
      service: query.service || null
    }
  }

  render() {
    if (this.props.action == 'signin' && this.props.type == 'oauth' && this.props.service) {
      return(
        <div className="container">
          <Head>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/>
          </Head>
          <div className="text-center">
            <h1 className="display-4 mt-5 mb-3">Unable to sign in with {this.props.service}</h1>
            <p className="lead">An account associated with your email address already exists.</p>
            <p className="lead"><Link href="/auth"><a>Sign in with email or another service.</a></Link></p>
          </div>
          <div className="row">
            <div className="col-sm-8 mr-auto ml-auto">
              <div className="card m-3 text-muted">
                <div className="card-body">
                  <h4>Why am I seeing this?</h4>
                  <p className="mb-1">
                    It looks like you might have already signed up using another service. 
                  </p>
                  <p className="mb-0">
                    To sign in with {this.props.service}, first sign in using your email address then link accounts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (this.props.action == 'signin' && this.props.type == 'token-invalid') {
      return(
        <div className="container">
          <Head>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/>
          </Head>
          <div className="text-center">
            <h1 className="display-4 mt-5 mb-2">Sign in link not valid</h1>
            <p className="lead">The sign in link you used is no longer valid.</p>
            <p className="lead"><Link href="/auth"><a>Get a new sign in link.</a></Link></p>
          </div>
        </div>
      )
    } else {
      return(
        <div className="container">
          <Head>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/>
          </Head>
          <div className="text-center">
            <h1 className="display-4 mt-5">Error signing in</h1>
            <p className="lead">An error occured while trying to sign in.</p>
            <p>
              <Link href="/"><a>Home</a></Link>
            </p>
          </div>
        </div>
      )
    }
  }
}