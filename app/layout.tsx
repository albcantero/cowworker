import type { Metadata } from 'next'
import { Nunito, Sono, Fredoka } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
})

const sono = Sono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: 'cowworker.',
  description: 'Your friendly bovine accountability partner. No login, no database — just open and focus.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body className={`${nunito.variable} ${sono.variable} ${fredoka.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}