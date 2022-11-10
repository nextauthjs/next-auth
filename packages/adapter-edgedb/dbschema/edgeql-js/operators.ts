import * as $ from "./reflection";
import * as _ from "./imports";
import type * as _std from "./modules/std";
import type * as _cal from "./modules/cal";
import type * as _cfg from "./modules/cfg";

const overloadDefs: {
  [opKind in 'Infix' | 'Prefix' | 'Postfix' | 'Ternary']: {
    [opSymbol: string]: any[]
  }
} = {
  Infix: {
    "=": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}, {typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}, {typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "9654a300-5b25-11ed-bf1d-a5779bb71644", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "?=": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000002", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000002", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: true, setoftype: false, variadic: false}, {typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: true, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000100", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: true, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: true, setoftype: false, variadic: false}, {typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000130", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000130", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: true, setoftype: false, variadic: false}, {typeId: "9654a300-5b25-11ed-bf1d-a5779bb71644", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "!=": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}, {typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}, {typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "9654a300-5b25-11ed-bf1d-a5779bb71644", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "?!=": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000002", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000002", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: true, setoftype: false, variadic: false}, {typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: true, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000100", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: true, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: true, setoftype: false, variadic: false}, {typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000130", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000130", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: true, setoftype: false, variadic: false}, {typeId: "9654a300-5b25-11ed-bf1d-a5779bb71644", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: true, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    ">=": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}, {typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}, {typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9654a300-5b25-11ed-bf1d-a5779bb71644", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    ">": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}, {typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}, {typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9654a300-5b25-11ed-bf1d-a5779bb71644", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "<=": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}, {typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}, {typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9654a300-5b25-11ed-bf1d-a5779bb71644", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "<": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000002", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}, {typeId: "965c577f-5b25-11ed-929a-9ff65acd4f11", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000100", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}, {typeId: "9d8cb3f7-5b25-11ed-8d6c-6722cb3f70f4", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000130", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "9654a300-5b25-11ed-bf1d-a5779bb71644", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "or": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "and": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "+": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000110"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010a"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010e"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "ed76e110-4242-7879-515b-322e7b790585"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010b"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010c"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010d"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000112"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010a"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010b"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010d"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000111"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010b"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010b"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000111"},
    ],
    "-": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000110"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010a"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010e"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010e"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "ed76e110-4242-7879-515b-322e7b790585"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010b"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010c"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000112"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010d"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000111"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000112", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000112"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010a", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010a"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010c", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010b"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010d", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010d"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000111"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010b"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010b"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010b", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000111"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000111"},
    ],
    "*": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000110"},
      {kind: "Infix", args: [{typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}, {typeId: "ed76e110-4242-7879-515b-322e7b790585", optional: false, setoftype: false, variadic: false}], returnTypeId: "ed76e110-4242-7879-515b-322e7b790585"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
    ],
    "/": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
    ],
    "//": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000110"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
    ],
    "%": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000110"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
    ],
    "^": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
    ],
    "in": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "not in": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "union": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "SetOfType"},
    ],
    "??": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000001", optional: true, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "SetOfType"},
    ],
    "++": [
      {kind: "Infix", args: [{typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}, {typeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3", optional: false, setoftype: false, variadic: false}], returnTypeId: "5d31584b-3a5f-533d-3d64-fab0fdab61b3"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000102", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000102"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000101"},
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-00000000010f", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010f"},
    ],
    "like": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "ilike": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "not like": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "not ilike": [
      {kind: "Infix", args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
  },
  Postfix: {
  },
  Prefix: {
    "not": [
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "+": [
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000110"},
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
    ],
    "-": [
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-0000000001ff", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-0000000001ff"},
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-000000000110", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000110"},
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-00000000010e", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-00000000010e"},
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-000000000108", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000108"},
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-000000000111", optional: false, setoftype: false, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000111"},
    ],
    "exists": [
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000109"},
    ],
    "distinct": [
      {kind: "Prefix", args: [{typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "SetOfType"},
    ],
  },
  Ternary: {
    "if_else": [
      {kind: "Ternary", args: [{typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000109", optional: false, setoftype: false, variadic: false}, {typeId: "00000000-0000-0000-0000-000000000001", optional: false, setoftype: true, variadic: false}], returnTypeId: "00000000-0000-0000-0000-000000000001", returnTypemod: "SetOfType"},
    ],
  },
};

/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for equality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "?=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Compare two (potentially empty) values for inequality.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "?!=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.optionalParamCardinality<P1>, $.cardutil.optionalParamCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: ">=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Greater than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: ">", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than or equal.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "<=", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.EnumType>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$uuid>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cfg.$memory>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$anyint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Less than.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "<", r: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Logical disjunction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  a: P1, op: "or", b: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Logical conjunction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  a: P1, op: "and", b: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Logical negation.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
>(
  op: "not", v: P1
): $.$expr_Operator<
  _std.$bool, $.cardutil.paramCardinality<P1>
>;
/**
* Arithmetic addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  op: "+", l: P1
): $.$expr_Operator<
  _std.$number, $.cardutil.paramCardinality<P1>
>;
/**
* Arithmetic addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  op: "+", l: P1
): $.$expr_Operator<
  _std.$bigint, $.cardutil.paramCardinality<P1>
>;
/**
* Arithmetic addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _std.$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _std.$duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Range union.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  $.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$local_date, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$date_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _std.$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  op: "+", l: P1
): $.$expr_Operator<
  _std.$decimal, $.cardutil.paramCardinality<P1>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval addition.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "+", r: P2
): $.$expr_Operator<
  _cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  op: "-", l: P1
): $.$expr_Operator<
  _std.$number, $.cardutil.paramCardinality<P1>
>;
/**
* Arithmetic subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  op: "-", l: P1
): $.$expr_Operator<
  _std.$bigint, $.cardutil.paramCardinality<P1>
>;
/**
* Time interval negation.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  op: "-", v: P1
): $.$expr_Operator<
  _std.$duration, $.cardutil.paramCardinality<P1>
>;
/**
* Arithmetic subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _std.$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _std.$duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _std.$duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Range difference.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  $.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$local_date, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Date subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$date_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$date_duration>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$date_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$datetime>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _std.$datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_date>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_time>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$local_time, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  op: "-", l: P1
): $.$expr_Operator<
  _std.$decimal, $.cardutil.paramCardinality<P1>
>;
/**
* Time interval negation.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  op: "-", v: P1
): $.$expr_Operator<
  _cal.$relative_duration, $.cardutil.paramCardinality<P1>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$duration>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval and date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$local_datetime, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Date/time subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Time interval subtraction.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "-", r: P2
): $.$expr_Operator<
  _cal.$relative_duration, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic multiplication.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "*", r: P2
): $.$expr_Operator<
  _std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic multiplication.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  l: P1, op: "*", r: P2
): $.$expr_Operator<
  _std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Range intersection.
*/
function op<
  P1 extends $.TypeSet<$.RangeType<_std.$anypoint>>,
  P2 extends $.TypeSet<$.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "*", r: P2
): $.$expr_Operator<
  $.RangeType<$.getPrimitiveBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic multiplication.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "*", r: P2
): $.$expr_Operator<
  _std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic division.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  l: P1, op: "/", r: P2
): $.$expr_Operator<
  _std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Arithmetic division.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "/", r: P2
): $.$expr_Operator<
  _std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Floor division. Result is rounded down to the nearest integer
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  n: P1, op: "//", d: P2
): $.$expr_Operator<
  _std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Floor division. Result is rounded down to the nearest integer
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  n: P1, op: "//", d: P2
): $.$expr_Operator<
  _std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Floor division. Result is rounded down to the nearest integer
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  n: P1, op: "//", d: P2
): $.$expr_Operator<
  _std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Remainder from division (modulo).
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  n: P1, op: "%", d: P2
): $.$expr_Operator<
  _std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Remainder from division (modulo).
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  n: P1, op: "%", d: P2
): $.$expr_Operator<
  _std.$bigint, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Remainder from division (modulo).
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  n: P1, op: "%", d: P2
): $.$expr_Operator<
  _std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Power operation.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$number>>,
>(
  n: P1, op: "^", p: P2
): $.$expr_Operator<
  _std.$number, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Power operation.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bigint>>,
>(
  n: P1, op: "^", p: P2
): $.$expr_Operator<
  _std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Power operation.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$decimalλICastableTo>>,
>(
  n: P1, op: "^", p: P2
): $.$expr_Operator<
  _std.$decimal, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
  P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
  P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<_std.$decimalλICastableTo>,
  P2 extends $.TypeSet<_std.$decimalλICastableTo>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>,
>(
  e: P1, op: "in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
  P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
  P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<_std.$decimalλICastableTo>,
  P2 extends $.TypeSet<_std.$decimalλICastableTo>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test the membership of an element in a set.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>,
>(
  e: P1, op: "not in", s: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.Cardinality.One>
>;
/**
* Test whether a set is not empty.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>,
>(
  op: "exists", s: P1
): $.$expr_Operator<
  _std.$bool, $.Cardinality.One
>;
/**
* Return a set without repeating any elements.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>,
>(
  op: "distinct", s: P1
): $.$expr_Operator<
  $.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.paramCardinality<P1>
>;
/**
* Merge two sets.
*/
function op<
  P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
  P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Merge two sets.
*/
function op<
  P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
  P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Merge two sets.
*/
function op<
  P1 extends $.TypeSet<_std.$decimalλICastableTo>,
  P2 extends $.TypeSet<_std.$decimalλICastableTo>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Merge two sets.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Merge two sets.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Merge two sets.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Merge two sets.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  _.syntax.mergeObjectTypes<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Merge two sets.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Merge two sets.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>,
>(
  s1: P1, op: "union", s2: P2
): $.$expr_Operator<
  $.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.mergeCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
  P2 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
  P2 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends $.TypeSet<_std.$decimalλICastableTo>,
  P2 extends $.TypeSet<_std.$decimalλICastableTo>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends $.TypeSet<$.ObjectType>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  _.syntax.mergeObjectTypes<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends $.TypeSet<$.AnyTupleType>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P2["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Coalesce.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>,
>(
  l: P1, op: "??", r: P2
): $.$expr_Operator<
  $.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.orCardinalities<
          $.cardutil.paramCardinality<P1>,
          $.cardutil.paramCardinality<P2>
        >
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends $.TypeSet<_cal.$relative_durationλICastableTo>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends $.TypeSet<_cal.$local_datetimeλICastableTo>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends $.TypeSet<_std.$decimalλICastableTo>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends $.TypeSet<_std.$decimalλICastableTo>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends $.TypeSet<$.ObjectType>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends $.TypeSet<$.ObjectType>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  _.syntax.mergeObjectTypes<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends $.TypeSet<$.AnyTupleType>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends $.TypeSet<$.AnyTupleType>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  _.syntax.getSharedParentPrimitive<P1["__element__"], P3["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Conditionally provide one or the other result.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<$.BaseType>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bool>>,
  P3 extends _.castMaps.orScalarLiteral<$.TypeSet<$.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>>>,
>(
  if_true: P1, op: "if", condition: P2, op2: "else", if_false: P3
): $.$expr_Operator<
  $.getPrimitiveBaseType<_.castMaps.literalToTypeSet<P1>["__element__"]>, $.cardutil.multiplyCardinalities<$.cardutil.orCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P3>>, $.cardutil.paramCardinality<P2>>
>;
/**
* Array concatenation.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$relative_durationλICastableTo>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  $.ArrayType<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Array concatenation.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_cal.$local_datetimeλICastableTo>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  $.ArrayType<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Array concatenation.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
  P2 extends $.TypeSet<$.ArrayType<_std.$decimalλICastableTo>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  $.ArrayType<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Array concatenation.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
  P2 extends $.TypeSet<$.ArrayType<$.ObjectType>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  $.ArrayType<_.syntax.mergeObjectTypes<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Array concatenation.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
  P2 extends $.TypeSet<$.ArrayType<$.AnyTupleType>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  $.ArrayType<_.syntax.getSharedParentPrimitive<P1["__element__"]["__element__"], P2["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Array concatenation.
*/
function op<
  P1 extends $.TypeSet<$.ArrayType<$.NonArrayType>>,
  P2 extends $.TypeSet<$.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  $.ArrayType<$.getPrimitiveNonArrayBaseType<P1["__element__"]["__element__"]>>, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Bytes concatenation.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  _std.$bytes, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* String concatenation.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  _std.$str, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Concatenate two JSON values into a new JSON value.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$json>>,
>(
  l: P1, op: "++", r: P2
): $.$expr_Operator<
  _std.$json, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Case-sensitive simple string matching.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  string: P1, op: "like", pattern: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Case-insensitive simple string matching.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  string: P1, op: "ilike", pattern: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Case-sensitive simple string matching.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  string: P1, op: "not like", pattern: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
/**
* Case-insensitive simple string matching.
*/
function op<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  P2 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  string: P1, op: "not ilike", pattern: P2
): $.$expr_Operator<
  _std.$bool, $.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.paramCardinality<P2>>
>;
function op(...args: any[]) {
  let op: string = "";
    let params: any[] = [];
    let defs: any[] | null = null;
    if (args.length === 2) {
      if (typeof args[0] === "string" && overloadDefs.Prefix[args[0]]) {
        op = args[0];
        params = [args[1]];
        defs = overloadDefs.Prefix[op];
      } else if (typeof args[1] === "string" && overloadDefs.Postfix[args[1]]) {
        op = args[1];
        params = [args[0]];
        defs = overloadDefs.Postfix[op];
      }
    } else if (args.length === 3) {
      if (typeof args[1] === "string") {
        op = args[1];
        params = [args[0], args[2]];
        defs = overloadDefs.Infix[op];
      }
    } else if (args.length === 5) {
      if (typeof args[1] === "string" && typeof args[3] === "string") {
        op = `${args[1]}_${args[3]}`;
        params = [args[0], args[2], args[4]];
        defs = overloadDefs.Ternary[op];
      }
    }
  
    if (!defs) {
      throw new Error(`No operator exists with signature: ${args.map(arg => `${arg}`).join(", ")}`);
    }

  const {kind, returnType, cardinality, args: resolvedArgs} = _.syntax.$resolveOverload(op, params, _.spec, defs);

  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Operator,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: op,
    __opkind__: kind,
    __args__: resolvedArgs,
  }) as any;
};


export { op };
