"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = callbackUrlHandler;

var cookie = _interopRequireWildcard(require("../lib/cookie"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function callbackUrlHandler(req, res) {
  const {
    query
  } = req;
  const {
    body
  } = req;
  const {
    cookies,
    baseUrl,
    defaultCallbackUrl,
    callbacks
  } = req.options;
  let callbackUrl = defaultCallbackUrl || baseUrl;
  const callbackUrlParamValue = body.callbackUrl || query.callbackUrl || null;
  const callbackUrlCookieValue = req.cookies[cookies.callbackUrl.name] || null;

  if (callbackUrlParamValue) {
    callbackUrl = await callbacks.redirect(callbackUrlParamValue, baseUrl);
  } else if (callbackUrlCookieValue) {
    callbackUrl = await callbacks.redirect(callbackUrlCookieValue, baseUrl);
  }

  if (callbackUrl && callbackUrl !== callbackUrlCookieValue) {
    cookie.set(res, cookies.callbackUrl.name, callbackUrl, cookies.callbackUrl.options);
  }

  req.options.callbackUrl = callbackUrl;
}