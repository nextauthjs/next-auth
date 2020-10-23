"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var set = function set(res, name, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  var setCookieHeader = res.getHeader('Set-Cookie') || [];

  if (!Array.isArray(setCookieHeader)) {
    setCookieHeader = [setCookieHeader];
  }

  setCookieHeader.push(_serialize(name, String(stringValue), options));
  res.setHeader('Set-Cookie', setCookieHeader);
};

function _serialize(name, val, options) {
  var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  var opt = options || {};
  var enc = opt.encode || encodeURIComponent;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (opt.maxAge != null) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid');
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  } else {
    str += '; Path=/';
  }

  if (opt.expires) {
    var expires = opt.expires;

    if (typeof opt.expires.toUTCString === 'function') {
      expires = opt.expires.toUTCString();
    } else {
      var dateExpires = new Date(opt.expires);
      expires = dateExpires.toUTCString();
    }

    str += '; Expires=' + expires;
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;

      case 'lax':
        str += '; SameSite=Lax';
        break;

      case 'strict':
        str += '; SameSite=Strict';
        break;

      case 'none':
        str += '; SameSite=None';
        break;

      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

var _default = {
  set
};
exports.default = _default;