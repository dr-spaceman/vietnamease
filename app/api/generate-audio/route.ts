import OpenAI from 'openai'
import { NextResponse, NextRequest } from 'next/server'
import getEnv from '@/utils/get-env'

interface RequestBody {
  word: string
}

const openai = new OpenAI({ apiKey: getEnv('OPENAI_KEY') })

export const runtime = 'edge'

export async function POST(request: NextRequest & { body: RequestBody }) {
  try {
    const { word } = (await request.json()) as RequestBody

    if (!word) {
      throw new Error('Form must include a word')
    }

    const voice = 'nova'
    const speed = 0.8
    const mp3 = await openai.audio.speech.create({
      input: word,
      model: 'tts-1',
      speed,
      voice,
      response_format: 'opus',
    })
    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error: unknown) {
    return { success: false, error: String(error) }
  }
}
