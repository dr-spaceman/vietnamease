import { Html, Body, Button } from 'matterial'
import Link from 'next/link'
import generatePageData from '@/utils/generate-page-data'
import './globals.css'

const config = {
  appTitle: 'Vietnamese App',
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
      <Body>
        <nav>
          <Button variant="outlined">Sign In</Button>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/d">Definition</Link>
            </li>
          </ul>
        </nav>
        {children}
      </Body>
    </Html>
  )
}
