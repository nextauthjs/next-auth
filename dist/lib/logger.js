"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var logger = {
  error: function error(errorCode) {
    for (var _len = arguments.length, text = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      text[_key - 1] = arguments[_key];
    }

    if (!console) {
      return;
    }

    if (text && text.length <= 1) {
      text = text[0] || '';
    }

    console.error("[next-auth][error][".concat(errorCode.toLowerCase(), "]"), text, "\nhttps://next-auth.js.org/errors#".concat(errorCode.toLowerCase()));
  },
  warn: function warn(warnCode) {
    for (var _len2 = arguments.length, text = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      text[_key2 - 1] = arguments[_key2];
    }

    if (!console) {
      return;
    }

    if (text && text.length <= 1) {
      text = text[0] || '';
    }

    console.warn("[next-auth][warn][".concat(warnCode.toLowerCase(), "]"), text, "\nhttps://next-auth.js.org/warnings#".concat(warnCode.toLowerCase()));
  },
  debug: function debug(debugCode) {
    for (var _len3 = arguments.length, text = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      text[_key3 - 1] = arguments[_key3];
    }

    if (!console) {
      return;
    }

    if (text && text.length <= 1) {
      text = text[0] || '';
    }

    if (process && process.env && process.env._NEXTAUTH_DEBUG) {
      console.log("[next-auth][debug][".concat(debugCode.toLowerCase(), "]"), text);
    }
  }
};
var _default = logger;
exports.default = _default;