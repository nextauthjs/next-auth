import { Cardinality, ExpressionKind, typeutil } from "edgedb/dist/reflection/index";
import type { Expression, LinkDesc, ObjectTypeSet, ObjectTypePointers, PropertyDesc, stripBacklinks, stripNonInsertables, $scopify, stripSet, TypeSet, ObjectType } from "./typesystem";
import type { pointerToAssignmentExpression } from "./casting";
import type { $expr_PathNode } from "./path";
import type { $Object } from "./modules/std";
import type { scalarLiterals } from "./castMaps";
export declare type pointerIsOptional<T extends PropertyDesc | LinkDesc> = T["cardinality"] extends Cardinality.Many | Cardinality.Empty | Cardinality.AtMostOne ? true : false;
export declare type InsertShape<El extends ObjectType> = typeutil.flatten<RawInsertShape<El>>;
export declare type RawInsertShape<El extends ObjectType> = ObjectType extends El ? never : typeutil.stripNever<stripNonInsertables<stripBacklinks<El["__pointers__"]>>> extends infer Shape ? Shape extends ObjectTypePointers ? typeutil.addQuestionMarks<{
    [k in keyof Shape]: pointerToAssignmentExpression<Shape[k]> | (pointerIsOptional<Shape[k]> extends true ? undefined | null : never) | (Shape[k]["hasDefault"] extends true ? undefined : never);
}> & {
    [k in `@${string}`]: TypeSet | scalarLiterals;
} : never : never;
interface UnlessConflict {
    on: TypeSet | null;
    else?: TypeSet;
}
declare type InsertBaseExpression<Root extends TypeSet = TypeSet> = {
    __kind__: ExpressionKind.Insert;
    __element__: Root["__element__"];
    __cardinality__: Cardinality.One;
    __expr__: stripSet<Root>;
    __shape__: any;
};
export declare type $expr_Insert<El extends ObjectType = ObjectType> = Expression<{
    __kind__: ExpressionKind.Insert;
    __element__: El;
    __cardinality__: Cardinality.One;
    __expr__: $expr_PathNode;
    __shape__: InsertShape<El>;
    unlessConflict(): $expr_InsertUnlessConflict<El, {
        on: null;
    }>;
    unlessConflict<Conflict extends UnlessConflict>(conflictGetter: (scope: $scopify<El>) => Conflict): $expr_InsertUnlessConflict<El, Conflict>;
}>;
export declare type $expr_InsertUnlessConflict<El extends ObjectType = ObjectType, Conflict extends UnlessConflict = UnlessConflict> = Expression<{
    __kind__: ExpressionKind.InsertUnlessConflict;
    __element__: Conflict["else"] extends TypeSet ? Conflict["else"]["__element__"]["__name__"] extends El["__name__"] ? El : $Object : El;
    __cardinality__: Conflict["else"] extends TypeSet ? Conflict["else"]["__cardinality__"] : Cardinality.AtMostOne;
    __expr__: InsertBaseExpression;
    __conflict__: Conflict;
}>;
export declare function $insertify(expr: Omit<$expr_Insert, "unlessConflict">): $expr_Insert;
export declare function $normaliseInsertShape(root: ObjectTypeSet, shape: {
    [key: string]: any;
}, isUpdate?: boolean): {
    [key: string]: TypeSet | {
        "+=": TypeSet;
    } | {
        "-=": TypeSet;
    };
};
export declare function insert<Root extends $expr_PathNode>(root: Root, shape: InsertShape<Root["__element__"]>): $expr_Insert<Root["__element__"]>;
export {};
