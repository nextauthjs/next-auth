import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Link from 'next/link'
import Cookies from 'universal-cookie'
import { NextAuth } from 'next-auth-client'

export default class extends React.Component {
  static async getInitialProps({req}) {
    return {
      session: await NextAuth.init({req})
    }
  }

  constructor(props) {
    super(props)
    this.handleSignOutSubmit = this.handleSignOutSubmit.bind(this)
  }

  handleSignOutSubmit(event) {
    event.preventDefault()
    
    // Save current URL so user is redirected back here after signing out
    const cookies = new Cookies()
    cookies.set('redirect_url', window.location.pathname)
    
    NextAuth.signout()
    .then(() => {
      Router.push('/auth/callback')
    })
    .catch(err => {
      Router.push('/auth/error?action=signout')
    })
  }
  
  render() {
    return (
      <div className="container">
        <Head>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/>
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js"/>
        </Head>
        <div className="text-center">
          <h1 className="display-4 mt-3 mb-3">NextAuth Example</h1>
          <p className="lead mt-3 mb-3">An example of how to use the <a href="https://www.npmjs.com/package/next-auth">NextAuth</a> module.</p>
          <SignInMessage {...this.props}/>
        </div>
      </div>
    )
  }
}

export class SignInMessage extends React.Component {
  render() {
    if (this.props.session.user) {
      return (
        <React.Fragment>
          <p><Link href="/auth"><a className="btn btn-secondary">Manage Account</a></Link></p>
          <form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSignOutSubmit}>
            <input name="_csrf" type="hidden" value={this.props.session.csrfToken}/>
            <button type="submit" className="btn btn-outline-secondary">Sign out</button>
          </form>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <p><Link href="/auth"><a className="btn btn-primary">Sign in</a></Link></p>
        </React.Fragment>
      )
    }
  }
}