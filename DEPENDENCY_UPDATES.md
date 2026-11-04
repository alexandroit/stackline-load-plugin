# Security maintenance for @stackline/load-plugin 1.0.5

Reviewed 2026-11-04. Removed `@npmcli/config`: its only use was global-prefix calculation, now implemented with Node built-ins and covered by PREFIX, DESTDIR, Windows, and Electron/NVM regressions. This removes the vulnerable glob/minimatch runtime closure from fresh consumer installations.

The `import-meta-resolve` runtime alias and `remark-lint` development alias now pin their registry-confirmed `@stackline` 1.0.2 versions. Later versions must exist on npm before adoption.

# Dependency maintenance for @stackline/load-plugin 1.0.2

Reviewed 2026-09-28. Direct dependency aliases retain the original import names and pin the verified Stackline maintenance releases. The public API and declared runtime compatibility remain unchanged.

| Import / install key | Previous requirement | Maintained requirement | Verified release |
| --- | --- | --- | --- |
| `import-meta-resolve` | `^4.2.0` | `npm:@stackline/import-meta-resolve@1.0.0` | [@stackline/import-meta-resolve](https://github.com/alexandroit/stackline-import-meta-resolve/releases/tag/stackline-v1.0.0) |
| `remark-lint` | `^9.0.0` | `npm:@stackline/remark-lint@1.0.0` | [@stackline/remark-lint](https://github.com/alexandroit/stackline-remark-lint/releases/tag/stackline-v1.0.0) |

Each linked release was published through GitHub Actions and checked against its exact CI tarball, npm provenance and signatures, direct/aliased installations, and immutable release assets before adoption. Original upstream attribution and license texts remain in the dependency packages. Test-only upstream comparison packages remain independent oracles. Only the original parent projects’ direct/runtime/dev dependencies are in this audit scope; transitive dependencies are not recursively forked.
