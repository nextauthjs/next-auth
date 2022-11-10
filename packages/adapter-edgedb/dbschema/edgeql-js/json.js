"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonifyComplexParams = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const buffer_1 = require("edgedb/dist/primitives/buffer");
function jsonStringify(type, val) {
    if (type.__kind__ === index_1.TypeKind.array) {
        if (Array.isArray(val)) {
            return `[${val
                .map(item => jsonStringify(type.__element__, item))
                .join()}]`;
        }
        throw new Error(`Param with array type is not an array`);
    }
    if (type.__kind__ === index_1.TypeKind.tuple) {
        if (!Array.isArray(val)) {
            throw new Error(`Param with tuple type is not an array`);
        }
        if (val.length !== type.__items__.length) {
            throw new Error(`Param with tuple type has incorrect number of items. Got ${val.length} expected ${type.__items__.length}`);
        }
        return `[${val
            .map((item, i) => jsonStringify(type.__items__[i], item))
            .join()}]`;
    }
    if (type.__kind__ === index_1.TypeKind.namedtuple) {
        if (typeof val !== "object") {
            throw new Error(`Param with named tuple type is not an object`);
        }
        if (Object.keys(val).length !== Object.keys(type.__shape__).length) {
            throw new Error(`Param with named tuple type has incorrect number of items. Got ${Object.keys(val).length} expected ${Object.keys(type.__shape__).length}`);
        }
        return `{${Object.entries(val)
            .map(([key, item]) => {
            if (!type.__shape__[key]) {
                throw new Error(`Unexpected key in named tuple param: ${key}, expected keys: ${Object.keys(type.__shape__).join()}`);
            }
            return `"${key}": ${jsonStringify(type.__shape__[key], item)}`;
        })
            .join()}}`;
    }
    if (type.__kind__ === index_1.TypeKind.scalar
    // || type.__kind__ === TypeKind.castonlyscalar
    ) {
        switch (type.__name__) {
            case "std::bigint":
                return val.toString();
            case "std::json":
                return JSON.stringify(val);
            case "std::bytes":
                return `"${(0, buffer_1.encodeB64)(val)}"`;
            case "cfg::memory":
                return `"${val.toString()}"`;
            default:
                return JSON.stringify(val);
        }
    }
    if (type.__kind__ === index_1.TypeKind.enum) {
        return JSON.stringify(val);
    }
    throw new Error(`Invalid param type: ${type.__kind__}`);
}
function jsonifyComplexParams(expr, _args) {
    if (_args && expr.__kind__ === index_1.ExpressionKind.WithParams) {
        const args = { ..._args };
        for (const param of expr.__params__) {
            if (param.__isComplex__) {
                args[param.__name__] = jsonStringify(param.__element__, args[param.__name__]);
            }
        }
        return args;
    }
    return _args;
}
exports.jsonifyComplexParams = jsonifyComplexParams;
