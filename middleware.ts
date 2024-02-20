import {
  Session,
  generateSessionId,
  isValidSession,
  login,
} from '@/lib/session'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (request.cookies.has('loginError')) {
    return response
  }

  if (!isValidSession(request.cookies.get('session')?.value)) {
    console.log('invalid session', request.cookies.get('session')?.value)
    request.cookies.delete('session')
    const session: Session = { sessionId: generateSessionId() }
    const loginResponse = login(response, session)
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
