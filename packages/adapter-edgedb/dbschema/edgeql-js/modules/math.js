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
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
function floor(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::floor', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000110" },
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::floor",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function ln(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::ln', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::ln",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function lg(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::lg', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::lg",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function abs(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::abs', args, _.spec, [
        { args: [{ typeId: "9653ec8b-5b25-11ed-8cdc-d7e32341261a", optional: false, setoftype: false, variadic: false }], returnTypeId: "9653ec8b-5b25-11ed-8cdc-d7e32341261a" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::abs",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function ceil(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::ceil', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000110" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::ceil",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function log(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::log', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }], namedArgs: { "base": { typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::log",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function mean(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::mean', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::mean",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function stddev(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::stddev', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::stddev",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function stddev_pop(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::stddev_pop', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::stddev_pop",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function var_a4c5985a5b2511ed91ccdfa5cb747f7d(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::var', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff", returnTypemod: "OptionalType" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108", returnTypemod: "OptionalType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::var",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function var_pop(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('math::var_pop', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff", returnTypemod: "OptionalType" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108", returnTypemod: "OptionalType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "math::var_pop",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
const __defaultExports = {
    "floor": floor,
    "ln": ln,
    "lg": lg,
    "abs": abs,
    "ceil": ceil,
    "log": log,
    "mean": mean,
    "stddev": stddev,
    "stddev_pop": stddev_pop,
    "var": var_a4c5985a5b2511ed91ccdfa5cb747f7d,
    "var_pop": var_pop
};
exports.default = __defaultExports;
