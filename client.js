(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('babel-polyfill'), require('isomorphic-fetch')) :
  typeof define === 'function' && define.amd ? define(['exports', 'babel-polyfill', 'isomorphic-fetch'], factory) :
  (global = global || self, factory(global['next-auth-client'] = {}, null, global.fetch));
}(this, function (exports, babelPolyfill, fetch) { 'use strict';

  fetch = fetch && fetch.hasOwnProperty('default') ? fetch['default'] : fetch;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var _default =
  /*#__PURE__*/
  function () {
    function _default() {
      _classCallCheck(this, _default);
    }

    _createClass(_default, null, [{
      key: "init",

      /**
       * This is an async, isometric method which returns a session object - 
       * either by looking up the current express session object when run on the
       * server, or by using fetch (and optionally caching the result in local
       * storage) when run on the client.  
       * 
       * Note that actual session tokens are not stored in local storage, they are
       * kept in an HTTP Only cookie as protection against session hi-jacking by
       * malicious JavaScript.
       **/
      value: function () {
        var _init = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var _this = this;

          var _ref,
              _ref$req,
              req,
              _ref$force,
              force,
              session,
              _args = arguments;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _ref = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref$req = _ref.req, req = _ref$req === void 0 ? null : _ref$req, _ref$force = _ref.force, force = _ref$force === void 0 ? false : _ref$force;
                  session = {};

                  if (req) {
                    if (req.session) {
                      // If running on the server session data should be in the req object
                      session.csrfToken = req.connection._httpMessage.locals._csrf;
                      session.expires = req.session.cookie._expires; // If the user is logged in, add the user to the session object

                      if (req.user) {
                        session.user = req.user;
                      }
                    }
                  } else {
                    // If running in the browser attempt to load session from sessionStore
                    if (force === true) {
                      // If force update is set, reset data store
                      this._removeLocalStore('session');
                    } else {
                      session = this._getLocalStore('session');
                    }
                  } // If session data exists, has not expired AND force is not set then
                  // return the stored session we already have.


                  if (!(session && Object.keys(session).length > 0 && session.expires && session.expires > Date.now())) {
                    _context.next = 7;
                    break;
                  }

                  return _context.abrupt("return", new Promise(function (resolve) {
                    resolve(session);
                  }));

                case 7:
                  if (!(typeof window === 'undefined')) {
                    _context.next = 9;
                    break;
                  }

                  return _context.abrupt("return", new Promise(function (resolve) {
                    resolve({});
                  }));

                case 9:
                  return _context.abrupt("return", fetch('/auth/session', {
                    credentials: 'same-origin'
                  }).then(function (response) {
                    if (response.ok) {
                      return response;
                    } else {
                      return Promise.reject(Error('HTTP error when trying to get session'));
                    }
                  }).then(function (response) {
                    return response.json();
                  }).then(function (data) {
                    // Update session with session info
                    session = data; // Set a value we will use to check this client should silently
                    // revalidate, using the value for revalidateAge returned by the server.

                    session.expires = Date.now() + session.revalidateAge; // Save changes to session

                    _this._saveLocalStore('session', session);

                    return session;
                  })["catch"](function () {
                    return Error('Unable to get session');
                  }));

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function init() {
          return _init.apply(this, arguments);
        }

        return init;
      }()
      /**
       * A simple static method to get the CSRF Token is provided for convenience
       **/

    }, {
      key: "csrfToken",
      value: function () {
        var _csrfToken = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", fetch('/auth/csrf', {
                    credentials: 'same-origin'
                  }).then(function (response) {
                    if (response.ok) {
                      return response;
                    } else {
                      return Promise.reject(Error('Unexpected response when trying to get CSRF token'));
                    }
                  }).then(function (response) {
                    return response.json();
                  }).then(function (data) {
                    return data.csrfToken;
                  })["catch"](function () {
                    return Error('Unable to get CSRF token');
                  }));

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function csrfToken() {
          return _csrfToken.apply(this, arguments);
        }

        return csrfToken;
      }()
      /**
       * A static method to get list of currently linked oAuth accounts
       **/

    }, {
      key: "linked",
      value: function () {
        var _linked = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3() {
          var _ref2,
              _ref2$req,
              req,
              _args3 = arguments;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _ref2 = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {}, _ref2$req = _ref2.req, req = _ref2$req === void 0 ? null : _ref2$req;

                  if (!req) {
                    _context3.next = 3;
                    break;
                  }

                  return _context3.abrupt("return", req.linked());

                case 3:
                  return _context3.abrupt("return", fetch('/auth/linked', {
                    credentials: 'same-origin'
                  }).then(function (response) {
                    if (response.ok) {
                      return response;
                    } else {
                      return Promise.reject(Error('Unexpected response when trying to get linked accounts'));
                    }
                  }).then(function (response) {
                    return response.json();
                  }).then(function (data) {
                    return data;
                  })["catch"](function () {
                    return Error('Unable to get linked accounts');
                  }));

                case 4:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function linked() {
          return _linked.apply(this, arguments);
        }

        return linked;
      }()
      /**
       * A static method to get list of currently configured oAuth providers
       **/

    }, {
      key: "providers",
      value: function () {
        var _providers = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee4() {
          var _ref3,
              _ref3$req,
              req,
              _args4 = arguments;

          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _ref3 = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {}, _ref3$req = _ref3.req, req = _ref3$req === void 0 ? null : _ref3$req;

                  if (!req) {
                    _context4.next = 3;
                    break;
                  }

                  return _context4.abrupt("return", req.providers());

                case 3:
                  return _context4.abrupt("return", fetch('/auth/providers', {
                    credentials: 'same-origin'
                  }).then(function (response) {
                    if (response.ok) {
                      return response;
                    } else {
                      console.log("NextAuth Error Fetching Providers");
                      return null;
                    }
                  }).then(function (response) {
                    return response.json();
                  }).then(function (data) {
                    return data;
                  })["catch"](function (e) {
                    console.log("NextAuth Error Loading Providers");
                    console.log(e);
                    return null;
                  }));

                case 4:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function providers() {
          return _providers.apply(this, arguments);
        }

        return providers;
      }()
      /*
       * Sign in
       * 
       * Will post a form to /auth/signin auth route if an object is passed.
       * If the details are valid a session will be created and you should redirect
       * to your callback page so the session is loaded in the client.
       *
       * If just a string containing an email address is specififed will generate a
       * a one-time use sign in link and send it via email; you should redirect to a
       * page telling the user to check their inbox for an email with the link.
       */

    }, {
      key: "signin",
      value: function () {
        var _signin = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee6(params) {
          var formData, route, encodedForm;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  // Params can be just string (an email address) or an object (form fields)
                  formData = typeof params === 'string' ? {
                    email: params
                  } : params; // Use either the email token generation route or the custom form auth route

                  route = typeof params === 'string' ? '/auth/email/signin' : '/auth/signin'; // Add latest CSRF Token to request

                  _context6.next = 4;
                  return this.csrfToken();

                case 4:
                  formData._csrf = _context6.sent;
                  // Encoded form parser for sending data in the body
                  encodedForm = Object.keys(formData).map(function (key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
                  }).join('&');
                  return _context6.abrupt("return", fetch(route, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'X-Requested-With': 'XMLHttpRequest' // So Express can detect AJAX post

                    },
                    body: encodedForm,
                    credentials: 'same-origin'
                  }).then(
                  /*#__PURE__*/
                  function () {
                    var _ref4 = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee5(response) {
                      return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              if (!response.ok) {
                                _context5.next = 6;
                                break;
                              }

                              _context5.next = 3;
                              return response.json();

                            case 3:
                              return _context5.abrupt("return", _context5.sent);

                            case 6:
                              throw new Error('HTTP error while attempting to sign in');

                            case 7:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      }, _callee5);
                    }));

                    return function (_x2) {
                      return _ref4.apply(this, arguments);
                    };
                  }()).then(function (data) {
                    if (data.success && data.success === true) {
                      return Promise.resolve(true);
                    } else {
                      return Promise.resolve(false);
                    }
                  }));

                case 7:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function signin(_x) {
          return _signin.apply(this, arguments);
        }

        return signin;
      }()
    }, {
      key: "signout",
      value: function () {
        var _signout = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee7() {
          var csrfToken, formData, encodedForm;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return this.csrfToken();

                case 2:
                  csrfToken = _context7.sent;
                  formData = {
                    _csrf: csrfToken
                  }; // Encoded form parser for sending data in the body

                  encodedForm = Object.keys(formData).map(function (key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
                  }).join('&'); // Remove cached session data

                  this._removeLocalStore('session');

                  return _context7.abrupt("return", fetch('/auth/signout', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: encodedForm,
                    credentials: 'same-origin'
                  }).then(function () {
                    return true;
                  })["catch"](function () {
                    return Error('Unable to sign out');
                  }));

                case 7:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function signout() {
          return _signout.apply(this, arguments);
        }

        return signout;
      }() // The Web Storage API is widely supported, but not always available (e.g.
      // it can be restricted in private browsing mode, triggering an exception).
      // We handle that silently by just returning null here.

    }, {
      key: "_getLocalStore",
      value: function _getLocalStore(name) {
        try {
          return JSON.parse(localStorage.getItem(name));
        } catch (err) {
          return null;
        }
      }
    }, {
      key: "_saveLocalStore",
      value: function _saveLocalStore(name, data) {
        try {
          localStorage.setItem(name, JSON.stringify(data));
          return true;
        } catch (err) {
          return false;
        }
      }
    }, {
      key: "_removeLocalStore",
      value: function _removeLocalStore(name) {
        try {
          localStorage.removeItem(name);
          return true;
        } catch (err) {
          return false;
        }
      }
    }]);

    return _default;
  }();

  exports.NextAuth = _default;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
