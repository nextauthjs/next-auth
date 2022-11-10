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
exports.relative_duration = exports.local_time = exports.local_datetime = exports.local_date = exports.date_duration = void 0;
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
const date_duration = $.makeType(_.spec, "00000000-0000-0000-0000-000000000112", _.syntax.literal);
exports.date_duration = date_duration;
const local_date = $.makeType(_.spec, "00000000-0000-0000-0000-00000000010c", _.syntax.literal);
exports.local_date = local_date;
const local_datetime = $.makeType(_.spec, "00000000-0000-0000-0000-00000000010b", _.syntax.literal);
exports.local_datetime = local_datetime;
const local_time = $.makeType(_.spec, "00000000-0000-0000-0000-00000000010d", _.syntax.literal);
exports.local_time = local_time;
const relative_duration = $.makeType(_.spec, "00000000-0000-0000-0000-000000000111", _.syntax.literal);
exports.relative_duration = relative_duration;
function to_local_datetime(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::to_local_datetime', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010b" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010b" },
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010b" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::to_local_datetime",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_local_date(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::to_local_date', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010c" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010c" },
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010c" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::to_local_date",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_local_time(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::to_local_time', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010d" },
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010d" },
        { args: [{ typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-00000000010d" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::to_local_time",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_relative_duration(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::to_relative_duration', args, _.spec, [
        { args: [], namedArgs: { "years": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "months": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "days": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "hours": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "minutes": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "seconds": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "microseconds": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-000000000111" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::to_relative_duration",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function to_date_duration(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::to_date_duration', args, _.spec, [
        { args: [], namedArgs: { "years": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "months": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false }, "days": { typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-000000000112" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::to_date_duration",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function time_get(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::time_get', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::time_get",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function date_get(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::date_get', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false }, { typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-0000000001ff" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::date_get",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function duration_normalize_hours(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::duration_normalize_hours', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000111" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::duration_normalize_hours",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function duration_normalize_days(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cal::duration_normalize_days', args, _.spec, [
        { args: [{ typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000112" },
        { args: [{ typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false }], returnTypeId: "00000000-0000-0000-0000-000000000111" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cal::duration_normalize_days",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
const __defaultExports = {
    "date_duration": date_duration,
    "local_date": local_date,
    "local_datetime": local_datetime,
    "local_time": local_time,
    "relative_duration": relative_duration,
    "to_local_datetime": to_local_datetime,
    "to_local_date": to_local_date,
    "to_local_time": to_local_time,
    "to_relative_duration": to_relative_duration,
    "to_date_duration": to_date_duration,
    "time_get": time_get,
    "date_get": date_get,
    "duration_normalize_hours": duration_normalize_hours,
    "duration_normalize_days": duration_normalize_days
};
exports.default = __defaultExports;
