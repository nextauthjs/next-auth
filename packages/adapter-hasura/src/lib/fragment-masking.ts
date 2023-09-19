import type {
  ResultOf,
  DocumentTypeDecoration,
} from "@graphql-typed-document-node/core"
import type { Incremental, TypedDocumentString } from "./graphql.js"

export type FragmentType<
  TDocumentType extends DocumentTypeDecoration<any, any>
> = TDocumentType extends DocumentTypeDecoration<infer TType, any>
  ? [TType] extends [{ " $fragmentName"?: infer TKey }]
    ? TKey extends string
      ? { " $fragmentRefs"?: { [key in TKey]: TType } }
      : never
    : never
  : never

// return non-nullable if `fragmentType` is non-nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: FragmentType<DocumentTypeDecoration<TType, any>>
): TType
// return nullable if `fragmentType` is nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType:
    | FragmentType<DocumentTypeDecoration<TType, any>>
    | null
    | undefined
): TType | null | undefined
// return array of non-nullable if `fragmentType` is array of non-nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType: ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>>
): ReadonlyArray<TType>
// return array of nullable if `fragmentType` is array of nullable
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType:
    | ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>>
    | null
    | undefined
): ReadonlyArray<TType> | null | undefined
export function useFragment<TType>(
  _documentNode: DocumentTypeDecoration<TType, any>,
  fragmentType:
    | FragmentType<DocumentTypeDecoration<TType, any>>
    | ReadonlyArray<FragmentType<DocumentTypeDecoration<TType, any>>>
    | null
    | undefined
): TType | ReadonlyArray<TType> | null | undefined {
  return fragmentType as any
}

export function makeFragmentData<
  F extends DocumentTypeDecoration<any, any>,
  FT extends ResultOf<F>
>(data: FT, _fragment: F): FragmentType<F> {
  return data as FragmentType<F>
}
export function isFragmentReady<TQuery, TFrag>(
  queryNode: TypedDocumentString<TQuery, any>,
  fragmentNode: TypedDocumentString<TFrag, any>,
  data:
    | FragmentType<TypedDocumentString<Incremental<TFrag>, any>>
    | null
    | undefined
): data is FragmentType<typeof fragmentNode> {
  const deferredFields = queryNode.__meta__?.deferredFields as Record<
    string,
    (keyof TFrag)[]
  >
  const fragName = fragmentNode.__meta__?.fragmentName as string | undefined

  if (!deferredFields || !fragName) return true

  const fields = deferredFields[fragName] ?? []
  return fields.length > 0 && fields.every((field) => data && field in data)
}
