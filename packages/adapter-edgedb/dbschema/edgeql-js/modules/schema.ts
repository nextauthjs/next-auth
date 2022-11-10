import * as $ from "../reflection";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _sys from "./sys";
import type * as _cfg from "./cfg";
import type * as _default from "./default";
export type $AccessKind = {
  Select: $.$expr_Literal<$AccessKind>;
  UpdateRead: $.$expr_Literal<$AccessKind>;
  UpdateWrite: $.$expr_Literal<$AccessKind>;
  Delete: $.$expr_Literal<$AccessKind>;
  Insert: $.$expr_Literal<$AccessKind>;
} & $.EnumType<"schema::AccessKind", ["Select", "UpdateRead", "UpdateWrite", "Delete", "Insert"]>;
const AccessKind: $AccessKind = $.makeType<$AccessKind>(_.spec, "9e1385e8-5b25-11ed-ad72-676cd8fcd701", _.syntax.literal);

export type $AccessPolicyAction = {
  Allow: $.$expr_Literal<$AccessPolicyAction>;
  Deny: $.$expr_Literal<$AccessPolicyAction>;
} & $.EnumType<"schema::AccessPolicyAction", ["Allow", "Deny"]>;
const AccessPolicyAction: $AccessPolicyAction = $.makeType<$AccessPolicyAction>(_.spec, "9e12c347-5b25-11ed-9fc2-2bf238d57b3a", _.syntax.literal);

export type $Cardinality = {
  One: $.$expr_Literal<$Cardinality>;
  Many: $.$expr_Literal<$Cardinality>;
} & $.EnumType<"schema::Cardinality", ["One", "Many"]>;
const Cardinality: $Cardinality = $.makeType<$Cardinality>(_.spec, "9e0da419-5b25-11ed-8108-575492b8e400", _.syntax.literal);

export type $OperatorKind = {
  Infix: $.$expr_Literal<$OperatorKind>;
  Postfix: $.$expr_Literal<$OperatorKind>;
  Prefix: $.$expr_Literal<$OperatorKind>;
  Ternary: $.$expr_Literal<$OperatorKind>;
} & $.EnumType<"schema::OperatorKind", ["Infix", "Postfix", "Prefix", "Ternary"]>;
const OperatorKind: $OperatorKind = $.makeType<$OperatorKind>(_.spec, "9e0fdb03-5b25-11ed-a51c-4dada28c347c", _.syntax.literal);

export type $ParameterKind = {
  VariadicParam: $.$expr_Literal<$ParameterKind>;
  NamedOnlyParam: $.$expr_Literal<$ParameterKind>;
  PositionalParam: $.$expr_Literal<$ParameterKind>;
} & $.EnumType<"schema::ParameterKind", ["VariadicParam", "NamedOnlyParam", "PositionalParam"]>;
const ParameterKind: $ParameterKind = $.makeType<$ParameterKind>(_.spec, "9e1156dc-5b25-11ed-9423-c90528dd00f2", _.syntax.literal);

export type $SourceDeleteAction = {
  DeleteTarget: $.$expr_Literal<$SourceDeleteAction>;
  Allow: $.$expr_Literal<$SourceDeleteAction>;
  DeleteTargetIfOrphan: $.$expr_Literal<$SourceDeleteAction>;
} & $.EnumType<"schema::SourceDeleteAction", ["DeleteTarget", "Allow", "DeleteTargetIfOrphan"]>;
const SourceDeleteAction: $SourceDeleteAction = $.makeType<$SourceDeleteAction>(_.spec, "9e0f25c7-5b25-11ed-8be7-858445c69dee", _.syntax.literal);

export type $TargetDeleteAction = {
  Restrict: $.$expr_Literal<$TargetDeleteAction>;
  DeleteSource: $.$expr_Literal<$TargetDeleteAction>;
  Allow: $.$expr_Literal<$TargetDeleteAction>;
  DeferredRestrict: $.$expr_Literal<$TargetDeleteAction>;
} & $.EnumType<"schema::TargetDeleteAction", ["Restrict", "DeleteSource", "Allow", "DeferredRestrict"]>;
const TargetDeleteAction: $TargetDeleteAction = $.makeType<$TargetDeleteAction>(_.spec, "9e0e676e-5b25-11ed-aef7-bf8943b25918", _.syntax.literal);

export type $TypeModifier = {
  SetOfType: $.$expr_Literal<$TypeModifier>;
  OptionalType: $.$expr_Literal<$TypeModifier>;
  SingletonType: $.$expr_Literal<$TypeModifier>;
} & $.EnumType<"schema::TypeModifier", ["SetOfType", "OptionalType", "SingletonType"]>;
const TypeModifier: $TypeModifier = $.makeType<$TypeModifier>(_.spec, "9e120d3d-5b25-11ed-a294-c1d206564402", _.syntax.literal);

export type $Volatility = {
  Immutable: $.$expr_Literal<$Volatility>;
  Stable: $.$expr_Literal<$Volatility>;
  Volatile: $.$expr_Literal<$Volatility>;
} & $.EnumType<"schema::Volatility", ["Immutable", "Stable", "Volatile"]>;
const Volatility: $Volatility = $.makeType<$Volatility>(_.spec, "9e1097ff-5b25-11ed-8b9d-4f0c91600375", _.syntax.literal);

export type $Object_9e146b225b2511ed8a35b350570a9c58λShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "internal": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "builtin": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "computed_fields": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Object_9e146b225b2511ed8a35b350570a9c58 = $.ObjectType<"schema::Object", $Object_9e146b225b2511ed8a35b350570a9c58λShape, null, [
  ..._std.$BaseObject['__exclusives__'],
]>;
const $Object_9e146b225b2511ed8a35b350570a9c58 = $.makeType<$Object_9e146b225b2511ed8a35b350570a9c58>(_.spec, "9e146b22-5b25-11ed-8a35-b350570a9c58", _.syntax.literal);

const Object_9e146b225b2511ed8a35b350570a9c58: $.$expr_PathNode<$.TypeSet<$Object_9e146b225b2511ed8a35b350570a9c58, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Object_9e146b225b2511ed8a35b350570a9c58, $.Cardinality.Many), null);

export type $SubclassableObjectλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
  "abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "is_abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, true>;
  "final": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "is_final": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
}>;
type $SubclassableObject = $.ObjectType<"schema::SubclassableObject", $SubclassableObjectλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
]>;
const $SubclassableObject = $.makeType<$SubclassableObject>(_.spec, "9e202fc0-5b25-11ed-8794-491efcb89b07", _.syntax.literal);

const SubclassableObject: $.$expr_PathNode<$.TypeSet<$SubclassableObject, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($SubclassableObject, $.Cardinality.Many), null);

export type $InheritingObjectλShape = $.typeutil.flatten<$SubclassableObjectλShape & {
  "bases": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "ancestors": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "inherited_fields": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
  "<bases[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InheritingObject = $.ObjectType<"schema::InheritingObject", $InheritingObjectλShape, null, [
  ...$SubclassableObject['__exclusives__'],
]>;
const $InheritingObject = $.makeType<$InheritingObject>(_.spec, "9f72d646-5b25-11ed-aec2-e516712bdda7", _.syntax.literal);

const InheritingObject: $.$expr_PathNode<$.TypeSet<$InheritingObject, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($InheritingObject, $.Cardinality.Many), null);

export type $AnnotationSubjectλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
  "annotations": $.LinkDesc<$Annotation, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@value": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
}>;
type $AnnotationSubject = $.ObjectType<"schema::AnnotationSubject", $AnnotationSubjectλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
]>;
const $AnnotationSubject = $.makeType<$AnnotationSubject>(_.spec, "9f46a909-5b25-11ed-9a3d-2f8a5c5a921f", _.syntax.literal);

const AnnotationSubject: $.$expr_PathNode<$.TypeSet<$AnnotationSubject, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AnnotationSubject, $.Cardinality.Many), null);

export type $AccessPolicyλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
  "subject": $.LinkDesc<$ObjectType, $.Cardinality.One, {}, false, false,  false, false>;
  "access_kinds": $.PropertyDesc<$AccessKind, $.Cardinality.Many, false, false, false, false>;
  "condition": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "action": $.PropertyDesc<$AccessPolicyAction, $.Cardinality.One, false, false, false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<access_policies[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<access_policies": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $AccessPolicy = $.ObjectType<"schema::AccessPolicy", $AccessPolicyλShape, null, [
  ...$InheritingObject['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
]>;
const $AccessPolicy = $.makeType<$AccessPolicy>(_.spec, "a0a9bcee-5b25-11ed-84f9-191e0841c65e", _.syntax.literal);

const AccessPolicy: $.$expr_PathNode<$.TypeSet<$AccessPolicy, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($AccessPolicy, $.Cardinality.Many), null);

export type $AliasλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
  "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
type $Alias = $.ObjectType<"schema::Alias", $AliasλShape, null, [
  ...$AnnotationSubject['__exclusives__'],
]>;
const $Alias = $.makeType<$Alias>(_.spec, "a0dec3bb-5b25-11ed-a2e3-79954c8ce74c", _.syntax.literal);

const Alias: $.$expr_PathNode<$.TypeSet<$Alias, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Alias, $.Cardinality.Many), null);

export type $AnnotationλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
  "inheritable": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "<annotations[is schema::AnnotationSubject]": $.LinkDesc<$AnnotationSubject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is sys::SystemObject]": $.LinkDesc<_sys.$SystemObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Annotation]": $.LinkDesc<$Annotation, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is sys::Role]": $.LinkDesc<_sys.$Role, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is sys::ExtensionPackage]": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Extension]": $.LinkDesc<$Extension, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is sys::Database]": $.LinkDesc<_sys.$Database, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Annotation = $.ObjectType<"schema::Annotation", $AnnotationλShape, null, [
  ...$InheritingObject['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
]>;
const $Annotation = $.makeType<$Annotation>(_.spec, "9f548c26-5b25-11ed-b55e-874b79a13e2c", _.syntax.literal);

const Annotation: $.$expr_PathNode<$.TypeSet<$Annotation, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Annotation, $.Cardinality.Many), null);

export type $TypeλShape = $.typeutil.flatten<$SubclassableObjectλShape & $AnnotationSubjectλShape & {
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "from_alias": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "is_from_alias": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, false>;
  "<element_type[is schema::Array]": $.LinkDesc<$Array, $.Cardinality.Many, {}, false, false,  false, false>;
  "<type[is schema::TupleElement]": $.LinkDesc<$TupleElement, $.Cardinality.Many, {}, false, false,  false, false>;
  "<element_type[is schema::Range]": $.LinkDesc<$Range, $.Cardinality.Many, {}, false, false,  false, false>;
  "<type[is schema::Parameter]": $.LinkDesc<$Parameter, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<type[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false,  false, false>;
  "<from_type[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false,  false, false>;
  "<to_type[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<element_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<from_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<to_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Type = $.ObjectType<"schema::Type", $TypeλShape, null, [
  ...$SubclassableObject['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
]>;
const $Type = $.makeType<$Type>(_.spec, "9e327e87-5b25-11ed-97c1-f92c67073187", _.syntax.literal);

const Type: $.$expr_PathNode<$.TypeSet<$Type, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Type, $.Cardinality.Many), null);

export type $PrimitiveTypeλShape = $.typeutil.flatten<$TypeλShape & {
}>;
type $PrimitiveType = $.ObjectType<"schema::PrimitiveType", $PrimitiveTypeλShape, null, [
  ...$Type['__exclusives__'],
]>;
const $PrimitiveType = $.makeType<$PrimitiveType>(_.spec, "9ea072c2-5b25-11ed-ae71-71dcdb7c9086", _.syntax.literal);

const PrimitiveType: $.$expr_PathNode<$.TypeSet<$PrimitiveType, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($PrimitiveType, $.Cardinality.Many), null);

export type $CollectionTypeλShape = $.typeutil.flatten<$PrimitiveTypeλShape & {
}>;
type $CollectionType = $.ObjectType<"schema::CollectionType", $CollectionTypeλShape, null, [
  ...$PrimitiveType['__exclusives__'],
]>;
const $CollectionType = $.makeType<$CollectionType>(_.spec, "9eb7d112-5b25-11ed-be8a-a79dea986904", _.syntax.literal);

const CollectionType: $.$expr_PathNode<$.TypeSet<$CollectionType, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($CollectionType, $.Cardinality.Many), null);

export type $ArrayλShape = $.typeutil.flatten<$CollectionTypeλShape & {
  "element_type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "dimensions": $.PropertyDesc<$.ArrayType<_std.$int16>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Array = $.ObjectType<"schema::Array", $ArrayλShape, null, [
  ...$CollectionType['__exclusives__'],
]>;
const $Array = $.makeType<$Array>(_.spec, "9ecf2695-5b25-11ed-94bf-790c3b9f84b3", _.syntax.literal);

const Array: $.$expr_PathNode<$.TypeSet<$Array, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Array, $.Cardinality.Many), null);

export type $CallableObjectλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
  "params": $.LinkDesc<$Parameter, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "return_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "return_typemod": $.PropertyDesc<$TypeModifier, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $CallableObject = $.ObjectType<"schema::CallableObject", $CallableObjectλShape, null, [
  ...$AnnotationSubject['__exclusives__'],
]>;
const $CallableObject = $.makeType<$CallableObject>(_.spec, "9fa74858-5b25-11ed-8443-9fbe0f824496", _.syntax.literal);

const CallableObject: $.$expr_PathNode<$.TypeSet<$CallableObject, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($CallableObject, $.Cardinality.Many), null);

export type $VolatilitySubjectλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
  "volatility": $.PropertyDesc<$Volatility, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
type $VolatilitySubject = $.ObjectType<"schema::VolatilitySubject", $VolatilitySubjectλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
]>;
const $VolatilitySubject = $.makeType<$VolatilitySubject>(_.spec, "9fc6c22c-5b25-11ed-985f-7f91bd91851f", _.syntax.literal);

const VolatilitySubject: $.$expr_PathNode<$.TypeSet<$VolatilitySubject, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($VolatilitySubject, $.Cardinality.Many), null);

export type $CastλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $VolatilitySubjectλShape & {
  "from_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "to_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "allow_implicit": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "allow_assignment": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Cast = $.ObjectType<"schema::Cast", $CastλShape, null, [
  ...$AnnotationSubject['__exclusives__'],
  ...$VolatilitySubject['__exclusives__'],
]>;
const $Cast = $.makeType<$Cast>(_.spec, "a3f9f4c8-5b25-11ed-b686-8dd3fec68756", _.syntax.literal);

const Cast: $.$expr_PathNode<$.TypeSet<$Cast, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Cast, $.Cardinality.Many), null);

export type $ConsistencySubjectλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & $InheritingObjectλShape & $AnnotationSubjectλShape & {
  "constraints": $.LinkDesc<$Constraint, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "<subject[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subject": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ConsistencySubject = $.ObjectType<"schema::ConsistencySubject", $ConsistencySubjectλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
  ...$InheritingObject['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
  {constraints: {__element__: $Constraint, __cardinality__: $.Cardinality.Many},},
]>;
const $ConsistencySubject = $.makeType<$ConsistencySubject>(_.spec, "a00f830a-5b25-11ed-a6c0-bd705b0cbae4", _.syntax.literal);

const ConsistencySubject: $.$expr_PathNode<$.TypeSet<$ConsistencySubject, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ConsistencySubject, $.Cardinality.Many), null);

export type $ConstraintλShape = $.typeutil.flatten<Omit<$CallableObjectλShape, "params"> & $InheritingObjectλShape & {
  "subject": $.LinkDesc<$ConsistencySubject, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "params": $.LinkDesc<$Parameter, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
    "@value": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "subjectexpr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "finalexpr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "errmessage": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "delegated": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "except_expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<constraints[is schema::ConsistencySubject]": $.LinkDesc<$ConsistencySubject, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Constraint = $.ObjectType<"schema::Constraint", $ConstraintλShape, null, [
  ...$CallableObject['__exclusives__'],
  ...$InheritingObject['__exclusives__'],
]>;
const $Constraint = $.makeType<$Constraint>(_.spec, "9fd6b760-5b25-11ed-aed8-15ec57d61f68", _.syntax.literal);

const Constraint: $.$expr_PathNode<$.TypeSet<$Constraint, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Constraint, $.Cardinality.Many), null);

export type $DeltaλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
  "parents": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false,  false, false>;
  "<parents[is schema::Delta]": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false,  false, false>;
  "<parents": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Delta = $.ObjectType<"schema::Delta", $DeltaλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
]>;
const $Delta = $.makeType<$Delta>(_.spec, "9f363e77-5b25-11ed-bd9b-6b663e241275", _.syntax.literal);

const Delta: $.$expr_PathNode<$.TypeSet<$Delta, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Delta, $.Cardinality.Many), null);

export type $ExtensionλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $Object_9e146b225b2511ed8a35b350570a9c58λShape & {
  "package": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.One, {}, true, false,  false, false>;
}>;
type $Extension = $.ObjectType<"schema::Extension", $ExtensionλShape, null, [
  ...$AnnotationSubject['__exclusives__'],
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
  {package: {__element__: _sys.$ExtensionPackage, __cardinality__: $.Cardinality.One},},
]>;
const $Extension = $.makeType<$Extension>(_.spec, "a44d9a40-5b25-11ed-8938-bf7df1350636", _.syntax.literal);

const Extension: $.$expr_PathNode<$.TypeSet<$Extension, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Extension, $.Cardinality.Many), null);

export type $FunctionλShape = $.typeutil.flatten<$CallableObjectλShape & $VolatilitySubjectλShape & {
  "used_globals": $.LinkDesc<$Global, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "body": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "language": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "preserves_optionality": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
type $Function = $.ObjectType<"schema::Function", $FunctionλShape, null, [
  ...$CallableObject['__exclusives__'],
  ...$VolatilitySubject['__exclusives__'],
]>;
const $Function = $.makeType<$Function>(_.spec, "a39318a5-5b25-11ed-9930-5970f1b42802", _.syntax.literal);

const Function: $.$expr_PathNode<$.TypeSet<$Function, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Function, $.Cardinality.Many), null);

export type $FutureBehaviorλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
}>;
type $FutureBehavior = $.ObjectType<"schema::FutureBehavior", $FutureBehaviorλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
]>;
const $FutureBehavior = $.makeType<$FutureBehavior>(_.spec, "a46efc47-5b25-11ed-8ee1-37468200f95e", _.syntax.literal);

const FutureBehavior: $.$expr_PathNode<$.TypeSet<$FutureBehavior, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($FutureBehavior, $.Cardinality.Many), null);

export type $GlobalλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
  "target": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "required": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "cardinality": $.PropertyDesc<$Cardinality, $.Cardinality.AtMostOne, false, false, false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<used_globals[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<used_globals": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Global = $.ObjectType<"schema::Global", $GlobalλShape, null, [
  ...$AnnotationSubject['__exclusives__'],
]>;
const $Global = $.makeType<$Global>(_.spec, "a369ad0e-5b25-11ed-a448-f9036939cea9", _.syntax.literal);

const Global: $.$expr_PathNode<$.TypeSet<$Global, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Global, $.Cardinality.Many), null);

export type $IndexλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "except_expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<indexes[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<indexes[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<indexes[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<indexes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Index = $.ObjectType<"schema::Index", $IndexλShape, null, [
  ...$InheritingObject['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
]>;
const $Index = $.makeType<$Index>(_.spec, "a02b9c3a-5b25-11ed-ba53-4f2c834b74e4", _.syntax.literal);

const Index: $.$expr_PathNode<$.TypeSet<$Index, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Index, $.Cardinality.Many), null);

export type $PointerλShape = $.typeutil.flatten<$InheritingObjectλShape & $ConsistencySubjectλShape & $AnnotationSubjectλShape & {
  "source": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "target": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "cardinality": $.PropertyDesc<$Cardinality, $.Cardinality.AtMostOne, false, false, false, false>;
  "required": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "readonly": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<pointers[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<pointers[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<pointers[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<pointers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Pointer = $.ObjectType<"schema::Pointer", $PointerλShape, null, [
  ...$InheritingObject['__exclusives__'],
  ...$ConsistencySubject['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
]>;
const $Pointer = $.makeType<$Pointer>(_.spec, "a06e903e-5b25-11ed-b246-15eb4b2b70ce", _.syntax.literal);

const Pointer: $.$expr_PathNode<$.TypeSet<$Pointer, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Pointer, $.Cardinality.Many), null);

export type $SourceλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
  "pointers": $.LinkDesc<$Pointer, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "indexes": $.LinkDesc<$Index, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "<source[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<source[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<source[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<source": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Source = $.ObjectType<"schema::Source", $SourceλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
  {pointers: {__element__: $Pointer, __cardinality__: $.Cardinality.Many},},
  {indexes: {__element__: $Index, __cardinality__: $.Cardinality.Many},},
]>;
const $Source = $.makeType<$Source>(_.spec, "a0567301-5b25-11ed-a636-d50935807ed6", _.syntax.literal);

const Source: $.$expr_PathNode<$.TypeSet<$Source, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Source, $.Cardinality.Many), null);

export type $LinkλShape = $.typeutil.flatten<Omit<$PointerλShape, "target"> & $SourceλShape & {
  "target": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "properties": $.LinkDesc<$Property, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, false, true, false, false>;
  "on_target_delete": $.PropertyDesc<$TargetDeleteAction, $.Cardinality.AtMostOne, false, false, false, false>;
  "on_source_delete": $.PropertyDesc<$SourceDeleteAction, $.Cardinality.AtMostOne, false, false, false, false>;
  "<links[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<links": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Link = $.ObjectType<"schema::Link", $LinkλShape, null, [
  ...$Pointer['__exclusives__'],
  ...$Source['__exclusives__'],
]>;
const $Link = $.makeType<$Link>(_.spec, "a24d2971-5b25-11ed-9102-9f9c712b3041", _.syntax.literal);

const Link: $.$expr_PathNode<$.TypeSet<$Link, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Link, $.Cardinality.Many), null);

export type $MigrationλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $Object_9e146b225b2511ed8a35b350570a9c58λShape & {
  "parents": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false,  false, false>;
  "script": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "message": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<parents[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false,  false, false>;
  "<parents": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Migration = $.ObjectType<"schema::Migration", $MigrationλShape, null, [
  ...$AnnotationSubject['__exclusives__'],
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
]>;
const $Migration = $.makeType<$Migration>(_.spec, "a427350f-5b25-11ed-9710-1b836a707e0a", _.syntax.literal);

const Migration: $.$expr_PathNode<$.TypeSet<$Migration, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Migration, $.Cardinality.Many), null);

export type $ModuleλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & $AnnotationSubjectλShape & {
}>;
type $Module = $.ObjectType<"schema::Module", $ModuleλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
]>;
const $Module = $.makeType<$Module>(_.spec, "9e93d9ad-5b25-11ed-8bba-f739cc71e541", _.syntax.literal);

const Module: $.$expr_PathNode<$.TypeSet<$Module, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Module, $.Cardinality.Many), null);

export type $ObjectTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & Omit<$ConsistencySubjectλShape, "<subject"> & $AnnotationSubjectλShape & Omit<$TypeλShape, "<target"> & $SourceλShape & {
  "union_of": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "intersection_of": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "links": $.LinkDesc<$Link, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, false, true, false, false>;
  "properties": $.LinkDesc<$Property, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, false, true, false, false>;
  "access_policies": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "compound_type": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "is_compound_type": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "<__type__[is std::BaseObject]": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::TupleElement]": $.LinkDesc<$TupleElement, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is std::FreeObject]": $.LinkDesc<_std.$FreeObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Object]": $.LinkDesc<$Object_9e146b225b2511ed8a35b350570a9c58, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Delta]": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::AnnotationSubject]": $.LinkDesc<$AnnotationSubject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::VolatilitySubject]": $.LinkDesc<$VolatilitySubject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::SubclassableObject]": $.LinkDesc<$SubclassableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is std::Object]": $.LinkDesc<_std.$Object_9d92cf705b2511ed848a275bef45d8e3, $.Cardinality.Many, {}, false, false,  false, false>;
  "<union_of[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<intersection_of[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subject[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::FutureBehavior]": $.LinkDesc<$FutureBehavior, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is sys::SystemObject]": $.LinkDesc<_sys.$SystemObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::ConfigObject]": $.LinkDesc<_cfg.$ConfigObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::AuthMethod]": $.LinkDesc<_cfg.$AuthMethod, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::Trust]": $.LinkDesc<_cfg.$Trust, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::SCRAM]": $.LinkDesc<_cfg.$SCRAM, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::JWT]": $.LinkDesc<_cfg.$JWT, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::Auth]": $.LinkDesc<_cfg.$Auth, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::AbstractConfig]": $.LinkDesc<_cfg.$AbstractConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::Config]": $.LinkDesc<_cfg.$Config, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::InstanceConfig]": $.LinkDesc<_cfg.$InstanceConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::DatabaseConfig]": $.LinkDesc<_cfg.$DatabaseConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Annotation]": $.LinkDesc<$Annotation, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Type]": $.LinkDesc<$Type, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::PrimitiveType]": $.LinkDesc<$PrimitiveType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::CollectionType]": $.LinkDesc<$CollectionType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Array]": $.LinkDesc<$Array, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Tuple]": $.LinkDesc<$Tuple, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Range]": $.LinkDesc<$Range, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Parameter]": $.LinkDesc<$Parameter, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Module]": $.LinkDesc<$Module, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::PseudoType]": $.LinkDesc<$PseudoType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::ConsistencySubject]": $.LinkDesc<$ConsistencySubject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is sys::Role]": $.LinkDesc<_sys.$Role, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is sys::ExtensionPackage]": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Extension]": $.LinkDesc<$Extension, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is sys::Database]": $.LinkDesc<_sys.$Database, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is Account]": $.LinkDesc<_default.$Account, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is User]": $.LinkDesc<_default.$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is Session]": $.LinkDesc<_default.$Session, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is VerificationToken]": $.LinkDesc<_default.$VerificationToken, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<intersection_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subject": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<union_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ObjectType = $.ObjectType<"schema::ObjectType", $ObjectTypeλShape, null, [
  ...$InheritingObject['__exclusives__'],
  ...$ConsistencySubject['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
  ...$Type['__exclusives__'],
  ...$Source['__exclusives__'],
  {access_policies: {__element__: $AccessPolicy, __cardinality__: $.Cardinality.Many},},
]>;
const $ObjectType = $.makeType<$ObjectType>(_.spec, "a141d589-5b25-11ed-96fa-c3f661fad38e", _.syntax.literal);

const ObjectType: $.$expr_PathNode<$.TypeSet<$ObjectType, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ObjectType, $.Cardinality.Many), null);

export type $OperatorλShape = $.typeutil.flatten<$CallableObjectλShape & $VolatilitySubjectλShape & {
  "operator_kind": $.PropertyDesc<$OperatorKind, $.Cardinality.AtMostOne, false, false, false, false>;
  "is_abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, true>;
  "abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
type $Operator = $.ObjectType<"schema::Operator", $OperatorλShape, null, [
  ...$CallableObject['__exclusives__'],
  ...$VolatilitySubject['__exclusives__'],
]>;
const $Operator = $.makeType<$Operator>(_.spec, "a3c81c7b-5b25-11ed-8e1c-affc2607dc4f", _.syntax.literal);

const Operator: $.$expr_PathNode<$.TypeSet<$Operator, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Operator, $.Cardinality.Many), null);

export type $ParameterλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
  "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "typemod": $.PropertyDesc<$TypeModifier, $.Cardinality.One, false, false, false, false>;
  "kind": $.PropertyDesc<$ParameterKind, $.Cardinality.One, false, false, false, false>;
  "num": $.PropertyDesc<_std.$int64, $.Cardinality.One, false, false, false, false>;
  "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<params[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<params[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false,  false, false>;
  "<params[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<params[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<params": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Parameter = $.ObjectType<"schema::Parameter", $ParameterλShape, null, [
  ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
]>;
const $Parameter = $.makeType<$Parameter>(_.spec, "9f91545b-5b25-11ed-bf63-f18437de89d9", _.syntax.literal);

const Parameter: $.$expr_PathNode<$.TypeSet<$Parameter, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Parameter, $.Cardinality.Many), null);

export type $PropertyλShape = $.typeutil.flatten<$PointerλShape & {
  "<properties[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<properties[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<properties": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Property = $.ObjectType<"schema::Property", $PropertyλShape, null, [
  ...$Pointer['__exclusives__'],
]>;
const $Property = $.makeType<$Property>(_.spec, "a2e6f5ff-5b25-11ed-a522-695e49729309", _.syntax.literal);

const Property: $.$expr_PathNode<$.TypeSet<$Property, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Property, $.Cardinality.Many), null);

export type $PseudoTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & $TypeλShape & {
}>;
type $PseudoType = $.ObjectType<"schema::PseudoType", $PseudoTypeλShape, null, [
  ...$InheritingObject['__exclusives__'],
  ...$Type['__exclusives__'],
]>;
const $PseudoType = $.makeType<$PseudoType>(_.spec, "9e44f051-5b25-11ed-a8b0-1994e99eac0c", _.syntax.literal);

const PseudoType: $.$expr_PathNode<$.TypeSet<$PseudoType, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($PseudoType, $.Cardinality.Many), null);

export type $RangeλShape = $.typeutil.flatten<$CollectionTypeλShape & {
  "element_type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $Range = $.ObjectType<"schema::Range", $RangeλShape, null, [
  ...$CollectionType['__exclusives__'],
]>;
const $Range = $.makeType<$Range>(_.spec, "9f18f980-5b25-11ed-b29f-fd87a6176640", _.syntax.literal);

const Range: $.$expr_PathNode<$.TypeSet<$Range, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Range, $.Cardinality.Many), null);

export type $ScalarTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & $ConsistencySubjectλShape & $AnnotationSubjectλShape & $PrimitiveTypeλShape & {
  "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "enum_values": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $ScalarType = $.ObjectType<"schema::ScalarType", $ScalarTypeλShape, null, [
  ...$InheritingObject['__exclusives__'],
  ...$ConsistencySubject['__exclusives__'],
  ...$AnnotationSubject['__exclusives__'],
  ...$PrimitiveType['__exclusives__'],
]>;
const $ScalarType = $.makeType<$ScalarType>(_.spec, "a0fbe6ee-5b25-11ed-b641-31c619df2be4", _.syntax.literal);

const ScalarType: $.$expr_PathNode<$.TypeSet<$ScalarType, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ScalarType, $.Cardinality.Many), null);

export type $TupleλShape = $.typeutil.flatten<$CollectionTypeλShape & {
  "element_types": $.LinkDesc<$TupleElement, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "named": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, false>;
}>;
type $Tuple = $.ObjectType<"schema::Tuple", $TupleλShape, null, [
  ...$CollectionType['__exclusives__'],
  {element_types: {__element__: $TupleElement, __cardinality__: $.Cardinality.Many},},
]>;
const $Tuple = $.makeType<$Tuple>(_.spec, "9ef7d724-5b25-11ed-97dc-053995787bea", _.syntax.literal);

const Tuple: $.$expr_PathNode<$.TypeSet<$Tuple, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Tuple, $.Cardinality.Many), null);

export type $TupleElementλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
  "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<element_types[is schema::Tuple]": $.LinkDesc<$Tuple, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<element_types": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $TupleElement = $.ObjectType<"schema::TupleElement", $TupleElementλShape, null, [
  ..._std.$BaseObject['__exclusives__'],
]>;
const $TupleElement = $.makeType<$TupleElement>(_.spec, "9eed0218-5b25-11ed-a0e8-31ea407ae0b5", _.syntax.literal);

const TupleElement: $.$expr_PathNode<$.TypeSet<$TupleElement, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($TupleElement, $.Cardinality.Many), null);



export { AccessKind, AccessPolicyAction, Cardinality, OperatorKind, ParameterKind, SourceDeleteAction, TargetDeleteAction, TypeModifier, Volatility, $Object_9e146b225b2511ed8a35b350570a9c58, Object_9e146b225b2511ed8a35b350570a9c58, $SubclassableObject, SubclassableObject, $InheritingObject, InheritingObject, $AnnotationSubject, AnnotationSubject, $AccessPolicy, AccessPolicy, $Alias, Alias, $Annotation, Annotation, $Type, Type, $PrimitiveType, PrimitiveType, $CollectionType, CollectionType, $Array, Array, $CallableObject, CallableObject, $VolatilitySubject, VolatilitySubject, $Cast, Cast, $ConsistencySubject, ConsistencySubject, $Constraint, Constraint, $Delta, Delta, $Extension, Extension, $Function, Function, $FutureBehavior, FutureBehavior, $Global, Global, $Index, Index, $Pointer, Pointer, $Source, Source, $Link, Link, $Migration, Migration, $Module, Module, $ObjectType, ObjectType, $Operator, Operator, $Parameter, Parameter, $Property, Property, $PseudoType, PseudoType, $Range, Range, $ScalarType, ScalarType, $Tuple, Tuple, $TupleElement, TupleElement };

type __defaultExports = {
  "AccessKind": typeof AccessKind;
  "AccessPolicyAction": typeof AccessPolicyAction;
  "Cardinality": typeof Cardinality;
  "OperatorKind": typeof OperatorKind;
  "ParameterKind": typeof ParameterKind;
  "SourceDeleteAction": typeof SourceDeleteAction;
  "TargetDeleteAction": typeof TargetDeleteAction;
  "TypeModifier": typeof TypeModifier;
  "Volatility": typeof Volatility;
  "Object": typeof Object_9e146b225b2511ed8a35b350570a9c58;
  "SubclassableObject": typeof SubclassableObject;
  "InheritingObject": typeof InheritingObject;
  "AnnotationSubject": typeof AnnotationSubject;
  "AccessPolicy": typeof AccessPolicy;
  "Alias": typeof Alias;
  "Annotation": typeof Annotation;
  "Type": typeof Type;
  "PrimitiveType": typeof PrimitiveType;
  "CollectionType": typeof CollectionType;
  "Array": typeof Array;
  "CallableObject": typeof CallableObject;
  "VolatilitySubject": typeof VolatilitySubject;
  "Cast": typeof Cast;
  "ConsistencySubject": typeof ConsistencySubject;
  "Constraint": typeof Constraint;
  "Delta": typeof Delta;
  "Extension": typeof Extension;
  "Function": typeof Function;
  "FutureBehavior": typeof FutureBehavior;
  "Global": typeof Global;
  "Index": typeof Index;
  "Pointer": typeof Pointer;
  "Source": typeof Source;
  "Link": typeof Link;
  "Migration": typeof Migration;
  "Module": typeof Module;
  "ObjectType": typeof ObjectType;
  "Operator": typeof Operator;
  "Parameter": typeof Parameter;
  "Property": typeof Property;
  "PseudoType": typeof PseudoType;
  "Range": typeof Range;
  "ScalarType": typeof ScalarType;
  "Tuple": typeof Tuple;
  "TupleElement": typeof TupleElement
};
const __defaultExports: __defaultExports = {
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
export default __defaultExports;
