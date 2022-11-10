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
exports.FreeObject = exports.$FreeObject = exports.Object_9d92cf705b2511ed848a275bef45d8e3 = exports.$Object_9d92cf705b2511ed848a275bef45d8e3 = exports.BaseObject = exports.$BaseObject = exports.number = exports.uuid = exports.str = exports.$sequence = exports.json = exports.int64 = exports.int32 = exports.int16 = exports.float64 = exports.float32 = exports.duration = exports.decimal = exports.datetime = exports.bytes = exports.bool = exports.bigint = exports.JsonEmpty = void 0;
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
const JsonEmpty = $.makeType(_.spec, "9bf93643-5b25-11ed-98d4-2f2db4f38761", _.syntax.literal);
exports.JsonEmpty = JsonEmpty;
const bigint = $.makeType(_.spec, "00000000-0000-0000-0000-000000000110", _.syntax.literal);
exports.bigint = bigint;
const bool = $.makeType(_.spec, "00000000-0000-0000-0000-000000000109", _.syntax.literal);
exports.bool = bool;
const bytes = $.makeType(_.spec, "00000000-0000-0000-0000-000000000102", _.syntax.literal);
exports.bytes = bytes;
const datetime = $.makeType(_.spec, "00000000-0000-0000-0000-00000000010a", _.syntax.literal);
exports.datetime = datetime;
const decimal = $.makeType(_.spec, "00000000-0000-0000-0000-000000000108", _.syntax.literal);
exports.decimal = decimal;
const duration = $.makeType(_.spec, "00000000-0000-0000-0000-00000000010e", _.syntax.literal);
exports.duration = duration;
const float32 = $.makeType(_.spec, "00000000-0000-0000-0000-000000000106", _.syntax.literal);
exports.float32 = float32;
const float64 = $.makeType(_.spec, "00000000-0000-0000-0000-000000000107", _.syntax.literal);
exports.float64 = float64;
const int16 = $.makeType(_.spec, "00000000-0000-0000-0000-000000000103", _.syntax.literal);
exports.int16 = int16;
const int32 = $.makeType(_.spec, "00000000-0000-0000-0000-000000000104", _.syntax.literal);
exports.int32 = int32;
const int64 = $.makeType(_.spec, "00000000-0000-0000-0000-000000000105", _.syntax.literal);
exports.int64 = int64;
const json = $.makeType(_.spec, "00000000-0000-0000-0000-00000000010f", _.syntax.literal);
exports.json = json;
const $sequence = $.makeType(_.spec, "965b9d1d-5b25-11ed-8994-1f6f766fede8", _.syntax.literal);
exports.$sequence = $sequence;
const str = $.makeType(_.spec, "00000000-0000-0000-0000-000000000101", _.syntax.literal);
exports.str = str;
const uuid = $.makeType(_.spec, "00000000-0000-0000-0000-000000000100", _.syntax.literal);
exports.uuid = uuid;
const number = $.makeType(_.spec, "00000000-0000-0000-0000-0000000001ff", _.syntax.literal);
exports.number = number;
const $BaseObject = $.makeType(_.spec, "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", _.syntax.literal);
exports.$BaseObject = $BaseObject;
const BaseObject = _.syntax.$PathNode($.$toSet($BaseObject, $.Cardinality.Many), null);
exports.BaseObject = BaseObject;
const $Object_9d92cf705b2511ed848a275bef45d8e3 = $.makeType(_.spec, "9d92cf70-5b25-11ed-848a-275bef45d8e3", _.syntax.literal);
exports.$Object_9d92cf705b2511ed848a275bef45d8e3 = $Object_9d92cf705b2511ed848a275bef45d8e3;
const Object_9d92cf705b2511ed848a275bef45d8e3 = _.syntax.$PathNode($.$toSet($Object_9d92cf705b2511ed848a275bef45d8e3, $.Cardinality.Many), null);
exports.Object_9d92cf705b2511ed848a275bef45d8e3 = Object_9d92cf705b2511ed848a275bef45d8e3;
const $FreeObject = $.makeType(_.spec, "9d99c1a3-5b25-11ed-ac2a-951d7a9d0cbe", _.syntax.literal);
exports.$FreeObject = $FreeObject;
const FreeObject = _.syntax.$PathNode($.$toSet($FreeObject, $.Cardinality.One), null);
exports.FreeObject = FreeObject;
function assert_single(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::assert_single', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false }], namedArgs: { "message": { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "OptionalType", preservesOptionality: true },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::assert_single",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function assert_exists(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::assert_exists', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false }], namedArgs: { "message": { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "SetOfType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::assert_exists",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function assert_distinct(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::assert_distinct', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false }], namedArgs: { "message": { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "SetOfType", preservesOptionality: true },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::assert_distinct",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function len(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::len', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::len",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function sum(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::sum', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000110" },
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::sum",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function count(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::count', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::count",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function random(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::random', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::random",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function min(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::min', args, _.spec, [
        { args: [{ typeId: "9653ec8b-5b25-11ed-8cdc-d7e32341261a", optional: false, setoftype: true, variadic: false }], returnTypeId: "9653ec8b-5b25-11ed-8cdc-d7e32341261a", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: true, variadic: false }], returnTypeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010e", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010c", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010d", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000112", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "44a76fab-349d-00e9-396b-1000d7e967da", optional: false, setoftype: true, variadic: false }], returnTypeId: "44a76fab-349d-00e9-396b-1000d7e967da", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "076e1d6f-f104-88b2-0632-d53171d9c827", optional: false, setoftype: true, variadic: false }], returnTypeId: "076e1d6f-f104-88b2-0632-d53171d9c827", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "82ea7b30-73d3-c79c-86fb-b253f194f53e", optional: false, setoftype: true, variadic: false }], returnTypeId: "82ea7b30-73d3-c79c-86fb-b253f194f53e", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "63acbf06-4c0c-67ac-c508-50a5ef4f4b16", optional: false, setoftype: true, variadic: false }], returnTypeId: "63acbf06-4c0c-67ac-c508-50a5ef4f4b16", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "6b937ab8-47dc-95f9-8213-dc2fd50cd7fe", optional: false, setoftype: true, variadic: false }], returnTypeId: "6b937ab8-47dc-95f9-8213-dc2fd50cd7fe", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010b", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000111", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "OptionalType", preservesOptionality: true },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::min",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function max(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::max', args, _.spec, [
        { args: [{ typeId: "9653ec8b-5b25-11ed-8cdc-d7e32341261a", optional: false, setoftype: true, variadic: false }], returnTypeId: "9653ec8b-5b25-11ed-8cdc-d7e32341261a", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: true, variadic: false }], returnTypeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010e", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010c", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010d", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000112", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "44a76fab-349d-00e9-396b-1000d7e967da", optional: false, setoftype: true, variadic: false }], returnTypeId: "44a76fab-349d-00e9-396b-1000d7e967da", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "076e1d6f-f104-88b2-0632-d53171d9c827", optional: false, setoftype: true, variadic: false }], returnTypeId: "076e1d6f-f104-88b2-0632-d53171d9c827", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "82ea7b30-73d3-c79c-86fb-b253f194f53e", optional: false, setoftype: true, variadic: false }], returnTypeId: "82ea7b30-73d3-c79c-86fb-b253f194f53e", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "63acbf06-4c0c-67ac-c508-50a5ef4f4b16", optional: false, setoftype: true, variadic: false }], returnTypeId: "63acbf06-4c0c-67ac-c508-50a5ef4f4b16", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "6b937ab8-47dc-95f9-8213-dc2fd50cd7fe", optional: false, setoftype: true, variadic: false }], returnTypeId: "6b937ab8-47dc-95f9-8213-dc2fd50cd7fe", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010b", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000111", returnTypemod: "OptionalType", preservesOptionality: true },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "OptionalType", preservesOptionality: true },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::max",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function all(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::all', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::all",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function any(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::any', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: true, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::any",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function enumerate(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::enumerate', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false }], returnTypeId: "9c27acd9-0932-6050-c7b0-c7410e2e0a85", returnTypemod: "SetOfType", preservesOptionality: true },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::enumerate",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function round(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::round', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000110" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::round",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function contains(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::contains', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
        { args: [{ typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }, { typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
        { args: [{ typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }, { typeId: "964d3cc3-5b25-11ed-91c5-9b35b5a1db55", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
        { args: [{ typeId: "ca752a6b-54a8-ba10-285b-13a79b02a110", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
        { args: [{ typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::contains",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function array_replace(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::array_replace', args, _.spec, [
        { args: [{ typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: false, variadic: false }], returnTypeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::array_replace",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function find(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::find', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::find",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function bit_and(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::bit_and', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::bit_and",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function bit_or(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::bit_or', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::bit_or",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function bit_xor(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::bit_xor', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::bit_xor",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function bit_not(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::bit_not', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::bit_not",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function bit_rshift(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::bit_rshift', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::bit_rshift",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function bit_lshift(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::bit_lshift', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::bit_lshift",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function array_agg(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::array_agg', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false }], returnTypeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::array_agg",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function array_unpack(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::array_unpack', args, _.spec, [
        { args: [{ typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "SetOfType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::array_unpack",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function array_fill(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::array_fill', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::array_fill",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function array_get(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::array_get', args, _.spec, [
        { args: [{ typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], namedArgs: { "default": { typeId: "00000000-0000-0000-0000-000000000001", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "OptionalType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::array_get",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function array_join(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::array_join', args, _.spec, [
        { args: [{ typeId: "05f91774-15ea-9001-038e-092c1cad80af", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::array_join",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function bytes_get_bit(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::bytes_get_bit', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::bytes_get_bit",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function datetime_current(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::datetime_current', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::datetime_current",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function datetime_of_transaction(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::datetime_of_transaction', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::datetime_of_transaction",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function datetime_of_statement(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::datetime_of_statement', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::datetime_of_statement",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function datetime_get(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::datetime_get', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::datetime_get",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function datetime_truncate(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::datetime_truncate', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::datetime_truncate",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function duration_get(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::duration_get', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::duration_get",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function duration_truncate(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::duration_truncate', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010e" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000112" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000111" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::duration_truncate",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function duration_to_seconds(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::duration_to_seconds', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::duration_to_seconds",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function json_typeof(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::json_typeof', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::json_typeof",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function json_array_unpack(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::json_array_unpack', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010f", returnTypemod: "SetOfType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::json_array_unpack",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function json_object_unpack(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::json_object_unpack', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false }], returnTypeId: "79d8ede8-30f1-a805-fbc3-503ece3c9205", returnTypemod: "SetOfType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::json_object_unpack",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function json_get(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::json_get', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: true }], namedArgs: { "default": { typeId: "00000000-0000-0000-0000-00000000010f", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-00000000010f", returnTypemod: "OptionalType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::json_get",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function json_set(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::json_set', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: true }], namedArgs: { "value": { typeId: "00000000-0000-0000-0000-00000000010f", optional: true, setoftype: false, variadic: false }, "create_if_missing": { typeId: "00000000-0000-0000-0000-000000000109", optional: true, setoftype: false, variadic: false }, "empty_treatment": { typeId: "9bf93643-5b25-11ed-98d4-2f2db4f38761", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-00000000010f", returnTypemod: "OptionalType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::json_set",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function re_match(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::re_match', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "05f91774-15ea-9001-038e-092c1cad80af" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::re_match",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function re_match_all(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::re_match_all', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "05f91774-15ea-9001-038e-092c1cad80af", returnTypemod: "SetOfType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::re_match_all",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function re_test(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::re_test', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::re_test",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function re_replace(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::re_replace', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], namedArgs: { "flags": { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::re_replace",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_repeat(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_repeat', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_repeat",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_lower(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_lower', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_lower",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_upper(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_upper', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_upper",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_title(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_title', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_title",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_pad_start(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_pad_start', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_pad_start",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_lpad(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_lpad', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_lpad",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_pad_end(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_pad_end', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_pad_end",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_rpad(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_rpad', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_rpad",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_trim_start(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_trim_start', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_trim_start",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_ltrim(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_ltrim', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_ltrim",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_trim_end(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_trim_end', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_trim_end",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_rtrim(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_rtrim', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_rtrim",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_trim(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_trim', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_trim",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_split(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_split', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "05f91774-15ea-9001-038e-092c1cad80af" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_split",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_replace(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_replace', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_replace",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function str_reverse(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::str_reverse', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::str_reverse",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function uuid_generate_v1mc(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::uuid_generate_v1mc', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-000000000100" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::uuid_generate_v1mc",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function uuid_generate_v4(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::uuid_generate_v4', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-000000000100" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::uuid_generate_v4",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
const range = _.syntax.$range;
function range_is_empty(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::range_is_empty', args, _.spec, [
        { args: [{ typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::range_is_empty",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function range_unpack(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::range_unpack', args, _.spec, [
        { args: [{ typeId: "9cd6f1bb-820a-e4e0-15cf-bc45c4e7baa0", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff", returnTypemod: "SetOfType" },
        { args: [{ typeId: "2dcd88a1-d377-baa4-c12e-d4abfef28c86", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff", returnTypemod: "SetOfType" },
        { args: [{ typeId: "ca752a6b-54a8-ba10-285b-13a79b02a110", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010c", returnTypemod: "SetOfType" },
        { args: [{ typeId: "9cd6f1bb-820a-e4e0-15cf-bc45c4e7baa0", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff", returnTypemod: "SetOfType" },
        { args: [{ typeId: "2dcd88a1-d377-baa4-c12e-d4abfef28c86", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff", returnTypemod: "SetOfType" },
        { args: [{ typeId: "e0169746-82b2-efaf-ec9e-fea17257877c", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff", returnTypemod: "SetOfType" },
        { args: [{ typeId: "b5052505-ceb2-a54d-f438-97a8f6a2120b", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff", returnTypemod: "SetOfType" },
        { args: [{ typeId: "1847fc4b-5f10-5b74-8257-168c3a85faa5", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a", returnTypemod: "SetOfType" },
        { args: [{ typeId: "ca752a6b-54a8-ba10-285b-13a79b02a110", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010c", returnTypemod: "SetOfType" },
        { args: [{ typeId: "c98e3620-6f26-d050-921e-24fbfb0b5873", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108", returnTypemod: "SetOfType" },
        { args: [{ typeId: "31bc1223-f64b-a6f0-b9b3-c7f3df5321dc", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010b", returnTypemod: "SetOfType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::range_unpack",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function range_get_upper(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::range_get_upper', args, _.spec, [
        { args: [{ typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }], returnTypeId: "964d3cc3-5b25-11ed-91c5-9b35b5a1db55", returnTypemod: "OptionalType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::range_get_upper",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function range_get_lower(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::range_get_lower', args, _.spec, [
        { args: [{ typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }], returnTypeId: "964d3cc3-5b25-11ed-91c5-9b35b5a1db55", returnTypemod: "OptionalType" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::range_get_lower",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function range_is_inclusive_upper(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::range_is_inclusive_upper', args, _.spec, [
        { args: [{ typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::range_is_inclusive_upper",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function range_is_inclusive_lower(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::range_is_inclusive_lower', args, _.spec, [
        { args: [{ typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::range_is_inclusive_lower",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function overlaps(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::overlaps', args, _.spec, [
        { args: [{ typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }, { typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000109" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::overlaps",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_str(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_str', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "05f91774-15ea-9001-038e-092c1cad80af", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_str",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_json(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_json', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010f" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_json",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_datetime(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_datetime', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010a" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_datetime",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_duration(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_duration', args, _.spec, [
        { args: [], namedArgs: { "hours": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "minutes": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "seconds": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "microseconds": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-00000000010e" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_duration",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_bigint(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_bigint', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000110" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_bigint",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_decimal(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_decimal', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000108" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_decimal",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_int64(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_int64', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_int64",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_int32(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_int32', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_int32",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_int16(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_int16', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_int16",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_float64(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_float64', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_float64",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_float32(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::to_float32', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::to_float32",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function sequence_reset(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::sequence_reset', args, _.spec, [
        { args: [{ typeId: "a0fbe6ee-5b25-11ed-b641-31c619df2be4", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
        { args: [{ typeId: "a0fbe6ee-5b25-11ed-b641-31c619df2be4", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::sequence_reset",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function sequence_next(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('std::sequence_next', args, _.spec, [
        { args: [{ typeId: "a0fbe6ee-5b25-11ed-b641-31c619df2be4", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::sequence_next",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
const __defaultExports = {
    "JsonEmpty": JsonEmpty,
    "bigint": bigint,
    "bool": bool,
    "bytes": bytes,
    "datetime": datetime,
    "decimal": decimal,
    "duration": duration,
    "float32": float32,
    "float64": float64,
    "int16": int16,
    "int32": int32,
    "int64": int64,
    "json": json,
    "str": str,
    "uuid": uuid,
    "BaseObject": BaseObject,
    "Object": Object_9d92cf705b2511ed848a275bef45d8e3,
    "FreeObject": FreeObject,
    "assert_single": assert_single,
    "assert_exists": assert_exists,
    "assert_distinct": assert_distinct,
    "len": len,
    "sum": sum,
    "count": count,
    "random": random,
    "min": min,
    "max": max,
    "all": all,
    "any": any,
    "enumerate": enumerate,
    "round": round,
    "contains": contains,
    "array_replace": array_replace,
    "find": find,
    "bit_and": bit_and,
    "bit_or": bit_or,
    "bit_xor": bit_xor,
    "bit_not": bit_not,
    "bit_rshift": bit_rshift,
    "bit_lshift": bit_lshift,
    "array_agg": array_agg,
    "array_unpack": array_unpack,
    "array_fill": array_fill,
    "array_get": array_get,
    "array_join": array_join,
    "bytes_get_bit": bytes_get_bit,
    "datetime_current": datetime_current,
    "datetime_of_transaction": datetime_of_transaction,
    "datetime_of_statement": datetime_of_statement,
    "datetime_get": datetime_get,
    "datetime_truncate": datetime_truncate,
    "duration_get": duration_get,
    "duration_truncate": duration_truncate,
    "duration_to_seconds": duration_to_seconds,
    "json_typeof": json_typeof,
    "json_array_unpack": json_array_unpack,
    "json_object_unpack": json_object_unpack,
    "json_get": json_get,
    "json_set": json_set,
    "re_match": re_match,
    "re_match_all": re_match_all,
    "re_test": re_test,
    "re_replace": re_replace,
    "str_repeat": str_repeat,
    "str_lower": str_lower,
    "str_upper": str_upper,
    "str_title": str_title,
    "str_pad_start": str_pad_start,
    "str_lpad": str_lpad,
    "str_pad_end": str_pad_end,
    "str_rpad": str_rpad,
    "str_trim_start": str_trim_start,
    "str_ltrim": str_ltrim,
    "str_trim_end": str_trim_end,
    "str_rtrim": str_rtrim,
    "str_trim": str_trim,
    "str_split": str_split,
    "str_replace": str_replace,
    "str_reverse": str_reverse,
    "uuid_generate_v1mc": uuid_generate_v1mc,
    "uuid_generate_v4": uuid_generate_v4,
    "range": range,
    "range_is_empty": range_is_empty,
    "range_unpack": range_unpack,
    "range_get_upper": range_get_upper,
    "range_get_lower": range_get_lower,
    "range_is_inclusive_upper": range_is_inclusive_upper,
    "range_is_inclusive_lower": range_is_inclusive_lower,
    "overlaps": overlaps,
    "to_str": to_str,
    "to_json": to_json,
    "to_datetime": to_datetime,
    "to_duration": to_duration,
    "to_bigint": to_bigint,
    "to_decimal": to_decimal,
    "to_int64": to_int64,
    "to_int32": to_int32,
    "to_int16": to_int16,
    "to_float64": to_float64,
    "to_float32": to_float32,
    "sequence_reset": sequence_reset,
    "sequence_next": sequence_next
};
exports.default = __defaultExports;
