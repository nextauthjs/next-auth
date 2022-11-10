import type {
  Expression,
  ObjectType,
  ObjectTypeSet,
  TypeSet,
  BaseType,
  $scopify,
  PropertyDesc,
  LinkDesc
} from "./typesystem";
import {
  Cardinality,
  ExpressionKind,
  TypeKind
} from "edgedb/dist/reflection/index";
import {makeType} from "./hydrate";

import {$expressionify, $getScopedExpr} from "./path";
// @ts-ignore
import type {$FreeObjectλShape, $str} from "./modules/std";
import {spec} from "./__spec__";
import {literal} from "./literal";
import {resolveShapeElement} from "./select";
import type {
  normaliseShape,
  // normaliseElement,
  objectTypeToSelectShape
} from "./select";

type SingletonSet = Expression<
  TypeSet<BaseType, Cardinality.One | Cardinality.AtMostOne>
>;
type SimpleGroupElements = {[k: string]: SingletonSet};
type GroupModifiers = {by: SimpleGroupElements};
type NestedGroupElements = {
  [k: string]: SingletonSet | GroupingSet;
};

export type GroupingSet = {
  __kind__: "groupingset";
  __settype__: "set" | "tuple" | "rollup" | "cube";
  __elements__: NestedGroupElements;
  __exprs__: [string, SingletonSet][];
};
export function isGroupingSet(arg: any): arg is GroupingSet {
  return arg.__kind__ === "groupingset";
}

// result is partial to prevent "X is specified more than once" errors
// the return type is a lie, this function returns a grouping set
// but it pretends to return a SimpleGroupElements
// to make the static computatation of `key` easier
const makeGroupingSet =
  (prefix: string) =>
  <T extends SimpleGroupElements>(grps: T): {[k in keyof T]?: T[k]} => {
    const seenKeys = new Map<string, SingletonSet>();
    const unfiltered = Object.entries(grps as NestedGroupElements).flatMap(
      ([k, grp]) =>
        isGroupingSet(grp)
          ? grp.__exprs__
          : ([[k, grp]] as [string, SingletonSet][])
    );
    const filtered = unfiltered.filter(([k, expr]) => {
      if (!seenKeys.has(k)) {
        seenKeys.set(k, expr);
        return true;
      }

      if (expr !== seenKeys.get(k)) {
        throw new Error(
          `Cannot override pre-existing expression with key "${k}"`
        );
      }

      return false;
    });

    return {
      [`${Math.round(1000000 * Math.random())}___`]: {
        __kind__: "groupingset",
        __settype__: prefix,
        __elements__: grps,
        __exprs__: filtered
      } as GroupingSet
    } as any;
  };
const set = makeGroupingSet("set");
const tuple = makeGroupingSet("tuple");
const rollup = makeGroupingSet("rollup");
const cube = makeGroupingSet("cube");

const setFuncs = {set, tuple, rollup, cube};

export type $expr_Group<
  Expr extends ObjectTypeSet = ObjectTypeSet,
  Mods extends GroupModifiers = GroupModifiers,
  Shape extends object = {id: true}
> = Expression<{
  __element__: ObjectType<
    "std::FreeObject",
    $FreeObjectλShape & {
      // adding free shape elements into __pointers__
      // because objectTypeToSelectShape doesn't allow shapes on computeds
      // and setToTsType can't handle that currently
      grouping: PropertyDesc<$str, Cardinality.Many, false, true, true, false>;
      key: LinkDesc<
        ObjectType<
          "std::FreeObject",
          {
            // tslint:disable-next-line
            [k in keyof Mods["by"]]: Mods["by"][k]["__element__"] extends ObjectType
              ? never
              : PropertyDesc<
                  Mods["by"][k]["__element__"],
                  Cardinality.AtMostOne
                >;
          }
        >,
        Cardinality.One,
        {},
        false,
        true,
        true,
        false
      >;
      elements: LinkDesc<
        Expr["__element__"],
        Cardinality.Many,
        {},
        false,
        true,
        true,
        false
      >;
    },
    {
      // grouping: true;
      // key: {[k in keyof Mods["by"]]: true};
      // elements: normaliseShape<Shape, "by">;
      grouping: TypeSet<$str, Cardinality.Many>;
      key: Expression<{
        __element__: ObjectType<
          "std::FreeObject",
          $FreeObjectλShape,
          {
            [k in keyof Mods["by"]]: Expression<{
              __element__: Mods["by"][k]["__element__"];
              __cardinality__: Cardinality.AtMostOne;
            }>;
          }
        >;
        __cardinality__: Cardinality.One;
      }>;
      elements: Expression<{
        __element__: ObjectType<
          Expr["__element__"]["__name__"],
          Expr["__element__"]["__pointers__"],
          // Omit<normaliseShape<Shape>, "by">
          normaliseShape<Shape, "by">
        >;
        __cardinality__: Cardinality.Many;
      }>;
    }
  >;
  __cardinality__: Cardinality.Many;
  // bit of a lie, this is a GroupingSet at runtime
  __modifiers__: Mods;
  __kind__: ExpressionKind.Group;
  __expr__: ObjectTypeSet;
  __scope__: ObjectTypeSet;
}>;

// type modifierKeys = "by";
type noUndefined<T> = T extends undefined ? never : T;
type groupFunc = <
  Expr extends ObjectTypeSet,
  // Shape extends GroupModifiers
  // Grps extends SimpleGroupElements,
  Shape extends {by?: SimpleGroupElements} & objectTypeToSelectShape<
    Expr["__element__"]
  >
  // Mods extends GroupModifiers = {by: Shape["by"]}
>(
  expr: Expr,
  getter: (arg: $scopify<Expr["__element__"]>) => Readonly<Shape>
) => $expr_Group<
  Expr,
  {by: noUndefined<Shape["by"]>},
  normaliseShape<Shape, "by">
>;

const groupFunc: groupFunc = (expr, getter) => {
  const {shape, scope, modifiers} = resolveShape(getter, expr);
  // const scope = $getScopedExpr(expr as any);
  // const rawGroupings = getter(scope);
  const groupSet = tuple(modifiers.by);

  // only one key in object returned from makeGroupingSet
  const key = Object.keys(groupSet)[0];
  const grouping = groupSet[key] as any as GroupingSet;
  const keyShape: any = {};
  const keyPointers: any = {};
  const keyShapeElement: any = {};

  for (const [k, e] of grouping.__exprs__) {
    keyShape[k] = $expressionify({
      __element__: e.__element__,
      __cardinality__: Cardinality.AtMostOne
    } as any);
    keyPointers[k] = {
      __kind__: "property",
      target: e.__element__,
      cardinality: Cardinality.AtMostOne,
      exclusive: false,
      computed: false,
      readonly: false,
      hasDefault: false
    } as PropertyDesc;
    keyShapeElement[k] = true;
  }

  const $FreeObject = makeType(
    spec,
    [...spec.values()].find(s => s.name === "std::FreeObject")!.id,
    literal
  );

  const str = makeType(
    spec,
    [...spec.values()].find(s => s.name === "std::str")!.id,
    literal
  );

  return $expressionify({
    __element__: {
      ...$FreeObject,
      __name__: "std::FreeObject",
      __pointers__: {
        ...($FreeObject as any).__pointers__,
        __name__: "std::FreeObject",
        grouping: {
          __kind__: "property",
          target: str,
          cardinality: Cardinality.Many,
          exclusive: false,
          computed: false,
          readonly: false,
          hasDefault: false
        } as PropertyDesc,
        key: {
          __kind__: "link",
          target: {
            ...$FreeObject,
            __name__: "std::FreeObject",
            __pointers__: {
              ...($FreeObject as any).__pointers__,
              ...keyPointers
            },
            __shape__: keyShape
          },
          properties: {},
          cardinality: Cardinality.One,
          exclusive: false,
          computed: false,
          readonly: false,
          hasDefault: false
        } as LinkDesc,

        elements: {
          __kind__: "link",
          target: expr.__element__,
          cardinality: Cardinality.Many,
          properties: {},
          exclusive: false,
          computed: false,
          readonly: false,
          hasDefault: false
        } as LinkDesc
      },
      __shape__: {
        grouping: $expressionify({
          __element__: str,
          __cardinality__: Cardinality.Many
        } as any),
        key: $expressionify({
          __element__: {
            ...$FreeObject,
            __shape__: keyShape
          },
          __cardinality__: Cardinality.One
        } as any),
        elements: $expressionify({
          __element__: {...expr.__element__, __shape__: shape} as any,
          __cardinality__: Cardinality.Many
        } as any)
      }
    },

    __cardinality__: Cardinality.Many,
    __expr__: expr,
    __modifiers__: {by: grouping},
    __kind__: ExpressionKind.Group,
    __scope__: scope
  }) as any;
};
Object.assign(groupFunc, setFuncs);

function resolveShape(
  shapeGetter: ((scope: any) => any) | any,
  expr: TypeSet
): {modifiers: {by: SimpleGroupElements}; shape: any; scope: TypeSet} {
  const modifiers: {by: SimpleGroupElements} = {} as any;
  const shape: any = {};

  // get scoped object if expression is objecttypeset
  const scope = $getScopedExpr(expr as any) as ObjectTypeSet;

  // execute getter with scope
  const selectShape =
    typeof shapeGetter === "function" ? shapeGetter(scope) : shapeGetter;

  for (const [key, value] of Object.entries(selectShape)) {
    // handle modifier keys
    if (key === "by") {
      modifiers[key] = value as any;
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
  if (Object.keys(shape).length === 0) {
    shape.id = true;
  }
  if (!modifiers.by) {
    throw new Error("Must provide a `by` key in `e.group`");
  }
  return {shape, modifiers, scope};
}
export const group: typeof setFuncs & groupFunc = groupFunc as any;
