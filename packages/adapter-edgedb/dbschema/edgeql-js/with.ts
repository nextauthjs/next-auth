import {ExpressionKind, Cardinality} from "edgedb/dist/reflection/index";
import type {BaseType, Expression, TypeSet} from "./typesystem";
import type {$expr_Select} from "./select";
import type {$expr_For} from "./for";
import type {$expr_Insert} from "./insert";
import type {$expr_Update} from "./update";
import type {$expr_Group} from "./group";
import {$expressionify} from "./path";

export type $expr_Alias<
  El extends BaseType = BaseType,
  Card extends Cardinality = Cardinality
> = Expression<{
  __element__: El;
  __cardinality__: Card;
  __kind__: ExpressionKind.Alias;
  __expr__: TypeSet;
}>;

export function alias<Expr extends Expression>(
  expr: Expr
): $expr_Alias<Expr["__element__"], Expr["__cardinality__"]> {
  return $expressionify({
    __kind__: ExpressionKind.Alias,
    __element__: expr.__element__,
    __cardinality__: expr.__cardinality__,
    __expr__: expr
  }) as any;
}

export type WithableExpression =
  | $expr_Select
  | $expr_For
  | $expr_Insert
  | $expr_Update
  | $expr_Group;

export type $expr_With<
  // Refs extends TypeSet[] = TypeSet[],
  Expr extends WithableExpression = WithableExpression
> = Expression<{
  __element__: Expr["__element__"];
  __cardinality__: Expr["__cardinality__"];
  __kind__: ExpressionKind.With;
  __expr__: Expr;
  __refs__: TypeSet[];
}>;

function _with<Expr extends WithableExpression>(
  refs: Expression[],
  expr: Expr
): $expr_With<Expr> {
  return $expressionify({
    __kind__: ExpressionKind.With,
    __element__: expr.__element__,
    __cardinality__: expr.__cardinality__,
    __refs__: refs,
    __expr__: expr as any
  }) as any;
}

export {_with as with};
