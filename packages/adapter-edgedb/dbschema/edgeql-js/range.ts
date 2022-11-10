import type {LocalDate, LocalDateTime, Duration} from "edgedb";
import {Range} from "edgedb";
import {TypeKind, ExpressionKind} from "edgedb/dist/reflection/index";

import type {cardutil} from "./cardinality";
import type {
  RangeType,
  getPrimitiveBaseType,
  TypeSet,
  BaseType
} from "./typesystem";
import type {$expr_Literal} from "./literal";

import type {
  $number,
  $decimal,
  $datetime,
  $duration,
  $bool
} from "./modules/std";
import type {$local_date, $local_datetime} from "./modules/cal";
import type {literalToScalarType, orScalarLiteral} from "./castMaps";
import {literalToTypeSet} from "./castMaps";
import {spec} from "./__spec__";
import {literal, $nameMapping} from "./literal";
import {$expr_Function, $resolveOverload} from "./funcops";
import {$expressionify} from "./path";

type $anypoint =
  | $number
  | $local_date
  | $decimal
  | $datetime
  | $local_datetime
  | $duration;

function range<Element extends $anypoint>(
  element: Element
): RangeType<Element>;
function range<T extends number | Date | LocalDate | LocalDateTime | Duration>(
  val: Range<T>
): $expr_Literal<RangeType<getPrimitiveBaseType<literalToScalarType<T>>>>;
function range<
  NamedArgs extends {
    inc_lower?: orScalarLiteral<TypeSet<$bool>>;
    inc_upper?: orScalarLiteral<TypeSet<$bool>>;
    empty?: orScalarLiteral<TypeSet<$bool>>;
  },
  P1 extends orScalarLiteral<TypeSet<$anypoint>> | undefined,
  P2 extends
    | orScalarLiteral<
        TypeSet<
          BaseType extends literalToScalarType<P1>
            ? $anypoint
            : getPrimitiveBaseType<literalToScalarType<P1>>
        >
      >
    | undefined
>(
  namedArgs: NamedArgs,
  lower?: P1,
  upper?: P2
): $expr_Function<
  // "std::range",
  // mapLiteralToTypeSet<[P1, P2]>,
  // mapLiteralToTypeSet<NamedArgs>,
  // TypeSet<
  RangeType<
    literalToScalarType<P1> extends $anypoint
      ? literalToScalarType<P1>
      : literalToScalarType<P2> extends $anypoint
      ? literalToScalarType<P2>
      : $anypoint
  >,
  cardutil.multiplyCardinalities<
    cardutil.multiplyCardinalities<
      cardutil.multiplyCardinalities<
        cardutil.multiplyCardinalities<
          cardutil.optionalParamCardinality<P1>,
          cardutil.optionalParamCardinality<P2>
        >,
        cardutil.optionalParamCardinality<NamedArgs["inc_lower"]>
      >,
      cardutil.optionalParamCardinality<NamedArgs["inc_upper"]>
    >,
    cardutil.optionalParamCardinality<NamedArgs["empty"]>
  >
  // >
>;
function range<
  P1 extends orScalarLiteral<TypeSet<$anypoint>> | undefined,
  P2 extends
    | orScalarLiteral<
        TypeSet<
          BaseType extends literalToScalarType<P1>
            ? $anypoint
            : getPrimitiveBaseType<literalToScalarType<P1>>
        >
      >
    | undefined
>(
  lower?: P1,
  upper?: P2
): $expr_Function<
  // "std::range",
  // mapLiteralToTypeSet<[P1, P2]>,
  // {},
  // TypeSet<
  RangeType<
    literalToScalarType<P1> extends $anypoint
      ? literalToScalarType<P1>
      : literalToScalarType<P2> extends $anypoint
      ? literalToScalarType<P2>
      : $anypoint
  >,
  cardutil.multiplyCardinalities<
    cardutil.optionalParamCardinality<P1>,
    cardutil.optionalParamCardinality<P2>
  >
  // >
>;
function range(...args: any[]): any {
  if (args.length === 1) {
    const arg = args[0];
    if (arg instanceof Range) {
      if (arg.lower === null && arg.upper === null) {
        throw new Error(
          `Can't create literal expression from unbounded range. Try this instead:\n\n  e.range(e.cast(e.int64, e.set()), e.cast(e.int64, e.set()))`
        );
      }
      if (arg.isEmpty) {
        throw new Error(`Can't create literal expression from empty range.`);
      }
      return literal(
        range(literalToTypeSet(arg.lower ?? arg.upper).__element__ as any),
        arg
      );
    }
    if (arg.__kind__ && !arg.__element__) {
      return {
        __kind__: TypeKind.range,
        __name__: `range<${arg.__name__}>`,
        __element__: arg
      } as any;
    }
  }
  const {
    returnType,
    cardinality,
    args: positionalArgs,
    namedArgs
  } = $resolveOverload("std::range", args, spec, [
    {
      args: [
        {
          typeId: $nameMapping.get("std::anypoint")!,
          optional: true,
          setoftype: false,
          variadic: false
        },
        {
          typeId: $nameMapping.get("std::anypoint")!,
          optional: true,
          setoftype: false,
          variadic: false
        }
      ],
      namedArgs: {
        inc_lower: {
          typeId: $nameMapping.get("std::bool")!,
          optional: true,
          setoftype: false,
          variadic: false
        },
        inc_upper: {
          typeId: $nameMapping.get("std::bool")!,
          optional: true,
          setoftype: false,
          variadic: false
        },
        empty: {
          typeId: $nameMapping.get("std::bool")!,
          optional: true,
          setoftype: false,
          variadic: false
        }
      },
      returnTypeId: $nameMapping.get("range<std::anypoint>")!
    }
  ]);
  return $expressionify({
    __kind__: ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "std::range",
    __args__: positionalArgs,
    __namedargs__: namedArgs
  }) as any;
}

export {range as $range};
