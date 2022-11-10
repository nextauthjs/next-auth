"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = exports.isGroupingSet = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const hydrate_1 = require("./hydrate");
const path_1 = require("./path");
const __spec__1 = require("./__spec__");
const literal_1 = require("./literal");
const select_1 = require("./select");
function isGroupingSet(arg) {
    return arg.__kind__ === "groupingset";
}
exports.isGroupingSet = isGroupingSet;
// result is partial to prevent "X is specified more than once" errors
// the return type is a lie, this function returns a grouping set
// but it pretends to return a SimpleGroupElements
// to make the static computatation of `key` easier
const makeGroupingSet = (prefix) => (grps) => {
    const seenKeys = new Map();
    const unfiltered = Object.entries(grps).flatMap(([k, grp]) => isGroupingSet(grp)
        ? grp.__exprs__
        : [[k, grp]]);
    const filtered = unfiltered.filter(([k, expr]) => {
        if (!seenKeys.has(k)) {
            seenKeys.set(k, expr);
            return true;
        }
        if (expr !== seenKeys.get(k)) {
            throw new Error(`Cannot override pre-existing expression with key "${k}"`);
        }
        return false;
    });
    return {
        [`${Math.round(1000000 * Math.random())}___`]: {
            __kind__: "groupingset",
            __settype__: prefix,
            __elements__: grps,
            __exprs__: filtered
        }
    };
};
const set = makeGroupingSet("set");
const tuple = makeGroupingSet("tuple");
const rollup = makeGroupingSet("rollup");
const cube = makeGroupingSet("cube");
const setFuncs = { set, tuple, rollup, cube };
const groupFunc = (expr, getter) => {
    const { shape, scope, modifiers } = resolveShape(getter, expr);
    // const scope = $getScopedExpr(expr as any);
    // const rawGroupings = getter(scope);
    const groupSet = tuple(modifiers.by);
    // only one key in object returned from makeGroupingSet
    const key = Object.keys(groupSet)[0];
    const grouping = groupSet[key];
    const keyShape = {};
    const keyPointers = {};
    const keyShapeElement = {};
    for (const [k, e] of grouping.__exprs__) {
        keyShape[k] = (0, path_1.$expressionify)({
            __element__: e.__element__,
            __cardinality__: index_1.Cardinality.AtMostOne
        });
        keyPointers[k] = {
            __kind__: "property",
            target: e.__element__,
            cardinality: index_1.Cardinality.AtMostOne,
            exclusive: false,
            computed: false,
            readonly: false,
            hasDefault: false
        };
        keyShapeElement[k] = true;
    }
    const $FreeObject = (0, hydrate_1.makeType)(__spec__1.spec, [...__spec__1.spec.values()].find(s => s.name === "std::FreeObject").id, literal_1.literal);
    const str = (0, hydrate_1.makeType)(__spec__1.spec, [...__spec__1.spec.values()].find(s => s.name === "std::str").id, literal_1.literal);
    return (0, path_1.$expressionify)({
        __element__: {
            ...$FreeObject,
            __name__: "std::FreeObject",
            __pointers__: {
                ...$FreeObject.__pointers__,
                __name__: "std::FreeObject",
                grouping: {
                    __kind__: "property",
                    target: str,
                    cardinality: index_1.Cardinality.Many,
                    exclusive: false,
                    computed: false,
                    readonly: false,
                    hasDefault: false
                },
                key: {
                    __kind__: "link",
                    target: {
                        ...$FreeObject,
                        __name__: "std::FreeObject",
                        __pointers__: {
                            ...$FreeObject.__pointers__,
                            ...keyPointers
                        },
                        __shape__: keyShape
                    },
                    properties: {},
                    cardinality: index_1.Cardinality.One,
                    exclusive: false,
                    computed: false,
                    readonly: false,
                    hasDefault: false
                },
                elements: {
                    __kind__: "link",
                    target: expr.__element__,
                    cardinality: index_1.Cardinality.Many,
                    properties: {},
                    exclusive: false,
                    computed: false,
                    readonly: false,
                    hasDefault: false
                }
            },
            __shape__: {
                grouping: (0, path_1.$expressionify)({
                    __element__: str,
                    __cardinality__: index_1.Cardinality.Many
                }),
                key: (0, path_1.$expressionify)({
                    __element__: {
                        ...$FreeObject,
                        __shape__: keyShape
                    },
                    __cardinality__: index_1.Cardinality.One
                }),
                elements: (0, path_1.$expressionify)({
                    __element__: { ...expr.__element__, __shape__: shape },
                    __cardinality__: index_1.Cardinality.Many
                })
            }
        },
        __cardinality__: index_1.Cardinality.Many,
        __expr__: expr,
        __modifiers__: { by: grouping },
        __kind__: index_1.ExpressionKind.Group,
        __scope__: scope
    });
};
Object.assign(groupFunc, setFuncs);
function resolveShape(shapeGetter, expr) {
    const modifiers = {};
    const shape = {};
    // get scoped object if expression is objecttypeset
    const scope = (0, path_1.$getScopedExpr)(expr);
    // execute getter with scope
    const selectShape = typeof shapeGetter === "function" ? shapeGetter(scope) : shapeGetter;
    for (const [key, value] of Object.entries(selectShape)) {
        // handle modifier keys
        if (key === "by") {
            modifiers[key] = value;
        }
        else {
            // for scalar expressions, scope === expr
            // shape keys are not allowed
            if (expr.__element__.__kind__ !== index_1.TypeKind.object) {
                throw new Error(`Invalid select shape key '${key}' on scalar expression, ` +
                    `only modifiers are allowed (filter, order_by, offset and limit)`);
            }
            shape[key] = (0, select_1.resolveShapeElement)(key, value, scope);
        }
    }
    if (Object.keys(shape).length === 0) {
        shape.id = true;
    }
    if (!modifiers.by) {
        throw new Error("Must provide a `by` key in `e.group`");
    }
    return { shape, modifiers, scope };
}
exports.group = groupFunc;
