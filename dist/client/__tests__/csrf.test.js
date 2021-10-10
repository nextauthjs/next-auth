"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = require("react");

var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));

var _react2 = require("@testing-library/react");

var _mocks = require("./helpers/mocks");

var _logger = _interopRequireDefault(require("../../lib/logger"));

var _ = require("..");

var _msw = require("msw");

var _jsxRuntime = require("react/jsx-runtime");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
});
afterEach(function () {
  _mocks.server.resetHandlers();

  jest.clearAllMocks();
});
afterAll(function () {
  _mocks.server.close();
});
test("returns the Cross Site Request Forgery Token (CSRF Token) required to make POST requests", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          (0, _react2.render)((0, _jsxRuntime.jsx)(CSRFFlow, {}));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context.next = 4;
          return (0, _react2.waitFor)(function () {
            expect(_react2.screen.getByTestId("csrf-result").textContent).toEqual(_mocks.mockCSRFToken.csrfToken);
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
test("when there's no CSRF token returned, it'll reflect that", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
  return _regenerator.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _mocks.server.use(_msw.rest.get("/api/auth/csrf", function (req, res, ctx) {
            return res(ctx.status(200), ctx.json(_objectSpread(_objectSpread({}, _mocks.mockCSRFToken), {}, {
              csrfToken: null
            })));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(CSRFFlow, {}));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context2.next = 5;
          return (0, _react2.waitFor)(function () {
            expect(_react2.screen.getByTestId("csrf-result").textContent).toBe("null-response");
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));
test("when the fetch fails it'll throw a client fetch error", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3() {
  return _regenerator.default.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _mocks.server.use(_msw.rest.get("/api/auth/csrf", function (req, res, ctx) {
            return res(ctx.status(500), ctx.text("some error happened"));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(CSRFFlow, {}));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context3.next = 5;
          return (0, _react2.waitFor)(function () {
            expect(_logger.default.error).toHaveBeenCalledTimes(1);
            expect(_logger.default.error).toBeCalledWith("CLIENT_FETCH_ERROR", "csrf", new SyntaxError("Unexpected token s in JSON at position 0"));
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
})));

function CSRFFlow() {
  var _useState = (0, _react.useState)(),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      response = _useState2[0],
      setResponse = _useState2[1];

  function handleCSRF() {
    return _handleCSRF.apply(this, arguments);
  }

  function _handleCSRF() {
    _handleCSRF = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
      var result;
      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _.getCsrfToken)();

            case 2:
              result = _context4.sent;
              setResponse(result);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _handleCSRF.apply(this, arguments);
  }

  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsx)("p", {
      "data-testid": "csrf-result",
      children: response === null ? "null-response" : response || "no response"
    }), (0, _jsxRuntime.jsx)("button", {
      onClick: handleCSRF,
      children: "Get CSRF"
    })]
  });
}