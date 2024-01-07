import { Metadata, Viewport } from 'next'

type PageData = { metadata?: Metadata; viewport?: Viewport }

export default function generatePageData({
  metadata,
  viewport,
}: PageData = {}): PageData {
  const metadataWithDefaults = {
    ...metadata,
    title: metadata?.title ?? 'Vietnamese App',
    description: metadata?.description ?? 'An app to help you learn Vietnamese',
  }
  const viewportWithDefaults = {
    ...viewport,
    width: viewport?.width ?? 'device-width',
    initialScale: viewport?.initialScale ?? 1.0,
  }

  return { metadata: metadataWithDefaults, viewport: viewportWithDefaults }
}
