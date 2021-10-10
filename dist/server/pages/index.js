"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderPage;

var _preactRenderToString = _interopRequireDefault(require("preact-render-to-string"));

var _signin = _interopRequireDefault(require("./signin"));

var _signout = _interopRequireDefault(require("./signout"));

var _verifyRequest = _interopRequireDefault(require("./verify-request"));

var _error = _interopRequireDefault(require("./error"));

var _css = _interopRequireDefault(require("../../css"));

function renderPage(req, res) {
  const {
    baseUrl,
    basePath,
    callbackUrl,
    csrfToken,
    providers,
    theme
  } = req.options;
  res.setHeader('Content-Type', 'text/html');

  function send({
    html,
    title
  }) {
    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${(0, _css.default)()}</style><title>${title}</title></head><body class="__next-auth-theme-${theme}"><div class="page">${(0, _preactRenderToString.default)(html)}</div></body></html>`);
  }

  return {
    signin(props) {
      send({
        html: (0, _signin.default)({
          csrfToken,
          providers,
          callbackUrl,
          ...req.query,
          ...props
        }),
        title: 'Sign In'
      });
    },

    signout(props) {
      send({
        html: (0, _signout.default)({
          csrfToken,
          baseUrl,
          basePath,
          ...props
        }),
        title: 'Sign Out'
      });
    },

    verifyRequest(props) {
      send({
        html: (0, _verifyRequest.default)({
          baseUrl,
          ...props
        }),
        title: 'Verify Request'
      });
    },

    error(props) {
      send({
        html: (0, _error.default)({
          basePath,
          baseUrl,
          res,
          ...props
        }),
        title: 'Error'
      });
    }

  };
}