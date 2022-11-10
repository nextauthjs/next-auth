import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  Duration,
  RelativeDuration,
  ConfigMemory,
  DateDuration
} from "edgedb";
import type {$bool, $number} from "./modules/std";

import {
  Cardinality,
  ExpressionKind,
  TypeKind,
  OperatorKind
} from "edgedb/dist/reflection/index";
import {makeType} from "./hydrate";

import {cardutil} from "./cardinality";
import type {
  $expr_PolyShapeElement,
  $scopify,
  Expression,
  LinkDesc,
  ObjectType,
  ObjectTypeExpression,
  ObjectTypePointers,
  ObjectTypeSet,
  PrimitiveTypeSet,
  PropertyDesc,
  ScalarType,
  stripSet,
  TypeSet,
  BaseType,
  ExclusiveTuple,
  orLiteralValue
} from "./typesystem";

import type {
  $expr_PathLeaf,
  $expr_PathNode,
  $linkPropify,
  ExpressionRoot
} from "./path";
import type {anonymizeObject} from "./casting";
import {$expressionify, $getScopedExpr} from "./path";
import {$getTypeByName, literal} from "./literal";
import {spec} from "./__spec__";
import {
  scalarLiterals,
  literalToScalarType,
  literalToTypeSet
} from "./castMaps";
import type {$expr_Operator} from "./funcops";

export const ASC: "ASC" = "ASC";
export const DESC: "DESC" = "DESC";
export const EMPTY_FIRST: "EMPTY FIRST" = "EMPTY FIRST";
export const EMPTY_LAST: "EMPTY LAST" = "EMPTY LAST";
export type OrderByDirection = "ASC" | "DESC";
export type OrderByEmpty = "EMPTY FIRST" | "EMPTY LAST";

export type OrderByExpr = TypeSet<ScalarType | ObjectType, Cardinality>;
export type OrderByObjExpr = {
  expression: OrderByExpr;
  direction?: OrderByDirection;
  empty?: OrderByEmpty;
};

export type OrderByExpression =
  | OrderByExpr
  | OrderByObjExpr
  | [OrderByExpr | OrderByObjExpr, ...(OrderByExpr | OrderByObjExpr)[]];

export type OffsetExpression = TypeSet<
  $number,
  Cardinality.Empty | Cardinality.One | Cardinality.AtMostOne
>;

export type SelectFilterExpression = TypeSet<$bool, Cardinality>;
export type LimitOffsetExpression = TypeSet<
  $number,
  Cardinality.Empty | Cardinality.One | Cardinality.AtMostOne
>;
export type LimitExpression = TypeSet<
  $number,
  Cardinality.Empty | Cardinality.One | Cardinality.AtMostOne
>;

export type SelectModifierNames =
  | "filter"
  | "filter_single"
  | "order_by"
  | "offset"
  | "limit";

export type exclusivesToFilterSingle<E extends ExclusiveTuple> =
  ExclusiveTuple extends E
    ? never
    : E extends []
    ? never
    : {
        [j in keyof E]: {
          [k in keyof E[j]]: orLiteralValue<E[j][k]>;
          // asdf: T["__exclusives__"][0].asdf
        };
      }[number];
export type SelectModifiers<T extends ObjectType = ObjectType> = {
  // export type SelectModifiers = {
  filter?: SelectFilterExpression;
  filter_single?: // | Partial<
  //     typeutil.stripNever<{
  //       [k in keyof T["__pointers__"]]: T["__pointers__"][k]
  // extends PropertyDesc
  //         ? orScalarLiteral<{
  //             __element__: T["__pointers__"][k]["target"];
  //             __cardinality__: T["__pointers__"][k]["cardinality"];
  //           }>
  //         : never;
  //     }>
  //   >

  // | (ObjectType extends T
  //       ? unknown
  //       : typeutil.stripNever<{
  //           [k in keyof T["__pointers__"]]: T["__pointers__"][k]
  // extends PropertyDesc<
  //             infer T,
  //             infer C,
  //             infer E
  //           >
  //             ? E extends true
  //               ? orScalarLiteral<{
  //                   __element__: T;
  //                   __cardinality__: C;
  //                 }>
  //               : never
  //             : never;
  //         }>)
  exclusivesToFilterSingle<T["__exclusives__"]> | SelectFilterExpression;

  // | (ObjectType extends T
  //     ? unknown
  //     : typeutil.stripNever<{
  //         [k in keyof T["__pointers__"]]: T["__pointers__"][k]
  // extends PropertyDesc<
  //           infer T,
  //           infer C,
  //           infer E
  //         >
  //           ? E extends true
  //             ? orScalarLiteral<{
  //                 __element__: T;
  //                 __cardinality__: C;
  //               }>
  //             : never
  //           : never;
  //       }>);
  order_by?: OrderByExpression;
  offset?: OffsetExpression | number;
  limit?: LimitExpression | number;
};

export type UnknownSelectModifiers = {[k in keyof SelectModifiers]: unknown};

export type NormalisedSelectModifiers = {
  filter?: SelectFilterExpression;
  order_by?: OrderByObjExpr[];
  offset?: OffsetExpression;
  limit?: LimitExpression;
  singleton: boolean;
};

// type NormaliseOrderByModifier<Mods extends OrderByExpression> =
//   Mods extends OrderByExpr
//     ? [{expression: Mods}]
//     : Mods extends OrderByObjExpr
//     ? [Mods]
//     : Mods extends (OrderByExpr | OrderByObjExpr)[]
//     ? {
//         [K in keyof Mods]: Mods[K] extends OrderByExpr
//           ? {expression: Mods[K]}
//           : Mods[K];
//       }
//     : [];

// type NormaliseSelectModifiers<Mods extends SelectModifiers> = {
//   filter: Mods["filter"];
//   order_by: Mods["order_by"] extends OrderByExpression
//     ? NormaliseOrderByModifier<Mods["order_by"]>
//     : [];
//   offset: Mods["offset"] extends number
//     ? $expr_Literal<ScalarType<"std::int64", number, Mods["offset"]>>
//     : Mods["offset"];
//   limit: Mods["offset"] extends number
//     ? $expr_Literal<ScalarType<"std::int64", number, Mods["offset"]>>
//     : Mods["offset"];
// };

export type $expr_Select<Set extends TypeSet = TypeSet> = Expression<{
  __element__: Set["__element__"];
  __cardinality__: Set["__cardinality__"];
  __expr__: TypeSet;
  __kind__: ExpressionKind.Select;
  __modifiers__: NormalisedSelectModifiers;
  __scope__?: ObjectTypeExpression;
}>;
// Modifier methods removed for now, until we can fix typescript inference
// problems / excessively deep errors
// & SelectModifierMethods<stripSet<Set>>;

export interface SelectModifierMethods<Root extends TypeSet> {
  filter<Filter extends SelectFilterExpression>(
    filter:
      | Filter
      | ((
          scope: Root extends ObjectTypeSet
            ? $scopify<Root["__element__"]>
            : stripSet<Root>
        ) => Filter)
  ): this;
  order_by(
    order_by:
      | OrderByExpression
      | ((
          scope: Root extends ObjectTypeSet
            ? $scopify<Root["__element__"]>
            : stripSet<Root>
        ) => OrderByExpression)
  ): this;
  offset(
    offset:
      | OffsetExpression
      | number
      | ((
          scope: Root extends ObjectTypeSet
            ? $scopify<Root["__element__"]>
            : stripSet<Root>
        ) => OffsetExpression | number)
  ): this;
  // $expr_Select<{
  //   __element__: Root["__element__"];
  //   __cardinality__: cardutil.overrideLowerBound<
  //     Root["__cardinality__"],
  //     "Zero"
  //   >;
  // }>;
  limit(
    limit:
      | LimitExpression
      | number
      | ((
          scope: Root extends ObjectTypeSet
            ? $scopify<Root["__element__"]>
            : stripSet<Root>
        ) => LimitExpression | number)
  ): this;
  // $expr_Select<{
  //   __element__: Root["__element__"];
  //   __cardinality__: cardutil.overrideLowerBound<
  //     Root["__cardinality__"],
  //     "Zero"
  //   >;
  // }>;
}
// Base is ObjectTypeSet &
// Filter is equality &
// Filter.args[0] is PathLeaf
//   Filter.args[0] is __exclusive__ &
//   Filter.args[0].parent.__element__ === Base.__element__
//   Filter.args[1].__cardinality__ is AtMostOne or One
// if Filter.args[0] is PathNode:
//   Filter.args[0] is __exclusive__ &
//   if Filter.args[0].parent === null
//     Filter.args[0].parent.__element__ === Base.__element__
//     Filter.args[1].__cardinality__ is AtMostOne or One
//   else
//     Filter.args[0].type.__element__ === Base.__element__ &
//     Filter.args[1].__cardinality__ is AtMostOne or One

// type argCardToResultCard<
//   OpCard extends Cardinality,
//   BaseCase extends Cardinality
// > = [OpCard] extends [Cardinality.AtMostOne | Cardinality.One]
//   ? Cardinality.AtMostOne
//   : [OpCard] extends [Cardinality.Empty]
//   ? Cardinality.Empty
//   : BaseCase;

// export type InferFilterCardinality<
//   Base extends TypeSet,
//   Filter
// > = Filter extends TypeSet
//   ? // Base is ObjectTypeExpression &
//     Base extends ObjectTypeSet // $expr_PathNode
//     ? // Filter is equality
//       Filter extends $expr_Operator<"=", any, infer Args, any>
//       ? // Filter.args[0] is PathLeaf
//         Args[0] extends $expr_PathLeaf
//         ? // Filter.args[0] is unique
//           Args[0]["__exclusive__"] extends true
//           ? //   Filter.args[0].parent.__element__ === Base.__element__
//             typeutil.assertEqual<InferFilterCardinality
//               Args[0]["__parent__"]["type"]["__element__"]["__name__"],
//               Base["__element__"]["__name__"]
//             > extends true
//             ? // Filter.args[1].__cardinality__ is AtMostOne or One
//               argCardToResultCard<
//                 Args[1]["__cardinality__"],
//                 Base["__cardinality__"]
//               >
//             : Base["__cardinality__"]
//           : Base["__cardinality__"]
//         : Args[0] extends $expr_PathNode<any, any, any>
//         ? Args[0]["__exclusive__"] extends true
//           ? //   Filter.args[0].parent.__element__ === Base.__element__
//             Args[0]["__parent__"] extends null
//             ? typeutil.assertEqual<
//                 Args[0]["__element__"]["__name__"],
//                 Base["__element__"]["__name__"]
//               > extends true
//               ? // Filter.args[1].__cardinality__ is AtMostOne or One
//                 argCardToResultCard<
//                   Args[1]["__cardinality__"],
//                   Base["__cardinality__"]
//                 >
//               : Base["__cardinality__"]
//             : Args[0]["__parent__"] extends infer Parent
//             ? Parent extends PathParent
//               ? typeutil.assertEqual<
//                   Parent["type"]["__element__"]["__name__"],
//                   Base["__element__"]["__name__"]
//                 > extends true
//                 ? // Filter.args[1].__cardinality__ is AtMostOne or One
//                   argCardToResultCard<
//                     Args[1]["__cardinality__"],
//                     Base["__cardinality__"]
//                   >
//                 : Base["__cardinality__"]
//               : Base["__cardinality__"]
//             : Base["__cardinality__"]
//           : Base["__cardinality__"]
//         : Base["__cardinality__"]
//       : Base["__cardinality__"]
//     : Base["__cardinality__"]
//   : Base["__cardinality__"];

export type InferOffsetLimitCardinality<
  Card extends Cardinality,
  Modifers extends UnknownSelectModifiers
> = Modifers["limit"] extends number | LimitExpression
  ? cardutil.overrideLowerBound<Card, "Zero">
  : Modifers["offset"] extends number | OffsetExpression
  ? cardutil.overrideLowerBound<Card, "Zero">
  : Card;

// export type ComputeSelectCardinality<
//   Expr extends ObjectTypeExpression,
//   Modifiers extends UnknownSelectModifiers
// > = InferOffsetLimitCardinality<
//   InferFilterCardinality<Expr, Modifiers["filter"]>,
//   Modifiers
// >;
export type ComputeSelectCardinality<
  Expr extends ObjectTypeExpression,
  Modifiers extends UnknownSelectModifiers
> = InferOffsetLimitCardinality<
  undefined extends Modifiers["filter_single"]
    ? Expr["__cardinality__"]
    : cardutil.overrideUpperBound<Expr["__cardinality__"], "One">,
  Modifiers
>;

export function is<
  Expr extends ObjectTypeExpression,
  Shape extends objectTypeToSelectShape<Expr["__element__"]>
>(
  expr: Expr,
  shape: Shape
): {
  [k in Exclude<keyof Shape, SelectModifierNames>]: $expr_PolyShapeElement<
    Expr,
    normaliseElement<Shape[k]>
  >;
} {
  const mappedShape: any = {};
  for (const [key, value] of Object.entries(shape)) {
    mappedShape[key] = {
      __kind__: ExpressionKind.PolyShapeElement,
      __polyType__: expr,
      __shapeElement__: value
    };
  }
  return mappedShape;
}

// function computeFilterCardinality(
//   expr: SelectFilterExpression,
//   cardinality: Cardinality,
//   base: TypeSet
// ) {
//   let card = cardinality;

//   const filter: any = expr;
//   // Base is ObjectExpression
//   const baseIsObjectExpr = base?.__element__?.__kind__ === TypeKind.object;
//   const filterExprIsEq =
//     filter.__kind__ === ExpressionKind.Operator && filter.__name__ === "=";
//   const arg0: $expr_PathLeaf | $expr_PathNode = filter?.__args__?.[0];
//   const arg1: TypeSet = filter?.__args__?.[1];
//   const argsExist = !!arg0 && !!arg1 && !!arg1.__cardinality__;
//   const arg0IsUnique = arg0?.__exclusive__ === true;

//   if (baseIsObjectExpr && filterExprIsEq && argsExist && arg0IsUnique) {
//     const newCard =
//       arg1.__cardinality__ === Cardinality.One ||
//       arg1.__cardinality__ === Cardinality.AtMostOne
//         ? Cardinality.AtMostOne
//         : arg1.__cardinality__ === Cardinality.Empty
//         ? Cardinality.Empty
//         : cardinality;

//     if (arg0.__kind__ === ExpressionKind.PathLeaf) {
//       const arg0ParentMatchesBase =
//         arg0.__parent__.type.__element__.__name__ ===
//         base.__element__.__name__;
//       if (arg0ParentMatchesBase) {
//         card = newCard;
//       }
//     } else if (arg0.__kind__ === ExpressionKind.PathNode) {
//       // if Filter.args[0] is PathNode:
//       //   Filter.args[0] is __exclusive__ &
//       //   if Filter.args[0].parent === null
//       //     Filter.args[0].__element__ === Base.__element__
//       //     Filter.args[1].__cardinality__ is AtMostOne or One
//       //   else
//       //     Filter.args[0].type.__element__ === Base.__element__ &
//       //     Filter.args[1].__cardinality__ is AtMostOne or One
//       const parent = arg0.__parent__;
//       if (parent === null) {
//         const arg0MatchesBase =
//           arg0.__element__.__name__ === base.__element__.__name__;
//         if (arg0MatchesBase) {
//           card = newCard;
//         }
//       } else {
//         const arg0ParentMatchesBase =
//           parent?.type.__element__.__name__ === base.__element__.__name__;
//         if (arg0ParentMatchesBase) {
//           card = newCard;
//         }
//       }
//     }
//   }

//   return card;
// }

export function $handleModifiers(
  modifiers: SelectModifiers,
  params: {root: TypeSet; scope: TypeSet}
): {modifiers: NormalisedSelectModifiers; cardinality: Cardinality} {
  const {root, scope} = params;
  const mods: NormalisedSelectModifiers = {
    singleton: !!modifiers["filter_single"]
  };

  let card = root.__cardinality__;

  if (modifiers.filter) {
    mods.filter = modifiers.filter;
    // card = computeFilterCardinality(mods.filter, card, rootExpr);
  }

  if (modifiers.filter_single) {
    if (root.__element__.__kind__ !== TypeKind.object) {
      throw new Error("filter_single can only be used with object types");
    }
    card = Cardinality.AtMostOne;
    // mods.filter = modifiers.filter_single;
    const fs: any = modifiers.filter_single;
    if (fs.__element__) {
      mods.filter = modifiers.filter_single as any;
    } else {
      const exprs = Object.keys(fs).map(key => {
        const val = fs[key].__element__
          ? fs[key]
          : (literal as any)(
              (root.__element__ as any as ObjectType)["__pointers__"][key][
                "target"
              ],
              fs[key]
            );
        return $expressionify({
          __element__: {
            __name__: "std::bool",
            __kind__: TypeKind.scalar
          } as any,
          __cardinality__: Cardinality.One,
          __kind__: ExpressionKind.Operator,
          __opkind__: OperatorKind.Infix,
          __name__: "=",
          __args__: [(scope as any)[key], val]
        }) as $expr_Operator;
      });
      if (exprs.length === 1) {
        mods.filter = exprs[0] as any;
      } else {
        mods.filter = exprs.reduce((a, b) => {
          return $expressionify({
            __element__: {
              __name__: "std::bool",
              __kind__: TypeKind.scalar
            } as any,
            __cardinality__: Cardinality.One,
            __kind__: ExpressionKind.Operator,
            __opkind__: OperatorKind.Infix,
            __name__: "and",
            __args__: [a, b]
          }) as $expr_Operator;
        }) as any;
      }
    }
  }
  if (modifiers.order_by) {
    const orderExprs = Array.isArray(modifiers.order_by)
      ? modifiers.order_by
      : [modifiers.order_by];
    mods.order_by = orderExprs.map(expr =>
      typeof (expr as any).__element__ === "undefined"
        ? expr
        : {expression: expr}
    ) as any;
  }
  if (modifiers.offset) {
    mods.offset =
      typeof modifiers.offset === "number"
        ? ($getTypeByName("std::number")(modifiers.offset) as any)
        : modifiers.offset;
    card = cardutil.overrideLowerBound(card, "Zero");
  }
  if (modifiers.limit) {
    let expr: LimitExpression;
    if (typeof modifiers.limit === "number") {
      expr = $getTypeByName("std::number")(modifiers.limit) as any;
    } else if ((modifiers.limit as any).__kind__ === ExpressionKind.Set) {
      expr = (modifiers.limit as any).__exprs__[0];
    } else {
      throw new Error("Invalid value for `limit` modifier");
    }
    mods.limit = expr;
    card = cardutil.overrideLowerBound(card, "Zero");
  }

  return {modifiers: mods as NormalisedSelectModifiers, cardinality: card};
}

export type $expr_Delete<Root extends ObjectTypeSet = ObjectTypeSet> =
  Expression<{
    __kind__: ExpressionKind.Delete;
    __element__: Root["__element__"];
    __cardinality__: Root["__cardinality__"];
    __expr__: ObjectTypeSet;
  }>;

function deleteExpr<
  Expr extends ObjectTypeExpression,
  Modifiers extends SelectModifiers<Expr["__element__"]>
>(
  expr: Expr,
  modifiers?: (scope: $scopify<Expr["__element__"]>) => Readonly<Modifiers>
): $expr_Delete<{
  __element__: ObjectType<
    Expr["__element__"]["__name__"],
    Expr["__element__"]["__pointers__"],
    {id: true}
  >;
  __cardinality__: ComputeSelectCardinality<Expr, Modifiers>;
}>;
function deleteExpr(expr: any, modifiersGetter: any) {
  const selectExpr = select(expr, modifiersGetter);

  return $expressionify({
    __kind__: ExpressionKind.Delete,
    __element__: selectExpr.__element__,
    __cardinality__: selectExpr.__cardinality__,
    __expr__: selectExpr
  }) as any;
}

export {deleteExpr as delete};

// Modifier methods removed for now, until we can fix typescript inference
// problems / excessively deep errors

// function resolveModifierGetter(parent: any, modGetter: any) {
//   if (typeof modGetter === "function" && !modGetter.__kind__) {
//     if (parent.__expr__.__element__.__kind__ === TypeKind.object) {
//       const shape = parent.__element__.__shape__;
//       const _scope =
//         parent.__scope__ ?? $getScopedExpr(parent.__expr__,
//           $existingScopes);
//       const scope = new Proxy(_scope, {
//         get(target: any, prop: string) {
//           if (shape[prop] && shape[prop] !== true) {
//             return shape[prop];
//           }
//           return target[prop];
//         },
//       });
//       return {
//         scope: _scope,
//         modExpr: modGetter(scope),
//       };
//     } else {
//       return {
//         scope: undefined,
//         modExpr: modGetter(parent.__expr__),
//       };
//     }
//   } else {
//     return {scope: parent.__scope__, modExpr: modGetter};
//   }
// }

// function updateModifier(
//   parent: any,
//   modName: "filter" | "order_by" | "offset" | "limit",
//   modGetter: any
// ) {
//   const modifiers = {
//     ...parent.__modifiers__,
//   };
//   const cardinality = parent.__cardinality__;

//   const {modExpr, scope} = resolveModifierGetter(parent, modGetter);

//   switch (modName) {
//     case "filter":
//       modifiers.filter = modifiers.filter
//         ? op(modifiers.filter, "and", modExpr)
//         : modExpr;

//       // methods no longer change cardinality
//       // cardinality = computeFilterCardinality(
//       //   modExpr,
//       //   cardinality,
//       //   parent.__expr__
//       // );
//       break;
//     case "order_by":
//       const ordering =
//         typeof (modExpr as any).__element__ === "undefined"
//           ? modExpr
//           : {expression: modExpr};
//       modifiers.order_by = modifiers.order_by
//         ? [...modifiers.order_by, ordering]
//         : [ordering];
//       break;
//     case "offset":
//       modifiers.offset =
//         typeof modExpr === "number" ? _std.number(modExpr) : modExpr;
//       // methods no longer change cardinality
//       // cardinality = cardutil
//            .overrideLowerBound(cardinality, "Zero");
//       break;
//     case "limit":
//       modifiers.limit =
//         typeof modExpr === "number"
//           ? _std.number(modExpr)
//           : (modExpr as any).__kind__ === ExpressionKind.Set
//           ? (modExpr as any).__exprs__[0]
//           : modExpr;
//       // methods no longer change cardinality
//       // cardinality = cardutil
//            .overrideLowerBound(cardinality, "Zero");
//       break;
//   }

//   return $expressionify(
//     $selectify({
//       __kind__: ExpressionKind.Select,
//       __element__: parent.__element__,
//       __cardinality__: cardinality,
//       __expr__: parent.__expr__,
//       __modifiers__: modifiers,
//       __scope__: scope,
//     })
//   );
// }

export function $selectify<Expr extends ExpressionRoot>(expr: Expr) {
  // Object.assign(expr, {
  //   filter: (filter: any) => updateModifier(expr, "filter", filter),
  //   order_by: (order_by: any) => updateModifier(expr, "order_by", order_by),
  //   offset: (offset: any) => updateModifier(expr, "offset", offset),
  //   limit: (limit: any) => updateModifier(expr, "limit", limit),
  // });
  return expr;
}

export type linkDescToLinkProps<Desc extends LinkDesc> = {
  [k in keyof Desc["properties"] & string]: $expr_PathLeaf<
    TypeSet<
      Desc["properties"][k]["target"],
      Desc["properties"][k]["cardinality"]
    >
    // {
    //   type: $scopify<Desc["target"]>;
    //   linkName: k;
    // },
    // Desc["properties"][k]["exclusive"]
  >;
};

export type pointersToObjectType<P extends ObjectTypePointers> = ObjectType<
  string,
  P,
  {}
>;

type linkDescToShape<L extends LinkDesc> = objectTypeToSelectShape<
  L["target"]
> &
  objectTypeToSelectShape<pointersToObjectType<L["properties"]>> &
  SelectModifiers;
export type linkDescToSelectElement<L extends LinkDesc> =
  | boolean
  // | pointerToCastableExpression<Shape[k]>
  | TypeSet<
      anonymizeObject<L["target"]>,
      cardutil.assignable<L["cardinality"]>
    >
  | linkDescToShape<L>
  | ((
      scope: $scopify<L["target"]> & linkDescToLinkProps<L>
    ) => linkDescToShape<L>);

// object types -> pointers
// pointers -> links
// links -> target object type
// links -> link properties
export type objectTypeToSelectShape<T extends ObjectType = ObjectType> =
  // ObjectType extends T
  //   ? {[k: string]: unknown}
  //   :
  Partial<{
    [k in keyof T["__pointers__"]]: T["__pointers__"][k] extends PropertyDesc
      ?
          | boolean
          | TypeSet<
              T["__pointers__"][k]["target"],
              cardutil.assignable<T["__pointers__"][k]["cardinality"]>
            >
      : T["__pointers__"][k] extends LinkDesc
      ? linkDescToSelectElement<T["__pointers__"][k]>
      : any;
  }> & {[k: string]: unknown};

// incorporate __shape__ (computeds) on selection shapes
// this works but a major rewrite of setToTsType is required
// to incorporate __shape__-based selection shapes into
// result type inference
// & [k in keyof T["__shape__"]]:
//    string | number | symbol extends k //   Partial<{ // &
//       ? unknown
//       : T["__shape__"][k] extends infer U
//       ? U extends ObjectTypeSet
//         ?
//             | boolean
//             | TypeSet<
//                 anonymizeObject<U["__element__"]>,
//                 cardutil.assignable<U["__cardinality__"]>
//               >
//             | objectTypeToSelectShape<U["__element__"]>
//             | ((
//                 scope: $scopify<U["__element__"]>
//               ) => objectTypeToSelectShape<U["__element__"]> &
//                 SelectModifiers)
//         : U extends TypeSet
//         ?
//             | boolean
//             | TypeSet<
//                 U["__element__"],
//                 cardutil.assignable<U["__cardinality__"]>
//               >
//         : unknown
//       : unknown;
//   }>

export type normaliseElement<El> = El extends boolean
  ? El
  : El extends TypeSet
  ? stripSet<El>
  : El extends (...scope: any[]) => any
  ? normaliseShape<ReturnType<El>>
  : El extends object
  ? normaliseShape<stripSet<El>>
  : stripSet<El>;

export type normaliseShape<
  Shape extends object,
  Strip = SelectModifierNames
> = {
  [k in Exclude<keyof Shape, Strip>]: normaliseElement<Shape[k]>;
};

const $FreeObject = makeType(
  spec,
  [...spec.values()].find(s => s.name === "std::FreeObject")!.id,
  literal
);
const FreeObject: $expr_PathNode = {
  __kind__: ExpressionKind.PathNode,
  __element__: $FreeObject as any,
  __cardinality__: Cardinality.One,
  __parent__: null,
  __exclusive__: true,
  __scopeRoot__: null
} as any;

export const $existingScopes = new Set<
  Expression<TypeSet<BaseType, Cardinality>>
>();

function $shape<
  Expr extends ObjectTypeExpression,
  Shape extends objectTypeToSelectShape<Expr["__element__"]> &
    SelectModifiers<Expr["__element__"]> // <Expr["__element__"]>
>(
  expr: Expr,
  _shape: (
    scope: $scopify<Expr["__element__"]> &
      $linkPropify<{
        [k in keyof Expr]: k extends "__cardinality__"
          ? Cardinality.One
          : Expr[k];
      }>
  ) => Readonly<Shape>
): (scope: unknown) => Readonly<Shape>;
function $shape(_a: unknown, b: (...args: any) => any) {
  return b;
}
export {$shape as shape};

export function select<Expr extends ObjectTypeExpression>(
  expr: Expr
): $expr_Select<{
  __element__: ObjectType<
    `${Expr["__element__"]["__name__"]}`, // _shape
    Expr["__element__"]["__pointers__"],
    Expr["__element__"]["__shape__"] // {id: true}
  >;
  __cardinality__: Expr["__cardinality__"];
}>;
export function select<Expr extends TypeSet>(
  expr: Expr
): $expr_Select<stripSet<Expr>>;
export function select<
  Expr extends ObjectTypeExpression,
  Shape extends objectTypeToSelectShape<Expr["__element__"]> &
    SelectModifiers<Expr["__element__"]>,
  Modifiers extends UnknownSelectModifiers = Pick<Shape, SelectModifierNames>
>(
  expr: Expr,
  shape: (
    scope: $scopify<Expr["__element__"]> &
      $linkPropify<{
        [k in keyof Expr]: k extends "__cardinality__"
          ? Cardinality.One
          : Expr[k];
      }>
  ) => Readonly<Shape>
): $expr_Select<{
  __element__: ObjectType<
    `${Expr["__element__"]["__name__"]}`, // _shape
    Expr["__element__"]["__pointers__"],
    Omit<normaliseShape<Shape>, SelectModifierNames>
  >;
  __cardinality__: ComputeSelectCardinality<Expr, Modifiers>;
}>;
/*

For the moment is isn't possible to implement both closure-based and plain
object overloads without breaking autocomplete on one or the other.
This is due to a limitation in TS:

https://github.com/microsoft/TypeScript/issues/26892
https://github.com/microsoft/TypeScript/issues/47081

*/

export function select<
  Expr extends PrimitiveTypeSet,
  Modifiers extends SelectModifiers
>(
  expr: Expr,
  modifiers: (expr: Expr) => Readonly<Modifiers>
): $expr_Select<{
  __element__: Expr["__element__"];
  __cardinality__: InferOffsetLimitCardinality<
    Expr["__cardinality__"],
    Modifiers
  >;
}>;
export function select<Shape extends {[key: string]: TypeSet}>(
  shape: Shape
): $expr_Select<{
  __element__: ObjectType<
    `std::FreeObject`,
    {
      [k in keyof Shape]: Shape[k]["__element__"] extends ObjectType
        ? LinkDesc<
            Shape[k]["__element__"],
            Shape[k]["__cardinality__"],
            {},
            false,
            true,
            true,
            false
          >
        : PropertyDesc<
            Shape[k]["__element__"],
            Shape[k]["__cardinality__"],
            false,
            true,
            true,
            false
          >;
    },
    Shape
  >; // _shape
  __cardinality__: Cardinality.One;
}>;
export function select<Expr extends scalarLiterals>(
  expr: Expr
): $expr_Select<{
  __element__: literalToScalarType<Expr>;
  __cardinality__: Cardinality.One;
}>;
export function select(...args: any[]) {
  const firstArg = args[0];

  if (
    typeof firstArg !== "object" ||
    firstArg instanceof Uint8Array ||
    firstArg instanceof Date ||
    firstArg instanceof Duration ||
    firstArg instanceof LocalDateTime ||
    firstArg instanceof LocalDate ||
    firstArg instanceof LocalTime ||
    firstArg instanceof RelativeDuration ||
    firstArg instanceof DateDuration ||
    firstArg instanceof ConfigMemory
  ) {
    const literalExpr = literalToTypeSet(firstArg);
    return $expressionify(
      $selectify({
        __kind__: ExpressionKind.Select,
        __element__: literalExpr.__element__,
        __cardinality__: literalExpr.__cardinality__,
        __expr__: literalExpr,
        __modifiers__: {}
      })
    ) as any;
  }

  const exprPair: [TypeSet, (scope: any) => any] =
    typeof args[0].__element__ !== "undefined"
      ? (args as any)
      : [FreeObject, () => args[0]];

  let expr = exprPair[0];
  const shapeGetter = exprPair[1];
  if (expr === FreeObject) {
    const freeObjectPtrs: ObjectTypePointers = {};
    for (const [k, v] of Object.entries(args[0]) as [string, TypeSet][]) {
      freeObjectPtrs[k] = {
        __kind__:
          v.__element__.__kind__ === TypeKind.object ? "link" : "property",
        target: v.__element__,

        cardinality: v.__cardinality__,
        exclusive: false,
        computed: true,
        readonly: true,
        hasDefault: false,
        properties: {}
      };
    }
    expr = {
      ...FreeObject,
      __element__: {
        ...FreeObject.__element__,
        __pointers__: {
          ...FreeObject.__element__.__pointers__,
          ...freeObjectPtrs
        }
      } as any
    };
  }
  if (!shapeGetter) {
    if (expr.__element__.__kind__ === TypeKind.object) {
      const objectExpr: ObjectTypeSet = expr as any;
      return $expressionify(
        $selectify({
          __kind__: ExpressionKind.Select,
          __element__: {
            __kind__: TypeKind.object,
            __name__: `${objectExpr.__element__.__name__}`, // _shape
            __pointers__: objectExpr.__element__.__pointers__,
            __shape__: objectExpr.__element__.__shape__
          } as any,
          __cardinality__: objectExpr.__cardinality__,
          __expr__: objectExpr,
          __modifiers__: {}
        })
      ) as any;
    } else {
      return $expressionify(
        $selectify({
          __kind__: ExpressionKind.Select,
          __element__: expr.__element__,
          __cardinality__: expr.__cardinality__,
          __expr__: expr,
          __modifiers__: {}
        })
      ) as any;
    }
  }

  const cleanScopedExprs = $existingScopes.size === 0;

  const {modifiers: mods, shape, scope} = resolveShape(shapeGetter, expr);

  if (cleanScopedExprs) {
    $existingScopes.clear();
  }

  const {modifiers, cardinality} = $handleModifiers(mods, {root: expr, scope});
  return $expressionify(
    $selectify({
      __kind__: ExpressionKind.Select,
      __element__:
        expr.__element__.__kind__ === TypeKind.object
          ? {
              __kind__: TypeKind.object,
              __name__: `${expr.__element__.__name__}`, // _shape
              __pointers__: (expr.__element__ as ObjectType).__pointers__,
              __shape__: shape
            }
          : expr.__element__,
      __cardinality__: cardinality,
      __expr__: expr,
      __modifiers__: modifiers,
      __scope__:
        expr !== scope // && expr.__element__.__name__ !== "std::FreeObject"
          ? scope
          : undefined
    })
  ) as any;
}

function resolveShape(
  shapeGetter: ((scope: any) => any) | any,
  expr: TypeSet
): {modifiers: any; shape: any; scope: TypeSet} {
  const modifiers: any = {};
  const shape: any = {};

  // get scoped object if expression is objecttypeset
  const scope =
    expr.__element__.__kind__ === TypeKind.object
      ? $getScopedExpr(expr as any, $existingScopes)
      : expr;

  // execute getter with scope
  const selectShape =
    typeof shapeGetter === "function" ? shapeGetter(scope) : shapeGetter;

  for (const [key, value] of Object.entries(selectShape)) {
    // handle modifier keys
    if (
      key === "filter" ||
      key === "filter_single" ||
      key === "order_by" ||
      key === "offset" ||
      key === "limit"
    ) {
      modifiers[key] = value;
    } else {
      // for scalar expressions, scope === expr
      // shape keys are not allowed
      if (expr.__element__.__kind__ !== TypeKind.object) {
        throw new Error(
          `Invalid select shape key '${key}' on scalar expression, ` +
            `only modifiers are allowed (filter, order_by, offset and limit)`
        );
      }
      shape[key] = resolveShapeElement(key, value, scope);
    }
  }
  return {shape, modifiers, scope};
}

export function resolveShapeElement(
  key: any,
  value: any,
  scope: ObjectTypeExpression
): any {
  // if value is a nested closure
  // or a nested shape object
  const isSubshape =
    typeof value === "object" &&
    typeof (value as any).__kind__ === "undefined";
  const isClosure =
    typeof value === "function" &&
    scope.__element__.__pointers__[key]?.__kind__ === "link";
  // if (isSubshape) {
  //   // return value;
  //   const childExpr = (scope as any)[key];
  //   const {
  //     shape: childShape,
  //     // scope: childScope,
  //     // modifiers: mods,
  //   } = resolveShape(value as any, childExpr);
  //   return childShape;
  // }
  if (isSubshape || isClosure) {
    // get child node expression
    // this relies on Proxy-based getters
    const childExpr = (scope as any)[key];
    if (!childExpr) {
      throw new Error(
        `Invalid shape element "${key}" for type ${scope.__element__.__name__}`
      );
    }
    const {
      shape: childShape,
      scope: childScope,
      modifiers: mods
    } = resolveShape(value as any, childExpr);

    // extracts normalized modifiers
    const {modifiers} = $handleModifiers(mods, {
      root: childExpr,
      scope: childScope
    });

    return {
      __kind__: ExpressionKind.Select,
      __element__: {
        __kind__: TypeKind.object,
        __name__: `${childExpr.__element__.__name__}`,
        __pointers__: childExpr.__element__.__pointers__,
        __shape__: childShape
      },
      __cardinality__:
        scope.__element__.__pointers__?.[key]?.cardinality ||
        scope.__element__.__shape__?.[key]?.__cardinality__,
      __expr__: childExpr,
      __modifiers__: modifiers,
      __scope__: childExpr !== childScope ? childScope : undefined
    };
  } else if ((value as any)?.__kind__ === ExpressionKind.PolyShapeElement) {
    const polyElement = value as $expr_PolyShapeElement;

    const polyScope = (scope as any).is(polyElement.__polyType__);
    return {
      __kind__: ExpressionKind.PolyShapeElement,
      __polyType__: polyScope,
      __shapeElement__: resolveShapeElement(
        key,
        polyElement.__shapeElement__,
        polyScope
      )
    };
  } else if (typeof value === "boolean" && key.startsWith("@")) {
    const linkProp = (scope as any)[key];
    if (!linkProp) {
      throw new Error(
        (scope as any).__parent__
          ? `link property '${key}' does not exist on link ${
              (scope as any).__parent__.linkName
            }`
          : `cannot select link property '${key}' on an object (${scope.__element__.__name__})`
      );
    }
    return value ? linkProp : false;
  } else {
    return value;
  }
}
