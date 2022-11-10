import * as $ from "../reflection";
import type * as _std from "./std";
import type * as _sys from "./sys";
import type * as _cfg from "./cfg";
import type * as _default from "./default";
export declare type $AccessKind = {
    Select: $.$expr_Literal<$AccessKind>;
    UpdateRead: $.$expr_Literal<$AccessKind>;
    UpdateWrite: $.$expr_Literal<$AccessKind>;
    Delete: $.$expr_Literal<$AccessKind>;
    Insert: $.$expr_Literal<$AccessKind>;
} & $.EnumType<"schema::AccessKind", ["Select", "UpdateRead", "UpdateWrite", "Delete", "Insert"]>;
declare const AccessKind: $AccessKind;
export declare type $AccessPolicyAction = {
    Allow: $.$expr_Literal<$AccessPolicyAction>;
    Deny: $.$expr_Literal<$AccessPolicyAction>;
} & $.EnumType<"schema::AccessPolicyAction", ["Allow", "Deny"]>;
declare const AccessPolicyAction: $AccessPolicyAction;
export declare type $Cardinality = {
    One: $.$expr_Literal<$Cardinality>;
    Many: $.$expr_Literal<$Cardinality>;
} & $.EnumType<"schema::Cardinality", ["One", "Many"]>;
declare const Cardinality: $Cardinality;
export declare type $OperatorKind = {
    Infix: $.$expr_Literal<$OperatorKind>;
    Postfix: $.$expr_Literal<$OperatorKind>;
    Prefix: $.$expr_Literal<$OperatorKind>;
    Ternary: $.$expr_Literal<$OperatorKind>;
} & $.EnumType<"schema::OperatorKind", ["Infix", "Postfix", "Prefix", "Ternary"]>;
declare const OperatorKind: $OperatorKind;
export declare type $ParameterKind = {
    VariadicParam: $.$expr_Literal<$ParameterKind>;
    NamedOnlyParam: $.$expr_Literal<$ParameterKind>;
    PositionalParam: $.$expr_Literal<$ParameterKind>;
} & $.EnumType<"schema::ParameterKind", ["VariadicParam", "NamedOnlyParam", "PositionalParam"]>;
declare const ParameterKind: $ParameterKind;
export declare type $SourceDeleteAction = {
    DeleteTarget: $.$expr_Literal<$SourceDeleteAction>;
    Allow: $.$expr_Literal<$SourceDeleteAction>;
    DeleteTargetIfOrphan: $.$expr_Literal<$SourceDeleteAction>;
} & $.EnumType<"schema::SourceDeleteAction", ["DeleteTarget", "Allow", "DeleteTargetIfOrphan"]>;
declare const SourceDeleteAction: $SourceDeleteAction;
export declare type $TargetDeleteAction = {
    Restrict: $.$expr_Literal<$TargetDeleteAction>;
    DeleteSource: $.$expr_Literal<$TargetDeleteAction>;
    Allow: $.$expr_Literal<$TargetDeleteAction>;
    DeferredRestrict: $.$expr_Literal<$TargetDeleteAction>;
} & $.EnumType<"schema::TargetDeleteAction", ["Restrict", "DeleteSource", "Allow", "DeferredRestrict"]>;
declare const TargetDeleteAction: $TargetDeleteAction;
export declare type $TypeModifier = {
    SetOfType: $.$expr_Literal<$TypeModifier>;
    OptionalType: $.$expr_Literal<$TypeModifier>;
    SingletonType: $.$expr_Literal<$TypeModifier>;
} & $.EnumType<"schema::TypeModifier", ["SetOfType", "OptionalType", "SingletonType"]>;
declare const TypeModifier: $TypeModifier;
export declare type $Volatility = {
    Immutable: $.$expr_Literal<$Volatility>;
    Stable: $.$expr_Literal<$Volatility>;
    Volatile: $.$expr_Literal<$Volatility>;
} & $.EnumType<"schema::Volatility", ["Immutable", "Stable", "Volatile"]>;
declare const Volatility: $Volatility;
export declare type $Object_9e146b225b2511ed8a35b350570a9c58λShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
    "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "internal": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
    "builtin": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
    "computed_fields": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
declare type $Object_9e146b225b2511ed8a35b350570a9c58 = $.ObjectType<"schema::Object", $Object_9e146b225b2511ed8a35b350570a9c58λShape, null, [
    ..._std.$BaseObject['__exclusives__']
]>;
declare const $Object_9e146b225b2511ed8a35b350570a9c58: $Object_9e146b225b2511ed8a35b350570a9c58;
declare const Object_9e146b225b2511ed8a35b350570a9c58: $.$expr_PathNode<$.TypeSet<$Object_9e146b225b2511ed8a35b350570a9c58, $.Cardinality.Many>, null>;
export declare type $SubclassableObjectλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
    "abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
    "is_abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, true>;
    "final": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
    "is_final": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
}>;
declare type $SubclassableObject = $.ObjectType<"schema::SubclassableObject", $SubclassableObjectλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__']
]>;
declare const $SubclassableObject: $SubclassableObject;
declare const SubclassableObject: $.$expr_PathNode<$.TypeSet<$SubclassableObject, $.Cardinality.Many>, null>;
export declare type $InheritingObjectλShape = $.typeutil.flatten<$SubclassableObjectλShape & {
    "bases": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {
        "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
    }, false, false, false, false>;
    "ancestors": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {
        "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
    }, false, false, false, false>;
    "inherited_fields": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
    "<bases[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false, false, false>;
    "<ancestors": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<bases": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $InheritingObject = $.ObjectType<"schema::InheritingObject", $InheritingObjectλShape, null, [
    ...$SubclassableObject['__exclusives__']
]>;
declare const $InheritingObject: $InheritingObject;
declare const InheritingObject: $.$expr_PathNode<$.TypeSet<$InheritingObject, $.Cardinality.Many>, null>;
export declare type $AnnotationSubjectλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
    "annotations": $.LinkDesc<$Annotation, $.Cardinality.Many, {
        "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
        "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
        "@value": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne>;
    }, false, false, false, false>;
}>;
declare type $AnnotationSubject = $.ObjectType<"schema::AnnotationSubject", $AnnotationSubjectλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__']
]>;
declare const $AnnotationSubject: $AnnotationSubject;
declare const AnnotationSubject: $.$expr_PathNode<$.TypeSet<$AnnotationSubject, $.Cardinality.Many>, null>;
export declare type $AccessPolicyλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
    "subject": $.LinkDesc<$ObjectType, $.Cardinality.One, {}, false, false, false, false>;
    "access_kinds": $.PropertyDesc<$AccessKind, $.Cardinality.Many, false, false, false, false>;
    "condition": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "action": $.PropertyDesc<$AccessPolicyAction, $.Cardinality.One, false, false, false, false>;
    "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<access_policies[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<access_policies": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $AccessPolicy = $.ObjectType<"schema::AccessPolicy", $AccessPolicyλShape, null, [
    ...$InheritingObject['__exclusives__'],
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $AccessPolicy: $AccessPolicy;
declare const AccessPolicy: $.$expr_PathNode<$.TypeSet<$AccessPolicy, $.Cardinality.Many>, null>;
export declare type $AliasλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
    "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false, false, false>;
    "expr": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
}>;
declare type $Alias = $.ObjectType<"schema::Alias", $AliasλShape, null, [
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $Alias: $Alias;
declare const Alias: $.$expr_PathNode<$.TypeSet<$Alias, $.Cardinality.Many>, null>;
export declare type $AnnotationλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
    "inheritable": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
    "<annotations[is schema::AnnotationSubject]": $.LinkDesc<$AnnotationSubject, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is sys::SystemObject]": $.LinkDesc<_sys.$SystemObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Annotation]": $.LinkDesc<$Annotation, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is sys::Role]": $.LinkDesc<_sys.$Role, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is sys::ExtensionPackage]": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is schema::Extension]": $.LinkDesc<$Extension, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations[is sys::Database]": $.LinkDesc<_sys.$Database, $.Cardinality.Many, {}, false, false, false, false>;
    "<annotations": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Annotation = $.ObjectType<"schema::Annotation", $AnnotationλShape, null, [
    ...$InheritingObject['__exclusives__'],
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $Annotation: $Annotation;
declare const Annotation: $.$expr_PathNode<$.TypeSet<$Annotation, $.Cardinality.Many>, null>;
export declare type $TypeλShape = $.typeutil.flatten<$SubclassableObjectλShape & $AnnotationSubjectλShape & {
    "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "from_alias": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
    "is_from_alias": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, false>;
    "<element_type[is schema::Array]": $.LinkDesc<$Array, $.Cardinality.Many, {}, false, false, false, false>;
    "<type[is schema::TupleElement]": $.LinkDesc<$TupleElement, $.Cardinality.Many, {}, false, false, false, false>;
    "<element_type[is schema::Range]": $.LinkDesc<$Range, $.Cardinality.Many, {}, false, false, false, false>;
    "<type[is schema::Parameter]": $.LinkDesc<$Parameter, $.Cardinality.Many, {}, false, false, false, false>;
    "<return_type[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<type[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false, false, false>;
    "<target[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false, false, false>;
    "<target[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false, false, false>;
    "<from_type[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false, false, false>;
    "<to_type[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false, false, false>;
    "<return_type[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false, false, false>;
    "<return_type[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false, false, false>;
    "<return_type[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false, false, false>;
    "<target[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false, false, false>;
    "<element_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<from_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<return_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<target": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<to_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Type = $.ObjectType<"schema::Type", $TypeλShape, null, [
    ...$SubclassableObject['__exclusives__'],
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $Type: $Type;
declare const Type: $.$expr_PathNode<$.TypeSet<$Type, $.Cardinality.Many>, null>;
export declare type $PrimitiveTypeλShape = $.typeutil.flatten<$TypeλShape & {}>;
declare type $PrimitiveType = $.ObjectType<"schema::PrimitiveType", $PrimitiveTypeλShape, null, [
    ...$Type['__exclusives__']
]>;
declare const $PrimitiveType: $PrimitiveType;
declare const PrimitiveType: $.$expr_PathNode<$.TypeSet<$PrimitiveType, $.Cardinality.Many>, null>;
export declare type $CollectionTypeλShape = $.typeutil.flatten<$PrimitiveTypeλShape & {}>;
declare type $CollectionType = $.ObjectType<"schema::CollectionType", $CollectionTypeλShape, null, [
    ...$PrimitiveType['__exclusives__']
]>;
declare const $CollectionType: $CollectionType;
declare const CollectionType: $.$expr_PathNode<$.TypeSet<$CollectionType, $.Cardinality.Many>, null>;
export declare type $ArrayλShape = $.typeutil.flatten<$CollectionTypeλShape & {
    "element_type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false, false, false>;
    "dimensions": $.PropertyDesc<$.ArrayType<_std.$int16>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
declare type $Array = $.ObjectType<"schema::Array", $ArrayλShape, null, [
    ...$CollectionType['__exclusives__']
]>;
declare const $Array: $Array;
declare const Array: $.$expr_PathNode<$.TypeSet<$Array, $.Cardinality.Many>, null>;
export declare type $CallableObjectλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
    "params": $.LinkDesc<$Parameter, $.Cardinality.Many, {
        "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
    }, false, false, false, false>;
    "return_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "return_typemod": $.PropertyDesc<$TypeModifier, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
declare type $CallableObject = $.ObjectType<"schema::CallableObject", $CallableObjectλShape, null, [
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $CallableObject: $CallableObject;
declare const CallableObject: $.$expr_PathNode<$.TypeSet<$CallableObject, $.Cardinality.Many>, null>;
export declare type $VolatilitySubjectλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
    "volatility": $.PropertyDesc<$Volatility, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
declare type $VolatilitySubject = $.ObjectType<"schema::VolatilitySubject", $VolatilitySubjectλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__']
]>;
declare const $VolatilitySubject: $VolatilitySubject;
declare const VolatilitySubject: $.$expr_PathNode<$.TypeSet<$VolatilitySubject, $.Cardinality.Many>, null>;
export declare type $CastλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $VolatilitySubjectλShape & {
    "from_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "to_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "allow_implicit": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
    "allow_assignment": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
declare type $Cast = $.ObjectType<"schema::Cast", $CastλShape, null, [
    ...$AnnotationSubject['__exclusives__'],
    ...$VolatilitySubject['__exclusives__']
]>;
declare const $Cast: $Cast;
declare const Cast: $.$expr_PathNode<$.TypeSet<$Cast, $.Cardinality.Many>, null>;
export declare type $ConsistencySubjectλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & $InheritingObjectλShape & $AnnotationSubjectλShape & {
    "constraints": $.LinkDesc<$Constraint, $.Cardinality.Many, {
        "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
        "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    }, true, false, false, false>;
    "<subject[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false, false, false>;
    "<subject": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $ConsistencySubject = $.ObjectType<"schema::ConsistencySubject", $ConsistencySubjectλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
    ...$InheritingObject['__exclusives__'],
    ...$AnnotationSubject['__exclusives__'],
    {
        constraints: {
            __element__: $Constraint;
            __cardinality__: $.Cardinality.Many;
        };
    }
]>;
declare const $ConsistencySubject: $ConsistencySubject;
declare const ConsistencySubject: $.$expr_PathNode<$.TypeSet<$ConsistencySubject, $.Cardinality.Many>, null>;
export declare type $ConstraintλShape = $.typeutil.flatten<Omit<$CallableObjectλShape, "params"> & $InheritingObjectλShape & {
    "subject": $.LinkDesc<$ConsistencySubject, $.Cardinality.AtMostOne, {}, false, false, false, false>;
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
    "<constraints[is schema::ConsistencySubject]": $.LinkDesc<$ConsistencySubject, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<constraints[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<constraints[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<constraints[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<constraints[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<constraints[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<constraints": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Constraint = $.ObjectType<"schema::Constraint", $ConstraintλShape, null, [
    ...$CallableObject['__exclusives__'],
    ...$InheritingObject['__exclusives__']
]>;
declare const $Constraint: $Constraint;
declare const Constraint: $.$expr_PathNode<$.TypeSet<$Constraint, $.Cardinality.Many>, null>;
export declare type $DeltaλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
    "parents": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false, false, false>;
    "<parents[is schema::Delta]": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false, false, false>;
    "<parents": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Delta = $.ObjectType<"schema::Delta", $DeltaλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__']
]>;
declare const $Delta: $Delta;
declare const Delta: $.$expr_PathNode<$.TypeSet<$Delta, $.Cardinality.Many>, null>;
export declare type $ExtensionλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $Object_9e146b225b2511ed8a35b350570a9c58λShape & {
    "package": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.One, {}, true, false, false, false>;
}>;
declare type $Extension = $.ObjectType<"schema::Extension", $ExtensionλShape, null, [
    ...$AnnotationSubject['__exclusives__'],
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
    {
        package: {
            __element__: _sys.$ExtensionPackage;
            __cardinality__: $.Cardinality.One;
        };
    }
]>;
declare const $Extension: $Extension;
declare const Extension: $.$expr_PathNode<$.TypeSet<$Extension, $.Cardinality.Many>, null>;
export declare type $FunctionλShape = $.typeutil.flatten<$CallableObjectλShape & $VolatilitySubjectλShape & {
    "used_globals": $.LinkDesc<$Global, $.Cardinality.Many, {
        "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
    }, false, false, false, false>;
    "body": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "language": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "preserves_optionality": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
declare type $Function = $.ObjectType<"schema::Function", $FunctionλShape, null, [
    ...$CallableObject['__exclusives__'],
    ...$VolatilitySubject['__exclusives__']
]>;
declare const $Function: $Function;
declare const Function: $.$expr_PathNode<$.TypeSet<$Function, $.Cardinality.Many>, null>;
export declare type $FutureBehaviorλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {}>;
declare type $FutureBehavior = $.ObjectType<"schema::FutureBehavior", $FutureBehaviorλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__']
]>;
declare const $FutureBehavior: $FutureBehavior;
declare const FutureBehavior: $.$expr_PathNode<$.TypeSet<$FutureBehavior, $.Cardinality.Many>, null>;
export declare type $GlobalλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
    "target": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false, false, false>;
    "required": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
    "cardinality": $.PropertyDesc<$Cardinality, $.Cardinality.AtMostOne, false, false, false, false>;
    "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<used_globals[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false, false, false>;
    "<used_globals": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Global = $.ObjectType<"schema::Global", $GlobalλShape, null, [
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $Global: $Global;
declare const Global: $.$expr_PathNode<$.TypeSet<$Global, $.Cardinality.Many>, null>;
export declare type $IndexλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
    "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "except_expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<indexes[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<indexes[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<indexes[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<indexes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Index = $.ObjectType<"schema::Index", $IndexλShape, null, [
    ...$InheritingObject['__exclusives__'],
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $Index: $Index;
declare const Index: $.$expr_PathNode<$.TypeSet<$Index, $.Cardinality.Many>, null>;
export declare type $PointerλShape = $.typeutil.flatten<$InheritingObjectλShape & $ConsistencySubjectλShape & $AnnotationSubjectλShape & {
    "source": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "target": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "cardinality": $.PropertyDesc<$Cardinality, $.Cardinality.AtMostOne, false, false, false, false>;
    "required": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
    "readonly": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
    "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<pointers[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<pointers[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<pointers[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<pointers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Pointer = $.ObjectType<"schema::Pointer", $PointerλShape, null, [
    ...$InheritingObject['__exclusives__'],
    ...$ConsistencySubject['__exclusives__'],
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $Pointer: $Pointer;
declare const Pointer: $.$expr_PathNode<$.TypeSet<$Pointer, $.Cardinality.Many>, null>;
export declare type $SourceλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
    "pointers": $.LinkDesc<$Pointer, $.Cardinality.Many, {
        "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
        "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    }, true, false, false, false>;
    "indexes": $.LinkDesc<$Index, $.Cardinality.Many, {
        "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
        "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    }, true, false, false, false>;
    "<source[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false, false, false>;
    "<source[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false, false, false>;
    "<source[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false, false, false>;
    "<source": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Source = $.ObjectType<"schema::Source", $SourceλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
    {
        pointers: {
            __element__: $Pointer;
            __cardinality__: $.Cardinality.Many;
        };
    },
    {
        indexes: {
            __element__: $Index;
            __cardinality__: $.Cardinality.Many;
        };
    }
]>;
declare const $Source: $Source;
declare const Source: $.$expr_PathNode<$.TypeSet<$Source, $.Cardinality.Many>, null>;
export declare type $LinkλShape = $.typeutil.flatten<Omit<$PointerλShape, "target"> & $SourceλShape & {
    "target": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "properties": $.LinkDesc<$Property, $.Cardinality.Many, {
        "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
        "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    }, false, true, false, false>;
    "on_target_delete": $.PropertyDesc<$TargetDeleteAction, $.Cardinality.AtMostOne, false, false, false, false>;
    "on_source_delete": $.PropertyDesc<$SourceDeleteAction, $.Cardinality.AtMostOne, false, false, false, false>;
    "<links[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<links": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Link = $.ObjectType<"schema::Link", $LinkλShape, null, [
    ...$Pointer['__exclusives__'],
    ...$Source['__exclusives__']
]>;
declare const $Link: $Link;
declare const Link: $.$expr_PathNode<$.TypeSet<$Link, $.Cardinality.Many>, null>;
export declare type $MigrationλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $Object_9e146b225b2511ed8a35b350570a9c58λShape & {
    "parents": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false, false, false>;
    "script": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "message": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<parents[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false, false, false>;
    "<parents": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Migration = $.ObjectType<"schema::Migration", $MigrationλShape, null, [
    ...$AnnotationSubject['__exclusives__'],
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__']
]>;
declare const $Migration: $Migration;
declare const Migration: $.$expr_PathNode<$.TypeSet<$Migration, $.Cardinality.Many>, null>;
export declare type $ModuleλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & $AnnotationSubjectλShape & {}>;
declare type $Module = $.ObjectType<"schema::Module", $ModuleλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__'],
    ...$AnnotationSubject['__exclusives__']
]>;
declare const $Module: $Module;
declare const Module: $.$expr_PathNode<$.TypeSet<$Module, $.Cardinality.Many>, null>;
export declare type $ObjectTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & Omit<$ConsistencySubjectλShape, "<subject"> & $AnnotationSubjectλShape & Omit<$TypeλShape, "<target"> & $SourceλShape & {
    "union_of": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "intersection_of": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
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
    "<__type__[is std::BaseObject]": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::TupleElement]": $.LinkDesc<$TupleElement, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is std::FreeObject]": $.LinkDesc<_std.$FreeObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Object]": $.LinkDesc<$Object_9e146b225b2511ed8a35b350570a9c58, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Delta]": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::AnnotationSubject]": $.LinkDesc<$AnnotationSubject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::VolatilitySubject]": $.LinkDesc<$VolatilitySubject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::SubclassableObject]": $.LinkDesc<$SubclassableObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is std::Object]": $.LinkDesc<_std.$Object_9d92cf705b2511ed848a275bef45d8e3, $.Cardinality.Many, {}, false, false, false, false>;
    "<union_of[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<intersection_of[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<subject[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::FutureBehavior]": $.LinkDesc<$FutureBehavior, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is sys::SystemObject]": $.LinkDesc<_sys.$SystemObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::ConfigObject]": $.LinkDesc<_cfg.$ConfigObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::AuthMethod]": $.LinkDesc<_cfg.$AuthMethod, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::Trust]": $.LinkDesc<_cfg.$Trust, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::SCRAM]": $.LinkDesc<_cfg.$SCRAM, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::JWT]": $.LinkDesc<_cfg.$JWT, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::Auth]": $.LinkDesc<_cfg.$Auth, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::AbstractConfig]": $.LinkDesc<_cfg.$AbstractConfig, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::Config]": $.LinkDesc<_cfg.$Config, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::InstanceConfig]": $.LinkDesc<_cfg.$InstanceConfig, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is cfg::DatabaseConfig]": $.LinkDesc<_cfg.$DatabaseConfig, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Annotation]": $.LinkDesc<$Annotation, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Type]": $.LinkDesc<$Type, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::PrimitiveType]": $.LinkDesc<$PrimitiveType, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::CollectionType]": $.LinkDesc<$CollectionType, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Array]": $.LinkDesc<$Array, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Tuple]": $.LinkDesc<$Tuple, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Range]": $.LinkDesc<$Range, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Parameter]": $.LinkDesc<$Parameter, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Module]": $.LinkDesc<$Module, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::PseudoType]": $.LinkDesc<$PseudoType, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::ConsistencySubject]": $.LinkDesc<$ConsistencySubject, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.Many, {}, false, false, false, false>;
    "<target[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is sys::Role]": $.LinkDesc<_sys.$Role, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is sys::ExtensionPackage]": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is schema::Extension]": $.LinkDesc<$Extension, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is sys::Database]": $.LinkDesc<_sys.$Database, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is Account]": $.LinkDesc<_default.$Account, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is User]": $.LinkDesc<_default.$User, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is Session]": $.LinkDesc<_default.$Session, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__[is VerificationToken]": $.LinkDesc<_default.$VerificationToken, $.Cardinality.Many, {}, false, false, false, false>;
    "<__type__": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<intersection_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<subject": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<target": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<union_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $ObjectType = $.ObjectType<"schema::ObjectType", $ObjectTypeλShape, null, [
    ...$InheritingObject['__exclusives__'],
    ...$ConsistencySubject['__exclusives__'],
    ...$AnnotationSubject['__exclusives__'],
    ...$Type['__exclusives__'],
    ...$Source['__exclusives__'],
    {
        access_policies: {
            __element__: $AccessPolicy;
            __cardinality__: $.Cardinality.Many;
        };
    }
]>;
declare const $ObjectType: $ObjectType;
declare const ObjectType: $.$expr_PathNode<$.TypeSet<$ObjectType, $.Cardinality.Many>, null>;
export declare type $OperatorλShape = $.typeutil.flatten<$CallableObjectλShape & $VolatilitySubjectλShape & {
    "operator_kind": $.PropertyDesc<$OperatorKind, $.Cardinality.AtMostOne, false, false, false, false>;
    "is_abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, true>;
    "abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
declare type $Operator = $.ObjectType<"schema::Operator", $OperatorλShape, null, [
    ...$CallableObject['__exclusives__'],
    ...$VolatilitySubject['__exclusives__']
]>;
declare const $Operator: $Operator;
declare const Operator: $.$expr_PathNode<$.TypeSet<$Operator, $.Cardinality.Many>, null>;
export declare type $ParameterλShape = $.typeutil.flatten<$Object_9e146b225b2511ed8a35b350570a9c58λShape & {
    "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false, false, false>;
    "typemod": $.PropertyDesc<$TypeModifier, $.Cardinality.One, false, false, false, false>;
    "kind": $.PropertyDesc<$ParameterKind, $.Cardinality.One, false, false, false, false>;
    "num": $.PropertyDesc<_std.$int64, $.Cardinality.One, false, false, false, false>;
    "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<params[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false, false, false>;
    "<params[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false, false, false>;
    "<params[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false, false, false>;
    "<params[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false, false, false>;
    "<params": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Parameter = $.ObjectType<"schema::Parameter", $ParameterλShape, null, [
    ...$Object_9e146b225b2511ed8a35b350570a9c58['__exclusives__']
]>;
declare const $Parameter: $Parameter;
declare const Parameter: $.$expr_PathNode<$.TypeSet<$Parameter, $.Cardinality.Many>, null>;
export declare type $PropertyλShape = $.typeutil.flatten<$PointerλShape & {
    "<properties[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false, false, false>;
    "<properties[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
    "<properties": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Property = $.ObjectType<"schema::Property", $PropertyλShape, null, [
    ...$Pointer['__exclusives__']
]>;
declare const $Property: $Property;
declare const Property: $.$expr_PathNode<$.TypeSet<$Property, $.Cardinality.Many>, null>;
export declare type $PseudoTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & $TypeλShape & {}>;
declare type $PseudoType = $.ObjectType<"schema::PseudoType", $PseudoTypeλShape, null, [
    ...$InheritingObject['__exclusives__'],
    ...$Type['__exclusives__']
]>;
declare const $PseudoType: $PseudoType;
declare const PseudoType: $.$expr_PathNode<$.TypeSet<$PseudoType, $.Cardinality.Many>, null>;
export declare type $RangeλShape = $.typeutil.flatten<$CollectionTypeλShape & {
    "element_type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false, false, false>;
}>;
declare type $Range = $.ObjectType<"schema::Range", $RangeλShape, null, [
    ...$CollectionType['__exclusives__']
]>;
declare const $Range: $Range;
declare const Range: $.$expr_PathNode<$.TypeSet<$Range, $.Cardinality.Many>, null>;
export declare type $ScalarTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & $ConsistencySubjectλShape & $AnnotationSubjectλShape & $PrimitiveTypeλShape & {
    "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "enum_values": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
declare type $ScalarType = $.ObjectType<"schema::ScalarType", $ScalarTypeλShape, null, [
    ...$InheritingObject['__exclusives__'],
    ...$ConsistencySubject['__exclusives__'],
    ...$AnnotationSubject['__exclusives__'],
    ...$PrimitiveType['__exclusives__']
]>;
declare const $ScalarType: $ScalarType;
declare const ScalarType: $.$expr_PathNode<$.TypeSet<$ScalarType, $.Cardinality.Many>, null>;
export declare type $TupleλShape = $.typeutil.flatten<$CollectionTypeλShape & {
    "element_types": $.LinkDesc<$TupleElement, $.Cardinality.Many, {
        "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
    }, true, false, false, false>;
    "named": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, false>;
}>;
declare type $Tuple = $.ObjectType<"schema::Tuple", $TupleλShape, null, [
    ...$CollectionType['__exclusives__'],
    {
        element_types: {
            __element__: $TupleElement;
            __cardinality__: $.Cardinality.Many;
        };
    }
]>;
declare const $Tuple: $Tuple;
declare const Tuple: $.$expr_PathNode<$.TypeSet<$Tuple, $.Cardinality.Many>, null>;
export declare type $TupleElementλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
    "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false, false, false>;
    "name": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<element_types[is schema::Tuple]": $.LinkDesc<$Tuple, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "<element_types": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $TupleElement = $.ObjectType<"schema::TupleElement", $TupleElementλShape, null, [
    ..._std.$BaseObject['__exclusives__']
]>;
declare const $TupleElement: $TupleElement;
declare const TupleElement: $.$expr_PathNode<$.TypeSet<$TupleElement, $.Cardinality.Many>, null>;
export { AccessKind, AccessPolicyAction, Cardinality, OperatorKind, ParameterKind, SourceDeleteAction, TargetDeleteAction, TypeModifier, Volatility, $Object_9e146b225b2511ed8a35b350570a9c58, Object_9e146b225b2511ed8a35b350570a9c58, $SubclassableObject, SubclassableObject, $InheritingObject, InheritingObject, $AnnotationSubject, AnnotationSubject, $AccessPolicy, AccessPolicy, $Alias, Alias, $Annotation, Annotation, $Type, Type, $PrimitiveType, PrimitiveType, $CollectionType, CollectionType, $Array, Array, $CallableObject, CallableObject, $VolatilitySubject, VolatilitySubject, $Cast, Cast, $ConsistencySubject, ConsistencySubject, $Constraint, Constraint, $Delta, Delta, $Extension, Extension, $Function, Function, $FutureBehavior, FutureBehavior, $Global, Global, $Index, Index, $Pointer, Pointer, $Source, Source, $Link, Link, $Migration, Migration, $Module, Module, $ObjectType, ObjectType, $Operator, Operator, $Parameter, Parameter, $Property, Property, $PseudoType, PseudoType, $Range, Range, $ScalarType, ScalarType, $Tuple, Tuple, $TupleElement, TupleElement };
declare type __defaultExports = {
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
    "TupleElement": typeof TupleElement;
};
declare const __defaultExports: __defaultExports;
export default __defaultExports;
