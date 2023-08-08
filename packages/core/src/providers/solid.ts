/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Solid</b> integration.
 * </span>
 * <a href="https://solidproject.org/" style={{backgroundColor: "black", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/solid.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/solid
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js";
import { exportJWK, generateKeyPair, type JWK } from "jose";

/** The returned user profile from Solid when using the profile callback. */
export interface SolidProfile extends Record<string, any> {
  //** The users identifier, aka WebID. */
  webid: string,
}

/**
 * ### Setup
 * 
 * Import the provider and configure it in your **Auth.js** initialization file:
 *
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import SolidProvider from "next-auth/providers/solid"
 *
 * export default NextAuth({
 *   providers: [
 *     SolidProvider({
 *       clientId: process.env.AUTH0_ID,
 *       clientSecret: process.env.AUTH0_SECRET,
 *       issuer: process.env.ISSUER,
 *     }),
 *   ],
 * })
 * ```
 * 
 * ### DPoP header
 * 
 * Solid calls for the use of [demonstrated proof of possession](https://www.ietf.org/archive/id/draft-ietf-oauth-dpop-16.html) when making calls.
 * The keypair used during authentication will be returned in the tokens object.
 * 
 * It is also possible to provide a keypair through the options object.
 * 
 */
export default function Solid<P extends SolidProfile>(options: OAuthUserConfig<P> & { dpopKeyPair?: { privateKey: JWK, publicKey: JWK } }): OAuthConfig<P> {
  // To protect calls with DPoP we need a keypair
  async function generateDPoPKeyPair(): Promise<{ privateKey: JWK, publicKey: JWK }> {
    const { privateKey, publicKey } = await generateKeyPair('ES256');

    const dpopKeyPair = {
      privateKey: await exportJWK(privateKey),
      publicKey: await exportJWK(publicKey),
    };

    dpopKeyPair.publicKey.alg = 'ES256';

    return dpopKeyPair;
  }

  return {
    id: 'solid',
    name: 'Solid',
    type: 'oauth',
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    authorization: {
      params: {
        grant_type: ['authorization_code', 'refresh_token'],
        scope: 'openid email profile',
        prompt: 'consent' // Necessary?
      }
    },
    idToken: true,
    checks: ["pkce", "state"],
    client: {
      authorization_signed_response_alg: 'RS256',
      id_token_signed_response_alg: 'ES256',
    },
    token: {
      url: `${options.issuer}/.oidc/token`,
      async request({ params, checks, client, provider }) {
        const dpopKeyPair = options.dpopKeyPair ?? await generateDPoPKeyPair();

        // Request DPoP token.
        const tokens = await client.grant(
          {
            grant_type: 'authorization_code',
            code: params.code,
            redirect_uri: provider.callbackUrl,
            code_verifier: checks.code_verifier,
          },
          {
            DPoP: { key: dpopKeyPair.privateKey, format: 'jwk' },
          },
        );

        tokens.dpopKeyPair = dpopKeyPair;

        return { tokens };
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        webid: profile.sub,
      }
    },
    style: {
      logo: "/solid.svg",
      logoDark: '/solid.svg',
      bgDark: "#fff",
      bg: "#fff",
      text: "#000",
      textDark: "#000",
    },
    options
  }

}
