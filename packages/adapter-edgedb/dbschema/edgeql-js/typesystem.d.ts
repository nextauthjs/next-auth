import type { Executor } from "edgedb/dist/ifaces";
import type { $expr_PathNode, $expr_TypeIntersection, $pathify } from "./path";
import type { $expr_Literal } from "./literal";
import type { $expr_Operator } from "./funcops";
import type { typeutil, Cardinality, ExpressionKind } from "edgedb/dist/reflection/index";
import { TypeKind } from "edgedb/dist/reflection/index";
import type { cardutil } from "./cardinality";
import type { Range } from "edgedb";
export interface BaseType {
    __kind__: TypeKind;
    __name__: string;
}
export declare type BaseTypeSet = {
    __element__: BaseType;
    __cardinality__: Cardinality;
};
export declare type BaseTypeTuple = typeutil.tupleOf<BaseType>;
export interface ScalarType<Name extends string = string, TsType extends any = any, TsConstType extends TsType = TsType> extends BaseType {
    __kind__: TypeKind.scalar;
    __tstype__: TsType;
    __tsconsttype__: TsConstType;
    __name__: Name;
}
export declare type scalarTypeWithConstructor<S extends ScalarType, ExtraTsTypes extends any = never> = S & {
    <T extends S["__tstype__"] | ExtraTsTypes>(val: T): $expr_Literal<ScalarType<S["__name__"], S["__tstype__"], T extends S["__tstype__"] ? T : S["__tstype__"]>>;
};
declare type $jsonDestructure<Set extends TypeSet> = Set["__element__"] extends ScalarType<"std::json"> ? {
    [path: string]: $expr_Operator<Set["__element__"], Set["__cardinality__"]>;
} & {
    destructure<T extends TypeSet<ScalarType<"std::str">> | string>(path: T): $expr_Operator<Set["__element__"], cardutil.multiplyCardinalities<Set["__cardinality__"], T extends TypeSet ? T["__cardinality__"] : Cardinality.One>>;
} : unknown;
export interface TypeSet<T extends BaseType = BaseType, Card extends Cardinality = Cardinality> {
    __element__: T;
    __cardinality__: Card;
}
export declare function $toSet<Root extends BaseType, Card extends Cardinality>(root: Root, card: Card): TypeSet<Root, Card>;
export declare type Expression<Set extends TypeSet = TypeSet, Runnable extends boolean = true> = Set & (BaseType extends Set["__element__"] ? {
    run(cxn: Executor): any;
    runJSON(cxn: Executor): any;
    toEdgeQL(): string;
    is: any;
    assert_single: any;
} : $pathify<Set> & ExpressionMethods<stripSet<Set>> & (Runnable extends true ? {
    run(cxn: Executor): Promise<setToTsType<Set>>;
    runJSON(cxn: Executor): Promise<string>;
} : {}) & $tuplePathify<Set> & $arrayLikeIndexify<Set> & $jsonDestructure<Set>);
export declare type stripSet<T> = "__element__" extends keyof T ? "__cardinality__" extends keyof T ? {
    __element__: T["__element__"];
    __cardinality__: T["__cardinality__"];
} : T : T;
export declare type stripSetShape<T> = {
    [k in keyof T]: stripSet<T[k]>;
};
export declare type assert_single<El extends BaseType, Card extends Cardinality> = Expression<{
    __element__: El;
    __cardinality__: Card;
    __kind__: ExpressionKind.Function;
    __name__: "std::assert_single";
    __args__: TypeSet[];
    __namedargs__: {};
}>;
export declare type ExpressionMethods<Set extends TypeSet> = {
    toEdgeQL(): string;
    is<T extends ObjectTypeSet>(ixn: T): $expr_TypeIntersection<Set["__cardinality__"], ObjectType<T["__element__"]["__name__"], T["__element__"]["__pointers__"], {
        id: true;
    }>>;
    assert_single(): assert_single<Set["__element__"], Cardinality.AtMostOne>;
};
export interface EnumType<Name extends string = string, Values extends [string, ...string[]] = [string, ...string[]]> extends BaseType {
    __kind__: TypeKind.enum;
    __tstype__: Values[number];
    __name__: Name;
    __values__: Values;
}
export declare type ObjectTypeSet = TypeSet<ObjectType, Cardinality>;
export declare type ObjectTypeExpression = TypeSet<ObjectType, Cardinality>;
export declare type ExclusiveTuple = typeutil.tupleOf<{
    [k: string]: TypeSet;
}>;
export interface ObjectType<Name extends string = string, Pointers extends ObjectTypePointers = ObjectTypePointers, Shape extends object | null = any, Exclusives extends ExclusiveTuple = ExclusiveTuple> extends BaseType {
    __kind__: TypeKind.object;
    __name__: Name;
    __pointers__: Pointers;
    __shape__: Shape;
    __exclusives__: Exclusives;
}
export declare type PropertyTypes = ScalarType | EnumType | ArrayType | TupleType | NamedTupleType;
export declare type SomeType = ScalarType | EnumType | ArrayType | TupleType | ObjectType | NamedTupleType | RangeType;
export interface PropertyDesc<Type extends BaseType = BaseType, Card extends Cardinality = Cardinality, Exclusive extends boolean = boolean, Computed extends boolean = boolean, Readonly extends boolean = boolean, HasDefault extends boolean = boolean> {
    __kind__: "property";
    target: Type;
    cardinality: Card;
    exclusive: Exclusive;
    computed: Computed;
    readonly: Readonly;
    hasDefault: HasDefault;
}
export declare type $scopify<Type extends ObjectType> = $expr_PathNode<TypeSet<Type, Cardinality.One>>;
export declare type PropertyShape = {
    [k: string]: PropertyDesc;
};
export interface LinkDesc<Type extends ObjectType = any, Card extends Cardinality = Cardinality, LinkProps extends PropertyShape = any, Exclusive extends boolean = boolean, Computed extends boolean = boolean, Readonly extends boolean = boolean, HasDefault extends boolean = boolean> {
    __kind__: "link";
    target: Type;
    cardinality: Card;
    properties: LinkProps;
    exclusive: Exclusive;
    computed: Computed;
    readonly: Readonly;
    hasDefault: HasDefault;
}
export declare type ObjectTypePointers = {
    [k: string]: PropertyDesc | LinkDesc;
};
export declare type stripBacklinks<T extends ObjectTypePointers> = {
    [k in keyof T]: k extends `<${string}` ? never : T[k];
};
export declare type omitBacklinks<T extends string | number | symbol> = T extends `<${string}` ? never : T extends string ? T : never;
export declare type stripNonUpdateables<T extends ObjectTypePointers> = {
    [k in keyof T]: [T[k]["computed"]] extends [true] ? never : [T[k]["readonly"]] extends [true] ? never : k extends "__type__" ? never : k extends "id" ? never : T[k];
};
export declare type stripNonInsertables<T extends ObjectTypePointers> = {
    [k in keyof T]: [T[k]["computed"]] extends [true] ? never : [k] extends ["__type__"] ? never : T[k];
};
declare type shapeElementToTs<Pointer extends PropertyDesc | LinkDesc, Element> = [
    Element
] extends [true] ? pointerToTsType<Pointer> : [Element] extends [false] ? never : [Element] extends [boolean] ? pointerToTsType<Pointer> | undefined : Element extends TypeSet ? setToTsType<TypeSet<Element["__element__"], Pointer["cardinality"]>> : Pointer extends LinkDesc ? Element extends object ? computeTsTypeCard<computeObjectShape<Pointer["target"]["__pointers__"] & Pointer["properties"], Element>, Pointer["cardinality"]> : never : never;
export declare type $expr_PolyShapeElement<PolyType extends ObjectTypeSet = ObjectTypeSet, ShapeElement extends any = any> = {
    __kind__: ExpressionKind.PolyShapeElement;
    __polyType__: PolyType;
    __shapeElement__: ShapeElement;
};
export declare type computeObjectShape<Pointers extends ObjectTypePointers, Shape> = typeutil.flatten<keyof Shape extends never ? {
    id: string;
} : {
    [k in keyof Shape]: Shape[k] extends $expr_PolyShapeElement<infer PolyType, infer ShapeEl> ? [k] extends [keyof PolyType["__element__"]["__pointers__"]] ? shapeElementToTs<PolyType["__element__"]["__pointers__"][k], ShapeEl> | null : never : [k] extends [keyof Pointers] ? shapeElementToTs<Pointers[k], Shape[k]> : Shape[k] extends TypeSet ? setToTsType<Shape[k]> : never;
}>;
export declare type pointerToTsTypeSimple<El extends PropertyDesc | LinkDesc> = El extends PropertyDesc ? propToTsType<El> : El extends LinkDesc<any, any, any, any> ? {
    id: string;
} : never;
export declare type PrimitiveType = ScalarType | EnumType | TupleType | NamedTupleType | ArrayType | RangeType;
export declare type PrimitiveTypeSet = TypeSet<PrimitiveType, Cardinality>;
declare type $arrayLikeIndexify<Set extends TypeSet> = Set["__element__"] extends ArrayType | ScalarType<"std::str"> | ScalarType<"std::bytes"> ? {
    [index: number]: $expr_Operator<getPrimitiveBaseType<Set["__element__"] extends ArrayType<infer El> ? El : Set["__element__"]>, Set["__cardinality__"]>;
    [slice: `${number}:${number | ""}` | `:${number}`]: $expr_Operator<getPrimitiveBaseType<Set["__element__"]>, Set["__cardinality__"]>;
    index<T extends TypeSet<ScalarType<"std::number">> | number>(index: T): $expr_Operator<getPrimitiveBaseType<Set["__element__"] extends ArrayType<infer El> ? El : Set["__element__"]>, cardutil.multiplyCardinalities<Set["__cardinality__"], T extends TypeSet ? T["__cardinality__"] : Cardinality.One>>;
    slice<S extends TypeSet<ScalarType<"std::number">> | number, E extends TypeSet<ScalarType<"std::number">> | number | undefined | null>(start: S, end: E): $expr_Operator<getPrimitiveBaseType<Set["__element__"]>, cardutil.multiplyCardinalities<cardutil.multiplyCardinalities<Set["__cardinality__"], S extends TypeSet ? S["__cardinality__"] : Cardinality.One>, E extends TypeSet<any, infer C> ? C : Cardinality.One>>;
    slice<E extends TypeSet<ScalarType<"std::number">> | number | undefined | null>(start: undefined | null, end: E): $expr_Operator<getPrimitiveBaseType<Set["__element__"]>, cardutil.multiplyCardinalities<Set["__cardinality__"], E extends TypeSet<any, infer C> ? C : Cardinality.One>>;
} : unknown;
export declare type $expr_Array<Type extends ArrayType = ArrayType, Card extends Cardinality = Cardinality> = Expression<{
    __kind__: ExpressionKind.Array;
    __items__: typeutil.tupleOf<TypeSet<Type["__element__"]>>;
    __element__: Type;
    __cardinality__: Card;
}>;
export interface ArrayType<Element extends BaseType = BaseType, Name extends string = `array<${Element["__name__"]}>`> extends BaseType {
    __name__: Name;
    __kind__: TypeKind.array;
    __element__: Element;
}
declare type ArrayTypeToTsType<Type extends ArrayType> = BaseTypeToTsType<Type["__element__"]>[];
declare type $tuplePathify<Set extends TypeSet> = Set["__element__"] extends TupleType ? addTuplePaths<Set["__element__"]["__items__"], Set["__cardinality__"]> : Set["__element__"] extends NamedTupleType ? addNamedTuplePaths<Set["__element__"]["__shape__"], Set["__cardinality__"]> : unknown;
export declare type $expr_TuplePath<ItemType extends BaseType = BaseType, ParentCard extends Cardinality = Cardinality> = Expression<{
    __kind__: ExpressionKind.TuplePath;
    __element__: ItemType;
    __cardinality__: ParentCard;
    __parent__: $expr_Tuple | $expr_NamedTuple | $expr_TuplePath;
    __index__: string | number;
}>;
export declare type baseTupleElementsToTupleType<T extends typeutil.tupleOf<TypeSet>> = {
    [k in keyof T]: T[k] extends TypeSet ? getPrimitiveBaseType<T[k]["__element__"]> : never;
};
export declare type tupleElementsToTupleType<T extends typeutil.tupleOf<TypeSet>> = baseTupleElementsToTupleType<T> extends BaseTypeTuple ? TupleType<baseTupleElementsToTupleType<T>> : never;
export declare type baseTupleElementsToCardTuple<T> = {
    [k in keyof T]: T[k] extends TypeSet<any, infer C> ? C : never;
};
export declare type tupleElementsToCardTuple<T> = baseTupleElementsToCardTuple<T> extends [Cardinality, ...Cardinality[]] ? baseTupleElementsToCardTuple<T> : never;
export declare type $expr_Tuple<Items extends typeutil.tupleOf<TypeSet> = typeutil.tupleOf<TypeSet>> = Expression<{
    __kind__: ExpressionKind.Tuple;
    __items__: typeutil.tupleOf<TypeSet>;
    __element__: tupleElementsToTupleType<Items>;
    __cardinality__: cardutil.multiplyCardinalitiesVariadic<tupleElementsToCardTuple<Items>>;
}>;
export declare type indexKeys<T> = T extends `${number}` ? T : never;
declare type addTuplePaths<Items extends BaseType[], ParentCard extends Cardinality> = {
    [k in indexKeys<keyof Items>]: Items[k] extends BaseType ? $expr_TuplePath<Items[k], ParentCard> : never;
};
export interface TupleType<Items extends BaseTypeTuple = BaseTypeTuple> extends BaseType {
    __name__: string;
    __kind__: TypeKind.tuple;
    __items__: Items;
}
declare type TupleItemsToTsType<Items extends BaseTypeTuple> = {
    [k in keyof Items]: Items[k] extends BaseType ? BaseTypeToTsType<Items[k]> : never;
};
declare type literalShapeToType<T extends NamedTupleLiteralShape> = NamedTupleType<{
    [k in keyof T]: getPrimitiveBaseType<T[k]["__element__"]>;
}>;
declare type shapeCardinalities<Shape extends NamedTupleLiteralShape> = Shape[keyof Shape]["__cardinality__"];
declare type inferNamedTupleCardinality<Shape extends NamedTupleLiteralShape> = [
    Cardinality.Many
] extends [shapeCardinalities<Shape>] ? Cardinality.Many : [Cardinality.Empty] extends [shapeCardinalities<Shape>] ? Cardinality.Empty : [shapeCardinalities<Shape>] extends [Cardinality.AtMostOne] ? Cardinality.AtMostOne : [shapeCardinalities<Shape>] extends [
    Cardinality.AtMostOne | Cardinality.One
] ? Cardinality.One : Cardinality.Many;
export declare type $expr_NamedTuple<Shape extends NamedTupleLiteralShape = NamedTupleLiteralShape> = Expression<{
    __kind__: ExpressionKind.NamedTuple;
    __element__: literalShapeToType<Shape>;
    __cardinality__: inferNamedTupleCardinality<Shape>;
    __shape__: Shape;
}>;
declare type addNamedTuplePaths<Shape extends NamedTupleShape, ParentCard extends Cardinality> = {
    [k in keyof Shape]: Shape[k] extends BaseType ? $expr_TuplePath<Shape[k], ParentCard> : never;
};
export declare type NamedTupleLiteralShape = {
    [k: string]: TypeSet;
};
export declare type NamedTupleShape = {
    [k: string]: BaseType;
};
export interface NamedTupleType<Shape extends NamedTupleShape = NamedTupleShape> extends BaseType {
    __name__: string;
    __kind__: TypeKind.namedtuple;
    __shape__: Shape;
}
declare type NamedTupleTypeToTsType<Type extends NamedTupleType> = {
    [k in keyof Type["__shape__"]]: BaseTypeToTsType<Type["__shape__"][k]>;
};
export interface RangeType<Element extends ScalarType = ScalarType, Name extends string = `range<${Element["__name__"]}>`> extends BaseType {
    __name__: Name;
    __kind__: TypeKind.range;
    __element__: Element;
}
export declare type orLiteralValue<Set extends TypeSet> = Set | (Set["__element__"] extends ObjectType ? never : computeTsType<Set["__element__"], Set["__cardinality__"]>);
export declare type BaseTypeToTsType<Type extends BaseType> = Type extends ScalarType ? Type["__tsconsttype__"] : Type extends EnumType ? Type["__tstype__"] : Type extends ArrayType<any> ? typeutil.flatten<ArrayTypeToTsType<Type>> : Type extends RangeType ? Range<Type["__element__"]["__tsconsttype__"]> : Type extends TupleType ? TupleItemsToTsType<Type["__items__"]> : Type extends NamedTupleType ? typeutil.flatten<NamedTupleTypeToTsType<Type>> : Type extends ObjectType ? typeutil.flatten<computeObjectShape<Type["__pointers__"], Type["__shape__"]>> : never;
export declare type setToTsType<Set extends TypeSet> = computeTsType<Set["__element__"], Set["__cardinality__"]>;
export declare type computeTsTypeCard<T extends any, C extends Cardinality> = Cardinality extends C ? unknown : C extends Cardinality.Empty ? null : C extends Cardinality.One ? T : C extends Cardinality.AtLeastOne ? [T, ...T[]] : C extends Cardinality.AtMostOne ? T | null : C extends Cardinality.Many ? T[] : C extends Cardinality ? unknown : never;
export declare type computeTsType<T extends BaseType, C extends Cardinality> = BaseType extends T ? unknown : computeTsTypeCard<BaseTypeToTsType<T>, C>;
export declare type propToTsType<Prop extends PropertyDesc> = Prop extends PropertyDesc<infer Type, infer Card> ? setToTsType<TypeSet<Type, Card>> : never;
export declare type linkToTsType<Link extends LinkDesc> = computeTsType<Link["target"], Link["cardinality"]>;
export declare type pointerToTsType<El extends PropertyDesc | LinkDesc> = El extends PropertyDesc ? propToTsType<El> : El extends LinkDesc<any, any, any, any> ? linkToTsType<El> : never;
export declare type getPrimitiveBaseType<T extends BaseType> = T extends ScalarType ? ScalarType<T["__name__"], T["__tstype__"]> : T;
export declare type getPrimitiveNonArrayBaseType<T extends BaseType> = T extends NonArrayType ? getPrimitiveBaseType<T> : never;
export declare function isScalarType(type: BaseType): type is ScalarType;
export declare function isEnumType(type: BaseType): type is EnumType;
export declare function isObjectType(type: BaseType): type is ObjectType;
export declare function isTupleType(type: BaseType): type is TupleType;
export declare function isNamedTupleType(type: BaseType): type is NamedTupleType;
export declare function isArrayType(type: BaseType): type is ArrayType;
export declare type NonArrayType = ScalarType | EnumType | ObjectType | TupleType | NamedTupleType | RangeType;
export declare type AnyTupleType = TupleType | NamedTupleType;
export declare type ParamType = ScalarType | EnumType | ArrayType<ScalarType | TupleType<typeutil.tupleOf<ParamType>> | NamedTupleType<{
    [k: string]: ParamType;
}> | RangeType> | TupleType<typeutil.tupleOf<ParamType>> | NamedTupleType<{
    [k: string]: ParamType;
}> | RangeType;
export {};
