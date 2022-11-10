import {Cardinality, introspect, TypeKind} from "edgedb/dist/reflection/index";
import {cardutil} from "./cardinality";
import {makeType} from "./hydrate";
import type {
  BaseType,
  BaseTypeSet,
  ArrayType,
  ObjectType,
  TypeSet,
  RangeType,
  Expression
} from "./typesystem";
import {cast} from "./cast";
import {isImplicitlyCastableTo, literalToTypeSet} from "./castMaps";
import {literal} from "./literal";

import type {ExpressionKind, OperatorKind} from "edgedb/dist/reflection/index";

export type $expr_Function<
  // Name extends string = string,
  // Args extends (BaseTypeSet | undefined)[] = (BaseTypeSet | undefined)[],
  // NamedArgs extends {[key: string]: BaseTypeSet} = {
  //   [key: string]: BaseTypeSet;
  // },
  // ReturnType extends BaseTypeSet = BaseTypeSet,
  El extends BaseType = BaseType,
  Card extends Cardinality = Cardinality
> = Expression<{
  __element__: El;
  __cardinality__: Card;
  __kind__: ExpressionKind.Function;
  __name__: string;
  __args__: (BaseTypeSet | undefined)[];
  __namedargs__: {[key: string]: BaseTypeSet};
}>;

export type $expr_Operator<
  // Name extends string = string,
  // OpKind extends OperatorKind = OperatorKind,
  // Args extends TypeSet[] = TypeSet[],
  // ReturnType extends TypeSet = TypeSet,
  El extends BaseType = BaseType,
  Card extends Cardinality = Cardinality
> = Expression<{
  __element__: El;
  __cardinality__: Card;
  __kind__: ExpressionKind.Operator;
  __name__: string;
  __opkind__: OperatorKind;
  __args__: TypeSet[];
}>;

interface OverloadFuncArgDef {
  typeId: string;
  optional?: boolean;
  setoftype?: boolean;
  variadic?: boolean;
}

interface OverloadFuncDef {
  kind?: string;
  args: OverloadFuncArgDef[];
  namedArgs?: {[key: string]: OverloadFuncArgDef};
  returnTypeId: string;
  returnTypemod?: "SetOfType" | "OptionalType";
  preservesOptionality?: boolean;
}

function mapLiteralToTypeSet(literals: any[]): TypeSet[];
function mapLiteralToTypeSet(literals: {[key: string]: any}): {
  [key: string]: TypeSet;
};
function mapLiteralToTypeSet(literals: any[] | {[key: string]: any}) {
  if (Array.isArray(literals)) {
    return literals.map(lit => (lit != null ? literalToTypeSet(lit) : lit));
  }
  const obj: {[key: string]: TypeSet} = {};
  for (const key of Object.keys(literals)) {
    obj[key] =
      literals[key] != null ? literalToTypeSet(literals[key]) : literals[key];
  }
  return obj;
}

export function $resolveOverload(
  funcName: string,
  args: any[],
  typeSpec: introspect.Types,
  funcDefs: OverloadFuncDef[]
) {
  const positionalArgs: (TypeSet | undefined)[] = [];
  let namedArgs: {[key: string]: TypeSet} | undefined;
  if (args.length) {
    if (args[0] !== undefined) {
      try {
        positionalArgs.push(literalToTypeSet(args[0]));
      } catch {
        // first arg is not a expr or literal type, so assume named args object
        namedArgs = mapLiteralToTypeSet(args[0] as object);
      }
    } else {
      positionalArgs.push(undefined);
    }
    positionalArgs.push(...mapLiteralToTypeSet(args.slice(1)));
  }

  for (const def of funcDefs) {
    const resolvedOverload = _tryOverload(
      funcName,
      positionalArgs,
      namedArgs,
      typeSpec,
      def
    );
    if (resolvedOverload !== null) {
      return resolvedOverload;
    }
  }

  throw new Error(
    `No function overload found for ${
      funcName.includes("::")
        ? `'e.${funcName.split("::")[1]}()'`
        : `operator '${funcName}'`
    } with args: ${args.map(arg => `${arg}`).join(", ")}`
  );
}

const ANYTYPE_ARG = Symbol();

function _tryOverload(
  funcName: string,
  args: (BaseTypeSet | undefined)[],
  namedArgs: {[key: string]: BaseTypeSet} | undefined,
  typeSpec: introspect.Types,
  funcDef: OverloadFuncDef
): {
  kind?: string;
  returnType: BaseType;
  cardinality: Cardinality;
  args: BaseTypeSet[];
  namedArgs: {[key: string]: BaseTypeSet};
} | null {
  if (
    (funcDef.namedArgs === undefined && namedArgs !== undefined) ||
    (namedArgs === undefined &&
      funcDef.namedArgs &&
      Object.values(funcDef.namedArgs).some(arg => !arg.optional))
  ) {
    return null;
  }

  const lastParamVariadic = funcDef.args[funcDef.args.length - 1]?.variadic;
  if (!lastParamVariadic && args.length > funcDef.args.length) {
    return null;
  }

  const paramCardinalities: [Cardinality, ...Cardinality[]] = [
    Cardinality.One
  ];

  if (namedArgs) {
    for (const [key, value] of Object.entries(namedArgs)) {
      const argDef = funcDef.namedArgs?.[key];
      if (
        !argDef ||
        !compareType(typeSpec, argDef.typeId, value.__element__).match
      ) {
        return null;
      }

      paramCardinalities.push(
        argDef.setoftype
          ? funcDef.preservesOptionality
            ? cardutil.overrideUpperBound(value.__cardinality__, "One")
            : Cardinality.One
          : argDef.optional
          ? cardutil.overrideLowerBound(value.__cardinality__, "One")
          : value.__cardinality__
      );
    }
  }

  let positionalArgs: BaseTypeSet[] = [];

  let returnAnytype: BaseType | undefined;
  let needsAnytypeReplacement = false;

  for (let i = 0; i < funcDef.args.length; i++) {
    const argDef = funcDef.args[i];
    const arg = args[i];

    if (arg === undefined) {
      if (!argDef.optional) {
        return null;
      }

      if (i < args.length) {
        // arg is explicitly undefined, inject empty set
        const argTypeName = typeSpec.get(argDef.typeId).name;
        if (
          argTypeName.includes("anytype") ||
          argTypeName.includes("std::anypoint")
        ) {
          if (!returnAnytype) {
            positionalArgs.push(ANYTYPE_ARG as any);
            needsAnytypeReplacement = true;
          } else {
            positionalArgs.push(cast(returnAnytype, null));
          }
        } else {
          const argType = makeType<any>(typeSpec, argDef.typeId, literal);
          positionalArgs.push(cast(argType, null));
        }
      }
    } else {
      const {match, anytype} = compareType(
        typeSpec,
        argDef.typeId,
        arg.__element__
      );

      if (!match) {
        return null;
      }
      if (!returnAnytype && anytype) {
        returnAnytype = anytype;
      }

      positionalArgs.push(
        ...(argDef.variadic ? (args.slice(i) as BaseTypeSet[]) : [arg])
      );
      if (argDef.setoftype) {
        paramCardinalities.push(
          funcDef.preservesOptionality
            ? cardutil.overrideUpperBound(arg.__cardinality__, "One")
            : Cardinality.One
        );
      } else {
        const card = argDef.variadic
          ? cardutil.multiplyCardinalitiesVariadic(
              (args.slice(i) as BaseTypeSet[]).map(
                el => el.__cardinality__
              ) as [Cardinality, ...Cardinality[]]
            )
          : arg.__cardinality__;

        paramCardinalities.push(
          argDef.optional ? cardutil.overrideLowerBound(card, "One") : card
        );
      }
    }
  }

  let cardinality: Cardinality;
  if (funcName === "if_else") {
    cardinality = cardutil.multiplyCardinalities(
      cardutil.orCardinalities(
        positionalArgs[0].__cardinality__,
        positionalArgs[2].__cardinality__
      ),
      positionalArgs[1].__cardinality__
    );
  } else if (funcName === "std::assert_exists") {
    cardinality = cardutil.overrideLowerBound(
      positionalArgs[0].__cardinality__,
      "One"
    );
  } else if (funcName === "union") {
    cardinality = cardutil.mergeCardinalities(
      positionalArgs[0].__cardinality__,
      positionalArgs[1].__cardinality__
    );
  } else if (funcName === "??") {
    cardinality = cardutil.orCardinalities(
      positionalArgs[0].__cardinality__,
      positionalArgs[1].__cardinality__
    );
  } else if (funcName === "distinct") {
    cardinality = positionalArgs[0].__cardinality__;
  } else {
    cardinality =
      funcDef.returnTypemod === "SetOfType"
        ? Cardinality.Many
        : cardutil.multiplyCardinalitiesVariadic(paramCardinalities);

    if (
      funcDef.returnTypemod === "OptionalType" &&
      !funcDef.preservesOptionality
    ) {
      cardinality = cardutil.overrideLowerBound(cardinality, "Zero");
    }
  }

  if (needsAnytypeReplacement) {
    if (!returnAnytype) {
      throw new Error(`could not resolve anytype for ${funcName}`);
    }
    positionalArgs = positionalArgs.map(arg =>
      (arg as any) === ANYTYPE_ARG ? cast(returnAnytype!, null) : arg
    );
  }

  return {
    kind: funcDef.kind,
    returnType: makeType(
      typeSpec,
      funcDef.returnTypeId,
      literal,
      returnAnytype
    ),
    cardinality,
    args: positionalArgs,
    namedArgs: namedArgs ?? {}
  };
}

const nameRemapping: {[key: string]: string} = {
  "std::int16": "std::number",
  "std::int32": "std::number",
  "std::int64": "std::number",
  "std::float32": "std::number",
  "std::float64": "std::number"
};
const descendantCache = new Map<string, string[]>();
function getDescendantNames(typeSpec: introspect.Types, typeId: string) {
  if (descendantCache.has(typeId)) {
    return descendantCache.get(typeId)!;
  }
  const descendants: string[] = [
    ...new Set(
      [...typeSpec.values()]
        .filter(
          type =>
            type.kind === "scalar" && type.bases.some(({id}) => id === typeId)
        )
        .flatMap(type =>
          type.is_abstract
            ? getDescendantNames(typeSpec, type.id)
            : [nameRemapping[type.name], type.name]
        )
    )
  ];
  descendantCache.set(typeId, descendants);
  return descendants;
}

function compareType(
  typeSpec: introspect.Types,
  typeId: string,
  arg: BaseType
): {match: boolean; anytype?: BaseType} {
  const type = typeSpec.get(typeId);

  if (type.name === "anytype") {
    return {match: true, anytype: arg};
  }

  if (type.name === "std::anypoint") {
    const descendants = getDescendantNames(typeSpec, typeId);
    if (descendants.includes(arg.__name__)) {
      return {match: true, anytype: arg};
    }
  }

  if (type.name === "std::anyenum") {
    return {match: arg.__kind__ === TypeKind.enum};
  }

  if (type.kind === "scalar") {
    arg = (arg as any).__casttype__ ?? arg;
    return {
      match:
        (arg.__kind__ === TypeKind.scalar || arg.__kind__ === TypeKind.enum) &&
        (arg.__name__ === type.name ||
          isImplicitlyCastableTo(arg.__name__, type.name))
    };
  }
  if (type.kind === "array") {
    if (arg.__kind__ === TypeKind.array) {
      return compareType(
        typeSpec,
        type.array_element_id,
        (arg as any as ArrayType).__element__ as BaseType
      );
    }
  }
  if (type.kind === "range") {
    if (arg.__kind__ === TypeKind.range) {
      return compareType(
        typeSpec,
        type.range_element_id,
        (arg as any as RangeType).__element__ as BaseType
      );
    }
  }
  if (type.kind === "object") {
    if (arg.__kind__ !== TypeKind.object) return {match: false};

    const objectArg = arg as ObjectType;
    let match = true;

    // shape comparison
    for (const ptr of type.pointers) {
      if (objectArg.__pointers__[ptr.name]) {
        const argPtr = objectArg.__pointers__[ptr.name];
        const ptrTarget = typeSpec.get(ptr.target_id);
        if (
          ptrTarget.name !== argPtr.target.__name__ ||
          ptr.card !== argPtr.cardinality
        ) {
          match = false;
        }
      }
    }

    return {
      match
    };
  }
  if (type.kind === "tuple") {
    const items =
      arg.__kind__ === TypeKind.tuple
        ? (arg as any).__items__
        : arg.__kind__ === TypeKind.namedtuple
        ? (arg as any).__shape__
        : null;
    if (items) {
      const keys = Object.keys(items);

      if (keys.length === type.tuple_elements.length) {
        let anytype: BaseType | undefined;
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== type.tuple_elements[i].name) {
            return {match: false};
          }
          const {match: m, anytype: a} = compareType(
            typeSpec,
            type.tuple_elements[i].target_id,
            (items as any)[keys[i]]
          );
          if (!m) {
            return {match: false};
          }
          if (a) anytype = a;
        }
        return {match: true, anytype};
      }
    }
  }

  return {match: false};
}
