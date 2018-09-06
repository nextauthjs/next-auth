/// <reference path="./index.d.ts" />
import { Store } from "express-session";
import { RequestHandler } from "express";
import { IpcNetConnectOpts } from "net";

declare namespace nextAuth {
  interface ILinkedAccounts {
    [name: string]: boolean;
  }
  interface IProviders {
    [name: string]: {
      signin: string;
      callback: string;
    };
  }
  interface NextAuthRequest<SessionType = nextAuth.NextAuthSession>
    extends Express.Request {
    session: NextAuthSession;
    linked: () => Promise<ILinkedAccounts | Error>;
    providers: () => Promise<IProviders | Error>;
  }
  interface IInitOptions {
    req?: NextAuthRequest;
    force: boolean;
  }
  interface IClientOptions {
    req?: NextAuthRequest;
  }
}

declare class Client {
  static init(
    opts: nextAuth.IInitOptions
  ): Promise<Partial<nextAuth.INextAuthSessionData>>;
  static csrfToken(): Promise<string | Error>;
  static linked(
    opts: nextAuth.IClientOptions
  ): Promise<nextAuth.ILinkedAccounts | Error>;
  static providers(
    opts: nextAuth.IClientOptions
  ): Promise<nextAuth.IProviders | Error>;
  static signin(
    params: string | { [k: string]: string }
  ): Promise<boolean | Error>;
  static signout(): Promise<true | Error>;

  static _getLocalStore(): Promise<nextAuth.INextAuthSessionData | null>;
  static _saveLocalStore(): Promise<boolean>;
  static _removeLocalStore(): Promise<boolean>;
}

export = Client;
