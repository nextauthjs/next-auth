import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { NextAuth } from 'next-auth/client'

export default class extends React.Component {

  static async getInitialProps({req}) {
    return {
      session: await NextAuth.init({force: true, req: req})
    }
  }

  async componentDidMount() {
    // Get latest session data after rendering on client then redirect.
    // The ensures client state is always updated after signing in or out.
    const session = await NextAuth.init({force: true})
    Router.push('/')
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
        <a href="/" className="circle-loader">
          <svg className="circle" width="60" height="60" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="15"/>
          </svg>
        </a>
      </React.Fragment>
    )
  }
}