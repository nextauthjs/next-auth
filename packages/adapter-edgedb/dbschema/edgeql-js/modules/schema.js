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
exports.$Global = exports.FutureBehavior = exports.$FutureBehavior = exports.Function = exports.$Function = exports.Extension = exports.$Extension = exports.Delta = exports.$Delta = exports.Constraint = exports.$Constraint = exports.ConsistencySubject = exports.$ConsistencySubject = exports.Cast = exports.$Cast = exports.VolatilitySubject = exports.$VolatilitySubject = exports.CallableObject = exports.$CallableObject = exports.Array = exports.$Array = exports.CollectionType = exports.$CollectionType = exports.PrimitiveType = exports.$PrimitiveType = exports.Type = exports.$Type = exports.Annotation = exports.$Annotation = exports.Alias = exports.$Alias = exports.AccessPolicy = exports.$AccessPolicy = exports.AnnotationSubject = exports.$AnnotationSubject = exports.InheritingObject = exports.$InheritingObject = exports.SubclassableObject = exports.$SubclassableObject = exports.Object_9e146b225b2511ed8a35b350570a9c58 = exports.$Object_9e146b225b2511ed8a35b350570a9c58 = exports.Volatility = exports.TypeModifier = exports.TargetDeleteAction = exports.SourceDeleteAction = exports.ParameterKind = exports.OperatorKind = exports.Cardinality = exports.AccessPolicyAction = exports.AccessKind = void 0;
exports.TupleElement = exports.$TupleElement = exports.Tuple = exports.$Tuple = exports.ScalarType = exports.$ScalarType = exports.Range = exports.$Range = exports.PseudoType = exports.$PseudoType = exports.Property = exports.$Property = exports.Parameter = exports.$Parameter = exports.Operator = exports.$Operator = exports.ObjectType = exports.$ObjectType = exports.Module = exports.$Module = exports.Migration = exports.$Migration = exports.Link = exports.$Link = exports.Source = exports.$Source = exports.Pointer = exports.$Pointer = exports.Index = exports.$Index = exports.Global = void 0;
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
const AccessKind = $.makeType(_.spec, "9e1385e8-5b25-11ed-ad72-676cd8fcd701", _.syntax.literal);
exports.AccessKind = AccessKind;
const AccessPolicyAction = $.makeType(_.spec, "9e12c347-5b25-11ed-9fc2-2bf238d57b3a", _.syntax.literal);
exports.AccessPolicyAction = AccessPolicyAction;
const Cardinality = $.makeType(_.spec, "9e0da419-5b25-11ed-8108-575492b8e400", _.syntax.literal);
exports.Cardinality = Cardinality;
const OperatorKind = $.makeType(_.spec, "9e0fdb03-5b25-11ed-a51c-4dada28c347c", _.syntax.literal);
exports.OperatorKind = OperatorKind;
const ParameterKind = $.makeType(_.spec, "9e1156dc-5b25-11ed-9423-c90528dd00f2", _.syntax.literal);
exports.ParameterKind = ParameterKind;
const SourceDeleteAction = $.makeType(_.spec, "9e0f25c7-5b25-11ed-8be7-858445c69dee", _.syntax.literal);
exports.SourceDeleteAction = SourceDeleteAction;
const TargetDeleteAction = $.makeType(_.spec, "9e0e676e-5b25-11ed-aef7-bf8943b25918", _.syntax.literal);
exports.TargetDeleteAction = TargetDeleteAction;
const TypeModifier = $.makeType(_.spec, "9e120d3d-5b25-11ed-a294-c1d206564402", _.syntax.literal);
exports.TypeModifier = TypeModifier;
const Volatility = $.makeType(_.spec, "9e1097ff-5b25-11ed-8b9d-4f0c91600375", _.syntax.literal);
exports.Volatility = Volatility;
const $Object_9e146b225b2511ed8a35b350570a9c58 = $.makeType(_.spec, "9e146b22-5b25-11ed-8a35-b350570a9c58", _.syntax.literal);
exports.$Object_9e146b225b2511ed8a35b350570a9c58 = $Object_9e146b225b2511ed8a35b350570a9c58;
const Object_9e146b225b2511ed8a35b350570a9c58 = _.syntax.$PathNode($.$toSet($Object_9e146b225b2511ed8a35b350570a9c58, $.Cardinality.Many), null);
exports.Object_9e146b225b2511ed8a35b350570a9c58 = Object_9e146b225b2511ed8a35b350570a9c58;
const $SubclassableObject = $.makeType(_.spec, "9e202fc0-5b25-11ed-8794-491efcb89b07", _.syntax.literal);
exports.$SubclassableObject = $SubclassableObject;
const SubclassableObject = _.syntax.$PathNode($.$toSet($SubclassableObject, $.Cardinality.Many), null);
exports.SubclassableObject = SubclassableObject;
const $InheritingObject = $.makeType(_.spec, "9f72d646-5b25-11ed-aec2-e516712bdda7", _.syntax.literal);
exports.$InheritingObject = $InheritingObject;
const InheritingObject = _.syntax.$PathNode($.$toSet($InheritingObject, $.Cardinality.Many), null);
exports.InheritingObject = InheritingObject;
const $AnnotationSubject = $.makeType(_.spec, "9f46a909-5b25-11ed-9a3d-2f8a5c5a921f", _.syntax.literal);
exports.$AnnotationSubject = $AnnotationSubject;
const AnnotationSubject = _.syntax.$PathNode($.$toSet($AnnotationSubject, $.Cardinality.Many), null);
exports.AnnotationSubject = AnnotationSubject;
const $AccessPolicy = $.makeType(_.spec, "a0a9bcee-5b25-11ed-84f9-191e0841c65e", _.syntax.literal);
exports.$AccessPolicy = $AccessPolicy;
const AccessPolicy = _.syntax.$PathNode($.$toSet($AccessPolicy, $.Cardinality.Many), null);
exports.AccessPolicy = AccessPolicy;
const $Alias = $.makeType(_.spec, "a0dec3bb-5b25-11ed-a2e3-79954c8ce74c", _.syntax.literal);
exports.$Alias = $Alias;
const Alias = _.syntax.$PathNode($.$toSet($Alias, $.Cardinality.Many), null);
exports.Alias = Alias;
const $Annotation = $.makeType(_.spec, "9f548c26-5b25-11ed-b55e-874b79a13e2c", _.syntax.literal);
exports.$Annotation = $Annotation;
const Annotation = _.syntax.$PathNode($.$toSet($Annotation, $.Cardinality.Many), null);
exports.Annotation = Annotation;
const $Type = $.makeType(_.spec, "9e327e87-5b25-11ed-97c1-f92c67073187", _.syntax.literal);
exports.$Type = $Type;
const Type = _.syntax.$PathNode($.$toSet($Type, $.Cardinality.Many), null);
exports.Type = Type;
const $PrimitiveType = $.makeType(_.spec, "9ea072c2-5b25-11ed-ae71-71dcdb7c9086", _.syntax.literal);
exports.$PrimitiveType = $PrimitiveType;
const PrimitiveType = _.syntax.$PathNode($.$toSet($PrimitiveType, $.Cardinality.Many), null);
exports.PrimitiveType = PrimitiveType;
const $CollectionType = $.makeType(_.spec, "9eb7d112-5b25-11ed-be8a-a79dea986904", _.syntax.literal);
exports.$CollectionType = $CollectionType;
const CollectionType = _.syntax.$PathNode($.$toSet($CollectionType, $.Cardinality.Many), null);
exports.CollectionType = CollectionType;
const $Array = $.makeType(_.spec, "9ecf2695-5b25-11ed-94bf-790c3b9f84b3", _.syntax.literal);
exports.$Array = $Array;
const Array = _.syntax.$PathNode($.$toSet($Array, $.Cardinality.Many), null);
exports.Array = Array;
const $CallableObject = $.makeType(_.spec, "9fa74858-5b25-11ed-8443-9fbe0f824496", _.syntax.literal);
exports.$CallableObject = $CallableObject;
const CallableObject = _.syntax.$PathNode($.$toSet($CallableObject, $.Cardinality.Many), null);
exports.CallableObject = CallableObject;
const $VolatilitySubject = $.makeType(_.spec, "9fc6c22c-5b25-11ed-985f-7f91bd91851f", _.syntax.literal);
exports.$VolatilitySubject = $VolatilitySubject;
const VolatilitySubject = _.syntax.$PathNode($.$toSet($VolatilitySubject, $.Cardinality.Many), null);
exports.VolatilitySubject = VolatilitySubject;
const $Cast = $.makeType(_.spec, "a3f9f4c8-5b25-11ed-b686-8dd3fec68756", _.syntax.literal);
exports.$Cast = $Cast;
const Cast = _.syntax.$PathNode($.$toSet($Cast, $.Cardinality.Many), null);
exports.Cast = Cast;
const $ConsistencySubject = $.makeType(_.spec, "a00f830a-5b25-11ed-a6c0-bd705b0cbae4", _.syntax.literal);
exports.$ConsistencySubject = $ConsistencySubject;
const ConsistencySubject = _.syntax.$PathNode($.$toSet($ConsistencySubject, $.Cardinality.Many), null);
exports.ConsistencySubject = ConsistencySubject;
const $Constraint = $.makeType(_.spec, "9fd6b760-5b25-11ed-aed8-15ec57d61f68", _.syntax.literal);
exports.$Constraint = $Constraint;
const Constraint = _.syntax.$PathNode($.$toSet($Constraint, $.Cardinality.Many), null);
exports.Constraint = Constraint;
const $Delta = $.makeType(_.spec, "9f363e77-5b25-11ed-bd9b-6b663e241275", _.syntax.literal);
exports.$Delta = $Delta;
const Delta = _.syntax.$PathNode($.$toSet($Delta, $.Cardinality.Many), null);
exports.Delta = Delta;
const $Extension = $.makeType(_.spec, "a44d9a40-5b25-11ed-8938-bf7df1350636", _.syntax.literal);
exports.$Extension = $Extension;
const Extension = _.syntax.$PathNode($.$toSet($Extension, $.Cardinality.Many), null);
exports.Extension = Extension;
const $Function = $.makeType(_.spec, "a39318a5-5b25-11ed-9930-5970f1b42802", _.syntax.literal);
exports.$Function = $Function;
const Function = _.syntax.$PathNode($.$toSet($Function, $.Cardinality.Many), null);
exports.Function = Function;
const $FutureBehavior = $.makeType(_.spec, "a46efc47-5b25-11ed-8ee1-37468200f95e", _.syntax.literal);
exports.$FutureBehavior = $FutureBehavior;
const FutureBehavior = _.syntax.$PathNode($.$toSet($FutureBehavior, $.Cardinality.Many), null);
exports.FutureBehavior = FutureBehavior;
const $Global = $.makeType(_.spec, "a369ad0e-5b25-11ed-a448-f9036939cea9", _.syntax.literal);
exports.$Global = $Global;
const Global = _.syntax.$PathNode($.$toSet($Global, $.Cardinality.Many), null);
exports.Global = Global;
const $Index = $.makeType(_.spec, "a02b9c3a-5b25-11ed-ba53-4f2c834b74e4", _.syntax.literal);
exports.$Index = $Index;
const Index = _.syntax.$PathNode($.$toSet($Index, $.Cardinality.Many), null);
exports.Index = Index;
const $Pointer = $.makeType(_.spec, "a06e903e-5b25-11ed-b246-15eb4b2b70ce", _.syntax.literal);
exports.$Pointer = $Pointer;
const Pointer = _.syntax.$PathNode($.$toSet($Pointer, $.Cardinality.Many), null);
exports.Pointer = Pointer;
const $Source = $.makeType(_.spec, "a0567301-5b25-11ed-a636-d50935807ed6", _.syntax.literal);
exports.$Source = $Source;
const Source = _.syntax.$PathNode($.$toSet($Source, $.Cardinality.Many), null);
exports.Source = Source;
const $Link = $.makeType(_.spec, "a24d2971-5b25-11ed-9102-9f9c712b3041", _.syntax.literal);
exports.$Link = $Link;
const Link = _.syntax.$PathNode($.$toSet($Link, $.Cardinality.Many), null);
exports.Link = Link;
const $Migration = $.makeType(_.spec, "a427350f-5b25-11ed-9710-1b836a707e0a", _.syntax.literal);
exports.$Migration = $Migration;
const Migration = _.syntax.$PathNode($.$toSet($Migration, $.Cardinality.Many), null);
exports.Migration = Migration;
const $Module = $.makeType(_.spec, "9e93d9ad-5b25-11ed-8bba-f739cc71e541", _.syntax.literal);
exports.$Module = $Module;
const Module = _.syntax.$PathNode($.$toSet($Module, $.Cardinality.Many), null);
exports.Module = Module;
const $ObjectType = $.makeType(_.spec, "a141d589-5b25-11ed-96fa-c3f661fad38e", _.syntax.literal);
exports.$ObjectType = $ObjectType;
const ObjectType = _.syntax.$PathNode($.$toSet($ObjectType, $.Cardinality.Many), null);
exports.ObjectType = ObjectType;
const $Operator = $.makeType(_.spec, "a3c81c7b-5b25-11ed-8e1c-affc2607dc4f", _.syntax.literal);
exports.$Operator = $Operator;
const Operator = _.syntax.$PathNode($.$toSet($Operator, $.Cardinality.Many), null);
exports.Operator = Operator;
const $Parameter = $.makeType(_.spec, "9f91545b-5b25-11ed-bf63-f18437de89d9", _.syntax.literal);
exports.$Parameter = $Parameter;
const Parameter = _.syntax.$PathNode($.$toSet($Parameter, $.Cardinality.Many), null);
exports.Parameter = Parameter;
const $Property = $.makeType(_.spec, "a2e6f5ff-5b25-11ed-a522-695e49729309", _.syntax.literal);
exports.$Property = $Property;
const Property = _.syntax.$PathNode($.$toSet($Property, $.Cardinality.Many), null);
exports.Property = Property;
const $PseudoType = $.makeType(_.spec, "9e44f051-5b25-11ed-a8b0-1994e99eac0c", _.syntax.literal);
exports.$PseudoType = $PseudoType;
const PseudoType = _.syntax.$PathNode($.$toSet($PseudoType, $.Cardinality.Many), null);
exports.PseudoType = PseudoType;
const $Range = $.makeType(_.spec, "9f18f980-5b25-11ed-b29f-fd87a6176640", _.syntax.literal);
exports.$Range = $Range;
const Range = _.syntax.$PathNode($.$toSet($Range, $.Cardinality.Many), null);
exports.Range = Range;
const $ScalarType = $.makeType(_.spec, "a0fbe6ee-5b25-11ed-b641-31c619df2be4", _.syntax.literal);
exports.$ScalarType = $ScalarType;
const ScalarType = _.syntax.$PathNode($.$toSet($ScalarType, $.Cardinality.Many), null);
exports.ScalarType = ScalarType;
const $Tuple = $.makeType(_.spec, "9ef7d724-5b25-11ed-97dc-053995787bea", _.syntax.literal);
exports.$Tuple = $Tuple;
const Tuple = _.syntax.$PathNode($.$toSet($Tuple, $.Cardinality.Many), null);
exports.Tuple = Tuple;
const $TupleElement = $.makeType(_.spec, "9eed0218-5b25-11ed-a0e8-31ea407ae0b5", _.syntax.literal);
exports.$TupleElement = $TupleElement;
const TupleElement = _.syntax.$PathNode($.$toSet($TupleElement, $.Cardinality.Many), null);
exports.TupleElement = TupleElement;
const __defaultExports = {
    "AccessKind": AccessKind,
    "AccessPolicyAction": AccessPolicyAction,
    "Cardinality": Cardinality,
    "OperatorKind": OperatorKind,
    "ParameterKind": ParameterKind,
    "SourceDeleteAction": SourceDeleteAction,
    "TargetDeleteAction": TargetDeleteAction,
    "TypeModifier": TypeModifier,
    "Volatility": Volatility,
    "Object": Object_9e146b225b2511ed8a35b350570a9c58,
    "SubclassableObject": SubclassableObject,
    "InheritingObject": InheritingObject,
    "AnnotationSubject": AnnotationSubject,
    "AccessPolicy": AccessPolicy,
    "Alias": Alias,
    "Annotation": Annotation,
    "Type": Type,
    "PrimitiveType": PrimitiveType,
    "CollectionType": CollectionType,
    "Array": Array,
    "CallableObject": CallableObject,
    "VolatilitySubject": VolatilitySubject,
    "Cast": Cast,
    "ConsistencySubject": ConsistencySubject,
    "Constraint": Constraint,
    "Delta": Delta,
    "Extension": Extension,
    "Function": Function,
    "FutureBehavior": FutureBehavior,
    "Global": Global,
    "Index": Index,
    "Pointer": Pointer,
    "Source": Source,
    "Link": Link,
    "Migration": Migration,
    "Module": Module,
    "ObjectType": ObjectType,
    "Operator": Operator,
    "Parameter": Parameter,
    "Property": Property,
    "PseudoType": PseudoType,
    "Range": Range,
    "ScalarType": ScalarType,
    "Tuple": Tuple,
    "TupleElement": TupleElement
};
exports.default = __defaultExports;
