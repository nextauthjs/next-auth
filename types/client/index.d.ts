// Minimum TypeScript Version: 3.8
interface Session {
  foo: string;
}

type UseSessionResult = [Session, boolean];

declare function useSession(): UseSessionResult;

export { useSession };
