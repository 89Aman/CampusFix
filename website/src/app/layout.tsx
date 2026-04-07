import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'CampusFix - Smart Campus Maintenance & Safety Platform',
  description: 'Next-generation platform for streamlined campus facility management and enhanced student safety. Real-time issue reporting, tracking, and emergency tools.',
  keywords: ['campus management', 'student safety', 'maintenance reporting', 'facility management', 'emergency tools'],
  authors: [{ name: 'CampusFix Team' }],
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'CampusFix - Smart Campus Maintenance & Safety Platform',
    description: 'Streamline campus facility management and enhance student safety with real-time reporting and emergency tools.',
    url: 'https://campusfix.vercel.app',
    siteName: 'CampusFix',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampusFix - Smart Campus Maintenance & Safety Platform',
    description: 'Streamline campus facility management and enhance student safety.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-primary-950 text-primary-50 antialiased">
        {children}
      </body>
    </html>
  )
}
