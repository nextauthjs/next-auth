const fetch = require("node-fetch")
const fs = require("fs")
const path = require("path")

;(() => {
  return fetch("https://api.github.com/repos/nextauthjs/next-auth/releases", {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "node-http",
    },
  })
    .then((res) => res.json())
    .then((allReleases) => {
      const stableReleases = allReleases.filter(
        (rel) => !rel.draft && !rel.prerelease
      )
      const latestStableName = stableReleases[0].name
      const unstableReleases = allReleases.filter(
        (rel) => !rel.draft && rel.prerelease
      )
      const latestUnstableName = unstableReleases[0].name
      fs.writeFileSync(
        path.join(process.cwd(), "scripts", "latest.json"),
        JSON.stringify(
          {
            latest: latestStableName,
            prerelease: latestUnstableName,
          },
          null,
          2
        )
      )
    })
})()
