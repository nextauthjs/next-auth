"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = csrfTokenHandler;

var _crypto = require("crypto");

var cookie = _interopRequireWildcard(require("./cookie"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function csrfTokenHandler(req, res) {
  const {
    cookies,
    secret
  } = req.options;

  if (cookies.csrfToken.name in req.cookies) {
    const [csrfToken, csrfTokenHash] = req.cookies[cookies.csrfToken.name].split('|');
    const expectedCsrfTokenHash = (0, _crypto.createHash)('sha256').update(`${csrfToken}${secret}`).digest('hex');

    if (csrfTokenHash === expectedCsrfTokenHash) {
      const csrfTokenVerified = req.method === 'POST' && csrfToken === req.body.csrfToken;
      req.options.csrfToken = csrfToken;
      req.options.csrfTokenVerified = csrfTokenVerified;
      return;
    }
  }

  const csrfToken = (0, _crypto.randomBytes)(32).toString('hex');
  const csrfTokenHash = (0, _crypto.createHash)('sha256').update(`${csrfToken}${secret}`).digest('hex');
  const csrfTokenCookie = `${csrfToken}|${csrfTokenHash}`;
  cookie.set(res, cookies.csrfToken.name, csrfTokenCookie, cookies.csrfToken.options);
  req.options.csrfToken = csrfToken;
}