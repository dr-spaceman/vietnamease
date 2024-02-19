import { Html, Body, Button, Icon, TextInput, Link, Alert } from 'matterial'
import NextLink from 'next/link'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

import { decryptSession } from '@/lib/login'
import generatePageData from '@/utils/generate-page-data'
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

  return (
    <Html config={config} className={inter.className}>
      <Body>
        <header className="page-header">
          <h1>
            <Link href="/">Vietnamease</Link>
          </h1>
          <form action="d" method="get">
            <div className="page-header__search">
              <TextInput
                name="q"
                placeholder="'hello' or 'xin chao'"
                maxLength={45}
              />
              <Button shape="circle" color="primary" type="submit">
                <Icon icon="Search" />
              </Button>
            </div>
          </form>
        </header>
        {cookies().has('loginError') && (
          <Alert severity="error">{cookies().get('loginError')?.value}</Alert>
        )}
        {children}
      </Body>
    </Html>
  )
}
