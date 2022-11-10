import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _cfg from "./cfg";
import type * as _cal from "./cal";
import type * as _schema from "./schema";
declare type $anyscalar = $anypoint | $anyreal | $.EnumType | $bool | $bytes | $uuid | $str | $json | $datetime | $duration | _cfg.$memory | _cal.$local_datetime | _cal.$local_date | _cal.$local_time | _cal.$relative_duration | _cal.$date_duration;
declare type $anypoint = $anydiscrete | $anycontiguous;
declare type $anydiscrete = $number | _cal.$local_date;
declare type $anycontiguous = $anyfloat | $datetime | $duration | $decimal | _cal.$local_datetime;
export declare type $JsonEmpty = {
    ReturnEmpty: $.$expr_Literal<$JsonEmpty>;
    ReturnTarget: $.$expr_Literal<$JsonEmpty>;
    Error: $.$expr_Literal<$JsonEmpty>;
    UseNull: $.$expr_Literal<$JsonEmpty>;
    DeleteKey: $.$expr_Literal<$JsonEmpty>;
} & $.EnumType<"std::JsonEmpty", ["ReturnEmpty", "ReturnTarget", "Error", "UseNull", "DeleteKey"]>;
declare const JsonEmpty: $JsonEmpty;
declare type $anyreal = $anyint | $anyfloat | $anynumeric;
declare type $anyfloat = $number;
declare type $anyint = $number | $bigint;
declare type $anynumeric = $decimal | $bigint;
export declare type $bigint = $.ScalarType<"std::bigint", bigint>;
declare const bigint: $.scalarTypeWithConstructor<$bigint, never>;
export declare type $bool = $.ScalarType<"std::bool", boolean>;
declare const bool: $.scalarTypeWithConstructor<$bool, never>;
export declare type $bytes = $.ScalarType<"std::bytes", Uint8Array>;
declare const bytes: $.scalarTypeWithConstructor<$bytes, never>;
export declare type $datetime = $.ScalarType<"std::datetime", Date>;
declare const datetime: $.scalarTypeWithConstructor<$datetime, string>;
export declare type $decimal = $.ScalarType<"std::decimal", unknown>;
declare const decimal: $.scalarTypeWithConstructor<$decimal, never>;
export declare type $decimalλICastableTo = $decimal | $bigint;
export declare type $decimalλIAssignableBy = $decimal | $bigint;
export declare type $duration = $.ScalarType<"std::duration", _.edgedb.Duration>;
declare const duration: $.scalarTypeWithConstructor<$duration, string>;
export declare type $float32 = $.ScalarType<"std::number", number>;
declare const float32: $.scalarTypeWithConstructor<$number, string>;
export declare type $float64 = $.ScalarType<"std::number", number>;
declare const float64: $.scalarTypeWithConstructor<$number, string>;
export declare type $int16 = $.ScalarType<"std::number", number>;
declare const int16: $.scalarTypeWithConstructor<$number, string>;
export declare type $int32 = $.ScalarType<"std::number", number>;
declare const int32: $.scalarTypeWithConstructor<$number, string>;
export declare type $int64 = $.ScalarType<"std::number", number>;
declare const int64: $.scalarTypeWithConstructor<$number, string>;
export declare type $json = $.ScalarType<"std::json", unknown>;
declare const json: $.scalarTypeWithConstructor<$json, never>;
interface $sequence extends $int64 {
}
declare const $sequence: $sequence;
export declare type $str = $.ScalarType<"std::str", string>;
declare const str: $.scalarTypeWithConstructor<$str, never>;
export declare type $uuid = $.ScalarType<"std::uuid", string>;
declare const uuid: $.scalarTypeWithConstructor<$uuid, never>;
export declare type $number = $.ScalarType<"std::number", number>;
declare const number: $.scalarTypeWithConstructor<$number, string>;
export declare type $BaseObjectλShape = $.typeutil.flatten<{
    "__type__": $.LinkDesc<_schema.$ObjectType, $.Cardinality.One, {}, false, false, true, false>;
    "id": $.PropertyDesc<$uuid, $.Cardinality.One, true, false, true, true>;
}>;
declare type $BaseObject = $.ObjectType<"std::BaseObject", $BaseObjectλShape, null, [
    {
        id: {
            __element__: $uuid;
            __cardinality__: $.Cardinality.One;
        };
    }
]>;
declare const $BaseObject: $BaseObject;
declare const BaseObject: $.$expr_PathNode<$.TypeSet<$BaseObject, $.Cardinality.Many>, null>;
export declare type $Object_9d92cf705b2511ed848a275bef45d8e3λShape = $.typeutil.flatten<$BaseObjectλShape & {}>;
declare type $Object_9d92cf705b2511ed848a275bef45d8e3 = $.ObjectType<"std::Object", $Object_9d92cf705b2511ed848a275bef45d8e3λShape, null, [
    ...$BaseObject['__exclusives__']
]>;
export declare type $Object = $Object_9d92cf705b2511ed848a275bef45d8e3;
declare const $Object_9d92cf705b2511ed848a275bef45d8e3: $Object_9d92cf705b2511ed848a275bef45d8e3;
declare const Object_9d92cf705b2511ed848a275bef45d8e3: $.$expr_PathNode<$.TypeSet<$Object_9d92cf705b2511ed848a275bef45d8e3, $.Cardinality.Many>, null>;
export declare type $FreeObjectλShape = $.typeutil.flatten<$BaseObjectλShape & {}>;
declare type $FreeObject = $.ObjectType<"std::FreeObject", $FreeObjectλShape, null, [
    ...$BaseObject['__exclusives__']
]>;
declare const $FreeObject: $FreeObject;
declare const FreeObject: $.$expr_PathNode<$.TypeSet<$FreeObject, $.Cardinality.One>, null>;
declare type assert_singleλFuncExpr<NamedArgs extends {
    "message"?: _.castMaps.orScalarLiteral<$.TypeSet<$str>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">, $.cardutil.optionalParamCardinality<NamedArgs["message"]>>>;
declare type assert_singleλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
/**
 * Check that the input set contains at most one element, raise
         CardinalityViolationError otherwise.
 */
declare function assert_single<NamedArgs extends {
    "message"?: _.castMaps.orScalarLiteral<$.TypeSet<$str>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(namedArgs: NamedArgs, input: P1): assert_singleλFuncExpr<NamedArgs, P1>;
/**
 * Check that the input set contains at most one element, raise
         CardinalityViolationError otherwise.
 */
declare function assert_single<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(input: P1): assert_singleλFuncExpr2<P1>;
declare type assert_existsλFuncExpr<NamedArgs extends {
    "message"?: _.castMaps.orScalarLiteral<$.TypeSet<$str>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type assert_existsλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.paramCardinality<P1>, "One">>;
/**
 * Check that the input set contains at least one element, raise
         CardinalityViolationError otherwise.
 */
declare function assert_exists<NamedArgs extends {
    "message"?: _.castMaps.orScalarLiteral<$.TypeSet<$str>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(namedArgs: NamedArgs, input: P1): assert_existsλFuncExpr<NamedArgs, P1>;
/**
 * Check that the input set contains at least one element, raise
         CardinalityViolationError otherwise.
 */
declare function assert_exists<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(input: P1): assert_existsλFuncExpr2<P1>;
declare type assert_distinctλFuncExpr<NamedArgs extends {
    "message"?: _.castMaps.orScalarLiteral<$.TypeSet<$str>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.Cardinality.Many>;
declare type assert_distinctλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.Cardinality.Many>;
/**
 * Check that the input set is a proper set, i.e. all elements
         are unique
 */
declare function assert_distinct<NamedArgs extends {
    "message"?: _.castMaps.orScalarLiteral<$.TypeSet<$str>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(namedArgs: NamedArgs, input: P1): assert_distinctλFuncExpr<NamedArgs, P1>;
/**
 * Check that the input set is a proper set, i.e. all elements
         are unique
 */
declare function assert_distinct<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(input: P1): assert_distinctλFuncExpr2<P1>;
declare type lenλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$number, $.cardutil.paramCardinality<P1>>;
declare type lenλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>> = $.$expr_Function<$number, $.cardutil.paramCardinality<P1>>;
declare type lenλFuncExpr3<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>> = $.$expr_Function<$number, $.cardutil.paramCardinality<P1>>;
/**
 * A polymorphic function to calculate a "length" of its first argument.
 */
declare function len<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(str: P1): lenλFuncExpr<P1>;
/**
 * A polymorphic function to calculate a "length" of its first argument.
 */
declare function len<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>>(bytes: P1): lenλFuncExpr2<P1>;
/**
 * A polymorphic function to calculate a "length" of its first argument.
 */
declare function len<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>>(array: P1): lenλFuncExpr3<P1>;
declare type sumλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bigint>>> = $.$expr_Function<$bigint, $.Cardinality.One>;
declare type sumλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.Cardinality.One>;
declare type sumλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>> = $.$expr_Function<$decimal, $.Cardinality.One>;
/**
 * Return the sum of the set of numbers.
 */
declare function sum<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bigint>>>(s: P1): sumλFuncExpr<P1>;
/**
 * Return the sum of the set of numbers.
 */
declare function sum<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(s: P1): sumλFuncExpr2<P1>;
/**
 * Return the sum of the set of numbers.
 */
declare function sum<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>>(s: P1): sumλFuncExpr3<P1>;
declare type countλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$number, $.Cardinality.One>;
/**
 * Return the number of elements in a set.
 */
declare function count<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(s: P1): countλFuncExpr<P1>;
declare type randomλFuncExpr = $.$expr_Function<$number, $.Cardinality.One>;
/**
 * Return a pseudo-random number in the range `0.0 <= x < 1.0`
 */
declare function random(): randomλFuncExpr;
declare type minλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$anyreal>>> = $.$expr_Function<$anyreal, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>> = $.$expr_Function<$.EnumType, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr4<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>> = $.$expr_Function<$datetime, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr5<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>> = $.$expr_Function<$duration, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr6<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>> = $.$expr_Function<_cal.$local_date, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr7<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>> = $.$expr_Function<_cal.$local_time, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr8<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>> = $.$expr_Function<_cal.$date_duration, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr9<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>> = $.$expr_Function<$.ArrayType<_cal.$local_datetime>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr10<P1 extends $.TypeSet<$.ArrayType<_cal.$local_date>>> = $.$expr_Function<$.ArrayType<_cal.$local_date>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr11<P1 extends $.TypeSet<$.ArrayType<_cal.$local_time>>> = $.$expr_Function<$.ArrayType<_cal.$local_time>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr12<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>> = $.$expr_Function<$.ArrayType<_cal.$relative_duration>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr13<P1 extends $.TypeSet<$.ArrayType<_cal.$date_duration>>> = $.$expr_Function<$.ArrayType<_cal.$date_duration>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr14<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>> = $.$expr_Function<_cal.$local_datetime, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr15<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>> = $.$expr_Function<_cal.$relative_duration, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type minλFuncExpr16<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$anyreal>>>(vals: P1): minλFuncExpr<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(vals: P1): minλFuncExpr2<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(vals: P1): minλFuncExpr3<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>>(vals: P1): minλFuncExpr4<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>>(vals: P1): minλFuncExpr5<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(vals: P1): minλFuncExpr6<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(vals: P1): minλFuncExpr7<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>>(vals: P1): minλFuncExpr8<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(vals: P1): minλFuncExpr9<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends $.TypeSet<$.ArrayType<_cal.$local_date>>>(vals: P1): minλFuncExpr10<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends $.TypeSet<$.ArrayType<_cal.$local_time>>>(vals: P1): minλFuncExpr11<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(vals: P1): minλFuncExpr12<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends $.TypeSet<$.ArrayType<_cal.$date_duration>>>(vals: P1): minλFuncExpr13<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(vals: P1): minλFuncExpr14<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(vals: P1): minλFuncExpr15<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function min<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(vals: P1): minλFuncExpr16<P1>;
declare type maxλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$anyreal>>> = $.$expr_Function<$anyreal, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>> = $.$expr_Function<$.EnumType, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr4<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>> = $.$expr_Function<$datetime, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr5<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>> = $.$expr_Function<$duration, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr6<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>> = $.$expr_Function<_cal.$local_date, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr7<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>> = $.$expr_Function<_cal.$local_time, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr8<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>> = $.$expr_Function<_cal.$date_duration, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr9<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>> = $.$expr_Function<$.ArrayType<_cal.$local_datetime>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr10<P1 extends $.TypeSet<$.ArrayType<_cal.$local_date>>> = $.$expr_Function<$.ArrayType<_cal.$local_date>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr11<P1 extends $.TypeSet<$.ArrayType<_cal.$local_time>>> = $.$expr_Function<$.ArrayType<_cal.$local_time>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr12<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>> = $.$expr_Function<$.ArrayType<_cal.$relative_duration>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr13<P1 extends $.TypeSet<$.ArrayType<_cal.$date_duration>>> = $.$expr_Function<$.ArrayType<_cal.$date_duration>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr14<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>> = $.$expr_Function<_cal.$local_datetime, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr15<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>> = $.$expr_Function<_cal.$relative_duration, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
declare type maxλFuncExpr16<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.overrideUpperBound<$.cardutil.paramCardinality<P1>, "One">>;
/**
 * Return the greatest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$anyreal>>>(vals: P1): maxλFuncExpr<P1>;
/**
 * Return the greatest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(vals: P1): maxλFuncExpr2<P1>;
/**
 * Return the greatest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(vals: P1): maxλFuncExpr3<P1>;
/**
 * Return the greatest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>>(vals: P1): maxλFuncExpr4<P1>;
/**
 * Return the greatest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>>(vals: P1): maxλFuncExpr5<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(vals: P1): maxλFuncExpr6<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(vals: P1): maxλFuncExpr7<P1>;
/**
 * Return the greatest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>>(vals: P1): maxλFuncExpr8<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function max<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(vals: P1): maxλFuncExpr9<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function max<P1 extends $.TypeSet<$.ArrayType<_cal.$local_date>>>(vals: P1): maxλFuncExpr10<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function max<P1 extends $.TypeSet<$.ArrayType<_cal.$local_time>>>(vals: P1): maxλFuncExpr11<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function max<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(vals: P1): maxλFuncExpr12<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function max<P1 extends $.TypeSet<$.ArrayType<_cal.$date_duration>>>(vals: P1): maxλFuncExpr13<P1>;
/**
 * Return the smallest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(vals: P1): maxλFuncExpr14<P1>;
/**
 * Return the greatest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(vals: P1): maxλFuncExpr15<P1>;
/**
 * Return the greatest value of the input set.
 */
declare function max<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(vals: P1): maxλFuncExpr16<P1>;
declare type allλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bool>>> = $.$expr_Function<$bool, $.Cardinality.One>;
/**
 * Generalized boolean `AND` applied to the set of *values*.
 */
declare function all<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bool>>>(vals: P1): allλFuncExpr<P1>;
declare type anyλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bool>>> = $.$expr_Function<$bool, $.Cardinality.One>;
/**
 * Generalized boolean `OR` applied to the set of *values*.
 */
declare function any<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bool>>>(vals: P1): anyλFuncExpr<P1>;
declare type enumerateλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>> = $.$expr_Function<$.TupleType<[$int64, $.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>]>, $.Cardinality.Many>;
/**
 * Return a set of tuples of the form `(index, element)`.
 */
declare function enumerate<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(vals: P1): enumerateλFuncExpr<P1>;
declare type roundλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.paramCardinality<P1>>;
declare type roundλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bigint>>> = $.$expr_Function<$bigint, $.cardutil.paramCardinality<P1>>;
declare type roundλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>> = $.$expr_Function<$decimal, $.cardutil.paramCardinality<P1>>;
declare type roundλFuncExpr4<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Round to the nearest value.
 */
declare function round<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1): roundλFuncExpr<P1>;
/**
 * Round to the nearest value.
 */
declare function round<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bigint>>>(val: P1): roundλFuncExpr2<P1>;
/**
 * Round to the nearest value.
 */
declare function round<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>>(val: P1): roundλFuncExpr3<P1>;
/**
 * Round to the nearest value.
 */
declare function round<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1, d: P2): roundλFuncExpr4<P1, P2>;
declare type containsλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr3<P1 extends $.TypeSet<$.RangeType<$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr4<P1 extends $.TypeSet<$.RangeType<$anypoint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr5<P1 extends $.TypeSet<$.RangeType<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr6<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr7<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr8<P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends $.TypeSet<$decimalλICastableTo>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr9<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ObjectType>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr10<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.AnyTupleType>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type containsλFuncExpr11<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * A polymorphic function to test if a sequence contains a certain element.
 */
declare function contains<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(haystack: P1, needle: P2): containsλFuncExpr<P1, P2>;
/**
 * A polymorphic function to test if a sequence contains a certain element.
 */
declare function contains<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>>(haystack: P1, needle: P2): containsλFuncExpr2<P1, P2>;
declare function contains<P1 extends $.TypeSet<$.RangeType<$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(haystack: P1, needle: P2): containsλFuncExpr3<P1, P2>;
declare function contains<P1 extends $.TypeSet<$.RangeType<$anypoint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(haystack: P1, needle: P2): containsλFuncExpr4<P1, P2>;
declare function contains<P1 extends $.TypeSet<$.RangeType<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(haystack: P1, needle: P2): containsλFuncExpr5<P1, P2>;
/**
 * A polymorphic function to test if a sequence contains a certain element.
 */
declare function contains<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>>(haystack: P1, needle: P2): containsλFuncExpr6<P1, P2>;
/**
 * A polymorphic function to test if a sequence contains a certain element.
 */
declare function contains<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>>(haystack: P1, needle: P2): containsλFuncExpr7<P1, P2>;
/**
 * A polymorphic function to test if a sequence contains a certain element.
 */
declare function contains<P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends $.TypeSet<$decimalλICastableTo>>(haystack: P1, needle: P2): containsλFuncExpr8<P1, P2>;
/**
 * A polymorphic function to test if a sequence contains a certain element.
 */
declare function contains<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ObjectType>>(haystack: P1, needle: P2): containsλFuncExpr9<P1, P2>;
/**
 * A polymorphic function to test if a sequence contains a certain element.
 */
declare function contains<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.AnyTupleType>>(haystack: P1, needle: P2): containsλFuncExpr10<P1, P2>;
/**
 * A polymorphic function to test if a sequence contains a certain element.
 */
declare function contains<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(haystack: P1, needle: P2): containsλFuncExpr11<P1, P2>;
declare type array_replaceλFuncExpr<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P3 extends $.TypeSet<_cal.$relative_durationλICastableTo>> = $.$expr_Function<$.ArrayType<_.syntax.getSharedParentPrimitive<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]>, P3["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
declare type array_replaceλFuncExpr2<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P3 extends $.TypeSet<_cal.$local_datetimeλICastableTo>> = $.$expr_Function<$.ArrayType<_.syntax.getSharedParentPrimitive<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]>, P3["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
declare type array_replaceλFuncExpr3<P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends $.TypeSet<$decimalλICastableTo>, P3 extends $.TypeSet<$decimalλICastableTo>> = $.$expr_Function<$.ArrayType<_.syntax.getSharedParentPrimitive<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]>, P3["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
declare type array_replaceλFuncExpr4<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ObjectType>, P3 extends $.TypeSet<$.ObjectType>> = $.$expr_Function<$.ArrayType<_.syntax.mergeObjectTypes<_.syntax.mergeObjectTypes<P1["__element__"]["__element__"], P2["__element__"]>, P3["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
declare type array_replaceλFuncExpr5<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.AnyTupleType>, P3 extends $.TypeSet<$.AnyTupleType>> = $.$expr_Function<$.ArrayType<_.syntax.getSharedParentPrimitive<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]>, P3["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
declare type array_replaceλFuncExpr6<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>> = $.$expr_Function<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
/**
 * Replace each array element equal to the second argument with the third argument.
 */
declare function array_replace<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P3 extends $.TypeSet<_cal.$relative_durationλICastableTo>>(array: P1, old: P2, new_2: P3): array_replaceλFuncExpr<P1, P2, P3>;
/**
 * Replace each array element equal to the second argument with the third argument.
 */
declare function array_replace<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P3 extends $.TypeSet<_cal.$local_datetimeλICastableTo>>(array: P1, old: P2, new_2: P3): array_replaceλFuncExpr2<P1, P2, P3>;
/**
 * Replace each array element equal to the second argument with the third argument.
 */
declare function array_replace<P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends $.TypeSet<$decimalλICastableTo>, P3 extends $.TypeSet<$decimalλICastableTo>>(array: P1, old: P2, new_2: P3): array_replaceλFuncExpr3<P1, P2, P3>;
/**
 * Replace each array element equal to the second argument with the third argument.
 */
declare function array_replace<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ObjectType>, P3 extends $.TypeSet<$.ObjectType>>(array: P1, old: P2, new_2: P3): array_replaceλFuncExpr4<P1, P2, P3>;
/**
 * Replace each array element equal to the second argument with the third argument.
 */
declare function array_replace<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.AnyTupleType>, P3 extends $.TypeSet<$.AnyTupleType>>(array: P1, old: P2, new_2: P3): array_replaceλFuncExpr5<P1, P2, P3>;
/**
 * Replace each array element equal to the second argument with the third argument.
 */
declare function array_replace<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(array: P1, old: P2, new_2: P3): array_replaceλFuncExpr6<P1, P2, P3>;
declare type findλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type findλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type findλFuncExpr3<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
declare type findλFuncExpr4<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
declare type findλFuncExpr5<P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends $.TypeSet<$decimalλICastableTo>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
declare type findλFuncExpr6<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ObjectType>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
declare type findλFuncExpr7<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.AnyTupleType>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
declare type findλFuncExpr8<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
/**
 * A polymorphic function to find index of an element in a sequence.
 */
declare function find<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(haystack: P1, needle: P2): findλFuncExpr<P1, P2>;
/**
 * A polymorphic function to find index of an element in a sequence.
 */
declare function find<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>>(haystack: P1, needle: P2): findλFuncExpr2<P1, P2>;
/**
 * A polymorphic function to find index of an element in a sequence.
 */
declare function find<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined>(haystack: P1, needle: P2, from_pos?: P3): findλFuncExpr3<P1, P2, P3>;
/**
 * A polymorphic function to find index of an element in a sequence.
 */
declare function find<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined>(haystack: P1, needle: P2, from_pos?: P3): findλFuncExpr4<P1, P2, P3>;
/**
 * A polymorphic function to find index of an element in a sequence.
 */
declare function find<P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends $.TypeSet<$decimalλICastableTo>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined>(haystack: P1, needle: P2, from_pos?: P3): findλFuncExpr5<P1, P2, P3>;
/**
 * A polymorphic function to find index of an element in a sequence.
 */
declare function find<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ObjectType>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined>(haystack: P1, needle: P2, from_pos?: P3): findλFuncExpr6<P1, P2, P3>;
/**
 * A polymorphic function to find index of an element in a sequence.
 */
declare function find<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.AnyTupleType>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined>(haystack: P1, needle: P2, from_pos?: P3): findλFuncExpr7<P1, P2, P3>;
/**
 * A polymorphic function to find index of an element in a sequence.
 */
declare function find<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>> | undefined>(haystack: P1, needle: P2, from_pos?: P3): findλFuncExpr8<P1, P2, P3>;
declare type bit_andλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Bitwise AND operator for 16-bit integers.
 */
declare function bit_and<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(l: P1, r: P2): bit_andλFuncExpr<P1, P2>;
declare type bit_orλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Bitwise OR operator for 16-bit integers.
 */
declare function bit_or<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(l: P1, r: P2): bit_orλFuncExpr<P1, P2>;
declare type bit_xorλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Bitwise exclusive OR operator for 16-bit integers.
 */
declare function bit_xor<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(l: P1, r: P2): bit_xorλFuncExpr<P1, P2>;
declare type bit_notλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.paramCardinality<P1>>;
/**
 * Bitwise NOT operator for 16-bit integers.
 */
declare function bit_not<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(r: P1): bit_notλFuncExpr<P1>;
declare type bit_rshiftλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Bitwise right-shift operator for 16-bit integers.
 */
declare function bit_rshift<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1, n: P2): bit_rshiftλFuncExpr<P1, P2>;
declare type bit_lshiftλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Bitwise left-shift operator for 16-bit integers.
 */
declare function bit_lshift<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1, n: P2): bit_lshiftλFuncExpr<P1, P2>;
declare type array_aggλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.NonArrayType>>> = $.$expr_Function<$.ArrayType<$.getPrimitiveNonArrayBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>, $.Cardinality.One>;
/**
 * Return the array made from all of the input set elements.
 */
declare function array_agg<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.NonArrayType>>>(s: P1): array_aggλFuncExpr<P1>;
declare type array_unpackλFuncExpr<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>> = $.$expr_Function<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>, $.Cardinality.Many>;
/**
 * Return array elements as a set.
 */
declare function array_unpack<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>>(array: P1): array_unpackλFuncExpr<P1>;
declare type array_fillλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$.ArrayType<$.getPrimitiveNonArrayBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Return an array filled with the given value repeated as many times as specified.
 */
declare function array_fill<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1, n: P2): array_fillλFuncExpr<P1, P2>;
declare type array_getλFuncExpr<NamedArgs extends {
    "default"?: $.TypeSet<_cal.$relative_durationλICastableTo>;
}, P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<_.syntax.getSharedParentPrimitive<NamedArgs["default"] extends $.TypeSet ? NamedArgs["default"]["__element__"] : undefined, P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<NamedArgs["default"]>>, 'Zero'>>;
declare type array_getλFuncExpr2<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<P1["__element__"]["__element__"], $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, 'Zero'>>;
declare type array_getλFuncExpr3<NamedArgs extends {
    "default"?: $.TypeSet<_cal.$local_datetimeλICastableTo>;
}, P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<_.syntax.getSharedParentPrimitive<NamedArgs["default"] extends $.TypeSet ? NamedArgs["default"]["__element__"] : undefined, P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<NamedArgs["default"]>>, 'Zero'>>;
declare type array_getλFuncExpr4<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<P1["__element__"]["__element__"], $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, 'Zero'>>;
declare type array_getλFuncExpr5<NamedArgs extends {
    "default"?: $.TypeSet<$decimalλICastableTo>;
}, P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<_.syntax.getSharedParentPrimitive<NamedArgs["default"] extends $.TypeSet ? NamedArgs["default"]["__element__"] : undefined, P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<NamedArgs["default"]>>, 'Zero'>>;
declare type array_getλFuncExpr6<P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<P1["__element__"]["__element__"], $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, 'Zero'>>;
declare type array_getλFuncExpr7<NamedArgs extends {
    "default"?: $.TypeSet<$.ObjectType>;
}, P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<_.syntax.mergeObjectTypes<NamedArgs["default"] extends $.TypeSet ? NamedArgs["default"]["__element__"] : undefined, P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<NamedArgs["default"]>>, 'Zero'>>;
declare type array_getλFuncExpr8<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<P1["__element__"]["__element__"], $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, 'Zero'>>;
declare type array_getλFuncExpr9<NamedArgs extends {
    "default"?: $.TypeSet<$.AnyTupleType>;
}, P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<_.syntax.getSharedParentPrimitive<NamedArgs["default"] extends $.TypeSet ? NamedArgs["default"]["__element__"] : undefined, P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<NamedArgs["default"]>>, 'Zero'>>;
declare type array_getλFuncExpr10<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<P1["__element__"]["__element__"], $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, 'Zero'>>;
declare type array_getλFuncExpr11<NamedArgs extends {
    "default"?: _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>;
}, P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<NamedArgs["default"]>>, 'Zero'>>;
declare type array_getλFuncExpr12<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, 'Zero'>>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<NamedArgs extends {
    "default"?: $.TypeSet<_cal.$relative_durationλICastableTo>;
}, P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(namedArgs: NamedArgs, array: P1, idx: P2): array_getλFuncExpr<NamedArgs, P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(array: P1, idx: P2): array_getλFuncExpr2<P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<NamedArgs extends {
    "default"?: $.TypeSet<_cal.$local_datetimeλICastableTo>;
}, P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(namedArgs: NamedArgs, array: P1, idx: P2): array_getλFuncExpr3<NamedArgs, P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(array: P1, idx: P2): array_getλFuncExpr4<P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<NamedArgs extends {
    "default"?: $.TypeSet<$decimalλICastableTo>;
}, P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(namedArgs: NamedArgs, array: P1, idx: P2): array_getλFuncExpr5<NamedArgs, P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<P1 extends $.TypeSet<$.ArrayType<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(array: P1, idx: P2): array_getλFuncExpr6<P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<NamedArgs extends {
    "default"?: $.TypeSet<$.ObjectType>;
}, P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(namedArgs: NamedArgs, array: P1, idx: P2): array_getλFuncExpr7<NamedArgs, P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(array: P1, idx: P2): array_getλFuncExpr8<P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<NamedArgs extends {
    "default"?: $.TypeSet<$.AnyTupleType>;
}, P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(namedArgs: NamedArgs, array: P1, idx: P2): array_getλFuncExpr9<NamedArgs, P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(array: P1, idx: P2): array_getλFuncExpr10<P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<NamedArgs extends {
    "default"?: _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>;
}, P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(namedArgs: NamedArgs, array: P1, idx: P2): array_getλFuncExpr11<NamedArgs, P1, P2>;
/**
 * Return the element of *array* at the specified *index*.
 */
declare function array_get<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(array: P1, idx: P2): array_getλFuncExpr12<P1, P2>;
declare type array_joinλFuncExpr<P1 extends $.TypeSet<$.ArrayType<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Render an array to a string.
 */
declare function array_join<P1 extends $.TypeSet<$.ArrayType<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(array: P1, delimiter: P2): array_joinλFuncExpr<P1, P2>;
declare type bytes_get_bitλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Get the *nth* bit of the *bytes* value.
 */
declare function bytes_get_bit<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(bytes: P1, num: P2): bytes_get_bitλFuncExpr<P1, P2>;
declare type datetime_currentλFuncExpr = $.$expr_Function<$datetime, $.Cardinality.One>;
/**
 * Return the current server date and time.
 */
declare function datetime_current(): datetime_currentλFuncExpr;
declare type datetime_of_transactionλFuncExpr = $.$expr_Function<$datetime, $.Cardinality.One>;
/**
 * Return the date and time of the start of the current transaction.
 */
declare function datetime_of_transaction(): datetime_of_transactionλFuncExpr;
declare type datetime_of_statementλFuncExpr = $.$expr_Function<$datetime, $.Cardinality.One>;
/**
 * Return the date and time of the start of the current statement.
 */
declare function datetime_of_statement(): datetime_of_statementλFuncExpr;
declare type datetime_getλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type datetime_getλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Extract a specific element of input datetime by name.
 */
declare function datetime_get<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, el: P2): datetime_getλFuncExpr<P1, P2>;
/**
 * Extract a specific element of input datetime by name.
 */
declare function datetime_get<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, el: P2): datetime_getλFuncExpr2<P1, P2>;
declare type datetime_truncateλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Truncate the input datetime to a particular precision.
 */
declare function datetime_truncate<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, unit: P2): datetime_truncateλFuncExpr<P1, P2>;
declare type duration_getλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type duration_getλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type duration_getλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Extract a specific element of input duration by name.
 */
declare function duration_get<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, el: P2): duration_getλFuncExpr<P1, P2>;
/**
 * Extract a specific element of input duration by name.
 */
declare function duration_get<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, el: P2): duration_getλFuncExpr2<P1, P2>;
/**
 * Extract a specific element of input duration by name.
 */
declare function duration_get<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, el: P2): duration_getλFuncExpr3<P1, P2>;
declare type duration_truncateλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type duration_truncateλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<_cal.$date_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type duration_truncateλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<_cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Truncate the input duration to a particular precision.
 */
declare function duration_truncate<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, unit: P2): duration_truncateλFuncExpr<P1, P2>;
/**
 * Truncate the input duration to a particular precision.
 */
declare function duration_truncate<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, unit: P2): duration_truncateλFuncExpr2<P1, P2>;
/**
 * Truncate the input duration to a particular precision.
 */
declare function duration_truncate<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(dt: P1, unit: P2): duration_truncateλFuncExpr3<P1, P2>;
declare type duration_to_secondsλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>> = $.$expr_Function<$decimal, $.cardutil.paramCardinality<P1>>;
/**
 * Return duration as total number of seconds in interval.
 */
declare function duration_to_seconds<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>>(dur: P1): duration_to_secondsλFuncExpr<P1>;
declare type json_typeofλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>> = $.$expr_Function<$str, $.cardutil.paramCardinality<P1>>;
/**
 * Return the type of the outermost JSON value as a string.
 */
declare function json_typeof<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>>(json: P1): json_typeofλFuncExpr<P1>;
declare type json_array_unpackλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>> = $.$expr_Function<$json, $.Cardinality.Many>;
/**
 * Return elements of JSON array as a set of `json`.
 */
declare function json_array_unpack<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>>(array: P1): json_array_unpackλFuncExpr<P1>;
declare type json_object_unpackλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>> = $.$expr_Function<$.TupleType<[$str, $json]>, $.Cardinality.Many>;
/**
 * Return set of key/value tuples that make up the JSON object.
 */
declare function json_object_unpack<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>>(obj: P1): json_object_unpackλFuncExpr<P1>;
declare type json_getλFuncExpr<NamedArgs extends {
    "default"?: _.castMaps.orScalarLiteral<$.TypeSet<$json>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends [_.castMaps.orScalarLiteral<$.TypeSet<$str>>, ..._.castMaps.orScalarLiteral<$.TypeSet<$str>>[]]> = $.$expr_Function<$json, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramArrayCardinality<P2>>, $.cardutil.optionalParamCardinality<NamedArgs["default"]>>, 'Zero'>>;
declare type json_getλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends [_.castMaps.orScalarLiteral<$.TypeSet<$str>>, ..._.castMaps.orScalarLiteral<$.TypeSet<$str>>[]]> = $.$expr_Function<$json, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramArrayCardinality<P2>>, 'Zero'>>;
/**
 * Return the JSON value at the end of the specified path or an empty set.
 */
declare function json_get<NamedArgs extends {
    "default"?: _.castMaps.orScalarLiteral<$.TypeSet<$json>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends [_.castMaps.orScalarLiteral<$.TypeSet<$str>>, ..._.castMaps.orScalarLiteral<$.TypeSet<$str>>[]]>(namedArgs: NamedArgs, json: P1, ...path: P2): json_getλFuncExpr<NamedArgs, P1, P2>;
/**
 * Return the JSON value at the end of the specified path or an empty set.
 */
declare function json_get<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends [_.castMaps.orScalarLiteral<$.TypeSet<$str>>, ..._.castMaps.orScalarLiteral<$.TypeSet<$str>>[]]>(json: P1, ...path: P2): json_getλFuncExpr2<P1, P2>;
declare type json_setλFuncExpr<NamedArgs extends {
    "value"?: _.castMaps.orScalarLiteral<$.TypeSet<$json>>;
    "create_if_missing"?: _.castMaps.orScalarLiteral<$.TypeSet<$bool>>;
    "empty_treatment"?: _.castMaps.orScalarLiteral<$.TypeSet<$JsonEmpty>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends [_.castMaps.orScalarLiteral<$.TypeSet<$str>>, ..._.castMaps.orScalarLiteral<$.TypeSet<$str>>[]]> = $.$expr_Function<$json, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramArrayCardinality<P2>>, $.cardutil.optionalParamCardinality<NamedArgs["value"]>>, $.cardutil.optionalParamCardinality<NamedArgs["create_if_missing"]>>, $.cardutil.optionalParamCardinality<NamedArgs["empty_treatment"]>>, 'Zero'>>;
declare type json_setλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends [_.castMaps.orScalarLiteral<$.TypeSet<$str>>, ..._.castMaps.orScalarLiteral<$.TypeSet<$str>>[]]> = $.$expr_Function<$json, $.cardutil.overrideLowerBound<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramArrayCardinality<P2>>, 'Zero'>>;
/**
 * Return an updated JSON target with a new value.
 */
declare function json_set<NamedArgs extends {
    "value"?: _.castMaps.orScalarLiteral<$.TypeSet<$json>>;
    "create_if_missing"?: _.castMaps.orScalarLiteral<$.TypeSet<$bool>>;
    "empty_treatment"?: _.castMaps.orScalarLiteral<$.TypeSet<$JsonEmpty>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends [_.castMaps.orScalarLiteral<$.TypeSet<$str>>, ..._.castMaps.orScalarLiteral<$.TypeSet<$str>>[]]>(namedArgs: NamedArgs, target: P1, ...path: P2): json_setλFuncExpr<NamedArgs, P1, P2>;
/**
 * Return an updated JSON target with a new value.
 */
declare function json_set<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends [_.castMaps.orScalarLiteral<$.TypeSet<$str>>, ..._.castMaps.orScalarLiteral<$.TypeSet<$str>>[]]>(target: P1, ...path: P2): json_setλFuncExpr2<P1, P2>;
declare type re_matchλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$.ArrayType<$str>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Find the first regular expression match in a string.
 */
declare function re_match<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(pattern: P1, str: P2): re_matchλFuncExpr<P1, P2>;
declare type re_match_allλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$.ArrayType<$str>, $.Cardinality.Many>;
/**
 * Find all regular expression matches in a string.
 */
declare function re_match_all<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(pattern: P1, str: P2): re_match_allλFuncExpr<P1, P2>;
declare type re_testλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Test if a regular expression has a match in a string.
 */
declare function re_test<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(pattern: P1, str: P2): re_testλFuncExpr<P1, P2>;
declare type re_replaceλFuncExpr<NamedArgs extends {
    "flags"?: _.castMaps.orScalarLiteral<$.TypeSet<$str>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>, $.cardutil.optionalParamCardinality<NamedArgs["flags"]>>>;
declare type re_replaceλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
/**
 * Replace matching substrings in a given string.
 */
declare function re_replace<NamedArgs extends {
    "flags"?: _.castMaps.orScalarLiteral<$.TypeSet<$str>>;
}, P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(namedArgs: NamedArgs, pattern: P1, sub: P2, str: P3): re_replaceλFuncExpr<NamedArgs, P1, P2, P3>;
/**
 * Replace matching substrings in a given string.
 */
declare function re_replace<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(pattern: P1, sub: P2, str: P3): re_replaceλFuncExpr2<P1, P2, P3>;
declare type str_repeatλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Repeat the input *string* *n* times.
 */
declare function str_repeat<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(s: P1, n: P2): str_repeatλFuncExpr<P1, P2>;
declare type str_lowerλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.paramCardinality<P1>>;
/**
 * Return a lowercase copy of the input *string*.
 */
declare function str_lower<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(s: P1): str_lowerλFuncExpr<P1>;
declare type str_upperλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.paramCardinality<P1>>;
/**
 * Return an uppercase copy of the input *string*.
 */
declare function str_upper<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(s: P1): str_upperλFuncExpr<P1>;
declare type str_titleλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.paramCardinality<P1>>;
/**
 * Return a titlecase copy of the input *string*.
 */
declare function str_title<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(s: P1): str_titleλFuncExpr<P1>;
declare type str_pad_startλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
/**
 * Return the input string padded at the start to the length *n*.
 */
declare function str_pad_start<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, n: P2, fill?: P3): str_pad_startλFuncExpr<P1, P2, P3>;
declare type str_lpadλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
/**
 * Return the input string left-padded to the length *n*.
 */
declare function str_lpad<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, n: P2, fill?: P3): str_lpadλFuncExpr<P1, P2, P3>;
declare type str_pad_endλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
/**
 * Return the input string padded at the end to the length *n*.
 */
declare function str_pad_end<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, n: P2, fill?: P3): str_pad_endλFuncExpr<P1, P2, P3>;
declare type str_rpadλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.optionalParamCardinality<P3>>>;
/**
 * Return the input string right-padded to the length *n*.
 */
declare function str_rpad<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, n: P2, fill?: P3): str_rpadλFuncExpr<P1, P2, P3>;
declare type str_trim_startλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Return the input string with all *trim* characters removed from its start.
 */
declare function str_trim_start<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, tr?: P2): str_trim_startλFuncExpr<P1, P2>;
declare type str_ltrimλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Return the input string with all leftmost *trim* characters removed.
 */
declare function str_ltrim<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, tr?: P2): str_ltrimλFuncExpr<P1, P2>;
declare type str_trim_endλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Return the input string with all *trim* characters removed from its end.
 */
declare function str_trim_end<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, tr?: P2): str_trim_endλFuncExpr<P1, P2>;
declare type str_rtrimλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Return the input string with all rightmost *trim* characters removed.
 */
declare function str_rtrim<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, tr?: P2): str_rtrimλFuncExpr<P1, P2>;
declare type str_trimλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Return the input string with *trim* characters removed from both ends.
 */
declare function str_trim<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, tr?: P2): str_trimλFuncExpr<P1, P2>;
declare type str_splitλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$.ArrayType<$str>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Split string into array elements using the supplied delimiter.
 */
declare function str_split<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(s: P1, delimiter: P2): str_splitλFuncExpr<P1, P2>;
declare type str_replaceλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
/**
 * Given a string, find a matching substring and replace all its occurrences with a new substring.
 */
declare function str_replace<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(s: P1, old: P2, new_2: P3): str_replaceλFuncExpr<P1, P2, P3>;
declare type str_reverseλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.paramCardinality<P1>>;
/**
 * Reverse the order of the characters in the string.
 */
declare function str_reverse<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(s: P1): str_reverseλFuncExpr<P1>;
declare type uuid_generate_v1mcλFuncExpr = $.$expr_Function<$uuid, $.Cardinality.One>;
/**
 * Return a version 1 UUID.
 */
declare function uuid_generate_v1mc(): uuid_generate_v1mcλFuncExpr;
declare type uuid_generate_v4λFuncExpr = $.$expr_Function<$uuid, $.Cardinality.One>;
/**
 * Return a version 4 UUID.
 */
declare function uuid_generate_v4(): uuid_generate_v4λFuncExpr;
declare const range: typeof _.syntax.$range;
declare type range_is_emptyλFuncExpr<P1 extends $.TypeSet<$.RangeType<$anypoint>>> = $.$expr_Function<$bool, $.cardutil.paramCardinality<P1>>;
declare function range_is_empty<P1 extends $.TypeSet<$.RangeType<$anypoint>>>(val: P1): range_is_emptyλFuncExpr<P1>;
declare type range_unpackλFuncExpr<P1 extends $.TypeSet<$.RangeType<$number>>> = $.$expr_Function<$number, $.Cardinality.Many>;
declare type range_unpackλFuncExpr2<P1 extends $.TypeSet<$.RangeType<$number>>> = $.$expr_Function<$number, $.Cardinality.Many>;
declare type range_unpackλFuncExpr3<P1 extends $.TypeSet<$.RangeType<_cal.$local_date>>> = $.$expr_Function<_cal.$local_date, $.Cardinality.Many>;
declare type range_unpackλFuncExpr4<P1 extends $.TypeSet<$.RangeType<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.Cardinality.Many>;
declare type range_unpackλFuncExpr5<P1 extends $.TypeSet<$.RangeType<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.Cardinality.Many>;
declare type range_unpackλFuncExpr6<P1 extends $.TypeSet<$.RangeType<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.Cardinality.Many>;
declare type range_unpackλFuncExpr7<P1 extends $.TypeSet<$.RangeType<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.Cardinality.Many>;
declare type range_unpackλFuncExpr8<P1 extends $.TypeSet<$.RangeType<$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>> = $.$expr_Function<$datetime, $.Cardinality.Many>;
declare type range_unpackλFuncExpr9<P1 extends $.TypeSet<$.RangeType<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>> = $.$expr_Function<_cal.$local_date, $.Cardinality.Many>;
declare type range_unpackλFuncExpr10<P1 extends $.TypeSet<$.RangeType<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>> = $.$expr_Function<$decimal, $.Cardinality.Many>;
declare type range_unpackλFuncExpr11<P1 extends $.TypeSet<$.RangeType<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>> = $.$expr_Function<_cal.$local_datetime, $.Cardinality.Many>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<$number>>>(val: P1): range_unpackλFuncExpr<P1>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<$number>>>(val: P1): range_unpackλFuncExpr2<P1>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<_cal.$local_date>>>(val: P1): range_unpackλFuncExpr3<P1>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1, step: P2): range_unpackλFuncExpr4<P1, P2>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1, step: P2): range_unpackλFuncExpr5<P1, P2>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1, step: P2): range_unpackλFuncExpr6<P1, P2>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(val: P1, step: P2): range_unpackλFuncExpr7<P1, P2>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>>(val: P1, step: P2): range_unpackλFuncExpr8<P1, P2>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>>(val: P1, step: P2): range_unpackλFuncExpr9<P1, P2>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>>(val: P1, step: P2): range_unpackλFuncExpr10<P1, P2>;
declare function range_unpack<P1 extends $.TypeSet<$.RangeType<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(val: P1, step: P2): range_unpackλFuncExpr11<P1, P2>;
declare type range_get_upperλFuncExpr<P1 extends $.TypeSet<$.RangeType<$anypoint>>> = $.$expr_Function<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.paramCardinality<P1>, 'Zero'>>;
declare function range_get_upper<P1 extends $.TypeSet<$.RangeType<$anypoint>>>(r: P1): range_get_upperλFuncExpr<P1>;
declare type range_get_lowerλFuncExpr<P1 extends $.TypeSet<$.RangeType<$anypoint>>> = $.$expr_Function<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>, $.cardutil.overrideLowerBound<$.cardutil.paramCardinality<P1>, 'Zero'>>;
declare function range_get_lower<P1 extends $.TypeSet<$.RangeType<$anypoint>>>(r: P1): range_get_lowerλFuncExpr<P1>;
declare type range_is_inclusive_upperλFuncExpr<P1 extends $.TypeSet<$.RangeType<$anypoint>>> = $.$expr_Function<$bool, $.cardutil.paramCardinality<P1>>;
declare function range_is_inclusive_upper<P1 extends $.TypeSet<$.RangeType<$anypoint>>>(r: P1): range_is_inclusive_upperλFuncExpr<P1>;
declare type range_is_inclusive_lowerλFuncExpr<P1 extends $.TypeSet<$.RangeType<$anypoint>>> = $.$expr_Function<$bool, $.cardutil.paramCardinality<P1>>;
declare function range_is_inclusive_lower<P1 extends $.TypeSet<$.RangeType<$anypoint>>>(r: P1): range_is_inclusive_lowerλFuncExpr<P1>;
declare type overlapsλFuncExpr<P1 extends $.TypeSet<$.RangeType<$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>> = $.$expr_Function<$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare function overlaps<P1 extends $.TypeSet<$.RangeType<$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, r: P2): overlapsλFuncExpr<P1, P2>;
declare type to_strλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr4<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr5<P1 extends $.TypeSet<$.ArrayType<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type to_strλFuncExpr6<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr7<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr8<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr9<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr10<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_strλFuncExpr11<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(dt: P1, fmt?: P2): to_strλFuncExpr<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(td: P1, fmt?: P2): to_strλFuncExpr2<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(i: P1, fmt?: P2): to_strλFuncExpr3<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(d: P1, fmt?: P2): to_strλFuncExpr4<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends $.TypeSet<$.ArrayType<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(array: P1, delimiter: P2): to_strλFuncExpr5<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(json: P1, fmt?: P2): to_strλFuncExpr6<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(d: P1, fmt?: P2): to_strλFuncExpr7<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(nt: P1, fmt?: P2): to_strλFuncExpr8<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(d: P1, fmt?: P2): to_strλFuncExpr9<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(dt: P1, fmt?: P2): to_strλFuncExpr10<P1, P2>;
/**
 * Return string representation of the input value.
 */
declare function to_str<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(rd: P1, fmt?: P2): to_strλFuncExpr11<P1, P2>;
declare type to_jsonλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$json, $.cardutil.paramCardinality<P1>>;
/**
 * Return JSON value represented by the input *string*.
 */
declare function to_json<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(str: P1): to_jsonλFuncExpr<P1>;
declare type to_datetimeλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$datetime, $.cardutil.paramCardinality<P1>>;
declare type to_datetimeλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_datetimeλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P4 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P5 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P6 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P7 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$datetime, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P4>>, $.cardutil.paramCardinality<P5>>, $.cardutil.paramCardinality<P6>>, $.cardutil.paramCardinality<P7>>>;
declare type to_datetimeλFuncExpr4<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>> = $.$expr_Function<$datetime, $.cardutil.paramCardinality<P1>>;
declare type to_datetimeλFuncExpr5<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>> = $.$expr_Function<$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Create a `datetime` value.
 */
declare function to_datetime<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(epochseconds: P1): to_datetimeλFuncExpr<P1>;
/**
 * Create a `datetime` value.
 */
declare function to_datetime<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, fmt?: P2): to_datetimeλFuncExpr2<P1, P2>;
/**
 * Create a `datetime` value.
 */
declare function to_datetime<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P4 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P5 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P6 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>, P7 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(year: P1, month: P2, day: P3, hour: P4, min: P5, sec: P6, timezone: P7): to_datetimeλFuncExpr3<P1, P2, P3, P4, P5, P6, P7>;
/**
 * Create a `datetime` value.
 */
declare function to_datetime<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$decimalλICastableTo>>>(epochseconds: P1): to_datetimeλFuncExpr4<P1>;
/**
 * Create a `datetime` value.
 */
declare function to_datetime<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>>(local: P1, zone: P2): to_datetimeλFuncExpr5<P1, P2>;
declare type to_durationλFuncExpr<NamedArgs extends {
    "hours"?: _.castMaps.orScalarLiteral<$.TypeSet<$number>>;
    "minutes"?: _.castMaps.orScalarLiteral<$.TypeSet<$number>>;
    "seconds"?: _.castMaps.orScalarLiteral<$.TypeSet<$number>>;
    "microseconds"?: _.castMaps.orScalarLiteral<$.TypeSet<$number>>;
}> = $.$expr_Function<$duration, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<NamedArgs["hours"]>, $.cardutil.optionalParamCardinality<NamedArgs["minutes"]>>, $.cardutil.optionalParamCardinality<NamedArgs["seconds"]>>, $.cardutil.optionalParamCardinality<NamedArgs["microseconds"]>>>;
/**
 * Create a `duration` value.
 */
declare function to_duration<NamedArgs extends {
    "hours"?: _.castMaps.orScalarLiteral<$.TypeSet<$number>>;
    "minutes"?: _.castMaps.orScalarLiteral<$.TypeSet<$number>>;
    "seconds"?: _.castMaps.orScalarLiteral<$.TypeSet<$number>>;
    "microseconds"?: _.castMaps.orScalarLiteral<$.TypeSet<$number>>;
}>(namedArgs: NamedArgs): to_durationλFuncExpr<NamedArgs>;
declare type to_bigintλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Create a `bigint` value.
 */
declare function to_bigint<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, fmt?: P2): to_bigintλFuncExpr<P1, P2>;
declare type to_decimalλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Create a `decimal` value.
 */
declare function to_decimal<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, fmt?: P2): to_decimalλFuncExpr<P1, P2>;
declare type to_int64λFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Create a `int64` value.
 */
declare function to_int64<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, fmt?: P2): to_int64λFuncExpr<P1, P2>;
declare type to_int32λFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Create a `int32` value.
 */
declare function to_int32<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, fmt?: P2): to_int32λFuncExpr<P1, P2>;
declare type to_int16λFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Create a `int16` value.
 */
declare function to_int16<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, fmt?: P2): to_int16λFuncExpr<P1, P2>;
declare type to_float64λFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Create a `float64` value.
 */
declare function to_float64<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, fmt?: P2): to_float64λFuncExpr<P1, P2>;
declare type to_float32λFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
 * Create a `float32` value.
 */
declare function to_float32<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$str>> | undefined>(s: P1, fmt?: P2): to_float32λFuncExpr<P1, P2>;
declare type sequence_resetλFuncExpr<P1 extends $.TypeSet<_schema.$ScalarType>> = $.$expr_Function<$number, $.cardutil.paramCardinality<P1>>;
declare type sequence_resetλFuncExpr2<P1 extends $.TypeSet<_schema.$ScalarType>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>> = $.$expr_Function<$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare function sequence_reset<P1 extends $.TypeSet<_schema.$ScalarType>>(seq: P1): sequence_resetλFuncExpr<P1>;
declare function sequence_reset<P1 extends $.TypeSet<_schema.$ScalarType>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$number>>>(seq: P1, value: P2): sequence_resetλFuncExpr2<P1, P2>;
declare type sequence_nextλFuncExpr<P1 extends $.TypeSet<_schema.$ScalarType>> = $.$expr_Function<$number, $.cardutil.paramCardinality<P1>>;
declare function sequence_next<P1 extends $.TypeSet<_schema.$ScalarType>>(seq: P1): sequence_nextλFuncExpr<P1>;
export { JsonEmpty, bigint, bool, bytes, datetime, decimal, duration, float32, float64, int16, int32, int64, json, $sequence, str, uuid, number, $BaseObject, BaseObject, $Object_9d92cf705b2511ed848a275bef45d8e3, Object_9d92cf705b2511ed848a275bef45d8e3, $FreeObject, FreeObject };
export type { $anyscalar, $anypoint, $anydiscrete, $anycontiguous, $anyreal, $anyfloat, $anyint, $anynumeric };
declare type __defaultExports = {
    "JsonEmpty": typeof JsonEmpty;
    "bigint": typeof bigint;
    "bool": typeof bool;
    "bytes": typeof bytes;
    "datetime": typeof datetime;
    "decimal": typeof decimal;
    "duration": typeof duration;
    "float32": typeof float32;
    "float64": typeof float64;
    "int16": typeof int16;
    "int32": typeof int32;
    "int64": typeof int64;
    "json": typeof json;
    "str": typeof str;
    "uuid": typeof uuid;
    "BaseObject": typeof BaseObject;
    "Object": typeof Object_9d92cf705b2511ed848a275bef45d8e3;
    "FreeObject": typeof FreeObject;
    "assert_single": typeof assert_single;
    "assert_exists": typeof assert_exists;
    "assert_distinct": typeof assert_distinct;
    "len": typeof len;
    "sum": typeof sum;
    "count": typeof count;
    "random": typeof random;
    "min": typeof min;
    "max": typeof max;
    "all": typeof all;
    "any": typeof any;
    "enumerate": typeof enumerate;
    "round": typeof round;
    "contains": typeof contains;
    "array_replace": typeof array_replace;
    "find": typeof find;
    "bit_and": typeof bit_and;
    "bit_or": typeof bit_or;
    "bit_xor": typeof bit_xor;
    "bit_not": typeof bit_not;
    "bit_rshift": typeof bit_rshift;
    "bit_lshift": typeof bit_lshift;
    "array_agg": typeof array_agg;
    "array_unpack": typeof array_unpack;
    "array_fill": typeof array_fill;
    "array_get": typeof array_get;
    "array_join": typeof array_join;
    "bytes_get_bit": typeof bytes_get_bit;
    "datetime_current": typeof datetime_current;
    "datetime_of_transaction": typeof datetime_of_transaction;
    "datetime_of_statement": typeof datetime_of_statement;
    "datetime_get": typeof datetime_get;
    "datetime_truncate": typeof datetime_truncate;
    "duration_get": typeof duration_get;
    "duration_truncate": typeof duration_truncate;
    "duration_to_seconds": typeof duration_to_seconds;
    "json_typeof": typeof json_typeof;
    "json_array_unpack": typeof json_array_unpack;
    "json_object_unpack": typeof json_object_unpack;
    "json_get": typeof json_get;
    "json_set": typeof json_set;
    "re_match": typeof re_match;
    "re_match_all": typeof re_match_all;
    "re_test": typeof re_test;
    "re_replace": typeof re_replace;
    "str_repeat": typeof str_repeat;
    "str_lower": typeof str_lower;
    "str_upper": typeof str_upper;
    "str_title": typeof str_title;
    "str_pad_start": typeof str_pad_start;
    "str_lpad": typeof str_lpad;
    "str_pad_end": typeof str_pad_end;
    "str_rpad": typeof str_rpad;
    "str_trim_start": typeof str_trim_start;
    "str_ltrim": typeof str_ltrim;
    "str_trim_end": typeof str_trim_end;
    "str_rtrim": typeof str_rtrim;
    "str_trim": typeof str_trim;
    "str_split": typeof str_split;
    "str_replace": typeof str_replace;
    "str_reverse": typeof str_reverse;
    "uuid_generate_v1mc": typeof uuid_generate_v1mc;
    "uuid_generate_v4": typeof uuid_generate_v4;
    "range": typeof range;
    "range_is_empty": typeof range_is_empty;
    "range_unpack": typeof range_unpack;
    "range_get_upper": typeof range_get_upper;
    "range_get_lower": typeof range_get_lower;
    "range_is_inclusive_upper": typeof range_is_inclusive_upper;
    "range_is_inclusive_lower": typeof range_is_inclusive_lower;
    "overlaps": typeof overlaps;
    "to_str": typeof to_str;
    "to_json": typeof to_json;
    "to_datetime": typeof to_datetime;
    "to_duration": typeof to_duration;
    "to_bigint": typeof to_bigint;
    "to_decimal": typeof to_decimal;
    "to_int64": typeof to_int64;
    "to_int32": typeof to_int32;
    "to_int16": typeof to_int16;
    "to_float64": typeof to_float64;
    "to_float32": typeof to_float32;
    "sequence_reset": typeof sequence_reset;
    "sequence_next": typeof sequence_next;
};
declare const __defaultExports: __defaultExports;
export default __defaultExports;
