"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detached = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const path_1 = require("./path");
function detached(expr) {
    return (0, path_1.$expressionify)({
        __element__: expr.__element__,
        __cardinality__: expr.__cardinality__,
        __expr__: expr,
        __kind__: index_1.ExpressionKind.Detached
    });
}
exports.detached = detached;
