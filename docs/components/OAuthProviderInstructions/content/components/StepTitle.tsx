interface Props {
  children: React.ReactNode
}

export function StepTitle({ children }: Props) {
  return (
    <h3
      className={`mt-8 text-2xl font-semibold tracking-tight text-slate-900 before:!-mt-[1px] before:flex before:items-center before:justify-center dark:text-slate-100`}
    >
      {children}
    </h3>
  )
}
