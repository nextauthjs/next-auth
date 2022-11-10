"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardutil = void 0;
const index_1 = require("edgedb/dist/reflection/index");
// Computing cardinality of path
// From base set cadinality and pointer cardinality
// Used in path expressions
// Cardinality  Empty  AtMostOne  One         Many  AtLeastOne
// Empty        0      0          0           0     0
// AtMostOne    0      AtMostOne  AtMostOne   Many  Many
// One          0      AtMostOne  One         Many  AtLeastOne
// Many         0      Many       Many        Many  Many
// AtLeastOne   0      Many       AtLeastOne  Many  AtLeastOne
var cardutil;
(function (cardutil) {
    function multiplyCardinalities(c1, c2) {
        if (c1 === index_1.Cardinality.Empty)
            return index_1.Cardinality.Empty;
        if (c1 === index_1.Cardinality.One)
            return c2;
        if (c1 === index_1.Cardinality.AtMostOne) {
            if (c2 === index_1.Cardinality.One)
                return index_1.Cardinality.AtMostOne;
            if (c2 === index_1.Cardinality.AtLeastOne)
                return index_1.Cardinality.Many;
            return c2;
        }
        if (c1 === index_1.Cardinality.Many) {
            if (c2 === index_1.Cardinality.Empty)
                return index_1.Cardinality.Empty;
            return index_1.Cardinality.Many;
        }
        if (c1 === index_1.Cardinality.AtLeastOne) {
            if (c2 === index_1.Cardinality.AtMostOne)
                return index_1.Cardinality.Many;
            if (c2 === index_1.Cardinality.One)
                return index_1.Cardinality.AtLeastOne;
            return c2;
        }
        throw new Error(`Invalid Cardinality ${c1}`);
    }
    cardutil.multiplyCardinalities = multiplyCardinalities;
    function multiplyCardinalitiesVariadic(cards) {
        if (cards.length === 0)
            throw new Error("Empty tuple not allowed");
        if (cards.length === 1)
            return cards[0];
        return cards.reduce((product, card) => multiplyCardinalities(product, card), index_1.Cardinality.One);
    }
    cardutil.multiplyCardinalitiesVariadic = multiplyCardinalitiesVariadic;
    function mergeCardinalities(a, b) {
        if (a === index_1.Cardinality.Empty)
            return b;
        if (b === index_1.Cardinality.Empty)
            return a;
        if (a === index_1.Cardinality.AtLeastOne)
            return index_1.Cardinality.AtLeastOne;
        if (b === index_1.Cardinality.AtLeastOne)
            return index_1.Cardinality.AtLeastOne;
        if (a === index_1.Cardinality.One)
            return index_1.Cardinality.AtLeastOne;
        if (b === index_1.Cardinality.One)
            return index_1.Cardinality.AtLeastOne;
        return index_1.Cardinality.Many;
    }
    cardutil.mergeCardinalities = mergeCardinalities;
    function mergeCardinalitiesVariadic(cards) {
        if (cards.length === 0)
            throw new Error("Empty tuple not allowed");
        if (cards.length === 1)
            return cards[0];
        const [first, second, ...rest] = cards;
        if (cards.length === 2)
            return mergeCardinalities(first, second);
        return mergeCardinalitiesVariadic([
            mergeCardinalities(first, second),
            ...rest
        ]);
    }
    cardutil.mergeCardinalitiesVariadic = mergeCardinalitiesVariadic;
    function orCardinalities(c1, c2) {
        if (c1 === c2 || c1 === index_1.Cardinality.Many)
            return c1;
        if (c1 === index_1.Cardinality.AtLeastOne) {
            if (c2 === index_1.Cardinality.One)
                return index_1.Cardinality.AtLeastOne;
            return index_1.Cardinality.Many;
        }
        if (c1 === index_1.Cardinality.AtMostOne) {
            if (c2 === index_1.Cardinality.Many || c2 === index_1.Cardinality.AtLeastOne) {
                return index_1.Cardinality.Many;
            }
            return c1;
        }
        if (c1 === index_1.Cardinality.Empty) {
            if (c2 === index_1.Cardinality.AtMostOne || c2 === index_1.Cardinality.One) {
                return index_1.Cardinality.AtMostOne;
            }
            return index_1.Cardinality.Many;
        }
        if (c2 === index_1.Cardinality.Empty)
            return index_1.Cardinality.AtMostOne;
        return c2;
    }
    cardutil.orCardinalities = orCardinalities;
    function overrideLowerBound(card, override) {
        if (override === "One") {
            if (card === index_1.Cardinality.Many || card === index_1.Cardinality.AtLeastOne) {
                return index_1.Cardinality.AtLeastOne;
            }
            else {
                return index_1.Cardinality.One;
            }
        }
        else {
            if (card === index_1.Cardinality.Many || card === index_1.Cardinality.AtLeastOne) {
                return index_1.Cardinality.Many;
            }
            else if (card === index_1.Cardinality.Empty) {
                return index_1.Cardinality.Empty;
            }
            else {
                return index_1.Cardinality.AtMostOne;
            }
        }
    }
    cardutil.overrideLowerBound = overrideLowerBound;
    function overrideUpperBound(card, override) {
        if (override === "One") {
            if (card === index_1.Cardinality.One || card === index_1.Cardinality.AtLeastOne) {
                return index_1.Cardinality.One;
            }
            else {
                return index_1.Cardinality.AtMostOne;
            }
        }
        else {
            if (card === index_1.Cardinality.One || card === index_1.Cardinality.AtLeastOne) {
                return index_1.Cardinality.AtLeastOne;
            }
            else {
                return index_1.Cardinality.Many;
            }
        }
    }
    cardutil.overrideUpperBound = overrideUpperBound;
})(cardutil = exports.cardutil || (exports.cardutil = {}));
