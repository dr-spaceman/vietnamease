import OpenAI from 'openai'
import { Metadata, ResolvingMetadata } from 'next'
import * as React from 'react'

import type { Data } from './types'
import { LANGUAGES } from '@/const'
import cache from '@/utils/cache'
import extractJson from '@/utils/extract-json'
import SearchResults from './search-results'
import { createChat } from './open-ai'

type Props = { searchParams: { [key: string]: string | string[] | undefined } }
// type WikiRecord = { [key: string]: any }
// type WikiData = WikiRecord & {
//   error?: { code: string; info: string; '*': string }
// }

// function parseWikiPage(page: string) {
//   var autoRedir = /^#REDIRECT[^[]*\[\[([^\]]+)\]\]\s*$/i.exec(page)
//   if (autoRedir) {
//     console.log(`redirect autoRedir[1]`, autoRedir)
//     // this.titles[0] = autoRedir[1];
//     // return this.getPage();
//   }

//   const parsedData: WikiRecord = {}
//   const sections = page.split(/\n(?==)/).filter(Boolean)

//   sections.forEach(section => {
//     const sectionData = section.split(/\n(?!=)/)
//     const sectionTitle =
//       sectionData.shift()?.replace(/=/g, '').trim() || 'FUUUUUUU'
//     parsedData[sectionTitle] = {}

//     sectionData.forEach(data => {
//       const [key, value] = data.split(/(?<=\w)(?==)/)
//       const trimmedKey = key.trim()
//       const trimmedValue = value ? value.trim() : ''

//       if (!parsedData[sectionTitle][trimmedKey]) {
//         parsedData[sectionTitle][trimmedKey] = []
//       }

//       parsedData[sectionTitle][trimmedKey].push(trimmedValue)
//     })
//   })

//   return parsedData
// }

// function getTranslation(data: WikiRecord): string | null {
//   var keys = Object.keys(data.Translations).filter(
//     key => key.includes('* English:') || key.includes('* Vietnamese:')
//   )
//   if (!keys.length) return null
//   console.log('found keys', keys)
//   const match = keys[0].match(/\|vi\|([^}]+)}/)
//   if (match && match.length > 1) {
//     const extractedText = match[1]
//     return extractedText
//   } else {
//     return null
//   }
// }

async function getData(searchTerm: string): Promise<Data> {
  const cached = cache.get(searchTerm)
  if (cached) {
    console.log('cache hit', searchTerm)
    return JSON.parse(cached)
  }

  let results: Translation[] = []

  // const lang = 'en'
  // const res = await fetch(
  //   `https://${lang}.wiktionary.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=${searchTerm}`
  // )

  // if (!res.ok) {
  //   throw new Error('Something went wrong :(')
  // }

  // const data: WikiData = await res.json()

  // if (data.error) {
  //   console.error(data.error)
  //   throw new Error(data.error.info ?? 'Something went wrong :(')
  // }

  // const page = data.query.pages[Object.keys(data.query.pages)[0]]
  // const parsedData = parseWikiPage(page.revisions[0]['*'])

  // const t = getTranslation(parsedData)
  // console.log('t', t)
  // if (t) {
  //   results.push(t)
  // }

  // const params: OpenAI.Chat.ChatCompletionCreateParams = {
  //   model: 'gpt-3.5-turbo-0613',
  //   messages: [
  //     {
  //       role: 'system',
  //       content:
  //         // 'When given a Vietnamese or English word or phrase, translate it. You may find multiple translations. For each translation include a JSON object: {en, vi}. Add all the translations to a JSON list and output the list.',
  //         // 'When given a Vietnamese or English word or phrase, translate it',
  //         'When given a Vietnamese or English word or phrase, translate it and return a JSON object: {en, vi}',
  //     },
  //     {
  //       role: 'user',
  //       content: `${searchTerm}`,
  //     },
  //   ],
  //   // functions: [
  //   //   {
  //   //     name: 'translate',
  //   //     parameters: {
  //   //       type: 'object',
  //   //       properties: {
  //   //         en: {
  //   //           type: 'string',
  //   //           description: 'English word',
  //   //         },
  //   //         vi: {
  //   //           type: 'string',
  //   //           description: 'Vietnamese word',
  //   //         },
  //   //       },
  //   //       required: ['en', 'vi'],
  //   //     },
  //   //     description: 'translate Vietnamese and English words',
  //   //   },
  //   // ],
  //   temperature: 0.7,
  //   max_tokens: 64,
  //   top_p: 1,
  // }
  // const openai = getOpenAi()
  // const chatCompletion: OpenAI.Chat.ChatCompletion =
  //   await openai.chat.completions.create(params)
  // console.log(chatCompletion)
  // console.log('chat completion usage', chatCompletion.usage)

  const chat = await createChat()
  await chat.message(searchTerm)
  const fnArguments = await chat.run()

  const parsedContent: Translation = extractJson(fnArguments || '')
  console.log('parsed content', parsedContent, fnArguments)
  if (
    !parsedContent ||
    !(LANGUAGES[0] in parsedContent) ||
    !(LANGUAGES[1] in parsedContent)
  ) {
    throw new Error(
      `The translation service couldn't find any results for '${searchTerm}', or there were errors serializing the results into usable data. Please try a different phrase.`
    )
  }
  results.push(parsedContent)

  cache.set(searchTerm, JSON.stringify(results))

  return results
}

export async function generateMetadata(
  { searchParams: { q } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const titleBase = (await parent).title?.absolute

  return {
    title: `${titleBase} | search${q ? ': ' : ''}${q}`,
  }
}

export default async function DPage({ searchParams: { q } }: Props) {
  const data = q ? await getData(Array.isArray(q) ? q[0] : q) : null

  return (
    <main>
      <SearchResults data={data} />
    </main>
  )
}
