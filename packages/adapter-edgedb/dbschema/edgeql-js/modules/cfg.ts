import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
export type $AllowBareDDL = {
  AlwaysAllow: $.$expr_Literal<$AllowBareDDL>;
  NeverAllow: $.$expr_Literal<$AllowBareDDL>;
} & $.EnumType<"cfg::AllowBareDDL", ["AlwaysAllow", "NeverAllow"]>;
const AllowBareDDL: $AllowBareDDL = $.makeType<$AllowBareDDL>(_.spec, "a5aeab05-5b25-11ed-b192-0f78eac1b808", _.syntax.literal);

export type $ConnectionTransport = {
  TCP: $.$expr_Literal<$ConnectionTransport>;
  HTTP: $.$expr_Literal<$ConnectionTransport>;
} & $.EnumType<"cfg::ConnectionTransport", ["TCP", "HTTP"]>;
const ConnectionTransport: $ConnectionTransport = $.makeType<$ConnectionTransport>(_.spec, "a5af62e9-5b25-11ed-b69d-5f7de1b22ce0", _.syntax.literal);

export type $memory = $.ScalarType<"cfg::memory", _.edgedb.ConfigMemory>;
const memory: $.scalarTypeWithConstructor<$memory, string> = $.makeType<$.scalarTypeWithConstructor<$memory, string>>(_.spec, "00000000-0000-0000-0000-000000000130", _.syntax.literal);

export type $ConfigObjectλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
}>;
type $ConfigObject = $.ObjectType<"cfg::ConfigObject", $ConfigObjectλShape, null, [
  ..._std.$BaseObject['__exclusives__'],
]>;
const $ConfigObject = $.makeType<$ConfigObject>(_.spec, "a5b02a36-5b25-11ed-8253-5f9d5c0406ec", _.syntax.literal);

const ConfigObject: $.$expr_PathNode<$.TypeSet<$ConfigObject, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ConfigObject, $.Cardinality.Many), null);

export type $AbstractConfigλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "auth": $.LinkDesc<$Auth, $.Cardinality.Many, {}, false, false,  false, false>;
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
type $AbstractConfig = $.ObjectType<"cfg::AbstractConfig", $AbstractConfigλShape, null, [
  ...$ConfigObject['__exclusives__'],
]>;
const $AbstractConfig = $.makeType<$AbstractConfig>(_.spec, "a612af12-5b25-11ed-a911-959a6ed8c954", _.syntax.literal);

const AbstractConfig: $.$expr_PathNode<$.TypeSet<$AbstractConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AbstractConfig, $.Cardinality.Many), null);

export type $AuthλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "method": $.LinkDesc<$AuthMethod, $.Cardinality.AtMostOne, {}, true, false,  true, false>;
  "priority": $.PropertyDesc<_std.$int64, $.Cardinality.One, true, false, true, false>;
  "user": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, true, true>;
  "comment": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, true, false>;
  "<auth[is cfg::AbstractConfig]": $.LinkDesc<$AbstractConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::Config]": $.LinkDesc<$Config, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::InstanceConfig]": $.LinkDesc<$InstanceConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::DatabaseConfig]": $.LinkDesc<$DatabaseConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Auth = $.ObjectType<"cfg::Auth", $AuthλShape, null, [
  ...$ConfigObject['__exclusives__'],
  {priority: {__element__: _std.$int64, __cardinality__: $.Cardinality.One},},
  {method: {__element__: $AuthMethod, __cardinality__: $.Cardinality.AtMostOne},},
]>;
const $Auth = $.makeType<$Auth>(_.spec, "a5f7a012-5b25-11ed-98c0-43529f56c34f", _.syntax.literal);

const Auth: $.$expr_PathNode<$.TypeSet<$Auth, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Auth, $.Cardinality.Many), null);

export type $AuthMethodλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, false>;
  "<method[is cfg::Auth]": $.LinkDesc<$Auth, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<method": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $AuthMethod = $.ObjectType<"cfg::AuthMethod", $AuthMethodλShape, null, [
  ...$ConfigObject['__exclusives__'],
]>;
const $AuthMethod = $.makeType<$AuthMethod>(_.spec, "a5bcd9b3-5b25-11ed-a930-53efcf4687cc", _.syntax.literal);

const AuthMethod: $.$expr_PathNode<$.TypeSet<$AuthMethod, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AuthMethod, $.Cardinality.Many), null);

export type $ConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $Config = $.ObjectType<"cfg::Config", $ConfigλShape, null, [
  ...$AbstractConfig['__exclusives__'],
]>;
const $Config = $.makeType<$Config>(_.spec, "a643a7c6-5b25-11ed-97ee-5fd6f571a987", _.syntax.literal);

const Config: $.$expr_PathNode<$.TypeSet<$Config, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Config, $.Cardinality.Many), null);

export type $DatabaseConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $DatabaseConfig = $.ObjectType<"cfg::DatabaseConfig", $DatabaseConfigλShape, null, [
  ...$AbstractConfig['__exclusives__'],
]>;
const $DatabaseConfig = $.makeType<$DatabaseConfig>(_.spec, "a6b02c97-5b25-11ed-a857-d14ff05b5f17", _.syntax.literal);

const DatabaseConfig: $.$expr_PathNode<$.TypeSet<$DatabaseConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($DatabaseConfig, $.Cardinality.Many), null);

export type $InstanceConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $InstanceConfig = $.ObjectType<"cfg::InstanceConfig", $InstanceConfigλShape, null, [
  ...$AbstractConfig['__exclusives__'],
]>;
const $InstanceConfig = $.makeType<$InstanceConfig>(_.spec, "a679ec11-5b25-11ed-8b15-c58ac44b629a", _.syntax.literal);

const InstanceConfig: $.$expr_PathNode<$.TypeSet<$InstanceConfig, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($InstanceConfig, $.Cardinality.Many), null);

export type $JWTλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
type $JWT = $.ObjectType<"cfg::JWT", $JWTλShape, null, [
  ...$AuthMethod['__exclusives__'],
]>;
const $JWT = $.makeType<$JWT>(_.spec, "a5e8122a-5b25-11ed-b248-13c475b4c5a6", _.syntax.literal);

const JWT: $.$expr_PathNode<$.TypeSet<$JWT, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($JWT, $.Cardinality.Many), null);

export type $SCRAMλShape = $.typeutil.flatten<Omit<$AuthMethodλShape, "transports"> & {
  "transports": $.PropertyDesc<$ConnectionTransport, $.Cardinality.Many, false, false, true, true>;
}>;
type $SCRAM = $.ObjectType<"cfg::SCRAM", $SCRAMλShape, null, [
  ...$AuthMethod['__exclusives__'],
]>;
const $SCRAM = $.makeType<$SCRAM>(_.spec, "a5d887bc-5b25-11ed-b7bf-7ba059478eaa", _.syntax.literal);

const SCRAM: $.$expr_PathNode<$.TypeSet<$SCRAM, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($SCRAM, $.Cardinality.Many), null);

export type $TrustλShape = $.typeutil.flatten<$AuthMethodλShape & {
}>;
type $Trust = $.ObjectType<"cfg::Trust", $TrustλShape, null, [
  ...$AuthMethod['__exclusives__'],
]>;
const $Trust = $.makeType<$Trust>(_.spec, "a5ca6615-5b25-11ed-9221-fb8a83311425", _.syntax.literal);

const Trust: $.$expr_PathNode<$.TypeSet<$Trust, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Trust, $.Cardinality.Many), null);

type get_config_jsonλFuncExpr<
  NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>,
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  },
> = $.$expr_Function<
  _std.$json, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<NamedArgs["sources"]>, $.cardutil.optionalParamCardinality<NamedArgs["max_source"]>>
>;
function get_config_json<
  NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>,
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  },
>(
  namedArgs: NamedArgs,
): get_config_jsonλFuncExpr<NamedArgs>;
function get_config_json(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('cfg::get_config_json', args, _.spec, [
    {args: [], namedArgs: {"sources": {typeId: "05f91774-15ea-9001-038e-092c1cad80af", optional: true, setoftype: false, variadic: false}, "max_source": {typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false}}, returnTypeId: "00000000-0000-0000-0000-00000000010f"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "cfg::get_config_json",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};



export { AllowBareDDL, ConnectionTransport, memory, $ConfigObject, ConfigObject, $AbstractConfig, AbstractConfig, $Auth, Auth, $AuthMethod, AuthMethod, $Config, Config, $DatabaseConfig, DatabaseConfig, $InstanceConfig, InstanceConfig, $JWT, JWT, $SCRAM, SCRAM, $Trust, Trust };

type __defaultExports = {
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
  "get_config_json": typeof get_config_json
};
const __defaultExports: __defaultExports = {
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
export default __defaultExports;
