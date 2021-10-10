"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = providers;

function providers(req, res) {
  const {
    providers
  } = req.options;
  const result = providers.reduce((acc, {
    id,
    name,
    type,
    signinUrl,
    callbackUrl
  }) => {
    acc[id] = {
      id,
      name,
      type,
      signinUrl,
      callbackUrl
    };
    return acc;
  }, {});
  res.json(result);
}