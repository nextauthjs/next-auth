"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("react");

var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));

var _react2 = require("@testing-library/react");

var _mocks = require("./helpers/mocks");

var _ = require("..");

var _msw = require("msw");

var _utils = require("./helpers/utils");

var _jsxRuntime = require("react/jsx-runtime");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _window = window,
    location = _window.location;
beforeAll(function () {
  _mocks.server.listen();

  delete window.location;
  window.location = _objectSpread(_objectSpread({}, location), {}, {
    replace: jest.fn(),
    reload: jest.fn()
  });
});
beforeEach(function () {
  jest.spyOn(window.localStorage.__proto__, "setItem");
});
afterEach(function () {
  jest.clearAllMocks();

  _mocks.server.resetHandlers();
});
afterAll(function () {
  window.location = location;

  _mocks.server.close();
});
var callbackUrl = "https://redirects/to";
test("by default it redirects to the current URL if the server did not provide one", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _mocks.server.use(_msw.rest.post("/api/auth/signout", function (req, res, ctx) {
            return res(ctx.status(200), ctx.json(_objectSpread(_objectSpread({}, _mocks.mockSignOutResponse), {}, {
              url: undefined
            })));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(SignOutFlow, {}));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context.next = 5;
          return (0, _react2.waitFor)(function () {
            expect(window.location.replace).toHaveBeenCalledTimes(1);
            expect(window.location.replace).toHaveBeenCalledWith(window.location.href);
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
test("it redirects to the URL allowed by the server", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
  return _regenerator.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          (0, _react2.render)((0, _jsxRuntime.jsx)(SignOutFlow, {
            callbackUrl: callbackUrl
          }));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context2.next = 4;
          return (0, _react2.waitFor)(function () {
            expect(window.location.replace).toHaveBeenCalledTimes(1);
            expect(window.location.replace).toHaveBeenCalledWith(_mocks.mockSignOutResponse.url);
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));
test("if url contains a hash during redirection a page reload happens", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3() {
  var mockUrlWithHash;
  return _regenerator.default.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          mockUrlWithHash = "https://path/to/email/url#foo-bar-baz";

          _mocks.server.use(_msw.rest.post("/api/auth/signout", function (req, res, ctx) {
            return res(ctx.status(200), ctx.json(_objectSpread(_objectSpread({}, _mocks.mockSignOutResponse), {}, {
              url: mockUrlWithHash
            })));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(SignOutFlow, {}));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context3.next = 6;
          return (0, _react2.waitFor)(function () {
            expect(window.location.reload).toHaveBeenCalledTimes(1);
            expect(window.location.replace).toHaveBeenCalledWith(mockUrlWithHash);
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
})));
test("will broadcast the signout event to other tabs", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
  return _regenerator.default.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          (0, _react2.render)((0, _jsxRuntime.jsx)(SignOutFlow, {}));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context4.next = 4;
          return (0, _react2.waitFor)(function () {
            var broadcastCalls = (0, _utils.getBroadcastEvents)();

            var _broadcastCalls = (0, _slicedToArray2.default)(broadcastCalls, 1),
                broadcastedEvent = _broadcastCalls[0];

            expect(broadcastCalls).toHaveLength(1);
            expect(broadcastedEvent.eventName).toBe("nextauth.message");
            expect(broadcastedEvent.value).toStrictEqual({
              data: {
                trigger: "signout"
              },
              event: "session"
            });
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4);
})));

function SignOutFlow(_ref5) {
  var callbackUrl = _ref5.callbackUrl,
      _ref5$redirect = _ref5.redirect,
      redirect = _ref5$redirect === void 0 ? true : _ref5$redirect;

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      response = _useState2[0],
      setResponse = _useState2[1];

  function handleSignOut() {
    return _handleSignOut.apply(this, arguments);
  }

  function _handleSignOut() {
    _handleSignOut = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5() {
      var result;
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _.signOut)({
                callbackUrl: callbackUrl,
                redirect: redirect
              });

            case 2:
              result = _context5.sent;
              setResponse(result);

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _handleSignOut.apply(this, arguments);
  }

  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsx)("p", {
      "data-testid": "signout-result",
      children: response ? JSON.stringify(response) : "no response"
    }), (0, _jsxRuntime.jsx)("button", {
      onClick: handleSignOut,
      children: "Sign out"
    })]
  });
}