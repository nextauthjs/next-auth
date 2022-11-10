import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
export declare type $date_duration = $.ScalarType<"cal::date_duration", _.edgedb.DateDuration>;
declare const date_duration: $.scalarTypeWithConstructor<$date_duration, string>;
export declare type $local_date = $.ScalarType<"cal::local_date", _.edgedb.LocalDate>;
declare const local_date: $.scalarTypeWithConstructor<$local_date, string>;
export declare type $local_datetime = $.ScalarType<"cal::local_datetime", _.edgedb.LocalDateTime>;
declare const local_datetime: $.scalarTypeWithConstructor<$local_datetime, string>;
export declare type $local_datetimeλICastableTo = $local_datetime | $local_date;
export declare type $local_datetimeλIAssignableBy = $local_datetime | $local_date;
export declare type $local_time = $.ScalarType<"cal::local_time", _.edgedb.LocalTime>;
declare const local_time: $.scalarTypeWithConstructor<$local_time, string>;
export declare type $relative_duration = $.ScalarType<"cal::relative_duration", _.edgedb.RelativeDuration>;
declare const relative_duration: $.scalarTypeWithConstructor<$relative_duration, string>;
export declare type $relative_durationλICastableTo = $relative_duration | $date_duration;
export declare type $relative_durationλIAssignableBy = $relative_duration | $date_duration;
declare type to_local_datetimeλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>> | undefined> = $.$expr_Function<$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_local_datetimeλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>> = $.$expr_Function<$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type to_local_datetimeλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P4 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P5 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P6 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>> = $.$expr_Function<$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P4>>, $.cardutil.paramCardinality<P5>>, $.cardutil.paramCardinality<P6>>>;
/**
 * Create a `cal::local_datetime` value.
 */
declare function to_local_datetime<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>> | undefined>(s: P1, fmt?: P2): to_local_datetimeλFuncExpr<P1, P2>;
/**
 * Create a `cal::local_datetime` value.
 */
declare function to_local_datetime<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(dt: P1, zone: P2): to_local_datetimeλFuncExpr2<P1, P2>;
/**
 * Create a `cal::local_datetime` value.
 */
declare function to_local_datetime<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P4 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P5 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P6 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(year: P1, month: P2, day: P3, hour: P4, min: P5, sec: P6): to_local_datetimeλFuncExpr3<P1, P2, P3, P4, P5, P6>;
declare type to_local_dateλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>> | undefined> = $.$expr_Function<$local_date, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_local_dateλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>> = $.$expr_Function<$local_date, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type to_local_dateλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>> = $.$expr_Function<$local_date, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
/**
 * Create a `cal::local_date` value.
 */
declare function to_local_date<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>> | undefined>(s: P1, fmt?: P2): to_local_dateλFuncExpr<P1, P2>;
/**
 * Create a `cal::local_date` value.
 */
declare function to_local_date<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(dt: P1, zone: P2): to_local_dateλFuncExpr2<P1, P2>;
/**
 * Create a `cal::local_date` value.
 */
declare function to_local_date<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(year: P1, month: P2, day: P3): to_local_dateλFuncExpr3<P1, P2, P3>;
declare type to_local_timeλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>> | undefined> = $.$expr_Function<$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>>;
declare type to_local_timeλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>> = $.$expr_Function<$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
declare type to_local_timeλFuncExpr3<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>> = $.$expr_Function<$local_time, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>, $.cardutil.paramCardinality<P3>>>;
/**
 * Create a `cal::local_time` value.
 */
declare function to_local_time<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>> | undefined>(s: P1, fmt?: P2): to_local_timeλFuncExpr<P1, P2>;
/**
 * Create a `cal::local_time` value.
 */
declare function to_local_time<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(dt: P1, zone: P2): to_local_timeλFuncExpr2<P1, P2>;
/**
 * Create a `cal::local_time` value.
 */
declare function to_local_time<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>, P3 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>>(hour: P1, min: P2, sec: P3): to_local_timeλFuncExpr3<P1, P2, P3>;
declare type to_relative_durationλFuncExpr<NamedArgs extends {
    "years"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "months"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "days"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "hours"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "minutes"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "seconds"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "microseconds"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
}> = $.$expr_Function<$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<NamedArgs["years"]>, $.cardutil.optionalParamCardinality<NamedArgs["months"]>>, $.cardutil.optionalParamCardinality<NamedArgs["days"]>>, $.cardutil.optionalParamCardinality<NamedArgs["hours"]>>, $.cardutil.optionalParamCardinality<NamedArgs["minutes"]>>, $.cardutil.optionalParamCardinality<NamedArgs["seconds"]>>, $.cardutil.optionalParamCardinality<NamedArgs["microseconds"]>>>;
/**
 * Create a `cal::relative_duration` value.
 */
declare function to_relative_duration<NamedArgs extends {
    "years"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "months"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "days"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "hours"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "minutes"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "seconds"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "microseconds"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
}>(namedArgs: NamedArgs): to_relative_durationλFuncExpr<NamedArgs>;
declare type to_date_durationλFuncExpr<NamedArgs extends {
    "years"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "months"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "days"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
}> = $.$expr_Function<$date_duration, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<NamedArgs["years"]>, $.cardutil.optionalParamCardinality<NamedArgs["months"]>>, $.cardutil.optionalParamCardinality<NamedArgs["days"]>>>;
/**
 * Create a `cal::date_duration` value.
 */
declare function to_date_duration<NamedArgs extends {
    "years"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "months"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
    "days"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>;
}>(namedArgs: NamedArgs): to_date_durationλFuncExpr<NamedArgs>;
declare type time_getλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>> = $.$expr_Function<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Extract a specific element of input time by name.
 */
declare function time_get<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$local_time>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(dt: P1, el: P2): time_getλFuncExpr<P1, P2>;
declare type date_getλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>> = $.$expr_Function<_std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>>;
/**
 * Extract a specific element of input date by name.
 */
declare function date_get<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$local_date>>, P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>>(dt: P1, el: P2): date_getλFuncExpr<P1, P2>;
declare type duration_normalize_hoursλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$relative_durationλICastableTo>>> = $.$expr_Function<$relative_duration, $.cardutil.paramCardinality<P1>>;
/**
 * Convert 24-hour chunks into days.
 */
declare function duration_normalize_hours<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$relative_durationλICastableTo>>>(dur: P1): duration_normalize_hoursλFuncExpr<P1>;
declare type duration_normalize_daysλFuncExpr<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$date_duration>>> = $.$expr_Function<$date_duration, $.cardutil.paramCardinality<P1>>;
declare type duration_normalize_daysλFuncExpr2<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$relative_durationλICastableTo>>> = $.$expr_Function<$relative_duration, $.cardutil.paramCardinality<P1>>;
/**
 * Convert 30-day chunks into months.
 */
declare function duration_normalize_days<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$date_duration>>>(dur: P1): duration_normalize_daysλFuncExpr<P1>;
/**
 * Convert 30-day chunks into months.
 */
declare function duration_normalize_days<P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$relative_durationλICastableTo>>>(dur: P1): duration_normalize_daysλFuncExpr2<P1>;
export { date_duration, local_date, local_datetime, local_time, relative_duration };
declare type __defaultExports = {
    "date_duration": typeof date_duration;
    "local_date": typeof local_date;
    "local_datetime": typeof local_datetime;
    "local_time": typeof local_time;
    "relative_duration": typeof relative_duration;
    "to_local_datetime": typeof to_local_datetime;
    "to_local_date": typeof to_local_date;
    "to_local_time": typeof to_local_time;
    "to_relative_duration": typeof to_relative_duration;
    "to_date_duration": typeof to_date_duration;
    "time_get": typeof time_get;
    "date_get": typeof date_get;
    "duration_normalize_hours": typeof duration_normalize_hours;
    "duration_normalize_days": typeof duration_normalize_days;
};
declare const __defaultExports: __defaultExports;
export default __defaultExports;
