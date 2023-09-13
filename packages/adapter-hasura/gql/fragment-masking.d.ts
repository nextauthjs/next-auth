import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type FragmentType<TDocumentType extends DocumentNode<any, any>> = TDocumentType extends DocumentNode<infer TType, any> ? TType extends {
    " $fragmentName"?: infer TKey;
} ? TKey extends string ? {
    " $fragmentRefs"?: {
        [key in TKey]: TType;
    };
} : never : never : never;
export declare function useFragment<TType>(_documentNode: DocumentNode<TType, any>, fragmentType: FragmentType<DocumentNode<TType, any>>): TType;
export declare function useFragment<TType>(_documentNode: DocumentNode<TType, any>, fragmentType: FragmentType<DocumentNode<TType, any>> | null | undefined): TType | null | undefined;
export declare function useFragment<TType>(_documentNode: DocumentNode<TType, any>, fragmentType: ReadonlyArray<FragmentType<DocumentNode<TType, any>>>): ReadonlyArray<TType>;
export declare function useFragment<TType>(_documentNode: DocumentNode<TType, any>, fragmentType: ReadonlyArray<FragmentType<DocumentNode<TType, any>>> | null | undefined): ReadonlyArray<TType> | null | undefined;
//# sourceMappingURL=fragment-masking.d.ts.map