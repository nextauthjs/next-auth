# Contributing guide

Contributions and feedback on your experience of using this software are welcome.

This includes bug reports, feature requests, ideas, pull requests and examples of how you have used this software.

Please see the [Code of Conduct](CODE_OF_CONDUCT.md) and follow any templates configured in GitHub when reporting bugs, requesting enhancements or contributing code.

Please raise any significant new functionality or breaking change an issue for discussion before raising a Pull Request for it.

## Pull Requests

* The latest changes are always in `main` 
* Pull Requests should be raised for larger changes
* Pull Requests do not need approval before merging for those with contributor access (it's just helpful to have them to track changes)
* Rebasing in Pull Requests is prefered to keep a clean commit history (see below)
* Running `npm run lint:fix` before committing can make resolving conflicts easier, but is not required
* Merge commits (and pushing merge commits to `main`) are disabled in this repo; but commits in PR can be squashed so this is not a blocker
* Pushing directly to main should ideally be reserved for minor updates (e.g. correcting typos) or small single-commit fixes

## Rebasing

*If you don't rebase and end up with merge commits in a PR then it's not a blocker, we can alway squash the commits when merging!*

If you create a branch and there are conflicting updates in the `main` branch, you can resolve them by rebasing from a check out of your branch:

    git fetch
    git rebase origin/main

If there are any conflicts, you can resolve them and stage the files, then run:

    git rebase --continue

*If there are a lot of changes you may be prompted to step more than once.*

When the rebase is complete (i.e. there are no more conflicts) you should push your changes to your branch before doing anyhing else:

   git push --force-with-lease

You should see that any conflicts in your PR are now resolved. You can review changes to make sure it contains changes you intended to make.

*If you accidentally sync before pushing, it will trigger a merge. Uou can use `git merge --abort` to undo the merge.*

You can use `npm run lint:fix` to automatically apply Standard JS rules to resolve formatting differences (tabs vs spaces, line endings, etc).

## Setting up local environment

A quick and dirty guide on how to setup *next-auth* locally to work on it and test out any changes:

1. Clone the repo:

       git clone git@github.com:iaincollins/next-auth.git
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

Notes: You may need to repeat both `npm link` steps if you install / update additional dependancies with `npm i`.

If you need an example project to link to, you can use [next-auth-example](https://github.com/iaincollins/next-auth-example).

### Hot reloading

You might find it helpful to use the `npm run watch` command in the next-auth project, which will automatically (and silently) rebuild JS and CSS files as you edit them.

    cd next-auth/
    npm run watch

If you are working on `next-auth/src/client/index.js` hot reloading will work as normal in your Next.js app.

However if you are working on anything else (e.g. `next-auth/src/server/*` etc) then you will need to *stop and start* your app for changes to apply as **Next.js will not hot reload those changes by default**. To facitate this, you can try [this webpack plugin](https://www.npmjs.com/package/webpack-clear-require-cache-plugin). Note that the config syntax in the plugin README may be out of date. It should look like this:

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

### Databases

Included is a Docker Compose file that starts up MySQL, Postgres and MongoDB databases on localhost.

It will use port 3306, 5432 and 27017 on localhost respectively; it will not work if are running existing databases on localhost.

You can start them with `npm run db:start` and stop them with `npm run db:stop`.

You will need Docker installed to be able to start / stop the databases.

When stop the databases, it will reset their contents.

### Testing

Tests can be run with `npm run test`.

Automated tests are currently crude and limited in functionality, but improvements are in development.

Currently to run tests you need to first have started local test databases (e.g. using `npm run db:start`).

The databases can take a few seconds to start up, so you might need to give it a minute before running the tests.
