import { Cardinality } from "edgedb/dist/reflection/index";
import type { TypeSet } from "./typesystem";
export declare namespace cardutil {
    export type multiplyCardinalities<C1 extends Cardinality, C2 extends Cardinality> = C1 extends Cardinality.Empty ? Cardinality.Empty : C1 extends Cardinality.One ? C2 : C1 extends Cardinality.AtMostOne ? C2 extends Cardinality.One ? Cardinality.AtMostOne : C2 extends Cardinality.AtLeastOne ? Cardinality.Many : C2 : C1 extends Cardinality.Many ? C2 extends Cardinality.Empty ? Cardinality.Empty : Cardinality.Many : C1 extends Cardinality.AtLeastOne ? C2 extends Cardinality.AtMostOne ? Cardinality.Many : C2 extends Cardinality.One ? Cardinality.AtLeastOne : C2 : never;
    export function multiplyCardinalities(c1: Cardinality, c2: Cardinality): Cardinality;
    type _multiplyCardinalitiesVariadic<Cards extends [Cardinality, ...Cardinality[]]> = Cards extends [infer Card] ? Card : Cards extends [infer A, infer B, ...infer Rest] ? A extends Cardinality ? B extends Cardinality ? Rest extends Cardinality[] ? multiplyCardinalities<A, B> extends Cardinality ? _multiplyCardinalitiesVariadic<[
        multiplyCardinalities<A, B>,
        ...Rest
    ]> : never : never : never : never : never;
    export type multiplyCardinalitiesVariadic<Cards extends [Cardinality, ...Cardinality[]]> = _multiplyCardinalitiesVariadic<Cards> extends Cardinality ? _multiplyCardinalitiesVariadic<Cards> : never;
    export function multiplyCardinalitiesVariadic<Cards extends [Cardinality, ...Cardinality[]]>(cards: Cards): multiplyCardinalitiesVariadic<Cards>;
    export type mergeCardinalities<A extends Cardinality, B extends Cardinality> = A extends Cardinality.Empty ? B : B extends Cardinality.Empty ? A : A extends Cardinality.AtLeastOne ? Cardinality.AtLeastOne : B extends Cardinality.AtLeastOne ? Cardinality.AtLeastOne : A extends Cardinality.One ? Cardinality.AtLeastOne : B extends Cardinality.One ? Cardinality.AtLeastOne : Cardinality.Many;
    export function mergeCardinalities<A extends Cardinality, B extends Cardinality>(a: A, b: B): mergeCardinalities<A, B>;
    type _mergeCardinalitiesVariadic<Cards extends [Cardinality, ...Cardinality[]]> = Cards extends [infer Card] ? Card : Cards extends [infer A, infer B, ...infer Rest] ? A extends Cardinality ? B extends Cardinality ? Rest extends Cardinality[] ? mergeCardinalities<A, B> extends Cardinality ? _mergeCardinalitiesVariadic<[mergeCardinalities<A, B>, ...Rest]> : never : never : never : never : never;
    export type mergeCardinalitiesVariadic<Cards extends [Cardinality, ...Cardinality[]]> = _mergeCardinalitiesVariadic<Cards> extends Cardinality ? _mergeCardinalitiesVariadic<Cards> : never;
    export function mergeCardinalitiesVariadic<Cards extends [Cardinality, ...Cardinality[]]>(cards: Cards): mergeCardinalitiesVariadic<Cards>;
    export type orCardinalities<C1 extends Cardinality, C2 extends Cardinality> = C1 extends C2 ? C1 : C1 extends Cardinality.Many ? C1 : C1 extends Cardinality.AtMostOne ? C2 extends Cardinality.Many ? C2 : C2 extends Cardinality.AtLeastOne ? Cardinality.Many : C1 : C1 extends Cardinality.AtLeastOne ? C2 extends Cardinality.One ? Cardinality.AtLeastOne : Cardinality.Many : C1 extends Cardinality.Empty ? C2 extends Cardinality.AtMostOne ? Cardinality.AtMostOne : C2 extends Cardinality.One ? Cardinality.AtMostOne : Cardinality.Many : C2 extends Cardinality.Empty ? Cardinality.AtMostOne : C2;
    export function orCardinalities(c1: Cardinality, c2: Cardinality): Cardinality;
    export type overrideLowerBound<C extends Cardinality, O extends "One" | "Zero"> = O extends "One" ? C extends Cardinality.Many ? Cardinality.AtLeastOne : C extends Cardinality.AtLeastOne ? Cardinality.AtLeastOne : Cardinality.One : C extends Cardinality.Empty ? Cardinality.Empty : C extends Cardinality.Many ? Cardinality.Many : C extends Cardinality.AtLeastOne ? Cardinality.Many : Cardinality.AtMostOne;
    export function overrideLowerBound<C extends Cardinality, O extends "One" | "Zero">(card: C, override: O): overrideLowerBound<C, O>;
    export type overrideUpperBound<C extends Cardinality, O extends "One" | "Many"> = O extends "One" ? C extends Cardinality.Many ? Cardinality.AtMostOne : C extends Cardinality.AtLeastOne ? Cardinality.One : C extends Cardinality.Empty ? Cardinality.AtMostOne : C : C extends Cardinality.One ? Cardinality.AtLeastOne : C extends Cardinality.AtMostOne ? Cardinality.Many : C extends Cardinality.Empty ? Cardinality.Many : C;
    export function overrideUpperBound<C extends Cardinality, O extends "One" | "Many">(card: C, override: O): overrideUpperBound<C, O>;
    export type paramCardinality<P> = [P] extends [TypeSet] ? [
        Cardinality
    ] extends [P["__cardinality__"]] ? Cardinality.One : P["__cardinality__"] : Cardinality.One;
    export type optionalParamCardinality<P> = overrideLowerBound<paramCardinality<P>, "One">;
    type _paramArrayCardinality<T> = {
        [K in keyof T]: T[K] extends TypeSet ? T[K]["__cardinality__"] : Cardinality.One;
    };
    export type paramArrayCardinality<T extends [any, ...any[]]> = multiplyCardinalitiesVariadic<_paramArrayCardinality<T>>;
    export type assignable<C extends Cardinality> = C extends Cardinality.Empty ? Cardinality.Empty : C extends Cardinality.One ? Cardinality.One : C extends Cardinality.AtMostOne ? Cardinality.One | Cardinality.AtMostOne | Cardinality.Empty : C extends Cardinality.AtLeastOne ? Cardinality.One | Cardinality.AtLeastOne | Cardinality.Many : C extends Cardinality.Many ? Cardinality : never;
    export {};
}
