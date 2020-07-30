import { ProviderReturnConfig } from "../interfaces"

export interface ProviderCredentialsOptions {
  id: string;
  name: string;
  credentials: unknown;
  authorize(credentails: unknown): Promise<CredentialsAuthorizeResult> | CredentialsAuthorizeResult;
}

type CredentialsAuthorizeResult = unknown | null

export default (options: ProviderCredentialsOptions): ProviderReturnConfig => {
  return {
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    authorize: null,
    credentials: null,
    ...options
  }
}
