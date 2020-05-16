import nodemailer from 'nodemailer'

export default (options) => {
  return {
    id: 'email',
    type: 'email',
    name: 'Email',
    // In this example, server can be an SMTP connection string (eg 'smtp://user:pass@smtp.example.com:25')
    // or an a configuration object - nodemailer supports both. It doesn't matter what it as far as NextAuth
    // is concerend, it's avalible in the verificationCallback() as 'provider.server'.
    server: {
      host: 'localhost',
      port: 25,
      auth: {
        user: '',
        pass: ''
      }
    },
    from: 'NextAuth <no-reply@example.com>',
    verificationCallback,
    ...options
  }
}

const verificationCallback = ({ recipient, url, token, site, provider }) => {
  return new Promise((resolve, reject) => {
    const siteName = site.replace(/^https?:\/\//, '')
    const { server, from } = provider

    nodemailer
      .createTransport(server)
      .sendMail({
        to: recipient,
        from,
        subject: `Sign in to ${siteName}`,
        text: text({ url, siteName }),
        html: html({ url, siteName })
      }, (error) => {
        if (error) {
          console.error('SEND_EMAIL_VERIFICATION_ERROR', recipient, error)
          return reject(new Error('SEND_EMAIL_VERIFICATION_ERROR', error))
        }
        return resolve()
      })
  })
}

// Email HTML body
const html = ({ url, siteName }) => {
  const buttonBackgroundColor = '#444444'
  const buttonTextColor = '#ffffff'
  return `
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center" style="padding: 8px 0; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #888888;">
       ${siteName}
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 16px 0;">
      <table border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="border-radius: 3px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 3px; padding: 12px 18px; border: 1px solid ${buttonBackgroundColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
const text = ({ url, siteName }) => `Sign in to ${siteName}\n${url}\n\n`
