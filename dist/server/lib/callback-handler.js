"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = callbackHandler;

var _errors = require("../../lib/errors");

var _dispatchEvent2 = _interopRequireDefault(require("../lib/dispatch-event"));

var _errorHandler = _interopRequireDefault(require("../../adapters/error-handler"));

async function callbackHandler(sessionToken, profile, providerAccount, options) {
  if (!profile) throw new Error("Missing profile");
  if (!(providerAccount !== null && providerAccount !== void 0 && providerAccount.id) || !providerAccount.type) throw new Error("Missing or invalid provider account");
  if (!["email", "oauth"].includes(providerAccount.type)) throw new Error("Provider not supported");
  const {
    adapter,
    jwt,
    events,
    session: {
      jwt: useJwtSession
    }
  } = options;

  if (!adapter) {
    return {
      user: profile,
      account: providerAccount,
      session: {}
    };
  }

  const {
    createUser,
    updateUser,
    getUser,
    getUserByProviderAccountId,
    getUserByEmail,
    linkAccount,
    createSession,
    getSession,
    deleteSession
  } = (0, _errorHandler.default)(await adapter.getAdapter(options), options.logger);
  let session = null;
  let user = null;
  let isSignedIn = null;
  let isNewUser = false;

  if (sessionToken) {
    var _session2;

    if (useJwtSession) {
      try {
        var _session;

        session = await jwt.decode({ ...jwt,
          token: sessionToken
        });

        if ((_session = session) !== null && _session !== void 0 && _session.sub) {
          user = await getUser(session.sub);
          isSignedIn = !!user;
        }
      } catch (_unused) {}
    }

    session = await getSession(sessionToken);

    if ((_session2 = session) !== null && _session2 !== void 0 && _session2.userId) {
      user = await getUser(session.userId);
      isSignedIn = !!user;
    }
  }

  if (providerAccount.type === "email") {
    const userByEmail = profile.email ? await getUserByEmail(profile.email) : null;

    if (userByEmail) {
      if (isSignedIn) {
        if (user.id !== userByEmail.id && !useJwtSession) {
          await deleteSession(sessionToken);
        }
      }

      const currentDate = new Date();
      user = await updateUser({ ...userByEmail,
        emailVerified: currentDate
      });
      await (0, _dispatchEvent2.default)(events.updateUser, user);
    } else {
      const currentDate = new Date();
      user = await createUser({ ...profile,
        emailVerified: currentDate
      });
      await (0, _dispatchEvent2.default)(events.createUser, user);
      isNewUser = true;
    }

    session = useJwtSession ? {} : await createSession(user);
    return {
      session,
      user,
      isNewUser
    };
  } else if (providerAccount.type === "oauth") {
    const userByProviderAccountId = await getUserByProviderAccountId(providerAccount.provider, providerAccount.id);

    if (userByProviderAccountId) {
      if (isSignedIn) {
        if (`${userByProviderAccountId.id}` === `${user.id}`) {
          return {
            session,
            user,
            isNewUser
          };
        }

        throw new _errors.AccountNotLinkedError();
      }

      session = useJwtSession ? {} : await createSession(userByProviderAccountId);
      return {
        session,
        user: userByProviderAccountId,
        isNewUser
      };
    } else {
      if (isSignedIn) {
        await linkAccount(user.id, providerAccount.provider, providerAccount.type, providerAccount.id, providerAccount.refreshToken, providerAccount.accessToken, providerAccount.accessTokenExpires);
        await (0, _dispatchEvent2.default)(events.linkAccount, {
          user,
          providerAccount: providerAccount
        });
        return {
          session,
          user,
          isNewUser
        };
      }

      const userByEmail = profile.email ? await getUserByEmail(profile.email) : null;

      if (userByEmail) {
        user = userByEmail;
      } else {
        user = await createUser(profile);
        await (0, _dispatchEvent.default)(events.createUser, user);
      }

      await linkAccount(user.id, providerAccount.provider, providerAccount.type, providerAccount.id, providerAccount.refreshToken, providerAccount.accessToken, providerAccount.accessTokenExpires);
      await (0, _dispatchEvent2.default)(events.linkAccount, {
        user,
        providerAccount: providerAccount
      });
      session = useJwtSession ? {} : await createSession(user);
      isNewUser = true;
      return {
        session,
        user,
        isNewUser
      };
    }
  }
}