import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'route96',
  title: 'route96 (Blossom)',
  license: 'MIT',
  packageRepo: 'https://github.com/alru78/route96-startos',
  upstreamRepo: 'https://github.com/v0l/route96',
  marketingUrl: 'https://github.com/v0l/route96',
  donationUrl: null,
  description: { short, long },
  // main: blobs · mysql: MariaDB datadir · startos: store.json + generated config.yaml
  volumes: ['main', 'mysql', 'startos'],
  images: {
    route96: {
      // voidic/route96:v0.7.0 plus a current CA bundle, see docker/route96.Dockerfile
      source: {
        dockerBuild: {
          workdir: './docker',
          dockerfile: './docker/route96.Dockerfile',
        },
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
    mariadb: {
      // mariadb:11.4.13 plus a current CA bundle, see docker/mariadb.Dockerfile
      source: {
        dockerBuild: {
          workdir: './docker',
          dockerfile: './docker/mariadb.Dockerfile',
        },
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
})
