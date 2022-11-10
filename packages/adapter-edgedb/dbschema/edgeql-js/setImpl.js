"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = void 0;
const $ = __importStar(require("./reflection"));
const castMaps = __importStar(require("./castMaps"));
const path_1 = require("./path");
const set_1 = require("./set");
function set(..._exprs) {
    // if no arg
    // if arg
    //   return empty set
    // if object set
    //   merged objects
    // if primitive
    //   return shared parent of scalars
    if (_exprs.length === 0) {
        return null;
    }
    const exprs = _exprs.map(expr => castMaps.literalToTypeSet(expr));
    return (0, path_1.$expressionify)({
        __kind__: $.ExpressionKind.Set,
        __element__: exprs
            .map(expr => expr.__element__)
            .reduce(set_1.getSharedParent),
        __cardinality__: $.cardutil.mergeCardinalitiesVariadic(exprs.map(expr => expr.__cardinality__)),
        __exprs__: exprs,
    });
}
exports.set = set;
