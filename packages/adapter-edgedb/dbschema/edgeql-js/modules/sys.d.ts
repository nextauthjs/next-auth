import * as $ from "../reflection";
import type * as _schema from "./schema";
import type * as _std from "./std";
export declare type $TransactionIsolation = {
    RepeatableRead: $.$expr_Literal<$TransactionIsolation>;
    Serializable: $.$expr_Literal<$TransactionIsolation>;
} & $.EnumType<"sys::TransactionIsolation", ["RepeatableRead", "Serializable"]>;
declare const TransactionIsolation: $TransactionIsolation;
export declare type $VersionStage = {
    dev: $.$expr_Literal<$VersionStage>;
    alpha: $.$expr_Literal<$VersionStage>;
    beta: $.$expr_Literal<$VersionStage>;
    rc: $.$expr_Literal<$VersionStage>;
    final: $.$expr_Literal<$VersionStage>;
} & $.EnumType<"sys::VersionStage", ["dev", "alpha", "beta", "rc", "final"]>;
declare const VersionStage: $VersionStage;
export declare type $SystemObjectλShape = $.typeutil.flatten<_schema.$AnnotationSubjectλShape & {}>;
declare type $SystemObject = $.ObjectType<"sys::SystemObject", $SystemObjectλShape, null, [
    ..._schema.$AnnotationSubject['__exclusives__']
]>;
declare const $SystemObject: $SystemObject;
declare const SystemObject: $.$expr_PathNode<$.TypeSet<$SystemObject, $.Cardinality.Many>, null>;
export declare type $DatabaseλShape = $.typeutil.flatten<$SystemObjectλShape & _schema.$AnnotationSubjectλShape & {
    "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
}>;
declare type $Database = $.ObjectType<"sys::Database", $DatabaseλShape, null, [
    ...$SystemObject['__exclusives__'],
    ..._schema.$AnnotationSubject['__exclusives__'],
    {
        name: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
    }
]>;
declare const $Database: $Database;
declare const Database: $.$expr_PathNode<$.TypeSet<$Database, $.Cardinality.Many>, null>;
export declare type $ExtensionPackageλShape = $.typeutil.flatten<$SystemObjectλShape & _schema.$AnnotationSubjectλShape & {
    "script": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "version": $.PropertyDesc<$.NamedTupleType<{
        major: _std.$int64;
        minor: _std.$int64;
        stage: $VersionStage;
        stage_no: _std.$int64;
        local: $.ArrayType<_std.$str>;
    }>, $.Cardinality.One, false, false, false, false>;
    "<package[is schema::Extension]": $.LinkDesc<_schema.$Extension, $.Cardinality.AtMostOne, {}, true, false, false, false>;
    "<package": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $ExtensionPackage = $.ObjectType<"sys::ExtensionPackage", $ExtensionPackageλShape, null, [
    ...$SystemObject['__exclusives__'],
    ..._schema.$AnnotationSubject['__exclusives__']
]>;
declare const $ExtensionPackage: $ExtensionPackage;
declare const ExtensionPackage: $.$expr_PathNode<$.TypeSet<$ExtensionPackage, $.Cardinality.Many>, null>;
export declare type $RoleλShape = $.typeutil.flatten<$SystemObjectλShape & _schema.$InheritingObjectλShape & _schema.$AnnotationSubjectλShape & {
    "member_of": $.LinkDesc<$Role, $.Cardinality.Many, {}, false, false, false, false>;
    "superuser": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, false>;
    "password": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
    "is_superuser": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
    "<member_of[is sys::Role]": $.LinkDesc<$Role, $.Cardinality.Many, {}, false, false, false, false>;
    "<member_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Role = $.ObjectType<"sys::Role", $RoleλShape, null, [
    ...$SystemObject['__exclusives__'],
    ..._schema.$InheritingObject['__exclusives__'],
    ..._schema.$AnnotationSubject['__exclusives__'],
    {
        name: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
    }
]>;
declare const $Role: $Role;
declare const Role: $.$expr_PathNode<$.TypeSet<$Role, $.Cardinality.Many>, null>;
declare type get_versionλFuncExpr = $.$expr_Function<$.NamedTupleType<{
    major: _std.$int64;
    minor: _std.$int64;
    stage: $VersionStage;
    stage_no: _std.$int64;
    local: $.ArrayType<_std.$str>;
}>, $.Cardinality.One>;
/**
 * Return the server version as a tuple.
 */
declare function get_version(): get_versionλFuncExpr;
declare type get_version_as_strλFuncExpr = $.$expr_Function<_std.$str, $.Cardinality.One>;
/**
 * Return the server version as a string.
 */
declare function get_version_as_str(): get_version_as_strλFuncExpr;
declare type get_instance_nameλFuncExpr = $.$expr_Function<_std.$str, $.Cardinality.One>;
/**
 * Return the server instance name.
 */
declare function get_instance_name(): get_instance_nameλFuncExpr;
declare type get_transaction_isolationλFuncExpr = $.$expr_Function<$TransactionIsolation, $.Cardinality.One>;
/**
 * Return the isolation level of the current transaction.
 */
declare function get_transaction_isolation(): get_transaction_isolationλFuncExpr;
declare type get_current_databaseλFuncExpr = $.$expr_Function<_std.$str, $.Cardinality.One>;
/**
 * Return the name of the current database as a string.
 */
declare function get_current_database(): get_current_databaseλFuncExpr;
export { TransactionIsolation, VersionStage, $SystemObject, SystemObject, $Database, Database, $ExtensionPackage, ExtensionPackage, $Role, Role };
declare type __defaultExports = {
    "TransactionIsolation": typeof TransactionIsolation;
    "VersionStage": typeof VersionStage;
    "SystemObject": typeof SystemObject;
    "Database": typeof Database;
    "ExtensionPackage": typeof ExtensionPackage;
    "Role": typeof Role;
    "get_version": typeof get_version;
    "get_version_as_str": typeof get_version_as_str;
    "get_instance_name": typeof get_instance_name;
    "get_transaction_isolation": typeof get_transaction_isolation;
    "get_current_database": typeof get_current_database;
};
declare const __defaultExports: __defaultExports;
export default __defaultExports;
