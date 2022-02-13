export interface Commit {
  commit: CommitOrTree
  tree: CommitOrTree
  author: AuthorOrCommitter
  committer: AuthorOrCommitter
  subject: string
  body: string
  parsed: Parsed
}

export interface CommitOrTree {
  long: string
  short: string
}

export interface AuthorOrCommitter {
  name: string
  email: string
  date: string
}

export interface Parsed {
  type: string
  scope?: string | null
  subject: string
  merge?: null
  header: string
  body?: null
  footer?: null
  notes?: null[] | null
  references?: null[] | null
  mentions?: null[] | null
  revert?: null
  raw: string
}

export interface Package {
  name: string
  srcDir: string
  peerDependencies?: string[]
}

export interface BranchConfig {
  prerelease: boolean
  ghRelease: boolean
}

export interface PackageToRelease {
  name: string
  newVersion: string
  oldVersion: string
  commits: GroupedCommits
  path: string
}

export interface GroupedCommits {
  features: Commit[]
  bugfixes: Commit[]
  other: Commit[]
  breaking: Commit[]
}
