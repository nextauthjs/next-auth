import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
export declare type $AllowBareDDL = {
    AlwaysAllow: $.$expr_Literal<$AllowBareDDL>;
    NeverAllow: $.$expr_Literal<$AllowBareDDL>;
} & $.EnumType<"cfg::AllowBareDDL", ["AlwaysAllow", "NeverAllow"]>;
declare const AllowBareDDL: $AllowBareDDL;
export declare type $ConnectionTransport = {
    TCP: $.$expr_Literal<$ConnectionTransport>;
    HTTP: $.$expr_Literal<$ConnectionTransport>;
} & $.EnumType<"cfg::ConnectionTransport", ["TCP", "HTTP"]>;
declare const ConnectionTransport: $ConnectionTransport;
export declare type $memory = $.ScalarType<"cfg::memory", _.edgedb.ConfigMemory>;
declare const memory: $.scalarTypeWithConstructor<$memory, string>;
export declare type $ConfigObjectλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {}>;
declare type $ConfigObject = $.ObjectType<"cfg::ConfigObject", $ConfigObjectλShape, null, [
    ..._std.$BaseObject['__exclusives__']
]>;
declare const $ConfigObject: $ConfigObject;
declare const ConfigObject: $.$expr_PathNode<$.TypeSet<$ConfigObject, $.Cardinality.Many>, null>;
export declare type $AbstractConfigλShape = $.typeutil.flatten<$ConfigObjectλShape & {
    "auth": $.LinkDesc<$Auth, $.Cardinality.Many, {}, false, false, false, false>;
    "session_idle_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
    "session_idle_transaction_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
    "query_execution_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, false>;
    "listen_port": $.PropertyDesc<_std.$int16, $.Cardinality.One, false, false, false, true>;
    "listen_addresses": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, false, false>;
    "allow_dml_in_functions": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
    "allow_bare_ddl": $.PropertyDesc<$AllowBareDDL, $.Cardinality.AtMostOne, false, false, false, true>;
    "apply_access_policies": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
    "allow_user_specified_id": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
    "shared_buffers": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
    "query_work_mem": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
    "effective_cache_size": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
    "effective_io_concurrency": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
    "default_statistics_target": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
declare type $AbstractConfig = $.ObjectType<"cfg::AbstractConfig", $AbstractConfigλShape, null, [
    ...$ConfigObject['__exclusives__']
]>;
declare const $AbstractConfig: $AbstractConfig;
declare const AbstractConfig: $.$expr_PathNode<$.TypeSet<$AbstractConfig, $.Cardinality.Many>, null>;
export declare type $AuthλShape = $.typeutil.flatten<$ConfigObjectλShape & {
    "method": $.LinkDesc<$AuthMethod, $.Cardinality.AtMostOne, {}, true, false, true, false>;
    "priority": $.PropertyDesc<_std.$int64, $.Cardinality.One, true, false, true, false>;
    "user": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, true, true>;
    "comment": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, true, false>;
    "<auth[is cfg::AbstractConfig]": $.LinkDesc<$AbstractConfig, $.Cardinality.Many, {}, false, false, false, false>;
    "<auth[is cfg::Config]": $.LinkDesc<$Config, $.Cardinality.Many, {}, false, false, false, false>;
    "<auth[is cfg::InstanceConfig]": $.LinkDesc<$InstanceConfig, $.Cardinality.Many, {}, false, false, false, false>;
    "<auth[is cfg::DatabaseConfig]": $.LinkDesc<$DatabaseConfig, $.Cardinality.Many, {}, false, false, false, false>;
    "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Auth = $.ObjectType<"cfg::Auth", $AuthλShape, null, [
    ...$ConfigObject['__exclusives__'],
    {
        priority: {
            __element__: _std.$int64;
            __cardinality__: $.Cardinality.One;
        };
    },
    {
        method: {
            __element__: $AuthMethod;
            __cardinality__: $.Cardinality.AtMostOne;
        };
    }
]>;
declare const $Auth: $Auth;
declare const Auth: $.$expr_PathNode<$.TypeSet<$Auth, $.Cardinality.Many>, null>;
export declare type $AuthMethodλShape = $.typeutil.flatten<$ConfigObjectλShape & {
    "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, false>;
    "<method[is cfg::Auth]": $.LinkDesc<$Auth, $.Cardinality.AtMostOne, {}, true, false, false, false>;
    "<method": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $AuthMethod = $.ObjectType<"cfg::AuthMethod", $AuthMethodλShape, null, [
    ...$ConfigObject['__exclusives__']
]>;
declare const $AuthMethod: $AuthMethod;
declare const AuthMethod: $.$expr_PathNode<$.TypeSet<$AuthMethod, $.Cardinality.Many>, null>;
export declare type $ConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {}>;
declare type $Config = $.ObjectType<"cfg::Config", $ConfigλShape, null, [
    ...$AbstractConfig['__exclusives__']
]>;
declare const $Config: $Config;
declare const Config: $.$expr_PathNode<$.TypeSet<$Config, $.Cardinality.Many>, null>;
export declare type $DatabaseConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {}>;
declare type $DatabaseConfig = $.ObjectType<"cfg::DatabaseConfig", $DatabaseConfigλShape, null, [
    ...$AbstractConfig['__exclusives__']
]>;
declare const $DatabaseConfig: $DatabaseConfig;
declare const DatabaseConfig: $.$expr_PathNode<$.TypeSet<$DatabaseConfig, $.Cardinality.Many>, null>;
export declare type $InstanceConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {}>;
declare type $InstanceConfig = $.ObjectType<"cfg::InstanceConfig", $InstanceConfigλShape, null, [
    ...$AbstractConfig['__exclusives__']
]>;
declare const $InstanceConfig: $InstanceConfig;
declare const InstanceConfig: $.$expr_PathNode<$.TypeSet<$InstanceConfig, $.Cardinality.Many>, null>;
export declare type $JWTλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
    "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
declare type $JWT = $.ObjectType<"cfg::JWT", $JWTλShape, null, [
    ...$AuthMethod['__exclusives__']
]>;
declare const $JWT: $JWT;
declare const JWT: $.$expr_PathNode<$.TypeSet<$JWT, $.Cardinality.Many>, null>;
export declare type $SCRAMλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
    "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
declare type $SCRAM = $.ObjectType<"cfg::SCRAM", $SCRAMλShape, null, [
    ...$AuthMethod['__exclusives__']
]>;
declare const $SCRAM: $SCRAM;
declare const SCRAM: $.$expr_PathNode<$.TypeSet<$SCRAM, $.Cardinality.Many>, null>;
export declare type $TrustλShape = $.typeutil.flatten<$AuthMethodλShape & {}>;
declare type $Trust = $.ObjectType<"cfg::Trust", $TrustλShape, null, [
    ...$AuthMethod['__exclusives__']
]>;
declare const $Trust: $Trust;
declare const Trust: $.$expr_PathNode<$.TypeSet<$Trust, $.Cardinality.Many>, null>;
declare type get_config_jsonλFuncExpr<NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>;
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>;
}> = $.$expr_Function<_std.$json, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<NamedArgs["sources"]>, $.cardutil.optionalParamCardinality<NamedArgs["max_source"]>>>;
declare function get_config_json<NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>;
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>;
}>(namedArgs: NamedArgs): get_config_jsonλFuncExpr<NamedArgs>;
export { AllowBareDDL, ConnectionTransport, memory, $ConfigObject, ConfigObject, $AbstractConfig, AbstractConfig, $Auth, Auth, $AuthMethod, AuthMethod, $Config, Config, $DatabaseConfig, DatabaseConfig, $InstanceConfig, InstanceConfig, $JWT, JWT, $SCRAM, SCRAM, $Trust, Trust };
declare type __defaultExports = {
    "AllowBareDDL": typeof AllowBareDDL;
    "ConnectionTransport": typeof ConnectionTransport;
    "memory": typeof memory;
    "ConfigObject": typeof ConfigObject;
    "AbstractConfig": typeof AbstractConfig;
    "Auth": typeof Auth;
    "AuthMethod": typeof AuthMethod;
    "Config": typeof Config;
    "DatabaseConfig": typeof DatabaseConfig;
    "InstanceConfig": typeof InstanceConfig;
    "JWT": typeof JWT;
    "SCRAM": typeof SCRAM;
    "Trust": typeof Trust;
    "get_config_json": typeof get_config_json;
};
declare const __defaultExports: __defaultExports;
export default __defaultExports;
