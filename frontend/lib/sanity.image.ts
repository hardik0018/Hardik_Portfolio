import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from './sanity.client'

const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: Parameters<typeof builder.image>[0]) => {
  return builder.image(source)
}
