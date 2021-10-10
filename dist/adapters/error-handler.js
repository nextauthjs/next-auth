"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = adapterErrorHandler;

var _errors = require("../lib/errors");

function adapterErrorHandler(adapter, logger) {
  return Object.keys(adapter).reduce((acc, method) => {
    const name = capitalize(method);
    const code = upperSnake(name, adapter.displayName);
    const adapterMethod = adapter[method];

    acc[method] = async (...args) => {
      try {
        logger.debug(code, ...args);
        return await adapterMethod(...args);
      } catch (error) {
        logger.error(`${code}_ERROR`, error);
        const e = new _errors.UnknownError(error);
        e.name = `${name}Error`;
        throw e;
      }
    };

    return acc;
  }, {});
}

function capitalize(s) {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
}

function upperSnake(s, prefix = "ADAPTER") {
  return `${prefix}_${s.replace(/([A-Z])/g, "_$1")}`.toUpperCase();
}