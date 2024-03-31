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

  const session = request.cookies.get('session')?.value

  if (!isValidSession(session)) {
    console.log('invalid/empty session', session)
    request.cookies.delete('session')
    newSession()
      .then(() => {
        console.log('new session created')
        return response
      })
      .catch(error => {
        response.cookies.set('loginError', error, {
          httpOnly: true,
          maxAge: 60,
        })
      })
  }
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
      missing: [{ type: 'header', key: 'accept', value: '((?!text/html).*)' }],
    },
  ],
}
