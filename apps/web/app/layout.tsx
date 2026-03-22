import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'TextileAI — AI-Powered Textile Design',
    template: '%s | TextileAI',
  },
  description:
    'Generate stunning textile and fabric patterns with AI. Create unique designs for fashion, interior design, and more.',
  keywords: ['textile design', 'AI design', 'fabric patterns', 'generative art', 'fashion design'],
  authors: [{ name: 'TextileAI' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'TextileAI — AI-Powered Textile Design',
    description: 'Generate stunning textile and fabric patterns with AI.',
    siteName: 'TextileAI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
