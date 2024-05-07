import OpenAI from 'openai'
import { z } from 'zod'

import getEnv from '@/utils/get-env'
import { NextResponse } from 'next/server'
import extractJson from '@/utils/extract-json'
import { putUsage } from '@/lib/usage'

const GPT_MODEL = 'gpt-3.5-turbo-0125'
// const GPT_MODEL = 'gpt-4-turbo-preview'
const MAX_MESSAGE_LENGTH = 150

const apiKey = getEnv('OPENAI_KEY')
const openai = new OpenAI({ apiKey })

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { learn } = await req.json()
    if (!learn) {
      throw new Error('No learn input received')
    }
    if (learn > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH}`)
    }
    console.log('learn', learn)

    let totalTokens = 0
    let payload: Translation = { en: '', vi: '', examples: [] }
    const systemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: `You help English(en) speakers translate and learn Vietnamese(vi). When given inputs, output a JSON dict with the fields 'en' and 'vi'. You will ensure 'vi' output has correct diacritic markers the user may have omitted or mistaken.`,
    }

    // Generate translation

    const messagesTr: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      systemMessage,
      {
        role: 'user',
        content: `I want to learn something new. Translate what I want to learn into EN and VI and output a JSON dict with the fields 'en' (English) and 'vi' (Vietnamese).
Example input: I want to learn: right, as in "right turn"
Example output: {"en":"right","vi":"phải"}
Input: I want to learn: ${learn}
Output:`,
      },
    ]
    const responseTr = await openai.chat.completions.create({
      model: GPT_MODEL,
      max_tokens: 300,
      messages: messagesTr,
      temperature: 0,
      response_format: { type: 'json_object' },
    })
    try {
      console.log('usage', responseTr.usage)
      const newTokens = responseTr.usage?.total_tokens
      if (!newTokens || Number.isNaN(newTokens)) {
        throw new Error('Error getting usage')
      }
      totalTokens += newTokens

      const content = responseTr.choices.at(0)?.message.content
      if (!content) {
        throw new Error('Error parsing translation content')
      }
      const translation: LanguageDict = extractJson(content)
      const translationSchema = z.object({
        en: z.string(),
        vi: z.string(),
      })
      translationSchema.parse(translation)

      payload = translation
      console.log('payload', payload)
    } catch (error) {
      console.error(error, responseTr, responseTr)
      throw new Error('There was an error parsing the chat response')
    }

    // Generate examples

    const messagesEx: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      systemMessage,
      {
        role: 'user',
        content: `Given input, provide a simple example sentence in Vietnamese and English. This should be a common usage, idiom, phrase, or sentence in Vietnamese, but not necessarily in English. It should be simple and understood by a 10-year old.
Example input: vi:phải en:right
Example output: {"vi":"Quẹo phải ở ngã tư","en":"Turn right at the intersection"}
Input: vi:${payload.vi} en:${payload.en}
Output:`,
      },
    ]
    const responseEx = await openai.chat.completions.create({
      model: GPT_MODEL,
      max_tokens: 300,
      messages: messagesEx,
      temperature: 1,
      response_format: { type: 'json_object' },
    })

    try {
      console.log('usage', responseEx.usage)
      const newTokens = responseEx.usage?.total_tokens
      if (!newTokens || Number.isNaN(newTokens)) {
        throw new Error('Error getting usage')
      }
      totalTokens += newTokens

      const content = responseEx.choices.at(0)?.message.content
      if (!content) {
        throw new Error('Error parsing example content')
      }
      const example: LanguageDict = extractJson(content)
      const exampleSchema = z.object({
        en: z.string(),
        vi: z.string(),
      })
      exampleSchema.parse(example)

      putUsage({
        tokens: totalTokens,
        meta: { model: GPT_MODEL, action: 'generate-card' },
      }).catch(err => {
        throw new Error(String(err))
      })

      payload = { ...payload, examples: [example] }
      console.log('payload', payload)

      // OK Finished

      return NextResponse.json(payload)
    } catch (error) {
      console.error(error, responseEx)
      throw new Error('There was an error parsing the chat response')
    }
  } catch (error) {
    console.error(error)

    if (error instanceof OpenAI.APIError) {
      const { status, message } = error
      if (
        status?.toString().startsWith('4') ||
        status === 500 ||
        status === 503
      ) {
        return NextResponse.json(message, { status })
      }

      return NextResponse.json('Something went wrong :(', { status })
    }

    return NextResponse.json(String(error), { status: 500 })
  }
}
