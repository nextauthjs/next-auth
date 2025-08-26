type Props = {
  className?: string
}

export function VercelIcon({ className }: Props) {
  return (
    <svg
      className={className}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <title>Vercel</title>
      <path d="m12 1.608 12 20.784H0Z" />
    </svg>
  )
}
