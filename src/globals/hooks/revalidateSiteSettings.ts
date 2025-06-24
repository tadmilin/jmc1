import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site settings`)

    revalidateTag('global_site-settings')
    revalidateTag('global_meta') // สำหรับ meta tags
    revalidateTag('global_og') // สำหรับ Open Graph
  }

  return doc
} 