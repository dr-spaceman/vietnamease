import { Html, Body, Alert } from 'matterial'
import NextLink from 'next/link'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

import { decryptSession } from '@/lib/session'
import generatePageData from '@/utils/generate-page-data'
import Header from './header'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const config = {
  appTitle: 'Vietnamease App',
  linkComponent: NextLink,
}

export const { metadata, viewport } = generatePageData()

function getSessionData(): Session | null {
  const encryptedSessionData = cookies().get('session')?.value

  return encryptedSessionData ? decryptSession(encryptedSessionData) : null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = getSessionData()
  console.log('session@RootLayout', session)

  return (
    <Html config={config} className={inter.className}>
      <Body>
        <Header />
        {cookies().has('loginError') && (
          <Alert severity="error">{cookies().get('loginError')?.value}</Alert>
        )}
        {children}
      </Body>
    </Html>
  )
}
