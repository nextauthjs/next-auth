"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateConnectionEntities = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var entitiesChanged = (prevEntities, newEntities) => {
  if (prevEntities.length !== newEntities.length) return true;

  for (var i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true;
  }

  return false;
};

var updateConnectionEntities = function () {
  var _ref = _asyncToGenerator(function* (connection, entities) {
    if (!connection || !entitiesChanged(connection.options.entities, entities)) return;
    connection.options.entities = entities;
    connection.buildMetadatas();

    if (connection.options.synchronize) {
      yield connection.synchronize();
    }
  });

  return function updateConnectionEntities(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateConnectionEntities = updateConnectionEntities;