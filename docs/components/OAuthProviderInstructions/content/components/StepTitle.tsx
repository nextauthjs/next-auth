interface Props {
  children: React.ReactNode
  count: number
}

export function StepTitle({ children, count }: Props) {
  return (
    <h3
      className={`relative mt-8 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100`}
    >
      <span
        className="absolute rounded-full"
        style={{
          left: "-2.65rem",
          color: "#a3a3a3",
          backgroundColor: "#f3f4f6",
          top: "52%",
          transform: "translateY(-50%)",
          fontSize: "1rem",
          width: "33px",
          height: "33px",
          textAlign: "center",
        }}
      >
        {count}
      </span>
      {children}
    </h3>
  )
}
