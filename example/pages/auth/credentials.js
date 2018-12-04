import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { NextAuth } from 'next-auth/client'

export default class extends React.Component {
  
  static async getInitialProps({req}) {
    return {
      session: await NextAuth.init({req}),
      linkedAccounts: await NextAuth.linked({req}),
      providers: await NextAuth.providers({req})
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      session: this.props.session
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSignInSubmit = this.handleSignInSubmit.bind(this)
  }

  async componentDidMount() {
    if (this.props.session.user) {
      Router.push(`/auth/`)
    }
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }
  
  handleSignInSubmit(event) {
    event.preventDefault()

    // An object passed NextAuth.signin will be passed to your signin() function
    NextAuth.signin({
      email: this.state.email,
      password: this.state.password
    })
    .then(authenticated => {
      Router.push(`/auth/callback`)
    })
    .catch(() => {
      alert("Authentication failed.")
    })
  }
  
  render() {
    if (this.props.session.user) {
      return null
    } else {
      return (
        <div className="container">
          <div className="text-center">
            <h1 className="display-5 mt-4 mb-2">NextAuth - Custom Sign In</h1>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-10 col-lg-8 col-xl-7 mr-auto ml-auto">
              <p className="mt-3 mb-4 text-center">
                If you want to support password based sign in, two factor authentication 
                or another sign in method, define a signin() function
                in <strong>next-auth.functions.js</strong>.
              </p>
              <div className="card mt-3 mb-3">
                <h4 className="card-header">Sign In</h4>
                <div className="card-body pb-0">
                  <form id="signin" method="post" action="/auth/signin" onSubmit={this.handleSignInSubmit}>
                    <input name="_csrf" type="hidden" value={this.state.session.csrfToken}/>
                    <p>
                      <label htmlFor="email">Email address</label><br/>
                      <input name="email" type="text" placeholder="j.smith@example.com" id="email" className="form-control" value={this.state.email} onChange={this.handleEmailChange}/>
                    </p>
                    <p>
                      <label htmlFor="password">Password</label><br/>
                      <input name="password" type="password" placeholder="" id="password" className="form-control" value={this.state.password} onChange={this.handlePasswordChange}/>
                    </p>
                    <p className="text-right">
                      <button id="submitButton" type="submit" className="btn btn-outline-primary">Sign in</button>
                    </p>
                  </form>
                </div>
              </div>
              <p className="text-italic text-muted text-center small">
                For this to work, you will need enable the signin() function in <strong>next-auth.functions.js</strong>
              </p>
            </div>
          </div>
          <p className="text-center">
            <Link href="/auth"><a>Back</a></Link>
          </p>
        </div>
      )
    }
  }
}