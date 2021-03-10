import renderToString from 'preact-render-to-string'
import signin from './signin'
import signout from './signout'
import verifyRequest from './verify-request'
import error from './error'
import css from '../../css'
const merge = require('lodash.merge')

export const defaultTranslations = {
  signIn: {
    title: 'Sign In',
    submit: 'Sign in with %s',
    email: 'Email',
    dividerText: 'or',
    errors: {
      Signin: 'Try signing with a different account.',
      OAuthSignin: 'Try signing with a different account.',
      OAuthCallback: 'Try signing with a different account.',
      OAuthCreateAccount: 'Try signing with a different account.',
      EmailCreateAccount: 'Try signing with a different account.',
      Callback: 'Try signing with a different account.',
      OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
      EmailSignin: 'Check your email address.',
      CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
      default: 'Unable to sign in.'
    }
  },
  signOut: {
    title: 'Sign Out',
    heading: 'Are you sure you want to sign out?',
    submit: 'Sign out'
  },
  verifyRequest: {
    title: 'Verify Request',
    heading: 'Check your email',
    message: 'A sign in link has been sent to your email address.'
  },
  error: {
    title: 'Error',
    signIn: 'Sign in',
    default: {
      heading: 'Error'
    },
    configuration: {
      heading: 'Server error',
      message: 'There is a problem with the server configuration.',
      serverLogHint: 'Check the server logs for more information.'
    },
    accessdenied: {
      heading: 'Access Denied',
      message: 'You do not have permission to sign in.'
    },
    verification: {
      heading: 'Unable to sign in',
      message: 'The sign in link is no longer valid.',
      expirationHint: 'It may have been used already or it may have expired.'
    }
  }
}

/** Takes a request and response, and gives renderable pages */
export default function renderPage (req, res) {
  const { baseUrl, basePath, callbackUrl, csrfToken, providers, theme, locale, translations } = req.options

  res.setHeader('Content-Type', 'text/html')
  function send ({ html, title }) {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css()}</style><title>${title}</title></head><body class="__next-auth-theme-${theme}"><div class="page">${renderToString(html)}</div></body></html>`)
  }

  // merge default and client provided translations
  const texts = merge({}, defaultTranslations, translations?.[locale])

  return {
    signin (props) {
      send({
        html: signin({ csrfToken, providers, callbackUrl, locale, texts: texts.signIn, ...req.query, ...props }),
        title: texts.signIn.title
      })
    },
    signout (props) {
      send({
        html: signout({ csrfToken, baseUrl, basePath, locale, texts: texts.signOut, ...props }),
        title: texts.signOut.title
      })
    },
    verifyRequest (props) {
      send({
        html: verifyRequest({ baseUrl, locale, texts: texts.verifyRequest, ...props }),
        title: texts.verifyRequest.title
      })
    },
    error (props) {
      send({
        html: error({ basePath, baseUrl, locale, texts: texts.error, res, ...props }),
        title: texts.error.title
      })
    }
  }
}
