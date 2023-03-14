/**
 * `@auth/astro` provides a set of Astro components for use with `@auth/core`.
 * @module components
 */

import { AstroAuthConfig } from './server'
import { BuiltInProviderType } from '@auth/core/providers';
import { LiteralUnion, SignInAuthorizationParams, SignInOptions, SignOutParams } from 'next-auth/react/types';

// there's no way to properly type this, but this should look clear in the actual docs
type AstroComponent = any

/**
 * Use this component to access the current user.
 * 
 * @example
 * ```tsx
 * ---
 * import type { Session } from '@auth/core/types'
 * import { Auth } from '@auth/astro/components'
 * ---
 * 
 * <Layout>
 *   <Auth>
 *     {(session: Session) => {
 *       if (session) {
 *         return <p>Welcome {session.user?.name}</p>
 *       } else {
 *         return <p>Please sign in</p>
 *       }
 *     }}
 *   </Auth>
 * </Layout>
 * ```
 */
export function Auth(props: {
  authOpts?: AstroAuthConfig
}): AstroComponent

/**
 * Use this component to sign in a user.
 * 
 * @example
 * ```tsx
 * ---
 * import { SignIn } from '@auth/astro/components'
 * ---
 * 
 * <Layout>
 *   <SignIn>Login</SignIn>
 *   <SignIn provider="google">Login with Google</SignIn>
 *   <SignIn provider="github">Login with GitHub</SignIn>
 * </Layout>
 * ```
 * 
*/
export function SignIn(props: {
  provider?: LiteralUnion<BuiltInProviderType, string>
  options?: SignInOptions
  authParams?: SignInAuthorizationParams
}): AstroComponent

/**
 * Use this component to sign in a user.
 * 
 * @example
 * ```tsx
 * ---
 * import { SignOut } from '@auth/astro/components'
 * ---
 * 
 * <Layout>
 *   <SignOut>Sign out</SignOut>
 * </Layout>
 * ```
 * 
*/
export function SignOut(props: {
  params?: SignOutParams<true>
}): AstroComponent
