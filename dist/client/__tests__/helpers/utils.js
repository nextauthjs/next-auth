"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBroadcastEvents = getBroadcastEvents;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _excluded = ["timestamp"];

function getBroadcastEvents() {
  return window.localStorage.setItem.mock.calls.filter(function (call) {
    return call[0] === "nextauth.message";
  }).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
        eventName = _ref2[0],
        value = _ref2[1];

    var _JSON$parse = JSON.parse(value),
        timestamp = _JSON$parse.timestamp,
        rest = (0, _objectWithoutProperties2.default)(_JSON$parse, _excluded);

    return {
      eventName: eventName,
      value: rest
    };
  });
}