import { describe, expect, it } from "vitest"
import parseProviders from "../src/lib/utils/providers"
import Spotify from "../src/providers/spotify"
import { testConfig } from "./utils"

describe("parseProviders", () => {
  it("merges a params-only authorization override into a string-shorthand default without losing the base URL", () => {
    // Spotify's `authorization` default is a plain string
    // ("https://accounts.spotify.com/authorize?scope=user-read-email").
    // Overriding just the scope, as the docs recommend, must not discard
    // that base URL.
    const config = testConfig({
      providers: [
        Spotify({
          clientId: "client-id",
          clientSecret: "client-secret",
          authorization: {
            params: { scope: "user-read-email playlist-read-private" },
          },
        }),
      ],
    })

    const { providers } = parseProviders({
      url: new URL("http://localhost:3000/auth"),
      config,
    })

    const spotify = providers[0] as any

    expect(spotify.authorization.url).toBeInstanceOf(URL)
    expect(spotify.authorization.url.origin).toBe(
      "https://accounts.spotify.com"
    )
    expect(spotify.authorization.url.pathname).toBe("/authorize")
    expect(spotify.authorization.url.searchParams.get("scope")).toBe(
      "user-read-email playlist-read-private"
    )
  })
})
