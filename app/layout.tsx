import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'RisesSystem - Gym Management',
  description: 'Professional gym management SaaS for members, sales, and operations',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#a3e635',
}

type RootLayoutProps = {
  children: React.ReactNode
  params?: Promise<{ locale?: string }>
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const resolvedParams = params ? await params : { locale: 'en' }
  const locale = resolvedParams.locale ?? 'en'
  
  return (
    <html lang={locale} className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">{children}</body>
    </html>
  )
}
