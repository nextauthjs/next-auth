"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("react");

var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));

var _react2 = require("@testing-library/react");

var _logger = _interopRequireDefault(require("../../lib/logger"));

var _mocks = require("./helpers/mocks");

var _ = require("..");

var _msw = require("msw");

var _jsxRuntime = require("react/jsx-runtime");

var _templateObject, _templateObject2, _templateObject3;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _window = window,
    location = _window.location;
jest.mock("../../lib/logger", function () {
  return {
    __esModule: true,
    default: {
      warn: jest.fn(),
      debug: jest.fn(),
      error: jest.fn()
    },
    proxyLogger: function proxyLogger(logger) {
      return logger;
    }
  };
});
beforeAll(function () {
  _mocks.server.listen();

  delete window.location;
  window.location = _objectSpread(_objectSpread({}, location), {}, {
    replace: jest.fn(),
    reload: jest.fn()
  });
});
beforeEach(function () {
  jest.clearAllMocks();

  _mocks.server.resetHandlers();
});
afterAll(function () {
  window.location = location;

  _mocks.server.close();
});
var callbackUrl = "https://redirects/to";
test.each(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  provider | type\n  ", "    | ", "\n  ", " | ", "\n"])), "", "no", "foo", "unknown")("if $type provider, it redirects to the default sign-in page", function () {
  var _ref2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(_ref) {
    var provider;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            provider = _ref.provider;
            (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
              providerId: provider,
              callbackUrl: callbackUrl
            }));

            _userEvent.default.click(_react2.screen.getByRole("button"));

            _context.next = 5;
            return (0, _react2.waitFor)(function () {
              expect(window.location.replace).toHaveBeenCalledTimes(1);
              expect(window.location.replace).toHaveBeenCalledWith("/api/auth/signin?callbackUrl=".concat(encodeURIComponent(callbackUrl)));
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());
test.each(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  provider | type\n  ", "    | ", "\n  ", " | ", "\n"])), "", "no", "foo", "unknown")("if $type provider supplied and no callback URL, redirects using the current location", function () {
  var _ref4 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(_ref3) {
    var provider;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            provider = _ref3.provider;
            (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
              providerId: provider
            }));

            _userEvent.default.click(_react2.screen.getByRole("button"));

            _context2.next = 5;
            return (0, _react2.waitFor)(function () {
              expect(window.location.replace).toHaveBeenCalledTimes(1);
              expect(window.location.replace).toHaveBeenCalledWith("/api/auth/signin?callbackUrl=".concat(encodeURIComponent(window.location.href)));
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}());
test.each(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  provider         | mockUrl\n  ", "       | ", "\n  ", " | ", "\n"])), "email", _mocks.mockEmailResponse.url, "credentials", _mocks.mockCredentialsResponse.url)("$provider provider redirects if `redirect` is `true`", function () {
  var _ref6 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(_ref5) {
    var provider, mockUrl;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            provider = _ref5.provider, mockUrl = _ref5.mockUrl;
            (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
              providerId: provider,
              redirect: true
            }));

            _userEvent.default.click(_react2.screen.getByRole("button"));

            _context3.next = 5;
            return (0, _react2.waitFor)(function () {
              expect(window.location.replace).toHaveBeenCalledTimes(1);
              expect(window.location.replace).toHaveBeenCalledWith(mockUrl);
            });

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3) {
    return _ref6.apply(this, arguments);
  };
}());
test("redirection can't be stopped using an oauth provider", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
  return _regenerator.default.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
            providerId: "github",
            callbackUrl: callbackUrl,
            redirect: false
          }));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context4.next = 4;
          return (0, _react2.waitFor)(function () {
            expect(window.location.replace).toHaveBeenCalledTimes(1);
            expect(window.location.replace).toHaveBeenCalledWith(_mocks.mockGithubResponse.url);
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4);
})));
test("redirection can be stopped using the 'credentials' provider", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5() {
  return _regenerator.default.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
            providerId: "credentials",
            callbackUrl: callbackUrl,
            redirect: false
          }));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context5.next = 4;
          return (0, _react2.waitFor)(function () {
            expect(window.location.replace).not.toHaveBeenCalledWith(_mocks.mockCredentialsResponse.url);
            expect(_react2.screen.getByTestId("signin-result").textContent).not.toBe("no response");
          });

        case 4:
          expect(JSON.parse(_react2.screen.getByTestId("signin-result").textContent)).toMatchInlineSnapshot("\n    Object {\n      \"error\": null,\n      \"ok\": true,\n      \"status\": 200,\n      \"url\": \"https://path/to/credentials/url\",\n    }\n  ");

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  }, _callee5);
})));
test("redirection can be stopped using the 'email' provider", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6() {
  return _regenerator.default.wrap(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
            providerId: "email",
            callbackUrl: callbackUrl,
            redirect: false
          }));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context6.next = 4;
          return (0, _react2.waitFor)(function () {
            expect(window.location.replace).not.toHaveBeenCalledWith(_mocks.mockEmailResponse.url);
            expect(_react2.screen.getByTestId("signin-result").textContent).not.toBe("no response");
          });

        case 4:
          expect(JSON.parse(_react2.screen.getByTestId("signin-result").textContent)).toMatchInlineSnapshot("\n    Object {\n      \"error\": null,\n      \"ok\": true,\n      \"status\": 200,\n      \"url\": \"https://path/to/email/url\",\n    }\n  ");

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  }, _callee6);
})));
test("if callback URL contains a hash we force a window reload when re-directing", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7() {
  var mockUrlWithHash;
  return _regenerator.default.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          mockUrlWithHash = "https://path/to/email/url#foo-bar-baz";

          _mocks.server.use(_msw.rest.post("/api/auth/signin/email", function (req, res, ctx) {
            return res(ctx.status(200), ctx.json(_objectSpread(_objectSpread({}, _mocks.mockEmailResponse), {}, {
              url: mockUrlWithHash
            })));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
            providerId: "email",
            callbackUrl: mockUrlWithHash
          }));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context7.next = 6;
          return (0, _react2.waitFor)(function () {
            expect(window.location.replace).toHaveBeenCalledTimes(1);
            expect(window.location.replace).toHaveBeenCalledWith(mockUrlWithHash);
            expect(window.location.reload).toHaveBeenCalledTimes(1);
          });

        case 6:
        case "end":
          return _context7.stop();
      }
    }
  }, _callee7);
})));
test("params are propagated to the signin URL when supplied", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee8() {
  var matchedParams, authParams;
  return _regenerator.default.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          matchedParams = "";
          authParams = "foo=bar&bar=foo";

          _mocks.server.use(_msw.rest.post("/api/auth/signin/github", function (req, res, ctx) {
            matchedParams = req.url.search;
            return res(ctx.status(200), ctx.json(_mocks.mockGithubResponse));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
            providerId: "github",
            authorizationParams: authParams
          }));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context8.next = 7;
          return (0, _react2.waitFor)(function () {
            expect(matchedParams).toEqual("?".concat(authParams));
          });

        case 7:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8);
})));
test("when it fails to fetch the providers, it redirected back to signin page", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee9() {
  var errorMsg;
  return _regenerator.default.wrap(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          errorMsg = "Error when retrieving providers";

          _mocks.server.use(_msw.rest.get("/api/auth/providers", function (req, res, ctx) {
            return res(ctx.status(500), ctx.json(errorMsg));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(SignInFlow, {
            providerId: "github"
          }));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context9.next = 6;
          return (0, _react2.waitFor)(function () {
            expect(window.location.replace).toHaveBeenCalledWith("/api/auth/error");
            expect(_logger.default.error).toHaveBeenCalledTimes(1);
            expect(_logger.default.error).toBeCalledWith("CLIENT_FETCH_ERROR", "providers", errorMsg);
          });

        case 6:
        case "end":
          return _context9.stop();
      }
    }
  }, _callee9);
})));

function SignInFlow(_ref13) {
  var providerId = _ref13.providerId,
      callbackUrl = _ref13.callbackUrl,
      _ref13$redirect = _ref13.redirect,
      redirect = _ref13$redirect === void 0 ? true : _ref13$redirect,
      _ref13$authorizationP = _ref13.authorizationParams,
      authorizationParams = _ref13$authorizationP === void 0 ? {} : _ref13$authorizationP;

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      response = _useState2[0],
      setResponse = _useState2[1];

  function handleSignIn() {
    return _handleSignIn.apply(this, arguments);
  }

  function _handleSignIn() {
    _handleSignIn = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee10() {
      var result;
      return _regenerator.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return (0, _.signIn)(providerId, {
                callbackUrl: callbackUrl,
                redirect: redirect
              }, authorizationParams);

            case 2:
              result = _context10.sent;
              setResponse(result);

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));
    return _handleSignIn.apply(this, arguments);
  }

  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsx)("p", {
      "data-testid": "signin-result",
      children: response ? JSON.stringify(response) : "no response"
    }), (0, _jsxRuntime.jsx)("button", {
      onClick: handleSignIn,
      children: "Sign in"
    })]
  });
}