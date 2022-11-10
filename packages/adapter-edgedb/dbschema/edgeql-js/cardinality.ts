import {Cardinality} from "edgedb/dist/reflection/index";
import type {TypeSet} from "./typesystem";

// Computing cardinality of path
// From base set cadinality and pointer cardinality
// Used in path expressions
// Cardinality  Empty  AtMostOne  One         Many  AtLeastOne
// Empty        0      0          0           0     0
// AtMostOne    0      AtMostOne  AtMostOne   Many  Many
// One          0      AtMostOne  One         Many  AtLeastOne
// Many         0      Many       Many        Many  Many
// AtLeastOne   0      Many       AtLeastOne  Many  AtLeastOne
export namespace cardutil {
  export type multiplyCardinalities<
    C1 extends Cardinality,
    C2 extends Cardinality
  > = C1 extends Cardinality.Empty
    ? Cardinality.Empty
    : C1 extends Cardinality.One
    ? C2
    : C1 extends Cardinality.AtMostOne
    ? C2 extends Cardinality.One
      ? Cardinality.AtMostOne
      : C2 extends Cardinality.AtLeastOne
      ? Cardinality.Many
      : C2
    : C1 extends Cardinality.Many
    ? C2 extends Cardinality.Empty
      ? Cardinality.Empty
      : Cardinality.Many
    : C1 extends Cardinality.AtLeastOne
    ? C2 extends Cardinality.AtMostOne
      ? Cardinality.Many
      : C2 extends Cardinality.One
      ? Cardinality.AtLeastOne
      : C2
    : never;

  export function multiplyCardinalities(
    c1: Cardinality,
    c2: Cardinality
  ): Cardinality {
    if (c1 === Cardinality.Empty) return Cardinality.Empty;

    if (c1 === Cardinality.One) return c2;
    if (c1 === Cardinality.AtMostOne) {
      if (c2 === Cardinality.One) return Cardinality.AtMostOne;
      if (c2 === Cardinality.AtLeastOne) return Cardinality.Many;
      return c2;
    }
    if (c1 === Cardinality.Many) {
      if (c2 === Cardinality.Empty) return Cardinality.Empty;
      return Cardinality.Many;
    }
    if (c1 === Cardinality.AtLeastOne) {
      if (c2 === Cardinality.AtMostOne) return Cardinality.Many;
      if (c2 === Cardinality.One) return Cardinality.AtLeastOne;
      return c2;
    }
    throw new Error(`Invalid Cardinality ${c1}`);
  }

  type _multiplyCardinalitiesVariadic<
    Cards extends [Cardinality, ...Cardinality[]]
  > = Cards extends [infer Card]
    ? Card
    : Cards extends [infer A, infer B, ...infer Rest]
    ? A extends Cardinality
      ? B extends Cardinality
        ? Rest extends Cardinality[]
          ? multiplyCardinalities<A, B> extends Cardinality
            ? _multiplyCardinalitiesVariadic<
                [multiplyCardinalities<A, B>, ...Rest]
              >
            : never
          : never
        : never
      : never
    : never;

  export type multiplyCardinalitiesVariadic<
    Cards extends [Cardinality, ...Cardinality[]]
  > = _multiplyCardinalitiesVariadic<Cards> extends Cardinality
    ? _multiplyCardinalitiesVariadic<Cards>
    : never;

  export function multiplyCardinalitiesVariadic<
    Cards extends [Cardinality, ...Cardinality[]]
  >(cards: Cards): multiplyCardinalitiesVariadic<Cards> {
    if (cards.length === 0) throw new Error("Empty tuple not allowed");
    if (cards.length === 1) return cards[0] as any;
    return cards.reduce(
      (product, card) => multiplyCardinalities(product, card),
      Cardinality.One
    ) as any;
  }

  // Merging two sets
  // Used in set constructor
  // Cardinality  Empty       AtMostOne  One         Many        AtLeastOne
  // Empty        Empty       AtMostOne  One         Many        AtLeastOne
  // AtMostOne    AtMostOne   Many       AtLeastOne  Many        AtLeastOne
  // One          One         AtLeastOne AtLeastOne  AtLeastOne  AtLeastOne
  // Many         Many        Many       AtLeastOne  Many        AtLeastOne
  // AtLeastOne   AtLeastOne  AtLeastOne AtLeastOne  AtLeastOne  AtLeastOne

  export type mergeCardinalities<
    A extends Cardinality,
    B extends Cardinality
  > = A extends Cardinality.Empty
    ? B
    : B extends Cardinality.Empty
    ? A
    : A extends Cardinality.AtLeastOne
    ? Cardinality.AtLeastOne
    : B extends Cardinality.AtLeastOne
    ? Cardinality.AtLeastOne
    : A extends Cardinality.One
    ? Cardinality.AtLeastOne
    : B extends Cardinality.One
    ? Cardinality.AtLeastOne
    : Cardinality.Many;

  export function mergeCardinalities<
    A extends Cardinality,
    B extends Cardinality
  >(a: A, b: B): mergeCardinalities<A, B> {
    if (a === Cardinality.Empty) return b as any;
    if (b === Cardinality.Empty) return a as any;
    if (a === Cardinality.AtLeastOne) return Cardinality.AtLeastOne as any;
    if (b === Cardinality.AtLeastOne) return Cardinality.AtLeastOne as any;
    if (a === Cardinality.One) return Cardinality.AtLeastOne as any;
    if (b === Cardinality.One) return Cardinality.AtLeastOne as any;
    return Cardinality.Many as any;
  }

  type _mergeCardinalitiesVariadic<
    Cards extends [Cardinality, ...Cardinality[]]
  > = Cards extends [infer Card]
    ? Card
    : Cards extends [infer A, infer B, ...infer Rest]
    ? A extends Cardinality
      ? B extends Cardinality
        ? Rest extends Cardinality[]
          ? mergeCardinalities<A, B> extends Cardinality
            ? _mergeCardinalitiesVariadic<[mergeCardinalities<A, B>, ...Rest]>
            : never
          : never
        : never
      : never
    : never;

  export type mergeCardinalitiesVariadic<
    Cards extends [Cardinality, ...Cardinality[]]
  > = _mergeCardinalitiesVariadic<Cards> extends Cardinality
    ? _mergeCardinalitiesVariadic<Cards>
    : never;
  export function mergeCardinalitiesVariadic<
    Cards extends [Cardinality, ...Cardinality[]]
  >(cards: Cards): mergeCardinalitiesVariadic<Cards> {
    if (cards.length === 0) throw new Error("Empty tuple not allowed");
    if (cards.length === 1) return cards[0] as any;
    const [first, second, ...rest] = cards;
    if (cards.length === 2) return mergeCardinalities(first, second) as any;
    return mergeCardinalitiesVariadic([
      mergeCardinalities(first, second),
      ...rest
    ]);
  }

  // 'or' cardinalities together
  // used in the IF ELSE operator, for expr (a IF bool ELSE b)
  // result cardinality is 'a' cardinality *or* 'b' cardinality
  // Cardinality  Empty       AtMostOne   One         Many        AtLeastOne
  // Empty        0           AtMostOne   AtMostOne   Many        Many
  // AtMostOne    AtMostOne   AtMostOne   AtMostOne   Many        Many
  // One          AtMostOne   AtMostOne   One         Many        AtLeastOne
  // Many         Many        Many        Many        Many        Many
  // AtLeastOne   Many        Many        AtLeastOne  Many        AtLeastOne

  export type orCardinalities<
    C1 extends Cardinality,
    C2 extends Cardinality
  > = C1 extends C2
    ? C1
    : C1 extends Cardinality.Many
    ? C1
    : C1 extends Cardinality.AtMostOne
    ? C2 extends Cardinality.Many
      ? C2
      : C2 extends Cardinality.AtLeastOne
      ? Cardinality.Many
      : C1
    : C1 extends Cardinality.AtLeastOne
    ? C2 extends Cardinality.One
      ? Cardinality.AtLeastOne
      : Cardinality.Many
    : C1 extends Cardinality.Empty
    ? C2 extends Cardinality.AtMostOne
      ? Cardinality.AtMostOne
      : C2 extends Cardinality.One
      ? Cardinality.AtMostOne
      : Cardinality.Many
    : C2 extends Cardinality.Empty
    ? Cardinality.AtMostOne
    : C2;

  export function orCardinalities(
    c1: Cardinality,
    c2: Cardinality
  ): Cardinality {
    if (c1 === c2 || c1 === Cardinality.Many) return c1;
    if (c1 === Cardinality.AtLeastOne) {
      if (c2 === Cardinality.One) return Cardinality.AtLeastOne;
      return Cardinality.Many;
    }
    if (c1 === Cardinality.AtMostOne) {
      if (c2 === Cardinality.Many || c2 === Cardinality.AtLeastOne) {
        return Cardinality.Many;
      }
      return c1;
    }
    if (c1 === Cardinality.Empty) {
      if (c2 === Cardinality.AtMostOne || c2 === Cardinality.One) {
        return Cardinality.AtMostOne;
      }
      return Cardinality.Many;
    }
    if (c2 === Cardinality.Empty) return Cardinality.AtMostOne;
    return c2;
  }

  //          Empty  AtMostOne  One         Many        AtLeastOne
  // One      One    One        One         AtLeastOne  AtLeastOne
  // Zero     0      AtMostOne  AtMostOne   Many        Many

  export type overrideLowerBound<
    C extends Cardinality,
    O extends "One" | "Zero"
  > = O extends "One"
    ? C extends Cardinality.Many
      ? Cardinality.AtLeastOne
      : C extends Cardinality.AtLeastOne
      ? Cardinality.AtLeastOne
      : Cardinality.One
    : C extends Cardinality.Empty
    ? Cardinality.Empty
    : C extends Cardinality.Many
    ? Cardinality.Many
    : C extends Cardinality.AtLeastOne
    ? Cardinality.Many
    : Cardinality.AtMostOne;

  export function overrideLowerBound<
    C extends Cardinality,
    O extends "One" | "Zero"
  >(card: C, override: O): overrideLowerBound<C, O> {
    if (override === "One") {
      if (card === Cardinality.Many || card === Cardinality.AtLeastOne) {
        return Cardinality.AtLeastOne as any;
      } else {
        return Cardinality.One as any;
      }
    } else {
      if (card === Cardinality.Many || card === Cardinality.AtLeastOne) {
        return Cardinality.Many as any;
      } else if (card === Cardinality.Empty) {
        return Cardinality.Empty as any;
      } else {
        return Cardinality.AtMostOne as any;
      }
    }
  }

  //          Empty      AtMostOne  One         Many        AtLeastOne
  // One      AtMostOne  AtMostOne  One         AtMostOne   One
  // Many     Many       Many       AtLeastOne  Many        AtLeastOne

  export type overrideUpperBound<
    C extends Cardinality,
    O extends "One" | "Many"
  > = O extends "One"
    ? C extends Cardinality.Many
      ? Cardinality.AtMostOne
      : C extends Cardinality.AtLeastOne
      ? Cardinality.One
      : C extends Cardinality.Empty
      ? Cardinality.AtMostOne
      : C
    : C extends Cardinality.One
    ? Cardinality.AtLeastOne
    : C extends Cardinality.AtMostOne
    ? Cardinality.Many
    : C extends Cardinality.Empty
    ? Cardinality.Many
    : C;

  export function overrideUpperBound<
    C extends Cardinality,
    O extends "One" | "Many"
  >(card: C, override: O): overrideUpperBound<C, O> {
    if (override === "One") {
      if (card === Cardinality.One || card === Cardinality.AtLeastOne) {
        return Cardinality.One as any;
      } else {
        return Cardinality.AtMostOne as any;
      }
    } else {
      if (card === Cardinality.One || card === Cardinality.AtLeastOne) {
        return Cardinality.AtLeastOne as any;
      } else {
        return Cardinality.Many as any;
      }
    }
  }

  export type paramCardinality<P> = [P] extends [TypeSet]
    ? // default to one
      // fixes multiplyCardinalities bug for func with optional args
      [Cardinality] extends [P["__cardinality__"]]
      ? Cardinality.One
      : P["__cardinality__"]
    : Cardinality.One;

  export type optionalParamCardinality<P> = overrideLowerBound<
    paramCardinality<P>,
    "One"
  >;

  type _paramArrayCardinality<T> = {
    [K in keyof T]: T[K] extends TypeSet
      ? T[K]["__cardinality__"]
      : Cardinality.One;
  };

  export type paramArrayCardinality<T extends [any, ...any[]]> =
    multiplyCardinalitiesVariadic<_paramArrayCardinality<T>>;

  export type assignable<C extends Cardinality> = C extends Cardinality.Empty
    ? Cardinality.Empty
    : C extends Cardinality.One
    ? Cardinality.One
    : C extends Cardinality.AtMostOne
    ? Cardinality.One | Cardinality.AtMostOne | Cardinality.Empty
    : C extends Cardinality.AtLeastOne
    ? Cardinality.One | Cardinality.AtLeastOne | Cardinality.Many
    : C extends Cardinality.Many
    ? Cardinality
    : never;
}
