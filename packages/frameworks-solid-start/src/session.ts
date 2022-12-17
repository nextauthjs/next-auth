import { AuthHandler, type AuthOptions, type Session } from "@auth/core";

export type GetSessionResult = Promise<Session | null>;

export async function getSession(
  req: Request,
  options: AuthOptions
): GetSessionResult {
  options.secret ??= process.env.AUTH_SECRET;
  options.trustHost ??= true;

  const url = new URL("/api/auth/session", req.url);
  const response = await AuthHandler(
    new Request(url, { headers: req.headers }),
    options
  );

  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}
