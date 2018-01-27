import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Cookies from 'universal-cookie'
import { NextAuth } from 'next-auth-client'

export default class extends React.Component {

  static async getInitialProps({req}) {
    const session = await NextAuth.init({force: true, req: req})

    const cookies = new Cookies((req && req.headers && req.headers.cookie) ? req.headers.cookie : null)
    
    // If the user is signed in, we look for a redirect URL cookie and send 
    // them to that page, so that people signing in end up back on the page they
    // were on before signing in. Defaults to '/'.
    let redirectTo = '/'
    if (session.user) {
      // Read redirect URL to redirect to from cookies
      redirectTo = cookies.get('redirect_url') || redirectTo
      
      // Allow relative paths only - strip protocol/host/port if they exist.
      redirectTo = redirectTo.replace( /^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '')
    }
    
    return {
      session: session,
      redirectTo: redirectTo
    }
  }

  async componentDidMount() {
    // Get latest session data after rendering on client then redirect.
    // The ensures client state is always updated after signing in or out.
    const session = await NextAuth.init({force: true})
        
    Router.push(this.props.redirectTo)
  }

  render() {
    // Provide a link for clients without JavaScript as a fallback.
    return (
      <React.Fragment>
        <style jsx global>{`
          body{ 
            background-color: #fff;
          }
          .circle-loader {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50%;
            z-index: 100;
            text-align: center;
            transform: translate(-50%, -50%);
          }

          .circle-loader .circle {
            fill: transparent;
            stroke: rgba(0,0,0,0.2);
            stroke-width: 4px;
            animation: dash 2s ease infinite, rotate 2s linear infinite;
          }

          @keyframes dash {
            0% {
              stroke-dasharray: 1,95;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 85,95;
              stroke-dashoffset: -25;
            }
            100% {
              stroke-dasharray: 85,95;
              stroke-dashoffset: -93;
            }
          }

          @keyframes rotate {
            0% {transform: rotate(0deg); }
            100% {transform: rotate(360deg); }
          }
        `}</style>
        <a href={this.props.redirectTo} className="circle-loader">
          <svg className="circle" width="60" height="60" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="15"/>
          </svg>
        </a>
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"/>
      </React.Fragment>
    )
  }
}