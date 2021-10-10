"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = require("react");

var _msw = require("msw");

var _react2 = require("@testing-library/react");

var _mocks = require("./helpers/mocks");

var _ = require("..");

var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));

var _jsxRuntime = require("react/jsx-runtime");

beforeAll(function () {
  _mocks.server.listen();
});
afterEach(function () {
  jest.clearAllMocks();

  _mocks.server.resetHandlers();
});
afterAll(function () {
  _mocks.server.close();
});
test("fetches the session once and re-uses it for different consumers", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
  var sessionRouteCall;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          sessionRouteCall = jest.fn();

          _mocks.server.use(_msw.rest.get("/api/auth/session", function (req, res, ctx) {
            sessionRouteCall();
            res(ctx.status(200), ctx.json(_mocks.mockSession));
          }));

          (0, _react2.render)((0, _jsxRuntime.jsx)(ProviderFlow, {}));
          _context.next = 5;
          return (0, _react2.waitFor)(function () {
            expect(sessionRouteCall).toHaveBeenCalledTimes(1);

            var session1 = _react2.screen.getByTestId("session-consumer-1").textContent;

            var session2 = _react2.screen.getByTestId("session-consumer-2").textContent;

            expect(session1).toEqual(session2);
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));

function ProviderFlow(_ref2) {
  var _ref2$options = _ref2.options,
      options = _ref2$options === void 0 ? {} : _ref2$options;
  return (0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: (0, _jsxRuntime.jsxs)(_.Provider, {
      options: options,
      children: [(0, _jsxRuntime.jsx)(SessionConsumer, {}), (0, _jsxRuntime.jsx)(SessionConsumer, {
        testId: "2"
      })]
    })
  });
}

function SessionConsumer(_ref3) {
  var _ref3$testId = _ref3.testId,
      testId = _ref3$testId === void 0 ? 1 : _ref3$testId;

  var _useSession = (0, _.useSession)(),
      _useSession2 = (0, _slicedToArray2.default)(_useSession, 2),
      session = _useSession2[0],
      loading = _useSession2[1];

  if (loading) return (0, _jsxRuntime.jsx)("span", {
    children: "loading"
  });
  return (0, _jsxRuntime.jsx)("div", {
    "data-testid": "session-consumer-".concat(testId),
    children: JSON.stringify(session)
  });
}