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

