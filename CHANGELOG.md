# Changelog

## 1.0.0

- Fork load-plugin 5.1.0 under @stackline with its MIT license and Promise API.
- Update @npmcli/config to ^10.13.0 and supply the now-required constructor npmPath; retain loadGlobalPrefix-only behavior.
- Update import-meta-resolve to ^4.2.0, using moduleResolve to retain missing-file/directory errors and fallback across cwd entries.
- Preserve prefix/global resolution and avoid host environment mutation; add focused regressions.
- Replace obsolete development tooling with native Node tests and current TypeScript; commit an audited lockfile.
