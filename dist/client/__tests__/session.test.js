"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = require("@testing-library/react");

var _msw = require("msw");

var _mocks = require("./helpers/mocks");

var _logger = _interopRequireDefault(require("../../lib/logger"));

var _react2 = require("react");

var _ = require("..");

var _utils = require("./helpers/utils");

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
  return _mocks.server.listen();
});
beforeEach(function () {
  jest.spyOn(window.localStorage.__proto__, "setItem");
});
afterEach(function () {
  _mocks.server.resetHandlers();

  jest.clearAllMocks();
});
afterAll(function () {
  _mocks.server.close();
});
test("if it can fetch the session, it should store it in `localStorage`", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
  var noSession, session, broadcastCalls, _broadcastCalls, broadcastedEvent;

  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          (0, _react.render)((0, _jsxRuntime.jsx)(SessionFlow, {}));
          _context.next = 3;
          return _react.screen.findByText("No session");

        case 3:
          noSession = _context.sent;
          expect(noSession).toBeInTheDocument();
          _context.next = 7;
          return _react.screen.findByText(new RegExp(_mocks.mockSession.user.name));

        case 7:
          session = _context.sent;
          expect(session).toBeInTheDocument();
          broadcastCalls = (0, _utils.getBroadcastEvents)();
          _broadcastCalls = (0, _slicedToArray2.default)(broadcastCalls, 1), broadcastedEvent = _broadcastCalls[0];
          expect(broadcastCalls).toHaveLength(1);
          expect(broadcastCalls).toHaveLength(1);
          expect(broadcastedEvent.eventName).toBe("nextauth.message");
          expect(broadcastedEvent.value).toStrictEqual({
            data: {
              trigger: "getSession"
            },
            event: "session"
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
test("if there's an error fetching the session, it should log it", (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
  return _regenerator.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _mocks.server.use(_msw.rest.get("/api/auth/session", function (req, res, ctx) {
            return res(ctx.status(500), ctx.body("Server error"));
          }));

          (0, _react.render)((0, _jsxRuntime.jsx)(SessionFlow, {}));
          _context2.next = 4;
          return (0, _react.waitFor)(function () {
            expect(_logger.default.error).toHaveBeenCalledTimes(1);
            expect(_logger.default.error).toBeCalledWith("CLIENT_FETCH_ERROR", "session", new SyntaxError("Unexpected token S in JSON at position 0"));
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));

function SessionFlow() {
  var _useState = (0, _react2.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      session = _useState2[0],
      setSession = _useState2[1];

  (0, _react2.useEffect)(function () {
    function fetchUserSession() {
      return _fetchUserSession.apply(this, arguments);
    }

    function _fetchUserSession() {
      _fetchUserSession = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3() {
        var result;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return (0, _.getSession)();

              case 3:
                result = _context3.sent;
                setSession(result);
                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);
                console.error(_context3.t0);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 7]]);
      }));
      return _fetchUserSession.apply(this, arguments);
    }

    fetchUserSession();
  }, []);
  if (session) return (0, _jsxRuntime.jsx)("pre", {
    children: JSON.stringify(session, null, 2)
  });
  return (0, _jsxRuntime.jsx)("p", {
    children: "No session"
  });
}