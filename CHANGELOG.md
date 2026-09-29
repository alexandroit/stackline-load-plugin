# Changelog

## 1.0.2 - 2026-09-28

- Pin verified Stackline maintenance forks under the existing dependency import names; see `DEPENDENCY_UPDATES.md`.
- Preserve the package API, supported runtimes, upstream comparison tests, and original licenses.

## 1.0.1 (2026-09-28)

- Standardize package documentation, preserve the API reference and upstream attribution, and add Stackline community links.
- Add focused npm discovery keywords and consistent repository metadata.
- Keep runtime behavior and dependency versions unchanged.
- Correct the pinned artifact-upload action commit while preserving the publish.yml workflow and Prod environment.

## 1.0.0

- Fork load-plugin 5.1.0 under @stackline with its MIT license and Promise API.
- Update @npmcli/config to ^10.13.0 and supply the now-required constructor npmPath; retain loadGlobalPrefix-only behavior.
- Update import-meta-resolve to ^4.2.0, using moduleResolve to retain missing-file/directory errors and fallback across cwd entries.
- Preserve prefix/global resolution and avoid host environment mutation; add focused regressions.
- Replace obsolete development tooling with native Node tests and current TypeScript; commit an audited lockfile.
