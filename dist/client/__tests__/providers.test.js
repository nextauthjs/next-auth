"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = require("react");

var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));

var _react2 = require("@testing-library/react");

var _mocks = require("./helpers/mocks");

var _ = require("..");

var _logger = _interopRequireDefault(require("../../lib/logger"));

var _msw = require("msw");

var _jsxRuntime = require("react/jsx-runtime");

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
test("when called it'll return the currently configured providers for sign in", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          (0, _react2.render)((0, _jsxRuntime.jsx)(ProvidersFlow, {}));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context.next = 4;
          return (0, _react2.waitFor)(function () {
            expect(_react2.screen.getByTestId("providers-result").textContent).toEqual(JSON.stringify(_mocks.mockProviders));
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
test("when failing to fetch the providers, it'll log the error", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
  return _regenerator.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _mocks.server.use(_msw.rest.get("/api/auth/providers", function (req, res, ctx) {
            return res(ctx.status(500), ctx.text("some error happened"));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(ProvidersFlow, {}));

          _userEvent.default.click(_react2.screen.getByRole("button"));

          _context2.next = 5;
          return (0, _react2.waitFor)(function () {
            expect(_logger.default.error).toHaveBeenCalledTimes(1);
            expect(_logger.default.error).toBeCalledWith("CLIENT_FETCH_ERROR", "providers", new SyntaxError("Unexpected token s in JSON at position 0"));
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));

function ProvidersFlow() {
  var _useState = (0, _react.useState)(),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      response = _useState2[0],
      setResponse = _useState2[1];

  function handleGerProviders() {
    return _handleGerProviders.apply(this, arguments);
  }

  function _handleGerProviders() {
    _handleGerProviders = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3() {
      var result;
      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _.getProviders)();

            case 2:
              result = _context3.sent;
              setResponse(result);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _handleGerProviders.apply(this, arguments);
  }

  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsx)("p", {
      "data-testid": "providers-result",
      children: response === null ? "null-response" : JSON.stringify(response) || "no response"
    }), (0, _jsxRuntime.jsx)("button", {
      onClick: handleGerProviders,
      children: "Get Providers"
    })]
  });
}