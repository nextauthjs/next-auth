import * as Ariakit from "@ariakit/react"
import { useSelectProvider } from "./useSelectProvider"
import { ChangeEvent } from "react"
import dynamic from "next/dynamic"

import manifest from "@/data/manifest.json"
import { Link } from "../Link"

const OAuthInstructions = dynamic(() =>
  import("../OAuthInstructions").then((mod) => mod.OAuthInstructions)
)

export function SelectProvider() {
  const { items, term, selected, handleSearchItem, handleSelectOption } =
    useSelectProvider()
  return (
    <>
      <Ariakit.ComboboxProvider value={term} defaultSelectedValue={selected}>
        <Ariakit.ComboboxLabel className="block mb-2 text-xl font-semibold">
          Select an OAuth Provider
        </Ariakit.ComboboxLabel>
        <Ariakit.Combobox
          placeholder="Type and select an OAuth Provider"
          className="py-2 px-4 w-full font-medium rounded-sm shadow-md md:w-96 bg-neutral-100 border-neutral-400 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearchItem(e.target.value)
          }
        />
        {items.length && term ? (
          <Ariakit.ComboboxPopover
            gutter={4}
            sameWidth
            className="overflow-y-scroll z-50 p-2 mt-1 max-h-72 rounded-md bg-neutral-100 dark:bg-neutral-900"
          >
            {items.map((item) => (
              <Ariakit.ComboboxItem
                className="flex flex-row gap-4 items-center py-2 px-2 cursor-pointer aria-selected:bg-violet-200 dark:aria-selected:text-neutral-900"
                value={item.name}
                key={item.name}
                onClick={() => handleSelectOption(item)}
              >
                <img
                  src={`/img/providers/${item.id}.svg`}
                  className="w-6 h-6 rounded-sm"
                />{" "}
                {item.name}
              </Ariakit.ComboboxItem>
            ))}
          </Ariakit.ComboboxPopover>
        ) : !term ? (
          <>
            <p className="mt-8 rounded-md">
              <strong>
                ↑ Type and select a provider to see its setup instructions.
              </strong>{" "}
              Otherwise, here are some suggested OAuth providers, click on any
              of them to see the provider's setup instructions:
            </p>
            <div className="flex flex-row gap-6 pb-8 mt-8">
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "google", name: "Google" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg transition-colors border-neutral-200 dark:border-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-600 hover:bg-neutral-50"
              >
                <img src={`/img/providers/google.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Google</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "twitter", name: "Twitter" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg border-neutral-200 transition-color dark:border-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-600 hover:bg-neutral-50"
              >
                <img src={`/img/providers/twitter.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Twitter</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "facebook", name: "Facebook" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg transition-colors border-neutral-200 dark:border-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-600 hover:bg-neutral-50"
              >
                <img
                  src={`/img/providers/facebook.svg`}
                  className="mt-2 w-11"
                />
                <div className="text-sm text-center">Facebook</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "auth0", name: "Auth0" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg transition-colors border-neutral-200 dark:border-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-600 hover:bg-neutral-50"
              >
                <img src={`/img/providers/auth0.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Auth0</div>
              </div>
              <div
                role="button"
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg transition-colors border-neutral-200 dark:border-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-600 hover:bg-neutral-50"
                onClick={() =>
                  handleSelectOption({ id: "auth0", name: "Auth0" })
                }
              >
                <img src={`/img/providers/github.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Github</div>
              </div>
            </div>
          </>
        ) : (
          <p className="py-2 px-4 mt-6 bg-violet-100 rounded-md dark:bg-violet-400/40 dark:text-neutral-900">
            Can't find the OAuth provider you're looking for? Then, you'll need
            to <Link href="/guides/custom-oauth">build your own provider</Link>.
          </p>
        )}
      </Ariakit.ComboboxProvider>
      {selected ? (
        <OAuthInstructions
          providerId={selected}
          disabled={term !== manifest.providersOAuth[selected]}
        />
      ) : null}
    </>
  )
}
