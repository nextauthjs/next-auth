"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = error;

var _preact = require("preact");

function error({
  baseUrl,
  basePath,
  error = 'default',
  res
}) {
  var _errors$error$toLower;

  const signinPageUrl = `${baseUrl}${basePath}/signin`;
  const errors = {
    default: {
      statusCode: 200,
      heading: 'Error',
      message: (0, _preact.h)("p", null, (0, _preact.h)("a", {
        className: "site",
        href: baseUrl
      }, baseUrl.replace(/^https?:\/\//, '')))
    },
    configuration: {
      statusCode: 500,
      heading: 'Server error',
      message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "There is a problem with the server configuration."), (0, _preact.h)("p", null, "Check the server logs for more information."))
    },
    accessdenied: {
      statusCode: 403,
      heading: 'Access Denied',
      message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "You do not have permission to sign in."), (0, _preact.h)("p", null, (0, _preact.h)("a", {
        className: "button",
        href: signinPageUrl
      }, "Sign in")))
    },
    verification: {
      statusCode: 403,
      heading: 'Unable to sign in',
      message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "The sign in link is no longer valid."), (0, _preact.h)("p", null, "It may have been used already or it may have expired.")),
      signin: (0, _preact.h)("p", null, (0, _preact.h)("a", {
        className: "button",
        href: signinPageUrl
      }, "Sign in"))
    }
  };
  const {
    statusCode,
    heading,
    message,
    signin
  } = (_errors$error$toLower = errors[error.toLowerCase()]) !== null && _errors$error$toLower !== void 0 ? _errors$error$toLower : errors.default;
  res.status(statusCode);
  return (0, _preact.h)("div", {
    className: "error"
  }, (0, _preact.h)("h1", null, heading), (0, _preact.h)("div", {
    className: "message"
  }, message), signin);
}