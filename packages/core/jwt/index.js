import { EncryptJWT, jwtDecrypt } from "jose";
import { hkdf } from "@panva/hkdf";
import { SessionStore } from "../lib/cookie.js";
export * from "./types.js";
const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const now = () => (Date.now() / 1000) | 0;
/** Issues a JWT. By default, the JWT is encrypted using "A256GCM". */
export async function encode(params) {
    const { token = {}, secret, maxAge = DEFAULT_MAX_AGE } = params;
    const encryptionSecret = await getDerivedEncryptionKey(secret);
    return await new EncryptJWT(token)
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime(now() + maxAge)
        .setJti(crypto.randomUUID())
        .encrypt(encryptionSecret);
}
/** Decodes a NextAuth.js issued JWT. */
export async function decode(params) {
    const { token, secret } = params;
    if (!token)
        return null;
    const encryptionSecret = await getDerivedEncryptionKey(secret);
    const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
    });
    return payload;
}
/**
 * Takes a NextAuth.js request (`req`) and returns either the NextAuth.js issued JWT's payload,
 * or the raw JWT string. We look for the JWT in the either the cookies, or the `Authorization` header.
 * [Documentation](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken)
 */
export async function getToken(params) {
    const { req, secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ??
        !!process.env.VERCEL, cookieName = secureCookie
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token", raw, decode: _decode = decode, logger = console, secret = process.env.NEXTAUTH_SECRET, } = params;
    if (!req)
        throw new Error("Must pass `req` to JWT getToken()");
    const sessionStore = new SessionStore({ name: cookieName, options: { secure: secureCookie } }, 
    // @ts-expect-error
    { cookies: req.cookies, headers: req.headers }, logger);
    let token = sessionStore.value;
    const authorizationHeader = req.headers instanceof Headers
        ? req.headers.get("authorization")
        : req.headers.authorization;
    if (!token && authorizationHeader?.split(" ")[0] === "Bearer") {
        const urlEncodedToken = authorizationHeader.split(" ")[1];
        token = decodeURIComponent(urlEncodedToken);
    }
    // @ts-expect-error
    if (!token)
        return null;
    // @ts-expect-error
    if (raw)
        return token;
    try {
        // @ts-expect-error
        return await _decode({ token, secret });
    }
    catch {
        // @ts-expect-error
        return null;
    }
}
async function getDerivedEncryptionKey(secret) {
    return await hkdf("sha256", secret, "", "NextAuth.js Generated Encryption Key", 32);
}
