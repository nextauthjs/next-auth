import {
  Cardinality,
  ExpressionKind,
  typeutil,
  TypeKind
} from "edgedb/dist/reflection/index";
import type {
  Expression,
  LinkDesc,
  ObjectTypeSet,
  ObjectTypePointers,
  PropertyDesc,
  stripBacklinks,
  stripNonInsertables,
  $scopify,
  stripSet,
  TypeSet,
  ObjectType
} from "./typesystem";
import type {pointerToAssignmentExpression} from "./casting";
import {$expressionify, $getScopedExpr} from "./path";
import {cast} from "./cast";
import {set} from "./set";
import {literal} from "./literal";
import {$getTypeByName} from "./literal";
import type {$expr_PathNode} from "./path";
import type {$Object} from "./modules/std";
import type {scalarLiterals} from "./castMaps";

export type pointerIsOptional<T extends PropertyDesc | LinkDesc> =
  T["cardinality"] extends
    | Cardinality.Many
    | Cardinality.Empty
    | Cardinality.AtMostOne
    ? true
    : false;

export type InsertShape<El extends ObjectType> = typeutil.flatten<
  RawInsertShape<El>
>;

export type RawInsertShape<El extends ObjectType> =
  // short-circuit infinitely deep
  ObjectType extends El
    ? never
    : typeutil.stripNever<
        stripNonInsertables<stripBacklinks<El["__pointers__"]>>
      > extends infer Shape
    ? Shape extends ObjectTypePointers
      ? typeutil.addQuestionMarks<{
          [k in keyof Shape]:
            | pointerToAssignmentExpression<Shape[k]>
            | (pointerIsOptional<Shape[k]> extends true
                ? undefined | null
                : never)
            | (Shape[k]["hasDefault"] extends true ? undefined : never);
        }> & {[k in `@${string}`]: TypeSet | scalarLiterals}
      : never
    : never;

interface UnlessConflict {
  on: TypeSet | null;
  else?: TypeSet;
}

type InsertBaseExpression<Root extends TypeSet = TypeSet> = {
  __kind__: ExpressionKind.Insert;
  __element__: Root["__element__"];
  __cardinality__: Cardinality.One;
  __expr__: stripSet<Root>;
  __shape__: any;
};
export type $expr_Insert<
  // Root extends $expr_PathNode = $expr_PathNode
  El extends ObjectType = ObjectType
  // Conflict = UnlessConflict | null
  // Shape extends InsertShape<Root> = any
> = Expression<{
  __kind__: ExpressionKind.Insert;
  __element__: El;
  __cardinality__: Cardinality.One;
  __expr__: $expr_PathNode;
  __shape__: InsertShape<El>;

  unlessConflict(): $expr_InsertUnlessConflict<
    El,
    // Expression<{
    //   __kind__: ExpressionKind.Insert;
    //   __element__: El;
    //   __cardinality__: Cardinality.One;
    //   __expr__: $expr_PathNode;
    //   __shape__: InsertShape<El>;
    // }>,
    {on: null}
  >;
  unlessConflict<Conflict extends UnlessConflict>(
    conflictGetter: (scope: $scopify<El>) => Conflict
  ): $expr_InsertUnlessConflict<
    El,
    // Expression<{
    //   __kind__: ExpressionKind.Insert;
    //   __element__: El;
    //   __cardinality__: Cardinality.One;
    //   __expr__: $expr_PathNode;
    //   __shape__: InsertShape<El>;
    // }>,
    Conflict
  >;
}>;

export type $expr_InsertUnlessConflict<
  El extends ObjectType = ObjectType,
  // Root extends InsertBaseExpression = InsertBaseExpression,
  Conflict extends UnlessConflict = UnlessConflict
> = Expression<{
  __kind__: ExpressionKind.InsertUnlessConflict;
  __element__: Conflict["else"] extends TypeSet
    ? Conflict["else"]["__element__"]["__name__"] extends El["__name__"]
      ? El
      : $Object
    : El;
  __cardinality__: Conflict["else"] extends TypeSet
    ? Conflict["else"]["__cardinality__"]
    : Cardinality.AtMostOne;
  __expr__: InsertBaseExpression;
  __conflict__: Conflict;
}>;

function unlessConflict(
  this: $expr_Insert,
  conflictGetter?: (scope: TypeSet) => UnlessConflict
) {
  const expr: any = {
    __kind__: ExpressionKind.InsertUnlessConflict,
    __element__: this.__element__,
    __cardinality__: Cardinality.AtMostOne,
    __expr__: this
    // __conflict__: Conflict;
  };

  if (!conflictGetter) {
    expr.__conflict__ = {on: null};
    return $expressionify(expr);
  } else {
    const scopedExpr = $getScopedExpr(this.__expr__);
    const conflict = conflictGetter(scopedExpr);
    expr.__conflict__ = conflict;
    if (conflict.else) {
      expr.__cardinality__ = conflict.else.__cardinality__;
      if (this.__element__.__name__ !== conflict.else.__element__.__name__) {
        expr.__element__ = $getTypeByName("std::Object");
      }
    }
    return $expressionify(expr);
  }
}

export function $insertify(
  expr: Omit<$expr_Insert, "unlessConflict">
): $expr_Insert {
  (expr as any).unlessConflict = unlessConflict.bind(expr as any);
  return expr as any;
}

export function $normaliseInsertShape(
  root: ObjectTypeSet,
  shape: {[key: string]: any},
  isUpdate: boolean = false
): {[key: string]: TypeSet | {"+=": TypeSet} | {"-=": TypeSet}} {
  const newShape: {
    [key: string]: TypeSet | {"+=": TypeSet} | {"-=": TypeSet};
  } = {};
  for (const [key, _val] of Object.entries(shape)) {
    let val = _val;
    let setModify: string | null = null;
    if (isUpdate && _val != null && typeof _val === "object") {
      const valKeys = Object.keys(_val);
      if (
        valKeys.length === 1 &&
        (valKeys[0] === "+=" || valKeys[0] === "-=")
      ) {
        val = _val[valKeys[0]];
        setModify = valKeys[0];
      }
    }

    const pointer = root.__element__.__pointers__[key];

    // no pointer, not a link property
    const isLinkProp = key[0] === "@";
    if (!pointer && !isLinkProp) {
      throw new Error(
        `Could not find property pointer for ${
          isUpdate ? "update" : "insert"
        } shape key: '${key}'`
      );
    }

    // skip undefined vals
    if (val === undefined) continue;

    // is val is expression, assign to newShape
    if (val?.__kind__) {
      // ranges can contain null values, so if the type is 'std::number'
      // we need to set the type to the exact number type of the pointer
      // so null casts are correct
      if (
        val.__kind__ === ExpressionKind.Literal &&
        val.__element__.__kind__ === TypeKind.range &&
        val.__element__.__element__.__name__ === "std::number"
      ) {
        newShape[key] = (literal as any)(pointer.target, val.__value__);
      } else {
        newShape[key] = _val;
      }
      continue;
    }

    // handle link props
    // after this guard, pointer definitely is defined
    if (isLinkProp) {
      throw new Error(
        `Cannot assign plain data to link property '${key}'. Provide an expression instead.`
      );
    }

    // trying to assign plain data to a link
    if (pointer.__kind__ !== "property" && val !== null) {
      throw new Error(
        `Must provide subquery when assigning to link '${key}' in ${
          isUpdate ? "update" : "insert"
        } query.`
      );
    }

    // val is plain data
    // key corresponds to pointer or starts with "@"
    const isMulti =
      pointer.cardinality === Cardinality.AtLeastOne ||
      pointer.cardinality === Cardinality.Many;
    if (pointer.__kind__ === "property") {
      if (pointer.target.__name__ === "std::json") {
      }
    }

    const wrappedVal =
      val === null
        ? cast(pointer.target, null)
        : isMulti && Array.isArray(val)
        ? val.length === 0
          ? cast(pointer.target, null)
          : set(...val.map(v => (literal as any)(pointer.target, v)))
        : (literal as any)(pointer.target, val);
    newShape[key] = setModify
      ? ({[setModify]: wrappedVal} as any)
      : wrappedVal;
  }
  return newShape;
}

export function insert<Root extends $expr_PathNode>(
  root: Root,
  shape: InsertShape<Root["__element__"]>
): $expr_Insert<Root["__element__"]> {
  if (typeof shape !== "object") {
    throw new Error(
      `invalid insert shape.${
        typeof shape === "function"
          ? " Hint: Insert shape is expected to be an object, " +
            "not a function returning a shape object."
          : ""
      }`
    );
  }
  const expr: any = {
    __kind__: ExpressionKind.Insert,
    __element__: root.__element__,
    __cardinality__: Cardinality.One,
    __expr__: root,
    __shape__: $normaliseInsertShape(root, shape)
  };
  (expr as any).unlessConflict = unlessConflict.bind(expr);
  return $expressionify($insertify(expr)) as any;
}
