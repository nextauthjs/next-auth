# Contributing guide

Contributions and feedback on your experience of using this software are welcome.

This includes bug reports, feature requests, ideas, pull requests, and examples of how you have used this software.

Please see the [Code of Conduct](CODE_OF_CONDUCT.md) and follow any templates configured in GitHub when reporting bugs, requesting enhancements, or contributing code.

Please raise any significant new functionality or breaking change an issue for discussion before raising a Pull Request for it.

## For contributors

Anyone can be a contributor. Either you found a typo, or you have an awesome feature request you could implement, we encourage you to create a Pull Request.
### Pull Requests

* The latest changes are always in `canary`, so please make your Pull Request against that branch.
* Pull Requests should be raised for any change
* Pull Requests need approval of a [core contributor](https://next-auth.js.org/contributors#core-team) before merging
* Rebasing in Pull Requests is preferred to keep a clean commit history (see below)
* Running `npm run lint:fix` before committing can make resolving conflicts easier
* We encourage you to test your changes, and if you have the opportunity, please make those tests part of the Pull Request
* If you add new functionality, please provide the corresponding documentation as well and make it part of the Pull Request

### Setting up local environment

A quick and dirty guide on how to setup *next-auth* locally to work on it and test out any changes:

1. Clone the repo:

       git clone git@github.com:nextauthjs/next-auth.git
       cd next-auth/

2. Install packages and run the build command:

       npm i
       npm run build

3. Link your project back to your local copy of next auth:

       cd ../your-application
       npm link ../next-auth

4. Finally link React between the repo and the version installed in your project:

       cd ../next-auth
       npm link ../your-application/node_modules/react

*This is an annoying step and not obvious, but is needed because of how React has been written (otherwise React crashes when you try to use the `useSession()` hook in your project).*

That's it!

Notes: You may need to repeat both `npm link` steps if you install / update additional dependencies with `npm i`.

If you need an example project to link to, you can use [next-auth-example](https://github.com/iaincollins/next-auth-example).

#### Hot reloading

You might find it helpful to use the `npm run watch` command in the next-auth project, which will automatically (and silently) rebuild JS and CSS files as you edit them.

    cd next-auth/
    npm run watch

If you are working on `next-auth/src/client/index.js` hot reloading will work as normal in your Next.js app.

However, if you are working on anything else (e.g. `next-auth/src/server/*` etc) then you will need to *stop and start* your app for changes to apply as **Next.js will not hot reload those changes by default**. To facilitate this, you can try [this webpack plugin](https://www.npmjs.com/package/webpack-clear-require-cache-plugin). Note that the `next.config.js` syntax in the plugin README may be out of date. It should look like this:

```
const clearRequireCachePlugin = require('webpack-clear-require-cache-plugin')

module.exports = {
  webpack: (config, {
    buildId, dev, isServer, defaultLoaders, webpack,
  }) => {
    config.plugins.push(clearRequireCachePlugin([
      /\.next\/server\/static\/development\/pages/,
      /\.next\/server\/ssr-module-cache.js/,
      /next-auth/,
    ]))

    return config
  },
}
```

#### Databases

Included is a Docker Compose file that starts up MySQL, Postgres, and MongoDB databases on localhost.

It will use port `3306`, `5432`, and `27017` on localhost respectively; please make sure those ports are not used by other services on localhost.

You can start them with `npm run db:start` and stop them with `npm run db:stop`.

You will need Docker installed to be able to start / stop the databases.

When stopping the databases, it will reset their contents.

#### Testing

Tests can be run with `npm run test`.

Automated tests are currently crude and limited in functionality, but improvements are in development.

Currently, to run tests you need to first have started local test databases (e.g. using `npm run db:start`).

The databases can take a few seconds to start up, so you might need to give it a minute before running the tests.

## For maintainers

We use [semantic-release](https://github.com/semantic-release/semantic-release) together with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0) to automate releases. This makes the maintainenance process easier and less error-prone to human error. Please study the "Conventional Commits" site to understand how to write a good commit message.

When accepting Pull Requests, make sure the following:

* Use "Squash and merge"
* Make sure you merge contributor PRs into `canary`
* Rewrite the commit message to conform to the `Conventional Commits` style. Check the "Recommended Scopes" section for further advice.
* Optionally link issues the PR will resolve (You can add "close" in front of the issue numbers to close the issues automatically, when the PR is merged. `semantic-release` will also comment back to connected issues and PRs, notifying the users that a feature is added/bug fixed, etc.)

### Recommended Scopes

A typical conventional commit looks like this:
```
type(scope): title

body
```

Scope is the part that will help groupping the different commit types in the release notes.

Some recommened scopes are:

- **provider** - Provider related changes. (eg.: "feat(provider): add X provider", "docs(provider): fix typo in X documentation"
- **adapter** - Adapter related changes. (eg.: "feat(adapter): add X provider", "docs(provider): fix typo in X documentation"
- **db** - Database related changes. (eg.: "feat(db): add X database", "docs(db): fix typo in X documentation"
- **deps** - Adding/removing/updating a dependency (eg.: "chore(deps): add X")
  
> NOTE: If you are not sure which scope to use, you can simply ignore it. (eg.: "feat: add something"). Adding the correct type already helps a lot when analyzing the commit messages.


### Skipping a release

Every commit that contains [skip release] or [release skip] in their message will be excluded from the commit analysis and won't participate in the release type determination. This is useful, if the PR being merged should not trigger a new `npm` release.
