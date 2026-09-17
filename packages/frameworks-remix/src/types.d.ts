import type { AuthConfig } from "@auth/core";

import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers";

import type { LiteralUnion } from "next-auth/react";

export type ProviderID<P> = LiteralUnion<
  P extends RedirectableProviderType
    ? P | BuiltInProviderType
    : BuiltInProviderType
>;

export interface RemixAuthConfig extends AuthConfig {
  trustHost?: boolean;
  secret?: string;
  //deafults to false, will need to properly handle for fetch requests
  allowHtmlReturn?: boolean;
}
