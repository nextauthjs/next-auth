import type { Expression, BaseType, BaseTypeToTsType, ScalarType } from "./typesystem";
import { Cardinality, ExpressionKind } from "edgedb/dist/reflection/index";
export declare type $expr_Literal<Type extends BaseType = BaseType> = Expression<{
    __element__: Type;
    __cardinality__: Cardinality.One;
    __kind__: ExpressionKind.Literal;
    __value__: any;
}>;
export declare function literal<T extends BaseType>(type: T, value: BaseTypeToTsType<T>): $expr_Literal<T>;
export declare const $nameMapping: Map<string, string>;
export declare function $getType(id: string): (val: any) => $expr_Literal<ScalarType>;
export declare function $getTypeByName(name: string): (val: any) => $expr_Literal<ScalarType>;
