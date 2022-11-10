"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayType = exports.isNamedTupleType = exports.isTupleType = exports.isObjectType = exports.isEnumType = exports.isScalarType = exports.$toSet = void 0;
const index_1 = require("edgedb/dist/reflection/index");
// utility function for creating set
function $toSet(root, card) {
    return {
        __element__: root,
        __cardinality__: card
    };
}
exports.$toSet = $toSet;
function isScalarType(type) {
    return type.__kind__ === index_1.TypeKind.scalar;
}
exports.isScalarType = isScalarType;
function isEnumType(type) {
    return type.__kind__ === index_1.TypeKind.enum;
}
exports.isEnumType = isEnumType;
function isObjectType(type) {
    return type.__kind__ === index_1.TypeKind.object;
}
exports.isObjectType = isObjectType;
function isTupleType(type) {
    return type.__kind__ === index_1.TypeKind.tuple;
}
exports.isTupleType = isTupleType;
function isNamedTupleType(type) {
    return type.__kind__ === index_1.TypeKind.namedtuple;
}
exports.isNamedTupleType = isNamedTupleType;
function isArrayType(type) {
    return type.__kind__ === index_1.TypeKind.array;
}
exports.isArrayType = isArrayType;
