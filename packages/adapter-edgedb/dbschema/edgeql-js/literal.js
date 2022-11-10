"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$getTypeByName = exports.$getType = exports.$nameMapping = exports.literal = void 0;
// import {
//   Cardinality,
//   ExpressionKind,
//   BaseType,
//   BaseTypeToTsType,
//   makeType,
//   ScalarType
// } from "edgedb/dist/reflection/index";
// import type {$expr_Literal} from "./literal";
const path_1 = require("./path");
const __spec__1 = require("./__spec__");
const index_1 = require("edgedb/dist/reflection/index");
const hydrate_1 = require("./hydrate");
function literal(type, value) {
    return (0, path_1.$expressionify)({
        __element__: type,
        __cardinality__: index_1.Cardinality.One,
        __kind__: index_1.ExpressionKind.Literal,
        __value__: value
    });
}
exports.literal = literal;
exports.$nameMapping = new Map([
    ...[...__spec__1.spec.values()].map(type => [type.name, type.id]),
    ["std::number", "00000000-0000-0000-0000-0000000001ff"]
]);
function $getType(id) {
    return (0, hydrate_1.makeType)(__spec__1.spec, id, literal);
}
exports.$getType = $getType;
function $getTypeByName(name) {
    return (0, hydrate_1.makeType)(__spec__1.spec, exports.$nameMapping.get(name), literal);
}
exports.$getTypeByName = $getTypeByName;
