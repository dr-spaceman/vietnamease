import OpenAI from 'openai'
import { z } from 'zod'

import getEnv from '@/utils/get-env'
import { NextResponse } from 'next/server'
import extractJson from '@/utils/extract-json'
import { putUsage } from '@/lib/usage'

// const GPT_MODEL = 'gpt-3.5-turbo-0125'
const GPT_MODEL = 'gpt-4-turbo-preview'
const MAX_MESSAGE_LENGTH = 150

const apiKey = getEnv('OPENAI_KEY')
const openai = new OpenAI({ apiKey })

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages: naturalMessages } = await req.json()
    let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      naturalMessages

    const lastMessage = messages.at(-1)

    if (!lastMessage || messages.length < 1) {
      throw new Error('No messages')
    }

    // Inject assistant
    messages.unshift({
      role: 'system',
      content: `You are an interpreter of English(EN) and Vietnamese(VI).  Your input will be a word, phrase, or sentence in VI or EN. Output will be a JSON dict. Identify if original input is VI or EN, then follow the steps below: 1. translate; now you have both an EN and VI version 2. modify VI version to correct diacritic markers the user may have omitted or mistaken 3. break the whole VI version up into individual words or phrases 4. translate each phrase literally into EN, but maintain the context of the original input for the translation. Provide a tuple for each in this format: [vi, en] (note the order, with vi at index 0 and en at index 1) 5. output JSON dict with fields: 'inputLang' (enum: 'en' or 'vi'), 'translation' (string), 'phrases' (array)`,
    })

    // Check message length
    if (
      lastMessage.role === 'user' &&
      lastMessage.content.length > MAX_MESSAGE_LENGTH
    ) {
      throw new Error(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH}`)
    }

    const response = await openai.chat.completions.create({
      model: GPT_MODEL,
      max_tokens: 300,
      messages,
      temperature: 0,
    })
    try {
      console.log('usage', {
        input: response.usage?.prompt_tokens,
        output: response.usage?.completion_tokens,
      })
      const totalTokens = response.usage?.total_tokens
      if (!totalTokens) {
        throw new Error('Error getting usage')
      }
      putUsage({
        tokens: totalTokens,
        meta: { model: GPT_MODEL, action: 'translation' },
      }).catch(err => {
        throw new Error(String(err))
      })

      const fn = response.choices.at(0)?.message.content
      if (!fn) {
        throw new Error('Error parsing function_call')
      }
      const data: TranslationDict = extractJson(fn)
      const dataSchema = z.object({
        inputLang: z.enum(['en', 'vi']),
        translation: z.string(),
        phrases: z.array(z.array(z.string())),
      })
      dataSchema.parse(data)

      return NextResponse.json(data)
    } catch (error) {
      console.error(error)
      console.error(response)
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
