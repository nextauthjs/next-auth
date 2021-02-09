
export interface CallbacksOptions {
  signIn?: (user: any, account: any, profile: any) => Promise<never | string>
  jwt?: (token: any, user: any, account: any, profile: any, isNewUser?: boolean) => Promise<any>
  session?: (session: any, userOrToken: any) => Promise<any>
  redirect?: (url: string, baseUrl: string) => Promise<string>
}
