import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { isValidSession, newSession } from './src/lib/session'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (request.cookies.has('loginError')) {
    console.error(
      'Middleware detected a login error',
      request.cookies.get('loginError')?.value
    )

    return response
  }

  if (!isValidSession(request.cookies.get('session')?.value)) {
    console.log('invalid session', request.cookies.get('session')?.value)
    request.cookies.delete('session')
    const loginResponse = newSession(response)
    if (!loginResponse.success) {
      response.cookies.set('loginError', loginResponse.error, {
        httpOnly: true,
        maxAge: 60,
      })
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
