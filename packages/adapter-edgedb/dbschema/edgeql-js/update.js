"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const path_1 = require("./path");
const select_1 = require("./select");
const insert_1 = require("./insert");
function update(expr, shape) {
    const cleanScopedExprs = select_1.$existingScopes.size === 0;
    const scope = (0, path_1.$getScopedExpr)(expr, select_1.$existingScopes);
    const resolvedShape = shape(scope);
    if (cleanScopedExprs) {
        select_1.$existingScopes.clear();
    }
    const mods = {};
    let updateShape;
    for (const [key, val] of Object.entries(resolvedShape)) {
        if (key === "filter" || key === "filter_single") {
            mods[key] = val;
        }
        else if (key === "set") {
            updateShape = val;
        }
        else {
            throw new Error(`Invalid update shape key '${key}', only 'filter', ` +
                `and 'set' are allowed`);
        }
    }
    if (!updateShape) {
        throw new Error(`Update shape must contain 'set' shape`);
    }
    const { modifiers, cardinality } = (0, select_1.$handleModifiers)(mods, { root: expr, scope });
    return (0, path_1.$expressionify)({
        __kind__: index_1.ExpressionKind.Update,
        __element__: expr.__element__,
        __cardinality__: cardinality,
        __expr__: expr,
        __shape__: (0, insert_1.$normaliseInsertShape)(expr, updateShape, true),
        __modifiers__: modifiers,
        __scope__: scope
    });
}
exports.update = update;
