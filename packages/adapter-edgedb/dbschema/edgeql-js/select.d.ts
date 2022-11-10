import type { $bool, $number } from "./modules/std";
import { Cardinality, ExpressionKind } from "edgedb/dist/reflection/index";
import { cardutil } from "./cardinality";
import type { $expr_PolyShapeElement, $scopify, Expression, LinkDesc, ObjectType, ObjectTypeExpression, ObjectTypePointers, ObjectTypeSet, PrimitiveTypeSet, PropertyDesc, ScalarType, stripSet, TypeSet, BaseType, ExclusiveTuple, orLiteralValue } from "./typesystem";
import type { $expr_PathLeaf, $linkPropify, ExpressionRoot } from "./path";
import type { anonymizeObject } from "./casting";
import { scalarLiterals, literalToScalarType } from "./castMaps";
export declare const ASC: "ASC";
export declare const DESC: "DESC";
export declare const EMPTY_FIRST: "EMPTY FIRST";
export declare const EMPTY_LAST: "EMPTY LAST";
export declare type OrderByDirection = "ASC" | "DESC";
export declare type OrderByEmpty = "EMPTY FIRST" | "EMPTY LAST";
export declare type OrderByExpr = TypeSet<ScalarType | ObjectType, Cardinality>;
export declare type OrderByObjExpr = {
    expression: OrderByExpr;
    direction?: OrderByDirection;
    empty?: OrderByEmpty;
};
export declare type OrderByExpression = OrderByExpr | OrderByObjExpr | [OrderByExpr | OrderByObjExpr, ...(OrderByExpr | OrderByObjExpr)[]];
export declare type OffsetExpression = TypeSet<$number, Cardinality.Empty | Cardinality.One | Cardinality.AtMostOne>;
export declare type SelectFilterExpression = TypeSet<$bool, Cardinality>;
export declare type LimitOffsetExpression = TypeSet<$number, Cardinality.Empty | Cardinality.One | Cardinality.AtMostOne>;
export declare type LimitExpression = TypeSet<$number, Cardinality.Empty | Cardinality.One | Cardinality.AtMostOne>;
export declare type SelectModifierNames = "filter" | "filter_single" | "order_by" | "offset" | "limit";
export declare type exclusivesToFilterSingle<E extends ExclusiveTuple> = ExclusiveTuple extends E ? never : E extends [] ? never : {
    [j in keyof E]: {
        [k in keyof E[j]]: orLiteralValue<E[j][k]>;
    };
}[number];
export declare type SelectModifiers<T extends ObjectType = ObjectType> = {
    filter?: SelectFilterExpression;
    filter_single?: // | Partial<
    exclusivesToFilterSingle<T["__exclusives__"]> | SelectFilterExpression;
    order_by?: OrderByExpression;
    offset?: OffsetExpression | number;
    limit?: LimitExpression | number;
};
export declare type UnknownSelectModifiers = {
    [k in keyof SelectModifiers]: unknown;
};
export declare type NormalisedSelectModifiers = {
    filter?: SelectFilterExpression;
    order_by?: OrderByObjExpr[];
    offset?: OffsetExpression;
    limit?: LimitExpression;
    singleton: boolean;
};
export declare type $expr_Select<Set extends TypeSet = TypeSet> = Expression<{
    __element__: Set["__element__"];
    __cardinality__: Set["__cardinality__"];
    __expr__: TypeSet;
    __kind__: ExpressionKind.Select;
    __modifiers__: NormalisedSelectModifiers;
    __scope__?: ObjectTypeExpression;
}>;
export interface SelectModifierMethods<Root extends TypeSet> {
    filter<Filter extends SelectFilterExpression>(filter: Filter | ((scope: Root extends ObjectTypeSet ? $scopify<Root["__element__"]> : stripSet<Root>) => Filter)): this;
    order_by(order_by: OrderByExpression | ((scope: Root extends ObjectTypeSet ? $scopify<Root["__element__"]> : stripSet<Root>) => OrderByExpression)): this;
    offset(offset: OffsetExpression | number | ((scope: Root extends ObjectTypeSet ? $scopify<Root["__element__"]> : stripSet<Root>) => OffsetExpression | number)): this;
    limit(limit: LimitExpression | number | ((scope: Root extends ObjectTypeSet ? $scopify<Root["__element__"]> : stripSet<Root>) => LimitExpression | number)): this;
}
export declare type InferOffsetLimitCardinality<Card extends Cardinality, Modifers extends UnknownSelectModifiers> = Modifers["limit"] extends number | LimitExpression ? cardutil.overrideLowerBound<Card, "Zero"> : Modifers["offset"] extends number | OffsetExpression ? cardutil.overrideLowerBound<Card, "Zero"> : Card;
export declare type ComputeSelectCardinality<Expr extends ObjectTypeExpression, Modifiers extends UnknownSelectModifiers> = InferOffsetLimitCardinality<undefined extends Modifiers["filter_single"] ? Expr["__cardinality__"] : cardutil.overrideUpperBound<Expr["__cardinality__"], "One">, Modifiers>;
export declare function is<Expr extends ObjectTypeExpression, Shape extends objectTypeToSelectShape<Expr["__element__"]>>(expr: Expr, shape: Shape): {
    [k in Exclude<keyof Shape, SelectModifierNames>]: $expr_PolyShapeElement<Expr, normaliseElement<Shape[k]>>;
};
export declare function $handleModifiers(modifiers: SelectModifiers, params: {
    root: TypeSet;
    scope: TypeSet;
}): {
    modifiers: NormalisedSelectModifiers;
    cardinality: Cardinality;
};
export declare type $expr_Delete<Root extends ObjectTypeSet = ObjectTypeSet> = Expression<{
    __kind__: ExpressionKind.Delete;
    __element__: Root["__element__"];
    __cardinality__: Root["__cardinality__"];
    __expr__: ObjectTypeSet;
}>;
declare function deleteExpr<Expr extends ObjectTypeExpression, Modifiers extends SelectModifiers<Expr["__element__"]>>(expr: Expr, modifiers?: (scope: $scopify<Expr["__element__"]>) => Readonly<Modifiers>): $expr_Delete<{
    __element__: ObjectType<Expr["__element__"]["__name__"], Expr["__element__"]["__pointers__"], {
        id: true;
    }>;
    __cardinality__: ComputeSelectCardinality<Expr, Modifiers>;
}>;
export { deleteExpr as delete };
export declare function $selectify<Expr extends ExpressionRoot>(expr: Expr): Expr;
export declare type linkDescToLinkProps<Desc extends LinkDesc> = {
    [k in keyof Desc["properties"] & string]: $expr_PathLeaf<TypeSet<Desc["properties"][k]["target"], Desc["properties"][k]["cardinality"]>>;
};
export declare type pointersToObjectType<P extends ObjectTypePointers> = ObjectType<string, P, {}>;
declare type linkDescToShape<L extends LinkDesc> = objectTypeToSelectShape<L["target"]> & objectTypeToSelectShape<pointersToObjectType<L["properties"]>> & SelectModifiers;
export declare type linkDescToSelectElement<L extends LinkDesc> = boolean | TypeSet<anonymizeObject<L["target"]>, cardutil.assignable<L["cardinality"]>> | linkDescToShape<L> | ((scope: $scopify<L["target"]> & linkDescToLinkProps<L>) => linkDescToShape<L>);
export declare type objectTypeToSelectShape<T extends ObjectType = ObjectType> = Partial<{
    [k in keyof T["__pointers__"]]: T["__pointers__"][k] extends PropertyDesc ? boolean | TypeSet<T["__pointers__"][k]["target"], cardutil.assignable<T["__pointers__"][k]["cardinality"]>> : T["__pointers__"][k] extends LinkDesc ? linkDescToSelectElement<T["__pointers__"][k]> : any;
}> & {
    [k: string]: unknown;
};
export declare type normaliseElement<El> = El extends boolean ? El : El extends TypeSet ? stripSet<El> : El extends (...scope: any[]) => any ? normaliseShape<ReturnType<El>> : El extends object ? normaliseShape<stripSet<El>> : stripSet<El>;
export declare type normaliseShape<Shape extends object, Strip = SelectModifierNames> = {
    [k in Exclude<keyof Shape, Strip>]: normaliseElement<Shape[k]>;
};
export declare const $existingScopes: Set<Expression<TypeSet<BaseType, Cardinality>, true>>;
declare function $shape<Expr extends ObjectTypeExpression, Shape extends objectTypeToSelectShape<Expr["__element__"]> & SelectModifiers<Expr["__element__"]>>(expr: Expr, _shape: (scope: $scopify<Expr["__element__"]> & $linkPropify<{
    [k in keyof Expr]: k extends "__cardinality__" ? Cardinality.One : Expr[k];
}>) => Readonly<Shape>): (scope: unknown) => Readonly<Shape>;
export { $shape as shape };
export declare function select<Expr extends ObjectTypeExpression>(expr: Expr): $expr_Select<{
    __element__: ObjectType<`${Expr["__element__"]["__name__"]}`, // _shape
    Expr["__element__"]["__pointers__"], Expr["__element__"]["__shape__"]>;
    __cardinality__: Expr["__cardinality__"];
}>;
export declare function select<Expr extends TypeSet>(expr: Expr): $expr_Select<stripSet<Expr>>;
export declare function select<Expr extends ObjectTypeExpression, Shape extends objectTypeToSelectShape<Expr["__element__"]> & SelectModifiers<Expr["__element__"]>, Modifiers extends UnknownSelectModifiers = Pick<Shape, SelectModifierNames>>(expr: Expr, shape: (scope: $scopify<Expr["__element__"]> & $linkPropify<{
    [k in keyof Expr]: k extends "__cardinality__" ? Cardinality.One : Expr[k];
}>) => Readonly<Shape>): $expr_Select<{
    __element__: ObjectType<`${Expr["__element__"]["__name__"]}`, // _shape
    Expr["__element__"]["__pointers__"], Omit<normaliseShape<Shape>, SelectModifierNames>>;
    __cardinality__: ComputeSelectCardinality<Expr, Modifiers>;
}>;
export declare function select<Expr extends PrimitiveTypeSet, Modifiers extends SelectModifiers>(expr: Expr, modifiers: (expr: Expr) => Readonly<Modifiers>): $expr_Select<{
    __element__: Expr["__element__"];
    __cardinality__: InferOffsetLimitCardinality<Expr["__cardinality__"], Modifiers>;
}>;
export declare function select<Shape extends {
    [key: string]: TypeSet;
}>(shape: Shape): $expr_Select<{
    __element__: ObjectType<`std::FreeObject`, {
        [k in keyof Shape]: Shape[k]["__element__"] extends ObjectType ? LinkDesc<Shape[k]["__element__"], Shape[k]["__cardinality__"], {}, false, true, true, false> : PropertyDesc<Shape[k]["__element__"], Shape[k]["__cardinality__"], false, true, true, false>;
    }, Shape>;
    __cardinality__: Cardinality.One;
}>;
export declare function select<Expr extends scalarLiterals>(expr: Expr): $expr_Select<{
    __element__: literalToScalarType<Expr>;
    __cardinality__: Cardinality.One;
}>;
export declare function resolveShapeElement(key: any, value: any, scope: ObjectTypeExpression): any;
