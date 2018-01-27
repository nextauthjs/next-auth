'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignInButtons = exports.LinkAccount = exports.LinkAccounts = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _head = require('next/dist/lib/head.js');

var _head2 = _interopRequireDefault(_head);

var _index = require('next/dist/lib/router/index.js');

var _index2 = _interopRequireDefault(_index);

var _link = require('next/dist/lib/link.js');

var _link2 = _interopRequireDefault(_link);

var _universalCookie = require('universal-cookie');

var _universalCookie2 = _interopRequireDefault(_universalCookie);

var _nextAuthClient = require('next-auth-client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/iain/Development/next-auth/example/pages/auth/index.js?entry';


var _class = function (_React$Component) {
  (0, _inherits3.default)(_class, _React$Component);

  (0, _createClass3.default)(_class, null, [{
    key: 'getInitialProps',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref) {
        var req = _ref.req;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _nextAuthClient.NextAuth.init({ req: req });

              case 2:
                _context.t0 = _context.sent;
                _context.next = 5;
                return _nextAuthClient.NextAuth.linked({ req: req });

              case 5:
                _context.t1 = _context.sent;
                _context.next = 8;
                return _nextAuthClient.NextAuth.providers({ req: req });

              case 8:
                _context.t2 = _context.sent;
                return _context.abrupt('return', {
                  session: _context.t0,
                  linkedAccounts: _context.t1,
                  providers: _context.t2
                });

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getInitialProps(_x) {
        return _ref2.apply(this, arguments);
      }

      return getInitialProps;
    }()
  }]);

  function _class(props) {
    (0, _classCallCheck3.default)(this, _class);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(this, props));

    _this.state = {
      email: '',
      session: _this.props.session
    };
    _this.handleEmailChange = _this.handleEmailChange.bind(_this);
    _this.handleSignInSubmit = _this.handleSignInSubmit.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(_class, [{
    key: 'handleEmailChange',
    value: function handleEmailChange(event) {
      this.setState({
        email: event.target.value
      });
    }
  }, {
    key: 'handleSignInSubmit',
    value: function handleSignInSubmit(event) {
      var _this2 = this;

      event.preventDefault();

      if (!this.state.email) return;

      // Save current URL so user is redirected back here after signing in
      var cookies = new _universalCookie2.default();
      cookies.set('redirect_url', window.location.pathname);

      _nextAuthClient.NextAuth.signin(this.state.email).then(function () {
        _index2.default.push('/auth/check-email?email=' + _this2.state.email);
      }).catch(function (err) {
        _index2.default.push('/auth/error?action=signin&type=email&email=' + _this2.state.email);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.session.user) {
        return _react2.default.createElement('div', { className: 'container', __source: {
            fileName: _jsxFileName,
            lineNumber: 55
          }
        }, _react2.default.createElement(_head2.default, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 56
          }
        }, _react2.default.createElement('link', { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css', integrity: 'sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm', crossOrigin: 'anonymous', __source: {
            fileName: _jsxFileName,
            lineNumber: 57
          }
        }), _react2.default.createElement('script', { src: 'https://cdn.polyfill.io/v2/polyfill.min.js', __source: {
            fileName: _jsxFileName,
            lineNumber: 58
          }
        })), _react2.default.createElement('div', { className: 'text-center', __source: {
            fileName: _jsxFileName,
            lineNumber: 60
          }
        }, _react2.default.createElement('h1', { className: 'display-4 mt-3', __source: {
            fileName: _jsxFileName,
            lineNumber: 61
          }
        }, 'NextAuth Example'), _react2.default.createElement('p', { className: 'lead mt-3 mb-1', __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          }
        }, 'You are signed in as ', _react2.default.createElement('span', { className: 'font-weight-bold', __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          }
        }, this.props.session.user.name || this.props.session.user.email), '.')), _react2.default.createElement('div', { className: 'row', __source: {
            fileName: _jsxFileName,
            lineNumber: 64
          }
        }, _react2.default.createElement('div', { className: 'col-sm-5 mr-auto ml-auto', __source: {
            fileName: _jsxFileName,
            lineNumber: 65
          }
        }, _react2.default.createElement(LinkAccounts, {
          session: this.props.session,
          linkedAccounts: this.props.linkedAccounts,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 66
          }
        }))), _react2.default.createElement('p', { className: 'text-center', __source: {
            fileName: _jsxFileName,
            lineNumber: 72
          }
        }, _react2.default.createElement(_link2.default, { href: '/', __source: {
            fileName: _jsxFileName,
            lineNumber: 73
          }
        }, _react2.default.createElement('a', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 73
          }
        }, 'Home'))));
      } else {
        return _react2.default.createElement('div', { className: 'container', __source: {
            fileName: _jsxFileName,
            lineNumber: 79
          }
        }, _react2.default.createElement(_head2.default, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 80
          }
        }, _react2.default.createElement('link', { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css', integrity: 'sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm', crossOrigin: 'anonymous', __source: {
            fileName: _jsxFileName,
            lineNumber: 81
          }
        }), _react2.default.createElement('script', { src: 'https://cdn.polyfill.io/v2/polyfill.min.js', __source: {
            fileName: _jsxFileName,
            lineNumber: 82
          }
        })), _react2.default.createElement('div', { className: 'text-center', __source: {
            fileName: _jsxFileName,
            lineNumber: 84
          }
        }, _react2.default.createElement('h1', { className: 'display-4 mt-3 mb-3', __source: {
            fileName: _jsxFileName,
            lineNumber: 85
          }
        }, 'NextAuth Example')), _react2.default.createElement('div', { className: 'row', __source: {
            fileName: _jsxFileName,
            lineNumber: 87
          }
        }, _react2.default.createElement('div', { className: 'col-sm-6 mr-auto ml-auto', __source: {
            fileName: _jsxFileName,
            lineNumber: 88
          }
        }, _react2.default.createElement('div', { className: 'card mt-3 mb-3', __source: {
            fileName: _jsxFileName,
            lineNumber: 89
          }
        }, _react2.default.createElement('h4', { className: 'card-header', __source: {
            fileName: _jsxFileName,
            lineNumber: 90
          }
        }, 'Sign In'), _react2.default.createElement('div', { className: 'card-body pb-0', __source: {
            fileName: _jsxFileName,
            lineNumber: 91
          }
        }, _react2.default.createElement(SignInButtons, { providers: this.props.providers, __source: {
            fileName: _jsxFileName,
            lineNumber: 92
          }
        }), _react2.default.createElement('form', { id: 'signin', method: 'post', action: '/auth/email/signin', onSubmit: this.handleSignInSubmit, __source: {
            fileName: _jsxFileName,
            lineNumber: 93
          }
        }, _react2.default.createElement('input', { name: '_csrf', type: 'hidden', value: this.state.session.csrfToken, __source: {
            fileName: _jsxFileName,
            lineNumber: 94
          }
        }), _react2.default.createElement('p', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 95
          }
        }, _react2.default.createElement('label', { htmlFor: 'email', __source: {
            fileName: _jsxFileName,
            lineNumber: 96
          }
        }, 'Email address'), _react2.default.createElement('br', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 96
          }
        }), _react2.default.createElement('input', { name: 'email', type: 'text', placeholder: 'j.smith@example.com', id: 'email', className: 'form-control', value: this.state.email, onChange: this.handleEmailChange, __source: {
            fileName: _jsxFileName,
            lineNumber: 97
          }
        })), _react2.default.createElement('p', { className: 'text-right', __source: {
            fileName: _jsxFileName,
            lineNumber: 99
          }
        }, _react2.default.createElement('button', { id: 'submitButton', type: 'submit', className: 'btn btn-outline-primary', __source: {
            fileName: _jsxFileName,
            lineNumber: 100
          }
        }, 'Sign in with email'))))))), _react2.default.createElement('p', { className: 'text-center', __source: {
            fileName: _jsxFileName,
            lineNumber: 107
          }
        }, _react2.default.createElement(_link2.default, { href: '/', __source: {
            fileName: _jsxFileName,
            lineNumber: 108
          }
        }, _react2.default.createElement('a', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 108
          }
        }, 'Home'))));
      }
    }
  }]);

  return _class;
}(_react2.default.Component);

exports.default = _class;
var LinkAccounts = exports.LinkAccounts = function (_React$Component2) {
  (0, _inherits3.default)(LinkAccounts, _React$Component2);

  function LinkAccounts() {
    (0, _classCallCheck3.default)(this, LinkAccounts);

    return (0, _possibleConstructorReturn3.default)(this, (LinkAccounts.__proto__ || (0, _getPrototypeOf2.default)(LinkAccounts)).apply(this, arguments));
  }

  (0, _createClass3.default)(LinkAccounts, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement('div', { className: 'card mt-3 mb-3', __source: {
          fileName: _jsxFileName,
          lineNumber: 119
        }
      }, _react2.default.createElement('h4', { className: 'card-header', __source: {
          fileName: _jsxFileName,
          lineNumber: 120
        }
      }, 'Link Accounts'), _react2.default.createElement('div', { className: 'card-body pb-0', __source: {
          fileName: _jsxFileName,
          lineNumber: 121
        }
      }, (0, _keys2.default)(this.props.linkedAccounts).map(function (provider, i) {
        return _react2.default.createElement(LinkAccount, { key: i, provider: provider, session: _this4.props.session, linked: _this4.props.linkedAccounts[provider], __source: {
            fileName: _jsxFileName,
            lineNumber: 124
          }
        });
      })));
    }
  }]);

  return LinkAccounts;
}(_react2.default.Component);

var LinkAccount = exports.LinkAccount = function (_React$Component3) {
  (0, _inherits3.default)(LinkAccount, _React$Component3);

  function LinkAccount() {
    (0, _classCallCheck3.default)(this, LinkAccount);

    return (0, _possibleConstructorReturn3.default)(this, (LinkAccount.__proto__ || (0, _getPrototypeOf2.default)(LinkAccount)).apply(this, arguments));
  }

  (0, _createClass3.default)(LinkAccount, [{
    key: 'render',
    value: function render() {
      if (this.props.linked === true) {
        return _react2.default.createElement('form', { method: 'post', action: '/auth/oauth/' + this.props.provider.toLowerCase() + '/unlink', __source: {
            fileName: _jsxFileName,
            lineNumber: 137
          }
        }, _react2.default.createElement('input', { name: '_csrf', type: 'hidden', value: this.props.session.csrfToken, __source: {
            fileName: _jsxFileName,
            lineNumber: 138
          }
        }), _react2.default.createElement('p', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 139
          }
        }, _react2.default.createElement('button', { className: 'btn btn-block btn-outline-danger', type: 'submit', __source: {
            fileName: _jsxFileName,
            lineNumber: 140
          }
        }, 'Unlink from ', this.props.provider)));
      } else {
        return _react2.default.createElement('p', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 148
          }
        }, _react2.default.createElement('a', { className: 'btn btn-block btn-outline-primary', href: '/auth/oauth/' + this.props.provider.toLowerCase(), __source: {
            fileName: _jsxFileName,
            lineNumber: 149
          }
        }, 'Link with ', this.props.provider));
      }
    }
  }]);

  return LinkAccount;
}(_react2.default.Component);

var SignInButtons = exports.SignInButtons = function (_React$Component4) {
  (0, _inherits3.default)(SignInButtons, _React$Component4);

  function SignInButtons() {
    (0, _classCallCheck3.default)(this, SignInButtons);

    return (0, _possibleConstructorReturn3.default)(this, (SignInButtons.__proto__ || (0, _getPrototypeOf2.default)(SignInButtons)).apply(this, arguments));
  }

  (0, _createClass3.default)(SignInButtons, [{
    key: 'render',
    value: function render() {
      var _this7 = this;

      return _react2.default.createElement(_react2.default.Fragment, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 161
        }
      }, (0, _keys2.default)(this.props.providers).map(function (provider, i) {
        return _react2.default.createElement('p', { key: i, __source: {
            fileName: _jsxFileName,
            lineNumber: 165
          }
        }, _react2.default.createElement('a', { className: 'btn btn-block btn-outline-secondary', href: _this7.props.providers[provider].signin, __source: {
            fileName: _jsxFileName,
            lineNumber: 166
          }
        }, 'Sign in with ', provider));
      }));
    }
  }]);

  return SignInButtons;
}(_react2.default.Component);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzL2F1dGgvaW5kZXguanMiXSwibmFtZXMiOlsiUmVhY3QiLCJIZWFkIiwiUm91dGVyIiwiTGluayIsIkNvb2tpZXMiLCJOZXh0QXV0aCIsInJlcSIsImluaXQiLCJsaW5rZWQiLCJwcm92aWRlcnMiLCJzZXNzaW9uIiwibGlua2VkQWNjb3VudHMiLCJwcm9wcyIsInN0YXRlIiwiZW1haWwiLCJoYW5kbGVFbWFpbENoYW5nZSIsImJpbmQiLCJoYW5kbGVTaWduSW5TdWJtaXQiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJwcmV2ZW50RGVmYXVsdCIsImNvb2tpZXMiLCJzZXQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwic2lnbmluIiwidGhlbiIsInB1c2giLCJjYXRjaCIsInVzZXIiLCJuYW1lIiwiY3NyZlRva2VuIiwiQ29tcG9uZW50IiwiTGlua0FjY291bnRzIiwibWFwIiwicHJvdmlkZXIiLCJpIiwiTGlua0FjY291bnQiLCJ0b0xvd2VyQ2FzZSIsIlNpZ25JbkJ1dHRvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQU87Ozs7QUFDUCxBQUFPOzs7O0FBQ1AsQUFBTzs7OztBQUNQLEFBQU87Ozs7QUFDUCxBQUFPOzs7O0FBQ1AsQUFBUzs7Ozs7Ozs7Ozs7Ozs7WSxBQUl1QixXQUFBLEE7Ozs7Ozt1QkFFWCx5QkFBQSxBQUFTLEtBQUssRUFBQyxLQUFmLEFBQWMsQTs7Ozs7dUJBQ1AseUJBQUEsQUFBUyxPQUFPLEVBQUMsS0FBakIsQUFBZ0IsQTs7Ozs7dUJBQ3JCLHlCQUFBLEFBQVMsVUFBVSxFQUFDLEssQUFBcEIsQUFBbUI7Ozs7O0Esb0NBRHBDO0EsMkNBQ0E7QTtBQUZBOzs7Ozs7Ozs7Ozs7Ozs7QUFNSjs7O2tCQUFBLEFBQVksT0FBTzt3Q0FBQTs7c0lBQUEsQUFDWCxBQUNOOztVQUFBLEFBQUs7YUFBUSxBQUNKLEFBQ1A7ZUFBUyxN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Ozs2QkFDRyxjQUFELGdCQUFBLEFBQU87O29CQUFQO3NCQUFBLEFBRUk7QUFGSjtBQUFBLE9BQUEsc0JBRWdCLEtBQUEsQUFBSyxNQUFqQixBQUF1QixXQUF2QixBQUFrQyxJQUFJLFVBQUEsQUFBQyxVQUFELEFBQVcsR0FBTSxBQUNyRDsrQkFDRSxjQUFBLE9BQUcsS0FBSCxBQUFRO3NCQUFSO3dCQUFBLEFBQ0U7QUFERjtTQUFBLGtCQUNFLGNBQUEsT0FBRyxXQUFILEFBQWEsdUNBQXNDLE1BQU0sT0FBQSxBQUFLLE1BQUwsQUFBVyxVQUFYLEFBQXFCLFVBQTlFLEFBQXdGO3NCQUF4Rjt3QkFBQTtBQUFBO1dBQ2dCLGlCQUhwQixBQUNFLEFBQ0UsQUFLTDtBQVhQLEFBQ0UsQUFFSSxBQVlQO0FBakJIO0FBQUE7O1NBQUE7RUFBbUMsZ0JBQW5DLEFBQXlDIiwiZmlsZSI6ImluZGV4LmpzP2VudHJ5Iiwic291cmNlUm9vdCI6Ii9Vc2Vycy9pYWluL0RldmVsb3BtZW50L25leHQtYXV0aC9leGFtcGxlIn0=