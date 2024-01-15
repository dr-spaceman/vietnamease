import { Html, Body, Button } from 'matterial'
import Link from 'next/link'
import generatePageData from '@/utils/generate-page-data'
import './globals.css'

const config = {
  appTitle: 'Vietnamease App',
  linkComponent: Link,
}

export const { metadata, viewport } = generatePageData()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Html config={config}>
      <Body>{children}</Body>
    </Html>
  )
}
