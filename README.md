<!-- @format -->

# eslint-plugin-mpb

Custom eslint rules for MPB

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-mpb`:

```sh
npm install eslint-plugin-mpb --save-dev
```

(Local development when creating a rule):

```sh
npm install --D file:../eslint-mpb
```

## Usage

Add `mpb` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["mpb"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "mpb/rule-name": 2
    }
}
```
