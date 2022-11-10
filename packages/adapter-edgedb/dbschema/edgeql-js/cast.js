"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cast = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const path_1 = require("./path");
const castMaps_1 = require("./castMaps");
function cast(target, expr) {
    const cleanedExpr = expr === null ? null : (0, castMaps_1.literalToTypeSet)(expr);
    return (0, path_1.$expressionify)({
        __element__: target,
        __cardinality__: cleanedExpr === null ? index_1.Cardinality.Empty : cleanedExpr.__cardinality__,
        __expr__: cleanedExpr,
        __kind__: index_1.ExpressionKind.Cast
    });
}
exports.cast = cast;
