import { ExpressionKind, Cardinality } from "edgedb/dist/reflection/index";
import type { BaseType, Expression, TypeSet } from "./typesystem";
import type { $expr_Select } from "./select";
import type { $expr_For } from "./for";
import type { $expr_Insert } from "./insert";
import type { $expr_Update } from "./update";
import type { $expr_Group } from "./group";
export declare type $expr_Alias<El extends BaseType = BaseType, Card extends Cardinality = Cardinality> = Expression<{
    __element__: El;
    __cardinality__: Card;
    __kind__: ExpressionKind.Alias;
    __expr__: TypeSet;
}>;
export declare function alias<Expr extends Expression>(expr: Expr): $expr_Alias<Expr["__element__"], Expr["__cardinality__"]>;
export declare type WithableExpression = $expr_Select | $expr_For | $expr_Insert | $expr_Update | $expr_Group;
export declare type $expr_With<Expr extends WithableExpression = WithableExpression> = Expression<{
    __element__: Expr["__element__"];
    __cardinality__: Expr["__cardinality__"];
    __kind__: ExpressionKind.With;
    __expr__: Expr;
    __refs__: TypeSet[];
}>;
declare function _with<Expr extends WithableExpression>(refs: Expression[], expr: Expr): $expr_With<Expr>;
export { _with as with };
