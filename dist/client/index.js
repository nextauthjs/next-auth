"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSession = useSession;
exports.session = exports.getSession = getSession;
exports.csrfToken = exports.getCsrfToken = getCsrfToken;
exports.providers = exports.getProviders = getProviders;
exports.signin = exports.signIn = signIn;
exports.signout = exports.signOut = signOut;
exports.options = exports.setOptions = setOptions;
exports.Provider = Provider;
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _logger2 = _interopRequireWildcard(require("../lib/logger"));

var _parseUrl = _interopRequireDefault(require("../lib/parse-url"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var __NEXTAUTH = {
  baseUrl: (0, _parseUrl.default)(process.env.NEXTAUTH_URL || process.env.VERCEL_URL).baseUrl,
  basePath: (0, _parseUrl.default)(process.env.NEXTAUTH_URL).basePath,
  baseUrlServer: (0, _parseUrl.default)(process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL || process.env.VERCEL_URL).baseUrl,
  basePathServer: (0, _parseUrl.default)(process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL).basePath,
  keepAlive: 0,
  clientMaxAge: 0,
  _clientLastSync: 0,
  _clientSyncTimer: null,
  _eventListenersAdded: false,
  _clientSession: undefined,
  _getSession: function _getSession() {}
};
var logger = (0, _logger2.proxyLogger)(_logger2.default, __NEXTAUTH.basePath);
var broadcast = BroadcastChannel();

if (typeof window !== "undefined" && !__NEXTAUTH._eventListenersAdded) {
  __NEXTAUTH._eventListenersAdded = true;
  broadcast.receive(function () {
    return __NEXTAUTH._getSession({
      event: "storage"
    });
  });
  document.addEventListener("visibilitychange", function () {
    !document.hidden && __NEXTAUTH._getSession({
      event: "visibilitychange"
    });
  }, false);
}

var SessionContext = (0, _react.createContext)();

function useSession(session) {
  var context = (0, _react.useContext)(SessionContext);
  if (context) return context;
  return _useSessionHook(session);
}

function _useSessionHook(session) {
  var _useState = (0, _react.useState)(session),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  var _useState3 = (0, _react.useState)(!data),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  (0, _react.useEffect)(function () {
    __NEXTAUTH._getSession = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
      var _ref2,
          _ref2$event,
          event,
          triggredByEvent,
          triggeredByStorageEvent,
          clientMaxAge,
          clientLastSync,
          currentTime,
          clientSession,
          newClientSessionData,
          _args = arguments;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref2$event = _ref2.event, event = _ref2$event === void 0 ? null : _ref2$event;
              _context.prev = 1;
              triggredByEvent = event !== null;
              triggeredByStorageEvent = event === "storage";
              clientMaxAge = __NEXTAUTH.clientMaxAge;
              clientLastSync = parseInt(__NEXTAUTH._clientLastSync);
              currentTime = _now();
              clientSession = __NEXTAUTH._clientSession;

              if (!(!triggeredByStorageEvent && clientSession !== undefined)) {
                _context.next = 19;
                break;
              }

              if (!(clientMaxAge === 0 && triggredByEvent !== true)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("return");

            case 13:
              if (!(clientMaxAge > 0 && clientSession === null)) {
                _context.next = 17;
                break;
              }

              return _context.abrupt("return");

            case 17:
              if (!(clientMaxAge > 0 && currentTime < clientLastSync + clientMaxAge)) {
                _context.next = 19;
                break;
              }

              return _context.abrupt("return");

            case 19:
              if (clientSession === undefined) {
                __NEXTAUTH._clientSession = null;
              }

              __NEXTAUTH._clientLastSync = _now();
              _context.next = 23;
              return getSession({
                triggerEvent: !triggeredByStorageEvent
              });

            case 23:
              newClientSessionData = _context.sent;
              __NEXTAUTH._clientSession = newClientSessionData;
              setData(newClientSessionData);
              setLoading(false);
              _context.next = 33;
              break;

            case 29:
              _context.prev = 29;
              _context.t0 = _context["catch"](1);
              logger.error("CLIENT_USE_SESSION_ERROR", _context.t0);
              setLoading(false);

            case 33:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 29]]);
    }));

    __NEXTAUTH._getSession();
  });
  return [data, loading];
}

function getSession(_x) {
  return _getSession2.apply(this, arguments);
}

function _getSession2() {
  _getSession2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(ctx) {
    var _ctx$triggerEvent;

    var session;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _fetchData("session", ctx);

          case 2:
            session = _context4.sent;

            if ((_ctx$triggerEvent = ctx === null || ctx === void 0 ? void 0 : ctx.triggerEvent) !== null && _ctx$triggerEvent !== void 0 ? _ctx$triggerEvent : true) {
              broadcast.post({
                event: "session",
                data: {
                  trigger: "getSession"
                }
              });
            }

            return _context4.abrupt("return", session);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getSession2.apply(this, arguments);
}

function getCsrfToken(_x2) {
  return _getCsrfToken.apply(this, arguments);
}

function _getCsrfToken() {
  _getCsrfToken = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(ctx) {
    var _yield$_fetchData;

    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _fetchData("csrf", ctx);

          case 2:
            _context5.t1 = _yield$_fetchData = _context5.sent;
            _context5.t0 = _context5.t1 === null;

            if (_context5.t0) {
              _context5.next = 6;
              break;
            }

            _context5.t0 = _yield$_fetchData === void 0;

          case 6:
            if (!_context5.t0) {
              _context5.next = 10;
              break;
            }

            _context5.t2 = void 0;
            _context5.next = 11;
            break;

          case 10:
            _context5.t2 = _yield$_fetchData.csrfToken;

          case 11:
            return _context5.abrupt("return", _context5.t2);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getCsrfToken.apply(this, arguments);
}

function getProviders() {
  return _getProviders.apply(this, arguments);
}

function _getProviders() {
  _getProviders = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6() {
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _fetchData("providers");

          case 2:
            return _context6.abrupt("return", _context6.sent);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _getProviders.apply(this, arguments);
}

function signIn(_x3) {
  return _signIn.apply(this, arguments);
}

function _signIn() {
  _signIn = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7(provider) {
    var options,
        authorizationParams,
        _options$callbackUrl,
        callbackUrl,
        _options$redirect,
        redirect,
        baseUrl,
        providers,
        isCredentials,
        isEmail,
        isSupportingReturn,
        signInUrl,
        _signInUrl,
        res,
        data,
        _data$url,
        url,
        error,
        _args7 = arguments;

    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
            authorizationParams = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
            _options$callbackUrl = options.callbackUrl, callbackUrl = _options$callbackUrl === void 0 ? window.location.href : _options$callbackUrl, _options$redirect = options.redirect, redirect = _options$redirect === void 0 ? true : _options$redirect;
            baseUrl = _apiBaseUrl();
            _context7.next = 6;
            return getProviders();

          case 6:
            providers = _context7.sent;

            if (providers) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt("return", window.location.replace("".concat(baseUrl, "/error")));

          case 9:
            if (provider in providers) {
              _context7.next = 11;
              break;
            }

            return _context7.abrupt("return", window.location.replace("".concat(baseUrl, "/signin?callbackUrl=").concat(encodeURIComponent(callbackUrl))));

          case 11:
            isCredentials = providers[provider].type === "credentials";
            isEmail = providers[provider].type === "email";
            isSupportingReturn = isCredentials || isEmail;
            signInUrl = isCredentials ? "".concat(baseUrl, "/callback/").concat(provider) : "".concat(baseUrl, "/signin/").concat(provider);
            _signInUrl = "".concat(signInUrl, "?").concat(new URLSearchParams(authorizationParams));
            _context7.t0 = fetch;
            _context7.t1 = _signInUrl;
            _context7.t2 = {
              "Content-Type": "application/x-www-form-urlencoded"
            };
            _context7.t3 = URLSearchParams;
            _context7.t4 = _objectSpread;
            _context7.t5 = _objectSpread({}, options);
            _context7.t6 = {};
            _context7.next = 25;
            return getCsrfToken();

          case 25:
            _context7.t7 = _context7.sent;
            _context7.t8 = callbackUrl;
            _context7.t9 = {
              csrfToken: _context7.t7,
              callbackUrl: _context7.t8,
              json: true
            };
            _context7.t10 = (0, _context7.t4)(_context7.t5, _context7.t6, _context7.t9);
            _context7.t11 = new _context7.t3(_context7.t10);
            _context7.t12 = {
              method: "post",
              headers: _context7.t2,
              body: _context7.t11
            };
            _context7.next = 33;
            return (0, _context7.t0)(_context7.t1, _context7.t12);

          case 33:
            res = _context7.sent;
            _context7.next = 36;
            return res.json();

          case 36:
            data = _context7.sent;

            if (!(redirect || !isSupportingReturn)) {
              _context7.next = 42;
              break;
            }

            url = (_data$url = data.url) !== null && _data$url !== void 0 ? _data$url : callbackUrl;
            window.location.replace(url);
            if (url.includes("#")) window.location.reload();
            return _context7.abrupt("return");

          case 42:
            error = new URL(data.url).searchParams.get("error");

            if (!res.ok) {
              _context7.next = 46;
              break;
            }

            _context7.next = 46;
            return __NEXTAUTH._getSession({
              event: "storage"
            });

          case 46:
            return _context7.abrupt("return", {
              error: error,
              status: res.status,
              ok: res.ok,
              url: error ? null : data.url
            });

          case 47:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _signIn.apply(this, arguments);
}

function signOut() {
  return _signOut.apply(this, arguments);
}

function _signOut() {
  _signOut = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee8() {
    var options,
        _options$callbackUrl2,
        callbackUrl,
        _options$redirect2,
        redirect,
        baseUrl,
        fetchOptions,
        res,
        data,
        _data$url2,
        url,
        _args8 = arguments;

    return _regenerator.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            options = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
            _options$callbackUrl2 = options.callbackUrl, callbackUrl = _options$callbackUrl2 === void 0 ? window.location.href : _options$callbackUrl2, _options$redirect2 = options.redirect, redirect = _options$redirect2 === void 0 ? true : _options$redirect2;
            baseUrl = _apiBaseUrl();
            _context8.t0 = {
              "Content-Type": "application/x-www-form-urlencoded"
            };
            _context8.t1 = URLSearchParams;
            _context8.next = 7;
            return getCsrfToken();

          case 7:
            _context8.t2 = _context8.sent;
            _context8.t3 = callbackUrl;
            _context8.t4 = {
              csrfToken: _context8.t2,
              callbackUrl: _context8.t3,
              json: true
            };
            _context8.t5 = new _context8.t1(_context8.t4);
            fetchOptions = {
              method: "post",
              headers: _context8.t0,
              body: _context8.t5
            };
            _context8.next = 14;
            return fetch("".concat(baseUrl, "/signout"), fetchOptions);

          case 14:
            res = _context8.sent;
            _context8.next = 17;
            return res.json();

          case 17:
            data = _context8.sent;
            broadcast.post({
              event: "session",
              data: {
                trigger: "signout"
              }
            });

            if (!redirect) {
              _context8.next = 24;
              break;
            }

            url = (_data$url2 = data.url) !== null && _data$url2 !== void 0 ? _data$url2 : callbackUrl;
            window.location.replace(url);
            if (url.includes("#")) window.location.reload();
            return _context8.abrupt("return");

          case 24:
            _context8.next = 26;
            return __NEXTAUTH._getSession({
              event: "storage"
            });

          case 26:
            return _context8.abrupt("return", data);

          case 27:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _signOut.apply(this, arguments);
}

function setOptions() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      baseUrl = _ref3.baseUrl,
      basePath = _ref3.basePath,
      clientMaxAge = _ref3.clientMaxAge,
      keepAlive = _ref3.keepAlive;

  if (baseUrl) __NEXTAUTH.baseUrl = baseUrl;
  if (basePath) __NEXTAUTH.basePath = basePath;
  if (clientMaxAge) __NEXTAUTH.clientMaxAge = clientMaxAge;

  if (keepAlive) {
    __NEXTAUTH.keepAlive = keepAlive;
    if (typeof window === "undefined") return;

    if (__NEXTAUTH._clientSyncTimer !== null) {
      clearTimeout(__NEXTAUTH._clientSyncTimer);
    }

    __NEXTAUTH._clientSyncTimer = setTimeout((0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (__NEXTAUTH._clientSession) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              _context2.next = 4;
              return __NEXTAUTH._getSession({
                event: "timer"
              });

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), keepAlive * 1000);
  }
}

function Provider(_ref5) {
  var children = _ref5.children,
      session = _ref5.session,
      options = _ref5.options;
  setOptions(options);
  return (0, _react.createElement)(SessionContext.Provider, {
    value: useSession(session)
  }, children);
}

function _fetchData(_x4) {
  return _fetchData2.apply(this, arguments);
}

function _fetchData2() {
  _fetchData2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee9(path) {
    var _ref7,
        ctx,
        _ref7$req,
        req,
        baseUrl,
        options,
        res,
        data,
        _args9 = arguments;

    return _regenerator.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _ref7 = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : {}, ctx = _ref7.ctx, _ref7$req = _ref7.req, req = _ref7$req === void 0 ? ctx === null || ctx === void 0 ? void 0 : ctx.req : _ref7$req;
            _context9.prev = 1;
            _context9.next = 4;
            return _apiBaseUrl();

          case 4:
            baseUrl = _context9.sent;
            options = req ? {
              headers: {
                cookie: req.headers.cookie
              }
            } : {};
            _context9.next = 8;
            return fetch("".concat(baseUrl, "/").concat(path), options);

          case 8:
            res = _context9.sent;
            _context9.next = 11;
            return res.json();

          case 11:
            data = _context9.sent;

            if (res.ok) {
              _context9.next = 14;
              break;
            }

            throw data;

          case 14:
            return _context9.abrupt("return", Object.keys(data).length > 0 ? data : null);

          case 17:
            _context9.prev = 17;
            _context9.t0 = _context9["catch"](1);
            logger.error("CLIENT_FETCH_ERROR", path, _context9.t0);
            return _context9.abrupt("return", null);

          case 21:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 17]]);
  }));
  return _fetchData2.apply(this, arguments);
}

function _apiBaseUrl() {
  if (typeof window === "undefined") {
    if (!process.env.NEXTAUTH_URL) {
      logger.warn("NEXTAUTH_URL", "NEXTAUTH_URL environment variable not set");
    }

    return "".concat(__NEXTAUTH.baseUrlServer).concat(__NEXTAUTH.basePathServer);
  }

  return __NEXTAUTH.basePath;
}

function _now() {
  return Math.floor(Date.now() / 1000);
}

function BroadcastChannel() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "nextauth.message";
  return {
    receive: function receive(onReceive) {
      if (typeof window === "undefined") return;
      window.addEventListener("storage", function () {
        var _ref6 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(event) {
          var message;
          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(event.key !== name)) {
                    _context3.next = 2;
                    break;
                  }

                  return _context3.abrupt("return");

                case 2:
                  message = JSON.parse(event.newValue);

                  if (!((message === null || message === void 0 ? void 0 : message.event) !== "session" || !(message !== null && message !== void 0 && message.data))) {
                    _context3.next = 5;
                    break;
                  }

                  return _context3.abrupt("return");

                case 5:
                  onReceive(message);

                case 6:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function (_x5) {
          return _ref6.apply(this, arguments);
        };
      }());
    },
    post: function post(message) {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(name, JSON.stringify(_objectSpread(_objectSpread({}, message), {}, {
        timestamp: _now()
      })));
    }
  };
}

var _default = {
  getSession: getSession,
  getCsrfToken: getCsrfToken,
  getProviders: getProviders,
  useSession: useSession,
  signIn: signIn,
  signOut: signOut,
  Provider: Provider,
  setOptions: setOptions,
  options: setOptions,
  session: getSession,
  providers: getProviders,
  csrfToken: getCsrfToken,
  signin: signIn,
  signout: signOut
};
exports.default = _default;