"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _logger = _interopRequireDefault(require("../lib/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = options => {
  return _objectSpread({
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
    maxAge: 24 * 60 * 60,
    sendVerificationRequest
  }, options);
};

exports.default = _default;

var sendVerificationRequest = (_ref) => {
  var {
    identifier: email,
    url,
    baseUrl,
    provider
  } = _ref;
  return new Promise((resolve, reject) => {
    var {
      server,
      from
    } = provider;
    var site = baseUrl.replace(/^https?:\/\//, '');

    _nodemailer.default.createTransport(server).sendMail({
      to: email,
      from,
      subject: "Sign in to ".concat(site),
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
        _logger.default.error('SEND_VERIFICATION_EMAIL_ERROR', email, error);

        return reject(new Error('SEND_VERIFICATION_EMAIL_ERROR', error));
      }

      return resolve();
    });
  });
};

var html = (_ref2) => {
  var {
    url,
    site,
    email
  } = _ref2;
  var escapedEmail = "".concat(email.replace(/\./g, '&#8203;.'));
  var escapedSite = "".concat(site.replace(/\./g, '&#8203;.'));
  var backgroundColor = '#f9f9f9';
  var textColor = '#444444';
  var mainBackgroundColor = '#ffffff';
  var buttonBackgroundColor = '#346df1';
  var buttonBorderColor = '#346df1';
  var buttonTextColor = '#ffffff';
  return "\n<body style=\"background: ".concat(backgroundColor, ";\">\n  <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n    <tr>\n      <td align=\"center\" style=\"padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ").concat(textColor, ";\">\n        <strong>").concat(escapedSite, "</strong>\n      </td>\n    </tr>\n  </table>\n  <table width=\"100%\" border=\"0\" cellspacing=\"20\" cellpadding=\"0\" style=\"background: ").concat(mainBackgroundColor, "; max-width: 600px; margin: auto; border-radius: 10px;\">\n    <tr>\n      <td align=\"center\" style=\"padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ").concat(textColor, ";\">\n        Sign in as <strong>").concat(escapedEmail, "</strong>\n      </td>\n    </tr>\n    <tr>\n      <td align=\"center\" style=\"padding: 20px 0;\">\n        <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n          <tr>\n            <td align=\"center\" style=\"border-radius: 5px;\" bgcolor=\"").concat(buttonBackgroundColor, "\"><a href=\"").concat(url, "\" target=\"_blank\" style=\"font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ").concat(buttonTextColor, "; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ").concat(buttonBorderColor, "; display: inline-block; font-weight: bold;\">Sign in</a></td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n    <tr>\n      <td align=\"center\" style=\"padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ").concat(textColor, ";\">\n        If you did not request this email you can safely ignore it.\n      </td>\n    </tr>\n  </table>\n</body>\n");
};

var text = (_ref3) => {
  var {
    url,
    site
  } = _ref3;
  return "Sign in to ".concat(site, "\n").concat(url, "\n\n");
};