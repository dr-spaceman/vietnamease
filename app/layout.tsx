import { Html, Body, Alert } from 'matterial'
import type { Metadata, Viewport } from 'next'
import NextLink from 'next/link'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

import Footer from './footer'
import { decryptSession } from '@/lib/session'
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

const APP_NAME = 'Vietnamease'
const APP_DEFAULT_TITLE = 'Vietnamease App - Your copilot to learn Vietnamese'
const APP_TITLE_TEMPLATE = '%s - PWA App'
const APP_DESCRIPTION =
  'Learn Vietnamese with an AI copilot. Translate words, phrases, and sentences between English and Vietnamese. Practice with flashcards and quizzes. Get help with grammar and pronunciation. Chat with a fluent computer language partner. Get bespoke language learning resources based on your own personal interests and goals. All powered by AI.'

const metadata_: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
}

const viewport_: Viewport = {
  themeColor: '#FFFFFF',
}

export const { metadata, viewport } = generatePageData({
  metadata: metadata_,
  viewport: viewport_,
})

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
        {cookies().has('loginError') && (
          <Alert severity="error">{cookies().get('loginError')?.value}</Alert>
        )}
        <main>{children}</main>
        <Footer />
      </Body>
    </Html>
  )
}
