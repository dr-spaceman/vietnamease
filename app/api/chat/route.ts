import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import wasm from 'tiktoken/lite/tiktoken_bg.wasm?module'
import model from 'tiktoken/encoders/cl100k_base.json'
import { init, Tiktoken } from 'tiktoken/lite/init'

import getEnv from '@/utils/get-env'
import { putUsage } from '@/lib/usage'

const GPT_MODEL = 'gpt-3.5-turbo'

const apiKey = getEnv('OPENAI_KEY')
const openai = new OpenAI({
  apiKey,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Get input tokens
  const lastUserMessage = messages.at(-1).content
  await init(imports => WebAssembly.instantiate(wasm, imports))
  const encoding = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  )
  const inputTokens = encoding.encode(lastUserMessage)
  encoding.free()

  const response = await openai.chat.completions.create({
    model: GPT_MODEL,
    stream: true,
    messages,
  })
  let tokens = 0
  const onToken = () => {
    tokens++
  }
  const onCompletion = () => {
    // console.log('usage', { input: inputTokens.length, output: tokens })
    const totalTokens = inputTokens.length + tokens
    putUsage({ tokens: totalTokens, meta: { model: GPT_MODEL } })
  }
  const stream = OpenAIStream(response, { onToken, onCompletion })
  const streamingResponse = new StreamingTextResponse(stream)

  return streamingResponse
}
