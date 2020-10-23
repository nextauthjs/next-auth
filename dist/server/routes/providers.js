"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (req, res, options, done) => {
  var {
    providers
  } = options;
  var result = {};
  Object.entries(providers).map((_ref) => {
    var [provider, providerConfig] = _ref;
    result[provider] = {
      id: provider,
      name: providerConfig.name,
      type: providerConfig.type,
      signinUrl: providerConfig.signinUrl,
      callbackUrl: providerConfig.callbackUrl
    };
  });
  res.setHeader('Content-Type', 'application/json');
  res.json(result);
  return done();
};

exports.default = _default;