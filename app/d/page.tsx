import * as React from 'react'
import { Page } from 'matterial'
import OpenAI from 'openai'
import getEnv from '@/utils/get-env'
import cache from '@/utils/cache'

const openai = new OpenAI({ apiKey: getEnv('OPENAI_KEY') })

type WikiRecord = { [key: string]: any }
type WikiData = WikiRecord & {
  error?: { code: string; info: string; '*': string }
}

function parseWikiPage(page: string) {
  var autoRedir = /^#REDIRECT[^[]*\[\[([^\]]+)\]\]\s*$/i.exec(page)
  if (autoRedir) {
    console.log(`redirect autoRedir[1]`, autoRedir)
    // this.titles[0] = autoRedir[1];
    // return this.getPage();
  }

  const parsedData: WikiRecord = {}
  const sections = page.split(/\n(?==)/).filter(Boolean)

  sections.forEach(section => {
    const sectionData = section.split(/\n(?!=)/)
    const sectionTitle =
      sectionData.shift()?.replace(/=/g, '').trim() || 'FUUUUUUU'
    parsedData[sectionTitle] = {}

    sectionData.forEach(data => {
      const [key, value] = data.split(/(?<=\w)(?==)/)
      const trimmedKey = key.trim()
      const trimmedValue = value ? value.trim() : ''

      if (!parsedData[sectionTitle][trimmedKey]) {
        parsedData[sectionTitle][trimmedKey] = []
      }

      parsedData[sectionTitle][trimmedKey].push(trimmedValue)
    })
  })

  return parsedData
}

function getTranslation(data: WikiRecord): string | null {
  var keys = Object.keys(data.Translations).filter(
    key => key.includes('* English:') || key.includes('* Vietnamese:')
  )
  if (!keys.length) return null
  console.log('found keys', keys)
  const match = keys[0].match(/\|vi\|([^}]+)}/)
  if (match && match.length > 1) {
    const extractedText = match[1]
    return extractedText
  } else {
    return null
  }
}

async function getData(): Promise<string[]> {
  const searchTerm = 'example'

  const cached = cache.get(searchTerm)
  if (cached) {
    console.log('cache hit', searchTerm)
    return JSON.parse(cached)
  }

  const results: string[] = []
  const lang = 'en'
  const res = await fetch(
    `https://${lang}.wiktionary.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=${searchTerm}`
  )

  if (!res.ok) {
    throw new Error('Something went wrong :(')
  }

  const data: WikiData = await res.json()

  if (data.error) {
    console.error(data.error)
    throw new Error(data.error.info ?? 'Something went wrong :(')
  }

  const page = data.query.pages[Object.keys(data.query.pages)[0]]
  const parsedData = parseWikiPage(page.revisions[0]['*'])

  const t = getTranslation(parsedData)
  console.log('t', t)
  if (t) {
    results.push(t)
  }

  try {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a Vietnamese-English translator. When given a word or phrase, translate it.',
        },
        {
          role: 'user',
          content: searchTerm,
        },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    }
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params)
    console.log('chat completion usage', chatCompletion.usage)
    if (chatCompletion.choices?.length) {
      chatCompletion.choices.forEach(({ message: { content } }) => {
        console.log('chat content:', content)
        if (content && !results.includes(content)) {
          results.push(content)
        }
      })
    }
  } catch (e) {
    console.error(e)
  }

  cache.set(searchTerm, JSON.stringify(results))

  return results
}

export default async function DPage() {
  const data = await getData()

  return (
    <Page noNav>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Page>
  )
}
