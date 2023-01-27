// @ts-check
// @ts-expect-error
import * as github from "@actions/github"
// @ts-expect-error
import * as core from "@actions/core"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const addReproductionLabel = "incomplete"

/**
 * @typedef {{
 *  id :number
 *  node_id :string
 *  url :string
 *  name :string
 *  description :string
 *  color :string
 *  default :boolean
 * }} Label
 *
 * @typedef {{
 *  pull_request: any
 *  issue?: {body: string, number: number, labels: Label[]}
 *  label: Label
 * }} Payload
 *
 * @typedef {{
 *  payload: Payload
 *  repo: any
 * }} Context
 */

async function run() {
  try {
    /** @type {Context} */
    const { payload, repo } = github.context
    const {
      issue,
      pull_request,
      label: { name: newLabel },
    } = payload

    if (pull_request || !issue?.body || !process.env.GITHUB_TOKEN) return

    const labels = issue.labels.map((l) => l.name)
    // const isBugReport =
    //   labels.includes(bugLabel) || newLabel === bugLabel || !labels.length

    if (
      // !(isBugReport && issue.number > 43554) &&
      ![addReproductionLabel].includes(newLabel) &&
      !labels.includes(addReproductionLabel)
    ) {
      return core.info(
        "Not a bug report or not manually labeled or already labeled."
      )
    }

    const client = github.getOctokit(process.env.GITHUB_TOKEN).rest
    const issueCommon = { ...repo, issue_number: issue.number }

    if (
      newLabel === addReproductionLabel
      // || !hasValidRepro
    ) {
      await Promise.all([
        client.issues.addLabels({
          ...issueCommon,
          labels: [addReproductionLabel],
        }),
        client.issues.createComment({
          ...issueCommon,
          body: readFileSync(
            join(
              "/home/runner/work/next-auth/next-auth/.github/actions/issue-validator/repro.md"
            ),
            "utf8"
          ),
        }),
      ])
      return core.info(
        "Commented on issue, because it did not have a sufficient reproduction."
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
