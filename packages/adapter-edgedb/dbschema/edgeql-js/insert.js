"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = exports.$normaliseInsertShape = exports.$insertify = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const path_1 = require("./path");
const cast_1 = require("./cast");
const set_1 = require("./set");
const literal_1 = require("./literal");
const literal_2 = require("./literal");
function unlessConflict(conflictGetter) {
    const expr = {
        __kind__: index_1.ExpressionKind.InsertUnlessConflict,
        __element__: this.__element__,
        __cardinality__: index_1.Cardinality.AtMostOne,
        __expr__: this
        // __conflict__: Conflict;
    };
    if (!conflictGetter) {
        expr.__conflict__ = { on: null };
        return (0, path_1.$expressionify)(expr);
    }
    else {
        const scopedExpr = (0, path_1.$getScopedExpr)(this.__expr__);
        const conflict = conflictGetter(scopedExpr);
        expr.__conflict__ = conflict;
        if (conflict.else) {
            expr.__cardinality__ = conflict.else.__cardinality__;
            if (this.__element__.__name__ !== conflict.else.__element__.__name__) {
                expr.__element__ = (0, literal_2.$getTypeByName)("std::Object");
            }
        }
        return (0, path_1.$expressionify)(expr);
    }
}
function $insertify(expr) {
    expr.unlessConflict = unlessConflict.bind(expr);
    return expr;
}
exports.$insertify = $insertify;
function $normaliseInsertShape(root, shape, isUpdate = false) {
    const newShape = {};
    for (const [key, _val] of Object.entries(shape)) {
        let val = _val;
        let setModify = null;
        if (isUpdate && _val != null && typeof _val === "object") {
            const valKeys = Object.keys(_val);
            if (valKeys.length === 1 &&
                (valKeys[0] === "+=" || valKeys[0] === "-=")) {
                val = _val[valKeys[0]];
                setModify = valKeys[0];
            }
        }
        const pointer = root.__element__.__pointers__[key];
        // no pointer, not a link property
        const isLinkProp = key[0] === "@";
        if (!pointer && !isLinkProp) {
            throw new Error(`Could not find property pointer for ${isUpdate ? "update" : "insert"} shape key: '${key}'`);
        }
        // skip undefined vals
        if (val === undefined)
            continue;
        // is val is expression, assign to newShape
        if (val === null || val === void 0 ? void 0 : val.__kind__) {
            // ranges can contain null values, so if the type is 'std::number'
            // we need to set the type to the exact number type of the pointer
            // so null casts are correct
            if (val.__kind__ === index_1.ExpressionKind.Literal &&
                val.__element__.__kind__ === index_1.TypeKind.range &&
                val.__element__.__element__.__name__ === "std::number") {
                newShape[key] = literal_1.literal(pointer.target, val.__value__);
            }
            else {
                newShape[key] = _val;
            }
            continue;
        }
        // handle link props
        // after this guard, pointer definitely is defined
        if (isLinkProp) {
            throw new Error(`Cannot assign plain data to link property '${key}'. Provide an expression instead.`);
        }
        // trying to assign plain data to a link
        if (pointer.__kind__ !== "property" && val !== null) {
            throw new Error(`Must provide subquery when assigning to link '${key}' in ${isUpdate ? "update" : "insert"} query.`);
        }
        // val is plain data
        // key corresponds to pointer or starts with "@"
        const isMulti = pointer.cardinality === index_1.Cardinality.AtLeastOne ||
            pointer.cardinality === index_1.Cardinality.Many;
        if (pointer.__kind__ === "property") {
            if (pointer.target.__name__ === "std::json") {
            }
        }
        const wrappedVal = val === null
            ? (0, cast_1.cast)(pointer.target, null)
            : isMulti && Array.isArray(val)
                ? val.length === 0
                    ? (0, cast_1.cast)(pointer.target, null)
                    : (0, set_1.set)(...val.map(v => literal_1.literal(pointer.target, v)))
                : literal_1.literal(pointer.target, val);
        newShape[key] = setModify
            ? { [setModify]: wrappedVal }
            : wrappedVal;
    }
    return newShape;
}
exports.$normaliseInsertShape = $normaliseInsertShape;
function insert(root, shape) {
    if (typeof shape !== "object") {
        throw new Error(`invalid insert shape.${typeof shape === "function"
            ? " Hint: Insert shape is expected to be an object, " +
                "not a function returning a shape object."
            : ""}`);
    }
    const expr = {
        __kind__: index_1.ExpressionKind.Insert,
        __element__: root.__element__,
        __cardinality__: index_1.Cardinality.One,
        __expr__: root,
        __shape__: $normaliseInsertShape(root, shape)
    };
    expr.unlessConflict = unlessConflict.bind(expr);
    return (0, path_1.$expressionify)($insertify(expr));
}
exports.insert = insert;
