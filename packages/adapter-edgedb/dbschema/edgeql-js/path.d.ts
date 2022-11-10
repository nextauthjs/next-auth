import { ExpressionKind, Cardinality, typeutil } from "edgedb/dist/reflection/index";
import { cardutil } from "./cardinality";
import type { BaseType, Expression, LinkDesc, ObjectType, ObjectTypePointers, ObjectTypeSet, PropertyDesc, PropertyShape, TypeSet } from "./typesystem";
declare type getChildOfObjectTypeSet<Root extends ObjectTypeSet, ChildKey extends keyof Root["__element__"]["__pointers__"]> = TypeSet<Root["__element__"]["__pointers__"][ChildKey]["target"], cardutil.multiplyCardinalities<Root["__cardinality__"], Root["__element__"]["__pointers__"][ChildKey]["cardinality"]>>;
export interface PathParent<Parent extends ObjectTypeSet = ObjectTypeSet, L extends string = string> {
    type: Parent;
    linkName: L;
}
export declare type $linkPropify<Root extends ObjectTypeSet> = Root extends {
    __parent__: PathParent<infer Parent, infer L>;
} ? Parent["__element__"]["__pointers__"][L] extends LinkDesc<any, any, infer LinkProps, any, any, any, any> ? pathifyLinkProps<LinkProps, Root, PathParent<Parent, L>> : {} : unknown;
export declare type $pathify<Root extends TypeSet> = Root extends ObjectTypeSet ? ObjectTypeSet extends Root ? {} : pathifyPointers<Root> & pathifyShape<Root> & $linkPropify<Root> : {};
export declare type pathifyPointers<Root extends ObjectTypeSet> = ObjectTypePointers extends Root["__element__"]["__pointers__"] ? unknown : {
    [k in keyof Root["__element__"]["__pointers__"] & string]: Root["__element__"]["__pointers__"][k] extends PropertyDesc ? $expr_PathLeaf<getChildOfObjectTypeSet<Root, k>, {
        type: anonymizeObjectTypeSet<Root>;
        linkName: k;
    }> : Root["__element__"]["__pointers__"][k] extends LinkDesc ? getChildOfObjectTypeSet<Root, k> extends ObjectTypeSet ? $expr_PathNode<getChildOfObjectTypeSet<Root, k>, {
        type: anonymizeObjectTypeSet<Root>;
        linkName: k;
    }> : unknown : unknown;
};
declare type anonymizeObjectTypeSet<T extends ObjectTypeSet> = typeutil.flatten<{
    __element__: ObjectType<T["__element__"]["__name__"], T["__element__"]["__pointers__"], {
        id: true;
    }>;
    __cardinality__: T["__cardinality__"];
}>;
export declare type pathifyShape<Root extends ObjectTypeSet, Shape extends {
    [k: string]: any;
} = Root["__element__"]["__shape__"]> = string extends keyof Shape ? {} : {
    [k in keyof Shape & string]: Shape[k] extends ObjectTypeSet ? $expr_PathNode<TypeSet<Shape[k]["__element__"], cardutil.multiplyCardinalities<Root["__cardinality__"], Shape[k]["__cardinality__"]>>, {
        type: Root;
        linkName: k;
    }> : Shape[k] extends TypeSet ? $expr_PathLeaf<TypeSet<Shape[k]["__element__"], cardutil.multiplyCardinalities<Root["__cardinality__"], Shape[k]["__cardinality__"]>>, {
        type: Root;
        linkName: k;
    }> : unknown;
};
declare type pathifyLinkProps<Props extends PropertyShape, Root extends ObjectTypeSet, Parent extends PathParent | null = null> = {
    [k in keyof Props & string]: Props[k] extends PropertyDesc ? $expr_PathLeaf<TypeSet<Props[k]["target"], cardutil.multiplyCardinalities<Root["__cardinality__"], Props[k]["cardinality"]>>, {
        type: $expr_PathNode<Root, Parent>;
        linkName: k;
    }> : unknown;
};
export declare type getPropsShape<T extends ObjectType> = typeutil.flatten<typeutil.stripNever<{
    [k in keyof T["__pointers__"]]: T["__pointers__"][k]["__kind__"] extends "property" ? true : never;
}>>;
export declare type $expr_PathNode<Root extends ObjectTypeSet = ObjectTypeSet, Parent extends PathParent | null = PathParent | null> = Expression<{
    __element__: Root["__element__"];
    __cardinality__: Root["__cardinality__"];
    __parent__: Parent;
    __kind__: ExpressionKind.PathNode;
    "*": getPropsShape<Root["__element__"]>;
}>;
export declare type $expr_TypeIntersection<Card extends Cardinality = Cardinality, Intersection extends ObjectType = ObjectType> = Expression<{
    __element__: Intersection;
    __cardinality__: Card;
    __kind__: ExpressionKind.TypeIntersection;
    __expr__: TypeSet;
}>;
export declare type $expr_PathLeaf<Root extends TypeSet = TypeSet, Parent extends PathParent = PathParent> = Expression<{
    __element__: Root["__element__"];
    __cardinality__: Root["__cardinality__"];
    __kind__: ExpressionKind.PathLeaf;
    __parent__: Parent;
}>;
export declare type ExpressionRoot = {
    __element__: BaseType;
    __cardinality__: Cardinality;
    __kind__: ExpressionKind;
};
declare function PathLeaf<Root extends TypeSet, Parent extends PathParent, Exclusive extends boolean = boolean>(root: Root, parent: Parent, exclusive: Exclusive, scopeRoot?: TypeSet | null): $expr_PathLeaf<Root, Parent>;
declare function PathNode<Root extends ObjectTypeSet, Parent extends PathParent | null>(root: Root, parent: Parent, scopeRoot?: TypeSet | null): $expr_PathNode<Root, Parent>;
export declare function $pathify<Root extends TypeSet, Parent extends PathParent>(_root: Root): $pathify<Root>;
export declare function $jsonDestructure(_expr: ExpressionRoot): any;
export declare function $expressionify<T extends ExpressionRoot>(_expr: T): Expression<T>;
export declare function $getScopedExpr<T extends ExpressionRoot>(expr: T, existingScopes?: Set<Expression>): Expression<T>;
export { PathLeaf as $PathLeaf, PathNode as $PathNode };
