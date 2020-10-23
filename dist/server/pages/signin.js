"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _preactRenderToString = _interopRequireDefault(require("preact-render-to-string"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (_ref) => {
  var {
    req,
    csrfToken,
    providers,
    callbackUrl
  } = _ref;
  var {
    email,
    error
  } = req.query;
  var providersToRender = providers.filter(provider => {
    if (provider.type === 'oauth' || provider.type === 'email') {
      return true;
    } else if (provider.type === 'credentials' && provider.credentials) {
      return true;
    } else {
      return false;
    }
  });
  var errorMessage;

  if (error) {
    switch (error) {
      case 'Signin':
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
        errorMessage = (0, _preact.h)("p", null, "Try signing with a different account.");
        break;

      case 'OAuthAccountNotLinked':
        errorMessage = (0, _preact.h)("p", null, "To confirm your identity, sign in with the same account you used originally.");
        break;

      case 'EmailSignin':
        errorMessage = (0, _preact.h)("p", null, "Check your email address.");
        break;

      case 'CredentialsSignin':
        errorMessage = (0, _preact.h)("p", null, "Sign in failed. Check the details you provided are correct.");
        break;

      default:
        errorMessage = (0, _preact.h)("p", null, "Unable to sign in.");
        break;
    }
  }

  return (0, _preactRenderToString.default)((0, _preact.h)("div", {
    className: "signin"
  }, errorMessage && (0, _preact.h)("div", {
    className: "error"
  }, errorMessage), providersToRender.map((provider, i) => (0, _preact.h)("div", {
    key: provider.id,
    className: "provider"
  }, provider.type === 'oauth' && (0, _preact.h)("form", {
    action: provider.signinUrl,
    method: "POST"
  }, (0, _preact.h)("input", {
    type: "hidden",
    name: "csrfToken",
    value: csrfToken
  }), callbackUrl && (0, _preact.h)("input", {
    type: "hidden",
    name: "callbackUrl",
    value: callbackUrl
  }), (0, _preact.h)("button", {
    type: "submit",
    className: "button"
  }, "Sign in with ", provider.name)), (provider.type === 'email' || provider.type === 'credentials') && i > 0 && providersToRender[i - 1].type !== 'email' && providersToRender[i - 1].type !== 'credentials' && (0, _preact.h)("hr", null), provider.type === 'email' && (0, _preact.h)("form", {
    action: provider.signinUrl,
    method: "POST"
  }, (0, _preact.h)("input", {
    type: "hidden",
    name: "csrfToken",
    value: csrfToken
  }), (0, _preact.h)("label", {
    for: "input-email-for-".concat(provider.id, "-provider")
  }, "Email"), (0, _preact.h)("input", {
    id: "input-email-for-".concat(provider.id, "-provider"),
    autoFocus: true,
    type: "text",
    name: "email",
    value: email,
    placeholder: "email@example.com"
  }), (0, _preact.h)("button", {
    type: "submit"
  }, "Sign in with ", provider.name)), provider.type === 'credentials' && (0, _preact.h)("form", {
    action: provider.callbackUrl,
    method: "POST"
  }, (0, _preact.h)("input", {
    type: "hidden",
    name: "csrfToken",
    value: csrfToken
  }), Object.keys(provider.credentials).map(credential => {
    return (0, _preact.h)("div", {
      key: "input-group-".concat(provider.id)
    }, (0, _preact.h)("label", {
      for: "input-".concat(credential, "-for-").concat(provider.id, "-provider")
    }, provider.credentials[credential].label || credential), (0, _preact.h)("input", {
      name: credential,
      id: "input-".concat(credential, "-for-").concat(provider.id, "-provider"),
      type: provider.credentials[credential].type || 'text',
      value: provider.credentials[credential].value || '',
      placeholder: provider.credentials[credential].placeholder || ''
    }));
  }), (0, _preact.h)("button", {
    type: "submit"
  }, "Sign in with ", provider.name)), (provider.type === 'email' || provider.type === 'credentials') && i + 1 < providersToRender.length && (0, _preact.h)("hr", null)))));
};

exports.default = _default;