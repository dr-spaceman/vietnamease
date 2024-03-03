import { Metadata, Viewport } from 'next'

type PageData = { metadata: Metadata; viewport: Viewport }

export default function generatePageData({
  metadata,
  viewport,
}: Partial<PageData> = {}): PageData {
  const metadataWithDefaults = {
    ...metadata,
    applicationName: metadata?.applicationName ?? 'Vietnamease',
    title:
      metadata?.title ?? 'Vietnamease App - Your copilot to learn Vietnamese',
    description:
      metadata?.description ??
      'Learn Vietnamese with an AI copilot. Translate words, phrases, and sentences between English and Vietnamese. Practice with flashcards and quizzes. Get help with grammar and pronunciation. Chat with a fluent computer language partner. Get bespoke language learning resources based on your own personal interests and goals. All powered by AI.',
  }
  const viewportWithDefaults = {
    ...viewport,
    width: viewport?.width ?? 'device-width',
    initialScale: viewport?.initialScale ?? 1.0,
  }

  return { metadata: metadataWithDefaults, viewport: viewportWithDefaults }
}
