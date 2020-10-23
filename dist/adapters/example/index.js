"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Adapter = function Adapter(config) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  function getAdapter(_x) {
    return _getAdapter.apply(this, arguments);
  }

  function _getAdapter() {
    _getAdapter = _asyncToGenerator(function* (appOptions) {
      function _debug() {
        if (appOptions.debug) {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          console.log('[next-auth][debug]', ...args);
        }
      }

      function createUser(_x2) {
        return _createUser.apply(this, arguments);
      }

      function _createUser() {
        _createUser = _asyncToGenerator(function* (profile) {
          _debug('createUser', profile);

          return null;
        });
        return _createUser.apply(this, arguments);
      }

      function getUser(_x3) {
        return _getUser.apply(this, arguments);
      }

      function _getUser() {
        _getUser = _asyncToGenerator(function* (id) {
          _debug('getUser', id);

          return null;
        });
        return _getUser.apply(this, arguments);
      }

      function getUserByEmail(_x4) {
        return _getUserByEmail.apply(this, arguments);
      }

      function _getUserByEmail() {
        _getUserByEmail = _asyncToGenerator(function* (email) {
          _debug('getUserByEmail', email);

          return null;
        });
        return _getUserByEmail.apply(this, arguments);
      }

      function getUserByProviderAccountId(_x5, _x6) {
        return _getUserByProviderAccountId.apply(this, arguments);
      }

      function _getUserByProviderAccountId() {
        _getUserByProviderAccountId = _asyncToGenerator(function* (providerId, providerAccountId) {
          _debug('getUserByProviderAccountId', providerId, providerAccountId);

          return null;
        });
        return _getUserByProviderAccountId.apply(this, arguments);
      }

      function updateUser(_x7) {
        return _updateUser.apply(this, arguments);
      }

      function _updateUser() {
        _updateUser = _asyncToGenerator(function* (user) {
          _debug('updateUser', user);

          return null;
        });
        return _updateUser.apply(this, arguments);
      }

      function deleteUser(_x8) {
        return _deleteUser.apply(this, arguments);
      }

      function _deleteUser() {
        _deleteUser = _asyncToGenerator(function* (userId) {
          _debug('deleteUser', userId);

          return null;
        });
        return _deleteUser.apply(this, arguments);
      }

      function linkAccount(_x9, _x10, _x11, _x12, _x13, _x14, _x15) {
        return _linkAccount.apply(this, arguments);
      }

      function _linkAccount() {
        _linkAccount = _asyncToGenerator(function* (userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
          _debug('linkAccount', userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires);

          return null;
        });
        return _linkAccount.apply(this, arguments);
      }

      function unlinkAccount(_x16, _x17, _x18) {
        return _unlinkAccount.apply(this, arguments);
      }

      function _unlinkAccount() {
        _unlinkAccount = _asyncToGenerator(function* (userId, providerId, providerAccountId) {
          _debug('unlinkAccount', userId, providerId, providerAccountId);

          return null;
        });
        return _unlinkAccount.apply(this, arguments);
      }

      function createSession(_x19) {
        return _createSession.apply(this, arguments);
      }

      function _createSession() {
        _createSession = _asyncToGenerator(function* (user) {
          _debug('createSession', user);

          return null;
        });
        return _createSession.apply(this, arguments);
      }

      function getSession(_x20) {
        return _getSession.apply(this, arguments);
      }

      function _getSession() {
        _getSession = _asyncToGenerator(function* (sessionToken) {
          _debug('getSession', sessionToken);

          return null;
        });
        return _getSession.apply(this, arguments);
      }

      function updateSession(_x21, _x22) {
        return _updateSession.apply(this, arguments);
      }

      function _updateSession() {
        _updateSession = _asyncToGenerator(function* (session, force) {
          _debug('updateSession', session);

          return null;
        });
        return _updateSession.apply(this, arguments);
      }

      function deleteSession(_x23) {
        return _deleteSession.apply(this, arguments);
      }

      function _deleteSession() {
        _deleteSession = _asyncToGenerator(function* (sessionToken) {
          _debug('deleteSession', sessionToken);

          return null;
        });
        return _deleteSession.apply(this, arguments);
      }

      function createVerificationRequest(_x24, _x25, _x26, _x27, _x28) {
        return _createVerificationRequest.apply(this, arguments);
      }

      function _createVerificationRequest() {
        _createVerificationRequest = _asyncToGenerator(function* (identifier, url, token, secret, provider) {
          _debug('createVerificationRequest', identifier);

          return null;
        });
        return _createVerificationRequest.apply(this, arguments);
      }

      function getVerificationRequest(_x29, _x30, _x31, _x32) {
        return _getVerificationRequest.apply(this, arguments);
      }

      function _getVerificationRequest() {
        _getVerificationRequest = _asyncToGenerator(function* (identifier, token, secret, provider) {
          _debug('getVerificationRequest', identifier, token);

          return null;
        });
        return _getVerificationRequest.apply(this, arguments);
      }

      function deleteVerificationRequest(_x33, _x34, _x35, _x36) {
        return _deleteVerificationRequest.apply(this, arguments);
      }

      function _deleteVerificationRequest() {
        _deleteVerificationRequest = _asyncToGenerator(function* (identifier, token, secret, provider) {
          _debug('deleteVerification', identifier, token);

          return null;
        });
        return _deleteVerificationRequest.apply(this, arguments);
      }

      return Promise.resolve({
        createUser,
        getUser,
        getUserByEmail,
        getUserByProviderAccountId,
        updateUser,
        deleteUser,
        linkAccount,
        unlinkAccount,
        createSession,
        getSession,
        updateSession,
        deleteSession,
        createVerificationRequest,
        getVerificationRequest,
        deleteVerificationRequest
      });
    });
    return _getAdapter.apply(this, arguments);
  }

  return {
    getAdapter
  };
};

var _default = {
  Adapter
};
exports.default = _default;