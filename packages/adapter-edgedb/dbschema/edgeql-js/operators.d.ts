import * as $ from "./reflection";
import * as _ from "./imports";
import type * as _std from "./modules/std";
import type * as _cal from "./modules/cal";
import type * as _cfg from "./modules/cfg";
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for equality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "?=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Compare two (potentially empty) values for inequality.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "?!=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: ">=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Greater than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: ">", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than or equal.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "<=", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Less than.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "<", r: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Logical disjunction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(a: P1, op: "or", b: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Logical conjunction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(a: P1, op: "and", b: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Logical negation.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>>(op: "not", v: P1): $.$expr_Operator<_std.$bool, $.cardutil.paramCardinality<P1>>;
/**
* Arithmetic addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(op: "+", l: P1): $.$expr_Operator<_std.$number, $.cardutil.paramCardinality<P1>>;
/**
* Arithmetic addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(op: "+", l: P1): $.$expr_Operator<_std.$bigint, $.cardutil.paramCardinality<P1>>;
/**
* Arithmetic addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_std.$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_std.$duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Range union.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "+", r: P2): $.$expr_Operator<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$local_date, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$date_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_std.$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(op: "+", l: P1): $.$expr_Operator<_std.$decimal, $.cardutil.paramCardinality<P1>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval addition.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "+", r: P2): $.$expr_Operator<_cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(op: "-", l: P1): $.$expr_Operator<_std.$number, $.cardutil.paramCardinality<P1>>;
/**
* Arithmetic subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(op: "-", l: P1): $.$expr_Operator<_std.$bigint, $.cardutil.paramCardinality<P1>>;
/**
* Time interval negation.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(op: "-", v: P1): $.$expr_Operator<_std.$duration, $.cardutil.paramCardinality<P1>>;
/**
* Arithmetic subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_std.$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_std.$duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_std.$duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Range difference.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "-", r: P2): $.$expr_Operator<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$local_date, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Date subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$date_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$date_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_std.$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(op: "-", l: P1): $.$expr_Operator<_std.$decimal, $.cardutil.paramCardinality<P1>>;
/**
* Time interval negation.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(op: "-", v: P1): $.$expr_Operator<_cal.$relative_duration, $.cardutil.paramCardinality<P1>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval and date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Date/time subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Time interval subtraction.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>>(l: P1, op: "-", r: P2): $.$expr_Operator<_cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic multiplication.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "*", r: P2): $.$expr_Operator<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic multiplication.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(l: P1, op: "*", r: P2): $.$expr_Operator<_std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Range intersection.
*/
declare function op<P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>, P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "*", r: P2): $.$expr_Operator<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic multiplication.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "*", r: P2): $.$expr_Operator<_std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic division.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(l: P1, op: "/", r: P2): $.$expr_Operator<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Arithmetic division.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(l: P1, op: "/", r: P2): $.$expr_Operator<_std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Floor division. Result is rounded down to the nearest integer
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(n: P1, op: "//", d: P2): $.$expr_Operator<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Floor division. Result is rounded down to the nearest integer
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(n: P1, op: "//", d: P2): $.$expr_Operator<_std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Floor division. Result is rounded down to the nearest integer
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(n: P1, op: "//", d: P2): $.$expr_Operator<_std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Remainder from division (modulo).
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(n: P1, op: "%", d: P2): $.$expr_Operator<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Remainder from division (modulo).
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(n: P1, op: "%", d: P2): $.$expr_Operator<_std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Remainder from division (modulo).
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(n: P1, op: "%", d: P2): $.$expr_Operator<_std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Power operation.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(n: P1, op: "^", p: P2): $.$expr_Operator<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Power operation.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>>(n: P1, op: "^", p: P2): $.$expr_Operator<_std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Power operation.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>>(n: P1, op: "^", p: P2): $.$expr_Operator<_std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<_std.$decimalλICastableTo>, P2 extends $.TypeSet<_std.$decimalλICastableTo>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>>(e: P1, op: "in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<_std.$decimalλICastableTo>, P2 extends $.TypeSet<_std.$decimalλICastableTo>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test the membership of an element in a set.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>>(e: P1, op: "not in", s: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>>;
/**
* Test whether a set is not empty.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(op: "exists", s: P1): $.$expr_Operator<_std.$bool, $.Cardinality.One>;
/**
* Return a set without repeating any elements.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>>(op: "distinct", s: P1): $.$expr_Operator<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.paramCardinality<P1>>;
/**
* Merge two sets.
*/
declare function op<P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Merge two sets.
*/
declare function op<P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Merge two sets.
*/
declare function op<P1 extends $.TypeSet<_std.$decimalλICastableTo>, P2 extends $.TypeSet<_std.$decimalλICastableTo>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Merge two sets.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Merge two sets.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Merge two sets.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Merge two sets.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<_.syntax.mergeObjectTypes<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Merge two sets.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Merge two sets.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>>(s1: P1, op: "union", s2: P2): $.$expr_Operator<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.mergeCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>>(l: P1, op: "??", r: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>>(l: P1, op: "??", r: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends $.TypeSet<_std.$decimalλICastableTo>, P2 extends $.TypeSet<_std.$decimalλICastableTo>>(l: P1, op: "??", r: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: "??", r: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "??", r: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: "??", r: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends $.TypeSet<$.ObjectType>>(l: P1, op: "??", r: P2): $.$expr_Operator<_.syntax.mergeObjectTypes<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends $.TypeSet<$.AnyTupleType>>(l: P1, op: "??", r: P2): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Coalesce.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>>(l: P1, op: "??", r: P2): $.$expr_Operator<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends $.TypeSet<_cal.$relative_durationλICastableTo>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends $.TypeSet<_cal.$local_datetimeλICastableTo>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends $.TypeSet<_std.$decimalλICastableTo>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends $.TypeSet<_std.$decimalλICastableTo>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends $.TypeSet<$.ObjectType>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends $.TypeSet<$.ObjectType>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<_.syntax.mergeObjectTypes<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends $.TypeSet<$.AnyTupleType>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends $.TypeSet<$.AnyTupleType>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<_.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Conditionally provide one or the other result.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>>(if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3): $.$expr_Operator<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>>;
/**
* Array concatenation.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>>(l: P1, op: "++", r: P2): $.$expr_Operator<$.ArrayType<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Array concatenation.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>>(l: P1, op: "++", r: P2): $.$expr_Operator<$.ArrayType<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Array concatenation.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>, P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>>(l: P1, op: "++", r: P2): $.$expr_Operator<$.ArrayType<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Array concatenation.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>, P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>>(l: P1, op: "++", r: P2): $.$expr_Operator<$.ArrayType<_.syntax.mergeObjectTypes<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Array concatenation.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>, P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>>(l: P1, op: "++", r: P2): $.$expr_Operator<$.ArrayType<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Array concatenation.
*/
declare function op<P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>, P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>>(l: P1, op: "++", r: P2): $.$expr_Operator<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Bytes concatenation.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>>(l: P1, op: "++", r: P2): $.$expr_Operator<_std.$bytes, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* String concatenation.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(l: P1, op: "++", r: P2): $.$expr_Operator<_std.$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Concatenate two JSON values into a new JSON value.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>>(l: P1, op: "++", r: P2): $.$expr_Operator<_std.$json, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Case-sensitive simple string matching.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(string: P1, op: "like", pattern: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Case-insensitive simple string matching.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(string: P1, op: "ilike", pattern: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Case-sensitive simple string matching.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(string: P1, op: "not like", pattern: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
* Case-insensitive simple string matching.
*/
declare function op<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(string: P1, op: "not ilike", pattern: P2): $.$expr_Operator<_std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
export { op };
