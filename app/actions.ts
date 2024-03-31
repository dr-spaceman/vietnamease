'use server'

import OpenAI from 'openai'

import { FLUENCY, LANGUAGES, LANGUAGE_MAP, MAX_LEN_CUSTOM_LIST } from '@/const'
import {
  findTranslationSet,
  type TranslationSearchParams,
} from '@/db/translations'
import delay from '@/utils/delay'
import getEnv from '@/utils/get-env'
import fetchApi from '@/utils/fetch-api'
import extractJson from '@/utils/extract-json'
import { login, logout } from '@/lib/session'

export type StartPreferences = {
  dialect: 'Northern' | 'Central' | 'Southern'
  fluency: (typeof FLUENCY)[number]
  generator: 'copilot' | 'custom'
  vocabList?: string
}

type ResponseSuccess = { success: true }
type ResponseFail = { success: false; error: string }
type Response = ResponseSuccess | ResponseFail

export type BuildCardsResponse =
  | (ResponseSuccess & { translations: Translation[] })
  | ResponseFail
  | null
export type LoginResponse =
  | (ResponseSuccess & { data: SessionAuthenticated })
  | ResponseFail
  | null

const openai = new OpenAI({ apiKey: getEnv('OPENAI_KEY') })

async function buildCards(
  prevState: BuildCardsResponse,
  formData: FormData
): Promise<BuildCardsResponse> {
  try {
    const params = Object.fromEntries(formData.entries()) as StartPreferences
    console.log(params, formData, prevState)

    if (params.generator !== 'custom') {
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

    const translateFunction = {
      name: 'translate',
      parameters: {
        type: 'object',
        properties: {
          t: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                en: {
                  type: 'string',
                  description: 'English word',
                },
                vi: {
                  type: 'string',
                  description: 'Vietnamese word',
                },
              },
              required: ['en', 'vi'],
            },
          },
        },
        required: ['t'],
      },
      description: 'translate Vietnamese and English words',
    }

    if (params.generator === 'custom') {
      if (!params.vocabList) {
        throw new Error('User-input vocab list needed')
      }
      if (params.vocabList.length > MAX_LEN_CUSTOM_LIST) {
        throw new Error(
          `Vocab list too long, max length is ${MAX_LEN_CUSTOM_LIST}`
        )
      }
      systemContent = `You are a translator of ${
        LANGUAGE_MAP[LANGUAGES[0]]
      } and ${LANGUAGE_MAP[LANGUAGES[1]]}.`
      userContent = params.vocabList
    } else {
      systemContent = `You help ${LANGUAGE_MAP[LANGUAGES[0]]} speakers learn ${
        LANGUAGE_MAP[LANGUAGES[1]]
      }. Suggest some useful common/conversational vocabulary words (NO phrases) to learn. Come up with a list of 200 useful words and phrases, and sort the list by fluency level, with beginner words first and advanced words later.`
      let startIndex = 0
      if (params.fluency === 'intermediate') {
        startIndex = 95
      } else if (params.fluency === 'advanced') {
        startIndex = 190
      }
      userContent = `Give me 10 words starting from #${startIndex} on the list`
    }

    const chatParams: OpenAI.Chat.ChatCompletionCreateParams = {
      model: 'gpt-3.5-turbo-0125',
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
      functions: [translateFunction],
      function_call: { name: 'translate' },
      temperature: 0.1,
      max_tokens: 128 + 64,
    }
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(chatParams)
    console.log(systemContent, userContent)
    console.log('chat completion usage', chatCompletion.usage)

    const responseMessage = chatCompletion.choices[0].message
    console.log('response message', responseMessage)

    if (responseMessage.function_call?.name !== 'translate') {
      throw new Error('Function call not found')
    }

    const parsedContent: { t: Translation[] } = extractJson(
      responseMessage.function_call.arguments
    )
    console.log('parsed content', parsedContent)
    const { t: translations } = parsedContent
    if (
      !translations ||
      !(LANGUAGES[0] in translations[0]) ||
      !(LANGUAGES[1] in translations[0]) ||
      !Array.isArray(translations)
    ) {
      throw new Error(
        `The translation service couldn't find any results, or there were errors serializing the results into usable data.`
      )
    }

    return { success: true, translations }
  } catch (error: unknown) {
    return { success: false, error: String(error) }
  }
}

async function handleLogin(
  prevState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> {
  try {
    const form = Object.fromEntries(formData.entries())
    if (
      !form.action ||
      !['login', 'register'].includes(form.action as string)
    ) {
      console.error('Critical error: Invalid form `action`', form.action)
      throw new Error(
        'Sorry! There was a problem with the form data and the action could not be processed'
      )
    }

    const data = await fetchApi<SessionAuthenticated>(
      form.action === 'login' ? 'login' : 'users',
      'POST',
      { body: JSON.stringify(form) }
    )

    login(data)

    return { success: true, data }
  } catch (error: unknown) {
    return { success: false, error: String(error) }
  }
}

async function handleLogout(): Promise<Response> {
  try {
    const data = await fetchApi<SessionUnauthenticated>('logout', 'POST')

    logout(data)

    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: String(error) }
  }
}

export { buildCards, handleLogin, handleLogout }
