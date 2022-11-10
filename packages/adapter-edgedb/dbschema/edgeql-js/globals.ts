import {ExpressionKind, Cardinality} from "edgedb/dist/reflection/index";
import type {Expression, BaseType} from "./typesystem";
import {$expressionify} from "./path";

export function makeGlobal<
  // Name extends string,
  Type extends BaseType,
  Card extends Cardinality
>(name: string, type: Type, card: Card): $expr_Global<Type, Card> {
  return $expressionify({
    __name__: name,
    __element__: type,
    __cardinality__: card,
    __kind__: ExpressionKind.Global
  });
}

export type $expr_Global<
  // Name extends string = string,
  Type extends BaseType = BaseType,
  Card extends Cardinality = Cardinality
> = Expression<{
  __name__: string;
  __element__: Type;
  __cardinality__: Card;
  __kind__: ExpressionKind.Global;
}>;
