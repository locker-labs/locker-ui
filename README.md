# Locker User Interface

The user interface for the Locker application.

It communicates with locker-api.

## Getting Started with Development

The following are instructions to get a copy of the project running locally on your machine for developement and testing purposes.

### Prerequisites

The preferred package manager of the Chain Rule team is [npm](https://docs.npmjs.com/), so this README only references npm, but pmpm or yarn may be used alternatively.

Ensure that npm is installed globally on your machine.

### Installing, Running, and Building

Run `npm install` to install the project's dependencies.

Run `npm run dev` to start the app server locally.

Go to [localhost:3000](http://localhost:3000) in the web browser to view the app.

Run `npm run build` to get a complete bundle of the app.

### Testing, Formatting, and Linting

Run `npm run test` to run all tests.

Run `npm run format` to format all the code.

Run `npm run lint:check` to run the linter.

## Contributing

-   On a new branch, open a PR for a particular set of changes.
-   Name the PR according to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) guidelines.
-   All commits must be related to the PR name and commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) guidelines.
-   To make the enforcement of these guidelines easier, husky, commitlint, commitizen, and GitHub Actions have been configured for this project.
-   All PRs must be squashed and merged to keep a clean history on the main branch.

### Acceptable Commit Message Labels

| Label    | Description                                                                       |
| -------- | --------------------------------------------------------------------------------- |
| feat     | A new feature                                                                     |
| fix      | A bug fix                                                                         |
| docs     | Documentation only changes                                                        |
| style    | Changes that do not affect the meaning of the code (white-space, formatting, etc) |
| refactor | A code change that neither fixes a bug nor adds a feature                         |
| perf     | A code change that improves performance                                           |
| test     | Adding missing tests or correcting existing tests                                 |
| build    | Changes that affect the build system or external dependencies                     |
| ci       | Changes to our CI configuration files and scripts                                 |
| chore    | Other changes that don't modify src or test files                                 |
| revert   | Reverts a previous commit                                                         |
