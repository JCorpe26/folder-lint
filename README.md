<!-- @format -->

# Folder Structure Lint

A custom eslint to ensure files follow a folder structure.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-folder-lint`:

```sh
npm install eslint-plugin-folder-lint --save-dev
```

(Local development when creating a rule):

```sh
# folder-lint
npm run build

# target repo
npm install --D file:../folder-lint/.build
```

## Usage

Add `folder-lint` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["folder-lint"]
}
```

Then configure the rules you want to use under the rules section.

```
{
    "rules": {
        "folder-lint/lint": ['error, {
            baseDir: 'src',
            allowedPaths: ['components/*']
        }]
    }
}
```

For example:

| Rule                         | Meaning                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components`                 | ✅&nbsp;&nbsp;The directory `components` (and files in it) is accepted.<br/> ❌&nbsp;&nbsp;Any nested directory is not accepted.                                                                                                                                                                                                                                                             |
| `components/*`               | ✅&nbsp;&nbsp;The directory `components` is accepted.<br/> ✅&nbsp;&nbsp;Any _first level_ nested directory is accepted.<br/> ❌&nbsp;&nbsp;Any _second level_ nested directory is not accepted.                                                                                                                                                                                             |
| `components/*/utils`         | ✅&nbsp;&nbsp;The directory `components` is accepted.<br/> ✅&nbsp;&nbsp;Any _first level_ nested directory is accepted.<br/> ✅&nbsp;&nbsp;The _second level_ nested directory `utils` is accepted.<br/> ❌&nbsp;&nbsp;Any other _second level_ nested directory is not accepted.                                                                                                           |
| `components/**`              | ✅&nbsp;&nbsp;The directory `components` is accepted.<br/> ✅&nbsp;&nbsp;Any nested directory on _any level_ is accepted.                                                                                                                                                                                                                                                                    |
| `components/*/components/**` | ✅&nbsp;&nbsp;The directory `components` is accepted.<br/> ✅&nbsp;&nbsp;Any _first level_ nested directory is accepted.<br/> ✅&nbsp;&nbsp;The _second level_ nested directory `components` is accepted.<br/> ❌&nbsp;&nbsp;Any other _second level_ nested directory is not accepted.<br/> ✅&nbsp;&nbsp;Any nested directory on _any level_ inside of _components_ directory is accepted. |
