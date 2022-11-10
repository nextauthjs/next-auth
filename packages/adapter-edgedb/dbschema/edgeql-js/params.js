"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = exports.optional = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const path_1 = require("./path");
function optional(type) {
    return {
        __kind__: index_1.ExpressionKind.OptionalParam,
        __type__: type
    };
}
exports.optional = optional;
const complexParamKinds = new Set([index_1.TypeKind.tuple, index_1.TypeKind.namedtuple]);
function params(paramsDef, expr) {
    const paramExprs = {};
    for (const [key, param] of Object.entries(paramsDef)) {
        const paramType = param.__kind__ === index_1.ExpressionKind.OptionalParam ? param.__type__ : param;
        const isComplex = complexParamKinds.has(paramType.__kind__) ||
            (paramType.__kind__ === index_1.TypeKind.array &&
                complexParamKinds.has(paramType.__element__.__kind__));
        paramExprs[key] = (0, path_1.$expressionify)({
            __kind__: index_1.ExpressionKind.Param,
            __element__: paramType,
            __cardinality__: param.__kind__ === index_1.ExpressionKind.OptionalParam
                ? index_1.Cardinality.AtMostOne
                : index_1.Cardinality.One,
            __name__: key,
            __isComplex__: isComplex
        });
    }
    const returnExpr = expr(paramExprs);
    return (0, path_1.$expressionify)({
        __kind__: index_1.ExpressionKind.WithParams,
        __element__: returnExpr.__element__,
        __cardinality__: returnExpr.__cardinality__,
        __expr__: returnExpr,
        __params__: Object.values(paramExprs)
    });
}
exports.params = params;
