# @stackline/load-plugin

> Resolve and load plugins, submodules, and files with the load-plugin 5 Promise API.

[![npm version](https://img.shields.io/npm/v/@stackline/load-plugin.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/load-plugin)
[![license](https://img.shields.io/npm/l/@stackline/load-plugin.svg?style=flat-square)](https://github.com/alexandroit/stackline-load-plugin/blob/main/license)
[![GitHub repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-load-plugin)

**[Documentation](https://github.com/alexandroit/stackline-load-plugin#readme)** |
**[npm](https://www.npmjs.com/package/@stackline/load-plugin)** |
**[Issues](https://github.com/alexandroit/stackline-load-plugin/issues)** |
**[Repository](https://github.com/alexandroit/stackline-load-plugin)**

**Package version:** `1.0.2`

## Why this package?

Maintained MIT-licensed fork of `load-plugin@5.1.0`. Preserves its `cwd`, `prefix`, `global`, and `key` options and Promise API. Requires Node.js 20.19+ on the 20.x line, or Node.js 22.12+.

Uses `@npmcli/config@10.13` and `import-meta-resolve@4.2` to remove deprecated glob dependencies and the old resolver's `fs.Stats` warning. Missing-file and directory errors retain the previous fallback behavior. Global prefix detection does not load npm configuration or alter the host environment.

Development: `npm ci`, `npm run build`, `npm test`, `npm run lint`. The upstream integration tests and global-prefix/fallback regressions run locally; declarations are generated from the preserved public JSDoc API.

Load submodules, plugins, or files.

### What is this?

This package is useful when you want to load plugins.
It resolves things like Node.js does, but supports a prefix (e.g., when given a
prefix `remark` and the user provided value `gfm`, it can find `remark-gfm`),
can load from several places, and optionally global too.

### When to use this?

This package is particularly useful when you want users to configure something
with plugins.
One example is `remark-cli` which can load remark plugins from configuration
files.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/load-plugin@1.0.2` |
| Supported Node.js | `^20.19.0 || >=22.12.0` |
| Module entry | `index.js` (ES modules) |
| Runtime dependencies | 2 direct dependencies |
| Types | `index.d.ts` |

The supported Node.js versions for this fork are declared in `package.json`.
This fork supports Node.js 20.19+ on the 20.x line, and Node.js 22.12+.
It also works in Deno and modern browsers.

## Installation

```bash
npm install @stackline/load-plugin
```

<a id="install"></a>

This package is [ESM only][esm].
In Node.js (20.19+ on the 20.x line, or 22.12+), install with [npm][]:

```sh
npm install @stackline/load-plugin
```

## Usage

```js
import {resolvePlugin} from '@stackline/load-plugin';
console.log(await resolvePlugin('./index.js', { cwd: process.cwd() }));
```

<a id="use"></a>

Say we’re in this project (with dependencies installed):

```js
import {loadPlugin, resolvePlugin} from '@stackline/load-plugin'

console.log(await resolvePlugin('lint', {prefix: 'remark'}))
// => '/Users/tilde/projects/oss/load-plugin/node_modules/remark-lint/index.js'

console.log(await resolvePlugin('validator-identifier', {prefix: '@babel/helper'}))
// => '/Users/tilde/Projects/oss/load-plugin/node_modules/@babel/helper-validator-identifier/lib/index.js'

console.log(await resolvePlugin('./index.js', {prefix: 'remark'}))
// => '/Users/tilde/projects/oss/load-plugin/index.js'

console.log(await loadPlugin('lint', {prefix: 'remark'}))
// => [Function: remarkLint]
```

## Security

Resolved plugins execute JavaScript when loaded. Use trusted plugin names and configuration; global-prefix detection itself does not load npm configuration or change the host environment.

## API Surface

<a id="api"></a>

This package exports the identifiers `loadPlugin` and `resolvePlugin`.
There is no default export.

### `loadPlugin(name[, options])`

Uses Node’s [resolution algorithm][algo] (through
[`import-meta-resolve`][import-meta-resolve]) to load CJS and ESM packages and
files to import `name` in each given `cwd` (and optionally the global
`node_modules` directory).

If a `prefix` is given and `name` is not a path, `$prefix-$name` is also
searched (preferring these over non-prefixed modules).
If `name` starts with a scope (`@scope/name`), the prefix is applied after it:
`@scope/$prefix-name`.

##### `options`

Configuration (optional).

###### `options.prefix`

Prefix to search for (`string`, optional).

###### `options.cwd`

Place or places to search from (`string`, `Array<string>`, default:
`process.cwd()`).

###### `options.global`

Whether to look for `name` in [global places][global] (`boolean`, optional,
defaults to whether global is detected).
If this is nullish, `load-plugin` will detect if it’s currently running in
global mode: either because it’s in Electron, or because a globally installed
package is running it.

Note: Electron runs its own version of Node instead of your system Node.
That means global packages cannot be found, unless you’ve [set-up][] a [`prefix`
in your `.npmrc`][prefix] or are using [nvm][] to manage your system node.

###### `options.key`

Identifier to take from the exports (`string` or `false`, default: `'default'`).
For example when given `'whatever'`, the value of `export const whatever = 1`
will be returned, when given `'default'`, the value of `export default …` is
used, and when `false` the whole module object is returned.

###### Returns

Promise yielding the results of importing the first path that exists
(`Promise<unknown>`).
The promise rejects if importing an existing path fails, or if no existing
path exists.

### `resolvePlugin(name[, options])`

Search for `name`.
Accepts the same parameters as [`loadPlugin`][load-plugin] (except `key`) but
returns a promise resolving to an absolute URL (`string`) for `name` instead of
importing it.
Throws if `name` cannot be found.

### Types

This package is fully typed with [TypeScript][].
It exports the additional types `ResolveOptions` and `LoadOptions`.

## Local Development

Clone the [repository](https://github.com/alexandroit/stackline-load-plugin) and run the following commands from its root:

```bash
npm ci
npm run build
npm test
npm run lint
```

The retained upstream development notes below include historical tooling; the commands above are the maintained package checks.

### Contribute

Yes please!
See [How to Contribute to Open Source][contribute].

## Release Checklist

1. Update the package version, lockfile, generated version fields, and changelog together.
2. Run the development checks above and audit both `npm audit` and `npm audit --omit=dev`.
3. Use the [GitHub publish workflow](https://github.com/alexandroit/stackline-load-plugin/actions/workflows/publish.yml) with its `Prod` environment to publish the exact CI tarball.
4. Verify public npm bytes, package identity, provenance, and the immutable GitHub release evidence.

## Community and Support

Report reproducible package issues in the [issue tracker](https://github.com/alexandroit/stackline-load-plugin/issues).

- [Stackline / Alexandro.Net](https://alexandro.net/)
- [GitHub](https://github.com/alexandroit)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)
- [Reddit community: r/Stackline](https://www.reddit.com/r/Stackline/)

## License

[MIT](https://github.com/alexandroit/stackline-load-plugin/blob/main/license). Original copyright notices and upstream attribution are retained.

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/wooorm/load-plugin/actions/workflows/main.yml/badge.svg

[build]: https://github.com/wooorm/load-plugin/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/load-plugin.svg

[coverage]: https://codecov.io/github/wooorm/load-plugin

[downloads-badge]: https://img.shields.io/npm/dm/load-plugin.svg

[downloads]: https://www.npmjs.com/package/load-plugin

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[contribute]: https://opensource.guide/how-to-contribute/

[global]: https://docs.npmjs.com/files/folders#node-modules

[prefix]: https://docs.npmjs.com/misc/config#prefix

[set-up]: https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md

[nvm]: https://github.com/creationix/nvm

[algo]: https://nodejs.org/api/esm.html#esm_resolution_algorithm

[import-meta-resolve]: https://github.com/wooorm/import-meta-resolve

[load-plugin]: #loadpluginname-options

See [NOTICE](https://github.com/alexandroit/stackline-load-plugin/blob/main/NOTICE) for retained attribution.

Dependency maintenance for this release is documented in [DEPENDENCY_UPDATES.md](DEPENDENCY_UPDATES.md). `import-meta-resolve` and the development plugin `remark-lint` retain their original import keys and use exact verified Stackline aliases.
