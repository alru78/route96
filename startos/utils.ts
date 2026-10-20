// Shared constants and helpers.

/** Port route96 listens on inside its subcontainer. */
export const apiPort = 8000

/** `sdk.MultiHost.of` id for the single HTTP binding. */
export const mainHostId = 'main'
/** Id of the exported Blossom API interface. */
export const blossomInterfaceId = 'blossom'

export const MARIADB_DATADIR = '/var/lib/mysql' as const
export const DB_NAME = 'route96'

/** Where the startos volume is mounted in the route96 subcontainer. */
export const CONFIG_DIR = '/config'
export const CONFIG_PATH = `${CONFIG_DIR}/config.yaml`
/** Where blobs live (the `main` volume). */
export const STORAGE_DIR = '/app/data'

export const MIB = 1024 * 1024
export const DEFAULT_MAX_UPLOAD_MIB = 100

/**
 * route96 treats an *empty* inline whitelist exactly like any other inline
 * list (nobody matches), but we never want to depend on how the YAML/config
 * layers handle an empty sequence. When no uploader is configured we write
 * this sentinel instead: it is not 64-char hex, so no Nostr pubkey can ever
 * equal it, and every upload is rejected with "Not on whitelist".
 */
export const NOBODY_SENTINEL = 'no-uploaders-configured'

// ---------------------------------------------------------------------------
// npub / hex pubkey normalisation (NIP-19 bech32, BIP-173 checksum)
// ---------------------------------------------------------------------------

const BECH32_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

function bech32Polymod(values: number[]): number {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
  let chk = 1
  for (const v of values) {
    const top = chk >>> 25
    chk = ((chk & 0x1ffffff) << 5) ^ v
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk ^= GEN[i]
  }
  return chk >>> 0
}

function bech32HrpExpand(hrp: string): number[] {
  const out: number[] = []
  for (const c of hrp) out.push(c.charCodeAt(0) >> 5)
  out.push(0)
  for (const c of hrp) out.push(c.charCodeAt(0) & 31)
  return out
}

function decodeNpub(npub: string): string {
  const s = npub.toLowerCase()
  const sep = s.lastIndexOf('1')
  const hrp = s.slice(0, sep)
  if (hrp !== 'npub') throw new Error(`not an npub: ${npub}`)
  const data: number[] = []
  for (const c of s.slice(sep + 1)) {
    const v = BECH32_CHARSET.indexOf(c)
    if (v === -1) throw new Error(`invalid bech32 character in ${npub}`)
    data.push(v)
  }
  if (data.length < 6) throw new Error(`npub too short: ${npub}`)
  if (bech32Polymod([...bech32HrpExpand(hrp), ...data]) !== 1)
    throw new Error(`bad npub checksum: ${npub}`)
  // 5-bit groups -> bytes
  let acc = 0
  let bits = 0
  const bytes: number[] = []
  for (const v of data.slice(0, -6)) {
    acc = (acc << 5) | v
    bits += 5
    while (bits >= 8) {
      bits -= 8
      bytes.push((acc >> bits) & 0xff)
    }
  }
  if (bytes.length !== 32) throw new Error(`npub is not a 32-byte key: ${npub}`)
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Accepts an npub or 64-char hex pubkey; returns lowercase hex. Throws on garbage. */
export function toHexPubkey(input: string): string {
  const s = input.trim()
  if (/^[0-9a-fA-F]{64}$/.test(s)) return s.toLowerCase()
  if (/^npub1[02-9ac-hj-np-z]{58}$/i.test(s)) return decodeNpub(s)
  throw new Error(`not an npub or 64-character hex pubkey: ${input}`)
}

/** Lenient variant for main: drop anything that does not parse. */
export function toHexPubkeys(inputs: readonly string[]): string[] {
  const out = new Set<string>()
  for (const i of inputs) {
    try {
      out.add(toHexPubkey(i))
    } catch {
      console.warn(`route96: ignoring invalid whitelist entry: ${i}`)
    }
  }
  return [...out].sort()
}
