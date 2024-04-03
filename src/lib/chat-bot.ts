import wasm from 'tiktoken/lite/tiktoken_bg.wasm?module'
import model from 'tiktoken/encoders/cl100k_base.json'
import { init, Tiktoken } from 'tiktoken/lite/init'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

async function calculateTokens(messageContent: string): Promise<number> {
  await init(imports => WebAssembly.instantiate(wasm, imports))
  const encoding = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  )
  const tokens = encoding.encode(messageContent).length
  encoding.free()

  return tokens
}

function getFormattedFirstName(fullName?: string): string {
  if (!fullName) {
    return ''
  }
  let formattedString = fullName
    .split(' ')[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  formattedString = formattedString.replace(/[^a-zA-Z0-9_-]/g, '')
  if (formattedString.length > 64) {
    formattedString = formattedString.substring(0, 64)
  }

  return formattedString
}

function handleError(error: unknown) {
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

export { calculateTokens, getFormattedFirstName, handleError }
