import type { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

type LoginSuccess = { success: true }
type LoginFail = { success: false; error: string }
type LoginResponse = LoginSuccess | LoginFail

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

function login(response: NextResponse, session: Session): LoginResponse {
  try {
    const encryptedSessionData = encryptSession(session) // Encrypt your session data
    response.cookies.set('session', encryptedSessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    })
  } catch (error: unknown) {
    return { success: false, error: String(error).replace('Error: ', '') }
  }

  return { success: true }
}

function isValidSession(session?: string | null | undefined) {
  if (!session) {
    return false
  }

  try {
    const decryptedSessionData = JSON.parse(session) // Decrypt your session data
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
}
