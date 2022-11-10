"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$range = void 0;
const edgedb_1 = require("edgedb");
const index_1 = require("edgedb/dist/reflection/index");
const castMaps_1 = require("./castMaps");
const __spec__1 = require("./__spec__");
const literal_1 = require("./literal");
const funcops_1 = require("./funcops");
const path_1 = require("./path");
function range(...args) {
    var _a;
    if (args.length === 1) {
        const arg = args[0];
        if (arg instanceof edgedb_1.Range) {
            if (arg.lower === null && arg.upper === null) {
                throw new Error(`Can't create literal expression from unbounded range. Try this instead:\n\n  e.range(e.cast(e.int64, e.set()), e.cast(e.int64, e.set()))`);
            }
            if (arg.isEmpty) {
                throw new Error(`Can't create literal expression from empty range.`);
            }
            return (0, literal_1.literal)(range((0, castMaps_1.literalToTypeSet)((_a = arg.lower) !== null && _a !== void 0 ? _a : arg.upper).__element__), arg);
        }
        if (arg.__kind__ && !arg.__element__) {
            return {
                __kind__: index_1.TypeKind.range,
                __name__: `range<${arg.__name__}>`,
                __element__: arg
            };
        }
    }
    const { returnType, cardinality, args: positionalArgs, namedArgs } = (0, funcops_1.$resolveOverload)("std::range", args, __spec__1.spec, [
        {
            args: [
                {
                    typeId: literal_1.$nameMapping.get("std::anypoint"),
                    optional: true,
                    setoftype: false,
                    variadic: false
                },
                {
                    typeId: literal_1.$nameMapping.get("std::anypoint"),
                    optional: true,
                    setoftype: false,
                    variadic: false
                }
            ],
            namedArgs: {
                inc_lower: {
                    typeId: literal_1.$nameMapping.get("std::bool"),
                    optional: true,
                    setoftype: false,
                    variadic: false
                },
                inc_upper: {
                    typeId: literal_1.$nameMapping.get("std::bool"),
                    optional: true,
                    setoftype: false,
                    variadic: false
                },
                empty: {
                    typeId: literal_1.$nameMapping.get("std::bool"),
                    optional: true,
                    setoftype: false,
                    variadic: false
                }
            },
            returnTypeId: literal_1.$nameMapping.get("range<std::anypoint>")
        }
    ]);
    return (0, path_1.$expressionify)({
        __kind__: index_1.ExpressionKind.Function,
        __element__: returnType,
        __cardinality__: cardinality,
        __name__: "std::range",
        __args__: positionalArgs,
        __namedargs__: namedArgs
    });
}
exports.$range = range;
