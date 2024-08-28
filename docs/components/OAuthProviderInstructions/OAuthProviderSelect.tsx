import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  ComboboxProvider,
} from "@ariakit/react"
import { useOAuthProviderSelect } from "./useOAuthProviderSelect"
import dynamic from "next/dynamic"
import type { ChangeEvent } from "react"

import { Link } from "@/components/Link"
import manifest from "@/data/manifest.json"

const OAuthProviderInstructions = dynamic(() =>
  import("./content").then((mod) => mod.OAuthInstructions)
)

export function OAuthProviderSelect() {
  const { items, term, selected, handleSearchItem, handleSelectOption } =
    useOAuthProviderSelect()

  return (
    <div className="mt-8">
      <ComboboxProvider value={term} selectedValue={selected}>
        <Combobox
          placeholder="Search for your favorite OAuth provider"
          className="w-full rounded-md border-2 border-gray-200 bg-neutral-100 px-4 py-2 font-medium text-neutral-800 shadow-sm md:w-96 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearchItem(e.target.value)
          }
        />
        <ComboboxPopover
          gutter={4}
          sameWidth
          hideOnEscape
          hideOnInteractOutside
          className="z-50 mt-1 max-h-72 overflow-y-scroll rounded-md bg-neutral-100 p-2 dark:bg-neutral-900"
        >
          {items.map((item) => (
            <ComboboxItem
              className="flex cursor-pointer flex-row items-center gap-4 px-2 py-2 aria-selected:bg-violet-200 dark:aria-selected:bg-violet-500 dark:aria-selected:text-neutral-900"
              value={item.name}
              key={item.name}
              onClick={() => handleSelectOption(item)}
            >
              <img
                src={`/img/providers/${item.id}.svg`}
                className="h-6 w-6 rounded-sm"
              />{" "}
              {item.name}
            </ComboboxItem>
          ))}
        </ComboboxPopover>
        {!term ? (
          <>
            <p className="mt-8 rounded-md">
              Or jump directly to one of the popular ones below.
            </p>
            <div className="mt-8 flex flex-row gap-6 pb-8">
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "google", name: "Google" })
                }
                className="flex h-32 w-32 flex-col items-center justify-between rounded-lg border border-solid border-neutral-200 p-4 shadow-sm transition-colors duration-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-950"
              >
                <img src={`/img/providers/google.svg`} className="mt-2 w-11" />
                <div className="text-center text-sm">Google</div>
              </div>
              <div
                role="button"
                className="flex h-32 w-32 flex-col items-center justify-between rounded-lg border border-solid border-neutral-200 p-4 shadow-sm transition-colors duration-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-950"
                onClick={() =>
                  handleSelectOption({ id: "github", name: "GitHub" })
                }
              >
                <img src={`/img/providers/github.svg`} className="mt-2 w-11" />
                <div className="text-center text-sm">GitHub</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "twitter", name: "Twitter" })
                }
                className="flex h-32 w-32 flex-col items-center justify-between rounded-lg border border-solid border-neutral-200 p-4 shadow-sm transition-colors duration-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-950"
              >
                <img src={`/img/providers/twitter.svg`} className="mt-2 w-11" />
                <div className="text-center text-sm">Twitter</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "keycloak", name: "keycloak" })
                }
                className="flex h-32 w-32 flex-col items-center justify-between rounded-lg border border-solid border-neutral-200 p-4 shadow-sm transition-colors duration-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-950"
              >
                <img
                  src={`/img/providers/keycloak.svg`}
                  className="mt-2 w-11"
                />
                <div className="text-center text-sm">Keycloak</div>
              </div>
              <div
                role="button"
                onClick={() => handleSelectOption({ id: "okta", name: "okta" })}
                className="flex h-32 w-32 flex-col items-center justify-between rounded-lg border border-solid border-neutral-200 p-4 shadow-sm transition-colors duration-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-950"
              >
                <img src={`/img/providers/okta.svg`} className="mt-2 w-11" />
                <div className="text-center text-sm">Okta</div>
              </div>
            </div>
          </>
        ) : null}
        {term && items.length === 0 ? (
          <p className="mt-6 rounded-md bg-violet-100 px-4 py-2 dark:bg-violet-300/50 dark:text-neutral-900">
            Can't find the OAuth provider you're looking for? You can always{" "}
            <Link href="/guides/configuring-oauth-providers#adding-a-new-built-in-provider">
              build your own
            </Link>
            .
          </p>
        ) : null}
      </ComboboxProvider>
      {selected && term && items.length !== 0 ? (
        <OAuthProviderInstructions
          providerId={selected}
          disabled={
            term.toLowerCase() !==
            manifest.providersOAuth[selected].toLowerCase()
          }
        />
      ) : null}
    </div>
  )
}
