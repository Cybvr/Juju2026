import React from "react"
import type { Metadata } from 'next'
import { Outfit, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Toaster } from "sonner"
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { PwaRegister } from "@/components/pwa-register"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});
const _playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://juju.app'),
  title: 'Juju - AI Cartoon Video Generation',
  description: 'Create epic cartoon videos with just a script. AI-powered storytelling for creators and agencies.',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  applicationName: 'Juju',
  appleWebApp: {
    capable: true,
    title: 'Juju',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
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
      {
        url: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
  themeColor: '#09090b',
}

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" />
          <Analytics />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}
