import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import getEnv from '@/utils/get-env'

const apiKey = getEnv('OPENAI_KEY')
const openai = new OpenAI({
  apiKey,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
  })
  const stream = OpenAIStream(response)
  const streamingResponse = new StreamingTextResponse(stream)

  return streamingResponse
}
