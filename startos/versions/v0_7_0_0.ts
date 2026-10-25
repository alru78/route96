import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v0_7_0_0 = VersionInfo.of({
  version: '0.7.0:0',
  releaseNotes: {
    en_US:
      'Initial StartOS package of route96 v0.7.0 (Blossom/NIP-96 server) with a bundled MariaDB, uploader whitelist, upload size limit and public URL actions.',
    es_ES:
      'Paquete inicial de StartOS para route96 v0.7.0 (servidor Blossom/NIP-96) con MariaDB incluida, lista blanca de subidas, límite de tamaño y acciones de URL pública.',
    de_DE:
      'Erstes StartOS-Paket von route96 v0.7.0 (Blossom/NIP-96-Server) mit integrierter MariaDB, Uploader-Whitelist, Upload-Größenlimit und Aktionen für die öffentliche URL.',
    pl_PL:
      'Pierwszy pakiet StartOS dla route96 v0.7.0 (serwer Blossom/NIP-96) z wbudowaną bazą MariaDB, białą listą przesyłających, limitem rozmiaru i akcjami publicznego URL.',
    fr_FR:
      "Premier paquet StartOS de route96 v0.7.0 (serveur Blossom/NIP-96) avec MariaDB intégrée, liste blanche d'envoi, limite de taille et actions d'URL publique.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
