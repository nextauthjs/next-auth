import type { LocalDate, LocalDateTime, Duration } from "edgedb";
import { Range } from "edgedb";
import type { cardutil } from "./cardinality";
import type { RangeType, getPrimitiveBaseType, TypeSet, BaseType } from "./typesystem";
import type { $expr_Literal } from "./literal";
import type { $number, $decimal, $datetime, $duration, $bool } from "./modules/std";
import type { $local_date, $local_datetime } from "./modules/cal";
import type { literalToScalarType, orScalarLiteral } from "./castMaps";
import { $expr_Function } from "./funcops";
declare type $anypoint = $number | $local_date | $decimal | $datetime | $local_datetime | $duration;
declare function range<Element extends $anypoint>(element: Element): RangeType<Element>;
declare function range<T extends number | Date | LocalDate | LocalDateTime | Duration>(val: Range<T>): $expr_Literal<RangeType<getPrimitiveBaseType<literalToScalarType<T>>>>;
declare function range<NamedArgs extends {
    inc_lower?: orScalarLiteral<TypeSet<$bool>>;
    inc_upper?: orScalarLiteral<TypeSet<$bool>>;
    empty?: orScalarLiteral<TypeSet<$bool>>;
}, P1 extends orScalarLiteral<TypeSet<$anypoint>> | undefined, P2 extends orScalarLiteral<TypeSet<BaseType extends literalToScalarType<P1> ? $anypoint : getPrimitiveBaseType<literalToScalarType<P1>>>> | undefined>(namedArgs: NamedArgs, lower?: P1, upper?: P2): $expr_Function<RangeType<literalToScalarType<P1> extends $anypoint ? literalToScalarType<P1> : literalToScalarType<P2> extends $anypoint ? literalToScalarType<P2> : $anypoint>, cardutil.multiplyCardinalities<cardutil.multiplyCardinalities<cardutil.multiplyCardinalities<cardutil.multiplyCardinalities<cardutil.optionalParamCardinality<P1>, cardutil.optionalParamCardinality<P2>>, cardutil.optionalParamCardinality<NamedArgs["inc_lower"]>>, cardutil.optionalParamCardinality<NamedArgs["inc_upper"]>>, cardutil.optionalParamCardinality<NamedArgs["empty"]>>>;
declare function range<P1 extends orScalarLiteral<TypeSet<$anypoint>> | undefined, P2 extends orScalarLiteral<TypeSet<BaseType extends literalToScalarType<P1> ? $anypoint : getPrimitiveBaseType<literalToScalarType<P1>>>> | undefined>(lower?: P1, upper?: P2): $expr_Function<RangeType<literalToScalarType<P1> extends $anypoint ? literalToScalarType<P1> : literalToScalarType<P2> extends $anypoint ? literalToScalarType<P2> : $anypoint>, cardutil.multiplyCardinalities<cardutil.optionalParamCardinality<P1>, cardutil.optionalParamCardinality<P2>>>;
export { range as $range };
