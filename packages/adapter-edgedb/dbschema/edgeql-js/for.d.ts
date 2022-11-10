import { Cardinality, ExpressionKind } from "edgedb/dist/reflection/index";
import { cardutil } from "./cardinality";
import type { Expression, BaseType, BaseTypeSet } from "./typesystem";
export declare type $expr_For<El extends BaseType = BaseType, Card extends Cardinality = Cardinality> = Expression<{
    __element__: El;
    __cardinality__: Card;
    __kind__: ExpressionKind.For;
    __iterSet__: BaseTypeSet;
    __forVar__: $expr_ForVar;
    __expr__: BaseTypeSet;
}>;
export declare type $expr_ForVar<Type extends BaseType = BaseType> = Expression<{
    __element__: Type;
    __cardinality__: Cardinality.One;
    __kind__: ExpressionKind.ForVar;
}>;
declare function _for<IteratorSet extends BaseTypeSet, Expr extends BaseTypeSet>(set: IteratorSet, expr: (variable: $expr_ForVar<IteratorSet["__element__"]>) => Expr): $expr_For<Expr["__element__"], cardutil.multiplyCardinalities<IteratorSet["__cardinality__"], Expr["__cardinality__"]>>;
export { _for as for };
