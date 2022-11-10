import {
  // cardutil,
  // ObjectTypeSet,
  // TypeSet,
  // Expression,
  ExpressionKind,
  TypeKind,
  // LinkDesc,
  // PropertyDesc,
  Cardinality,
  // BaseType,
  typeutil
} from "edgedb/dist/reflection/index";

import {cardutil} from "./cardinality";

import {literalToTypeSet} from "./castMaps";
import {$arrayLikeIndexify, $tuplePathify} from "./collections";
import {$toEdgeQL} from "./toEdgeQL";
import {$queryFunc, $queryFuncJSON} from "./query";

import type {
  BaseType,
  Expression,
  LinkDesc,
  ObjectType,
  ObjectTypePointers,
  ObjectTypeSet,
  PropertyDesc,
  PropertyShape,
  TypeSet
} from "./typesystem";
// import {typeutil} from "./typeutil";
// import {cardutil} from "./cardinality";

// get the set representing the result of a path traversal
// including cardinality merging
type getChildOfObjectTypeSet<
  Root extends ObjectTypeSet,
  ChildKey extends keyof Root["__element__"]["__pointers__"]
> = TypeSet<
  Root["__element__"]["__pointers__"][ChildKey]["target"],
  cardutil.multiplyCardinalities<
    Root["__cardinality__"],
    Root["__element__"]["__pointers__"][ChildKey]["cardinality"]
  >
>;

// path parent must be object expression
export interface PathParent<
  Parent extends ObjectTypeSet = ObjectTypeSet,
  L extends string = string
> {
  type: Parent;
  linkName: L;
}

export type $linkPropify<Root extends ObjectTypeSet> = Root extends {
  __parent__: PathParent<infer Parent, infer L>;
}
  ? // tslint:disable-next-line
    Parent["__element__"]["__pointers__"][L] extends LinkDesc<
      any,
      any,
      infer LinkProps,
      any,
      any,
      any,
      any
    >
    ? pathifyLinkProps<LinkProps, Root, PathParent<Parent, L>>
    : {}
  : unknown;

export type $pathify<
  Root extends TypeSet
  // Parent extends PathParent | null = null
> = Root extends ObjectTypeSet
  ? ObjectTypeSet extends Root
    ? {} // Root is literally ObjectTypeSet
    : pathifyPointers<Root> & pathifyShape<Root> & $linkPropify<Root>
  : {}; // pathify does nothing on non-object types

export type pathifyPointers<
  Root extends ObjectTypeSet
  // Parent extends PathParent | null = null
> = ObjectTypePointers extends Root["__element__"]["__pointers__"]
  ? unknown
  : {
      // & string required to avoid typeError on linkName
      [k in keyof Root["__element__"]["__pointers__"] &
        string]: Root["__element__"]["__pointers__"][k] extends PropertyDesc
        ? $expr_PathLeaf<
            getChildOfObjectTypeSet<Root, k>,
            {type: anonymizeObjectTypeSet<Root>; linkName: k}
            // Root["__element__"]["__pointers__"][k]["exclusive"]
          >
        : Root["__element__"]["__pointers__"][k] extends LinkDesc
        ? getChildOfObjectTypeSet<Root, k> extends ObjectTypeSet
          ? $expr_PathNode<
              getChildOfObjectTypeSet<Root, k>,
              {type: anonymizeObjectTypeSet<Root>; linkName: k}
              // Root["__element__"]["__pointers__"][k]["exclusive"]
            >
          : unknown
        : unknown;
    };

type anonymizeObjectTypeSet<T extends ObjectTypeSet> = typeutil.flatten<{
  __element__: ObjectType<
    T["__element__"]["__name__"],
    T["__element__"]["__pointers__"],
    {id: true}
  >;
  __cardinality__: T["__cardinality__"];
}>;

export type pathifyShape<
  Root extends ObjectTypeSet,
  Shape extends {[k: string]: any} = Root["__element__"]["__shape__"]
> = string extends keyof Shape
  ? {}
  : {
      [k in keyof Shape & string]: Shape[k] extends ObjectTypeSet
        ? $expr_PathNode<
            TypeSet<
              Shape[k]["__element__"],
              cardutil.multiplyCardinalities<
                Root["__cardinality__"],
                Shape[k]["__cardinality__"]
              >
            >,
            {type: Root; linkName: k}
            // false
          >
        : Shape[k] extends TypeSet
        ? $expr_PathLeaf<
            TypeSet<
              Shape[k]["__element__"],
              cardutil.multiplyCardinalities<
                Root["__cardinality__"],
                Shape[k]["__cardinality__"]
              >
            >,
            {type: Root; linkName: k}
            // false
          >
        : // must be unknown (not never) to avoid overriding
          // a pointer with the same key
          unknown;
    };

type pathifyLinkProps<
  Props extends PropertyShape,
  Root extends ObjectTypeSet,
  Parent extends PathParent | null = null
> = {
  [k in keyof Props & string]: Props[k] extends PropertyDesc
    ? $expr_PathLeaf<
        TypeSet<
          Props[k]["target"],
          cardutil.multiplyCardinalities<
            Root["__cardinality__"],
            Props[k]["cardinality"]
          >
        >,
        {type: $expr_PathNode<Root, Parent>; linkName: k}
        // {type: $expr_PathNode<Root>; linkName: k},
        // Props[k]["exclusive"]
      >
    : unknown;
};

export type getPropsShape<T extends ObjectType> = typeutil.flatten<
  typeutil.stripNever<{
    [k in keyof T["__pointers__"]]: T["__pointers__"][k]["__kind__"] extends "property"
      ? true
      : never;
  }>
>;

export type $expr_PathNode<
  Root extends ObjectTypeSet = ObjectTypeSet,
  Parent extends PathParent | null = PathParent | null
  // Exclusive extends boolean = boolean
> = Expression<{
  __element__: Root["__element__"];
  __cardinality__: Root["__cardinality__"];
  __parent__: Parent;
  __kind__: ExpressionKind.PathNode;
  // __exclusive__: boolean;
  "*": getPropsShape<Root["__element__"]>;
}>;

export type $expr_TypeIntersection<
  Card extends Cardinality = Cardinality,
  Intersection extends ObjectType = ObjectType
> = Expression<{
  __element__: Intersection;
  __cardinality__: Card;
  __kind__: ExpressionKind.TypeIntersection;
  __expr__: TypeSet;
}>;

export type $expr_PathLeaf<
  Root extends TypeSet = TypeSet,
  Parent extends PathParent = PathParent
  // Exclusive extends boolean = boolean
> = Expression<{
  __element__: Root["__element__"];
  __cardinality__: Root["__cardinality__"];
  __kind__: ExpressionKind.PathLeaf;
  __parent__: Parent;
  // __exclusive__: boolean;
}>;

export type ExpressionRoot = {
  __element__: BaseType;
  __cardinality__: Cardinality;
  __kind__: ExpressionKind;
};

function PathLeaf<
  Root extends TypeSet,
  Parent extends PathParent,
  Exclusive extends boolean = boolean
>(
  root: Root,
  parent: Parent,
  exclusive: Exclusive,
  scopeRoot: TypeSet | null = null
): $expr_PathLeaf<Root, Parent> {
  return $expressionify({
    __kind__: ExpressionKind.PathLeaf,
    __element__: root.__element__,
    __cardinality__: root.__cardinality__,
    __parent__: parent,
    // __exclusive__: exclusive,
    __scopeRoot__: scopeRoot
  }) as any;
}

function PathNode<
  Root extends ObjectTypeSet,
  Parent extends PathParent | null
  // Exclusive extends boolean = boolean
>(
  root: Root,
  parent: Parent,
  // exclusive: boolean,
  scopeRoot: TypeSet | null = null
): $expr_PathNode<Root, Parent> {
  const obj = {
    __kind__: ExpressionKind.PathNode,
    __element__: root.__element__,
    __cardinality__: root.__cardinality__,
    __parent__: parent,
    // __exclusive__: exclusive,
    __scopeRoot__: scopeRoot
  };

  const shape: any = {};
  Object.entries(obj.__element__.__pointers__).map(([key, ptr]) => {
    if (ptr.__kind__ === "property") {
      shape[key] = true;
    }
  });
  Object.defineProperty(obj, "*", {
    writable: false,
    value: shape
  });
  return $expressionify(obj) as any;
}

const _pathCache = Symbol();
const _pointers = Symbol();

const pathifyProxyHandlers: ProxyHandler<any> = {
  get(target: any, prop: string | symbol, proxy: any) {
    const ptr = target[_pointers][prop as any] as LinkDesc | PropertyDesc;
    if (ptr) {
      return (
        target[_pathCache][prop] ??
        (target[_pathCache][prop] = (
          (ptr.__kind__ === "property" ? PathLeaf : PathNode) as any
        )(
          {
            __element__: ptr.target,
            __cardinality__: cardutil.multiplyCardinalities(
              target.__cardinality__,
              ptr.cardinality
            )
          },
          {
            linkName: prop,
            type: proxy
          },
          ptr.exclusive ?? false,
          target.__scopeRoot__ ?? (scopeRoots.has(proxy) ? proxy : null)
        ))
      );
    }
    return target[prop];
  }
};

export function $pathify<Root extends TypeSet, Parent extends PathParent>(
  _root: Root
): $pathify<Root> {
  if (_root.__element__.__kind__ !== TypeKind.object) {
    return _root as any;
  }

  const root: $expr_PathNode<ObjectTypeSet> = _root as any;

  let pointers = {
    ...root.__element__.__pointers__
  };

  if (root.__parent__) {
    const {type, linkName} = root.__parent__;
    const parentPointer = type.__element__.__pointers__[linkName];
    if (parentPointer?.__kind__ === "link") {
      pointers = {...pointers, ...parentPointer.properties};
    }
  }

  for (const [key, val] of Object.entries(
    root.__element__.__shape__ || {id: true}
  )) {
    if (pointers[key]) continue;
    const valType: BaseType = (val as any)?.__element__;
    if (!valType) continue;

    pointers[key] = {
      __kind__: valType.__kind__ === TypeKind.object ? "link" : "property",
      properties: {},
      target: (val as any).__element__,
      cardinality: (val as any).__cardinality__,
      exclusive: false,
      computed: true,
      readonly: true,
      hasDefault: false
    };
  }

  (root as any)[_pointers] = pointers;
  (root as any)[_pathCache] = {};

  return new Proxy(root, pathifyProxyHandlers);
}

function isFunc(this: any, expr: ObjectTypeSet) {
  return $expressionify({
    __kind__: ExpressionKind.TypeIntersection,
    __cardinality__: this.__cardinality__,
    __element__: {
      ...expr.__element__,
      __shape__: {id: true}
    } as any,
    __expr__: this
  });
}

function assert_single(expr: Expression) {
  return $expressionify({
    __kind__: ExpressionKind.Function,
    __element__: expr.__element__,
    __cardinality__: cardutil.overrideUpperBound(expr.__cardinality__, "One"),
    __name__: "std::assert_single",
    __args__: [expr],
    __namedargs__: {}
  }) as any;
}

const jsonDestructureProxyHandlers: ProxyHandler<ExpressionRoot> = {
  get(target: ExpressionRoot, prop: string | symbol, proxy: any) {
    if (typeof prop === "string" && !(prop in target)) {
      const parsedProp = Number.isInteger(Number(prop)) ? Number(prop) : prop;
      return jsonDestructure.call(proxy, parsedProp);
    }
    return (target as any)[prop];
  }
};

function jsonDestructure(this: ExpressionRoot, path: any) {
  const pathTypeSet = literalToTypeSet(path);
  return $expressionify({
    __kind__: ExpressionKind.Operator,
    __element__: this.__element__,
    __cardinality__: cardutil.multiplyCardinalities(
      this.__cardinality__,
      pathTypeSet.__cardinality__
    ),
    __name__: "[]",
    __opkind__: "Infix",
    __args__: [this, pathTypeSet]
  }) as any;
}

export function $jsonDestructure(_expr: ExpressionRoot) {
  if (
    _expr.__element__.__kind__ === TypeKind.scalar &&
    _expr.__element__.__name__ === "std::json"
  ) {
    const expr = new Proxy(_expr, jsonDestructureProxyHandlers) as any;

    expr.destructure = jsonDestructure.bind(expr);

    return expr;
  }

  return _expr;
}

export function $expressionify<T extends ExpressionRoot>(
  _expr: T
): Expression<T> {
  const expr: Expression = $pathify(
    $jsonDestructure($arrayLikeIndexify($tuplePathify(_expr)))
  ) as any;

  expr.run = $queryFunc.bind(expr) as any;
  expr.runJSON = $queryFuncJSON.bind(expr) as any;
  expr.is = isFunc.bind(expr) as any;
  expr.toEdgeQL = $toEdgeQL.bind(expr);
  expr.assert_single = () => assert_single(expr) as any;

  return Object.freeze(expr) as any;
}

const scopedExprCache = new WeakMap<ExpressionRoot, Expression>();
const scopeRoots = new WeakSet<Expression>();

export function $getScopedExpr<T extends ExpressionRoot>(
  expr: T,
  existingScopes?: Set<Expression>
): Expression<T> {
  let scopedExpr = scopedExprCache.get(expr);
  if (!scopedExpr || existingScopes?.has(scopedExpr)) {
    // free objects should not be scopified
    const isFreeObject =
      expr.__cardinality__ === Cardinality.One &&
      expr.__element__.__name__ === "std::FreeObject";

    const isInsert = expr.__kind__ === ExpressionKind.Insert;
    scopedExpr =
      isFreeObject || isInsert
        ? (expr as any as Expression<TypeSet<BaseType, Cardinality>>)
        : $expressionify({
            ...expr,
            __cardinality__: Cardinality.One,
            __scopedFrom__: expr,
            "*": (expr as any)["*"]
          });
    scopeRoots.add(scopedExpr);
    const uncached = !scopedExpr;
    if (uncached) {
      scopedExprCache.set(expr, scopedExpr);
    }
  }
  existingScopes?.add(scopedExpr);
  return scopedExpr as any;
}

export {PathLeaf as $PathLeaf, PathNode as $PathNode};
