# route96 for StartOS

StartOS package for [route96](https://github.com/v0l/route96), a Blossom (BUD-01/02/04/05/06/08/09) and NIP-96 blob server for Nostr.

End-user setup is in [instructions.md](instructions.md): whitelist a pubkey, bind a StartTunnel domain, set the public URL, configure Amethyst or Primal. This README is the technical reference.

## Upstream

| | |
|---|---|
| route96 | `voidic/route96:v0.7.0` pinned by multi-arch digest (upstream's latest stable release tag, 2026-04-10) |
| Database | `mariadb:11.4.13` (LTS) pinned by digest |
| Arches | `x86_64`, `aarch64` |

## Architecture

There are two daemons and one oneshot in a single package:

1. **mariadb**: MariaDB on `127.0.0.1:3306`, datadir on volume `mysql`. It uses the root account with a random 32-char alphanumeric password, generated at install and stored in `store.json`.
2. **sync-db-config** (oneshot): deletes the `public_url` and `max_upload_bytes` rows from route96's `config` table (see "Gotchas").
3. **route96**: listens on `0.0.0.0:8000` and runs `route96 --config /config/config.yaml`. Blobs are stored on volume `main`, mounted at `/app/data`.

**Why MariaDB and not SQLite?** route96 v0.7.0 supports only MySQL/MariaDB. `sqlx` is built with the `mysql` feature only, and every migration is MySQL dialect. SQLite isn't an option without patching upstream, so MariaDB runs as a second daemon in the same package.

### Volumes

| Volume | Contents |
|---|---|
| `main` | Blob files (`/app/data`) |
| `mysql` | MariaDB datadir |
| `startos` | `store.json` (package state, source of truth) and the generated `config.yaml` (mounted read-only into route96 at `/config`) |

Backups use `Backups.withMariadbDump` (a logical dump) and also back up the `main` and `startos` volumes.

### Interface

There is one HTTP interface, **Blossom API** (host `main`, interface `blossom`, port 8000, type `ui`). It serves the Blossom/NIP-96 API and route96's web UI at `/`. The user binds a StartTunnel clearnet domain to it.

### Health checks

- **Database**: `mariadb-admin ping` over TCP.
- **Blossom API**: `GET http://127.0.0.1:8000/`.
- **Uploads**: informational. It shows the whitelist count and size limit, or "disabled" while the whitelist is empty.
- **Public URL**: informational. It shows the URL route96 advertises.

## Configuration

`main.ts` regenerates `config.yaml` from `store.json` on every start:

| route96 key | Source |
|---|---|
| `listen` | fixed `0.0.0.0:8000` |
| `database` | `mysql://root:<pw>@127.0.0.1:3306/route96` |
| `storage_dir` | fixed `/app/data` |
| `max_upload_bytes` | **Server Settings** action (MiB, default 100) |
| `public_url` | **Server Settings → Custom Public URL** if set, else the **Set Public URL** choice (`sdk.setupPrimaryUrl`, preferring a public HTTPS domain), else `http://127.0.0.1:8000` |
| `whitelist` | **Uploader Whitelist** action. npubs are decoded to hex. Always written as an inline list. When it is empty, the list holds the sentinel `no-uploaders-configured`, which can never match a pubkey. |

### Actions

| Id | Purpose |
|---|---|
| `set-whitelist` | List of npub/hex uploader pubkeys (validated, including the bech32 checksum). Empty means no uploads. A task is raised on install. |
| `set-public-url` | Picks one of the interface's addresses as `public_url`. A task is raised while unset or stale. |
| `server-settings` | Max upload size (MiB) and an optional free-form public URL override |

### Features left off

The upstream image is built with `blossom,nip96,react-ui,r96util,media-compression,labels`. Rebuilding Rust/ffmpeg for two arches wasn't worth it to strip features. Instead, the generated config never enables them:

- **AI labelling / auto-moderation**: no `label_models` are configured, so no HuggingFace models are downloaded and no labelling runs.
- **Payments / quotas**: the `payments` feature isn't compiled into the image, and no `payments` section is written.
- **Retention auto-delete** (`delete_*_days`), **webhooks**, EXIF and steganography rejection: unset (off).
- **Media compression** stays available only on the opt-in `PUT /media` endpoint and NIP-96 uploads. Plain BUD-02 `PUT /upload` stores the bytes as-is.

There is **no total storage cap**. route96 has no global limit, only per-user quotas tied to the payments feature.

## Gotchas

- **The DB `config` table shadows `config.yaml`.** route96 seeds a `config` table from the file using `INSERT IGNORE`, then layers the table *over* the file. Without intervention, a changed `public_url` or `max_upload_bytes` would never take effect after the first start. The `sync-db-config` oneshot deletes those two rows before each start, and route96 re-seeds them from the file. If you manage more keys from StartOS, add them to that `DELETE`. This was verified locally: before the fix, a changed `public_url` was ignored.
- **Omitting `whitelist` means anyone can upload.** Never drop the key.
- An oversized upload returns HTTP 500 from upstream, not 413. It is still rejected.

## Building

```sh
npm ci
make            # builds route96_x86_64.s9pk and route96_aarch64.s9pk
```

`make` only repacks images, so no local `docker build` is needed. Both images are pulled by digest.

## Sideload

```sh
scp route96_x86_64.s9pk <host>:/tmp/ && ssh <host> 'sudo start-cli package install -s /tmp/route96_x86_64.s9pk'
ssh <host> 'sudo start-cli package logs route96 --limit 200'
```
