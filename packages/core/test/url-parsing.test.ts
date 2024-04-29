import { describe, expect, it } from "vitest"

import { parseActionAndProviderId } from "../src/lib/utils/web"
import { UnknownAction } from "../src/errors"

describe("parse the action and provider id", () => {
  it.each([
    {
      path: "/auuth/signin",
      error: "Cannot parse action at /auuth/signin",
      basePath: "/auth",
    },
    {
      path: "/api/auth/signin",
      error: "Cannot parse action at /api/auth/signin",
      basePath: "/auth",
    },
    {
      path: "/auth/auth/signin/github",
      error: "Cannot parse action at /auth/auth/signin/github",
      basePath: "/auth",
    },
    {
      path: "/api/auth/signinn",
      error: "Cannot parse action at /api/auth/signinn",
      basePath: "/api/auth",
    },
    {
      path: "/api/auth/signinn/github",
      error: "Cannot parse action at /api/auth/signinn/github",
      basePath: "/api/auth",
    },
    {
      path: "/api/auth/signin/github/",
      action: "signin",
      providerId: "github",
      basePath: "/api/auth",
    },
    {
      path: "/api/auth/signin/github",
      action: "signin",
      providerId: "github",
      basePath: "/api/auth",
    },
    {
      path: "/api/auth/signin/github/github",
      error: "Cannot parse action at /api/auth/signin/github/github",
      basePath: "/api/auth",
    },
    {
      path: "/api/auth/signin/api/auth/signin/github",
      error: "Cannot parse action at /api/auth/signin/api/auth/signin/github",
      basePath: "/api/auth",
    },
    {
      path: "/auth/signin/auth0/",
      action: "signin",
      providerId: "auth0",
      basePath: "/auth",
    },
    {
      path: "/auth/signin/auth0///",
      action: "signin",
      providerId: "auth0",
      basePath: "/auth",
    },
    {
      path: "/auth/signin/auth0",
      action: "signin",
      providerId: "auth0",
      basePath: "/auth",
    },
  ])("$path", ({ path, error, basePath, action, providerId }) => {
    if (action || providerId) {
      const parsed = parseActionAndProviderId(path, basePath)
      expect(parsed.action).toBe(action)
      expect(parsed.providerId).toBe(providerId)
    } else {
      expect(() => parseActionAndProviderId(path, basePath)).toThrow(
        new UnknownAction(error)
      )
    }
  })
})
