import {CredentialsProviderFactory} from "../types";

interface Credentials {
  [key: string]: {
    label: string;
    type: string;
    placeholder?: string;
  }
}

export interface CredentialProviderOptions<C extends Credentials = Credentials> {
  name: string;
  credentials: C;
  authorize: (credentials: C) => Promise<any>
}

const CredentialProviderFactory: CredentialsProviderFactory = (options) => {
  return {
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    ...options
  }
}

export default CredentialProviderFactory;