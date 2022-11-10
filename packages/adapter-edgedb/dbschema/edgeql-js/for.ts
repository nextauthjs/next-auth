import {Cardinality, ExpressionKind} from "edgedb/dist/reflection/index";
import {cardutil} from "./cardinality";
import type {Expression, BaseType, BaseTypeSet} from "./typesystem";
import {$expressionify} from "./path";

export type $expr_For<
  El extends BaseType = BaseType,
  Card extends Cardinality = Cardinality
  // IterSet extends BaseTypeSet = BaseTypeSet,
  // Expr extends BaseTypeSet = BaseTypeSet
> = Expression<{
  __element__: El;
  __cardinality__: Card;
  __kind__: ExpressionKind.For;
  __iterSet__: BaseTypeSet;
  __forVar__: $expr_ForVar;
  __expr__: BaseTypeSet;
}>;

export type $expr_ForVar<Type extends BaseType = BaseType> = Expression<{
  __element__: Type;
  __cardinality__: Cardinality.One;
  __kind__: ExpressionKind.ForVar;
}>;

function _for<IteratorSet extends BaseTypeSet, Expr extends BaseTypeSet>(
  set: IteratorSet,
  expr: (variable: $expr_ForVar<IteratorSet["__element__"]>) => Expr
): $expr_For<
  Expr["__element__"],
  cardutil.multiplyCardinalities<
    IteratorSet["__cardinality__"],
    Expr["__cardinality__"]
  >
> {
  const forVar = $expressionify({
    __kind__: ExpressionKind.ForVar,
    __element__: set.__element__,
    __cardinality__: Cardinality.One
  }) as $expr_ForVar<IteratorSet["__element__"]>;

  const returnExpr = expr(forVar);

  return $expressionify({
    __kind__: ExpressionKind.For,
    __element__: returnExpr.__element__,
    __cardinality__: cardutil.multiplyCardinalities(
      set.__cardinality__,
      returnExpr.__cardinality__
    ),
    __iterSet__: set,
    __expr__: returnExpr,
    __forVar__: forVar
  }) as any;
}

export {_for as for};
