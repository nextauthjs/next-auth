import type { Expression, ObjectType, ObjectTypeSet, TypeSet, BaseType, $scopify, PropertyDesc, LinkDesc } from "./typesystem";
import { Cardinality, ExpressionKind } from "edgedb/dist/reflection/index";
import type { $FreeObjectλShape, $str } from "./modules/std";
import type { normaliseShape, objectTypeToSelectShape } from "./select";
declare type SingletonSet = Expression<TypeSet<BaseType, Cardinality.One | Cardinality.AtMostOne>>;
declare type SimpleGroupElements = {
    [k: string]: SingletonSet;
};
declare type GroupModifiers = {
    by: SimpleGroupElements;
};
declare type NestedGroupElements = {
    [k: string]: SingletonSet | GroupingSet;
};
export declare type GroupingSet = {
    __kind__: "groupingset";
    __settype__: "set" | "tuple" | "rollup" | "cube";
    __elements__: NestedGroupElements;
    __exprs__: [string, SingletonSet][];
};
export declare function isGroupingSet(arg: any): arg is GroupingSet;
declare const setFuncs: {
    set: <T extends SimpleGroupElements>(grps: T) => { [k in keyof T]?: T[k] | undefined; };
    tuple: <T extends SimpleGroupElements>(grps: T) => { [k in keyof T]?: T[k] | undefined; };
    rollup: <T extends SimpleGroupElements>(grps: T) => { [k in keyof T]?: T[k] | undefined; };
    cube: <T extends SimpleGroupElements>(grps: T) => { [k in keyof T]?: T[k] | undefined; };
};
export declare type $expr_Group<Expr extends ObjectTypeSet = ObjectTypeSet, Mods extends GroupModifiers = GroupModifiers, Shape extends object = {
    id: true;
}> = Expression<{
    __element__: ObjectType<"std::FreeObject", $FreeObjectλShape & {
        grouping: PropertyDesc<$str, Cardinality.Many, false, true, true, false>;
        key: LinkDesc<ObjectType<"std::FreeObject", {
            [k in keyof Mods["by"]]: Mods["by"][k]["__element__"] extends ObjectType ? never : PropertyDesc<Mods["by"][k]["__element__"], Cardinality.AtMostOne>;
        }>, Cardinality.One, {}, false, true, true, false>;
        elements: LinkDesc<Expr["__element__"], Cardinality.Many, {}, false, true, true, false>;
    }, {
        grouping: TypeSet<$str, Cardinality.Many>;
        key: Expression<{
            __element__: ObjectType<"std::FreeObject", $FreeObjectλShape, {
                [k in keyof Mods["by"]]: Expression<{
                    __element__: Mods["by"][k]["__element__"];
                    __cardinality__: Cardinality.AtMostOne;
                }>;
            }>;
            __cardinality__: Cardinality.One;
        }>;
        elements: Expression<{
            __element__: ObjectType<Expr["__element__"]["__name__"], Expr["__element__"]["__pointers__"], normaliseShape<Shape, "by">>;
            __cardinality__: Cardinality.Many;
        }>;
    }>;
    __cardinality__: Cardinality.Many;
    __modifiers__: Mods;
    __kind__: ExpressionKind.Group;
    __expr__: ObjectTypeSet;
    __scope__: ObjectTypeSet;
}>;
declare type noUndefined<T> = T extends undefined ? never : T;
declare type groupFunc = <Expr extends ObjectTypeSet, Shape extends {
    by?: SimpleGroupElements;
} & objectTypeToSelectShape<Expr["__element__"]>>(expr: Expr, getter: (arg: $scopify<Expr["__element__"]>) => Readonly<Shape>) => $expr_Group<Expr, {
    by: noUndefined<Shape["by"]>;
}, normaliseShape<Shape, "by">>;
declare const groupFunc: groupFunc;
export declare const group: typeof setFuncs & groupFunc;
export {};
