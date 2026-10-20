import { i18n } from '../i18n'
import { primaryUrl } from '../primaryUrl'

export const publicUrlTask = primaryUrl.setupTask('important', {
  reason: i18n(
    'Choose the public URL route96 should put in blob links (your StartTunnel domain, once bound).',
  ),
})
