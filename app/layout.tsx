import { Html, Body, Button, Icon, TextInput, Link } from 'matterial'
import NextLink from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

import generatePageData from '@/utils/generate-page-data'
import './globals.css'

const config = {
  appTitle: 'Vietnamease App',
  linkComponent: NextLink,
}

export const { metadata, viewport } = generatePageData()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        {children}
      </Body>
    </Html>
  )
}
