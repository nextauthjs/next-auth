"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGlobal = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const path_1 = require("./path");
function makeGlobal(name, type, card) {
    return (0, path_1.$expressionify)({
        __name__: name,
        __element__: type,
        __cardinality__: card,
        __kind__: index_1.ExpressionKind.Global
    });
}
exports.makeGlobal = makeGlobal;
