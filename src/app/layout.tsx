import { Html, Body } from 'matterial'
import generatePageData from '@/utils/generate-page-data'
import './globals.css'

export const { metadata, viewport } = generatePageData()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Html>
      <Body>{children}</Body>
    </Html>
  )
}
