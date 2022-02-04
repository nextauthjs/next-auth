"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.neo4jEpochToDate = exports.neo4jToSafeNumber = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const neo4jToSafeNumber = (x) => {
    if (!neo4j_driver_1.default.isInt(x)) {
        return x;
    }
    if (neo4j_driver_1.default.integer.inSafeRange(x)) {
        return x.toNumber();
    }
    else {
        return x.toString();
    }
};
exports.neo4jToSafeNumber = neo4jToSafeNumber;
const neo4jEpochToDate = (epoch) => {
    const epochParsed = exports.neo4jToSafeNumber(epoch);
    if (typeof epochParsed !== "number")
        return null;
    return new Date(epochParsed);
};
exports.neo4jEpochToDate = neo4jEpochToDate;
