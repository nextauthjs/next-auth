import {
  Duration,
  LocalDate,
  LocalDateTime,
  LocalTime,
  RelativeDuration,
  DateDuration,
  Range
} from "edgedb";
import {
  Cardinality,
  ExpressionKind,
  OperatorKind,
  TypeKind,
  util
} from "edgedb/dist/reflection/index";
import {
  $expr_Array,
  $expr_NamedTuple,
  $expr_Tuple,
  $expr_TuplePath,
  BaseType,
  EnumType,
  isArrayType,
  isNamedTupleType,
  isObjectType,
  isTupleType,
  ObjectType,
  ObjectTypeSet,
  RangeType,
  TypeSet
} from "./typesystem";
import type {$expr_Literal} from "./literal";
import type {
  $expr_PathLeaf,
  $expr_PathNode,
  $expr_TypeIntersection
} from "./path";
import {reservedKeywords} from "edgedb/dist/reflection/index";
import type {$expr_Cast} from "./cast";
import type {$expr_Detached} from "./detached";
import type {$expr_For, $expr_ForVar} from "./for";
import type {$expr_Function, $expr_Operator} from "./funcops";
import type {$expr_Insert, $expr_InsertUnlessConflict} from "./insert";
import type {$expr_Param, $expr_WithParams} from "./params";
import type {
  $expr_Delete,
  $expr_Select,
  LimitExpression,
  OffsetExpression
} from "./select";
import type {$expr_Set} from "./set";
import type {$expr_Update} from "./update";
import type {$expr_Alias, $expr_With} from "./with";
import type {$expr_Group, GroupingSet} from "./group";
import type {$expr_Global} from "./globals";

export type SomeExpression =
  | $expr_PathNode
  | $expr_PathLeaf
  | $expr_Literal
  | $expr_Set
  | $expr_Array
  | $expr_Tuple
  | $expr_NamedTuple
  | $expr_TuplePath
  | $expr_Cast
  | $expr_Select
  | $expr_Delete
  | $expr_Update
  | $expr_Insert
  | $expr_InsertUnlessConflict
  | $expr_Function
  | $expr_Operator
  | $expr_For
  | $expr_ForVar
  | $expr_TypeIntersection
  | $expr_Alias
  | $expr_With
  | $expr_WithParams
  | $expr_Param
  | $expr_Detached
  | $expr_Group
  | $expr_Global;

type WithScopeExpr =
  | $expr_Select
  | $expr_Update
  | $expr_Insert
  | $expr_InsertUnlessConflict
  | $expr_For
  | $expr_Group;

interface RenderCtx {
  // mapping withable expr to list of with vars
  withBlocks: Map<WithScopeExpr, Set<SomeExpression>>;
  // metadata about each with var
  withVars: Map<
    SomeExpression,
    {
      name: string;
      scope: WithScopeExpr;
      childExprs: Set<SomeExpression>;
      scopedExpr?: SomeExpression; // scope vars only
    }
  >;
  renderWithVar?: SomeExpression;
  forVars: Map<$expr_ForVar, string>;
  linkProps: Map<SomeExpression, string[]>;
}

const toEdgeQLCache = new WeakMap<any, string>();

export function $toEdgeQL(this: any) {
  if (toEdgeQLCache.has(this)) {
    return toEdgeQLCache.get(this)!;
  }

  const walkExprCtx: WalkExprTreeCtx = {
    seen: new Map(),
    rootScope: null
  };

  walkExprTree(this, null, walkExprCtx);

  // get variables by block
  const withBlocks: RenderCtx["withBlocks"] = new Map();
  // get per-variable metadata
  const withVars: RenderCtx["withVars"] = new Map();
  const seen = new Map(walkExprCtx.seen);
  const linkProps: RenderCtx["linkProps"] = new Map();

  // iterate over all expressions
  for (const [expr, refData] of seen) {
    // delete from seen after visitinng
    seen.delete(expr);

    // convert referenced link props to simple string array
    if (refData.linkProps.length) {
      linkProps.set(
        expr,
        refData.linkProps.map(linkProp =>
          linkProp.__parent__.linkName.slice(1)
        )
      );
    }

    // already extracted
    if (withVars.has(expr)) {
      continue;
    }

    // ignore unbound leaves, nodes, and intersections
    // these should be rendered as is
    if (
      !refData.boundScope &&
      (expr.__kind__ === ExpressionKind.PathLeaf ||
        expr.__kind__ === ExpressionKind.PathNode ||
        expr.__kind__ === ExpressionKind.TypeIntersection)
    ) {
      continue;
    }

    // forvars and params should not be hoisted
    if (
      expr.__kind__ === ExpressionKind.ForVar ||
      expr.__kind__ === ExpressionKind.Param
    ) {
      continue;
    }

    // pull out scope variables
    // from select, update, and group expressions.
    // these are always rendered in with blocks
    if (
      (expr.__kind__ === ExpressionKind.Select ||
        expr.__kind__ === ExpressionKind.Update ||
        expr.__kind__ === ExpressionKind.Group) &&
      expr.__scope__ &&
      // with var not previously registered
      !withVars.has(expr.__scope__ as any)
    ) {
      const withBlock = expr;
      const scopeVar = expr.__scope__ as SomeExpression;
      const scopeVarName = `__scope_${
        withVars.size
      }_${scopeVar.__element__.__name__.replace(/[^A-Za-z]/g, "")}`;

      withVars.set(scopeVar, {
        name: scopeVarName,
        scope: withBlock,
        childExprs: new Set(),
        scopedExpr:
          expr.__element__.__kind__ === TypeKind.object
            ? (expr.__expr__ as any)
            : undefined
      });
    }

    // expression should be extracted to with block if
    // - bound with e.with
    // - refcount > 1
    // - aliased with e.alias
    if (
      refData.refCount > 1 ||
      refData.boundScope ||
      refData.aliases.length > 0
    ) {
      // first, check if expr is bound to scope
      let withBlock = refData.boundScope;

      // filter nulls
      const parentScopes = [...refData.parentScopes].filter(
        scope => scope !== null
      ) as WithScopeExpr[];

      // if expression is unbound
      if (!withBlock) {
        // if parent scopes haven't all been resolved,
        // re-add current expr to `seen` to be resolved later
        if (parentScopes.some(parentScope => seen.has(parentScope))) {
          seen.set(expr, refData);
          continue;
        }

        // set withBlock to top-level parent scope
        const resolvedParentScopes = parentScopes.map(
          parentScope => withVars.get(parentScope)?.scope ?? parentScope
        );
        withBlock =
          resolvedParentScopes.find(parentScope => {
            // loop over parent scopes
            // get list of children exprs for each parent
            const childExprs = new Set(
              walkExprCtx.seen.get(parentScope)!.childExprs
            );
            // return true for scope that contains all other scopes
            return resolvedParentScopes.every(
              scope => childExprs.has(scope) || scope === parentScope
            );
          }) ?? walkExprCtx.rootScope;
      }

      if (!withBlock) {
        throw new Error(
          `Cannot extract repeated expression into 'WITH' block, ` +
            `query has no 'WITH'able expressions`
        );
      }

      if (!withBlocks.has(withBlock)) {
        withBlocks.set(withBlock, new Set());
      }

      // check all references and aliases are within this block
      const validScopes = new Set([
        withBlock,
        ...walkExprCtx.seen.get(withBlock)!.childExprs
      ]);
      for (const scope of [
        ...refData.parentScopes,
        ...util.flatMap(refData.aliases, alias => [
          ...walkExprCtx.seen.get(alias)!.parentScopes
        ])
      ]) {
        if (scope === null || !validScopes.has(scope)) {
          throw new Error(
            refData.boundScope
              ? `Expr or its aliases used outside of declared 'WITH' block scope`
              : `Cannot extract repeated or aliased expression into 'WITH' block, ` +
                `expression or its aliases appear outside root scope`
          );
        }
      }

      for (const withVar of [expr, ...refData.aliases]) {
        // withVar is an alias already explicitly bound
        // to an inner WITH block
        const withVarBoundScope = walkExprCtx.seen.get(withVar)!.boundScope;
        if (withVarBoundScope && withVarBoundScope !== refData.boundScope) {
          continue;
        }

        const withVarName = `__withVar_${withVars.size}`;

        withBlocks.get(withBlock)!.add(withVar);
        withVars.set(withVar, {
          name: withVarName,
          scope: withBlock,
          childExprs: new Set(walkExprCtx.seen.get(withVar)!.childExprs)
        });
      }
    }
  }

  let edgeQL = renderEdgeQL(this, {
    withBlocks,
    withVars,
    forVars: new Map(),
    linkProps
  });
  if (
    edgeQL.startsWith("(") &&
    edgeQL.endsWith(")") &&
    !(
      this.__kind__ === ExpressionKind.Tuple ||
      this.__kind__ === ExpressionKind.NamedTuple ||
      this.__kind__ === ExpressionKind.Literal
    )
  ) {
    edgeQL = edgeQL.slice(1, -1);
  }
  toEdgeQLCache.set(this, edgeQL);

  return edgeQL;
}

interface WalkExprTreeCtx {
  seen: Map<
    SomeExpression,
    {
      refCount: number;
      // tracks all withable ancestors
      parentScopes: Set<WithScopeExpr | null>;
      // tracks all child exprs
      childExprs: SomeExpression[];
      // tracks bound scope from e.with
      boundScope: WithScopeExpr | null;
      // tracks aliases from e.alias
      aliases: SomeExpression[];
      linkProps: $expr_PathLeaf[];
    }
  >;
  rootScope: WithScopeExpr | null;
}

// walks entire expression tree
// populates
function walkExprTree(
  _expr: TypeSet,
  parentScope: WithScopeExpr | null,
  ctx: WalkExprTreeCtx
): SomeExpression[] {
  if (!(_expr as any).__kind__) {
    throw new Error(
      `Expected a valid querybuilder expression, ` +
        `instead received ${typeof _expr}${
          typeof _expr !== "undefined" ? `: '${_expr}'` : ""
        }.` +
        getErrorHint(_expr)
    );
  }

  const expr = _expr as SomeExpression;

  function walkShape(shape: object) {
    for (let param of Object.values(shape)) {
      if (param.__kind__ === ExpressionKind.PolyShapeElement) {
        param = param.__shapeElement__;
      }
      if (typeof param === "object") {
        if (!!(param as any).__kind__) {
          // param is expression
          childExprs.push(...walkExprTree(param as any, expr as any, ctx));
        } else {
          walkShape(param);
        }
      }
    }
  }

  // set root scope
  if (!ctx.rootScope && parentScope) {
    ctx.rootScope = parentScope;
  }

  // return without walking if expression has been seen
  const seenExpr = ctx.seen.get(expr);
  if (seenExpr) {
    seenExpr.refCount += 1;
    // if (seenExpr.refCount > 1) {
    // console.log(`###########\nSEEN ${seenExpr.refCount} times`);
    // console.log(expr.__kind__);
    // console.log(expr.__element__.__name__);
    // const arg = (expr as any)?.__parent__ || (expr as any)?.__name__;
    // if (arg) console.log(arg);
    // }
    seenExpr.parentScopes.add(parentScope);
    return [expr, ...seenExpr.childExprs];
  }

  const childExprs: SomeExpression[] = [];
  ctx.seen.set(expr, {
    refCount: 1,
    parentScopes: new Set([parentScope]),
    childExprs,
    boundScope: null,
    aliases: [],
    linkProps: []
  });

  switch (expr.__kind__) {
    case ExpressionKind.Alias:
      childExprs.push(...walkExprTree(expr.__expr__, parentScope, ctx));
      ctx.seen.get(expr.__expr__ as any)!.aliases.push(expr);
      break;
    case ExpressionKind.With:
      childExprs.push(...walkExprTree(expr.__expr__, parentScope, ctx));
      for (const refExpr of expr.__refs__) {
        walkExprTree(refExpr, expr.__expr__, ctx);
        const seenRef = ctx.seen.get(refExpr as any)!;
        if (seenRef.boundScope) {
          throw new Error(`Expression bound to multiple 'WITH' blocks`);
        }
        seenRef.boundScope = expr.__expr__;
      }
      break;
    case ExpressionKind.Literal:
    case ExpressionKind.ForVar:
    case ExpressionKind.Param:
      break;
    case ExpressionKind.PathLeaf:
    case ExpressionKind.PathNode:
      if (expr.__parent__) {
        if ((expr.__parent__.type as any).__scopedFrom__) {
          // if parent is scoped expr then don't walk expr
          // since it will already be walked by enclosing select/update

          childExprs.push(expr.__parent__.type as any);
        } else {
          childExprs.push(
            ...walkExprTree(expr.__parent__.type, parentScope, ctx)
          );
        }

        if (
          // is link prop
          expr.__kind__ === ExpressionKind.PathLeaf &&
          expr.__parent__.linkName.startsWith("@")
        ) {
          // don't hoist a linkprop that isn't scoped from parentScope
          const parentScopeVar = (parentScope as any).__scope__;
          if (parentScopeVar === expr.__parent__.type) {
            ctx.seen.get(parentScope!)?.linkProps.push(expr);
          }
        }
      }
      break;
    case ExpressionKind.Cast:
      if (expr.__expr__ === null) break;
      childExprs.push(...walkExprTree(expr.__expr__, parentScope, ctx));
      break;
    case ExpressionKind.Set:
      for (const subExpr of expr.__exprs__) {
        childExprs.push(...walkExprTree(subExpr, parentScope, ctx));
      }
      break;
    case ExpressionKind.Array:
      for (const subExpr of expr.__items__) {
        childExprs.push(...walkExprTree(subExpr, parentScope, ctx));
      }
      break;
    case ExpressionKind.Tuple:
      for (const subExpr of expr.__items__) {
        childExprs.push(...walkExprTree(subExpr, parentScope, ctx));
      }
      break;
    case ExpressionKind.NamedTuple:
      for (const subExpr of Object.values(expr.__shape__)) {
        childExprs.push(...walkExprTree(subExpr, parentScope, ctx));
      }
      break;
    case ExpressionKind.TuplePath:
      childExprs.push(...walkExprTree(expr.__parent__, parentScope, ctx));
      break;
    case ExpressionKind.Select:
    case ExpressionKind.Update: {
      const modifiers = expr.__modifiers__;
      if (modifiers.filter) {
        childExprs.push(...walkExprTree(modifiers.filter, expr, ctx));
      }
      if (modifiers.order_by) {
        for (const orderExpr of modifiers.order_by) {
          childExprs.push(...walkExprTree(orderExpr.expression, expr, ctx));
        }
      }
      if (modifiers.offset) {
        childExprs.push(...walkExprTree(modifiers.offset!, expr, ctx));
      }
      if (modifiers.limit) {
        childExprs.push(...walkExprTree(modifiers.limit!, expr, ctx));
      }

      if (expr.__kind__ === ExpressionKind.Select) {
        if (
          isObjectType(expr.__element__) &&
          // don't walk shape twice if select expr justs wrap another object
          // type expr with the same shape
          expr.__element__.__shape__ !==
            (expr.__expr__ as ObjectTypeSet).__element__.__shape__
        ) {
          walkShape(expr.__element__.__shape__ ?? {});
        }
      } else {
        // Update
        const shape: any = expr.__shape__ ?? {};

        for (const _element of Object.values(shape)) {
          let element: any = _element;
          if (!element.__element__) {
            if (element["+="]) element = element["+="];
            else if (element["-="]) element = element["-="];
          }
          childExprs.push(...walkExprTree(element as any, expr, ctx));
        }
      }

      childExprs.push(...walkExprTree(expr.__expr__, expr, ctx));
      break;
    }
    case ExpressionKind.Delete: {
      childExprs.push(...walkExprTree(expr.__expr__, parentScope, ctx));
      break;
    }
    case ExpressionKind.Insert: {
      const shape: any = expr.__shape__ ?? {};

      for (const element of Object.values(shape)) {
        childExprs.push(...walkExprTree(element as any, expr, ctx));
      }

      childExprs.push(...walkExprTree(expr.__expr__, expr, ctx));
      break;
    }
    case ExpressionKind.InsertUnlessConflict: {
      // InsertUnlessConflict doesn't create a new scope, the parent scope of
      // child expressions is the wrapped Insert expr
      if (expr.__conflict__.on) {
        childExprs.push(
          ...walkExprTree(
            expr.__conflict__.on,
            expr.__expr__ as $expr_Insert,
            ctx
          )
        );
      }
      if (expr.__conflict__.else) {
        childExprs.push(
          ...walkExprTree(
            expr.__conflict__.else,
            expr.__expr__ as $expr_Insert,
            ctx
          )
        );
      }

      childExprs.push(...walkExprTree(expr.__expr__, parentScope, ctx));
      break;
    }
    case ExpressionKind.Group: {
      const groupingSet = expr.__modifiers__.by as any as GroupingSet;
      // const groupingSet = expr.__grouping__ as any as GroupingSet;
      for (const [_k, groupExpr] of groupingSet.__exprs__) {
        // this prevents recurring grouping elements from being walked twice
        // this way, these won't get pulled into with blocks,
        // which is good because they need to be rendered in `using`
        const seen: Set<any> = new Set();
        if (!seen.has(expr)) {
          childExprs.push(...walkExprTree(groupExpr, expr, ctx));
          seen.add(expr);
        }
      }

      if (!expr.__element__.__shape__.elements.__element__.__shape__) {
        throw new Error("Missing shape in GROUP statement");
      }
      walkShape(expr.__element__.__shape__.elements.__element__.__shape__);
      childExprs.push(...walkExprTree(expr.__expr__, expr, ctx));
      break;
    }
    case ExpressionKind.TypeIntersection:
      childExprs.push(...walkExprTree(expr.__expr__, parentScope, ctx));
      break;
    case ExpressionKind.Operator:
    case ExpressionKind.Function:
      for (const subExpr of expr.__args__) {
        if (Array.isArray(subExpr)) {
          for (const arg of subExpr) {
            if (arg) childExprs.push(...walkExprTree(arg, parentScope, ctx));
          }
        } else {
          childExprs.push(...walkExprTree(subExpr!, parentScope, ctx));
        }
      }
      if (expr.__kind__ === ExpressionKind.Function) {
        for (const subExpr of Object.values(expr.__namedargs__)) {
          childExprs.push(...walkExprTree(subExpr, parentScope, ctx));
        }
      }
      break;
    case ExpressionKind.For: {
      childExprs.push(...walkExprTree(expr.__iterSet__ as any, expr, ctx));
      childExprs.push(...walkExprTree(expr.__expr__, expr, ctx));
      break;
    }
    case ExpressionKind.WithParams: {
      if (parentScope !== null) {
        throw new Error(
          `'withParams' does not support being used as a nested expression`
        );
      }
      childExprs.push(...walkExprTree(expr.__expr__, parentScope, ctx));
      break;
    }
    case ExpressionKind.Detached: {
      childExprs.push(...walkExprTree(expr.__expr__, parentScope, ctx));
      break;
    }
    case ExpressionKind.Global:
      break;
    default:
      util.assertNever(
        expr,
        new Error(`Unrecognized expression kind: "${(expr as any).__kind__}"`)
      );
  }

  return [expr, ...childExprs];
}

function renderEdgeQL(
  _expr: TypeSet,
  ctx: RenderCtx,
  renderShape: boolean = true,
  noImplicitDetached: boolean = false
): string {
  if (!(_expr as any).__kind__) {
    throw new Error("Invalid expression.");
  }
  const expr = _expr as SomeExpression;

  // if expression is in a with block
  // render its name
  const withVar = ctx.withVars.get(expr);

  if (withVar && ctx.renderWithVar !== expr) {
    return renderShape &&
      expr.__kind__ === ExpressionKind.Select &&
      isObjectType(expr.__element__)
      ? `(${withVar.name} ${shapeToEdgeQL(
          (expr.__element__.__shape__ || {}) as object,
          ctx,
          null,
          true // render shape only
        )})`
      : withVar.name;
  }

  // render with block expression
  function renderWithBlockExpr(
    varExpr: SomeExpression,
    _noImplicitDetached?: boolean
  ) {
    const withBlockElement = ctx.withVars.get(varExpr)!;
    let renderedExpr = renderEdgeQL(
      withBlockElement.scopedExpr ?? varExpr,
      {
        ...ctx,
        renderWithVar: varExpr
      },
      !withBlockElement.scopedExpr, // render shape if no scopedExpr exists
      _noImplicitDetached
    );
    const renderedExprNoDetached = renderEdgeQL(
      withBlockElement.scopedExpr ?? varExpr,
      {
        ...ctx,
        renderWithVar: varExpr
      },
      !withBlockElement.scopedExpr, // render shape if no scopedExpr exists
      true
    );

    if (ctx.linkProps.has(expr)) {
      renderedExpr = `(SELECT ${renderedExpr} {\n${ctx.linkProps
        .get(expr)!
        .map(
          linkPropName =>
            `  __linkprop_${linkPropName} := ${renderedExprNoDetached}@${linkPropName}`
        )
        .join(",\n")}\n})`;
    }
    return `  ${withBlockElement.name} := ${
      renderedExpr.includes("\n")
        ? `(\n${indent(
            renderedExpr[0] === "(" &&
              renderedExpr[renderedExpr.length - 1] === ")"
              ? renderedExpr.slice(1, -1)
              : renderedExpr,
            4
          )}\n  )`
        : renderedExpr
    }`;
  }

  // extract scope expression from select/update if exists
  const scopeExpr =
    (expr.__kind__ === ExpressionKind.Select ||
      expr.__kind__ === ExpressionKind.Update ||
      expr.__kind__ === ExpressionKind.Group) &&
    ctx.withVars.has(expr.__scope__ as any)
      ? (expr.__scope__ as SomeExpression)
      : undefined;

  const scopeExprVar: string[] = [];
  const unscopedWithBlock: string[] = [];
  const scopedWithBlock: string[] = [];

  // generate with block if needed
  if (ctx.withBlocks.has(expr as any) || scopeExpr) {
    // sort associated vars
    const sortedBlockVars = topoSortWithVars(
      ctx.withBlocks.get(expr as any) ?? new Set(),
      ctx
    );

    if (!scopeExpr) {
      // if no scope expression exists, all variables are unscoped
      unscopedWithBlock.push(
        ...sortedBlockVars.map(blockVar => renderWithBlockExpr(blockVar))
      );
    }
    // else if (expr.__kind__ === ExpressionKind.Group) {
    //   // add all vars into scoped with block
    //   // this is rendered inside the `using` clause later
    //   // no need for the with/for trick
    //   scopeExprVar.push(renderWithBlockExpr(scopeExpr, noImplicitDetached));
    //   scopedWithBlock.push(
    //     ...sortedBlockVars.map(blockVar => renderWithBlockExpr(blockVar))
    //   );
    // }
    else {
      // get scope variable
      const scopeVar = ctx.withVars.get(scopeExpr)!;

      // get list of with vars that reference scope
      const scopedVars = sortedBlockVars.filter(blockVarExpr =>
        ctx.withVars.get(blockVarExpr)?.childExprs.has(scopeExpr)
      );
      // filter blockvars to only include vars that don't reference scope
      unscopedWithBlock.push(
        ...sortedBlockVars
          .filter(blockVar => !scopedVars.includes(blockVar))
          .map(blockVar => renderWithBlockExpr(blockVar))
      );

      // when rendering `with` variables that reference current scope
      // they are extracted into computed properties defining in a for loop
      if (!scopedVars.length) {
        scopeExprVar.push(renderWithBlockExpr(scopeExpr, noImplicitDetached));
      } else {
        const scopeName = scopeVar.name;

        // render a reference to scoped path (e.g. ".nemesis")
        scopeVar.name = scopeName + "_expr";
        scopeExprVar.push(renderWithBlockExpr(scopeExpr, noImplicitDetached));
        // scopedWithBlock.push(
        //   renderWithBlockExpr(scopeExpr, noImplicitDetached)
        // );

        // render a for loop containing all scoped block vars
        // as computed properties
        scopeVar.name = scopeName + "_inner";
        scopeExprVar.push(
          `  ${scopeName} := (FOR ${scopeVar.name} IN {${
            scopeName + "_expr"
          }} UNION (\n    WITH\n${indent(
            scopedVars
              .map(blockVar => renderWithBlockExpr(blockVar))
              .join(",\n"),
            4
          )}\n    SELECT ${scopeVar.name} {\n${scopedVars
            .map(blockVar => {
              const name = ctx.withVars.get(blockVar)!.name;
              return `      ${name} := ${name}`;
            })
            .join(",\n")}\n    }\n  ))`
        );

        // change var name back to original value
        scopeVar.name = scopeName;

        // reassign name for all scoped block vars
        for (const blockVarExpr of scopedVars) {
          const blockVar = ctx.withVars.get(blockVarExpr)!;
          blockVar.name = `${scopeName}.${blockVar.name}`;
        }
      }
    }
  }

  const withBlockElements = [
    ...unscopedWithBlock,
    ...scopeExprVar,
    ...scopedWithBlock
  ];
  const withBlock = withBlockElements.length
    ? `WITH\n${withBlockElements.join(",\n")}\n`
    : "";

  if (expr.__kind__ === ExpressionKind.With) {
    return renderEdgeQL(expr.__expr__, ctx);
  } else if (expr.__kind__ === ExpressionKind.WithParams) {
    return `(WITH\n${expr.__params__
      .map(param => {
        const optional =
          param.__cardinality__ === Cardinality.AtMostOne ? "OPTIONAL " : "";
        return `  __param__${param.__name__} := ${
          param.__isComplex__
            ? `<${param.__element__.__name__}>to_json(<${optional}str>$${param.__name__})`
            : `<${optional}${param.__element__.__name__}>$${param.__name__}`
        }`;
      })
      .join(",\n")}\nSELECT ${renderEdgeQL(expr.__expr__, ctx)})`;
  } else if (expr.__kind__ === ExpressionKind.Alias) {
    const aliasedExprVar = ctx.withVars.get(expr.__expr__ as any);
    if (!aliasedExprVar) {
      throw new Error(
        `Expression referenced by alias does not exist in 'WITH' block`
      );
    }
    return aliasedExprVar.name;
  } else if (
    expr.__kind__ === ExpressionKind.PathNode ||
    expr.__kind__ === ExpressionKind.PathLeaf
  ) {
    if (!expr.__parent__) {
      return `${noImplicitDetached ? "" : "DETACHED "}${
        expr.__element__.__name__
      }`;
    } else {
      const isScopedLinkProp =
        expr.__parent__.linkName.startsWith("@") &&
        ctx.withVars.has(expr.__parent__.type as any);
      const linkName = isScopedLinkProp
        ? `__linkprop_${expr.__parent__.linkName.slice(1)}`
        : expr.__parent__.linkName;
      const parent = renderEdgeQL(
        expr.__parent__.type,
        ctx,
        false,
        noImplicitDetached
      );
      return `${parent}${linkName.startsWith("@") ? "" : "."}${q(linkName)}`;
    }
  } else if (expr.__kind__ === ExpressionKind.Literal) {
    return literalToEdgeQL(expr.__element__, expr.__value__);
  } else if (expr.__kind__ === ExpressionKind.Set) {
    const exprs = expr.__exprs__;

    if (
      exprs.every(ex => ex.__element__.__kind__ === TypeKind.object) ||
      exprs.every(ex => ex.__element__.__kind__ !== TypeKind.object)
    ) {
      if (exprs.length === 0) return `<${expr.__element__.__name__}>{}`;
      return `{ ${exprs.map(ex => renderEdgeQL(ex, ctx)).join(", ")} }`;
    } else {
      throw new Error(
        `Invalid arguments to set constructor: ${exprs
          .map(ex => ex.__element__.__name__)
          .join(", ")}`
      );
    }
  } else if (expr.__kind__ === ExpressionKind.Array) {
    return `[${expr.__items__
      .map(item => renderEdgeQL(item, ctx))
      .join(", ")}]`;
  } else if (expr.__kind__ === ExpressionKind.Tuple) {
    return `(\n${expr.__items__
      .map(
        item => `  ` + renderEdgeQL(item, ctx, renderShape, noImplicitDetached)
      )
      .join(",\n")}${expr.__items__.length === 1 ? "," : ""}\n)`;
  } else if (expr.__kind__ === ExpressionKind.NamedTuple) {
    return `(\n${Object.keys(expr.__shape__)
      .map(
        key =>
          `  ${key} := ${renderEdgeQL(
            expr.__shape__[key],
            ctx,
            renderShape,
            noImplicitDetached
          )}`
      )
      .join(",\n")}\n)`;
  } else if (expr.__kind__ === ExpressionKind.TuplePath) {
    return `${renderEdgeQL(expr.__parent__, ctx)}.${expr.__index__}`;
  } else if (expr.__kind__ === ExpressionKind.Cast) {
    const typeName =
      expr.__element__.__name__ === "std::number"
        ? "std::float64"
        : expr.__element__.__name__;
    if (expr.__expr__ === null) {
      return `<${typeName}>{}`;
    }
    return `<${typeName}>(${renderEdgeQL(expr.__expr__, ctx)})`;
  } else if (expr.__kind__ === ExpressionKind.Select) {
    const lines: string[] = [];
    if (isObjectType(expr.__element__)) {
      const selectionTarget = renderEdgeQL(
        expr.__scope__ ?? expr.__expr__,
        ctx,
        false
      );

      lines.push(
        `SELECT${
          selectionTarget === "DETACHED std::FreeObject"
            ? ""
            : ` ${selectionTarget}`
        }`
      );

      if (
        expr.__element__.__shape__ !==
        (expr.__expr__ as ObjectTypeSet).__element__.__shape__
      ) {
        lines.push(
          shapeToEdgeQL(
            (expr.__element__.__shape__ || {}) as object,
            ctx,
            expr.__element__
          )
        );
      }
    } else {
      // non-object/non-shape select expression
      const needsScalarVar =
        (expr.__modifiers__.filter ||
          expr.__modifiers__.order_by ||
          expr.__modifiers__.offset ||
          expr.__modifiers__.limit) &&
        !ctx.withVars.has(expr.__expr__ as any);

      lines.push(
        `SELECT ${needsScalarVar ? "_ := " : ""}${renderEdgeQL(
          expr.__expr__,
          ctx
        )}`
      );

      if (needsScalarVar) {
        ctx = {...ctx, withVars: new Map(ctx.withVars)};
        ctx.withVars.set(expr.__expr__ as any, {
          name: "_",
          childExprs: new Set(),
          scope: expr
        });
      }
    }

    const modifiers: string[] = [];

    if (expr.__modifiers__.filter) {
      modifiers.push(`FILTER ${renderEdgeQL(expr.__modifiers__.filter, ctx)}`);
    }
    if (expr.__modifiers__.order_by) {
      modifiers.push(
        ...expr.__modifiers__.order_by.map(
          ({expression, direction, empty}, i) => {
            return `${i === 0 ? "ORDER BY" : "  THEN"} ${renderEdgeQL(
              expression,
              ctx
            )}${direction ? " " + direction : ""}${empty ? " " + empty : ""}`;
          }
        )
      );
    }
    if (expr.__modifiers__.offset) {
      modifiers.push(
        `OFFSET ${renderEdgeQL(
          expr.__modifiers__.offset as OffsetExpression,
          ctx
        )}`
      );
    }
    if (expr.__modifiers__.limit) {
      modifiers.push(
        `LIMIT ${renderEdgeQL(
          expr.__modifiers__.limit as LimitExpression,
          ctx
        )}`
      );
    }

    // without assert_single, the query will return a more informative
    // CardinalityMismatchError when the query returns more than one result
    return (
      // (expr.__modifiers__.singleton ? `select assert_single((` : ``) +
      "(" +
      withBlock +
      lines.join(" ") +
      (modifiers.length ? "\n" + modifiers.join("\n") : "") +
      ")"
      // + (expr.__modifiers__.singleton ? `))` : ``)
    );
  } else if (expr.__kind__ === ExpressionKind.Update) {
    return `(${withBlock}UPDATE ${renderEdgeQL(expr.__scope__, ctx, false)}${
      expr.__modifiers__.filter
        ? `\nFILTER ${renderEdgeQL(expr.__modifiers__.filter, ctx)}\n`
        : " "
    }SET ${shapeToEdgeQL(expr.__shape__, ctx, null, false, false)})`;
  } else if (expr.__kind__ === ExpressionKind.Delete) {
    return `(${withBlock}DELETE ${renderEdgeQL(
      expr.__expr__,
      ctx,
      undefined,
      noImplicitDetached
    )})`;
  } else if (expr.__kind__ === ExpressionKind.Insert) {
    return `(${withBlock}INSERT ${renderEdgeQL(
      expr.__expr__,
      ctx,
      false,
      true
    )} ${shapeToEdgeQL(expr.__shape__, ctx, null, false, false)})`;
  } else if (expr.__kind__ === ExpressionKind.InsertUnlessConflict) {
    const $on = expr.__conflict__.on;
    const $else = expr.__conflict__.else;
    const clause: string[] = [];
    if (!$on) {
      clause.push("\nUNLESS CONFLICT");
    }
    if ($on) {
      clause.push(
        `\nUNLESS CONFLICT ON ${renderEdgeQL($on, ctx, false, true)}`
      );
    }
    if ($else) {
      clause.push(`\nELSE (${renderEdgeQL($else, ctx, true, true)})`);
    }
    return `(${renderEdgeQL(expr.__expr__, ctx, false, true).slice(
      1,
      -1
    )} ${clause.join("")})`;
  } else if (expr.__kind__ === ExpressionKind.Group) {
    const groupingSet = expr.__modifiers__.by as any as GroupingSet;
    const elementsShape =
      expr.__element__.__shape__.elements.__element__.__shape__;

    const selectStatement: string[] = [];
    const groupStatement: string[] = [];

    const groupTarget = renderEdgeQL(expr.__scope__, ctx, false);
    groupStatement.push(`GROUP ${groupTarget}`);

    // render scoped withvars in using
    const combinedBlock = [
      // ...scopedWithBlock,
      // this is deduplicated in e.group
      ...groupingSet.__exprs__.map(
        ([k, v]) => `  ${k} := ${renderEdgeQL(v, ctx)}`
      )
    ];
    groupStatement.push(`USING\n${combinedBlock.join(",\n")}`);

    let by = renderGroupingSet(groupingSet).trim();
    if (by[0] === "(" && by[by.length - 1] === ")") {
      by = by.slice(1, by.length - 1);
    }
    groupStatement.push(`BY ` + by);

    // clause.push(withBlock.trim());

    // render scope var and any unscoped withVars in with block
    const selectTarget = `${groupTarget}_groups`;
    selectStatement.push(
      `WITH\n${[
        ...unscopedWithBlock,
        ...scopeExprVar
        // ...scopedWithBlock,
      ].join(",\n")},
  ${selectTarget} := (
${indent(groupStatement.join("\n"), 4)}
)`
    );

    // rename scope var to fix all scope references that
    // occur in the `elements` subshape
    const scopeVar = ctx.withVars.get(expr.__scope__ as any);

    // replace references to __scope__ with
    // .elements reference
    const elementsShapeQuery = indent(
      shapeToEdgeQL(elementsShape as object, {...ctx}, expr.__element__),
      2
    )
      .trim()
      .split(scopeVar!.name + ".")
      .join(`${selectTarget}.elements.`);

    selectStatement.push(`SELECT ${selectTarget} {
  key: {${groupingSet.__exprs__.map(e => e[0]).join(", ")}},
  grouping,
  elements: ${elementsShapeQuery}
}`);
    return `(${selectStatement.join("\n")})`;
  } else if (expr.__kind__ === ExpressionKind.Function) {
    const args = expr.__args__.map(arg => `${renderEdgeQL(arg!, ctx, false)}`);
    for (const [key, arg] of Object.entries(expr.__namedargs__)) {
      args.push(`${q(key)} := ${renderEdgeQL(arg, ctx, false)}`);
    }
    return `${expr.__name__}(${args.join(", ")})`;
  } else if (expr.__kind__ === ExpressionKind.Operator) {
    const operator = expr.__name__;
    const args = expr.__args__;
    switch (expr.__opkind__) {
      case OperatorKind.Infix:
        if (operator === "[]") {
          let index = "";
          if (Array.isArray(args[1])) {
            const [start, end] = args[1];
            if (start) {
              index += renderEdgeQL(start, ctx);
            }
            index += ":";
            if (end) {
              index += renderEdgeQL(end, ctx);
            }
          } else {
            index = renderEdgeQL(args[1], ctx);
          }

          return `${renderEdgeQL(args[0], ctx)}[${index}]`;
        }
        return `(${renderEdgeQL(args[0], ctx)} ${operator} ${renderEdgeQL(
          args[1],
          ctx
        )})`;
      case OperatorKind.Postfix:
        return `(${renderEdgeQL(args[0], ctx)} ${operator})`;
      case OperatorKind.Prefix:
        return `(${operator} ${renderEdgeQL(args[0], ctx)})`;
      case OperatorKind.Ternary:
        if (operator === "if_else") {
          return `(${renderEdgeQL(args[0], ctx)} IF ${renderEdgeQL(
            args[1],
            ctx
          )} ELSE ${renderEdgeQL(args[2], ctx)})`;
        } else {
          throw new Error(`Unknown operator: ${operator}`);
        }
      default:
        util.assertNever(
          expr.__opkind__,
          new Error(`Unknown operator kind: ${expr.__opkind__}`)
        );
    }
  } else if (expr.__kind__ === ExpressionKind.TypeIntersection) {
    return `${renderEdgeQL(expr.__expr__, ctx)}[IS ${
      expr.__element__.__name__
    }]`;
  } else if (expr.__kind__ === ExpressionKind.For) {
    ctx.forVars.set(expr.__forVar__, `__forVar__${ctx.forVars.size}`);
    return `(${withBlock}FOR ${ctx.forVars.get(
      expr.__forVar__
    )} IN {${renderEdgeQL(expr.__iterSet__, ctx)}}
UNION (\n${indent(renderEdgeQL(expr.__expr__, ctx), 2)}\n))`;
  } else if (expr.__kind__ === ExpressionKind.ForVar) {
    const forVar = ctx.forVars.get(expr);
    if (!forVar) {
      throw new Error(`'FOR' loop variable used outside of 'FOR' loop`);
    }
    return forVar;
  } else if (expr.__kind__ === ExpressionKind.Param) {
    return `__param__${expr.__name__}`;
  } else if (expr.__kind__ === ExpressionKind.Detached) {
    return `(DETACHED ${renderEdgeQL(
      expr.__expr__,
      {
        ...ctx,
        renderWithVar: expr.__expr__ as any
      },
      undefined,
      true
    )})`;
  } else if (expr.__kind__ === ExpressionKind.Global) {
    return `(GLOBAL ${expr.__name__})`;
  } else {
    util.assertNever(
      expr,
      new Error(`Unrecognized expression kind: "${(expr as any).__kind__}"`)
    );
  }
}

function isGroupingSet(arg: any): arg is GroupingSet {
  return arg.__kind__ === "groupingset";
}

// recursive renderer
function renderGroupingSet(set: GroupingSet): string {
  const contents = Object.entries(set.__elements__)
    .map(([k, v]) => {
      return isGroupingSet(v) ? renderGroupingSet(v) : k;
    })
    .join(", ");
  if (set.__settype__ === "tuple") {
    return `(${contents})`;
  } else if (set.__settype__ === "set") {
    return `{${contents}}`;
  } else if (set.__settype__ === "cube") {
    return `cube(${contents})`;
  } else if (set.__settype__ === "rollup") {
    return `rollup(${contents})`;
  } else {
    throw new Error(`Unrecognized set type: "${set.__settype__}"`);
  }
}

function shapeToEdgeQL(
  shape: object | null,
  ctx: RenderCtx,
  type: ObjectType | null = null,
  keysOnly: boolean = false,
  injectImplicitId: boolean = true
) {
  const pointers = type?.__pointers__ || null;
  const isFreeObject = type?.__name__ === "std::FreeObject";
  if (shape === null) {
    return ``;
  }

  const lines: string[] = [];
  const addLine = (line: string) =>
    lines.push(`${keysOnly ? "" : "  "}${line}`);

  const seen = new Set();

  for (const key in shape) {
    if (!shape.hasOwnProperty(key)) continue;
    if (seen.has(key)) {
      // tslint:disable-next-line
      console.warn(`Invalid: duplicate key "${key}"`);
      continue;
    }
    seen.add(key);
    let val = (shape as any)[key];
    let operator = ":=";
    let polyType: SomeExpression | null = null;

    if (typeof val === "object" && !val.__element__) {
      if (!!val["+="]) {
        operator = "+=";
        val = val["+="];
      } else if (!!val["-="]) {
        operator = "-=";
        val = val["-="];
      }
    }
    if (val.__kind__ === ExpressionKind.PolyShapeElement) {
      polyType = val.__polyType__;
      val = val.__shapeElement__;
    }
    const polyIntersection = polyType
      ? `[IS ${polyType.__element__.__name__}].`
      : "";

    // For computed properties in select shapes, inject the expected
    // cardinality inferred by the query builder. This ensures the actual
    // type returned by the server matches the inferred return type, or an
    // explicit error is thrown, instead of a silent mismatch between
    // actual and inferred type.
    // Add annotations on FreeObjects, despite the existence of a pointer.
    const ptr = pointers?.[key];
    const addCardinalityAnnotations = pointers && (!ptr || isFreeObject);

    const expectedCardinality =
      addCardinalityAnnotations && val.hasOwnProperty("__cardinality__")
        ? val.__cardinality__ === Cardinality.Many ||
          val.__cardinality__ === Cardinality.AtLeastOne
          ? "multi "
          : "single "
        : "";

    // if selecting a required multi link, wrap expr in 'assert_exists'
    const wrapAssertExists = ptr?.cardinality === Cardinality.AtLeastOne;

    if (typeof val === "boolean") {
      if (
        !pointers?.[key] &&
        key[0] !== "@" &&
        type &&
        type?.__name__ !== "std::FreeObject" &&
        !polyIntersection
      ) {
        throw new Error(`Field "${key}" does not exist in ${type?.__name__}`);
      }
      if (val) {
        addLine(`${polyIntersection}${q(key)}`);
      }
      continue;
    }

    if (typeof val !== "object") {
      throw new Error(`Invalid shape element at "${key}".`);
    }

    const valIsExpression = val.hasOwnProperty("__kind__");

    // is subshape
    if (!valIsExpression) {
      addLine(
        `${polyIntersection}${q(key, false)}: ${indent(
          shapeToEdgeQL(val, ctx, ptr?.target),
          2
        ).trim()}`
      );
      continue;
    }

    // val is expression

    // is computed
    if (keysOnly) {
      addLine(
        q(key, false) +
          (isObjectType(val.__element__)
            ? `: ${shapeToEdgeQL(val.__element__.__shape__, ctx, null, true)}`
            : "")
      );
      continue;
    }
    const renderedExpr = renderEdgeQL(val, ctx);

    addLine(
      `${expectedCardinality}${q(key, false)} ${operator} ${
        wrapAssertExists ? "assert_exists(" : ""
      }${
        renderedExpr.includes("\n")
          ? `(\n${indent(
              renderedExpr[0] === "(" &&
                renderedExpr[renderedExpr.length - 1] === ")"
                ? renderedExpr.slice(1, -1)
                : renderedExpr,
              4
            )}\n  )`
          : renderedExpr
      }${wrapAssertExists ? ")" : ""}`
    );
  }

  if (lines.length === 0 && injectImplicitId) {
    addLine("id");
  }
  return keysOnly ? `{${lines.join(", ")}}` : `{\n${lines.join(",\n")}\n}`;
}

function topoSortWithVars(
  vars: Set<SomeExpression>,
  ctx: RenderCtx
): SomeExpression[] {
  if (!vars.size) {
    return [];
  }

  const sorted: SomeExpression[] = [];

  const unvisited = new Set(vars);
  const visiting = new Set<SomeExpression>();

  for (const withVar of unvisited) {
    visit(withVar);
  }

  function visit(withVar: SomeExpression): void {
    if (!unvisited.has(withVar)) {
      return;
    }
    if (visiting.has(withVar)) {
      throw new Error(`'WITH' variables contain a cyclic dependency`);
    }

    visiting.add(withVar);

    for (const child of ctx.withVars.get(withVar)!.childExprs) {
      if (vars.has(child)) {
        visit(child);
      }
    }

    visiting.delete(withVar);
    unvisited.delete(withVar);

    sorted.push(withVar);
  }
  return sorted;
}

const numericalTypes: Record<string, boolean> = {
  "std::number": true,
  "std::int16": true,
  "std::int32": true,
  "std::int64": true,
  "std::float32": true,
  "std::float64": true
};

function literalToEdgeQL(type: BaseType, val: any): string {
  let skipCast = false;
  let stringRep;
  if (type.__name__ === "std::json") {
    skipCast = true;
    stringRep = `to_json($$${JSON.stringify(val)}$$)`;
  } else if (typeof val === "string") {
    if (numericalTypes[type.__name__]) {
      skipCast = true;
      stringRep = val;
    } else if (type.__kind__ === TypeKind.enum) {
      skipCast = true;
      const vals = (type as EnumType).__values__;
      if (vals.includes(val)) {
        skipCast = true;
        if (val.includes(" ")) {
          stringRep = `<${type.__name__}>"${val}"`;
        } else {
          stringRep = `${type.__name__}.${val}`;
        }
      } else {
        throw new Error(
          `Invalid value for type ${type.__name__}: ${JSON.stringify(val)}`
        );
      }
    } else {
      if (type.__name__ === "std::str") {
        skipCast = true;
      }
      stringRep = JSON.stringify(val);
    }
  } else if (typeof val === "number") {
    if (numericalTypes[type.__name__]) {
      skipCast = true;
    } else {
      throw new Error(`Unknown numerical type: ${type.__name__}!`);
    }
    stringRep = `${val.toString()}`;
  } else if (typeof val === "boolean") {
    stringRep = `${val.toString()}`;
    skipCast = true;
  } else if (typeof val === "bigint") {
    stringRep = `${val.toString()}n`;
  } else if (Array.isArray(val)) {
    skipCast = val.length !== 0;
    if (isArrayType(type)) {
      stringRep = `[${val
        .map(el => literalToEdgeQL(type.__element__ as any, el))
        .join(", ")}]`;
    } else if (isTupleType(type)) {
      stringRep = `( ${val
        .map((el, j) => literalToEdgeQL(type.__items__[j] as any, el))
        .join(", ")}${type.__items__.length === 1 ? "," : ""} )`;
    } else {
      throw new Error(
        `Invalid value for type ${type.__name__}: ${JSON.stringify(val)}`
      );
    }
  } else if (val instanceof Date) {
    stringRep = `'${val.toISOString()}'`;
  } else if (
    val instanceof LocalDate ||
    val instanceof LocalDateTime ||
    val instanceof LocalTime ||
    val instanceof Duration ||
    val instanceof RelativeDuration ||
    val instanceof DateDuration
  ) {
    stringRep = `'${val.toString()}'`;
  } else if (val instanceof Uint8Array) {
    stringRep = bufferToStringRep(val);
    skipCast = true;
  } else if (val instanceof Range) {
    const elType = (type as RangeType).__element__;

    // actual type will be inferred from
    // defined value
    const elTypeName =
      elType.__name__ === "std::number" ? "std::int64" : elType.__name__;

    return `std::range(${
      val.lower === null
        ? `<${elTypeName}>{}`
        : literalToEdgeQL(elType, val.lower)
    }, ${
      val.upper === null
        ? `<${elTypeName}>{}`
        : literalToEdgeQL(elType, val.upper)
    }, inc_lower := ${val.incLower}, inc_upper := ${val.incUpper})`;
  } else if (typeof val === "object") {
    if (isNamedTupleType(type)) {
      stringRep = `( ${Object.entries(val).map(
        ([key, value]) =>
          `${key} := ${literalToEdgeQL(type.__shape__[key], value)}`
      )} )`;
      skipCast = true;
    } else {
      throw new Error(
        `Invalid value for type ${type.__name__}: ${JSON.stringify(val)}`
      );
    }
  } else {
    throw new Error(
      `Invalid value for type ${type.__name__}: ${JSON.stringify(val)}`
    );
  }
  if (skipCast) {
    return stringRep;
  }
  return `<${type.__name__}>${stringRep}`;
}

function indent(str: string, depth: number) {
  return str
    .split("\n")
    .map(line => " ".repeat(depth) + line)
    .join("\n");
}

// backtick quote identifiers if needed
// https://github.com/edgedb/edgedb/blob/master/edb/edgeql/quote.py
function q(ident: string, allowBacklinks: boolean = true): string {
  if (
    !ident ||
    ident.startsWith("@") ||
    (allowBacklinks && (ident.startsWith("<") || ident.includes("::")))
  ) {
    return ident;
  }

  const isAlphaNum = /^([^\W\d]\w*|([1-9]\d*|0))$/.test(ident);
  if (isAlphaNum) {
    const lident = ident.toLowerCase();
    const isReserved =
      lident !== "__type__" &&
      lident !== "__std__" &&
      reservedKeywords.includes(lident);

    if (!isReserved) {
      return ident;
    }
  }

  return "`" + ident.replace(/`/g, "``") + "`";
}

function bufferToStringRep(buf: Uint8Array): string {
  let stringRep = "";
  for (const byte of buf) {
    if (byte < 32 || byte > 126) {
      // non printable ascii
      switch (byte) {
        case 8:
          stringRep += "\\b";
          break;
        case 9:
          stringRep += "\\t";
          break;
        case 10:
          stringRep += "\\n";
          break;
        case 12:
          stringRep += "\\f";
          break;
        case 13:
          stringRep += "\\r";
          break;
        default:
          stringRep += `\\x${byte.toString(16).padStart(2, "0")}`;
      }
    } else {
      stringRep +=
        (byte === 39 || byte === 92 ? "\\" : "") + String.fromCharCode(byte);
    }
  }
  return `b'${stringRep}'`;
}

function getErrorHint(expr: any): string {
  let literalConstructor: string | null = null;
  switch (typeof expr) {
    case "string":
      literalConstructor = "e.str()";
      break;
    case "number":
      literalConstructor = Number.isInteger(expr)
        ? "e.int64()"
        : "e.float64()";
      break;
    case "bigint":
      literalConstructor = "e.bigint()";
      break;
    case "boolean":
      literalConstructor = "e.bool()";
      break;
  }
  switch (true) {
    case expr instanceof Date:
      literalConstructor = "e.datetime()";
      break;
    case expr instanceof Duration:
      literalConstructor = "e.duration()";
      break;
    case expr instanceof LocalDate:
      literalConstructor = "e.cal.local_date()";
      break;
    case expr instanceof LocalDateTime:
      literalConstructor = "e.cal.local_datetime()";
      break;
    case expr instanceof LocalTime:
      literalConstructor = "e.cal.local_time()";
      break;
    case expr instanceof RelativeDuration:
      literalConstructor = "e.cal.relative_duration()";
      break;
    case expr instanceof DateDuration:
      literalConstructor = "e.cal.date_duration()";
      break;
  }

  return literalConstructor
    ? `\nHint: Maybe you meant to wrap the value in ` +
        `a '${literalConstructor}' expression?`
    : "";
}
