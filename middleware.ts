import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

import { getSession, isValidSession, newSession } from './src/lib/session'

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  prefix: 'ratelimit_middleware',
})

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next()

  if (request.cookies.has('loginError')) {
    console.error(
      'Middleware detected a login error',
      request.cookies.get('loginError')?.value
    )

    return response
  }

  let session: SessionEncrypted | undefined =
    request.cookies.get('session')?.value

  if (!isValidSession(session)) {
    // console.log('invalid/empty session', session)
    request.cookies.delete('session')
    try {
      session = await newSession()
      console.log('new session created')
    } catch (error) {
      response.cookies.set('loginError', String(error), {
        httpOnly: true,
        maxAge: 60,
      })
    }
  }

  const ip = request.ip ?? '127.0.0.1'
  const sessionData = getSession()
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    sessionData?.user.id.toString() ?? ip
  )
  event.waitUntil(pending)

  const res = success
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/api/blocked', request.url))

  res.headers.set('X-RateLimit-Limit', limit.toString())
  res.headers.set('X-RateLimit-Remaining', remaining.toString())
  res.headers.set('X-RateLimit-Reset', reset.toString())

  return res
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
      missing: [{ type: 'header', key: 'accept', value: '((?!text/html).*)' }],
    },
  ],
}
