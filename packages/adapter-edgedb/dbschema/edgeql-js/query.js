"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$queryFuncJSON = exports.$queryFunc = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const json_1 = require("./json");
const select_1 = require("./select");
const runnableExpressionKinds = new Set([
    index_1.ExpressionKind.Select,
    index_1.ExpressionKind.Update,
    index_1.ExpressionKind.Insert,
    index_1.ExpressionKind.InsertUnlessConflict,
    index_1.ExpressionKind.Delete,
    index_1.ExpressionKind.Group,
    index_1.ExpressionKind.For,
    index_1.ExpressionKind.With,
    index_1.ExpressionKind.WithParams
]);
const wrappedExprCache = new WeakMap();
async function $queryFunc(cxn, args) {
    var _a;
    const expr = runnableExpressionKinds.has(this.__kind__)
        ? this
        : (_a = wrappedExprCache.get(this)) !== null && _a !== void 0 ? _a : wrappedExprCache.set(this, (0, select_1.select)(this)).get(this);
    const _args = (0, json_1.jsonifyComplexParams)(expr, args);
    const query = expr.toEdgeQL();
    if (expr.__cardinality__ === index_1.Cardinality.One ||
        expr.__cardinality__ === index_1.Cardinality.AtMostOne ||
        expr.__cardinality__ === index_1.Cardinality.Empty) {
        return cxn.querySingle(query, _args);
    }
    else {
        return cxn.query(query, _args);
    }
}
exports.$queryFunc = $queryFunc;
async function $queryFuncJSON(cxn, args) {
    var _a;
    const expr = runnableExpressionKinds.has(this.__kind__)
        ? this
        : (_a = wrappedExprCache.get(this)) !== null && _a !== void 0 ? _a : wrappedExprCache.set(this, (0, select_1.select)(this)).get(this);
    const _args = (0, json_1.jsonifyComplexParams)(expr, args);
    if (expr.__cardinality__ === index_1.Cardinality.One ||
        expr.__cardinality__ === index_1.Cardinality.AtMostOne) {
        return cxn.querySingleJSON(expr.toEdgeQL(), _args);
    }
    else {
        return cxn.queryJSON(expr.toEdgeQL(), _args);
    }
}
exports.$queryFuncJSON = $queryFuncJSON;
