'use server'

import OpenAI from 'openai'

import type { StartPreferences } from './flash-cards'
import { LANGUAGES, LANGUAGE_MAP } from '@/const'
import {
  findTranslationSet,
  type TranslationSearchParams,
} from '@/db/translations'
import delay from '@/utils/delay'
import getEnv from '@/utils/get-env'

type ResponseSuccess = {
  success: true
  translations: Translation[]
}
type ResponseFail = { success: false; error: string }
export type Response = ResponseSuccess | ResponseFail | null

const openai = new OpenAI({ apiKey: getEnv('OPENAI_KEY') })

function parseTranslation(content: string) {
  const lines = content.split('\n')
  const translationArray: Translation[] = []

  lines.forEach(line => {
    const langs = line.split('|')
    if (langs[0] && langs[1]) {
      translationArray.push({
        [LANGUAGES[0]]: langs[0].trim(),
        [LANGUAGES[1]]: langs[1].trim(),
      })
    }
  })

  return translationArray
}

async function buildCards(
  prevState: Response,
  formData: FormData
): Promise<Response> {
  try {
    const params = Object.fromEntries(formData.entries()) as StartPreferences
    console.log(params, formData, prevState)

    if (params.fluency !== 'custom') {
      const buildParams: TranslationSearchParams = ['lang:en', 'lang:vi']
      if (params.fluency) {
        buildParams.push(`fluency:${params.fluency}`)
      }
      if (params.dialect) {
        buildParams.push(`dialect:${params.dialect}`)
      }

      const foundSet = findTranslationSet(buildParams)
      if (foundSet) {
        await delay(500) // Simulate busy

        return { success: true, translations: foundSet }
      }
    }

    // use AI to build a set

    let systemContent = ''
    let userContent = ''

    if (params.fluency === 'custom') {
      if (!params.vocabList) {
        throw new Error('User-input vocab list needed')
      }
      systemContent =
        'You are a viet-eng translator. Given a list of words, build a dataset in format: `en|vi` one per line'
      userContent = params.vocabList
    } else {
      systemContent = `You help ${LANGUAGE_MAP[LANGUAGES[0]]} speakers learn ${
        LANGUAGE_MAP[LANGUAGES[1]]
      }.`
      userContent = `Suggest 10 vocabulary words or short phrases that would be useful for an ${params.fluency} learner to know. These should be common, conversational words only. Format into a dataset in format: \`${LANGUAGES[0]}|${LANGUAGES[1]}\` one per line`
    }

    const chatParams: OpenAI.Chat.ChatCompletionCreateParams = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemContent,
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      temperature: 0.7,
      max_tokens: 128 + 64,
      top_p: 1,
    }
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(chatParams)
    console.log('chat completion usage', chatCompletion.usage)
    if (chatCompletion.choices?.length === 0) {
      throw new Error('No results')
    }
    const {
      message: { content },
    } = chatCompletion.choices[0]
    console.log('chat content:', content)
    if (!content) {
      throw new Error('No chat content')
    }
    const parsedContent: Translation[] = parseTranslation(content)
    console.log('parsed content', parsedContent)
    if (
      !parsedContent ||
      !(LANGUAGES[0] in parsedContent[0]) ||
      !(LANGUAGES[1] in parsedContent[0]) ||
      !Array.isArray(parsedContent)
    ) {
      throw new Error(
        `The translation service couldn't find any results, or there were errors serializing the results into usable data.`
      )
    }

    return { success: true, translations: parsedContent }
  } catch (error: unknown) {
    return { success: false, error: String(error) }
  }
}

export { buildCards }
