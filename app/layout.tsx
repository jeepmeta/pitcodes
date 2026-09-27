import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pit.codes'),
  title: {
    default: 'PIT.CODES — OBD Codes & Dashboard Warning Lights',
    template: '%s | PIT.CODES',
  },
  description:
    'Look up OBD-II trouble codes and dashboard warning lights fast. Causes, fixes, related codes, and practical next steps — mobile-first.',
  applicationName: 'PIT.CODES',
  openGraph: {
    type: 'website',
    siteName: 'PIT.CODES',
    title: 'PIT.CODES — OBD Codes & Dashboard Warning Lights',
    description:
      'Fast OBD-II and dash light lookup. Accurate info without the noise.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PIT.CODES',
    description: 'OBD codes and dashboard warning lights, explained clearly.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
