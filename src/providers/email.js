export default (options) => {
  return {
    id: 'email',
    type: 'email',
    name: 'Email',
    server: {
      host: 'localhost',
      port: 25,
      auth: {
        user: '',
        pass: ''
      }
    },
    from: 'NextAuth <no-reply@example.com>',
    subject,
    html,
    text,
    // unsubscribe: ({ email }) => 'http://example.com/unsubscribe',
    async: false,
    ...options
  }
}

// Email Subject line
const subject = ({ site }) => `Sign in to ${site.replace(/^https?:\/\//, '')}`

// Email HTML body
const html = ({ email, url, token, site, unsubscribe, callbackUrl }) => {
  const buttonBackgroundColor = '#444444'
  const buttonTextColor = '#ffffff'
  return `
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center" style="padding: 8px 0; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #888888;">
       ${site.replace(/^https?:\/\//, '')}
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
  <tr>
    <td align="center" style="padding: 8px 0; font-size: 12px; font-family: Helvetica, Arial, sans-serif; color: #888888 !important;">
      ${unsubscribe ? `<a href="${unsubscribe(email)}">Unsubscribe</a>` : ''}
    </td>
  </tr>
</table>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
const text = ({ email, url, token, site, callbackUrl, unsubscribe }) => `
Sign in:\n
${url}
\n\n
${unsubscribe ? `Unsubscribe:\n${unsubscribe({ email })}\n\n` : ''}
`
