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
exports.literalToTypeSet = exports.isImplicitlyCastableTo = exports.getSharedParentScalar = void 0;
const edgedb = __importStar(require("edgedb"));
const literal = __importStar(require("./literal"));
function getSharedParentScalar(a, b) {
    a = a.__casttype__ || a;
    b = b.__casttype__ || b;
    if (a.__name__ === "std::number") {
        if (b.__name__ === "std::number") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "sys::VersionStage") {
        if (b.__name__ === "sys::VersionStage") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "sys::TransactionIsolation") {
        if (b.__name__ === "sys::TransactionIsolation") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::uuid") {
        if (b.__name__ === "std::uuid") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::str") {
        if (b.__name__ === "std::str") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::json") {
        if (b.__name__ === "std::json") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::int64") {
        if (b.__name__ === "std::int64") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::int32") {
        if (b.__name__ === "std::int32") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::int16") {
        if (b.__name__ === "std::int16") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::float64") {
        if (b.__name__ === "std::float64") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::float32") {
        if (b.__name__ === "std::float32") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::duration") {
        if (b.__name__ === "std::duration") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::decimal") {
        if (b.__name__ === "std::decimal") {
            return b;
        }
        if (b.__name__ === "std::bigint") {
            return a;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::datetime") {
        if (b.__name__ === "std::datetime") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::bytes") {
        if (b.__name__ === "std::bytes") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::bool") {
        if (b.__name__ === "std::bool") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::bigint") {
        if (b.__name__ === "std::decimal") {
            return b;
        }
        if (b.__name__ === "std::bigint") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "std::JsonEmpty") {
        if (b.__name__ === "std::JsonEmpty") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::Volatility") {
        if (b.__name__ === "schema::Volatility") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::TypeModifier") {
        if (b.__name__ === "schema::TypeModifier") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::TargetDeleteAction") {
        if (b.__name__ === "schema::TargetDeleteAction") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::SourceDeleteAction") {
        if (b.__name__ === "schema::SourceDeleteAction") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::ParameterKind") {
        if (b.__name__ === "schema::ParameterKind") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::OperatorKind") {
        if (b.__name__ === "schema::OperatorKind") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::Cardinality") {
        if (b.__name__ === "schema::Cardinality") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::AccessPolicyAction") {
        if (b.__name__ === "schema::AccessPolicyAction") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "schema::AccessKind") {
        if (b.__name__ === "schema::AccessKind") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "cfg::memory") {
        if (b.__name__ === "cfg::memory") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "cfg::ConnectionTransport") {
        if (b.__name__ === "cfg::ConnectionTransport") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "cfg::AllowBareDDL") {
        if (b.__name__ === "cfg::AllowBareDDL") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "cal::relative_duration") {
        if (b.__name__ === "cal::relative_duration") {
            return b;
        }
        if (b.__name__ === "cal::date_duration") {
            return a;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "cal::local_time") {
        if (b.__name__ === "cal::local_time") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "cal::local_datetime") {
        if (b.__name__ === "cal::local_datetime") {
            return b;
        }
        if (b.__name__ === "cal::local_date") {
            return a;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "cal::local_date") {
        if (b.__name__ === "cal::local_datetime") {
            return b;
        }
        if (b.__name__ === "cal::local_date") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    if (a.__name__ === "cal::date_duration") {
        if (b.__name__ === "cal::relative_duration") {
            return b;
        }
        if (b.__name__ === "cal::date_duration") {
            return b;
        }
        throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
    }
    throw new Error(`Types are not castable: ${a.__name__}, ${b.__name__}`);
}
exports.getSharedParentScalar = getSharedParentScalar;
const implicitCastMap = new Map([
    ["cal::date_duration", new Set(["cal::relative_duration"])],
    ["cal::local_date", new Set(["cal::local_datetime"])],
    ["std::bigint", new Set(["std::decimal"])],
]);
function isImplicitlyCastableTo(from, to) {
    const _a = implicitCastMap.get(from), _b = _a != null ? _a.has(to) : null;
    return _b != null ? _b : false;
}
exports.isImplicitlyCastableTo = isImplicitlyCastableTo;
;
function literalToTypeSet(type) {
    if (type && type.__element__) {
        return type;
    }
    if (typeof type === "number") {
        return literal.$getType("00000000-0000-0000-0000-0000000001ff")(type);
    }
    if (typeof type === "string") {
        return literal.$getType("00000000-0000-0000-0000-000000000101")(type);
    }
    if (typeof type === "boolean") {
        return literal.$getType("00000000-0000-0000-0000-000000000109")(type);
    }
    if (typeof type === "bigint") {
        return literal.$getType("00000000-0000-0000-0000-000000000110")(type);
    }
    if (type instanceof Uint8Array) {
        return literal.$getType("00000000-0000-0000-0000-000000000102")(type);
    }
    if (type instanceof Date) {
        return literal.$getType("00000000-0000-0000-0000-00000000010a")(type);
    }
    if (type instanceof edgedb.Duration) {
        return literal.$getType("00000000-0000-0000-0000-00000000010e")(type);
    }
    if (type instanceof edgedb.LocalDateTime) {
        return literal.$getType("00000000-0000-0000-0000-00000000010b")(type);
    }
    if (type instanceof edgedb.LocalDate) {
        return literal.$getType("00000000-0000-0000-0000-00000000010c")(type);
    }
    if (type instanceof edgedb.LocalTime) {
        return literal.$getType("00000000-0000-0000-0000-00000000010d")(type);
    }
    if (type instanceof edgedb.RelativeDuration) {
        return literal.$getType("00000000-0000-0000-0000-000000000111")(type);
    }
    if (type instanceof edgedb.DateDuration) {
        return literal.$getType("00000000-0000-0000-0000-000000000112")(type);
    }
    if (type instanceof edgedb.ConfigMemory) {
        return literal.$getType("00000000-0000-0000-0000-000000000130")(type);
    }
    throw new Error(`Cannot convert literal '${type}' into scalar type`);
}
exports.literalToTypeSet = literalToTypeSet;
