import { expect, it } from "vitest"
import GitLab from "../../src/providers/gitlab"

it("GitLab should handle baseURL correctly", () => {
  const config = GitLab({
    baseUrl: "https://gitlab.example.com",
  })
  expect(config.id).toBe("gitlab")
  expect(config.name).toBe("GitLab")
  expect(config.type).toBe("oauth")
  expect(config.authorization).toEqual(
    "https://gitlab.example.com/oauth/authorize?scope=read_user"
  )
  expect(config.token).toEqual("https://gitlab.example.com/oauth/token")
  expect(config.userinfo).toEqual("https://gitlab.example.com/api/v4/user")
})
