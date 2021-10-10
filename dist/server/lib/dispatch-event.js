"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dispatchEvent;

var _logger = _interopRequireDefault(require("../../lib/logger"));

async function dispatchEvent(event, message) {
  try {
    await event(message);
  } catch (e) {
    _logger.default.error('EVENT_ERROR', e);
  }
}