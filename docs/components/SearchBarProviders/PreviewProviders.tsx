export interface Provider {
  id: string
  name: string
}

export interface PreviewProvidersProps {
  className?: string
  providers: Provider[]
  onSelected: (provider: Provider) => void
}

export function PreviewProviders({
  className,
  providers,
  onSelected,
}: PreviewProvidersProps) {
  return (
    <section className={className}>
      {providers.map((provider) => (
        <div
          className="flex h-32 w-32 min-w-24 flex-col items-center justify-between rounded-lg border border-solid border-neutral-200 p-4 shadow-sm transition-colors duration-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-950"
          key={provider.id}
          role="button"
          onClick={() => onSelected(provider)}
        >
          <img
            src={`/img/providers/${provider.id}.svg`}
            className="mt-2 w-11"
          />
          <div className="text-center text-sm">{provider.name}</div>
        </div>
      ))}
    </section>
  )
}
