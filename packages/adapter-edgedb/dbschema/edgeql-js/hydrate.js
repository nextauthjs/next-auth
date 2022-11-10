"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$mergeTupleTypes = exports.$mergeObjectTypes = exports.makeType = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const typeCache = new Map();
const _linkProps = Symbol();
function applySpec(spec, type, shape, seen, literal) {
    const allPointers = [
        ...type.pointers,
        ...type.backlinks,
        ...type.backlink_stubs
    ];
    for (const ptr of allPointers) {
        if (seen.has(ptr.name)) {
            continue;
        }
        seen.add(ptr.name);
        if (ptr.kind === "link") {
            shape[ptr.name] = {
                __kind__: "link",
                cardinality: ptr.card,
                exclusive: ptr.is_exclusive,
                computed: ptr.is_computed,
                readonly: ptr.is_readonly
            };
            index_1.util.defineGetter(shape[ptr.name], "target", () => makeType(spec, ptr.target_id, literal));
            index_1.util.defineGetter(shape[ptr.name], "properties", () => {
                var _a;
                if (!shape[ptr.name][_linkProps]) {
                    const linkProperties = (shape[ptr.name][_linkProps] = {});
                    for (const linkProp of (_a = ptr.pointers) !== null && _a !== void 0 ? _a : []) {
                        // We only support "link properties" in EdgeDB, currently.
                        if (linkProp.kind !== "property") {
                            return;
                        }
                        // No use for them reflected, at the moment.
                        if (linkProp.name === "source" || linkProp.name === "target") {
                            return;
                        }
                        const linkPropObject = {
                            __kind__: "property"
                        };
                        linkPropObject.cardinality = linkProp.card;
                        index_1.util.defineGetter(linkPropObject, "target", () => {
                            return makeType(spec, linkProp.target_id, literal);
                        });
                        linkProperties[linkProp.name] = linkPropObject;
                    }
                }
                return shape[ptr.name][_linkProps];
            });
        }
        else if (ptr.kind === "property") {
            shape[ptr.name] = {
                __kind__: "property",
                cardinality: ptr.card,
                exclusive: ptr.is_exclusive,
                computed: ptr.is_computed,
                readonly: ptr.is_readonly
            };
            index_1.util.defineGetter(shape[ptr.name], "target", () => makeType(spec, ptr.target_id, literal));
        }
    }
}
function makeType(spec, id, 
// should be (type: any, val: any) => any, but causes
// 'Type instantiation is excessively deep and possibly infinite' error
// in typescript 4.5
literal, anytype) {
    const type = spec.get(id);
    if (type.name === "anytype" || type.name === "std::anypoint") {
        if (anytype)
            return anytype;
        throw new Error("anytype not provided");
    }
    if (typeCache.has(id)) {
        return typeCache.get(id);
    }
    const obj = {};
    obj.__name__ = type.name;
    if (type.kind === "object") {
        obj.__kind__ = index_1.TypeKind.object;
        const pointers = {};
        const seen = new Set();
        applySpec(spec, type, pointers, seen, literal);
        const ancestors = [...type.bases];
        for (const anc of ancestors) {
            const ancType = spec.get(anc.id);
            if (ancType.kind === "object" || ancType.kind === "scalar") {
                ancestors.push(...ancType.bases);
            }
            if (ancType.kind !== "object") {
                throw new Error(`Not an object: ${id}`);
            }
            applySpec(spec, ancType, pointers, seen, literal);
        }
        obj.__pointers__ = pointers;
        obj.__shape__ = {};
        typeCache.set(id, obj);
        return obj;
    }
    else if (type.kind === "scalar") {
        const scalarObj = type.is_abstract
            ? {}
            : type.enum_values
                ? {}
                : // : type.name === "std::json"
                    // ? (((val: any) => {
                    //     return literal(scalarObj, JSON.stringify(val));
                    //   }) as any)
                    ((val) => {
                        return literal(scalarObj, val);
                    });
        if (type.enum_values) {
            scalarObj.__kind__ = index_1.TypeKind.enum;
            scalarObj.__values__ = type.enum_values;
            for (const val of type.enum_values) {
                Object.defineProperty(scalarObj, index_1.util.toIdent(val), {
                    get() {
                        return literal(scalarObj, val);
                    }
                });
            }
            // if (type.enum_values) {
            //   for (const val of type.enum_values) {
            //     scalarObj[val] = val;
            //   }
            // }
        }
        else {
            scalarObj.__kind__ = index_1.TypeKind.scalar;
        }
        scalarObj.__name__ = type.name;
        if (type.cast_type) {
            scalarObj.__casttype__ = makeType(spec, type.cast_type, literal);
        }
        typeCache.set(id, scalarObj);
        return scalarObj;
    }
    else if (type.kind === "array") {
        obj.__kind__ = index_1.TypeKind.array;
        index_1.util.defineGetter(obj, "__element__", () => {
            return makeType(spec, type.array_element_id, literal, anytype);
        });
        index_1.util.defineGetter(obj, "__name__", () => {
            return `array<${obj.__element__.__name__}>`;
        });
        return obj;
    }
    else if (type.kind === "tuple") {
        if (type.tuple_elements[0].name === "0") {
            // unnamed tuple
            obj.__kind__ = index_1.TypeKind.tuple;
            index_1.util.defineGetter(obj, "__items__", () => {
                return type.tuple_elements.map(el => makeType(spec, el.target_id, literal, anytype));
            });
            index_1.util.defineGetter(obj, "__name__", () => {
                return `tuple<${obj.__items__
                    .map((item) => item.__name__)
                    .join(", ")}>`;
            });
            return obj;
        }
        else {
            // named tuple
            obj.__kind__ = index_1.TypeKind.namedtuple;
            index_1.util.defineGetter(obj, "__shape__", () => {
                const shape = {};
                for (const el of type.tuple_elements) {
                    shape[el.name] = makeType(spec, el.target_id, literal, anytype);
                }
                return shape;
            });
            index_1.util.defineGetter(obj, "__name__", () => {
                return `tuple<${Object.entries(obj.__shape__)
                    .map(([key, val]) => `${key}: ${val.__name__}`)
                    .join(", ")}>`;
            });
            return obj;
        }
    }
    else if (type.kind === "range") {
        obj.__kind__ = index_1.TypeKind.range;
        index_1.util.defineGetter(obj, "__element__", () => {
            return makeType(spec, type.range_element_id, literal, anytype);
        });
        index_1.util.defineGetter(obj, "__name__", () => {
            return `range<${obj.__element__.__name__}>`;
        });
        return obj;
    }
    else {
        throw new Error("Invalid type.");
    }
}
exports.makeType = makeType;
function $mergeObjectTypes(a, b) {
    const obj = {
        __kind__: index_1.TypeKind.object,
        __name__: `${a.__name__} UNION ${b.__name__}`,
        get __pointers__() {
            const merged = {};
            for (const [akey, aitem] of Object.entries(a.__pointers__)) {
                if (!b.__pointers__[akey])
                    continue;
                const bitem = b.__pointers__[akey];
                if (aitem.cardinality !== bitem.cardinality)
                    continue;
                // names must reflect full type
                if (aitem.target.__name__ !== bitem.target.__name__)
                    continue;
                merged[akey] = aitem;
            }
            return merged;
        },
        __shape__: {}
    };
    return obj;
}
exports.$mergeObjectTypes = $mergeObjectTypes;
function $mergeTupleTypes(a, b) {
    if (a.__items__.length !== b.__items__.length) {
        throw new Error("Incompatible tuple types; lengths differ.");
    }
    return {};
}
exports.$mergeTupleTypes = $mergeTupleTypes;
