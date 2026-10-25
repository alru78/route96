import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.7.0:1',
  releaseNotes: {
    en_US:
      'Security update: refreshed CA certificates in the route96 and MariaDB images, so the compromised eMudhra/emSign G3 and Sectigo AAA roots are no longer trusted. Built with start-sdk 3.1.0. route96 itself is unchanged (v0.7.0).',
    es_ES:
      'Actualización de seguridad: certificados CA renovados en las imágenes de route96 y MariaDB, de modo que las raíces comprometidas eMudhra/emSign G3 y Sectigo AAA ya no son de confianza. Compilado con start-sdk 3.1.0. route96 no cambia (v0.7.0).',
    de_DE:
      'Sicherheitsupdate: aktualisierte CA-Zertifikate in den Images von route96 und MariaDB, sodass die kompromittierten Wurzelzertifikate eMudhra/emSign G3 und Sectigo AAA nicht mehr vertraut werden. Gebaut mit start-sdk 3.1.0. route96 selbst ist unverändert (v0.7.0).',
    pl_PL:
      'Aktualizacja bezpieczeństwa: odświeżone certyfikaty CA w obrazach route96 i MariaDB, dzięki czemu skompromitowane certyfikaty główne eMudhra/emSign G3 i Sectigo AAA nie są już zaufane. Zbudowano z start-sdk 3.1.0. Sam route96 bez zmian (v0.7.0).',
    fr_FR:
      'Mise à jour de sécurité : certificats CA actualisés dans les images route96 et MariaDB, afin que les racines compromises eMudhra/emSign G3 et Sectigo AAA ne soient plus approuvées. Compilé avec start-sdk 3.1.0. route96 lui-même est inchangé (v0.7.0).',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
