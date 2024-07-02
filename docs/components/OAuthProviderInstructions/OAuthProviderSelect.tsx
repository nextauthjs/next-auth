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
          className="py-2 px-4 w-full font-medium rounded-md border-2 border-gray-200 shadow-sm md:w-96 bg-neutral-100 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearchItem(e.target.value)
          }
        />
        <ComboboxPopover
          gutter={4}
          sameWidth
          hideOnEscape
          hideOnInteractOutside
          className="overflow-y-scroll z-50 p-2 mt-1 max-h-72 rounded-md bg-neutral-100 dark:bg-neutral-900"
        >
          {items.map((item) => (
            <ComboboxItem
              className="flex flex-row gap-4 items-center py-2 px-2 cursor-pointer aria-selected:bg-violet-200 dark:aria-selected:bg-violet-500 dark:aria-selected:text-neutral-900"
              value={item.name}
              key={item.name}
              onClick={() => handleSelectOption(item)}
            >
              <img
                src={`/img/providers/${item.id}.svg`}
                className="w-6 h-6 rounded-sm"
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
            <div className="flex flex-row gap-6 pb-8 mt-8">
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "google", name: "Google" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm transition-colors duration-300 border-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50"
              >
                <img src={`/img/providers/google.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Google</div>
              </div>
              <div
                role="button"
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm transition-colors duration-300 border-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50"
                onClick={() =>
                  handleSelectOption({ id: "github", name: "GitHub" })
                }
              >
                <img src={`/img/providers/github.svg`} className="mt-2 w-11 dark:hidden block" />
                <img src={`/img/providers/github-dark.svg`} className="mt-2 w-11 dark:block hidden" />
                <div className="text-sm text-center">GitHub</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "twitter", name: "Twitter" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm transition-colors duration-300 border-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50"
              >
                <img src={`/img/providers/twitter.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Twitter</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "keycloak", name: "keycloak" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm transition-colors duration-300 border-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50"
              >
                <img
                  src={`/img/providers/keycloak.svg`}
                  className="mt-2 w-11"
                />
                <div className="text-sm text-center">Keycloak</div>
              </div>
              <div
                role="button"
                onClick={() => handleSelectOption({ id: "okta", name: "okta" })}
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm transition-colors duration-300 border-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50"
              >
                <img src={`/img/providers/okta.svg`} className="mt-2 w-11 dark:hidden block" />
                <img src={`/img/providers/okta-dark.svg`} className="mt-2 w-11 dark:block hidden" />
                <div className="text-sm text-center">Okta</div>
              </div>
            </div>
          </>
        ) : null}
        {term && items.length === 0 ? (
          <p className="py-2 px-4 mt-6 bg-violet-100 rounded-md dark:bg-violet-300/50 dark:text-neutral-900">
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
