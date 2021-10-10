"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Email;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _logger = _interopRequireDefault(require("../lib/logger"));

function Email(options) {
  return {
    id: "email",
    type: "email",
    name: "Email",
    server: {
      host: "localhost",
      port: 25,
      auth: {
        user: "",
        pass: ""
      }
    },
    from: "NextAuth <no-reply@example.com>",
    maxAge: 24 * 60 * 60,
    sendVerificationRequest,
    ...options
  };
}

const sendVerificationRequest = ({
  identifier: email,
  url,
  baseUrl,
  provider
}) => {
  return new Promise((resolve, reject) => {
    const {
      server,
      from
    } = provider;
    const site = baseUrl.replace(/^https?:\/\//, "");

    _nodemailer.default.createTransport(server).sendMail({
      to: email,
      from,
      subject: `Sign in to ${site}`,
      text: text({
        url,
        site,
        email
      }),
      html: html({
        url,
        site,
        email
      })
    }, error => {
      if (error) {
        _logger.default.error("SEND_VERIFICATION_EMAIL_ERROR", email, error);

        return reject(new Error("SEND_VERIFICATION_EMAIL_ERROR", error));
      }

      return resolve();
    });
  });
};

const html = ({
  url,
  site,
  email
}) => {
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  const escapedSite = `${site.replace(/\./g, "&#8203;.")}`;
  const backgroundColor = "#f9f9f9";
  const textColor = "#444444";
  const mainBackgroundColor = "#ffffff";
  const buttonBackgroundColor = "#346df1";
  const buttonBorderColor = "#346df1";
  const buttonTextColor = "#ffffff";
  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedSite}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
};

const text = ({
  url,
  site
}) => `Sign in to ${site}\n${url}\n\n`;