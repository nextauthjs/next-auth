# Contributing

Contributions and feedback on your experience of using this software are welcome.

This includes bug reports, feature requests, ideas, pull requests and examples of how you have used this software.

Please see the [Code of Conduct](CODE_OF_CONDUCT.md) and follow any templates configured in GitHub when reporting bugs, requesting enhancements or contributing code.

## Pull Requests

* Pull Requests should be raised for larger changes.
* Ideally, lots of small changes should be bundled up in to a larger PR.
* The latest changes are always in `master`
* Merging (and pushing merge commits to `master`) is disabled in this repo
* Rebasing is prefered to keep a clean commit history.
* Pushing directly to master should be reserved for minor updates / one off fixes.
* Pull Requests are great for batching up changes and making them easy to review and for tagging people so they can track changes, but they do not require approval from other commiters (commiters may raise and merge their own requests).

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

