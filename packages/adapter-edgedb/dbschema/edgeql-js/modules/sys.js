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
exports.Role = exports.$Role = exports.ExtensionPackage = exports.$ExtensionPackage = exports.Database = exports.$Database = exports.SystemObject = exports.$SystemObject = exports.VersionStage = exports.TransactionIsolation = void 0;
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
const TransactionIsolation = $.makeType(_.spec, "a4d5fd52-5b25-11ed-afd7-1dd92c0c6004", _.syntax.literal);
exports.TransactionIsolation = TransactionIsolation;
const VersionStage = $.makeType(_.spec, "a4d6c0f1-5b25-11ed-9c86-dbd822c67b63", _.syntax.literal);
exports.VersionStage = VersionStage;
const $SystemObject = $.makeType(_.spec, "a4d77cf9-5b25-11ed-b17f-55c17e71c709", _.syntax.literal);
exports.$SystemObject = $SystemObject;
const SystemObject = _.syntax.$PathNode($.$toSet($SystemObject, $.Cardinality.Many), null);
exports.SystemObject = SystemObject;
const $Database = $.makeType(_.spec, "a4f9c05e-5b25-11ed-88c0-95ef847098c2", _.syntax.literal);
exports.$Database = $Database;
const Database = _.syntax.$PathNode($.$toSet($Database, $.Cardinality.Many), null);
exports.Database = Database;
const $ExtensionPackage = $.makeType(_.spec, "a520c8b1-5b25-11ed-b415-61d7c8067919", _.syntax.literal);
exports.$ExtensionPackage = $ExtensionPackage;
const ExtensionPackage = _.syntax.$PathNode($.$toSet($ExtensionPackage, $.Cardinality.Many), null);
exports.ExtensionPackage = ExtensionPackage;
const $Role = $.makeType(_.spec, "a54da225-5b25-11ed-9c3a-855108e1b0cd", _.syntax.literal);
exports.$Role = $Role;
const Role = _.syntax.$PathNode($.$toSet($Role, $.Cardinality.Many), null);
exports.Role = Role;
function get_version(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('sys::get_version', args, _.spec, [
        { args: [], returnTypeId: "3c001a4d-0fb0-95c1-dc35-e5175be5b424" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "sys::get_version",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function get_version_as_str(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('sys::get_version_as_str', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "sys::get_version_as_str",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function get_instance_name(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('sys::get_instance_name', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "sys::get_instance_name",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function get_transaction_isolation(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('sys::get_transaction_isolation', args, _.spec, [
        { args: [], returnTypeId: "a4d5fd52-5b25-11ed-afd7-1dd92c0c6004" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "sys::get_transaction_isolation",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
function get_current_database(...args) {
    const { returnType, cardinality, args: positionalArgs, namedArgs } = _.syntax.$resolveOverload('sys::get_current_database', args, _.spec, [
        { args: [], returnTypeId: "00000000-0000-0000-0000-000000000101" },
    ]);
    return _.syntax.$expressionify({
        __kind__: $.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "sys::get_current_database",
        __args__: positionalArgs,
        __namedargs__: namedArgs,
    });
}
;
const __defaultExports = {
    "TransactionIsolation": TransactionIsolation,
    "VersionStage": VersionStage,
    "SystemObject": SystemObject,
    "Database": Database,
    "ExtensionPackage": ExtensionPackage,
    "Role": Role,
    "get_version": get_version,
    "get_version_as_str": get_version_as_str,
    "get_instance_name": get_instance_name,
    "get_transaction_isolation": get_transaction_isolation,
    "get_current_database": get_current_database
};
exports.default = __defaultExports;
