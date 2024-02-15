import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function StepTitle({ children }: Props) {
  return (
    <h3 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-8 text-2xl">
      {children}
    </h3>
  );
}
