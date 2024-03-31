import { NextResponse, NextRequest } from 'next/server'
import { newSession } from '@/lib/session'

export const runtime = 'edge'

export async function GET(
  req: NextRequest,
  res: NextResponse
): Promise<void | Response> {
  try {
    await newSession()
    return new NextResponse('', {
      status: 302,
      headers: { Location: '/' },
    })
  } catch (error: unknown) {
    return new NextResponse(String(error), { status: 400 })
  }
}
