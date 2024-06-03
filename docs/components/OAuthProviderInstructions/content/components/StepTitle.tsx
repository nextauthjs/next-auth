interface Props {
  children: React.ReactNode
}

export function StepTitle({ children }: Props) {
  return (
    <h3
      className={`font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-8 text-2xl before:flex before:items-center before:justify-center before:!-mt-[1px]`}
    >
      {children}
    </h3>
  )
}
