import * as Ariakit from "@ariakit/react";
import { useSelectProvider } from "./useSelectProvider";
import { ChangeEvent } from "react";
import { OAuthInstructions } from "../OAuthInstructions";
import manifest from "@/data/manifest.json";
import { Link } from "../Link";

export function SelectProvider() {
  const { items, term, selected, handleSearchItem, handleSelectOption } =
    useSelectProvider();

  return (
    <>
      <Ariakit.ComboboxProvider value={term}>
        <Ariakit.ComboboxLabel className="block mb-2 text-xl font-semibold">
          Select an OAuth Provider
        </Ariakit.ComboboxLabel>
        <Ariakit.Combobox
          placeholder="Type and select an OAuth Provider"
          className="py-2 px-4 w-full font-medium rounded-sm shadow-md md:w-96 bg-slate-100 border-slate-400 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearchItem(e.target.value)
          }
        />
        {items.length && term ? (
          <Ariakit.ComboboxPopover
            gutter={4}
            sameWidth
            className="overflow-y-scroll z-50 p-2 mt-1 max-h-72 rounded-md bg-slate-100 dark:bg-slate-900"
          >
            {items.map((item) => (
              <Ariakit.ComboboxItem
                className="flex flex-row gap-4 items-center py-2 px-2 cursor-pointer aria-selected:bg-amber-200 dark:aria-selected:text-slate-900"
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
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg transition-colors border-slate-200 dark:border-neutral-800 dark:border-slate-600 dark:hover:bg-slate-600 hover:bg-slate-50"
              >
                <img src={`/img/providers/google.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Google</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "twitter", name: "Twitter" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg border-slate-200 transition-color dark:border-neutral-800 dark:border-slate-600 dark:hover:bg-slate-600 hover:bg-slate-50"
              >
                <img src={`/img/providers/twitter.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Twitter</div>
              </div>
              <div
                role="button"
                onClick={() =>
                  handleSelectOption({ id: "facebook", name: "Facebook" })
                }
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg transition-colors border-slate-200 dark:border-neutral-800 dark:border-slate-600 dark:hover:bg-slate-600 hover:bg-slate-50"
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
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg transition-colors border-slate-200 dark:border-neutral-800 dark:border-slate-600 dark:hover:bg-slate-600 hover:bg-slate-50"
              >
                <img src={`/img/providers/auth0.svg`} className="mt-2 w-11" />
                <div className="text-sm text-center">Auth0</div>
              </div>
              <div
                role="button"
                className="flex flex-col justify-between items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg transition-colors border-slate-200 dark:border-neutral-800 dark:border-slate-600 dark:hover:bg-slate-600 hover:bg-slate-50"
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
          <p className="py-2 px-4 mt-6 bg-amber-100 rounded-md dark:bg-amber-400 dark:text-slate-900">
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
  );
}
