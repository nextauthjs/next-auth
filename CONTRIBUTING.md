# Contributing

Contributions and feedback on your experience of using this software are welcome.

This includes bug reports, feature requests, ideas, pull requests and examples of how you have used this software.

Please see the [Code of Conduct](CODE_OF_CONDUCT.md) and follow any templates configured in GitHub when reporting bugs, requesting enhancements or contributing code.

## Pull Requests

* The latest changes are always in `master` 
* Pull Requests should be raised for larger changes
* Pull Requests do not need approval before merging for those with contributor access (it's just helpful to have them to track changes)
* Rebasing in Pull Requests is prefered to keep a clean commit history (see below)
* Running `npm run lint:fix` before committing can make resolving conflicts easier, but is not required
* Merge commits (and pushing merge commits to `master`) are disabled in this repo
* Pushing directly to master should ideally be reserved for minor updates / one off fixes

## Rebasing

If you create a branch and there are conflicting updates in the `master` branch, you can resolve them by rebasing from a check out of your branch:

    git fetch
    git rebase origin/master

If there are any conflicts, you can resolve them and stage the files, then run:

    git rebase --continue

*If there are a lot of changes you may be prompted to step more than once.*

When the rebase is complete (i.e. there are no more conflicts) you should push your changes to your branch before doing anyhing else:

   git push --force-with-lease

You should see that any conflicts in your PR are now resolved. You can review changes to make sure it contains changes you intended to make.

*If you accidentally sync before pushing, it will trigger a merge. Uou can use `git merge --abort` to undo the merge.*

You can use `npm run lint:fix` to automatically apply Standard JS rules to resolve formatting differences (tabs vs spaces, line endings, etc).

## Setting up local environment

A quick and dirty guide on how to setup *next-auth* locally to work on it and test things out:

1. Clone the repo:

       git clone git@github.com:iaincollins/next-auth.git
       cd next-auth/

2. Install packages and run the build command:

       npm i
       npm run build

3. Link React between the repo and the version installed in your project:

       npm link ../your-application/node_modules/react

*This is an annoying step and not obvious, but is needed because of how React has been written (otherwise React crashes when you try to use the `useSession()` hook in your project).*

4. Finally link your project back to your local copy of next auth:

       cd ../your-application
       npm link ../next-auth

That's it!

NB: You may need to repeat both `npm link` steps if you install / update additional dependancies with `npm i`.

### Hot reloading

You might find it helpful to use the `npm run watch` command in the next-auth project, which will automatically (and silently) rebuild JS and CSS files as you edit them.

    cd next-auth/
    npm run watch

If you are working on `next-auth/src/client/index.js` hot reloading will work as normal in your Next.js app.

However  if you are working on anything else (e.g. `next-auth/src/server/*` etc) then you will need to *stop and start* your app for changes to apply as **Next.js will not hot reload those changes**.

## Testing builds

You may also want to clone the repo in GitHub as a way to test a change on a live site (e.g. on now.sh).

You can do this using npm's ability to install a package from a GitHub repo or branch:

    npm install your-github-username/next-auth#master