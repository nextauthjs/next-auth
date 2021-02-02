import { NextAuthInternalOptions } from '../server'

export type GetAdapter = (appOptions: NextAuthInternalOptions) => Promise<{
  createUser: (profile) => Promise<any>
  getUser: () => Promise<any>
  getUserByEmail: () => Promise<any>
  getUserByProviderAccountId: () => Promise<any>
  updateUser: () => Promise<any>
  deleteUser: () => Promise<any>
  linkAccount: () => Promise<any>
  unlinkAccount: () => Promise<any>
  createSession: () => Promise<any>
  getSession: () => Promise<any>
  updateSession: () => Promise<any>
  deleteSession: () => Promise<any>
  createVerificationRequest: () => Promise<any>
  getVerificationRequest: () => Promise<any>
  deleteVerificationRequest: () => Promise<any>
}>

export type Adapter = (config?: any, options?: any) => {
  getAdapter: GetAdapter
}
