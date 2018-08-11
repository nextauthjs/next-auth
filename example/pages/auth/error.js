import React from 'react'
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
    if (this.props.action == 'signin' && this.props.type == 'oauth') {
      return(
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-4 mt-5 mb-3">Unable to sign in</h1>
            <p className="lead">An account associated with your email address already exists.</p>
            <p className="lead"><Link href="/auth"><a>Sign in with email or another service</a></Link></p>
          </div>
          <div className="row">
            <div className="col-sm-8 mr-auto ml-auto mb-5 mt-5">
              <div className="text-muted">
                <h4 className="mb-2">Why am I seeing this?</h4>
                <p className="mb-3">
                  It looks like you might have already signed up using another service to sign in. 
                </p>
                <p className="mb-3">
                  If you have previously signed up using another service you must link accounts before you
                  can use a different service to sign in.
                </p>
                <p className="mb-5">
                  This is to prevent people from signing up to another service using your email address
                  to try and access your account.
                </p>
                <h4 className="mb-2">How do I fix this?</h4>
                <p className="mb-0">
                  First sign in using your email address then link your account to the service you want
                  to use to sign in with in future. You only need to do this once.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (this.props.action == 'signin' && this.props.type == 'token-invalid') {
      return(
        <div className="container">
          <div className="text-center">
            <h1 className="display-4 mt-5 mb-2">Link not valid</h1>
            <p className="lead">This sign in link is no longer valid.</p>
            <p className="lead"><Link href="/auth"><a>Get a new sign in link</a></Link></p>
          </div>
        </div>
      )
    } else {
      return(
        <div className="container">
          <div className="text-center">
            <h1 className="display-4 mt-5">Error signing in</h1>
            <p className="lead">An error occured while trying to sign in.</p>
            <p className="lead"><Link href="/auth"><a>Sign in with email or another service</a></Link></p>
          </div>
        </div>
      )
    }
  }
}