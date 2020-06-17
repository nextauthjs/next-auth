// Minimum TypeScript Version: 3.8
import { IncomingMessage } from 'http';

interface Session {
  user: {
    name: string;
    email: string;
    image: string;
  };
  accessToken: string;
  expires: string;
}

interface GetProvidersResponse {
  [provider: string]: Provider;
}

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

interface GenericObject {
  [key: string]: any;
}

type UseSessionResult = [Session, boolean];

declare function useSession(): UseSessionResult;
declare function getSession(context: NextContext): Session | null;
declare function getProviders(context: NextContext): GetProvidersResponse | null;
declare function getCsrfToken(context: NextContext): string | null;
declare function signin(provider: Provider, data: GenericObject): void;
declare function signout(context: NextContext): void;

export { useSession, getSession, getProviders, getCsrfToken, signin, signout };
export type { Session };

/**
 * TODO: `dtslint` throws when parsing Next types... the following types are copied directly from `next/types` ...
 * @see https://github.com/microsoft/dtslint/issues/297
 */

interface NextApiRequest extends IncomingMessage {
  query: {
    [key: string]: string | string[];
  };
  cookies: {
    [key: string]: string;
  };
  body: any;
  env: Env;
}

interface NextContext {
  req: NextApiRequest;
}

interface Env {
  [key: string]: string;
}
