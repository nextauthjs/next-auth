import type { Executor } from "edgedb";
import { ExpressionKind, Cardinality } from "edgedb/dist/reflection/index";
import type { Expression, ParamType, setToTsType, TypeSet, BaseTypeToTsType } from "./typesystem";
export declare type $expr_OptionalParam<Type extends ParamType = ParamType> = {
    __kind__: ExpressionKind.OptionalParam;
    __type__: Type;
};
export declare function optional<Type extends ParamType>(type: Type): $expr_OptionalParam<Type>;
export declare type QueryableWithParamsExpression<Set extends TypeSet = TypeSet, Params extends {
    [key: string]: ParamType | $expr_OptionalParam;
} = {}> = Expression<Set, false> & {
    run(cxn: Executor, args: paramsToParamArgs<Params>): Promise<setToTsType<Set>>;
    runJSON(cxn: Executor, args: paramsToParamArgs<Params>): Promise<string>;
};
export declare type $expr_WithParams<Params extends {
    [key: string]: ParamType | $expr_OptionalParam;
} = {}, Expr extends TypeSet = TypeSet> = QueryableWithParamsExpression<{
    __kind__: ExpressionKind.WithParams;
    __element__: Expr["__element__"];
    __cardinality__: Expr["__cardinality__"];
    __expr__: Expr;
    __params__: $expr_Param[];
}, Params>;
declare type paramsToParamArgs<Params extends {
    [key: string]: ParamType | $expr_OptionalParam;
}> = {
    [key in keyof Params as Params[key] extends ParamType ? key : never]: Params[key] extends ParamType ? Readonly<BaseTypeToTsType<Params[key]>> : never;
} & {
    [key in keyof Params as Params[key] extends $expr_OptionalParam ? key : never]?: Params[key] extends $expr_OptionalParam ? Readonly<BaseTypeToTsType<Params[key]["__type__"]> | null> : never;
};
export declare type $expr_Param<Name extends string | number | symbol = string, Type extends ParamType = ParamType, Optional extends boolean = boolean> = Expression<{
    __kind__: ExpressionKind.Param;
    __element__: Type;
    __cardinality__: Optional extends true ? Cardinality.AtMostOne : Cardinality.One;
    __name__: Name;
    __isComplex__: boolean;
}>;
declare type paramsToParamExprs<Params extends {
    [key: string]: ParamType | $expr_OptionalParam;
}> = {
    [key in keyof Params]: Params[key] extends $expr_OptionalParam ? $expr_Param<key, Params[key]["__type__"], true> : Params[key] extends ParamType ? $expr_Param<key, Params[key], false> : never;
};
export declare function params<Params extends {
    [key: string]: ParamType | $expr_OptionalParam;
} = {}, Expr extends Expression = Expression>(paramsDef: Params, expr: (params: paramsToParamExprs<Params>) => Expr): $expr_WithParams<Params, Expr>;
export {};
