import { ExpressionKind, Cardinality } from "edgedb/dist/reflection/index";
import type { Expression, BaseType, TypeSet } from "./typesystem";
import type { orScalarLiteral } from "./castMaps";
export declare function cast<Target extends BaseType>(target: Target, arg: null): $expr_Cast<Target, Cardinality.Empty>;
export declare function cast<Target extends BaseType, Expr extends TypeSet>(target: Target, expr: orScalarLiteral<Expr>): $expr_Cast<Target, Cardinality extends Expr["__cardinality__"] ? Cardinality.One : Expr["__cardinality__"]>;
export declare type $expr_Cast<Target extends BaseType = BaseType, Card extends Cardinality = Cardinality> = Expression<{
    __element__: Target;
    __cardinality__: Card;
    __kind__: ExpressionKind.Cast;
    __expr__: TypeSet | null;
}>;
