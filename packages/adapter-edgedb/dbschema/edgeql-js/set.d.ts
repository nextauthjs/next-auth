import type { ExpressionKind, Cardinality } from "edgedb/dist/reflection/index";
import type { ArrayType, BaseTypeTuple, BaseType, NamedTupleType, ObjectTypeSet, TypeSet, TupleType, Expression, ObjectType, getPrimitiveBaseType, SomeType } from "./typesystem";
import { mergeObjectTypes } from "./hydrate";
import * as castMaps from "./castMaps";
export declare function getSharedParent(a: SomeType, b: SomeType): SomeType;
export { set } from "./setImpl";
export declare type $expr_Set<Set extends LooseTypeSet = LooseTypeSet> = Expression<{
    __element__: Set["__element__"];
    __cardinality__: Set["__cardinality__"];
    __exprs__: TypeSet[];
    __kind__: ExpressionKind.Set;
}>;
declare type mergeTypeTuples<AItems, BItems> = {
    [k in keyof AItems]: k extends keyof BItems ? getSharedParentPrimitive<AItems[k], BItems[k]> : never;
};
export declare type getSharedParentPrimitive<A, B> = A extends undefined ? B extends undefined ? undefined : B : B extends undefined ? A : A extends ArrayType<infer AEl> ? B extends ArrayType<infer BEl> ? ArrayType<castMaps.getSharedParentScalar<AEl, BEl>> : never : A extends NamedTupleType<infer AShape> ? B extends NamedTupleType<infer BShape> ? NamedTupleType<{
    [k in keyof AShape & keyof BShape]: castMaps.getSharedParentScalar<AShape[k], BShape[k]>;
}> : never : A extends TupleType<infer AItems> ? B extends TupleType<infer BItems> ? mergeTypeTuples<AItems, BItems> extends BaseTypeTuple ? TupleType<mergeTypeTuples<AItems, BItems>> : never : never : castMaps.getSharedParentScalar<A, B>;
declare type _getSharedParentPrimitiveVariadic<Types extends [any, ...any[]]> = Types extends [infer U] ? U : Types extends [infer A, infer B, ...infer Rest] ? _getSharedParentPrimitiveVariadic<[
    getSharedParentPrimitive<A, B>,
    ...Rest
]> : never;
export declare type getSharedParentPrimitiveVariadic<Types extends [any, ...any[]]> = _getSharedParentPrimitiveVariadic<Types>;
export declare type LooseTypeSet<T extends any = any, C extends Cardinality = Cardinality> = {
    __element__: T;
    __cardinality__: C;
};
export type { mergeObjectTypes };
declare type _mergeObjectTypesVariadic<Types extends [ObjectType, ...ObjectType[]]> = Types extends [infer U] ? U : Types extends [infer A, infer B, ...infer Rest] ? A extends ObjectType ? B extends ObjectType ? mergeObjectTypes<A, B> extends BaseType ? mergeObjectTypesVariadic<[mergeObjectTypes<A, B>, ...Rest]> : never : never : never : never;
export declare type mergeObjectTypesVariadic<Types extends [any, ...any[]]> = _mergeObjectTypesVariadic<Types>;
export declare type getTypesFromExprs<Exprs extends [TypeSet, ...TypeSet[]]> = {
    [k in keyof Exprs]: Exprs[k] extends TypeSet<infer El, any> ? getPrimitiveBaseType<El> : never;
};
export declare type getTypesFromObjectExprs<Exprs extends [ObjectTypeSet, ...ObjectTypeSet[]]> = {
    [k in keyof Exprs]: Exprs[k] extends TypeSet<infer El, any> ? El : never;
};
export declare type getCardsFromExprs<Exprs extends [TypeSet, ...TypeSet[]]> = {
    [k in keyof Exprs]: Exprs[k] extends TypeSet<any, infer Card> ? Card : never;
};
