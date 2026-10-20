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
      source: {
        dockerTag:
          'voidic/route96:v0.7.0@sha256:5ab6064f18ca191dd5836487505607122ef3bfeba6e6ccc5b28eef5c604cf4cc',
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
    mariadb: {
      source: {
        dockerTag:
          'mariadb:11.4.13@sha256:250e1609e93c0e6aecf64bfbab2d84d5e89d2481540fe77447ff6c855c3b1873',
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
})
