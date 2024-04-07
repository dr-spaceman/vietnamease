import { Html, Body, PageNav } from 'matterial'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { RequiredChildren } from '@/interfaces/children'
import generatePageData from '@/utils/generate-page-data'
import { decryptSession } from '@/lib/session'
import '../../global.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

const config = {
  appTitle: 'Vietnamease App',
  linkComponent: NextLink,
  navElement: <SiteNav />,
}

const metadata_: Metadata = {
  title: 'Vietnamease Admin',
}

export const { metadata, viewport } = generatePageData({
  metadata: metadata_,
})

function getSessionData(): Session | null {
  const encryptedSessionData = cookies().get('session')?.value
  if (!encryptedSessionData) {
    redirect('/api/auth/new')
  }
  const session = decryptSession(encryptedSessionData)

  return session
}

const navMap: NavMap = {
  _heading: <>Vietnamease Admin</>,
  _: [
    { href: '/admin/', title: 'Main' },
    { href: '/admin/usage', title: 'Usage' },
  ],
  __: [{ href: '/', title: <>{'\u2190'} Vietnamease</> }],
}

function SiteNav(): JSX.Element {
  return <PageNav nav={navMap} />
}

function RootLayout({ children }: RequiredChildren) {
  return (
    <Html config={config} className={inter.className}>
      <Body>
        <main>{children}</main>
      </Body>
    </Html>
  )
}

export default RootLayout
