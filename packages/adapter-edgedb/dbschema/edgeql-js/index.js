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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cardinality = exports.createClient = void 0;
__exportStar(require("./external"), exports);
var edgedb_1 = require("edgedb");
Object.defineProperty(exports, "createClient", { enumerable: true, get: function () { return edgedb_1.createClient; } });
const $ = __importStar(require("./reflection"));
const $syntax = __importStar(require("./syntax"));
const $op = __importStar(require("./operators"));
const std_1 = __importDefault(require("./modules/std"));
const cal_1 = __importDefault(require("./modules/cal"));
const cfg_1 = __importDefault(require("./modules/cfg"));
const schema_1 = __importDefault(require("./modules/schema"));
const sys_1 = __importDefault(require("./modules/sys"));
const default_1 = __importDefault(require("./modules/default"));
const math_1 = __importDefault(require("./modules/math"));
const ExportDefault = {
    ...std_1.default,
    ...default_1.default,
    ...$.util.omitDollarPrefixed($syntax),
    ...$op,
    "std": std_1.default,
    "cal": cal_1.default,
    "cfg": cfg_1.default,
    "schema": schema_1.default,
    "sys": sys_1.default,
    "default": default_1.default,
    "math": math_1.default,
};
const Cardinality = $.Cardinality;
exports.Cardinality = Cardinality;
exports.default = ExportDefault;
