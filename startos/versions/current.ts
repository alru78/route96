import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.7.0:2',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.1 or later. Fixes memory use growing while the service runs, and keeps the MariaDB password out of the process list. Built with start-sdk 4.0.0. route96 itself is unchanged (v0.7.0).',
    es_ES:
      'Requiere StartOS 0.4.1 o posterior. Corrige el aumento del uso de memoria mientras el servicio está en ejecución y mantiene la contraseña de MariaDB fuera de la lista de procesos. Compilado con start-sdk 4.0.0. route96 no cambia (v0.7.0).',
    de_DE:
      'Erfordert StartOS 0.4.1 oder neuer. Behebt einen während der Laufzeit des Dienstes ansteigenden Speicherverbrauch und hält das MariaDB-Passwort aus der Prozessliste heraus. Gebaut mit start-sdk 4.0.0. route96 selbst ist unverändert (v0.7.0).',
    pl_PL:
      'Wymaga StartOS 0.4.1 lub nowszego. Naprawia wzrost zużycia pamięci podczas działania usługi i usuwa hasło MariaDB z listy procesów. Zbudowano z start-sdk 4.0.0. Sam route96 bez zmian (v0.7.0).',
    fr_FR:
      "Nécessite StartOS 0.4.1 ou une version ultérieure. Corrige l'augmentation de la consommation de mémoire pendant le fonctionnement du service et retire le mot de passe MariaDB de la liste des processus. Compilé avec start-sdk 4.0.0. route96 lui-même est inchangé (v0.7.0).",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
