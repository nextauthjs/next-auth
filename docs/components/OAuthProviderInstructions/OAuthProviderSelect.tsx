import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  ComboboxProvider,
} from "@ariakit/react"
import dynamic from "next/dynamic"
import manifest from "@/data/manifest.json"
import { PreviewProviders } from "@/components/SearchBarProviders/PreviewProviders"
import { useSelectCombobox } from "@/hooks/use-select-combobox"

const OAuthProviderInstructions = dynamic(() =>
  import("./content").then((mod) => mod.OAuthInstructions)
)

const items = Object.entries(manifest.providersOAuth).map(([id, name]) => ({
  id,
  name,
}))

export function OAuthProviderSelect() {
  const {
    selectedItem,
    filteredItems,
    hasMatchItem,
    handleChange,
    handleSelect,
  } = useSelectCombobox({ items })

  return (
    <>
      <ComboboxProvider
        value={selectedItem.name}
        selectedValue={selectedItem.id}
      >
        <Combobox
          placeholder="Search for your OAuth provider"
          className="my-2 mt-4 min-w-full rounded-md border-2 border-gray-200 bg-neutral-100 px-4 py-2 font-medium text-neutral-800 shadow-sm md:w-96 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          value={selectedItem.name}
          onChange={handleChange}
        />
        <ComboboxPopover
          gutter={4}
          sameWidth
          hideOnEscape
          hideOnInteractOutside
          className="z-50 mt-1 max-h-72 overflow-y-scroll rounded-md bg-neutral-100 p-2 empty:hidden dark:bg-neutral-900"
        >
          {filteredItems.map((item) => (
            <ComboboxItem
              className="flex cursor-pointer flex-row items-center gap-4 px-2 py-2 aria-selected:bg-violet-200 dark:aria-selected:bg-violet-500 dark:aria-selected:text-neutral-900"
              value={item.name}
              key={item.name}
              onClick={() => handleSelect(item)}
            >
              <img
                src={`/img/providers/${item.id}.svg`}
                className="h-6 w-6 rounded-sm"
              />{" "}
              {item.name}
            </ComboboxItem>
          ))}
        </ComboboxPopover>
        <PreviewProviders
          providers={Object.entries(manifest.providersOAuth).map(
            ([id, name]) => ({ id, name })
          )}
          onSelected={handleSelect}
          selected={selectedItem.id}
        />
      </ComboboxProvider>
      {hasMatchItem && (
        <OAuthProviderInstructions providerId={selectedItem.id} />
      )}
    </>
  )
}
