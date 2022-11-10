import * as $ from "../reflection";
import type * as _std from "./std";
export declare type $AccountλShape = $.typeutil.flatten<_std.$Object_9d92cf705b2511ed848a275bef45d8e3λShape & {
    "user": $.LinkDesc<$User, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "type": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "userId": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "provider": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "providerAccountId": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
    "access_token": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "createdAt": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, true>;
    "expires_at": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
    "id_token": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "refresh_token": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "scope": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "session_state": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "token_type": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<accounts[is User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false, false, false>;
    "<accounts": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Account = $.ObjectType<"default::Account", $AccountλShape, null, [
    ..._std.$Object_9d92cf705b2511ed848a275bef45d8e3['__exclusives__'],
    {
        provider: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
        providerAccountId: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
    },
    {
        providerAccountId: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
    }
]>;
declare const $Account: $Account;
declare const Account: $.$expr_PathNode<$.TypeSet<$Account, $.Cardinality.Many>, null>;
export declare type $SessionλShape = $.typeutil.flatten<_std.$Object_9d92cf705b2511ed848a275bef45d8e3λShape & {
    "user": $.LinkDesc<$User, $.Cardinality.AtMostOne, {}, false, false, false, false>;
    "createdAt": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, true>;
    "expires": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
    "sessionToken": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
    "userId": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "<sessions[is User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false, false, false>;
    "<sessions": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $Session = $.ObjectType<"default::Session", $SessionλShape, null, [
    ..._std.$Object_9d92cf705b2511ed848a275bef45d8e3['__exclusives__'],
    {
        sessionToken: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
    }
]>;
declare const $Session: $Session;
declare const Session: $.$expr_PathNode<$.TypeSet<$Session, $.Cardinality.Many>, null>;
export declare type $UserλShape = $.typeutil.flatten<_std.$Object_9d92cf705b2511ed848a275bef45d8e3λShape & {
    "accounts": $.LinkDesc<$Account, $.Cardinality.Many, {}, false, true, false, false>;
    "sessions": $.LinkDesc<$Session, $.Cardinality.Many, {}, false, true, false, false>;
    "createdAt": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, true>;
    "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
    "emailVerified": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, false>;
    "image": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "name": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
    "<user[is Account]": $.LinkDesc<$Account, $.Cardinality.Many, {}, false, false, false, false>;
    "<user[is Session]": $.LinkDesc<$Session, $.Cardinality.Many, {}, false, false, false, false>;
    "<user": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false, false, false>;
}>;
declare type $User = $.ObjectType<"default::User", $UserλShape, null, [
    ..._std.$Object_9d92cf705b2511ed848a275bef45d8e3['__exclusives__'],
    {
        email: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
    }
]>;
declare const $User: $User;
declare const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null>;
export declare type $VerificationTokenλShape = $.typeutil.flatten<_std.$Object_9d92cf705b2511ed848a275bef45d8e3λShape & {
    "identifier": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
    "token": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
    "createdAt": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, true>;
    "expires": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
}>;
declare type $VerificationToken = $.ObjectType<"default::VerificationToken", $VerificationTokenλShape, null, [
    ..._std.$Object_9d92cf705b2511ed848a275bef45d8e3['__exclusives__'],
    {
        identifier: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
        token: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
    },
    {
        token: {
            __element__: _std.$str;
            __cardinality__: $.Cardinality.One;
        };
    }
]>;
declare const $VerificationToken: $VerificationToken;
declare const VerificationToken: $.$expr_PathNode<$.TypeSet<$VerificationToken, $.Cardinality.Many>, null>;
export { $Account, Account, $Session, Session, $User, User, $VerificationToken, VerificationToken };
declare type __defaultExports = {
    "Account": typeof Account;
    "Session": typeof Session;
    "User": typeof User;
    "VerificationToken": typeof VerificationToken;
};
declare const __defaultExports: __defaultExports;
export default __defaultExports;
