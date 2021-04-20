# Contributing guide

Contributions and feedback on your experience of using this software are welcome.

This includes bug reports, feature requests, ideas, pull requests, and examples of how you have used this software.

Please see the [Code of Conduct](CODE_OF_CONDUCT.md) and follow any templates configured in GitHub when reporting bugs, requesting enhancements, or contributing code.

Please raise any significant new functionality or breaking change an issue for discussion before raising a Pull Request for it.

## For contributors

Anyone can be a contributor. Either you found a typo, or you have an awesome feature request you could implement, we encourage you to create a Pull Request.
### Pull Requests

* The latest changes are always in `main`, so please make your Pull Request against that branch.
* Pull Requests should be raised for any change
* Pull Requests need approval of a [core contributor](https://next-auth.js.org/contributors#core-team) before merging
* We use ESLint/Prettier for linting/formatting, so please run `npm run lint:fix` before committing to make resolving conflicts easier (VSCode users, check out [this ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [this Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to fix lint and formatting issues in development)
* We encourage you to test your changes, and if you have the opportunity, please make those tests part of the Pull Request
* If you add new functionality, please provide the corresponding documentation as well and make it part of the Pull Request

### Setting up local environment

A quick guide on how to setup *next-auth* locally to work on it and test out any changes:

1. Clone the repo:
```sh
git clone git@github.com:nextauthjs/next-auth.git
cd next-auth
```

2. Install packages:
```sh
npm i
```

3. Populate `.env.local`:
   
    Copy `.env.local.example` to `.env.local`, and add your env variables for each provider you want to test.

> NOTE: You can add any environment variables to .env.local that you would like to use in your dev app.
> You can find the next-auth config under`pages/api/auth/[...nextauth].js`.

1. Start the dev application/server:
```sh
npm run dev
```

Your dev application will be available on ```http://localhost:3000```

That's it! 🎉

If you need an example project to link to, you can use [next-auth-example](https://github.com/iaincollins/next-auth-example).

#### Hot reloading

When running `npm run dev`, you start a Next.js dev server on `http://localhost:3000`, which includes hot reloading out of the box. Make changes on any of the files in `src` and see the changes immediately.

>NOTE: When working on CSS, you will need to manually refresh the page after changes. (Improving this through a PR is very welcome!)

#### Providers

If you think your custom provider might be useful to others, we encourage you to open a PR and add it to the built-in list so others can discover it much more easily! You only need to add two changes:
1. Add your config: [`src/providers/{provider}.js`](https://github.com/nextauthjs/next-auth/tree/main/src/providers) (Make sure you use a named default export, like `export default function YourProvider`!)
2. Add provider documentation: [`www/docs/providers/{provider}.md`](https://github.com/nextauthjs/next-auth/tree/main/www/docs/providers)

That's it! 🎉 Others will be able to discover this provider much more easily now!

You can look at the existing built-in providers for inspiration.

#### Databases

Included is a Docker Compose file that starts up MySQL, Postgres, and MongoDB databases on localhost.

It will use port `3306`, `5432`, and `27017` on localhost respectively; please make sure those ports are not used by other services on localhost.

You can start them with `npm run db:start` and stop them with `npm run db:stop`.

You will need Docker and Docker Compose installed to be able to start / stop the databases.

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
* Make sure you merge contributor PRs into `main`
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
