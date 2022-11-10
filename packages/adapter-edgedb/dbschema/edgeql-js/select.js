"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveShapeElement = exports.select = exports.shape = exports.$existingScopes = exports.$selectify = exports.delete = exports.$handleModifiers = exports.is = exports.EMPTY_LAST = exports.EMPTY_FIRST = exports.DESC = exports.ASC = void 0;
const edgedb_1 = require("edgedb");
const index_1 = require("edgedb/dist/reflection/index");
const hydrate_1 = require("./hydrate");
const cardinality_1 = require("./cardinality");
const path_1 = require("./path");
const literal_1 = require("./literal");
const __spec__1 = require("./__spec__");
const castMaps_1 = require("./castMaps");
exports.ASC = "ASC";
exports.DESC = "DESC";
exports.EMPTY_FIRST = "EMPTY FIRST";
exports.EMPTY_LAST = "EMPTY LAST";
function is(expr, shape) {
    const mappedShape = {};
    for (const [key, value] of Object.entries(shape)) {
        mappedShape[key] = {
            __kind__: index_1.ExpressionKind.PolyShapeElement,
            __polyType__: expr,
            __shapeElement__: value
        };
    }
    return mappedShape;
}
exports.is = is;
// function computeFilterCardinality(
//   expr: SelectFilterExpression,
//   cardinality: Cardinality,
//   base: TypeSet
// ) {
//   let card = cardinality;
//   const filter: any = expr;
//   // Base is ObjectExpression
//   const baseIsObjectExpr = base?.__element__?.__kind__ === TypeKind.object;
//   const filterExprIsEq =
//     filter.__kind__ === ExpressionKind.Operator && filter.__name__ === "=";
//   const arg0: $expr_PathLeaf | $expr_PathNode = filter?.__args__?.[0];
//   const arg1: TypeSet = filter?.__args__?.[1];
//   const argsExist = !!arg0 && !!arg1 && !!arg1.__cardinality__;
//   const arg0IsUnique = arg0?.__exclusive__ === true;
//   if (baseIsObjectExpr && filterExprIsEq && argsExist && arg0IsUnique) {
//     const newCard =
//       arg1.__cardinality__ === Cardinality.One ||
//       arg1.__cardinality__ === Cardinality.AtMostOne
//         ? Cardinality.AtMostOne
//         : arg1.__cardinality__ === Cardinality.Empty
//         ? Cardinality.Empty
//         : cardinality;
//     if (arg0.__kind__ === ExpressionKind.PathLeaf) {
//       const arg0ParentMatchesBase =
//         arg0.__parent__.type.__element__.__name__ ===
//         base.__element__.__name__;
//       if (arg0ParentMatchesBase) {
//         card = newCard;
//       }
//     } else if (arg0.__kind__ === ExpressionKind.PathNode) {
//       // if Filter.args[0] is PathNode:
//       //   Filter.args[0] is __exclusive__ &
//       //   if Filter.args[0].parent === null
//       //     Filter.args[0].__element__ === Base.__element__
//       //     Filter.args[1].__cardinality__ is AtMostOne or One
//       //   else
//       //     Filter.args[0].type.__element__ === Base.__element__ &
//       //     Filter.args[1].__cardinality__ is AtMostOne or One
//       const parent = arg0.__parent__;
//       if (parent === null) {
//         const arg0MatchesBase =
//           arg0.__element__.__name__ === base.__element__.__name__;
//         if (arg0MatchesBase) {
//           card = newCard;
//         }
//       } else {
//         const arg0ParentMatchesBase =
//           parent?.type.__element__.__name__ === base.__element__.__name__;
//         if (arg0ParentMatchesBase) {
//           card = newCard;
//         }
//       }
//     }
//   }
//   return card;
// }
function $handleModifiers(modifiers, params) {
    const { root, scope } = params;
    const mods = {
        singleton: !!modifiers["filter_single"]
    };
    let card = root.__cardinality__;
    if (modifiers.filter) {
        mods.filter = modifiers.filter;
        // card = computeFilterCardinality(mods.filter, card, rootExpr);
    }
    if (modifiers.filter_single) {
        if (root.__element__.__kind__ !== index_1.TypeKind.object) {
            throw new Error("filter_single can only be used with object types");
        }
        card = index_1.Cardinality.AtMostOne;
        // mods.filter = modifiers.filter_single;
        const fs = modifiers.filter_single;
        if (fs.__element__) {
            mods.filter = modifiers.filter_single;
        }
        else {
            const exprs = Object.keys(fs).map(key => {
                const val = fs[key].__element__
                    ? fs[key]
                    : literal_1.literal(root.__element__["__pointers__"][key]["target"], fs[key]);
                return (0, path_1.$expressionify)({
                    __element__: {
                        __name__: "std::bool",
                        __kind__: index_1.TypeKind.scalar
                    },
                    __cardinality__: index_1.Cardinality.One,
                    __kind__: index_1.ExpressionKind.Operator,
                    __opkind__: index_1.OperatorKind.Infix,
                    __name__: "=",
                    __args__: [scope[key], val]
                });
            });
            if (exprs.length === 1) {
                mods.filter = exprs[0];
            }
            else {
                mods.filter = exprs.reduce((a, b) => {
                    return (0, path_1.$expressionify)({
                        __element__: {
                            __name__: "std::bool",
                            __kind__: index_1.TypeKind.scalar
                        },
                        __cardinality__: index_1.Cardinality.One,
                        __kind__: index_1.ExpressionKind.Operator,
                        __opkind__: index_1.OperatorKind.Infix,
                        __name__: "and",
                        __args__: [a, b]
                    });
                });
            }
        }
    }
    if (modifiers.order_by) {
        const orderExprs = Array.isArray(modifiers.order_by)
            ? modifiers.order_by
            : [modifiers.order_by];
        mods.order_by = orderExprs.map(expr => typeof expr.__element__ === "undefined"
            ? expr
            : { expression: expr });
    }
    if (modifiers.offset) {
        mods.offset =
            typeof modifiers.offset === "number"
                ? (0, literal_1.$getTypeByName)("std::number")(modifiers.offset)
                : modifiers.offset;
        card = cardinality_1.cardutil.overrideLowerBound(card, "Zero");
    }
    if (modifiers.limit) {
        let expr;
        if (typeof modifiers.limit === "number") {
            expr = (0, literal_1.$getTypeByName)("std::number")(modifiers.limit);
        }
        else if (modifiers.limit.__kind__ === index_1.ExpressionKind.Set) {
            expr = modifiers.limit.__exprs__[0];
        }
        else {
            throw new Error("Invalid value for `limit` modifier");
        }
        mods.limit = expr;
        card = cardinality_1.cardutil.overrideLowerBound(card, "Zero");
    }
    return { modifiers: mods, cardinality: card };
}
exports.$handleModifiers = $handleModifiers;
function deleteExpr(expr, modifiersGetter) {
    const selectExpr = select(expr, modifiersGetter);
    return (0, path_1.$expressionify)({
        __kind__: index_1.ExpressionKind.Delete,
        __element__: selectExpr.__element__,
        __cardinality__: selectExpr.__cardinality__,
        __expr__: selectExpr
    });
}
exports.delete = deleteExpr;
// Modifier methods removed for now, until we can fix typescript inference
// problems / excessively deep errors
// function resolveModifierGetter(parent: any, modGetter: any) {
//   if (typeof modGetter === "function" && !modGetter.__kind__) {
//     if (parent.__expr__.__element__.__kind__ === TypeKind.object) {
//       const shape = parent.__element__.__shape__;
//       const _scope =
//         parent.__scope__ ?? $getScopedExpr(parent.__expr__,
//           $existingScopes);
//       const scope = new Proxy(_scope, {
//         get(target: any, prop: string) {
//           if (shape[prop] && shape[prop] !== true) {
//             return shape[prop];
//           }
//           return target[prop];
//         },
//       });
//       return {
//         scope: _scope,
//         modExpr: modGetter(scope),
//       };
//     } else {
//       return {
//         scope: undefined,
//         modExpr: modGetter(parent.__expr__),
//       };
//     }
//   } else {
//     return {scope: parent.__scope__, modExpr: modGetter};
//   }
// }
// function updateModifier(
//   parent: any,
//   modName: "filter" | "order_by" | "offset" | "limit",
//   modGetter: any
// ) {
//   const modifiers = {
//     ...parent.__modifiers__,
//   };
//   const cardinality = parent.__cardinality__;
//   const {modExpr, scope} = resolveModifierGetter(parent, modGetter);
//   switch (modName) {
//     case "filter":
//       modifiers.filter = modifiers.filter
//         ? op(modifiers.filter, "and", modExpr)
//         : modExpr;
//       // methods no longer change cardinality
//       // cardinality = computeFilterCardinality(
//       //   modExpr,
//       //   cardinality,
//       //   parent.__expr__
//       // );
//       break;
//     case "order_by":
//       const ordering =
//         typeof (modExpr as any).__element__ === "undefined"
//           ? modExpr
//           : {expression: modExpr};
//       modifiers.order_by = modifiers.order_by
//         ? [...modifiers.order_by, ordering]
//         : [ordering];
//       break;
//     case "offset":
//       modifiers.offset =
//         typeof modExpr === "number" ? _std.number(modExpr) : modExpr;
//       // methods no longer change cardinality
//       // cardinality = cardutil
//            .overrideLowerBound(cardinality, "Zero");
//       break;
//     case "limit":
//       modifiers.limit =
//         typeof modExpr === "number"
//           ? _std.number(modExpr)
//           : (modExpr as any).__kind__ === ExpressionKind.Set
//           ? (modExpr as any).__exprs__[0]
//           : modExpr;
//       // methods no longer change cardinality
//       // cardinality = cardutil
//            .overrideLowerBound(cardinality, "Zero");
//       break;
//   }
//   return $expressionify(
//     $selectify({
//       __kind__: ExpressionKind.Select,
//       __element__: parent.__element__,
//       __cardinality__: cardinality,
//       __expr__: parent.__expr__,
//       __modifiers__: modifiers,
//       __scope__: scope,
//     })
//   );
// }
function $selectify(expr) {
    // Object.assign(expr, {
    //   filter: (filter: any) => updateModifier(expr, "filter", filter),
    //   order_by: (order_by: any) => updateModifier(expr, "order_by", order_by),
    //   offset: (offset: any) => updateModifier(expr, "offset", offset),
    //   limit: (limit: any) => updateModifier(expr, "limit", limit),
    // });
    return expr;
}
exports.$selectify = $selectify;
const $FreeObject = (0, hydrate_1.makeType)(__spec__1.spec, [...__spec__1.spec.values()].find(s => s.name === "std::FreeObject").id, literal_1.literal);
const FreeObject = {
    __kind__: index_1.ExpressionKind.PathNode,
    __element__: $FreeObject,
    __cardinality__: index_1.Cardinality.One,
    __parent__: null,
    __exclusive__: true,
    __scopeRoot__: null
};
exports.$existingScopes = new Set();
function $shape(_a, b) {
    return b;
}
exports.shape = $shape;
function select(...args) {
    const firstArg = args[0];
    if (typeof firstArg !== "object" ||
        firstArg instanceof Uint8Array ||
        firstArg instanceof Date ||
        firstArg instanceof edgedb_1.Duration ||
        firstArg instanceof edgedb_1.LocalDateTime ||
        firstArg instanceof edgedb_1.LocalDate ||
        firstArg instanceof edgedb_1.LocalTime ||
        firstArg instanceof edgedb_1.RelativeDuration ||
        firstArg instanceof edgedb_1.DateDuration ||
        firstArg instanceof edgedb_1.ConfigMemory) {
        const literalExpr = (0, castMaps_1.literalToTypeSet)(firstArg);
        return (0, path_1.$expressionify)($selectify({
            __kind__: index_1.ExpressionKind.Select,
            __element__: literalExpr.__element__,
            __cardinality__: literalExpr.__cardinality__,
            __expr__: literalExpr,
            __modifiers__: {}
        }));
    }
    const exprPair = typeof args[0].__element__ !== "undefined"
        ? args
        : [FreeObject, () => args[0]];
    let expr = exprPair[0];
    const shapeGetter = exprPair[1];
    if (expr === FreeObject) {
        const freeObjectPtrs = {};
        for (const [k, v] of Object.entries(args[0])) {
            freeObjectPtrs[k] = {
                __kind__: v.__element__.__kind__ === index_1.TypeKind.object ? "link" : "property",
                target: v.__element__,
                cardinality: v.__cardinality__,
                exclusive: false,
                computed: true,
                readonly: true,
                hasDefault: false,
                properties: {}
            };
        }
        expr = {
            ...FreeObject,
            __element__: {
                ...FreeObject.__element__,
                __pointers__: {
                    ...FreeObject.__element__.__pointers__,
                    ...freeObjectPtrs
                }
            }
        };
    }
    if (!shapeGetter) {
        if (expr.__element__.__kind__ === index_1.TypeKind.object) {
            const objectExpr = expr;
            return (0, path_1.$expressionify)($selectify({
                __kind__: index_1.ExpressionKind.Select,
                __element__: {
                    __kind__: index_1.TypeKind.object,
                    __name__: `${objectExpr.__element__.__name__}`,
                    __pointers__: objectExpr.__element__.__pointers__,
                    __shape__: objectExpr.__element__.__shape__
                },
                __cardinality__: objectExpr.__cardinality__,
                __expr__: objectExpr,
                __modifiers__: {}
            }));
        }
        else {
            return (0, path_1.$expressionify)($selectify({
                __kind__: index_1.ExpressionKind.Select,
                __element__: expr.__element__,
                __cardinality__: expr.__cardinality__,
                __expr__: expr,
                __modifiers__: {}
            }));
        }
    }
    const cleanScopedExprs = exports.$existingScopes.size === 0;
    const { modifiers: mods, shape, scope } = resolveShape(shapeGetter, expr);
    if (cleanScopedExprs) {
        exports.$existingScopes.clear();
    }
    const { modifiers, cardinality } = $handleModifiers(mods, { root: expr, scope });
    return (0, path_1.$expressionify)($selectify({
        __kind__: index_1.ExpressionKind.Select,
        __element__: expr.__element__.__kind__ === index_1.TypeKind.object
            ? {
                __kind__: index_1.TypeKind.object,
                __name__: `${expr.__element__.__name__}`,
                __pointers__: expr.__element__.__pointers__,
                __shape__: shape
            }
            : expr.__element__,
        __cardinality__: cardinality,
        __expr__: expr,
        __modifiers__: modifiers,
        __scope__: expr !== scope // && expr.__element__.__name__ !== "std::FreeObject"
            ? scope
            : undefined
    }));
}
exports.select = select;
function resolveShape(shapeGetter, expr) {
    const modifiers = {};
    const shape = {};
    // get scoped object if expression is objecttypeset
    const scope = expr.__element__.__kind__ === index_1.TypeKind.object
        ? (0, path_1.$getScopedExpr)(expr, exports.$existingScopes)
        : expr;
    // execute getter with scope
    const selectShape = typeof shapeGetter === "function" ? shapeGetter(scope) : shapeGetter;
    for (const [key, value] of Object.entries(selectShape)) {
        // handle modifier keys
        if (key === "filter" ||
            key === "filter_single" ||
            key === "order_by" ||
            key === "offset" ||
            key === "limit") {
            modifiers[key] = value;
        }
        else {
            // for scalar expressions, scope === expr
            // shape keys are not allowed
            if (expr.__element__.__kind__ !== index_1.TypeKind.object) {
                throw new Error(`Invalid select shape key '${key}' on scalar expression, ` +
                    `only modifiers are allowed (filter, order_by, offset and limit)`);
            }
            shape[key] = resolveShapeElement(key, value, scope);
        }
    }
    return { shape, modifiers, scope };
}
function resolveShapeElement(key, value, scope) {
    var _b, _c, _d, _e, _f;
    // if value is a nested closure
    // or a nested shape object
    const isSubshape = typeof value === "object" &&
        typeof value.__kind__ === "undefined";
    const isClosure = typeof value === "function" &&
        ((_b = scope.__element__.__pointers__[key]) === null || _b === void 0 ? void 0 : _b.__kind__) === "link";
    // if (isSubshape) {
    //   // return value;
    //   const childExpr = (scope as any)[key];
    //   const {
    //     shape: childShape,
    //     // scope: childScope,
    //     // modifiers: mods,
    //   } = resolveShape(value as any, childExpr);
    //   return childShape;
    // }
    if (isSubshape || isClosure) {
        // get child node expression
        // this relies on Proxy-based getters
        const childExpr = scope[key];
        if (!childExpr) {
            throw new Error(`Invalid shape element "${key}" for type ${scope.__element__.__name__}`);
        }
        const { shape: childShape, scope: childScope, modifiers: mods } = resolveShape(value, childExpr);
        // extracts normalized modifiers
        const { modifiers } = $handleModifiers(mods, {
            root: childExpr,
            scope: childScope
        });
        return {
            __kind__: index_1.ExpressionKind.Select,
            __element__: {
                __kind__: index_1.TypeKind.object,
                __name__: `${childExpr.__element__.__name__}`,
                __pointers__: childExpr.__element__.__pointers__,
                __shape__: childShape
            },
            __cardinality__: ((_d = (_c = scope.__element__.__pointers__) === null || _c === void 0 ? void 0 : _c[key]) === null || _d === void 0 ? void 0 : _d.cardinality) ||
                ((_f = (_e = scope.__element__.__shape__) === null || _e === void 0 ? void 0 : _e[key]) === null || _f === void 0 ? void 0 : _f.__cardinality__),
            __expr__: childExpr,
            __modifiers__: modifiers,
            __scope__: childExpr !== childScope ? childScope : undefined
        };
    }
    else if ((value === null || value === void 0 ? void 0 : value.__kind__) === index_1.ExpressionKind.PolyShapeElement) {
        const polyElement = value;
        const polyScope = scope.is(polyElement.__polyType__);
        return {
            __kind__: index_1.ExpressionKind.PolyShapeElement,
            __polyType__: polyScope,
            __shapeElement__: resolveShapeElement(key, polyElement.__shapeElement__, polyScope)
        };
    }
    else if (typeof value === "boolean" && key.startsWith("@")) {
        const linkProp = scope[key];
        if (!linkProp) {
            throw new Error(scope.__parent__
                ? `link property '${key}' does not exist on link ${scope.__parent__.linkName}`
                : `cannot select link property '${key}' on an object (${scope.__element__.__name__})`);
        }
        return value ? linkProp : false;
    }
    else {
        return value;
    }
}
exports.resolveShapeElement = resolveShapeElement;
