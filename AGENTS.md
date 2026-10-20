# AGENTS.md

StartOS service-package repository for route96 (Blossom server). Full packaging guide: <https://docs.start9.com/packaging>.

Keep `README.md` (technical reference) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- `store.json` is the source of truth. `config.yaml` is regenerated from it by `main.ts` on every start, so never hand-edit `config.yaml`.
- route96's DB `config` table overrides `config.yaml` (it is seeded once with INSERT IGNORE). Any key you start managing from StartOS must also be added to the `DELETE` in the `sync-db-config` oneshot in `main.ts`, or changes to it silently won't apply.
- Always write the `whitelist` key. Leaving it out opens uploads to everyone.
- Updating upstream: bump both the tag and the digest of `voidic/route96` in `startos/manifest/index.ts`. Check the new release's `src/settings.rs` and `migrations/` for config or DB changes.
- i18n: every `i18n('…')` string needs an entry in `startos/i18n/dictionaries/default.ts` and a translation for every locale in `translations.ts`.
