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
exports.Trust = exports.$Trust = exports.SCRAM = exports.$SCRAM = exports.JWT = exports.$JWT = exports.InstanceConfig = exports.$InstanceConfig = exports.DatabaseConfig = exports.$DatabaseConfig = exports.Config = exports.$Config = exports.AuthMethod = exports.$AuthMethod = exports.Auth = exports.$Auth = exports.AbstractConfig = exports.$AbstractConfig = exports.ConfigObject = exports.$ConfigObject = exports.memory = exports.ConnectionTransport = exports.AllowBareDDL = void 0;
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
const AllowBareDDL = $.makeType(_.spec, "a5aeab05-5b25-11ed-b192-0f78eac1b808", _.syntax.literal);
exports.AllowBareDDL = AllowBareDDL;
const ConnectionTransport = $.makeType(_.spec, "a5af62e9-5b25-11ed-b69d-5f7de1b22ce0", _.syntax.literal);
exports.ConnectionTransport = ConnectionTransport;
const memory = $.makeType(_.spec, "00000000-0000-0000-0000-000000000130", _.syntax.literal);
exports.memory = memory;
const $ConfigObject = $.makeType(_.spec, "a5b02a36-5b25-11ed-8253-5f9d5c0406ec", _.syntax.literal);
exports.$ConfigObject = $ConfigObject;
const ConfigObject = _.syntax.$PathNode($.$toSet($ConfigObject, $.Cardinality.Many), null);
exports.ConfigObject = ConfigObject;
const $AbstractConfig = $.makeType(_.spec, "a612af12-5b25-11ed-a911-959a6ed8c954", _.syntax.literal);
exports.$AbstractConfig = $AbstractConfig;
const AbstractConfig = _.syntax.$PathNode($.$toSet($AbstractConfig, $.Cardinality.Many), null);
exports.AbstractConfig = AbstractConfig;
const $Auth = $.makeType(_.spec, "a5f7a012-5b25-11ed-98c0-43529f56c34f", _.syntax.literal);
exports.$Auth = $Auth;
const Auth = _.syntax.$PathNode($.$toSet($Auth, $.Cardinality.Many), null);
exports.Auth = Auth;
const $AuthMethod = $.makeType(_.spec, "a5bcd9b3-5b25-11ed-a930-53efcf4687cc", _.syntax.literal);
exports.$AuthMethod = $AuthMethod;
const AuthMethod = _.syntax.$PathNode($.$toSet($AuthMethod, $.Cardinality.Many), null);
exports.AuthMethod = AuthMethod;
const $Config = $.makeType(_.spec, "a643a7c6-5b25-11ed-97ee-5fd6f571a987", _.syntax.literal);
exports.$Config = $Config;
const Config = _.syntax.$PathNode($.$toSet($Config, $.Cardinality.Many), null);
exports.Config = Config;
const $DatabaseConfig = $.makeType(_.spec, "a6b02c97-5b25-11ed-a857-d14ff05b5f17", _.syntax.literal);
exports.$DatabaseConfig = $DatabaseConfig;
const DatabaseConfig = _.syntax.$PathNode($.$toSet($DatabaseConfig, $.Cardinality.Many), null);
exports.DatabaseConfig = DatabaseConfig;
const $InstanceConfig = $.makeType(_.spec, "a679ec11-5b25-11ed-8b15-c58ac44b629a", _.syntax.literal);
exports.$InstanceConfig = $InstanceConfig;
const InstanceConfig = _.syntax.$PathNode($.$toSet($InstanceConfig, $.Cardinality.Many), null);
exports.InstanceConfig = InstanceConfig;
const $JWT = $.makeType(_.spec, "a5e8122a-5b25-11ed-b248-13c475b4c5a6", _.syntax.literal);
exports.$JWT = $JWT;
const JWT = _.syntax.$PathNode($.$toSet($JWT, $.Cardinality.Many), null);
exports.JWT = JWT;
const $SCRAM = $.makeType(_.spec, "a5d887bc-5b25-11ed-b7bf-7ba059478eaa", _.syntax.literal);
exports.$SCRAM = $SCRAM;
const SCRAM = _.syntax.$PathNode($.$toSet($SCRAM, $.Cardinality.Many), null);
exports.SCRAM = SCRAM;
const $Trust = $.makeType(_.spec, "a5ca6615-5b25-11ed-9221-fb8a83311425", _.syntax.literal);
exports.$Trust = $Trust;
const Trust = _.syntax.$PathNode($.$toSet($Trust, $.Cardinality.Many), null);
exports.Trust = Trust;
function get_config_json(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('cfg::get_config_json', args, _.spec, [
        { args: [], namedArgs: { "sources": { typeId: "05f91774-15ea-9001-038e-092c1cad80af", optional: true, setoftype: false, variadic: false }, "max_source": { typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false } }, returnTypeId: "00000000-0000-0000-0000-00000000010f" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "cfg::get_config_json",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
const __defaultExports = {
    "AllowBareDDL": AllowBareDDL,
    "ConnectionTransport": ConnectionTransport,
    "memory": memory,
    "ConfigObject": ConfigObject,
    "AbstractConfig": AbstractConfig,
    "Auth": Auth,
    "AuthMethod": AuthMethod,
    "Config": Config,
    "DatabaseConfig": DatabaseConfig,
    "InstanceConfig": InstanceConfig,
    "JWT": JWT,
    "SCRAM": SCRAM,
    "Trust": Trust,
    "get_config_json": get_config_json
};
exports.default = __defaultExports;
