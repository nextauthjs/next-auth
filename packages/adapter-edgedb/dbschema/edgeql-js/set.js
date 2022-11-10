"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.getSharedParent = void 0;
const index_1 = require("edgedb/dist/reflection/index");
const hydrate_1 = require("./hydrate");
const castMaps = __importStar(require("./castMaps"));
function getSharedParent(a, b) {
    if (a.__kind__ !== b.__kind__) {
        throw new Error(`Incompatible array types: ${a.__name__} and ${b.__name__}`);
    }
    if (a.__kind__ === index_1.TypeKind.scalar && b.__kind__ === index_1.TypeKind.scalar) {
        return castMaps.getSharedParentScalar(a, b);
    }
    else if (a.__kind__ === index_1.TypeKind.object &&
        b.__kind__ === index_1.TypeKind.object) {
        return (0, hydrate_1.$mergeObjectTypes)(a, b);
    }
    else if (a.__kind__ === index_1.TypeKind.tuple && b.__kind__ === index_1.TypeKind.tuple) {
        if (a.__items__.length !== b.__items__.length) {
            throw new Error(`Incompatible tuple types: ${a.__name__} and ${b.__name__}`);
        }
        try {
            const items = a.__items__.map((_, i) => {
                if (!a.__items__[i] || !b.__items__[i]) {
                    throw new Error();
                }
                return getSharedParent(a.__items__[i], b.__items__[i]);
            });
            return {
                __kind__: index_1.TypeKind.tuple,
                __name__: `tuple<${items.map(item => item.__name__).join(", ")}>`,
                __items__: items
            };
        }
        catch (err) {
            throw new Error(`Incompatible tuple types: ${a.__name__} and ${b.__name__}`);
        }
    }
    else if (a.__kind__ === index_1.TypeKind.namedtuple &&
        b.__kind__ === index_1.TypeKind.namedtuple) {
        const aKeys = Object.keys(a);
        const bKeys = new Set(Object.keys(b));
        const sameKeys = aKeys.length === bKeys.size && aKeys.every(k => bKeys.has(k));
        if (!sameKeys) {
            throw new Error(`Incompatible tuple types: ${a.__name__} and ${b.__name__}`);
        }
        try {
            const items = {};
            for (const [i] of Object.entries(a.__shape__)) {
                if (!a.__shape__[i] || !b.__shape__[i]) {
                    throw new Error();
                }
                items[i] = getSharedParent(a.__shape__[i], b.__shape__[i]);
            }
            return {
                __kind__: index_1.TypeKind.namedtuple,
                __name__: `tuple<${Object.entries(items)
                    .map(([key, val]) => `${key}: ${val.__name__}`)
                    .join(", ")}>`,
                __shape__: items
            };
        }
        catch (err) {
            throw new Error(`Incompatible tuple types: ${a.__name__} and ${b.__name__}`);
        }
    }
    else if (a.__kind__ === index_1.TypeKind.array && b.__kind__ === index_1.TypeKind.array) {
        try {
            const mergedEl = getSharedParent(a.__element__, b.__element__);
            return {
                __kind__: index_1.TypeKind.array,
                __name__: a.__name__,
                __element__: mergedEl
            };
        }
        catch (err) {
            throw new Error(`Incompatible array types: ${a.__name__} and ${b.__name__}`);
        }
    }
    else if (a.__kind__ === index_1.TypeKind.enum && b.__kind__ === index_1.TypeKind.enum) {
        if (a.__name__ === b.__name__)
            return a;
        throw new Error(`Incompatible array types: ${a.__name__} and ${b.__name__}`);
    }
    else {
        throw new Error(`Incompatible array types: ${a.__name__} and ${b.__name__}`);
    }
}
exports.getSharedParent = getSharedParent;
var setImpl_1 = require("./setImpl");
Object.defineProperty(exports, "set", { enumerable: true, get: function () { return setImpl_1.set; } });
