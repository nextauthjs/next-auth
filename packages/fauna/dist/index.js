"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Adapter = Adapter;

var _faunadb = require("faunadb");

var _crypto = require("crypto");

function Adapter(config, options = {}) {
  const {
    faunaClient,
    collections = {
      User: "users",
      Account: "accounts",
      Session: "sessions",
      VerificationRequest: "verification_requests"
    },
    indexes = {
      Account: "account_by_provider_account_id",
      User: "user_by_email",
      Session: "session_by_token",
      VerificationRequest: "verification_request_by_token_and_identifier"
    }
  } = config;
  return {
    async getAdapter({
      session,
      secret,
      ...appOptions
    }) {
      const sessionMaxAge = session.maxAge * 1000;
      const sessionUpdateAge = session.updateAge * 1000;

      const hashToken = token => (0, _crypto.createHash)("sha256").update(`${token}${secret}`).digest("hex");

      return {
        displayName: "FAUNA",

        async createUser(profile) {
          const newUser = await faunaClient.query(_faunadb.query.Create(_faunadb.query.Collection(collections.User), {
            data: {
              name: profile.name,
              email: profile.email,
              image: profile.image,
              emailVerified: profile.emailVerified ? _faunadb.query.Time(profile.emailVerified.toISOString()) : null,
              username: profile.username,
              createdAt: _faunadb.query.Now(),
              updatedAt: _faunadb.query.Now()
            }
          }));
          newUser.data.id = newUser.ref.id;
          return newUser.data;
        },

        async getUser(id) {
          const user = await faunaClient.query(_faunadb.query.Get(_faunadb.query.Ref(_faunadb.query.Collection(collections.User), id)));
          user.data.id = user.ref.id;
          return user.data;
        },

        async getUserByEmail(email) {
          if (!email) {
            return null;
          }

          const user = await faunaClient.query(_faunadb.query.Let({
            ref: _faunadb.query.Match(_faunadb.query.Index(indexes.User), email)
          }, _faunadb.query.If(_faunadb.query.Exists(_faunadb.query.Var("ref")), _faunadb.query.Get(_faunadb.query.Var("ref")), null)));

          if (user == null) {
            return null;
          }

          user.data.id = user.ref.id;
          return user.data;
        },

        async getUserByProviderAccountId(providerId, providerAccountId) {
          const response = await faunaClient.query(_faunadb.query.Let({
            ref: _faunadb.query.Match(_faunadb.query.Index(indexes.Account), [providerId, providerAccountId])
          }, _faunadb.query.If(_faunadb.query.Exists(_faunadb.query.Var("ref")), _faunadb.query.Get(_faunadb.query.Ref(_faunadb.query.Collection(collections.User), _faunadb.query.Select(["data", "userId"], _faunadb.query.Get(_faunadb.query.Var("ref"))))), null)));

          if (!response) {
            return null;
          }

          const user = response.data;
          user.id = response.ref.id;
          user.createdAt = new Date(user.createdAt.value);
          user.updatedAt = new Date(user.updatedAt.value);
          return user;
        },

        async updateUser(user) {
          const newUser = await faunaClient.query(_faunadb.query.Update(_faunadb.query.Ref(_faunadb.query.Collection(collections.User), user.id), {
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: user.emailVerified ? _faunadb.query.Time(user.emailVerified.toISOString()) : null,
              username: user.username,
              updatedAt: _faunadb.query.Now()
            }
          }));
          newUser.data.id = newUser.ref.id;
          return newUser.data;
        },

        async deleteUser(userId) {
          await faunaClient.query(_faunadb.query.Delete(_faunadb.query.Ref(_faunadb.query.Collection(collections.User), userId)));
        },

        async linkAccount(userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
          const account = await faunaClient.query(_faunadb.query.Create(_faunadb.query.Collection(collections.Account), {
            data: {
              userId: userId,
              providerId: providerId,
              providerType: providerType,
              providerAccountId: providerAccountId,
              refreshToken: refreshToken,
              accessToken: accessToken,
              accessTokenExpires: accessTokenExpires,
              createdAt: _faunadb.query.Now(),
              updatedAt: _faunadb.query.Now()
            }
          }));
          return account.data;
        },

        async unlinkAccount(userId, providerId, providerAccountId) {
          await faunaClient.query(_faunadb.query.Delete(_faunadb.query.Select("ref", _faunadb.query.Get(_faunadb.query.Match(_faunadb.query.Index(indexes.Account), [providerId, providerAccountId])))));
        },

        async createSession(user) {
          let expires = null;

          if (sessionMaxAge) {
            const dateExpires = new Date();
            dateExpires.setTime(dateExpires.getTime() + sessionMaxAge);
            expires = dateExpires.toISOString();
          }

          const session = await faunaClient.query(_faunadb.query.Create(_faunadb.query.Collection(collections.Session), {
            data: {
              userId: user.id,
              expires: _faunadb.query.Time(expires),
              sessionToken: (0, _crypto.randomBytes)(32).toString("hex"),
              accessToken: (0, _crypto.randomBytes)(32).toString("hex"),
              createdAt: _faunadb.query.Now(),
              updatedAt: _faunadb.query.Now()
            }
          }));
          session.data.id = session.ref.id;
          session.data.expires = new Date(session.data.expires.value);
          return session.data;
        },

        async getSession(sessionToken) {
          const {
            data,
            ref
          } = await faunaClient.query(_faunadb.query.Get(_faunadb.query.Match(_faunadb.query.Index(indexes.Session), sessionToken)));
          const session = data;
          session.id = ref.id;
          session.expires = new Date(session.expires.value);

          if (session !== null && session !== void 0 && session.expires && new Date() > session.expires) {
            await faunaClient.query(_faunadb.query.Delete(_faunadb.query.Ref(_faunadb.query.Collection(collections.Session), ref.id)));
            return null;
          }

          return session;
        },

        async updateSession(session, force) {
          const shouldUpdate = sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.expires;

          if (!shouldUpdate && !force) {
            return null;
          }

          const dateSessionIsDueToBeUpdated = new Date(session.expires);
          dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge);
          dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge);
          const currentDate = new Date();

          if (currentDate < dateSessionIsDueToBeUpdated && !force) {
            return null;
          }

          const newExpiryDate = new Date();
          newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge);
          const updatedSession = await faunaClient.query(_faunadb.query.Update(_faunadb.query.Ref(_faunadb.query.Collection(collections.Session), session.id), {
            data: {
              expires: _faunadb.query.Time(newExpiryDate.toISOString()),
              updatedAt: _faunadb.query.Time(new Date().toISOString())
            }
          }));
          updatedSession.data.id = updatedSession.ref.id;
          return updatedSession.data;
        },

        async deleteSession(sessionToken) {
          return await faunaClient.query(_faunadb.query.Delete(_faunadb.query.Select("ref", _faunadb.query.Get(_faunadb.query.Match(_faunadb.query.Index(indexes.Session), sessionToken)))));
        },

        async createVerificationRequest(identifier, url, token, _, provider) {
          const {
            baseUrl
          } = appOptions;
          const {
            sendVerificationRequest,
            maxAge
          } = provider;
          let expires = null;

          if (maxAge) {
            const dateExpires = new Date();
            dateExpires.setTime(dateExpires.getTime() + maxAge * 1000);
            expires = dateExpires.toISOString();
          }

          const verificationRequest = await faunaClient.query(_faunadb.query.Create(_faunadb.query.Collection(collections.VerificationRequest), {
            data: {
              identifier: identifier,
              token: hashToken(token),
              expires: expires === null ? null : _faunadb.query.Time(expires),
              createdAt: _faunadb.query.Now(),
              updatedAt: _faunadb.query.Now()
            }
          }));
          await sendVerificationRequest({
            identifier,
            url,
            token,
            baseUrl,
            provider
          });
          return verificationRequest.data;
        },

        async getVerificationRequest(identifier, token) {
          const {
            ref,
            request: verificationRequest
          } = await faunaClient.query(_faunadb.query.Let({
            ref: _faunadb.query.Match(_faunadb.query.Index(indexes.VerificationRequest), [hashToken(token), identifier])
          }, _faunadb.query.If(_faunadb.query.Exists(_faunadb.query.Var("ref")), {
            ref: _faunadb.query.Var("ref"),
            request: _faunadb.query.Select("data", _faunadb.query.Get(_faunadb.query.Var("ref")))
          }, null)));

          if (verificationRequest !== null && verificationRequest !== void 0 && verificationRequest.expires && new Date(verificationRequest.expires.value) < new Date()) {
            await faunaClient.query(_faunadb.query.Delete(ref));
            return null;
          }

          return { ...verificationRequest,
            expires: new Date(verificationRequest.expires.value),
            createdAt: new Date(verificationRequest.createdAt.value),
            updatedAt: new Date(verificationRequest.updatedAt.value)
          };
        },

        async deleteVerificationRequest(identifier, token) {
          await faunaClient.query(_faunadb.query.Delete(_faunadb.query.Select("ref", _faunadb.query.Get(_faunadb.query.Match(_faunadb.query.Index(indexes.VerificationRequest), [hashToken(token), identifier])))));
        }

      };
    }

  };
}