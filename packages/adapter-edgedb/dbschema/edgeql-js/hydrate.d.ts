import type { $ } from "edgedb";
import type { BaseType, ObjectType, ObjectTypePointers, TupleType } from "./typesystem";
import type { typeutil } from "edgedb/dist/reflection/index";
export declare function makeType<T extends BaseType>(spec: $.introspect.Types, id: string, literal: any, anytype?: BaseType): T;
export declare type mergeObjectShapes<A extends ObjectTypePointers, B extends ObjectTypePointers> = typeutil.flatten<{
    [k in keyof A & keyof B]: A[k] extends B[k] ? B[k] extends A[k] ? A[k] : never : never;
}>;
export declare type mergeObjectTypes<A extends ObjectType | undefined, B extends ObjectType | undefined> = A extends ObjectType ? B extends ObjectType ? ObjectType<`${A["__name__"]} UNION ${B["__name__"]}`, mergeObjectShapes<A["__pointers__"], B["__pointers__"]>, null> : A : B extends ObjectType ? B : undefined;
export declare function $mergeObjectTypes<A extends ObjectType, B extends ObjectType>(a: A, b: B): mergeObjectTypes<A, B>;
export declare function $mergeTupleTypes<A extends TupleType, B extends TupleType>(a: A, b: B): TupleType;
