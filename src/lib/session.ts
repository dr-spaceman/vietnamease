import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type LoginSuccess = { success: true }
type LoginFail = { success: false; error: string }
type LoginResponse = LoginSuccess | LoginFail

const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // One week
  path: '/',
}

function encryptSession(data: Session): string {
  return JSON.stringify(data)
}

function decryptSession(session: string): Session {
  return JSON.parse(session)
}

function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Register an anonymous session (not logged in)
 */
function newSession(response: NextResponse): LoginResponse {
  try {
    const encryptedSessionData = encryptSession({
      sessionId: generateSessionId(),
    })
    response.cookies.set('session', encryptedSessionData, sessionCookieOptions)
  } catch (error: unknown) {
    return { success: false, error: String(error).replace('Error: ', '') }
  }

  return { success: true }
}

/**
 * Register successful login session
 *
 * @param loginData - The login data to store
 */
function login(loginData: LoginData): void {
  let session = getSession() || { sessionId: generateSessionId() }
  session = {
    ...session,
    loggedIn: true,
    ...loginData,
  }
  const encryptedSessionData = encryptSession(session)
  cookies().set('session', encryptedSessionData, sessionCookieOptions)
  console.log('Session cookie', cookies().get('session')?.value)
}

function logout(): void {
  let session = getSession() || { sessionId: generateSessionId() }
  const newSession = { sessionId: session.sessionId }
  const encryptedSessionData = encryptSession(newSession)
  cookies().set('session', encryptedSessionData, sessionCookieOptions)
}

function isValidSession(session?: string | null | undefined) {
  if (!session) {
    return false
  }

  try {
    const decryptedSessionData = JSON.parse(session)
    if (!('sessionId' in decryptedSessionData)) {
      throw new Error('Missing sessionId')
    }

    return true
  } catch (error: unknown) {
    console.error('Error parsing session data:', error)

    return false
  }
}

function getSession(): Session | null {
  const session = cookies().has('session')
    ? (JSON.parse(cookies().get('session')?.value as string) as Session)
    : null

  return session
}

export type { Session, LoginResponse }
export {
  decryptSession,
  encryptSession,
  generateSessionId,
  getSession,
  isValidSession,
  login,
  logout,
  newSession,
}
