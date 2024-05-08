import blc from "broken-link-checker"
import { setFailed } from "@actions/core"
import * as github from "@actions/github"

type TODO = any
type Output = {
  errors: any[]
  links: any[]
  pages: any[]
  sites: any[]
}
type Comment = {
  id: number
}
type FindBotComment = {
  octokit: TODO
  owner: string
  repo: string
  prNumber: number
}

const COMMENT_TAG = "# Broken Link Checker"

async function findBotComment({
  octokit,
  owner,
  repo,
  prNumber,
}: FindBotComment): Promise<Comment | undefined> {
  try {
    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
    })

    return comments.find((c: TODO) => c.body?.includes(COMMENT_TAG))
  } catch (error) {
    setFailed("Error finding bot comment: " + error)
    return undefined
  }
}

async function updateCheckStatus(
  brokenLinkCount: number,
  commentUrl?: string
): Promise<void> {
  const checkName = "Broken Link Checker"
  const summary = `Found ${brokenLinkCount} broken links in this PR. Click details for a list.`
  const text = `[See the comment for details](${commentUrl})`
  const { context, getOctokit } = github
  const octokit = getOctokit(process.env.GITHUB_TOKEN!)
  const { owner, repo } = context.repo

  // Can only update status on 'pull_request' events
  if (context.payload.pull_request) {
    const pullRequest = context.payload.pull_request
    const sha = pullRequest?.head.sha

    const checkParams = {
      owner,
      repo,
      name: checkName,
      head_sha: sha,
      status: "completed" as const,
      conclusion: "failure" as const,
      output: {
        title: checkName,
        summary: summary,
        text: text,
      },
    }

    try {
      await octokit.rest.checks.create(checkParams)
    } catch (error) {
      setFailed("Failed to create check: " + error)
    }
  }
}

const postComment = async (
  outputMd: string,
  brokenLinkCount: number = 0
): Promise<string> => {
  try {
    const { context, getOctokit } = github
    const octokit = getOctokit(process.env.GITHUB_TOKEN!)
    const { owner, repo } = context.repo
    let prNumber

    // Handle various trigger events
    if (context.payload.pull_request) {
      // Triggered by `pull_request`
      prNumber = context.payload.pull_request?.number
    } else if (context.payload.issue) {
      // Triggered by `issue_comment`
      prNumber = context.payload?.issue?.number
    }

    if (!prNumber) {
      setFailed("Count not find PR Number")
      return ""
    }

    const botComment = await findBotComment({
      octokit,
      owner,
      repo,
      prNumber,
    })
    if (botComment) {
      console.log("Updating Comment")
      const { data } = await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: botComment?.id,
        body: outputMd,
      })

      return data.html_url
    } else if (brokenLinkCount > 0) {
      console.log("Creating Comment")
      const { data } = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: outputMd,
      })
      return data.html_url
    }
    return ""
  } catch (error) {
    setFailed("Error commenting: " + error)
    return ""
  }
}

const generateOutputMd = (output: Output): string => {
  // Add comment header
  let outputMd = `${COMMENT_TAG}

> **${output.links.length}** broken links found. Links organised below by source page, or page where they were found.
`

  // Build map of page and array of its found broken links
  const linksByPage = output.links.reduce((acc, link) => {
    if (!acc[link.base.resolved]) {
      acc[link.base.resolved] = []
      acc[link.base.resolved].push(link)
    } else {
      acc[link.base.resolved].push(link)
    }
    return acc
  }, {})

  // Write out markdown tables of these links
  Object.entries(linksByPage).forEach(([page, links], i) => {
    outputMd += `

### ${i + 1}) [${new URL(page).pathname}](${page})

| Target Link | Link Text  |
|------|------|
`

    // @ts-expect-error
    links.forEach((link: TODO) => {
      outputMd += `| [${new URL(link.url.resolved).pathname}](${
        link.url.resolved
      }) | "${link.html?.text?.trim().replaceAll("\n", "")}" |
`
    })
  })

  // If there were scrape errors, append to bottom of comment
  if (output.errors.length) {
    outputMd += `
### Errors
`
    output.errors.forEach((error) => {
      outputMd += `
${error}
`
    })
  }

  return outputMd
}

// Main function that triggers link validation across .mdx files
async function brokenLinkChecker(): Promise<void> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is required")
  }
  const siteUrl =
    process.env.VERCEL_PREVIEW_URL || "https://authjs-nextra-docs.vercel.app"
  const output: Output = {
    errors: [],
    links: [],
    pages: [],
    sites: [],
  }

  const options = {
    excludeExternalLinks: true,
    honorRobotExclusions: false,
    filterLevel: 0,
    excludedKeywords: [],
  }

  const siteChecker = new blc.SiteChecker(options, {
    error: (error: TODO) => {
      output.errors.push(error)
    },
    link: (result: TODO) => {
      if (result.broken) {
        output.links.push(result)
      }
    },
    end: async () => {
      if (output.links.length) {
        // DEBUG
        // console.debug(output.links)

        // Skip links that returned 308
        const brokenLinksForAttention = output.links.filter(
          (link) => link.broken && !["HTTP_308"].includes(link.brokenReason)
        )

        const outputMd = generateOutputMd({
          errors: output.errors,
          links: brokenLinksForAttention,
          pages: [],
          sites: [],
        })
        const commentUrl = await postComment(
          outputMd,
          brokenLinksForAttention.length
        )

        // Update GitHub "check" status
        await updateCheckStatus(brokenLinksForAttention.length, commentUrl)

        brokenLinksForAttention.length && setFailed(`Found broken links`)
      }
    },
  })

  siteChecker.enqueue(siteUrl)
}

brokenLinkChecker()
