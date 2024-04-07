'use server'

import { cookies } from 'next/headers'
import fetchApi from '@/utils/fetch-api'

type LoginSuccess = { success: true }
type LoginFail = { success: false; error: string }
type LoginResponse = LoginSuccess | LoginFail

const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // One week
  path: '/',
}

function encryptSession(data: Session): SessionEncrypted {
  return JSON.stringify(data)
}

function decryptSession(session: SessionEncrypted): Session {
  return JSON.parse(session)
}

/**
 * Register an anonymous session (not logged in)
 */
async function newSession(): Promise<SessionEncrypted> {
  const data = await fetchApi<SessionUnauthenticated>('session', 'POST')
  const cookiesStore = cookies()
  const encryptedSessionData = encryptSession(data)
  cookiesStore.set('session', encryptedSessionData, sessionCookieOptions)
  if (!cookiesStore.has('session')) {
    throw new Error('Failed to set session cookie')
  }

  return encryptedSessionData
}

/**
 * Register successful login session
 *
 * @param loginData - The login data to store
 */
function login(loginData: SessionAuthenticated): void {
  let oldSession = getSession() as Session
  if (!oldSession) {
    // @TODO
    console.error('No session found; Attempting to create a new session')
  }
  const session = {
    ...oldSession,
    loggedIn: true,
    ...loginData,
  }
  const encryptedSessionData = encryptSession(session)
  const cookiesStore = cookies()
  cookiesStore.set('session', encryptedSessionData, sessionCookieOptions)
  console.log('Session cookie', cookiesStore.get('session')?.value)
}

/**
 * Register a session as logged out
 */
function logout(loginData: SessionUnauthenticated): void {
  const encryptedSessionData = encryptSession(loginData)
  cookies().set('session', encryptedSessionData, sessionCookieOptions)
}

function isValidSession(session?: SessionEncrypted | null | undefined) {
  if (!session) {
    return false
  }

  try {
    const { accessToken, user } = decryptSession(session)
    if (!accessToken) {
      throw new Error('Missing access token')
    }
    if (!user.sessionId) {
      throw new Error('Missing session ID')
    }

    return true
  } catch (error: unknown) {
    console.error('Error parsing session data:', error)

    return false
  }
}

function getSession(): Session | null {
  const session = cookies().has('session')
    ? decryptSession(cookies().get('session')?.value as string)
    : null

  return session
}

export type { Session, LoginResponse }
export {
  decryptSession,
  encryptSession,
  getSession,
  isValidSession,
  login,
  logout,
  newSession,
}
