import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import wasm from 'tiktoken/lite/tiktoken_bg.wasm?module'
import model from 'tiktoken/encoders/cl100k_base.json'
import { init, Tiktoken } from 'tiktoken/lite/init'

import getEnv from '@/utils/get-env'
import { putUsage } from '@/lib/usage'
import { getSession } from '@/lib/session'
import { NextResponse } from 'next/server'

const GPT_MODEL = 'gpt-3.5-turbo'
const MAX_MESSAGE_LENGTH = 250

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
    if (messages.length === 1) {
      messages.unshift({
        role: 'system',
        content:
          'You are a Vietnamese (vi) language tutor. Chat with the user in vi and English (en), answering questions and offering advice on how to improve vi.',
      })
    }

    // Inject user's first name into user messages
    const session = getSession()
    const firstName = session?.user?.name?.split(' ')[0]
    if (firstName && lastMessage?.role === 'user') {
      lastMessage.name = firstName
    }

    // Check message length
    if (
      lastMessage.role === 'user' &&
      lastMessage.content.length > MAX_MESSAGE_LENGTH
    ) {
      throw new Error(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH}`)
    }

    // Get input tokens
    await init(imports => WebAssembly.instantiate(wasm, imports))
    const encoding = new Tiktoken(
      model.bpe_ranks,
      model.special_tokens,
      model.pat_str
    )
    const inputTokens = encoding.encode(lastMessage.content as string)
    encoding.free()

    const response = await openai.chat.completions.create({
      model: GPT_MODEL,
      stream: true,
      max_tokens: 150,
      messages,
    })
    let tokens = 0
    const stream = OpenAIStream(response, {
      onToken: async token => {
        tokens++
      },
      onCompletion: async completion => {
        // console.log('usage', { input: inputTokens.length, output: tokens })
        const totalTokens = inputTokens.length + tokens
        putUsage({ tokens: totalTokens, meta: { model: GPT_MODEL } })

        console.log('🤖 Chat completed', {
          completion,
          messages,
          session,
          usage: { input: inputTokens.length, output: tokens },
        })
      },
    })
    const streamingResponse = new StreamingTextResponse(stream)

    return streamingResponse
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
      } else {
        return NextResponse.json('Something went wrong :(', { status })
      }
    } else {
      return NextResponse.json(String(error), { status: 500 })
    }
  }
}
