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
exports.VerificationToken = exports.$VerificationToken = exports.User = exports.$User = exports.Session = exports.$Session = exports.Account = exports.$Account = void 0;
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
const $Account = $.makeType(_.spec, "1081398d-6078-11ed-aca5-b334db6ebfb6", _.syntax.literal);
exports.$Account = $Account;
const Account = _.syntax.$PathNode($.$toSet($Account, $.Cardinality.Many), null);
exports.Account = Account;
const $Session = $.makeType(_.spec, "1091db60-6078-11ed-b82b-0ba10d4fc3f1", _.syntax.literal);
exports.$Session = $Session;
const Session = _.syntax.$PathNode($.$toSet($Session, $.Cardinality.Many), null);
exports.Session = Session;
const $User = $.makeType(_.spec, "108a3db5-6078-11ed-a140-6174247a232d", _.syntax.literal);
exports.$User = $User;
const User = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null);
exports.User = User;
const $VerificationToken = $.makeType(_.spec, "109b9ba6-6078-11ed-b59d-995d6a0a655a", _.syntax.literal);
exports.$VerificationToken = $VerificationToken;
const VerificationToken = _.syntax.$PathNode($.$toSet($VerificationToken, $.Cardinality.Many), null);
exports.VerificationToken = VerificationToken;
const __defaultExports = {
    "Account": Account,
    "Session": Session,
    "User": User,
    "VerificationToken": VerificationToken
};
exports.default = __defaultExports;
