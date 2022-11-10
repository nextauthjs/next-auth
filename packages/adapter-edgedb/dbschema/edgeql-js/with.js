"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.with = exports.alias = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const path_1 = require("./path");
function alias(expr) {
    return (0, path_1.$expressionify)({
        __kind__: index_1.ExpressionKind.Alias,
        __element__: expr.__element__,
        __cardinality__: expr.__cardinality__,
        __expr__: expr
    });
}
exports.alias = alias;
function _with(refs, expr) {
    return (0, path_1.$expressionify)({
        __kind__: index_1.ExpressionKind.With,
        __element__: expr.__element__,
        __cardinality__: expr.__cardinality__,
        __refs__: refs,
        __expr__: expr
    });
}
exports.with = _with;
