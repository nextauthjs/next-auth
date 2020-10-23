"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = require("crypto");

var _errors = require("../../lib/errors");

var _logger = _interopRequireDefault(require("../../lib/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Adapter = config => {
  var {
    prisma,
    modelMapping = {
      User: 'user',
      Account: 'account',
      Session: 'session',
      VerificationRequest: 'verificationRequest'
    }
  } = config;
  var {
    User,
    Account,
    Session,
    VerificationRequest
  } = modelMapping;

  function getCompoundId(providerId, providerAccountId) {
    return (0, _crypto.createHash)('sha256').update("".concat(providerId, ":").concat(providerAccountId)).digest('hex');
  }

  function getAdapter(_x) {
    return _getAdapter.apply(this, arguments);
  }

  function _getAdapter() {
    _getAdapter = _asyncToGenerator(function* (appOptions) {
      function debug(debugCode) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _logger.default.debug("PRISMA_".concat(debugCode), ...args);
      }

      if (appOptions && (!appOptions.session || !appOptions.session.maxAge)) {
        debug('GET_ADAPTER', 'Session expiry not configured (defaulting to 30 days');
      }

      var defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000;
      var sessionMaxAge = appOptions && appOptions.session && appOptions.session.maxAge ? appOptions.session.maxAge * 1000 : defaultSessionMaxAge;
      var sessionUpdateAge = appOptions && appOptions.session && appOptions.session.updateAge ? appOptions.session.updateAge * 1000 : 0;

      function createUser(_x2) {
        return _createUser.apply(this, arguments);
      }

      function _createUser() {
        _createUser = _asyncToGenerator(function* (profile) {
          debug('CREATE_USER', profile);

          try {
            return prisma[User].create({
              data: {
                name: profile.name,
                email: profile.email,
                image: profile.image,
                emailVerified: profile.emailVerified ? profile.emailVerified.toISOString() : null
              }
            });
          } catch (error) {
            _logger.default.error('CREATE_USER_ERROR', error);

            return Promise.reject(new _errors.CreateUserError(error));
          }
        });
        return _createUser.apply(this, arguments);
      }

      function getUser(_x3) {
        return _getUser.apply(this, arguments);
      }

      function _getUser() {
        _getUser = _asyncToGenerator(function* (id) {
          debug('GET_USER', id);

          try {
            return prisma[User].findOne({
              where: {
                id
              }
            });
          } catch (error) {
            _logger.default.error('GET_USER_BY_ID_ERROR', error);

            return Promise.reject(new Error('GET_USER_BY_ID_ERROR', error));
          }
        });
        return _getUser.apply(this, arguments);
      }

      function getUserByEmail(_x4) {
        return _getUserByEmail.apply(this, arguments);
      }

      function _getUserByEmail() {
        _getUserByEmail = _asyncToGenerator(function* (email) {
          debug('GET_USER_BY_EMAIL', email);

          try {
            if (!email) {
              return Promise.resolve(null);
            }

            return prisma[User].findOne({
              where: {
                email
              }
            });
          } catch (error) {
            _logger.default.error('GET_USER_BY_EMAIL_ERROR', error);

            return Promise.reject(new Error('GET_USER_BY_EMAIL_ERROR', error));
          }
        });
        return _getUserByEmail.apply(this, arguments);
      }

      function getUserByProviderAccountId(_x5, _x6) {
        return _getUserByProviderAccountId.apply(this, arguments);
      }

      function _getUserByProviderAccountId() {
        _getUserByProviderAccountId = _asyncToGenerator(function* (providerId, providerAccountId) {
          debug('GET_USER_BY_PROVIDER_ACCOUNT_ID', providerId, providerAccountId);

          try {
            var account = yield prisma[Account].findOne({
              where: {
                compoundId: getCompoundId(providerId, providerAccountId)
              }
            });

            if (!account) {
              return null;
            }

            return prisma[User].findOne({
              where: {
                id: account.userId
              }
            });
          } catch (error) {
            _logger.default.error('GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR', error);

            return Promise.reject(new Error('GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR', error));
          }
        });
        return _getUserByProviderAccountId.apply(this, arguments);
      }

      function updateUser(_x7) {
        return _updateUser.apply(this, arguments);
      }

      function _updateUser() {
        _updateUser = _asyncToGenerator(function* (user) {
          debug('UPDATE_USER', user);

          try {
            var {
              id,
              name,
              email,
              image,
              emailVerified
            } = user;
            return prisma[User].update({
              where: {
                id
              },
              data: {
                name,
                email,
                image,
                emailVerified: emailVerified ? emailVerified.toISOString() : null
              }
            });
          } catch (error) {
            _logger.default.error('UPDATE_USER_ERROR', error);

            return Promise.reject(new Error('UPDATE_USER_ERROR', error));
          }
        });
        return _updateUser.apply(this, arguments);
      }

      function deleteUser(_x8) {
        return _deleteUser.apply(this, arguments);
      }

      function _deleteUser() {
        _deleteUser = _asyncToGenerator(function* (userId) {
          debug('DELETE_USER', userId);

          try {
            return prisma[User].delete({
              where: {
                id: userId
              }
            });
          } catch (error) {
            _logger.default.error('DELETE_USER_ERROR', error);

            return Promise.reject(new Error('DELETE_USER_ERROR', error));
          }
        });
        return _deleteUser.apply(this, arguments);
      }

      function linkAccount(_x9, _x10, _x11, _x12, _x13, _x14, _x15) {
        return _linkAccount.apply(this, arguments);
      }

      function _linkAccount() {
        _linkAccount = _asyncToGenerator(function* (userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
          debug('LINK_ACCOUNT', userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires);

          try {
            return prisma[Account].create({
              data: {
                accessToken,
                refreshToken,
                compoundId: getCompoundId(providerId, providerAccountId),
                providerAccountId: "".concat(providerAccountId),
                providerId,
                providerType,
                accessTokenExpires,
                userId
              }
            });
          } catch (error) {
            _logger.default.error('LINK_ACCOUNT_ERROR', error);

            return Promise.reject(new Error('LINK_ACCOUNT_ERROR', error));
          }
        });
        return _linkAccount.apply(this, arguments);
      }

      function unlinkAccount(_x16, _x17, _x18) {
        return _unlinkAccount.apply(this, arguments);
      }

      function _unlinkAccount() {
        _unlinkAccount = _asyncToGenerator(function* (userId, providerId, providerAccountId) {
          debug('UNLINK_ACCOUNT', userId, providerId, providerAccountId);

          try {
            return prisma[Account].delete({
              where: {
                compoundId: getCompoundId(providerId, providerAccountId)
              }
            });
          } catch (error) {
            _logger.default.error('UNLINK_ACCOUNT_ERROR', error);

            return Promise.reject(new Error('UNLINK_ACCOUNT_ERROR', error));
          }
        });
        return _unlinkAccount.apply(this, arguments);
      }

      function createSession(_x19) {
        return _createSession.apply(this, arguments);
      }

      function _createSession() {
        _createSession = _asyncToGenerator(function* (user) {
          debug('CREATE_SESSION', user);

          try {
            var expires = null;

            if (sessionMaxAge) {
              var dateExpires = new Date();
              dateExpires.setTime(dateExpires.getTime() + sessionMaxAge);
              expires = dateExpires.toISOString();
            }

            return prisma[Session].create({
              data: {
                expires,
                userId: user.id,
                sessionToken: (0, _crypto.randomBytes)(32).toString('hex'),
                accessToken: (0, _crypto.randomBytes)(32).toString('hex')
              }
            });
          } catch (error) {
            _logger.default.error('CREATE_SESSION_ERROR', error);

            return Promise.reject(new Error('CREATE_SESSION_ERROR', error));
          }
        });
        return _createSession.apply(this, arguments);
      }

      function getSession(_x20) {
        return _getSession.apply(this, arguments);
      }

      function _getSession() {
        _getSession = _asyncToGenerator(function* (sessionToken) {
          debug('GET_SESSION', sessionToken);

          try {
            var session = yield prisma[Session].findOne({
              where: {
                sessionToken
              }
            });

            if (session && session.expires && new Date() > session.expires) {
              yield prisma[Session].delete({
                where: {
                  sessionToken
                }
              });
              return null;
            }

            return session;
          } catch (error) {
            _logger.default.error('GET_SESSION_ERROR', error);

            return Promise.reject(new Error('GET_SESSION_ERROR', error));
          }
        });
        return _getSession.apply(this, arguments);
      }

      function updateSession(_x21, _x22) {
        return _updateSession.apply(this, arguments);
      }

      function _updateSession() {
        _updateSession = _asyncToGenerator(function* (session, force) {
          debug('UPDATE_SESSION', session);

          try {
            if (sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.expires) {
              var dateSessionIsDueToBeUpdated = new Date(session.expires);
              dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge);
              dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge);

              if (new Date() > dateSessionIsDueToBeUpdated) {
                var newExpiryDate = new Date();
                newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge);
                session.expires = newExpiryDate;
              } else if (!force) {
                return null;
              }
            } else {
              if (!force) {
                return null;
              }
            }

            var {
              id,
              expires
            } = session;
            return prisma[Session].update({
              where: {
                id
              },
              data: {
                expires
              }
            });
          } catch (error) {
            _logger.default.error('UPDATE_SESSION_ERROR', error);

            return Promise.reject(new Error('UPDATE_SESSION_ERROR', error));
          }
        });
        return _updateSession.apply(this, arguments);
      }

      function deleteSession(_x23) {
        return _deleteSession.apply(this, arguments);
      }

      function _deleteSession() {
        _deleteSession = _asyncToGenerator(function* (sessionToken) {
          debug('DELETE_SESSION', sessionToken);

          try {
            return prisma[Session].delete({
              where: {
                sessionToken
              }
            });
          } catch (error) {
            _logger.default.error('DELETE_SESSION_ERROR', error);

            return Promise.reject(new Error('DELETE_SESSION_ERROR', error));
          }
        });
        return _deleteSession.apply(this, arguments);
      }

      function createVerificationRequest(_x24, _x25, _x26, _x27, _x28) {
        return _createVerificationRequest.apply(this, arguments);
      }

      function _createVerificationRequest() {
        _createVerificationRequest = _asyncToGenerator(function* (identifier, url, token, secret, provider) {
          debug('CREATE_VERIFICATION_REQUEST', identifier);

          try {
            var {
              baseUrl
            } = appOptions;
            var {
              sendVerificationRequest,
              maxAge
            } = provider;
            var hashedToken = (0, _crypto.createHash)('sha256').update("".concat(token).concat(secret)).digest('hex');
            var expires = null;

            if (maxAge) {
              var dateExpires = new Date();
              dateExpires.setTime(dateExpires.getTime() + maxAge * 1000);
              expires = dateExpires.toISOString();
            }

            var verificationRequest = yield prisma[VerificationRequest].create({
              data: {
                identifier,
                token: hashedToken,
                expires
              }
            });
            yield sendVerificationRequest({
              identifier,
              url,
              token,
              baseUrl,
              provider
            });
            return verificationRequest;
          } catch (error) {
            _logger.default.error('CREATE_VERIFICATION_REQUEST_ERROR', error);

            return Promise.reject(new Error('CREATE_VERIFICATION_REQUEST_ERROR', error));
          }
        });
        return _createVerificationRequest.apply(this, arguments);
      }

      function getVerificationRequest(_x29, _x30, _x31, _x32) {
        return _getVerificationRequest.apply(this, arguments);
      }

      function _getVerificationRequest() {
        _getVerificationRequest = _asyncToGenerator(function* (identifier, token, secret, provider) {
          debug('GET_VERIFICATION_REQUEST', identifier, token);

          try {
            var hashedToken = (0, _crypto.createHash)('sha256').update("".concat(token).concat(secret)).digest('hex');
            var verificationRequest = yield prisma[VerificationRequest].findOne({
              where: {
                token: hashedToken
              }
            });

            if (verificationRequest && verificationRequest.expires && new Date() > verificationRequest.expires) {
              yield prisma[VerificationRequest].delete({
                where: {
                  token: hashedToken
                }
              });
              return null;
            }

            return verificationRequest;
          } catch (error) {
            _logger.default.error('GET_VERIFICATION_REQUEST_ERROR', error);

            return Promise.reject(new Error('GET_VERIFICATION_REQUEST_ERROR', error));
          }
        });
        return _getVerificationRequest.apply(this, arguments);
      }

      function deleteVerificationRequest(_x33, _x34, _x35, _x36) {
        return _deleteVerificationRequest.apply(this, arguments);
      }

      function _deleteVerificationRequest() {
        _deleteVerificationRequest = _asyncToGenerator(function* (identifier, token, secret, provider) {
          debug('DELETE_VERIFICATION', identifier, token);

          try {
            var hashedToken = (0, _crypto.createHash)('sha256').update("".concat(token).concat(secret)).digest('hex');
            yield prisma[VerificationRequest].delete({
              where: {
                token: hashedToken
              }
            });
          } catch (error) {
            _logger.default.error('DELETE_VERIFICATION_REQUEST_ERROR', error);

            return Promise.reject(new Error('DELETE_VERIFICATION_REQUEST_ERROR', error));
          }
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