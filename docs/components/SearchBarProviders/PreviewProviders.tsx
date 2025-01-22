import type { SelectComboboxValue } from "@/hooks/use-select-combobox.js"

export function PreviewProviders(props: {
  providers: SelectComboboxValue[]
  onSelected: (provider: SelectComboboxValue) => void
  selected: string
}) {
  return (
    <section className="hidden md:block">
      {props.providers.map((provider) => (
        // TODO: Make this a link
        <button
          className={`${props.selected === provider.id ? "bg-orange-200 dark:bg-orange-600" : ""} m-0.5 inline-flex items-center gap-1 rounded-md border-neutral-200 p-2 transition-colors duration-300 hover:bg-neutral-200 dark:hover:bg-neutral-600`}
          key={provider.id}
          onClick={() => props.onSelected(provider)}
        >
          <img
            className="light:bg-white inline h-4 w-4 drop-shadow-sm"
            src={`/img/providers/${provider.id}.svg`}
          />
          <span className="text-ellipsis whitespace-nowrap text-sm">
            {provider.name}
          </span>
        </button>
      ))}
    </section>
  )
}
