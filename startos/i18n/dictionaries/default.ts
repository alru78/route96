export const DEFAULT_LANG = 'en_US'

const dict = {
  'Maximum Upload Size': 0,
  'Largest single blob route96 will accept. Larger uploads are rejected.': 1,
  'Custom Public URL (advanced)': 2,
  'Only needed if your public address is not one of the Blossom interface addresses StartOS knows about (for example an external reverse proxy). Overrides the "Set Public URL" choice. Leave empty to use that choice.': 3,
  'Must be an http:// or https:// URL': 4,
  'Server Settings': 5,
  'Maximum upload size and an optional custom public URL.': 6,
  'Allowed Uploader Pubkeys': 7,
  'Nostr public keys (npub1… or 64-character hex) allowed to upload, mirror and delete blobs. Leave empty to block all uploads. Anyone can still download existing blobs.': 8,
  'Must be an npub1… key or a 64-character hex public key': 9,
  'Uploader Whitelist': 10,
  'Choose which Nostr pubkeys may upload to this server. Until at least one is set, nobody can upload.': 11,
  'Choose the public URL route96 should put in blob links (your StartTunnel domain, once bound).': 12,
  'Add at least one uploader pubkey. Until then nobody can upload to this server.': 13,
  'Blossom API': 14,
  'Blossom / NIP-96 HTTP API (and the route96 web UI at /). Bind your StartTunnel clearnet domain to this interface.': 15,
  'Starting route96': 16,
  'store.json not found': 17,
  Database: 18,
  'The database is ready': 19,
  'Starting the database…': 20,
  'The Blossom API is responding': 21,
  'The Blossom API is not responding': 22,
  Uploads: 23,
  '${n} whitelisted uploader(s); max ${size} MiB': 24,
  'No uploader pubkeys set, so all uploads are rejected. Run the Uploader Whitelist action.': 25,
  'Public URL': 26,
  'Blob URLs are advertised as ${url}': 27,
  'Set Public URL': 28,
  'Choose which address route96 puts into blob URLs it hands to Nostr clients. Pick your public (StartTunnel) domain so other people can load your media.': 29,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
