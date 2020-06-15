// Minimum TypeScript Version: 3.8
declare module 'next-auth/client' {
  interface Session {
    foo: string;
  }

  function getSession(a: string): Session;
}
