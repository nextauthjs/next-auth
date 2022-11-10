import { ExpressionKind, typeutil, Cardinality } from "edgedb/dist/reflection/index";
import type { Expression, ObjectTypePointers, TypeSet, ObjectTypeSet, stripBacklinks, stripNonUpdateables, ObjectTypeExpression, ObjectType, $scopify } from "./typesystem";
import type { pointerToAssignmentExpression } from "./casting";
import { SelectModifiers, NormalisedSelectModifiers, ComputeSelectCardinality } from "./select";
import { pointerIsOptional } from "./insert";
export declare type $expr_Update<El extends ObjectType = ObjectType, Card extends Cardinality = Cardinality> = Expression<{
    __kind__: ExpressionKind.Update;
    __element__: El;
    __cardinality__: Card;
    __expr__: TypeSet;
    __shape__: any;
    __modifiers__: NormalisedSelectModifiers;
    __scope__: ObjectTypeExpression;
}>;
export declare type UpdateShape<Root extends ObjectTypeSet> = typeutil.stripNever<stripNonUpdateables<stripBacklinks<Root["__element__"]["__pointers__"]>>> extends infer Shape ? Shape extends ObjectTypePointers ? {
    [k in keyof Shape]?: (pointerToAssignmentExpression<Shape[k]> | (Shape[k]["cardinality"] extends Cardinality.Many | Cardinality.AtLeastOne ? {
        "+=": pointerToAssignmentExpression<Shape[k], true>;
    } | {
        "-=": pointerToAssignmentExpression<Shape[k], true>;
    } : never)) | (pointerIsOptional<Shape[k]> extends true ? undefined | null : never);
} : never : never;
export declare function update<Expr extends ObjectTypeExpression, Shape extends {
    filter?: SelectModifiers["filter"];
    filter_single?: SelectModifiers<Expr["__element__"]>["filter_single"];
    order_by?: SelectModifiers["order_by"];
    limit?: SelectModifiers["limit"];
    offset?: SelectModifiers["offset"];
    set: UpdateShape<Expr>;
}>(expr: Expr, shape: (scope: $scopify<Expr["__element__"]>) => Readonly<Shape>): $expr_Update<Expr["__element__"], ComputeSelectCardinality<Expr, Shape>>;
