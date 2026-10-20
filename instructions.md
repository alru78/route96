# route96 (Blossom)

route96 is a [Blossom](https://github.com/hzrd149/blossom) media server for Nostr. Nostr clients upload images and video to it and get back a link, which they then put in your notes. It also speaks NIP-96.

**Out of the box nobody can upload.** Downloads of existing blobs are public. Uploads, mirroring and deleting are limited to pubkeys you whitelist.

## 1. Whitelist your pubkey

1. Open **Actions → Uploader Whitelist**.
2. Add your Nostr public key, either `npub1…` or 64-character hex. You can add more than one, for example a second account.
3. Save. route96 restarts with the new list. The **Uploads** health check on the dashboard shows how many uploaders are allowed.

To block all uploads again, remove every entry.

## 2. Bind a public domain (StartTunnel)

Nostr clients and the people who read your notes have to reach the server from the internet.

1. Open the **Blossom API** interface on the dashboard.
2. Add your StartTunnel clearnet domain (for example `blossom.example.com`) to it, with HTTPS.
3. Check that `https://blossom.example.com/` loads the route96 page.

## 3. Set the public URL

route96 writes the server's URL into every blob link it returns, so that URL must be the public one.

1. Open **Actions → Set Public URL**.
2. Pick your StartTunnel domain (the `https://` entry) and save.

The **Public URL** health check shows what is being advertised now. If your public address doesn't appear in the list (for example, you run your own reverse proxy outside StartOS), enter it under **Actions → Server Settings → Custom Public URL** instead. A value there overrides the choice above.

## 4. Point your Nostr client at it

Use the public URL, e.g. `https://blossom.example.com`, and sign in to the client with the key you whitelisted.

- **Amethyst**: Settings → Media Servers → add a Blossom server. Paste the URL, then select it as the default upload server.
- **Primal**: Settings → Media Uploads → Blossom server. Set it to your URL. Some versions call this "Media server". You can also add it as a mirror.
- **Other clients** (noStrudel, Coracle, etc.): look for "Blossom servers" or "Media servers" and add the URL.

Many clients also publish your server list as a kind 10063 event, so other Blossom-aware apps can find your media.

## Other settings

**Actions → Server Settings → Maximum Upload Size** sets the largest file accepted. The default is 100 MiB.

## Limitations

- **There is no total storage cap.** route96 can only enforce per-user quotas through its Lightning payment system, and this package leaves that off. Disk use is bounded only by your whitelist and the free space on your server. Check the server's storage page now and then.
- AI content labelling, paid plans and analytics are off.
- The route96 web UI at `/` works, but its admin features need an admin user, which this package doesn't set up.
